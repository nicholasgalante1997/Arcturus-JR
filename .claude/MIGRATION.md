# Migration Guide: Amazon Q CLI → Claude Code CLI

This document guides the transition from Amazon Q CLI to Claude Code CLI while preserving all project conventions and best practices.

## Quick Start

### Installation

```bash
npm install -g @anthropic-ai/claude-code
claude login
```

### Starting Development

```bash
# Instead of: q chat --agent bun-typescript-react
claude --agent bun-typescript-react

# Instead of: q chat --trust-all-tools
claude --dangerously-skip-permissions
```

## Command Mapping

| Task | Amazon Q | Claude Code |
|------|----------|------------|
| Start chat | `q chat` | `claude` |
| Use agent | `q chat --agent name` | `claude --agent name` |
| Headless mode | `q chat --no-interactive "prompt"` | `claude -p "prompt"` |
| Trust all tools | `q chat --trust-all-tools` | `claude --dangerously-skip-permissions` |
| Resume session | `q chat --resume` | `claude --resume` |
| View context | `/context show` | `/context show` |
| Add context | `/context add file` | `/context add file` |
| Compact history | `/compact` | `/compact` |
| View usage | N/A | `/usage` |

## Configuration Structure

### Old Structure (.amazonq/)

```
.amazonq/
├── cli-agents/
│   ├── bun-typescript-react-agent.json
│   └── prompts/
│       └── bun-typescript-react-agent.md
├── rules/
│   ├── standards/
│   ├── frontend/
│   ├── architecture/
│   └── ...
└── mcp.json
```

### New Structure (.claude/)

```
.claude/
├── CLAUDE.md              # Merged project context
├── agents/
│   ├── bun-typescript-react.md
│   └── void-design-system.md
├── skills/
│   ├── react-19-patterns/SKILL.md
│   ├── tanstack-query-ssr/SKILL.md
│   └── component-composition/SKILL.md
├── commands/              # Custom slash commands (future)
├── settings.json          # Permissions and hooks
└── mcp.json              # MCP server configuration
```

## Key Differences

### Context Management

**Amazon Q**: Persistent context via JSON agent resources
```json
{
  "resources": ["file://.amazonq/rules/**/*.md"]
}
```

**Claude Code**: Automatic CLAUDE.md loading + Skills system
- `.claude/CLAUDE.md` loads automatically
- Skills load on-demand based on relevance
- More efficient context usage

### Agent Definition

**Amazon Q**: JSON configuration with tools array
```json
{
  "name": "bun-typescript-react",
  "tools": ["fs_read", "fs_write", "execute_bash"],
  "allowedTools": ["fs_read"]
}
```

**Claude Code**: Markdown with YAML frontmatter
```yaml
---
name: bun-typescript-react
tools:
  - Read
  - Write
  - Bash
model: claude-opus-4-1
---
```

### Permissions

**Amazon Q**: File-based allowedPaths/deniedPaths
```json
{
  "toolsSettings": {
    "fs_write": {
      "allowedPaths": ["src/**/*.ts"]
    }
  }
}
```

**Claude Code**: Pattern matching in settings.json
```json
{
  "rules": [
    {
      "tool": "Write",
      "pattern": "src/**/*.{ts,tsx}",
      "allow": true
    }
  ]
}
```

### Hooks

**Amazon Q**: Limited hook support
```json
{
  "hooks": {
    "agentSpawn": [{"command": "git branch --show-current"}]
  }
}
```

**Claude Code**: 8 lifecycle events
```json
{
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "UserPromptSubmit": [...],
    "SessionStart": [...]
  }
}
```

## Workflow Patterns

### Development Session

**Amazon Q:**
```bash
q chat --agent bun-typescript-react --resume
# Within chat:
# /context add src/components/Button/Component.tsx
# /usage
# /compact
```

**Claude Code:**
```bash
claude --agent bun-typescript-react --resume
# Within chat:
# /context add src/components/Button/Component.tsx
# /usage
# /compact
```

