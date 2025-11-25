# Executive Summary for Automated Migration

Purpose: This document enables AI models to automatically migrate Spec-Driven Development (SDD) workflows from Amazon Q CLI to Claude Code CLI, preserving functionality while leveraging Claude Code's superior capabilities.

## Key Differences

Amazon Q uses JSON configurations → Claude Code uses markdown-first approach
Q's agent definitions → Claude's subagents with richer context
Q's context files → Claude's CLAUDE.md and Skills system
Q's MCP support (basic) → Claude's comprehensive MCP ecosystem
Q's hooks (limited) → Claude's 8-stage lifecycle hooks
Q's permissions (file-based) → Claude's granular pattern matching

> Migration Complexity: Medium - Most concepts translate directly with syntax changes

## Part 1: Platform Comparison Matrix

### Core Architecture Differences:

#### Configuration Format

Amazon Q: JSON files with nested structures
Claude Code: Markdown files with YAML frontmatter

**Migration Path**:

Convert JSON to markdown templates

#### Context Management

Amazon Q: Persistent context via JSON, Memory Banking
Claude Code: CLAUDE.md hierarchical loading, Skills system

**Migration Path**

Transform context files to CLAUDE.md

#### Agent Definition

Amazon Q: JSON agents with tools array
Claude Code: Markdown subagents with system prompts

**Migration Path**:

Convert agent JSON to markdown subagents

#### Custom Commands

Amazon Q: JSON Command Definitions
Claude Code: Markdown slash commands in .claude/commands/

**Migration Path**:

Translate JSON commands to markdown format, create markdown commands where none exist today

#### Project Rules

Amazon Q: Markdown rules in .amazonq/rules/
Claude Code: Integrated into CLAUDE.md or settings.json

**Migration Path**:

Merge rules into CLAUDE.md

#### MCP Servers

Amazon Q: Legacy mcp server json
Claude Code: Full stdio, HTTP, SSE, SDK support

**Migration Path**:

None, at the moment.

#### Lifecycle Hooks

Amazon Q: Limited hook support, specific to tool
Claude Code: 8 comprehensive lifecycle events

### Tool Mapping

    tool_mapping = {
        'fs_read': 'Read',
        'fs_write': 'Write',
        'execute_bash': 'Bash',
        'use_aws': 'WebSearch',  # Note: AWS integration via MCP
        'file_read': 'Read',
        'file_write': 'Write',
        'run_command': 'Bash',
        'search': 'Grep',
        'list_files': 'Glob'
    }

### Spec Driven Development Workflows

MIGRATION_NOTE: Core SDD Workflow Differences

Amazon Q SDD Workflow:

1. Create specs in markdown → Load via resources in JSON
2. Define agents in JSON → Reference specs
3. Use Memory Banking → Persistent context across sessions
4. Execute with q chat → Interactive development
5. Validate with rules → Markdown-based checks

Claude Code SDD Workflow:

1. Create specs in markdown → Auto-load via CLAUDE.md
2. Define subagents in markdown → System prompts reference specs
3. Use CLAUDE.md + Skills → Richer persistent context
4. Execute with claude → Enhanced interaction modes
5. Validate with hooks + rules → Programmatic enforcement

## Feature Comparison Quick Reference

| Task | Amazon Q Command | Claude Code Command |
|------|-----------------|-------------------|
| Start chat | `q chat` | `claude` |
| Use agent | `q chat --agent name` | `claude --agent name` |
| Headless | `q chat --no-interactive "prompt"` | `claude -p "prompt"` |
| Trust all | `q chat --trust-all-tools` | `claude --dangerously-skip-permissions` |
| Add context | Within chat: N/A | Within chat: `/context add file` |
| View usage | N/A | Within chat: `/usage` |
| Compact | N/A | Within chat: `/compact` |

## Command Translation Map

MIGRATION_NOTE: Command Syntax Translation

Amazon Q: q chat --agent payment-dev
Claude Code: claude --agent payment-dev

Amazon Q: q chat --trust-all-tools
Claude Code: claude --dangerously-skip-permissions

Amazon Q: q chat --no-interactive "prompt"
Claude Code: claude -p "prompt"

Amazon Q: q context add file.py
Claude Code: /context add file.py (within session)
Context System Comparison

AUTOMATION_PATTERN: Context Migration

## Context File Locations

### Amazon Q Context Structure

.amazonq/
├── context/
│   ├── project-introduction.md
│   └── project-milestones.md
├── cli-agents/
│   └── payment-dev.json
└── rules/
    └── standards.md

### Claude Code Equivalent

.claude/
├── CLAUDE.md (merged from context/)
├── agents/
│   └── payment-dev.md (converted from JSON)
├── commands/
│   └── (custom slash commands)
├── skills/
│   └── (new capability system)
└── settings.json (permissions, hooks)