# Claude Code CLI: Complete Reference for Spec-Driven Project Development

Claude Code represents a paradigm shift in AI-powered development, transforming terminals into collaborative coding environments where natural language drives sophisticated software engineering. This comprehensive reference reveals everything from foundational setup through advanced multi-agent orchestration, distilling months of research and real-world patterns into actionable knowledge. Unlike traditional AI assistants that operate in isolation, Claude Code integrates directly into your development workflow—understanding entire codebases, executing complex refactorings, managing version control, and orchestrating multi-file changes while maintaining architectural consistency.

The true power emerges from Claude Code's agent-first architecture: a sophisticated system that combines agentic search for dynamic context gathering, progressive tool execution with granular permissions, persistent context through CLAUDE.md files, extensible capabilities via MCP servers and Skills, and customizable behavior through subagents and hooks. This isn't just another coding assistant—it's a framework for building AI-powered development workflows that scale from simple scripts to enterprise systems.

## Quick Reference

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Customizing Claude Behavior](https://code.claude.com/docs/en/gitlab-ci-cd#customizing-claude’s-behavior)
- [Claude Code Docs](https://code.claude.com/docs)
- [Claude Code Settings Configuration](https://code.claude.com/docs/en/settings)

## Core philosophy and architecture

Claude Code operates on the principle of progressive autonomy with safety guardrails, balancing powerful capabilities with user control. The architecture centers on an agentic loop that mirrors human problem-solving: gathering context through file exploration and search, planning approaches using chain-of-thought reasoning, executing actions via tools and commands, verifying work through tests and validation, and iterating based on feedback until success. This loop executes within a sophisticated permission system that ensures safety while maintaining productivity.

The context management system represents Claude Code's foundation. Every interaction begins with loading relevant context from multiple sources: CLAUDE.md files providing project-specific knowledge, .claude/commands/ containing custom slash commands, .claude/agents/ housing specialized subagents, .claude/skills/ offering modular capabilities, and MCP servers exposing external integrations. This layered context architecture enables Claude to understand not just code syntax but project semantics, architectural decisions, and team conventions.

### Tools

Tools form the execution layer, each with specific capabilities and permission models. The Read tool explores codebases with gitignore-aware filtering. Write and Edit tools modify files with atomic operations. Bash executes shell commands with pattern-based restrictions. WebSearch and WebFetch gather external information. The Grep and Glob tools enable efficient codebase navigation. Each tool operates under a permission system that can allow, deny, or ask for specific operations, creating fine-grained control over Claude's capabilities.

### Skills

The Skills system introduces modular, reusable capabilities that extend Claude's expertise. Unlike tools which execute actions, Skills provide specialized knowledge and workflows that Claude loads dynamically based on relevance. A skill for Excel manipulation includes instructions for working with spreadsheets, Python scripts for complex operations, and templates for common tasks. Skills use progressive disclosure—Claude only loads the specific components needed for each task, optimizing context usage while maintaining comprehensive capabilities.

## Installation and authentication

Claude Code supports macOS, Linux, and Windows (via WSL2), with multiple installation methods optimizing for different workflows. The installation process establishes both the CLI tool and optional IDE extensions, creating a unified development environment. Authentication separates consumer plans (Pro/Max) from enterprise options (Team/Enterprise), each with different capabilities and billing models.

For macOS, npm provides the recommended installation path: `npm install -g @anthropic-ai/claude-code`. This global installation includes the CLI tool, bundled dependencies, shell integrations, and automatic updates. Alternatively, the direct installer from claude.ai/download offers a GUI-based setup with system integration. Homebrew support remains under development but may be available for certain distributions.

Linux installation varies by distribution and requirements. The npm method works universally: `npm install -g @anthropic-ai/claude-code`. For systems without npm, download the binary directly from Anthropic's CDN. Ubuntu and Debian users can use .deb packages when available. The installer script `curl -fsSL https://claude.ai/install.sh | bash` automates detection and installation for most Linux distributions. WSL2 users on Windows should install within the Linux subsystem rather than native Windows for full functionality.

Authentication depends on your subscription type. Pro and Max users authenticate via browser OAuth flow: run claude login, follow the browser prompt, authorize Claude Code access, and receive automatic token refresh. The authentication persists across sessions with tokens stored in ~/.claude/credentials. Team and Enterprise users may use SSO authentication configured by their organization. API key authentication provides an alternative: set ANTHROPIC_API_KEY environment variable for headless environments or CI/CD pipelines.

Initial configuration establishes your development environment. Run claude doctor to verify installation integrity, shell integration status, authentication validity, and network connectivity. The diagnostic identifies common issues like missing dependencies, permission problems, or configuration errors. Address any warnings before proceeding to ensure optimal functionality.

## Core commands and interaction modes

Claude Code provides multiple interaction paradigms, each optimized for different workflows. Interactive mode offers conversational development, while headless mode enables automation and integration. Understanding when to use each mode and how to combine them creates powerful development patterns that adapt to your needs.

### Interactive mode

Interactive mode launches with claude or claude chat, creating a persistent session with full context. The conversation maintains state across multiple interactions, accumulating knowledge about your project and preferences. Essential commands include file operations (@filename to reference files), context management (/context add file.py to include files), session control (/clear to reset context, /compact to summarize), workflow commands (/commit for git operations, /test to run tests), and utility functions (/help for available commands, /usage to monitor tokens).

The permission system governs tool usage with four modes. Default mode prompts for each new tool use, balancing safety with flexibility. AcceptEdits mode auto-approves file modifications while maintaining other restrictions. Plan mode analyzes without executing, useful for understanding Claude's approach. BypassPermissions mode (via --dangerously-skip-permissions) removes all restrictions for containerized environments. Configure permissions via /permissions command or --permission-mode flag, adjusting dynamically as workflows evolve.

### Headless Mode

Headless mode (claude -p "prompt") enables programmatic usage without interactive UI. This mode integrates Claude into scripts, CI/CD pipelines, and automation workflows. Key flags include `--output-format json` for structured output, `--allowedTools` to specify available tools, `--permission-mode` for automatic approvals, `--verbose` for debugging information, and `--continue` to resume sessions. Headless mode supports streaming via `--output-format stream-json`, enabling real-time processing of Claude's responses.

### Multi-agent orchestration

Multi-agent orchestration coordinates specialized agents for complex tasks. Launch multiple Claude instances with different configurations: claude --agent backend-dev for API development, claude --agent frontend-dev for UI work, claude --agent test-engineer for quality assurance. Each agent maintains independent context while sharing project files, enabling parallel development without context pollution. Orchestrate agents programmatically through the SDK or manually via separate terminal sessions.

## CLAUDE.md and persistent context

CLAUDE.md files serve as project memory, maintaining context across sessions and team members. These markdown files encode project knowledge, conventions, and decisions that persist beyond individual conversations. Unlike traditional documentation that humans must remember to reference, CLAUDE.md automatically loads into every session, ensuring consistent understanding.

### Structure and organization (Best Practices for Claude.md)

Effective CLAUDE.md structure follows information architecture principles. Begin with Project Overview providing purpose, goals, and success criteria. 

Include Architecture Documentation covering system design, component relationships, and data flows.  

Define Development Standards like coding conventions, testing requirements, and review processes.  

Document Technical Decisions explaining why specific approaches were chosen.  

List Common Operations with commands for building, testing, and deploying. 

This structure ensures Claude understands both what to build and how to build it correctly.

### Hierarchical CLAUDE.md loading enables project-wide and directory-specific context. 

Global context in ~/.claude/CLAUDE.md applies everywhere. Project context in .claude/CLAUDE.md loads for the entire repository. Directory context in subdirectory CLAUDE.md files provides localized knowledge. This hierarchy allows general principles at higher levels with specific implementation details in relevant directories. Claude automatically discovers and loads appropriate CLAUDE.md files based on working directory.

### Best practices for CLAUDE.md content

Context optimization balances completeness with token efficiency. Keep CLAUDE.md files under 2000 words to prevent token exhaustion. Use bullet points and headers for scannable structure. Include code examples for complex patterns. Reference external documentation rather than duplicating. Update regularly as projects evolve—stale context causes more harm than no context. 

Version control CLAUDE.md files to track knowledge evolution and enable rollbacks if needed.

Dynamic context through markdown conventions extends capabilities. Use @filepath to reference other files Claude should consider. Include !command to execute commands and include output. Leverage {{variable}} placeholders for dynamic values. These conventions enable CLAUDE.md files to adapt based on project state rather than remaining static. For example, Current branch: !git branch --show-current provides branch awareness without manual updates.

## Advanced features and patterns

### Slash commands and custom workflows

Slash commands transform repetitive workflows into reusable components, encoding team knowledge as executable documentation. Custom commands live as markdown files that become menu items, accessible through / prefix during sessions. This system enables workflow standardization, knowledge sharing, and process automation without external tooling.

Command structure combines YAML frontmatter with markdown instructions. The frontmatter defines metadata: allowed-tools specifying which tools the command can use, description explaining when to use it, argument-hint showing expected parameters, and model selecting which Claude model to use. The markdown body contains natural language instructions that Claude follows, including step-by-step procedures, validation criteria, and error handling. Use $ARGUMENTS to inject user-provided parameters dynamically.

Project commands in .claude/commands/ share across team members via version control. Create focused commands for common tasks: /review for code review workflows, /deploy for deployment procedures, /debug for troubleshooting steps, /refactor for improvement patterns. These commands ensure consistency—every team member follows the same procedures, reducing errors and improving quality. Project commands appear with "(project)" designation in help menus.

Personal commands in ~/.claude/commands/ provide individual productivity enhancements. Examples include /standup generating daily status updates, /commit creating detailed commit messages, /document producing consistent documentation, /estimate analyzing task complexity. Personal commands appear with "(user)" suffix, distinguishing them from project standards. Combine personal and project commands for layered workflows.

Advanced command patterns unlock sophisticated automation. Multi-step workflows chain operations: "1. Run tests 2. Fix failures 3. Verify fixes 4. Commit changes". Conditional logic adapts to situations: "If tests pass, deploy; otherwise, debug failures". External tool integration via MCP servers: "Query JIRA for issue details, implement fix, update ticket". Subagent delegation distributes work: "Use code-reviewer agent to verify changes". These patterns transform Claude from assistant to autonomous developer.

### Subagents for specialized expertise

Subagents represent specialized AI personalities with focused expertise, isolated contexts, and restricted permissions. Each subagent operates independently with its own system prompt, tool access, and context window, preventing pollution of the main conversation while enabling deep specialization. This architecture mirrors human teams where specialists handle specific domains.

Subagent definition uses markdown files with YAML frontmatter in .claude/agents/ directories. The frontmatter specifies configuration: name identifying the agent, description explaining its purpose and triggering conditions, tools listing available capabilities, model selecting Claude variant, permissionMode controlling tool usage, and skills auto-loading relevant expertise. The markdown body contains the system prompt defining personality, approach, and constraints. This structure creates reusable, shareable agent definitions.

Specialized roles demonstrate subagent patterns. A security-reviewer agent focuses exclusively on vulnerability detection with read-only access, security-focused prompts, and specialized security Skills. A test-engineer agent generates comprehensive test suites with access to testing tools, knowledge of testing frameworks, and quality-focused objectives. A documentation-writer agent produces clear technical documentation with access to code and docs, understanding of documentation standards, and reader-focused writing style.

Context isolation prevents information overflow. Each subagent maintains separate conversation history from the main agent and other subagents. This isolation enables deep exploration without consuming primary context, parallel execution without interference, and specialized processing without distraction. When subagents complete tasks, they return summaries rather than full transcripts, preserving context efficiency while maintaining information flow.

Delegation patterns optimize complex workflows. The main agent identifies tasks requiring specialization, delegates to appropriate subagents with specific instructions, and continues with other work while subagents process. Subagents execute independently, potentially spawning their own sub-subagents, and return results for integration. This delegation enables handling tasks beyond single-agent capabilities while maintaining coherent coordination.

## MCP servers and external integrations

Model Context Protocol (MCP) establishes standardized connections between Claude Code and external systems, enabling tool extensions without custom code. MCP servers expose capabilities as discoverable tools that Claude can invoke naturally, from database queries to API calls to browser automation. This protocol transforms Claude from isolated assistant to integrated development platform.

MCP architecture supports multiple transport mechanisms. stdio servers communicate via standard input/output, running as subprocess with command and arguments. HTTP servers expose RESTful endpoints with standardized OpenAPI specifications. SSE servers provide real-time streaming for long-running operations. SDK servers run in-process for maximum performance. Choose transport based on deployment requirements, security constraints, and performance needs.

### MCP server discovery and configuration

Configuration resides in .mcp.json files with hierarchical loading. Global configuration in ~/.claude/mcp.json provides personal servers. Project configuration in .claude/mcp.json shares team servers. The configuration structure defines servers with command for executables, args for parameters, env for environment variables, timeout for operation limits, and disabled for temporary deactivation. Environment variable expansion enables secure credential management without hardcoding secrets.
Popular MCP servers accelerate development. Database servers (PostgreSQL, MySQL, MongoDB) enable direct data queries. API servers (GitHub, Slack, Jira) integrate external services. Browser automation (Puppeteer, Playwright) enables web testing. Documentation servers (Context7) provide real-time library references. Custom servers built with MCP SDK expose proprietary systems. Each server appears as tools prefixed with mcp__servername__, creating clear namespacing.

Server management commands simplify administration. Add servers with claude mcp add <name> <command> for stdio transports or claude mcp add --transport http <name> <url> for HTTP endpoints. List configurations via claude mcp list showing active servers and status. Test connectivity with specific servers using claude mcp test <name>. Remove servers via claude mcp remove <name>. The /mcp command within sessions provides interactive management including authentication for OAuth-enabled servers.

## Skills for modular capabilities

Skills package expertise into discoverable, reusable components that extend Claude's capabilities without requiring explicit invocation. Unlike tools that execute actions, Skills provide knowledge and workflows that Claude loads dynamically based on task relevance. This architecture enables capability composition where multiple Skills combine for complex tasks.

Skill structure follows a directory-based convention. Each skill contains SKILL.md with YAML frontmatter and instructions, /scripts directory with executable code, /references containing documentation and templates, and /assets holding supporting files. The frontmatter defines name using lowercase-hyphenated format, description explaining purpose and activation triggers. The description field critically determines when Claude recognizes skill relevance—include both capabilities and use cases.

Skill discovery operates through progressive disclosure. Claude first scans skill metadata (names and descriptions) to identify potential matches. When relevance exceeds threshold, Claude loads SKILL.md instructions into context. If instructions reference scripts or assets, Claude loads these on-demand. This architecture enables hundreds of available skills without overwhelming context windows—Claude accesses exactly what's needed, when needed.

Creation patterns demonstrate skill development. Document-creation skills (docx, pptx, xlsx) include comprehensive formatting instructions, Python scripts for complex operations, and templates for common structures. Testing skills provide framework-specific patterns, assertion libraries, and coverage requirements. Security skills encode vulnerability patterns, scanning procedures, and remediation guidance. Each skill encapsulates domain expertise that would otherwise require manual context management.

The skill-creator skill itself demonstrates meta-capabilities. This skill guides skill creation through interactive questionnaires, generates proper directory structures, formats SKILL.md with best practices, and validates skill functionality. Using skill-creator to build new skills ensures consistency and completeness. Skills can even modify themselves, enabling self-improving capabilities that evolve based on usage patterns.

## Hooks for workflow automation

Hooks provide deterministic control over Claude Code's behavior, executing shell commands or scripts at specific lifecycle events. This event-driven architecture enables workflow automation, security enforcement, and quality control without relying on Claude's decision-making. Hooks transform Claude from autonomous agent to orchestrated developer following team standards.

Eight lifecycle events provide comprehensive control. PreToolUse fires before tool execution, enabling validation or blocking. PostToolUse executes after successful completion for formatting or verification. UserPromptSubmit processes prompts before Claude sees them. Notification handles permission requests and idle states. Stop triggers when Claude completes responses. SubagentStop fires when subagents finish. SessionStart initializes new conversations. SessionEnd cleanup when sessions close. Each event receives JSON payloads with relevant context.

Hook configuration uses settings.json files with matcher patterns. The configuration structure defines arrays for each event type containing matcher patterns and hook specifications. Matchers use tool names (Edit, Write, Bash) or patterns (Write(*.py), Bash(git *)). Hooks specify type (command or script), command to execute, timeout in milliseconds, and async for background execution. Multiple hooks can chain for complex workflows, executing in definition order.

Exit codes control execution flow with specific semantics. Code 0 indicates success with optional stdout consumption. Code 2 blocks tool execution with stderr as feedback to Claude. Other non-zero codes show errors without blocking. JSON responses provide sophisticated control via stdout, including continue boolean, stopReason messages, suppressOutput flags, and decision specifications (approve/deny/block). This granular control enables complex conditional logic and automated decision-making.
Practical patterns demonstrate hook power. Auto-formatting hooks run linters after file modifications. Security hooks block dangerous commands or sensitive file access. Git hooks create commits after successful changes. Notification hooks send alerts for long-running operations. Audit hooks log all actions for compliance. These patterns enforce standards consistently without human intervention.

## Permission system and security

The permission system governs Claude's capabilities through multiple layers of control, from granular tool restrictions to enterprise-wide policies. This defense-in-depth approach balances productivity with security, enabling powerful automation while preventing unintended consequences. Understanding permission precedence and configuration patterns ensures safe, effective usage.
Permission rules follow a clear precedence hierarchy. Deny rules always override allow rules—explicit denial cannot be overridden. Managed settings (enterprise) override all user configurations. Local project settings override project settings. Project settings override user global settings. Within each level, more specific patterns override general ones. This hierarchy ensures security policies cascade properly while enabling local customization where appropriate.

Tool-specific permissions use pattern matching for granular control. File operations support gitignore syntax:

```
# Read(src/**/*.ts) allows TypeScript files, Write(!node_modules/**) 
```
prevents node_modules modification. 

Bash commands use regex patterns: Bash(npm *) allows npm commands, Bash(rm:*) blocks all rm usage. WebFetch restricts domains: WebFetch(api.company.com) allows internal APIs only. These patterns compose for sophisticated policies like allowing specific git operations while blocking others.

Security-focused configurations demonstrate enterprise patterns. Development environments allow broad read access with restricted writes and command execution. Staging environments limit modifications to specific directories with read-only database access. Production environments operate read-only with audit logging and multi-factor authentication for changes. These configurations layer with hooks for comprehensive security postures ensuring compliance while maintaining productivity.
The managed-settings.json file enables enterprise policy enforcement. Located in system directories (/etc/claude-code/ on Linux, /Library/Application Support/ClaudeCode/ on macOS), this file cannot be overridden by users. Common policies include blocking sensitive file access (*.env, *.key, credentials.json), preventing dangerous commands (sudo, rm -rf, curl | sh), requiring audit logging for all actions, and enforcing specific model usage. This centralized control ensures organizational standards apply universally.

## Headless mode and automation

Headless mode transforms Claude Code from interactive assistant to programmable automation engine, enabling integration into CI/CD pipelines, git hooks, and scripting workflows. The -p flag activates non-interactive execution with structured output formats supporting both human and machine consumption. This mode unlocks Claude's capabilities for automated testing, code review, and large-scale refactoring.
Basic headless usage follows simple patterns. Execute single commands: claude -p "Review this commit for security issues". Process input streams: git diff | claude -p "Explain these changes". Generate structured output: claude -p "Analyze code complexity" --output-format json. Control tool usage: claude -p "Fix linting errors" --allowedTools "Read,Write,Edit". Set permission modes: claude -p "Refactor module" --permission-mode acceptEdits. These patterns compose for sophisticated automation workflows.

Output formats optimize for different consumers. Plain text (default) provides human-readable responses. JSON format enables programmatic parsing with result, cost, and metadata fields. Stream-JSON offers real-time processing of incremental responses. Each format supports different use cases: plain text for logs, JSON for structured processing, stream-JSON for progressive UI updates. Parse JSON with standard tools like jq for pipeline integration.

CI/CD integration patterns demonstrate automation power. Pre-commit hooks validate changes: git diff --cached | claude -p "Check for security vulnerabilities" || exit 1. Pull request reviews analyze code: gh pr diff | claude -p "Review for patterns and performance". Test generation maintains coverage: claude -p "Generate tests for uncovered code" --allowedTools "Read,Write". Documentation updates ensure consistency: claude -p "Update API docs based on changes". These integrations enforce quality standards automatically.

Batch processing handles large-scale operations efficiently. Generate task lists identifying work: claude -p "List all files needing migration". Process iteratively with loops: for file in $(cat tasks.txt); do claude -p "Migrate $file to new framework"; done. Parallelize with background jobs for performance. Aggregate results for reporting. This approach handles migrations, refactoring, and analysis across entire codebases systematically.

## Claude Agent SDK integration

The Claude Agent SDK enables programmatic agent construction using TypeScript or Python, exposing Claude Code's capabilities as library functions rather than CLI commands. This SDK powers custom agents, application integrations, and autonomous systems that leverage Claude's reasoning with your application logic. The SDK maintains the same safety and permission models while providing programmatic control.
SDK architecture mirrors Claude Code's design. The query() function provides simple text generation similar to headless mode. ClaudeSDKClient offers full agent capabilities including session management, tool control, and streaming responses. Both approaches share configuration through ClaudeAgentOptions (formerly ClaudeCodeOptions), maintaining consistency with CLI patterns. The SDK bundles necessary dependencies including a fallback Claude Code CLI for environments without separate installation.

Basic SDK usage demonstrates integration patterns. TypeScript example:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
async function reviewCode() {
  for await (const msg of query({
    prompt: "Review main.ts for security issues",
    options: {
      allowedTools: ["Read", "Grep"],
      maxTurns: 3
    }
  })) {
    if (msg.type === "result") console.log(msg.result);
  }
}
```

This pattern enables embedding Claude's capabilities within applications while maintaining control over permissions and resources.

Advanced SDK features enable sophisticated agents. In-process MCP servers expose custom tools without subprocess overhead. Hook integration provides deterministic workflow control. Subagent spawning enables hierarchical task distribution. Session persistence maintains context across invocations. These capabilities combine for production agents that handle complex, multi-step workflows autonomously while remaining safe and auditable.

### Migration from Claude Code SDK to Claude Agent SDK

Migration from Claude Code SDK to Claude Agent SDK involves minimal changes. Update package names from @anthropic-ai/claude-code to @anthropic-ai/claude-agent-sdk. Rename ClaudeCodeOptions to ClaudeAgentOptions. Explicitly request Claude Code's system prompt if needed (no longer default). Specify settings sources for filesystem configuration loading. These changes improve isolation and control while maintaining full compatibility with existing patterns.

## Spec-driven development workflows

Spec-driven development with Claude Code treats specifications as executable contracts guiding implementation, testing, and validation. This methodology front-loads design decisions creating guardrails that maintain consistency throughout development. The approach combines natural language specifications with AI-powered implementation, achieving both velocity and quality.

The three-phase workflow begins with specification conversation. Spend 30-60 minutes defining requirements, constraints, and success criteria. Document discussions in structured markdown: spec/functional-requirements.md for capabilities, spec/technical-requirements.md for implementation constraints, spec/acceptance-criteria.md for validation standards. This investment prevents rework by establishing clear targets before coding begins. Claude references these specifications throughout implementation, maintaining alignment automatically.

Project scaffolding establishes persistent context. Create .claude/ directory structure with CLAUDE.md for project overview, commands/ for workflow automation, agents/ for specialized assistants, skills/ for domain expertise, and settings.json for configuration. Initialize with claude init to generate templates. This scaffolding ensures every session begins with complete project understanding, eliminating repeated explanations.

Iterative implementation builds features incrementally. Start Claude with full context: claude --resume to continue previous work. Reference specifications explicitly: "Implement authentication according to spec/auth-requirements.md". Claude reads specifications, generates implementation following patterns, runs tests validating correctness, and iterates based on feedback. Use /compact periodically to maintain context efficiency. Each iteration refines implementation while maintaining specification compliance.

Validation closes the loop ensuring specifications remain accurate. After implementation, verify alignment: "Compare implementation against spec/auth-requirements.md and identify deviations". Claude analyzes code against specifications, identifies discrepancies, suggests corrections or specification updates, and documents decisions. This validation ensures specifications evolve as living documentation rather than becoming stale artifacts that mislead future development.

## Best practices and optimization strategies

Optimizing Claude Code workflows requires understanding context management, tool selection, and interaction patterns. These practices emerge from thousands of development hours across diverse projects, representing collective wisdom from the Claude Code community. Applying these patterns consistently improves both productivity and code quality.

Context window management prevents token exhaustion. Monitor usage frequently with /usage command, aiming to stay below 70% utilization. Use /compact proactively rather than reactively when approaching 60%. Clear temporary context with /context clear when switching tasks. Leverage Skills and MCP servers that load on-demand rather than persistently. Structure CLAUDE.md hierarchically to load only relevant sections. These practices maintain responsiveness throughout long sessions.

Tool permission strategies balance safety with productivity. Trust read-only operations by default for exploration without risk. Require approval for modifications until patterns establish. Use hooks for validation rather than restricting tools entirely. Configure project-specific permissions reflecting risk tolerance. Enable bypassPermissions only in isolated containers with rollback capability. This graduated trust model prevents accidents while maintaining development velocity.

Subagent orchestration patterns handle complex projects efficiently. Assign specialized roles matching team structures (architect, developer, reviewer). Delegate research tasks to preserve main context for implementation. Run parallel subagents for independent components. Use subagents for deep exploration returning summaries. Chain subagents for multi-phase workflows. This delegation mirrors human teams, leveraging specialization for quality and efficiency.

Skill composition enables capability layering. Combine document skills with language skills for localized content. Layer security skills onto development skills for secure coding. Compose testing skills with framework skills for comprehensive validation. This composition creates powerful combinations exceeding individual capabilities. Skills can reference other skills, creating recursive capability expansion limited only by context windows.

## Troubleshooting common issues

Understanding common issues and solutions prevents frustration and maintains productivity flow. These problems represent the most frequently encountered challenges with proven solutions from the community. Systematic troubleshooting approaches combined with awareness of platform limitations enables quick resolution.
Permission system failures manifest as unexpected file access despite deny rules. Current versions have known bugs where deny patterns don't properly restrict Read/Write tools. Workarounds include using PreToolUse hooks for blocking, filesystem permissions as backup protection, and managed-settings.json for enterprise enforcement. Monitor GitHub issues for fixes as this represents a critical security concern under active development.

Context window exhaustion occurs in long sessions or large codebases. Symptoms include degraded responses, repetition, and errors. Solutions involve aggressive compaction with /compact, splitting work across multiple sessions, using Skills for on-demand loading, moving reference materials to MCP servers, and architecting projects with focused directories. Design workflows assuming context limitations rather than fighting them.

MCP server connection failures prevent external integrations. Common causes include incorrect command paths, missing environment variables, timeout values too low, and firewall blocking. Debug with claude --mcp-debug flag, test servers independently before integration, verify environment variable expansion, and check logs in $TMPDIR/mcp.log. Start with simple stdio servers before attempting complex HTTP integrations.
Authentication errors interrupt workflows with "Invalid token" messages. Causes include expired browser sessions, SSO configuration changes, and API key rotation. Resolution requires re-authentication with claude login, verifying subscription status, checking organization SSO settings, and updating API keys in environment. For headless environments, prefer API keys over browser authentication for stability.

## Advanced patterns and future directions

Advanced patterns push Claude Code beyond standard usage, exploring capabilities at the framework's edges. These techniques emerge from power users and Anthropic engineers solving complex problems requiring novel approaches. While some patterns remain experimental, they demonstrate Claude Code's potential evolution.
Multi-agent orchestration via supervisor patterns coordinates teams of specialized agents. A supervisor agent manages overall project state, delegates tasks to worker agents based on expertise, monitors progress through status reports, and integrates results maintaining coherence. This pattern handles projects exceeding single-agent capabilities while maintaining architectural consistency. Implement via multiple terminal sessions or programmatically through SDK.

Recursive skill generation enables self-improving systems. Skills create new skills based on usage patterns, modify existing skills for optimization, evaluate skill effectiveness through metrics, and evolve capability libraries automatically. This meta-programming approach creates adaptive systems that improve through usage. Combine with version control for rollback capability and audit trails.

Context streaming between agents enables knowledge transfer without token overhead. Agents write summaries to shared locations, subsequent agents read relevant summaries, and knowledge accumulates without context explosion. This pattern handles multi-day projects where context would otherwise overflow. Implement via filesystem, databases, or message queues depending on requirements.

The development roadmap suggests exciting enhancements. Expanded context windows reducing compaction needs. Native IDE integrations beyond current extensions. Enhanced MCP protocol supporting bidirectional communication. Skill marketplace for community sharing. Multi-modal capabilities including image understanding. These directions maintain Claude Code's position at the forefront of AI-powered development.

## Security considerations and enterprise adoption

Enterprise adoption requires addressing security, compliance, and governance concerns. Claude Code provides multiple mechanisms for organizational control while maintaining developer productivity. Understanding these capabilities enables confident deployment in regulated environments.

Data privacy controls determine information exposure. Consumer plans (Pro/Max) may use conversations for model improvement (user-configurable). Team/Enterprise plans guarantee no training on customer data. API key usage ensures complete data isolation. Configure based on sensitivity: public projects on consumer plans, proprietary code on enterprise plans, and sensitive data via API keys only.

Audit logging enables compliance tracking. Hooks capture all tool usage with timestamps and parameters. Stream logs to SIEM systems for centralized monitoring. Implement approval workflows for production changes. Document decision rationale in CLAUDE.md for reviews. These practices create audit trails satisfying regulatory requirements while maintaining development velocity.

Supply chain security prevents compromised dependencies. Vet MCP servers before installation, reviewing code for malicious patterns. Restrict skill sources to trusted repositories. Monitor for suspicious command patterns indicating compromise. Use managed-settings.json blocking dangerous operations. These precautions prevent prompt injection and data exfiltration attacks that could compromise systems.

Deployment patterns optimize for organizational needs. Individual developers use personal installations with project-specific configurations. Teams share configurations via version control ensuring consistency. Enterprises deploy managed configurations with centralized policy enforcement. Cloud deployments use containerized instances with network isolation. Choose patterns matching security requirements and organizational maturity.