### Headless Automation

**Amazon Q:**
```bash
q chat --no-interactive --trust-all-tools "Review this code"
```

**Claude Code:**
```bash
claude -p "Review this code" --dangerously-skip-permissions
```

### Code Review

**Amazon Q:**
```bash
git diff | q chat --no-interactive "Review for security issues"
```

**Claude Code:**
```bash
git diff | claude -p "Review for security issues"
```

## Slash Commands

Claude Code supports custom slash commands in `.claude/commands/`. Create markdown files with YAML frontmatter:

```yaml
---
allowed-tools: Read,Write,Bash
description: Review code for security issues
---

1. Analyze the code for security vulnerabilities
2. Check for proper input validation
3. Verify error handling
4. Suggest improvements
```

## Skills System

Skills are modular capabilities that load on-demand. Arc-Jr includes:

- **react-19-patterns**: React 19 SSR, Suspense, use() API
- **tanstack-query-ssr**: TanStack Query prefetching and dehydration
- **component-composition**: Container/View patterns and pipeline composition

Skills activate automatically based on relevance. No manual invocation needed.

## MCP Servers

MCP configuration remains the same. Copy `.amazonq/mcp.json` to `.claude/mcp.json`:

```bash
cp .amazonq/mcp.json .claude/mcp.json
```

Claude Code has superior MCP support with stdio, HTTP, SSE, and SDK transports.

## Agents

Three specialized agents are available:

### bun-typescript-react
For React 19 development with TypeScript, SSR, and TanStack Query.

```bash
claude --agent bun-typescript-react
```

### void-design-system
For Void Design System component development.

```bash
claude --agent void-design-system
```

### Default Agent
General-purpose agent with full capabilities.

```bash
claude
```

## Permissions

Claude Code uses pattern matching for granular control:

```json
{
  "rules": [
    {
      "tool": "Read",
      "pattern": "src/**/*.{ts,tsx}",
      "allow": true
    },
    {
      "tool": "Write",
      "pattern": "node_modules/**",
      "deny": true
    },
    {
      "tool": "Bash",
      "pattern": "rm -rf *",
      "deny": true
    }
  ]
}
```

## Hooks for Automation

Use hooks for deterministic workflow control:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(src/**/*.{ts,tsx})",
        "type": "command",
        "command": "bun run lint --fix $FILE",
        "timeout": 10000,
        "async": true
      }
    ]
  }
}
```

## Troubleshooting

### Context Not Loading

Verify `.claude/CLAUDE.md` exists and is properly formatted:

```bash
ls -la .claude/CLAUDE.md
```

### Agent Not Found

Check agent file exists in `.claude/agents/`:

```bash
ls -la .claude/agents/
```

### Permissions Not Working

Verify pattern syntax in `.claude/settings.json`:

```bash
cat .claude/settings.json | jq '.rules'
```

### Skills Not Activating

Skills activate based on relevance. Verify skill description matches your task:

```bash
ls -la .claude/skills/*/SKILL.md
```

## Best Practices

1. **Use agents for specialization** - Different agents for different tasks
2. **Leverage skills** - They load automatically when relevant
3. **Set up hooks** - Automate formatting and validation
4. **Use pattern matching** - More flexible than file-based permissions
5. **Keep CLAUDE.md updated** - It's your project memory
6. **Test permissions** - Verify rules work as expected
7. **Monitor context usage** - Use `/usage` to stay aware

## Next Steps

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Authenticate: `claude login`
3. Start development: `claude --agent bun-typescript-react`
4. Explore skills: They'll activate automatically
5. Create custom commands: Add to `.claude/commands/`
6. Set up hooks: Configure in `.claude/settings.json`

## Support

For issues or questions:
- Check Claude Code docs: https://code.claude.com/docs
- Review `.claude/CLAUDE.md` for project context
- Consult skills for domain-specific patterns
- Use `/help` within Claude Code for available commands
