# Claude Code Quick Reference

## Starting Claude Code

```bash
# Default agent
claude

# Specialized agents
claude --agent bun-typescript-react
claude --agent void-design-system

# Resume previous session
claude --resume

# Headless mode
claude -p "Review this code"
```

## Essential Commands (within Claude Code)

| Command | Purpose |
|---------|---------|
| `/usage` | View context window consumption |
| `/compact` | Summarize conversation history |
| `/context add file` | Add file to context |
| `/context show` | View current context |
| `/context clear` | Clear session context |
| `/help` | List available commands |
| `/save name` | Save conversation |
| `/load name` | Load saved conversation |

## Project Structure

```
.claude/
├── CLAUDE.md              # Project context (auto-loaded)
├── agents/                # Specialized subagents
├── skills/                # Modular capabilities
├── settings.json          # Permissions & hooks
├── mcp.json              # MCP servers
├── MIGRATION.md          # Amazon Q → Claude Code guide
└── README.md             # This directory
```

## Common Tasks

### Create a React Component

```bash
claude --agent bun-typescript-react
# "Create a Button component with TypeScript props"
```

### Add a New Route

```bash
claude --agent bun-typescript-react
# "Add /projects route with prerendering and TanStack Query"
```

### Implement Data Fetching

```bash
claude --agent bun-typescript-react
# "Create useProjects hook with prefetching"
```

### Design System Work

```bash
claude --agent void-design-system
# "Create a Card component with design tokens"
```

### Code Review

```bash
git diff | claude -p "Review for security issues"
```

## Key Conventions

### Component Structure
```
ComponentName/
├── index.ts
├── Component.tsx      # Container with hooks
├── View.tsx          # Presentational
├── types.ts          # TypeScript types
└── __tests__/
```

### Data Fetching Pattern
```typescript
// 1. Create service class
class PostsService { ... }

// 2. Export data function
export async function getPosts() { ... }

// 3. Create isomorphic hook
export function useGetPosts(): UseQueryResult<Post[], Error> { ... }

// 4. Add to page config in scripts/lib/pages.ts
{ queryKey: ['posts'], queryFn: () => getPosts() }
```

### Component Pattern
```typescript
// Container - handles data
function Home() {
  const posts = useGetPosts();
  return (
    <SuspenseEnabledQueryProvider>
      <HomeView queries={[posts]} />
    </SuspenseEnabledQueryProvider>
  );
}

// View - pure presentation
function HomeView({ queries }) {
  const [_posts] = queries;
  const posts = use(_posts.promise);
  return <PostsList posts={posts} />;
}
```

## Critical Requirements

### Prerendering
- **ALWAYS** prefetch every query during prerender
- Missing one query causes prerender to hang indefinitely
- Add all queries to `scripts/lib/pages.ts`

### Styling
- **NEVER** import CSS in TypeScript files
- Use vanilla CSS with design tokens
- Reference styles in page configuration

### TypeScript
- **ALWAYS** use strict mode
- **NEVER** use `any` type
- Type all function parameters and returns

## Permissions

Default permissions:
- ✅ Read: Source files, configs, markdown
- ✅ Write: Source code, tests, configuration
- ✅ Bash: bun, npm, git commands
- ❌ Deny: node_modules, .env files, dangerous commands

Modify in `.claude/settings.json`

## Agents

| Agent | Best For | Skills |
|-------|----------|--------|
| bun-typescript-react | React development | React 19, TanStack Query, Components |
| void-design-system | Design system | Design tokens, Components, Storybook |
| default | General tasks | All capabilities |

## Skills (Auto-Loading)

| Skill | Activates For |
|-------|---------------|
| react-19-patterns | React components, SSR, Suspense |
| tanstack-query-ssr | Data fetching, queries, prefetching |
| component-composition | Component creation, composition |

## Build Commands

```bash
# Development
bun run dev              # Start dev server

# Production
bun run build            # Full build with prerendering
bun run serve            # Serve production build

# Quality
bun run lint             # Lint code
bun run fmt              # Format code
bun test                 # Run tests

# Analysis
bun run bundle:analyze   # Analyze bundle size
bun run storybook        # Component development
```

## Troubleshooting

### Prerender Hanging
- Check all queries are in page config
- Verify query keys match between prefetch and hook
- Look for unresolved promises

### Context Issues
- Use `/usage` to check consumption
- Use `/compact` to summarize history
- Use `/context clear` to reset

### Permission Denied
- Check pattern in settings.json
- Verify tool name is correct
- Review allow/deny rules

### Agent Not Found
- Verify agent file exists in `.claude/agents/`
- Check agent name spelling
- Ensure YAML frontmatter is valid

## Tips & Tricks

1. **Use `/compact`** in long sessions to reduce context
2. **Check `/usage`** regularly to stay aware
3. **Save conversations** with `/save` for reference
4. **Use headless mode** for automation and CI/CD
5. **Leverage skills** - they activate automatically
6. **Review CLAUDE.md** for project context
7. **Check agents** for specialized expertise

## Resources

- **CLAUDE.md** - Full project context
- **MIGRATION.md** - Amazon Q → Claude Code guide
- **agents/** - Specialized subagents
- **skills/** - Domain expertise modules
- **settings.json** - Permissions and hooks
- **README.md** - Detailed documentation

## Quick Links

- [Claude Code Docs](https://code.claude.com/docs)
- [Project README](../README.md)
- [Build System Rules](./../.amazonq/rules/standards/build-system.md)
- [Component Patterns](./../.amazonq/rules/frontend/component-patterns.md)
- [TanStack Query Rules](./../.amazonq/rules/data/tanstack-query.md)
