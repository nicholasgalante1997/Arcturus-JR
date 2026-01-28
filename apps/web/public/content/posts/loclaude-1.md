---
slug: "loclaude-prerelease"
visible: true
title: "loclaude: Running Claude Code with Local Ollama Models"
---

I've been working on a CLI tool called `loclaude` that lets you run Claude Code against local Ollama models instead of burning through Anthropic API usage limits. It's in prerelease now, and I wanted to walk through what it does, how to use it, and how it's built.

## The Problem

Claude Code is genuinely useful for agentic coding workflows. The issue is that you hit usage limits fast, and once you're rate-limited, you're stuck waiting. If you're iterating on something complex, that interruption kills momentum.

The other issue is privacy. Some codebases shouldn't leave your machine. Period.

## What loclaude Does

loclaude is a bridge between Claude Code and Ollama. It:

1. Manages Docker containers for Ollama and Open WebUI
2. Handles model selection and loading
3. Configures environment variables so Claude Code talks to your local Ollama instance instead of Anthropic's API

The result is that you can run `loclaude run` and get the same Claude Code interface, but inference happens locally on your hardware.

```bash
loclaude run
```

That's it. You get an interactive model picker, loclaude ensures the model is loaded into memory, and then it spawns Claude Code with the right environment configuration.

## Installation

```bash
# npm
npm install -g loclaude

# bun (recommended)
bun install -g loclaude
```

You'll also need:

- Docker with Compose v2
- Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)
- Ollama v0.14.2 or higher (loclaude can manage this via Docker for you)

Optional but recommended:

- NVIDIA GPU with 16GB+ VRAM
- NVIDIA Container Toolkit

CPU-only mode works, but you'll want smaller models and patience.

## Getting Started

### Project Setup

```bash
mkdir my-project
cd my-project
loclaude init
```

This scaffolds:

```
.
├── .claude/
│   └── CLAUDE.md
├── .loclaude/
│   └── config.json
├── models/
├── docker-compose.yml
├── mise.toml
└── .gitignore
```

The `init` command auto-detects GPU availability and generates the appropriate Docker Compose configuration. Use `--no-gpu` to force CPU mode.

### Start the Stack

```bash
loclaude docker-up
```

This spins up Ollama and Open WebUI containers. Ollama exposes its API on `localhost:11434`, Open WebUI on `localhost:3000`.

### Pull a Model

```bash
# GPU with 16GB+ VRAM
loclaude models-pull qwen3-coder:30b

# CPU or limited VRAM
loclaude models-pull qwen2.5-coder:7b
```

### Run Claude Code

```bash
loclaude run
```

You'll get an interactive picker showing installed models. Models marked `[loaded]` are already in memory and will respond immediately.

To skip the picker:

```bash
loclaude run -m qwen3-coder:30b
```

## Configuration

loclaude uses a layered configuration system. Priority order:

1. CLI arguments
2. Environment variables
3. Project config (`./.loclaude/config.json`)
4. User config (`~/.config/loclaude/config.json`)
5. Defaults

### Config File

```json
{
  "ollama": {
    "url": "http://localhost:11434",
    "defaultModel": "qwen3-coder:30b"
  },
  "docker": {
    "composeFile": "./docker-compose.yml",
    "gpu": true
  },
  "claude": {
    "extraArgs": ["--verbose"]
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_URL` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Default model | `qwen3-coder:30b` |
| `LOCLAUDE_COMPOSE_FILE` | Path to docker-compose.yml | `./docker-compose.yml` |
| `LOCLAUDE_GPU` | Enable GPU | `true` |

## Common Usage Patterns

### Daily Workflow

```bash
# Start your day
loclaude docker-up

# Work on your project
loclaude run

# Done for the day
loclaude docker-down
```

### Switching Models Mid-Session

If you're working on something that needs a larger model:

```bash
loclaude models-pull deepseek-coder:33b
loclaude run -m deepseek-coder:33b
```

### Using with mise

The `init` command generates a `mise.toml` with task aliases:

```bash
mise run up        # loclaude docker-up
mise run down      # loclaude docker-down
mise run claude    # loclaude run
mise run pull qwen3-coder:30b
mise run doctor    # Check system health
```

### Remote Ollama

If you have Ollama running on another machine:

```bash
export OLLAMA_URL="http://192.168.1.100:11434"
loclaude run
```

Or in config:

```json
{
  "ollama": {
    "url": "http://192.168.1.100:11434"
  }
}
```

## loclaude Cookbook

### Recipe: Quick Diagnostic

Something not working? Start here.

```bash
loclaude doctor
```

This checks Docker, Compose, GPU availability, NVIDIA Container Toolkit, Claude Code installation, and Ollama connectivity. It'll tell you what's broken.

### Recipe: Model Warmup for Fast Sessions

Models take a few seconds to load into memory. loclaude handles this automatically when you run `loclaude run`, but if you want to pre-warm:

```bash
# This loads the model with a 10-minute keep-alive
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen3-coder:30b", "prompt": "", "keep_alive": "10m"}'
```

### Recipe: CPU-Only Setup

No GPU? No problem.

```bash
loclaude init --no-gpu
loclaude docker-up
loclaude models-pull qwen2.5-coder:7b
loclaude run
```

Expect ~10-20 tokens/sec. Use smaller models. `llama3.2:3b` is fast if you need quick iterations.

### Recipe: Disk Space Management

Models are big. Check what you have:

```bash
loclaude models
du -sh models/
```

Remove what you don't need:

```bash
loclaude models-rm old-model:tag
```

### Recipe: Container Debugging

Containers misbehaving?

```bash
# Check status
loclaude docker-status

# Follow logs
loclaude docker-logs --follow

# Logs for specific service
loclaude docker-logs -s ollama

# Nuclear option
loclaude docker-down && loclaude docker-up
```

