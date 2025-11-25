# Claude Code Configuration

This directory contains Claude Code CLI configuration for Arc-Jr, establishing best practice conventions for spec-driven development with React 19, TypeScript, and TanStack Query.

## Structure

- **CLAUDE.md** - Project context and development standards (auto-loaded)
- **agents/** - Specialized subagents for different development contexts
- **skills/** - Modular capabilities that load on-demand
- **settings.json** - Permissions, hooks, and lifecycle configuration
- **mcp.json** - Model Context Protocol server configuration
- **MIGRATION.md** - Guide for transitioning from Amazon Q CLI

## Quick Start

### Start Development

```bash
# Default agent with full capabilities
claude

# Specialized agent for React development
claude --agent bun-typescript-react

# Specialized agent for design system work
claude --agent void-design-system

# Resume previous session
claude --resume
```

### Within Claude Code

```
/usage              # View context window usage
/compact            # Summarize conversation history
/context add file   # Add file to context
/context show       # View current context
/help               # List available commands
```

## Agents

### bun-typescript-react
Specialized for React 19 development with TypeScript, SSR, and TanStack Query.

**Best for:**
- Creating React components
- Implementing data fetching patterns
- Working with prerendering
- Building features with Suspense

**Includes:**
- React 19 patterns skill
- TanStack Query SSR skill
- Component composition skill

### void-design-system
Specialized for Void Design System component development.

**Best for:**
- Creating design system components
- Working with design tokens
- Building Storybook stories
- Implementing accessibility features

**Includes:**
- Void design tokens skill
- Component library patterns
- Storybook documentation

### Default Agent
General-purpose agent with full capabilities.

**Best for:**
- General development tasks
- Build system work
- Infrastructure and deployment
- Cross-cutting concerns

## Skills

Skills are modular capabilities that load automatically based on relevance.

### react-19-patterns
React 19 patterns including SSR, Suspense, use() API, and automatic JSX runtime.

**Activates for:** React component creation, SSR implementation, Suspense patterns

### tanstack-query-ssr
TanStack Query patterns for server-side rendering, prefetching, and isomorphic data fetching.

**Activates for:** Data fetching, query configuration, prefetching setup

### component-composition
Component composition patterns including Container/View separation and pipeline HOC composition.

**Activates for:** Component creation, composition patterns, TypeScript typing

## Configuration

### settings.json

Controls permissions and lifecycle hooks:

```json
{
  "permissionMode": "default",
  "rules": [
    {
      "tool": "Write",
      "pattern": "src/**/*.{ts,tsx}",
      "allow": true
    }
  ],
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(src/**/*.{ts,tsx})",
        "type": "command",
        "command": "bun run lint --fix $FILE",
        "async": true
      }
    ]
  }
}
```

### mcp.json

Model Context Protocol server configuration. Same format as Amazon Q.

## Project Context

CLAUDE.md contains:
- Project overview and goals
- Architecture documentation
- Development standards
- Technical decisions
- Common operations

This context loads automatically with every Claude Code session.

## Development Workflow

### Creating a New Component

```bash
claude --agent bun-typescript-react
# "Create a new Button component with TypeScript props interface"
```

Claude will:
1. Create component structure (Component.tsx, View.tsx, types.ts)
2. Implement Container/View pattern
3. Add TypeScript types
4. Create Storybook story
5. Add unit tests

### Adding a New Route

```bash
claude --agent bun-typescript-react
# "Add a new /projects route with prerendering"
```

Claude will:
1. Create page component
2. Add route to routes.tsx
3. Create page configuration with queries
4. Add route constants
5. Verify prerendering setup

### Implementing Data Fetching

```bash
claude --agent bun-typescript-react
# "Create a useProjects hook with TanStack Query prefetching"
```

Claude will:
1. Create service class
2. Implement isomorphic hook
3. Add prefetch configuration
4. Verify query keys match
5. Test prerendering

## Permissions

Default permissions allow:
- **Read**: All source files, configs, markdown
- **Write**: Source code, tests, configuration
- **Bash**: bun, npm, git commands
- **Deny**: node_modules, .env files, dangerous commands

Adjust in settings.json as needed.

## Hooks

Configured hooks:
- **PreToolUse**: Validation before file writes
- **PostToolUse**: Auto-formatting after writes

Add more hooks in settings.json for custom workflows.

## Best Practices

1. **Use specialized agents** - Different agents for different tasks
2. **Leverage skills** - They activate automatically
3. **Keep CLAUDE.md updated** - It's your project memory
4. **Review permissions** - Ensure they match your workflow
5. **Test prerendering** - Always verify `bun run build` completes
6. **Monitor context** - Use `/usage` to stay aware
7. **Compact regularly** - Use `/compact` in long sessions

## Troubleshooting

### Agent not loading
```bash
ls -la .claude/agents/
```

### Skills not activating
Skills activate based on relevance. Verify skill description matches your task.

### Permissions not working
Check pattern syntax in settings.json:
```bash
cat .claude/settings.json | jq '.rules'
```

### Context issues
Verify CLAUDE.md is properly formatted:
```bash
cat .claude/CLAUDE.md | head -20
```

## Migration from Amazon Q

See MIGRATION.md for detailed guide on transitioning from Amazon Q CLI.

Key differences:
- JSON agents → Markdown agents
- File-based permissions → Pattern matching
- Limited hooks → 8 lifecycle events
- Basic MCP → Full MCP support

## Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [CLAUDE.md](./CLAUDE.md) - Project context
- [MIGRATION.md](./MIGRATION.md) - Migration guide
- [Skills](./skills/) - Domain expertise modules
- [Agents](./agents/) - Specialized subagents

## Support

For issues or questions:
1. Check Claude Code docs
2. Review CLAUDE.md for project context
3. Consult relevant skill for domain patterns
4. Use `/help` within Claude Code
