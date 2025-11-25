# Migration Plan: Amazon Q CLI → Claude Code CLI

### Phase 1: Context & Rules Migration (Foundation)

Step 1: Create .claude/CLAUDE.md hierarchy
• Merge .amazonq/rules/**/*.md into structured .claude/CLAUDE.md
• Structure: Project Overview → Architecture → Development Standards → Technical Decisions → Common Operations
• Keep rule IDs for traceability (e.g., (ID: MODULAR_CONFIG))

Step 2: Create .claude/skills/ for domain expertise
• Convert specialized rules into Skills (e.g., void-design-system.md → .claude/skills/void-design/SKILL.md)
• Each skill gets YAML frontmatter with name, description, activation triggers
• Include /scripts subdirectories for executable code patterns

Step 3: Migrate MCP servers
• Convert .amazonq/mcp.json → .claude/mcp.json (same format supported)
• No changes needed; Claude Code has superior MCP support

### Phase 2: Agent & Command Migration

Step 4: Convert custom agents to subagents
• Transform .amazonq/cli-agents/*.json → .claude/agents/*.md
• Convert JSON tools array → markdown system prompt with tool references
• Convert toolsSettings → settings.json pattern matching rules

Step 5: Create slash commands
• Convert any custom workflows → .claude/commands/*.md
• Format: YAML frontmatter (allowed-tools, description) + markdown instructions
• Use $ARGUMENTS for dynamic parameters

### Phase 3: Permission & Hook System

Step 6: Migrate permissions to .claude/settings.json
• Convert allowedPaths/deniedPaths → glob patterns in settings.json
• Convert allowedCommands/deniedCommands → regex patterns
• Set permission mode (default: ask, acceptEdits, plan, bypassPermissions)

Step 7: Add lifecycle hooks
• Create hooks for: PreToolUse (validation), PostToolUse (formatting), UserPromptSubmit (preprocessing)
• Use settings.json hooks array with matcher patterns
• Example: Auto-format after Write, run linters after Bash

### Phase 4: Validation & Testing

Step 8: Test subagent loading
• Verify .claude/CLAUDE.md loads correctly
• Test subagent activation with claude --agent name
• Validate MCP server connections

Step 9: Migrate session patterns
• Replace q chat --resume with claude --resume
• Test context persistence across sessions
• Verify /compact and /usage commands work

## Quick Mapping for Your Setup

| Amazon Q | Claude Code | Action |
|----------|------------|--------|
| .amazonq/rules/*.md | .claude/CLAUDE.md + .claude/skills/ | Merge + extract |
| .amazonq/cli-agents/*.json | .claude/agents/*.md | Convert to markdown |
| .amazonq/mcp.json | .claude/mcp.json | Copy as-is |
| Custom workflows | .claude/commands/*.md | Create slash commands |
| allowedTools | settings.json rules | Pattern matching |
| Hooks (limited) | settings.json hooks | 8 lifecycle events |