### Recipe: Passing Arguments to Claude Code

Everything after `--` goes to Claude Code:

```bash
loclaude run -- --help
loclaude run -- --verbose
loclaude run -- "explain this codebase"
```

## Technical Structure

loclaude is a monorepo with two packages:

1. `loclaude` - The published npm package (thin wrapper)
2. `@loclaude-internal/cli` - The actual CLI implementation

### Why the Split?

The CLI package (`@loclaude-internal/cli`) contains all the logic. The main `loclaude` package just re-exports it. This separation keeps the published package small and allows for internal iteration without bumping the public version.

### Dual Runtime Support

loclaude works with both Bun and Node.js. The entry points:

```
bin/
├── index.ts   # Bun entry point
└── index.mjs  # Node.js entry point
```

Both import from `@loclaude-internal/cli` and call `run_cli()`.

The CLI package builds two bundles:

```typescript
// build/bun.ts
export const bun_config: typeof base_config = {
  ...base_config,
  target: 'bun',
  naming: { entry: 'index.bun.js' }
};

// build/node.ts
export const node_config: typeof base_config = {
  ...base_config,
  target: 'node',
  naming: { entry: 'index.js' }
};
```

### CLI Structure

The CLI uses `cac` for command parsing. Commands are organized in `libs/cli/lib/commands/`:

```
commands/
├── config.ts   # config, config-paths
├── docker.ts   # docker-up, docker-down, docker-status, docker-logs, docker-restart
├── doctor.ts   # System health checks
├── init.ts     # Project scaffolding
├── models.ts   # models, models-pull, models-rm, models-show, models-run
└── index.ts    # Re-exports
```

### Configuration System

Configuration loading happens in `libs/cli/lib/config.ts`. The `loadConfig()` function:

1. Loads user config from `~/.config/loclaude/config.json`
2. Loads project config from `./.loclaude/config.json`
3. Deep merges them (project overrides user)
4. Overlays environment variables
5. Fills in defaults

```typescript
export function loadConfig(): LoclaudeConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const fileConfig = loadConfigFiles();
  const envConfig = loadEnvConfig();
  const merged = deepMerge(fileConfig, envConfig);
  cachedConfig = mergeWithDefaults(merged);

  return cachedConfig;
}
```

### Spawn Utilities

Cross-runtime process spawning is handled in `libs/cli/lib/spawn.ts`. It detects the runtime and uses the appropriate API:

```typescript
export async function spawn(cmd: string[], opts: SpawnOptions = {}): Promise<number> {
  if (typeof Bun !== 'undefined') {
    const proc = Bun.spawn(cmd, { /* ... */ });
    return proc.exited;
  } else {
    const { spawn: nodeSpawn } = await import('child_process');
    return new Promise((resolve) => {
      const proc = nodeSpawn(cmd[0], cmd.slice(1), { /* ... */ });
      proc.on('close', (code) => resolve(code ?? 1));
    });
  }
}
```

### Model Loading

When you run `loclaude run`, it doesn't just spawn Claude Code. It first ensures your model is loaded:

```typescript
export async function ensureModelLoaded(modelName: string): Promise<void> {
  const isLoaded = await isModelLoaded(modelName);

  if (isLoaded) {
    console.log(dim(`  Model ${magenta(modelName)} is already loaded`));
    return;
  }

  console.log(info(`Loading model ${magenta(modelName)}...`));

  try {
    await loadModel(modelName, '10m');
    console.log(success(`Model ${magenta(modelName)} loaded (keep_alive: 10m)`));
  } catch (error) {
    console.log(warn(`Could not pre-load model (will load on first request)`));
  }
}
```

This sends an empty prompt to Ollama with a 10-minute keep-alive, which loads the model into memory. Subsequent Claude Code requests hit a warm model.

### Docker Compose Bundling

loclaude ships with a bundled `docker-compose.yml` as a fallback. If no local compose file exists, it uses the packaged one:

```typescript
function findComposeFile(): string | null {
  // Check config, then search workspace
  // ...

  // Fallback to bundled compose file
  const backup = path.resolve(
    fileURLToPath(import.meta.url), 
    '..', 'docker', 'docker-compose.yml'
  );

  if (existsSync(backup)) {
    return backup;
  }

  return null;
}
```

## Model Recommendations

### GPU (16GB+ VRAM)

| Model | Size | Notes |
|-------|------|-------|
| `qwen3-coder:30b` | ~17GB | Best balance of speed and quality |
| `deepseek-coder:33b` | ~18GB | Strong code understanding |

### CPU or Limited VRAM

| Model | Size | Notes |
|-------|------|-------|
| `qwen2.5-coder:7b` | ~4GB | Good coding performance |
| `llama3.2:3b` | ~2GB | Fast, simpler tasks |

## Quality Expectations

Let's be direct: local models aren't Claude. A 30B parameter model is roughly comparable to GPT-3.5 for coding tasks. It works for most refactoring, debugging, and code generation. Complex architectural reasoning or nuanced code review will be weaker.

The trade-off is unlimited usage, complete privacy, and zero API costs. Use Claude API for critical work. Use loclaude for everything else.

## What's Next

The roadmap includes:

- Ollama version compatibility checks (done in 0.0.2)
- Better error handling for common failure modes
- Support for additional model providers

If you hit issues or want to contribute, the repo is at [github.com/nicholasgalante1997/loclaude](https://github.com/nicholasgalante1997/loclaude). Documentation lives at [nicholasgalante1997.github.io/loclaude](https://nicholasgalante1997.github.io/loclaude/#/).

```bash
npm install -g loclaude
loclaude doctor
```

That's loclaude. Local models, no rate limits, your hardware, your data.