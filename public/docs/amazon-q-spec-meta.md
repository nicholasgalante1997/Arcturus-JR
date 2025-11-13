# Amazon Q CLI: Complete Reference for Spec-Driven Project Development

Amazon Q CLI transforms command-line development with AI-powered agentic capabilities that enable specification-driven workflows. This comprehensive guide reveals how to harness Q CLI's full potential—from basic setup through advanced multi-agent orchestration—turning specifications into executable artifacts that directly generate implementations. **Built in Rust and powered by Claude 3.7 Sonnet**, Q CLI provides natural language chat, intelligent autocomplete, file manipulation, AWS integration, and extensible tool ecosystems that accelerate development by 10x when properly configured.

The key insight: Amazon Q CLI isn't just an assistant—it's a configurable, context-aware AI developmenty partner that maintains persistent project intelligence across sessions. This guide covers everything from foundational concepts through advanced optimization techniques, integration patterns for Rust and TypeScript/Bun projects, and troubleshooting strategies for production workflows.

## What makes spec-driven development powerful

Spec-driven development with Amazon Q CLI treats specifications as first-class executable artifacts rather than disposable documentation. **This methodology places AI collaboration at the center of serious software engineering**, using structured conversations and persistent context to build iteratively. The three-phase approach—specification conversation, project intelligence foundation, and iterative implementation—creates guardrails

The Memory Banking framework optimizes this workflow by maintaining project specifications in markdown files that persist across sessions. Core files like `idea.md` (your north star), `vibe.md` (technical preferences), `state.md` (implementation status), and `decisions.md` (architecture rationale) create a knowledge base that Q CLI references automatically. This persistent memory eliminates context loss between sessions and enables seamless collaboration across team members who share the same project intelligence.

Research shows developers building complete applications in 12-15 minutes using this approach—a 10x improvement over traditional development. The secret lies in spending 30 minutes on specification conversations before writing any code, documenting everything as valuable project knowledge, and building iteratively with multi-turn conversations that maintain full context.

## Installation and foundational setup

Amazon Q CLI runs on macOS and Linux with full support, including Ubuntu packages, AppImage distributions, and minimal CLI-only installations for SSH environments. **Windows users leverage WSL2 for complete functionality**. The installation process varies by platform but follows consistent patterns: install the application, enable shell integration, authenticate with AWS Builder ID (free tier) or IAM Identity Center (Pro tier), and verify with `q doctor`.

For macOS, Homebrew provides the simplest path: `brew install --cask amazon-q`. Linux users choose between Ubuntu packages (`sudo dpkg -i amazon-q.deb`), AppImage for universal Linux support, or minimal zip installations containing only `q` and `qterm` binaries for headless environments. Enterprise users configure proxy support through standard environment variables (`HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`) introduced in version 1.8.0.

Authentication separates free and Pro tiers. Free users authenticate with `q login --license free` using AWS Builder ID, gaining 50 agentic chat interactions monthly plus full CLI features. Pro users ($19/month) authenticate via `q login --license pro --identity-provider https://company.awsapps.com/start --region us-east-1`, unlocking 1000 agentic requests monthly, regional availability including Frankfurt for European users, and priority feature access.

The initial `q doctor` diagnostic identifies common issues with shell integration, dependencies, and connectivity. This command serves as the first troubleshooting step for any configuration problem, automatically detecting and offering fixes for integration failures, authentication issues, and environment misconfigurations.

## Core commands and agentic capabilities

Amazon Q CLI's command set centers on **agentic interaction powered by Claude 3.7 Sonnet**, providing multi-turn conversations with file operations, command execution, and AWS integration. The `q chat` command launches interactive sessions where Q can read and write files locally, execute bash commands, run compilers and package managers, query AWS resources, manage Git operations, and iteratively debug issues with error recovery.

The trust model controls tool execution. By default, only `fs_read` and `report_issue` run without confirmation—all other tools prompt for approval. The `--trust-all-tools` flag disables prompts entirely for automation scenarios, while `--trust-tools=fs_read,fs_write,execute_bash` grants granular permission to specific tools. The `/tools` command within chat sessions manages permissions dynamically, allowing users to trust, always allow, or deny specific tools as workflows evolve.

Natural language translation through `q translate` converts plain English into executable shell commands: `q translate "find all Python files modified in the last week"` generates `find . -name "*.py" -mtime -7`. The `-n 3` flag generates multiple alternatives when ambiguity exists. This translation works across hundreds of CLI tools including git, npm, docker, aws, kubectl, and terraform.

Intelligent autocomplete operates through two independent systems. The graphical dropdown menu appears to the cursor's right, showing available subcommands and options for 500+ tools, navigable with arrow keys and selectable with Tab or Enter. Inline suggestions display gray "ghost text" directly on the command line based on current input and command history, accepted with right arrow or Tab. These systems work independently—inline suggestions currently support only zsh on macOS and Linux, while dropdown menus work across all supported shells.

Slash commands within chat sessions provide workflow control. Essential commands include `/context add` for temporary file inclusion, `/context show` to view current context with token counts, `/usage` for monitoring context window consumption, `/compact` to summarize conversation history and reduce token usage, `/save` and `/load` for conversation persistence, and `/editor` to compose complex multi-line prompts in your default text editor.

## Configuration architecture and hierarchy

Amazon Q CLI uses a hierarchical configuration system spanning global and workspace-specific settings. **Global configurations in `~/.aws/amazonq/` apply system-wide**, while workspace configurations in `<project>/.amazonq/` override globals when conflicts occur. This dual-layer approach enables shared tool configurations across all projects while supporting project-specific customizations.

The configuration system comprises four primary types: MCP server configurations (`mcp.json`), custom agent definitions (`cli-agents/*.json`), project rules (`.amazonq/rules/*.md`), and command-line settings accessible through `q settings`. When both global and workspace configurations exist, Q CLI reads from both locations, takes their union, and applies workspace settings as overrides when conflicts occur, displaying warnings for overlapping definitions.

Configuration precedence follows this hierarchy: workspace configurations override global configurations, agent-defined resources take highest priority within sessions, critical-priority rules override all other rules, and more specific rules take precedence over general ones. Understanding this hierarchy proves essential for debugging unexpected behavior and designing effective multi-project workflows.

## Custom agents for workflow specialization

Custom agents transform Q CLI from a general assistant into specialized development partners tailored to specific workflows, tech stacks, or security requirements. **Agent configuration files define tools, permissions, persistent context, and behavioral prompts** that shape how Q approaches tasks. Agents live in `~/.aws/amazonq/cli-agents/` globally or `.amazonq/cli-agents/` for project-specific configurations.

A complete agent configuration includes several key sections. Basic metadata defines name, description, prompt (high-level behavioral context), and model selection. The tools array lists available capabilities including built-in tools (`fs_read`, `fs_write`, `execute_bash`, `use_aws`) and MCP server tools (`@server_name/tool_name`). The allowedTools array specifies which tools run without confirmation, enabling friction-free workflows for trusted operations.

Tool settings provide granular control over permissions. For `execute_bash`, define `allowedCommands` as regex patterns matching safe operations and `deniedCommands` blocking dangerous actions, with `autoAllowReadonly` automatically approving read-only operations. For `fs_write`, specify `allowedPaths` using glob patterns and `deniedPaths` for protected directories. For `use_aws`, configure `allowedServices` limiting which AWS services Q can access and `autoAllowReadonly` for automatic approval of read operations like `aws s3 ls`.

Resources define persistent context automatically loaded with each agent session. Use `file://` prefix with paths: `"file://README.md"`, `"file://.amazonq/rules/**/*.md"`, `"file://docs/**/*.md"`. Glob patterns enable dynamic inclusion—`**/*.md` captures all markdown files recursively. Resources persist across all sessions using that agent, eliminating repeated context addition.

Agent hooks inject dynamic runtime information into context. The `agentSpawn` hook executes once at initialization, useful for static project information like current git branch: `{"command": "git branch --show-current", "timeout_ms": 10000}`. The `userPromptSubmit` hook executes with each user message, ideal for dynamic state like file changes: `{"command": "git status --porcelain", "timeout_ms": 5000, "cache_ttl_seconds": 30}`. Caching with `cache_ttl_seconds` prevents redundant executions.

Practical agent patterns emerge from real-world usage. Create technology-specific agents for Rust (`rust-dev.json`), TypeScript (`typescript-dev.json`), or Bun runtime (`bun-dev.json`) with appropriate compilers and package managers in allowed commands. Create workflow-specific agents for development (permissive tools), code review (read-only focus), testing (test execution only), or documentation (doc generation emphasis). Create security-focused agents with restrictive path access, denied commands blocking dangerous operations, and read-only AWS service access.

## Project rules for consistent development standards

Project rules define development guidelines in natural language markdown files stored in `.amazonq/rules/`. **Rules automatically integrate into agent contexts**, influencing all Q Developer interactions without manual context addition. This approach enables teams to codify standards, architectural patterns, and workflow preferences that Q follows consistently.

Effective rule structure includes four components. The Purpose section explains why the rule exists, helping Q understand intent for edge cases. Instructions list specific directives with unique IDs for traceability—use ALWAYS/NEVER for mandatory behaviors, include concrete examples, and keep instructions atomic. Priority levels (Critical, High, Medium, Low) establish precedence when rules conflict. Error handling defines fallback strategies for unexpected situations, ensuring graceful degradation.

Example rules demonstrate practical applications. A monitoring rule ensures new features trigger MONITORING_PLAN.md updates: "When implementing a major feature, ALWAYS check if MONITORING_PLAN.md needs updates (ID: CHECK_MONITORING_PLAN). Major features include: new microservices, AI integrations, WebSocket endpoints, database operations, external API integrations." A git workflow rule controls version control behavior: "ALWAYS ask confirmation from user before pushing to git (ID: GIT_PUSH). ALWAYS ensure commit messages are meaningful and detailed (ID: GIT_COMMIT)."

A transparency pattern enables rule traceability. Create a conversation rule requiring Q to acknowledge which guidelines influenced responses: "When acting based on a rule, ALWAYS print 'Rule used: `filename` (ID)' at the beginning (ID: PRINT_RULES)." This transparency reveals which rules guided specific behaviors, aids debugging unexpected responses, and confirms rules work as intended.

Rules organize logically in subdirectories: `.amazonq/rules/coding-standards.md`, `.amazonq/rules/architecture/patterns.md`, `.amazonq/rules/workflow/git.md`. Default agents automatically include all rules via `"resources": ["file://.amazonq/rules/**/*.md"]`. Custom agents must explicitly include rules if desired. Teams share rules through version control, ensuring consistent AI behavior across all team members working on the project.

## Model Context Protocol integration

MCP (Model Context Protocol) extends Q CLI with standardized connections to external data sources and tools. **MCP enables pre-built integrations with databases, APIs, and services without custom code**, enhancing Q's accuracy and contextual understanding. The protocol uses stdio transport, supporting any MCP servers that communicate via standard input/output.

MCP configuration resides in `~/.aws/amazonq/mcp.json` globally or `.amazonq/mcp.json` for workspace-specific servers. The configuration structure defines servers with command (executable path), args (command-line arguments as array), env (environment variables as key-value object with string values), timeout (milliseconds, default 60000), disabled (boolean), and autoApprove (array of tools to run without confirmation).

AWS provides official MCP servers through the awslabs/mcp GitHub repository, including servers for AWS documentation, pricing data, Bedrock Knowledge Base retrieval, and service-specific integrations. Community MCP servers support PostgreSQL (schema exploration, query generation), Git (status, commit, branch management), Docker (container operations), Figma (design integration), and custom tools built with MCP SDKs.

MCP management commands simplify configuration. Use `q mcp add --name server --command cmd --args "arg1,arg2"` to register servers, `q mcp list` to view configured servers, `q mcp status --name server` to check connectivity, and `q mcp remove --name server` to unregister. Within chat sessions, `/tools` displays available MCP tools, and `/tools trust @server/tool` grants automatic approval.

Agent-specific MCP configurations embed servers directly in agent definitions through the `mcpServers` field. This approach isolates server access—frontend agents include Figma servers, backend agents include PostgreSQL servers, infrastructure agents include AWS-specific servers. Switching agents automatically switches available MCP tools, preventing context pollution from irrelevant capabilities.

Background loading improves startup performance. MCP servers initialize asynchronously while chat becomes immediately available, eliminating wait times for server connections. Configure timeouts appropriately—network operations require higher values (120000ms), local services use defaults (60000ms). Monitor server status in logs at `$TMPDIR/qlog/mcp.log` or `$XDG_RUNTIME_DIR/qlog/mcp.log`.

## Persistent context generation techniques

Persistent context forms the foundation of spec-driven development, maintaining project intelligence across sessions without manual re-addition. **Amazon Q CLI provides multiple persistence mechanisms with different characteristics**—agent resources for core project context, knowledge bases for large datasets, profiles for role-based contexts, and conversation persistence for workflow continuity.

Agent resources provide the primary persistence method. Define resources in agent configuration files: `"resources": ["file://README.md", "file://.amazonq/rules/**/*.md", "file://docs/**/*.md"]`. Resources automatically load with each agent session, consuming context window tokens on every request. Use glob patterns for dynamic inclusion—`**/*.md` captures all markdown files recursively. Resources work best for essential project documentation under 10MB that Q needs in every conversation.

Knowledge bases offer an alternative for large content sets exceeding context window limits. Enable with `q settings chat.enableKnowledge true`, then add directories: `/knowledge add "project-docs" /path/to/docs --index-type Best`. Knowledge bases create semantic indexes stored in `~/.semantic_search/` that don't consume context tokens until explicitly searched. Choose Fast indexing (BM25 lexical search) for logs and configs, or Best indexing (AI embeddings) for documentation and research. The 5000-document limit per knowledge base handles most project documentation needs.

Profiles enable context switching between different projects or roles. Create profiles with `/profile create backend-dev`, switch with `/profile set backend-dev`, and add profile-specific context with `/context add` commands. Each profile maintains separate workspace context while sharing global context. Use profiles for project-specific contexts (project-a, project-b), role-based contexts (backend-dev, devops, frontend), or technology stack contexts (python, java, react).

Conversation persistence maintains workflow continuity across sessions. The `--resume` flag automatically saves and restores conversations by working directory: `cd ~/project && q chat --resume`. Manual management uses `/save session-name` to archive conversations and `/load session-name` to restore them. This persistence prevents context loss when switching projects or resuming work after breaks.

Context hooks dynamically inject runtime information. Agent hooks defined in agent configurations execute commands and include output in context. Use `agentSpawn` hooks for one-time initialization like identifying current git branch, and `userPromptSubmit` hooks with caching for frequently changing state like git status. Hooks enable Q to access dynamic information without explicit user commands.

## Optimal markdown structures for specifications

Markdown serves as the universal format for project documentation, specifications, and rules in Q CLI workflows. **Effective markdown structures use clear hierarchies, code examples, tables, and descriptive headers** that Q processes efficiently. The format minimizes parsing errors while maximizing information density for LLM consumption.

Specification files follow proven patterns. Start with an Overview section providing brief project description and goals. Include Architecture covering system design, component relationships, and data flows. Define Technical Stack listing languages, frameworks, dependencies, and infrastructure. Document Development Standards including coding conventions, testing requirements, and documentation expectations. Conclude with Workflow Preferences covering git workflow, review process, and deployment procedures.

Project rules use consistent structure optimized for AI comprehension. Begin with a clear Rule Name header. Add Purpose explaining why the rule exists. List Instructions as specific directives with unique IDs: "When X happens, ALWAYS do Y (ID: DIRECTIVE_X)". Specify Priority level (Critical/High/Medium/Low). Define Error Handling with fallback strategies for edge cases. This structure enables Q to understand both the what and why, improving rule application in ambiguous situations.

Context file organization follows logical patterns. Store rules in `.amazonq/rules/` with subdirectories for different domains (frontend/, backend/, general/). Place specifications in `./spec/` or `./docs/` directories. Keep files focused—split large contexts into smaller, topic-specific files rather than monolithic documents. Use descriptive filenames indicating purpose: `authentication-spec.md`, not `spec1.md`.

Content guidelines optimize for LLM processing. Use hierarchical headers (H1, H2, H3) for clear structure. Include code examples with syntax highlighting using triple-backtick blocks. Organize multi-part sections clearly with numbered lists or logical flow. Use markdown tables for structured data like API endpoints, configuration options, or comparison matrices. Bold key facts and figures for emphasis, but avoid bolding full sentences.

File size considerations matter for token efficiency. Large files consume significant tokens—the context window limit applies to 75% of the model's maximum. Split files exceeding several thousand words into focused subtopics. Use specific glob patterns rather than overly broad ones: `src/**/*.md` instead of `**/*`. Monitor context usage with `/context show` to identify files consuming excessive tokens.

## Context management for long development sessions

Long development sessions require active context management to prevent token exhaustion and maintain performance. **Proactive monitoring and optimization strategies** enable multi-hour sessions without hitting context limits or experiencing degraded responses.

Session initialization establishes baseline context. When starting with `q chat --agent dev-workflow`, Q loads agent resources, initializes MCP servers in background, applies profile context (global + workspace), restores conversation history if using `--resume`, and applies any session-specific context additions. Understanding this loading order helps debug unexpected context behavior.

Context window monitoring prevents surprises. Use `/usage` frequently to check consumption: "Context files: ~1100 tokens (11.99%), Conversation history: ~5000 tokens (25%), Total: ~6100 tokens (30.5%)". This visibility enables proactive management before reaching limits. Aim to stay below 60-70% for comfortable headroom, allowing space for responses and additional context.

The `/compact` command summarizes conversation history to reduce context size while preserving important information. Apply compaction when approaching 60-70% utilization rather than waiting for limits. Compacted conversations maintain logical flow and key decisions while dramatically reducing token consumption. Use `/save` before compacting to preserve full history if needed.

Context clearing removes temporary additions. The `/context clear` command removes all session-added files without affecting agent-defined resources. Use `/context rm specific-file.py` to remove individual files. Clear temporary debugging context when switching topics to free tokens for new work. Note that agent resources cannot be removed via slash commands—edit the agent configuration file to modify persistent resources.

Multi-project workflows benefit from conversation management. Save current work with `/save project-a-work.json` before switching directories. Change to new project with `cd ~/project-b`, start fresh session with `q chat --agent different-agent`, and later return with `cd ~/project-a` followed by `/load project-a-work.json`. This pattern maintains separate contexts for parallel workstreams.

Knowledge bases provide overflow capacity for large reference materials. When context windows fill, move reference documentation to knowledge bases: `/knowledge add "api-docs" ./docs/api --index-type Best`. Reference explicitly: "Use the knowledge tool to find information about authentication endpoints." Knowledge bases don't consume tokens until searched, enabling access to gigabytes of documentation without context limits.

## JSON configuration files and optimal structures

JSON configuration files define custom agents and MCP servers with precise specifications. **Proper JSON structure ensures reliable agent behavior and tool integration**. The schema validation, available through `/agent schema`, defines required and optional fields.

Complete agent configuration includes all available sections. The `$schema` field references the official JSON schema for validation. Basic metadata (`name`, `description`, `prompt`, `model`) defines agent identity and behavior. The `tools` array lists available capabilities—built-in tools and MCP server tools use the pattern `@server/tool`. The `allowedTools` array specifies which tools run without user confirmation. Tool aliases (`toolAliases`) provide shorthand names for frequently used tools.

Tool settings provide granular permission control through the `toolsSettings` object. Each tool name keys to a configuration object. For `fs_read` and `fs_write`, define `allowedPaths` and `deniedPaths` as arrays of glob patterns. For `execute_bash`, specify `allowedCommands` and `deniedCommands` as regex patterns, with `autoAllowReadonly` boolean for automatic read-only approval. For `use_aws`, configure `allowedServices` and `deniedServices` arrays limiting AWS service access.

MCP servers within agents use the `mcpServers` object. Each server keys to a configuration with `command` (executable path), `args` (string array of arguments), `env` (object with string values only), `timeout` (milliseconds), `disabled` (boolean), and `autoApprove` (array of tool names). Agent-embedded MCP servers override global configurations when names match, enabling project-specific database connections or API endpoints.

Resources and hooks complete agent definitions. The `resources` array uses `file://` prefixed paths supporting glob patterns: `"file://README.md"`, `"file://.amazonq/rules/**/*.md"`. The `hooks` object defines `agentSpawn` and `userPromptSubmit` arrays containing command specifications with `command` string, `timeout_ms` number, and optional `cache_ttl_seconds` for caching.

JSON validation prevents configuration errors. Use online JSON validators or IDE extensions to verify syntax before saving. Common errors include trailing commas (invalid in JSON), unquoted keys, single quotes instead of double quotes, and incorrect nesting. The `q doctor` command detects some configuration issues, and agent-specific errors appear in logs at `$TMPDIR/qlog/qchat.log`.

Configuration best practices improve maintainability. Start with minimal configurations and add complexity gradually. Document agent purposes in description fields. Use descriptive names for agents and MCP servers. Version control agent configurations in project repositories for team sharing. Test agents thoroughly after changes—create test agents before modifying production configurations. Keep global configurations for general tools and workspace configurations for project-specific integrations.

## Spec-driven development workflows

Spec-driven development workflows with Amazon Q CLI emphasize specifications as executable contracts guiding implementation. **This methodology produces higher quality code faster by front-loading planning and maintaining persistent context**. The approach works best with structured processes that documentation, iteration, and validation.

The three-phase workflow begins with a 30-minute specification conversation. Resist immediate coding—spend time defining requirements, constraints, success criteria, technical preferences, and edge cases. Document this conversation as project specifications in markdown files. This upfront investment prevents rework and creates guardrails that maintain consistency across the implementation.

Project intelligence foundation establishes persistent memory. Create core documentation files in structured directories: `idea.md` for core concept and success criteria (your north star), `vibe.md` for technical preferences and guardrails, `state.md` for current implementation status, `decisions.md` for architecture decisions and rationale, and `SPEC.md` for detailed specification scaffolds. Store these in `./spec/` or `./docs/` directories, referenced by agent resources.

Data model specifications enable type-safe development. Define data structures in YAML files: `data-model/schema.yaml`. Include field names, types, constraints, and relationships. Q CLI uses these specifications to generate code with consistent data structures across components. Specification-driven data modeling prevents schema drift and enables automated validation.

Iterative implementation builds features step-by-step. Start Q CLI with project context loaded: `q chat --agent project-dev --resume`. Reference specifications: "Build the user authentication API according to spec/auth-spec.md". Q reads specifications, generates code following defined patterns, runs tests automatically if configured, and iterates based on feedback. Each conversation turn refines the implementation while maintaining alignment with specifications.

Multi-turn conversations maintain context across complex features. Begin with high-level intent: "Implement the payment processing workflow defined in spec/payments-spec.md". Q asks clarifying questions about ambiguities. Respond with specifics: "Use Stripe API for card processing, implement webhook handling for asynchronous events". Q generates implementation, tests components, identifies issues, and iterates to resolution. Use `/compact` if conversations become lengthy to maintain focus.

Validation against specifications closes the loop. After implementation, verify alignment: "Review the payment implementation against spec/payments-spec.md and identify any deviations". Q compares code to specifications, notes differences, suggests corrections or specification updates, and documents decisions in `decisions.md`. This validation ensures specifications remain accurate living documents rather than outdated artifacts.

Team collaboration amplifies spec-driven benefits. Share `.amazonq/` directories containing rules and agent configurations through version control (use secure channels for sensitive contexts—add to `.gitignore` for public repositories). Team members replicate project intelligence instantly, ensuring consistent AI behavior. Code reviews reference specifications as acceptance criteria, and Q CLI assists reviews: "Review this PR against our architecture guidelines in .amazonq/rules/architecture/".

## Rust integration patterns

Amazon Q CLI's Rust implementation makes it a natural fit for Rust development workflows. **The Q CLI repository itself serves as a reference for Rust best practices** with modern patterns, comprehensive testing, and idiomatic code. This integration works bidirectionally—use Q CLI to develop Rust projects, and understand Q CLI's architecture by studying its Rust codebase.

Setting up for Rust development starts with the official repository. Clone from `github.com/aws/amazon-q-developer-cli`, install the Rust toolchain with rustup, configure nightly for formatting (`rustup toolchain install nightly`), and install development tools (`cargo install typos-cli`). Build with `cargo run --bin chat_cli`, run tests with `cargo test`, apply lints with `cargo clippy`, and format code with `cargo +nightly fmt`.

Custom Rust development agents optimize for language-specific workflows. Configure agents with allowed commands for cargo operations: `cargo build`, `cargo test`, `cargo clippy`, `cargo fmt`, `cargo run`. Include project context with resources: `"file://Cargo.toml"`, `"file://README.md"`, `"file://src/**/*.rs"`. Set prompts emphasizing Rust principles: "You are a Rust expert focusing on safety, performance, and idiomatic code. Always consider ownership, borrowing, and lifetime management."

Rust-specific development guidelines encode language best practices in project rules. Create `.amazonq/rules/rust-standards.md` covering ownership patterns, error handling with Result and Option types, async/await usage, unsafe code justification requirements, documentation standards, and testing conventions. These rules ensure Q generates idiomatic Rust following project conventions.

Common Rust development workflows demonstrate Q CLI's capabilities. For new projects: "Create a new Rust web API using Actix Web with async handlers, request validation using serde, proper error handling with thiserror, and comprehensive unit tests." Q scaffolds the project structure, configures dependencies in Cargo.toml, implements handlers with type-safe validation, defines custom error types, and generates test suites.

For refactoring existing code: "Analyze this Rust module and suggest improvements for error handling, reduce unnecessary clones, improve performance with better data structures". Q reads the code, identifies ownership inefficiencies, suggests zero-copy patterns, recommends ergonomic error handling, and implements changes maintaining correctness.

AWS Lambda with Rust benefits from Q CLI's AWS integration. Request: "Create a Rust Lambda function using the lambda_runtime crate that processes S3 events and writes to DynamoDB". Q generates function handler code, configures Cargo.toml dependencies, creates AWS SAM or CDK deployment templates, and provides build instructions for cross-compilation to AWS Lambda's runtime.

Contributing to Q CLI itself leverages spec-driven development. Create feature specifications in markdown, define acceptance criteria and test cases, implement following project conventions, run the full test suite, and submit PRs with clear descriptions referencing specifications. Q CLI maintainers appreciate well-specified contributions that align with project architecture.

## TypeScript and Bun runtime integration

TypeScript enjoys first-class support in Amazon Q CLI with native understanding of type systems, JSX/TSX syntax, and modern JavaScript frameworks. **Bun runtime integration enables blazingly fast TypeScript execution without compilation**, perfect for rapid development cycles and modern web applications.

TypeScript agent configuration optimizes for type-safe development. Allow npm and type-checking commands: `npm install`, `npm test`, `npm run build`, `tsc --noEmit`. Restrict file writes to source directories: `"allowedPaths": ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.test.ts", "package.json", "tsconfig.json"]`. Include project context: `"resources": ["file://package.json", "file://tsconfig.json", "file://README.md"]`. Set prompts emphasizing type safety: "Expert TypeScript developer with focus on type safety and best practices."

Project rules enforce TypeScript standards. Create `.amazonq/rules/typescript-standards.md` specifying strict TypeScript configuration, type hints required for function parameters, interface definitions for complex objects, avoiding `any` type, preferring explicit over implicit types, and comprehensive JSDoc for public APIs. Q follows these rules consistently when generating or refactoring code.

React development with TypeScript demonstrates practical workflows. Request: "scaffold a new application named my-app using React, TypeScript, and Vite". Q executes `npm create vite@latest my-app -- --template react-ts`, runs `npm install`, initializes git with `git init && git add . && git commit -m "Initial commit"`, and provides next steps for development. Continue with: "Create a reusable Button component with TypeScript props interface, variant support (primary/secondary), and comprehensive prop types".

Bun runtime agents leverage Bun's unique capabilities. Configure allowed commands for Bun operations: `bun install`, `bun run`, `bun test`, `bun build`. Include Bun-specific context: `"resources": ["file://package.json", "file://bun.lockb"]`. Set prompts highlighting Bun features: "Expert in Bun runtime, focusing on performance and modern JavaScript/TypeScript patterns using Bun's native APIs."

Native TypeScript execution with Bun eliminates compilation. Request: "Create a web API with Bun.serve using TypeScript, include request validation with Zod, add SQLite database integration using Bun's built-in SQL support". Q generates TypeScript files leveraging Bun.serve for HTTP server, Bun.Database for SQLite operations, native TypeScript without transpilation, and fast startup times for development.

AWS Lambda deployment with Bun requires custom runtimes. Request: "Create a Bun Lambda function with AWS CDK deployment configuration". Q generates the handler code using Bun APIs, build script with `bun build --minify --splitting --target=node`, CDK stack with Bun layer configuration, and deployment instructions. Note that Bun on Lambda remains experimental but shows promising performance characteristics.

Full-stack development combines TypeScript frontend with various backends. Create specialized agents for each layer—frontend agent with Figma MCP server for design integration, backend agent with database MCP servers, infrastructure agent with AWS tools. Switch agents as you work: `q chat --agent frontend` for UI work, `q chat --agent backend` for API development, maintaining separate optimized contexts for each domain.

## Optimizing sessions for joint LLM agent development

Developing in partnership with LLM agents requires intentional workflow design and optimization strategies. **The goal: create frictionless collaboration where human and AI complement each other's strengths** while maintaining code quality and security.

Project structure optimization accelerates agent effectiveness. Create `.amazonq/context/project-introduction.md` with Q's help: "Analyze the code base and provide a summary reading exactly as you would want for introducing yourself to this project. Evaluate which details matter and provide them." Save Q's response as persistent context. Create `.amazonq/context/project-milestones.md` tracking implementation status. Reference these documents in agent resources for instant context in every session.

Tool trust strategies balance convenience with safety. Trust read-only tools for friction-free exploration: `fs_read`, read-only AWS commands, status commands like `git status`. Require approval for modification tools to review changes before applying: `fs_write`, `execute_bash` (except safe commands), `use_aws` write operations. This balance enables rapid prototyping while maintaining control over critical operations.

Agent hooks inject dynamic context automatically. Use `agentSpawn` hooks for static project information: `{"command": "cat .amazonq/context/project-introduction.md"}`, `{"command": "git branch --show-current"}`. Use `userPromptSubmit` hooks with caching for dynamic state: `{"command": "git status --short", "cache_ttl_seconds": 30}`. Hooks eliminate repetitive context commands while keeping Q aware of current state.

Conversation preservation builds institutional knowledge. After successful feature implementations, save conversations to `.amazonq/previous-conversations/feature-name-date.md` with mistakes edited out. These archives provide examples for similar future tasks and document problem-solving approaches. Reference in resources: `"file://.amazonq/previous-conversations/**/*.md"` for learning from past successes.

Markdown-first documentation maximizes agent comprehension. Always write specifications, requirements, and guidelines in markdown format. Q parses markdown most reliably with minimal formatting errors. Use clear hierarchies (H1-H3 headers), code examples with syntax highlighting, tables for structured data, and bullet lists for procedures. Avoid complex formatting or non-standard syntax.

Iterative refinement patterns optimize complex features. Start broad: "Implement user authentication according to spec/auth-spec.md". Q proposes approach. Review and refine: "Use JWT tokens instead of sessions, implement refresh token rotation, add rate limiting on login endpoint". Q adjusts implementation. Test and iterate: "Add unit tests for token validation, handle edge case where token expires during request". This back-and-forth refinement produces production-quality code.

Error recovery strategies maintain momentum. When Q takes wrong directions, interrupt with Ctrl+C without killing the conversation. Redirect: "Stop that approach, let's try using a state machine pattern instead". Q switches tactics while maintaining conversation context. If stuck, compact history to reset: `/compact` then re-approach: "Starting fresh with the state machine design...".

Multi-agent orchestration tackles complex projects. Use the CLI Agent Orchestrator (CAO) framework for hierarchical coordination—supervisor agent manages overall project, worker agents handle specialized tasks (frontend, backend, testing), each agent maintains isolated context, supervisor provides only necessary information to workers. This architecture scales to enterprise projects requiring coordination across disciplines.

## Advanced tips and lesser-known features

Amazon Q CLI contains powerful capabilities often overlooked in standard usage. **Mastering these advanced features** unlocks significant productivity gains for power users.

Experimental features accessed through `/experiment` command enable bleeding-edge capabilities. Knowledge management with semantic search (`chat.enableKnowledge`) enables gigabyte-scale reference materials without context window consumption. Tangent mode (`chat.enableTangentMode`) creates conversation checkpoints for exploring side topics without disrupting main flow. Thinking mode (`chat.enableThinking`) reveals step-by-step reasoning for understanding AI decision-making. Delegate mode (`chat.enableDelegate`) launches parallel agent sessions for concurrent workflows. Activate selectively based on workflow needs.

Model selection flexibility prevents capacity issues. Use `/model` within chat sessions to switch between Claude versions when experiencing overload errors. Claude 3.7 Sonnet provides stable capacity, while Claude 4 Sonnet offers cutting-edge capabilities with potential availability constraints. Switching models mid-conversation maintains context while accessing different model characteristics.

Editor integration for complex prompts transforms long-form input. Use `/editor` to compose multi-paragraph prompts with proper structure, code examples, and detailed specifications. Q opens your `$EDITOR` (configure with `export EDITOR=nano` or `export EDITOR="code -w"` for GUI editors). For GUI editors, the `-w` flag makes the terminal wait until file closes—essential for proper integration.

Right arrow completion accepts inline suggestions fully, avoiding repeated tabbing through long completions. When zsh inline suggestions display gray ghost text, right arrow accepts the entire suggestion immediately. This subtle technique dramatically speeds navigation compared to tab-completing word by word.

Context usage indicators provide real-time monitoring. Enable with `q settings chat.enableContextUsageIndicator true` to display context window consumption percentage in the chat prompt. This continuous visibility enables proactive management, prompting `/compact` usage before hitting limits rather than discovering issues after they occur.

Fuzzy command search accelerates slash command usage. Press Ctrl+S within chat sessions to open fuzzy search of available slash commands. Type partial matches to find commands quickly without memorizing exact syntax. This discovery mechanism helps learn Q CLI's full command set progressively.

Image support for visual context enables sharing screenshots, diagrams, and architecture drawings directly in chat. Q analyzes images for debugging UI issues, discussing design concepts, explaining complex ideas, and reviewing architecture diagrams. This multimodal capability extends beyond text-only interaction for richer collaboration.

Non-interactive mode enables automation and CI/CD integration. Use `q chat --no-interactive --trust-all-tools "prompt"` for scripted workflows where manual confirmation isn't feasible. This mode runs commands unattended, making Q CLI scriptable for automated quality checks, code generation pipelines, or scheduled maintenance tasks.

Regional availability optimizations reduce latency for global teams. Pro tier users access Frankfurt region (`eu-central-1`) for European operations with `q login --region eu-central-1`, minimizing round-trip times for improved responsiveness. Choose regions closest to development teams for optimal performance.

Proxy configuration for enterprise environments supports HTTP, HTTPS, and SOCKS5 proxies through standard environment variables. Configure authenticated proxies with `export HTTPS_PROXY=http://username:password@proxy.company.com:8080`. Q CLI respects standard proxy conventions, integrating seamlessly with corporate network policies.

Profile management enables rapid context switching. Create profiles for different projects (`/profile create project-a`), roles (`/profile create backend-dev`), or clients (`/profile create client-x`). Switch profiles with `/profile set name` to instantly load appropriate contexts, tools, and preferences. Profiles maintain separate workspace contexts while sharing global configurations.

## Performance optimization and efficiency tips

Performance optimization ensures Q CLI sessions remain responsive and efficient across long development workflows. **Strategic resource management, configuration tuning, and workflow patterns** minimize latency and maximize throughput.

Startup performance optimization begins with MCP server management. Background loading initializes servers asynchronously, enabling immediate chat availability. Limit concurrent MCP servers to 3-5 to prevent startup delays—each additional server adds initialization overhead. Configure agent-specific servers rather than loading all globally. Use workspace MCP configurations (`.amazonq/mcp.json`) for project-specific integrations, keeping global configuration minimal.

Context window efficiency requires active monitoring and management. The 75% rule automatically drops files exceeding three-quarters of model's context window, preventing context overflow. Stay below 60-70% utilization proactively using `/usage` command for visibility. Apply `/compact` to summarize conversations approaching limits, dramatically reducing token consumption while preserving logical flow and key decisions.

Token efficiency through specific patterns reduces context consumption. Use targeted glob patterns like `src/**/*.py` instead of overly broad `**/*`. Split large files into focused, smaller files organized by topic. Remove unused context regularly with `/context clear` when switching topics. Leverage knowledge bases for large reference materials that don't require constant presence—they consume zero tokens until explicitly searched.

Resource loading optimization affects agent performance. Order resources by importance—Q processes them sequentially, so prioritize critical context early. Use wildcards judiciously: `**/*.md` loads all markdown files recursively, potentially consuming excessive tokens. Consider explicit paths for frequently changing files to prevent stale context from cached files.

Hook caching reduces redundant command execution. Configure `cache_ttl_seconds` on `userPromptSubmit` hooks for data that changes infrequently: `{"command": "git status --short", "cache_ttl_seconds": 30}`. This caching prevents executing the same command on every message when state remains unchanged, reducing latency and system load.

Network performance optimization leverages proxy configurations properly. Use `HTTP_PROXY` and `HTTPS_PROXY` for routing through corporate proxies. Configure `NO_PROXY` for local services to avoid unnecessary proxy routing: `export NO_PROXY=localhost,127.0.0.1,.company.local`. Test connectivity with `q doctor` after configuration changes to verify proper routing.

MCP server timeout tuning balances responsiveness with reliability. Default 60000ms (60 seconds) works for most servers. Increase for slow network operations or complex queries: `"timeout": 120000`. Decrease for fast local services to fail quickly: `"timeout": 30000`. Monitor logs in `$TMPDIR/qlog/mcp.log` to identify timeout issues requiring adjustment.

Conversation management patterns prevent context bloat. Save and clear conversations regularly rather than accumulating unlimited history. Use `--resume` for automatic session management per directory, maintaining separate conversation streams for different projects. Archive completed work with `/save feature-name` before starting new major features, enabling clean context for new initiatives.

Log management prevents disk space issues from accumulating verbosity. Logs in `$TMPDIR/qlog/` or `$XDG_RUNTIME_DIR/qlog/` grow continuously. Review log file sizes periodically with `du -sh $TMPDIR/qlog/`. Delete old logs when troubleshooting completed. Configure log levels appropriately—use `Q_LOG_LEVEL=info` for normal operation, `Q_LOG_LEVEL=debug` only when diagnosing issues.

Model capacity optimization addresses overload errors. Claude 4 Sonnet experiences frequent capacity constraints during peak usage. Switch to Claude 3.7 or 3.5 Sonnet with `/model` when encountering overload errors. Implement retry logic with exponential backoff in automation scripts: maximum 10 attempts, initial backoff 1000ms, exponential growth 2^(attempt-1). Community members have contributed retry implementations addressing this common issue.

Knowledge base indexing choices affect performance. Fast indexing (BM25 lexical search) provides immediate results for keyword matches, ideal for logs and configuration files. Best indexing (AI embeddings) delivers semantic understanding for documentation and research papers, requiring longer indexing time but superior relevance. Choose indexing strategy based on content type and query patterns.

## Troubleshooting common issues and limitations

Understanding common issues and their solutions prevents frustration and maintains productivity. **Systematic troubleshooting approaches and awareness of platform limitations** enable quick resolution of most problems.

ModelOverloadedError represents the most frequently reported issue, occurring when AWS services experience high traffic or resource constraints. The error message "Amazon Q is having trouble responding right now" typically indicates model capacity limits. Solutions include switching models with `/model` to Claude 3.7 or 3.5 Sonnet variants with better capacity, implementing retry mechanisms with exponential backoff (community solution with 10 attempts, initial backoff 1000ms), or manually retrying after brief pauses. Pro tier subscriptions provide higher request limits reducing exposure.

Authentication errors manifest as "The bearer token included in the request is invalid" AccessDeniedException errors. This indicates expired or invalid credentials preventing API calls. Resolve by running `q login` to re-authenticate, removing outdated credentials from `~/.aws/amazonq/`, verifying IAM permissions for Amazon Q, checking Builder ID or IAM Identity Center configuration, and for Pro users confirming active subscription status. Check current authentication with `q whoami`.

Filesystem write errors occur when attempting to write to directories instead of files, producing "Is a directory (os error 21)" errors. Solutions specify exact file paths instead of directories, use `fs_write` tool with proper file paths in tool settings, and configure `allowedPaths` in agent configuration restricting write operations to valid file targets. Review logs at `$TMPDIR/qlog/qchat.log` for specific path issues.

Shell integration installation errors prevent proper terminal integration. Run `q doctor` to diagnose integration issues, manually enable shell integration via terminal commands, verify shell path configuration (zsh, bash, fish), check file permissions in `~/.local/bin/` and shell config files, and restart shell sessions after installation. Some Linux distributions require explicit PATH configuration in shell RC files.

MCP server connection errors appear as "Background listening thread for client [server-name]: RecvError(Closed)" or timeout messages. Verify MCP server command and executable exist in PATH, check environment variables are properly set, increase timeout values in mcp.json configuration, test MCP servers independently before integration, and review logs in `$TMPDIR/qlog/mcp.log`. Common issues include incorrect command paths, missing dependencies, or overly aggressive firewalls blocking stdio communication.

Platform limitations affect deployment strategies. Amazon Q CLI officially supports only macOS and Linux—Windows requires WSL2 for complete functionality. Install WSL2 on Windows 11, use Ubuntu distribution within WSL, and configure VS Code to connect to WSL environment for integrated development. Native Windows support remains a frequently requested feature.

Context limitations require workflow adjustments. Cannot execute bash commands directly within chat session without using tool permissions. Must configure tools properly or use agent-defined allowed commands. The 75% context window limit automatically drops files exceeding this threshold. Use knowledge bases for large datasets, specific glob patterns for targeted inclusion, and regular `/compact` operations for long sessions.

Tool permissions create workflow friction without proper configuration. Tools require user confirmation by default except `fs_read` and `report_issue`. Configure `allowedTools` array in agent configuration for friction-free workflows, use `/tools trust` command during chat sessions for temporary trust, and set up `toolsSettings` with `allowedCommands`, `allowedPaths`, and `allowedServices` for granular control.

Diagnostic workflows solve most issues systematically. Start with `q doctor` to identify common problems. Check logs in `$TMPDIR/qlog/` or `$XDG_RUNTIME_DIR/qlog/` for detailed error messages. Run with debug logging (`Q_LOG_LEVEL=debug q chat`) to increase verbosity for troubleshooting. Use `q version --changelog` to verify current version and recent changes. Report persistent issues with `q issue` command that creates detailed GitHub issues with system information.

Configuration validation prevents JSON syntax errors. Use online JSON validators or IDE extensions before saving. Common errors include trailing commas (invalid in JSON), unquoted keys, single quotes instead of double quotes, and incorrect nesting. Use `/agent schema` to verify agent structure against official schema. Test agents in isolated sessions before production use.

## Configuration examples and practical patterns

Real-world configuration examples demonstrate proven patterns for different use cases. **These examples serve as starting points for custom agent development** and workflow optimization.

Basic development agent provides minimal configuration for getting started. Includes read and write file operations, bash execution, and basic context: `{"name": "basic-dev", "tools": ["fs_read", "fs_write", "execute_bash"], "allowedTools": ["fs_read"], "resources": ["file://README.md"]}`. This simple agent requires approval for all write operations, providing safety while learning Q CLI capabilities.

Security-focused agent restricts file access and command execution extensively. Defines allowed paths limiting read access to project directories, denied paths protecting sensitive locations like `.ssh` and `.aws`, allowed commands permitting only safe operations, denied commands blocking dangerous operations, and denyByDefault setting requiring explicit approval for unlisted commands. This configuration suits production environments or untrusted codebases.

AWS infrastructure agent manages cloud resources with service restrictions. Configures `use_aws` tool with `allowedServices` listing specific services like `["s3", "lambda", "cloudformation"]`, `deniedServices` blocking dangerous services like `["eks", "rds"]` in development, and `autoAllowReadonly` automatically approving read operations. Includes infrastructure documentation in resources and git hooks showing current infrastructure state.

Database development agent integrates PostgreSQL through MCP servers. Embeds MCP server configuration in agent definition, exposes database tools with naming aliases, restricts tools to read-only operations initially, and includes database schema documentation in resources. This pattern extends to any database with available MCP servers.

Frontend development agent for React includes Figma integration via MCP servers for design collaboration, file restrictions allowing writes only to `src/` and `tests/` directories, allowed commands for npm operations and dev server, and resources loading package.json, component guidelines, and design system documentation. Enables design-to-code workflows with visual reference.

Backend development agent separates concerns from frontend work. Includes different MCP servers for API documentation and database access, different file path restrictions focusing on backend directories, different allowed commands for server operations and API testing, and different resources focusing on API specifications and architecture documentation. Switching agents (`q chat --agent frontend` vs `q chat --agent backend`) automatically switches contexts.

Multi-environment agents handle development versus production contexts. Development agent includes permissive tool access, full AWS service access, write permissions throughout codebase, and verbose logging enabled. Production agent includes read-only emphasis, restricted AWS services, limited write access to logs only, and security scanning tools enabled. Use appropriate agent based on current task to prevent accidents.

Monorepo agent configuration handles large codebases. Uses specific glob patterns targeting relevant directories: `"resources": ["file://packages/auth/**/*.md", "file://packages/api/**/*.md"]`. Includes workspace-specific rules for different packages. Configures knowledge bases for API documentation searchable on-demand. Enables context isolation preventing unrelated package context from polluting conversations.

Testing-focused agent emphasizes test generation and execution. Allows test framework commands (jest, pytest, cargo test), restricts writes to test directories only, includes test fixtures and examples as resources, and configures hooks running test suites before responses. This agent helps maintain test coverage through AI-assisted test generation.

## Staying current and future capabilities

Amazon Q CLI evolves rapidly with frequent feature additions and improvements. **Staying informed about updates and upcoming capabilities** ensures developers leverage new functionality as it becomes available.

Release tracking mechanisms include built-in changelog access via `q version --changelog` command, GitHub releases page at github.com/aws/amazon-q-developer-cli/releases, AWS DevOps and Developer Productivity blog for major announcements, and AWS re:Invent and re:Mars conferences for strategic direction. Enable beta features early with `q settings app.beta true` to access experimental capabilities before general availability.

Recent significant enhancements demonstrate evolution trajectory. March 2025 brought enhanced CLI agent powered by Claude 3.7 Sonnet with agentic capabilities including file operations, command execution, and iterative debugging. April 2025 added Model Context Protocol support enabling standardized external integrations. Ongoing improvements include conversation persistence, image support, context management enhancements, regional expansion, and MCP management tools.

Experimental features preview future capabilities. Knowledge management with semantic search enables large-scale reference materials. Tangent mode supports conversation branching for exploring alternatives without losing main thread. Delegate mode provides asynchronous task orchestration with parallel agent sessions. Checkpoint mode offers git-based session snapshots for time-travel debugging. TODO lists enable persistent task tracking across sessions. These experimental features often graduate to stable releases after community validation.

Community contributions drive feature development. The open-source nature enables community members to submit pull requests addressing issues, propose feature enhancements, share configuration examples and patterns, and develop complementary tools like MCP servers. Key community projects include CLI Agent Orchestrator for multi-agent coordination, Q-Vibes Memory Banking framework for rapid prototyping, Neovim integration plugin, and Spec-Kit MCP integration for spec-driven workflows.

Future directions indicated by recent announcements include IDE plugin MCP support for unified experience across CLI and editors, Windows native support improvements reducing reliance on WSL, additional language support expansions beyond current coverage, enhanced agent capabilities with more sophisticated reasoning, deeper AWS service integrations with specialized tools, and team collaboration features for shared contexts and agent libraries.

Subscription considerations affect feature access. Free tier (AWS Builder ID) provides 50 agentic chat interactions monthly, full CLI access, and basic features—sufficient for individual developers and side projects. Pro tier ($19/month) unlocks 1000 agentic requests monthly, regional availability options, full MCP support, priority feature access, and enterprise IAM integration. Pro tier suits professional developers using Q CLI as primary development interface.

Best practices for staying current include regularly running `q update` to install latest versions, monitoring AWS blogs for announcement posts, participating in GitHub discussions for feature requests, enabling experimental features selectively to test capabilities, providing feedback through `q issue` command for bugs and suggestions, and joining AWS community forums for discussions and patterns. Active engagement with the ecosystem accelerates learning and influences product direction.

## Comprehensive workflow example

A complete workflow example demonstrates how all these concepts integrate into production development. **This end-to-end scenario** illustrates spec-driven development from initial planning through deployment.

Project initialization establishes foundation. Create project directory and structure: `mkdir payment-service && cd payment-service`. Initialize spec-driven directories: `mkdir -p .amazonq/rules spec docs`. Create git repository: `git init`. Write initial specification: Create `spec/SPEC.md` defining technical stack (Node.js with TypeScript, Express.js, PostgreSQL, Redis for caching), core features (payment processing, webhook handling, retry logic), architecture patterns (event-driven, saga pattern for distributed transactions), and quality requirements (80% test coverage, comprehensive error handling).

Agent configuration optimizes workflow. Create `.amazonq/cli-agents/payment-dev.json` including PostgreSQL MCP server for database operations, allowed tools for file operations and TypeScript/Node.js commands, resources loading specifications and project rules, and hooks showing git status and database connection state. This agent provides everything needed for backend development without manual context management.

Project rules encode standards. Create `.amazonq/rules/typescript-standards.md` requiring strict TypeScript, comprehensive type definitions, and proper error handling. Create `.amazonq/rules/architecture-patterns.md` defining event-driven patterns and database transaction management. Create `.amazonq/rules/security-policies.md` specifying input validation, secrets management, and audit logging requirements. These rules guide Q's code generation consistently.

Development workflow follows spec-driven process. Start Q with project context: `q chat --agent payment-dev`. Initial implementation: "Build the payment processing API according to spec/SPEC.md, starting with data models and repository layer". Q reads specifications, generates TypeScript interfaces matching data models, creates repository classes with proper error handling, implements unit tests, and commits to git with descriptive message.

Iterative refinement adds features. Request: "Add Stripe payment integration with webhook handling for asynchronous payment confirmations". Q installs Stripe SDK, implements webhook endpoint with signature verification, creates event handlers for different payment statuses, adds retry logic with exponential backoff, and generates integration tests. Review code: "Ensure webhook handling follows the saga pattern described in architecture-patterns.md". Q refactors to align with specifications.

Database operations leverage MCP integration. Request: "Use the knowledge tool to query the database schema and verify our payment model matches". Q uses PostgreSQL MCP server to inspect schema, compares with TypeScript models, identifies discrepancies, and suggests migrations. Implement: "Generate migration scripts to align database with current models". Q creates SQL migrations with proper up/down scripts.

Testing and validation ensure quality. Request: "Generate comprehensive test suite covering happy path, error cases, edge cases, and concurrent operations". Q creates unit tests for business logic, integration tests for API endpoints, performance tests for concurrent payments, and security tests for input validation. Run tests: "Execute test suite and analyze coverage". Q runs tests, reports results, identifies gaps, and suggests additional test cases.

Deployment preparation follows infrastructure-as-code. Request: "Create AWS CDK stack for deploying this service with RDS PostgreSQL, ElastiCache Redis, Application Load Balancer, and ECS Fargate". Q generates TypeScript CDK code defining infrastructure, configures security groups and IAM roles, creates deployment pipeline with GitHub Actions, and documents deployment procedures.

Documentation generation captures decisions. Request: "Generate comprehensive API documentation including endpoint specifications, request/response examples, error codes, and rate limiting". Q creates OpenAPI specification, generates markdown documentation, includes code examples in multiple languages, and documents error handling patterns.

The session demonstrates spec-driven development's power: specifications guided every decision, context persistence eliminated repeated explanations, rules ensured consistency across all code, MCP integration enabled database awareness, and iterative refinement produced production-quality results. The complete workflow from initialization to deployment consumed approximately two hours—orders of magnitude faster than traditional development while maintaining high quality standards.

## Conclusion

Amazon Q CLI represents a fundamental shift in command-line development, transforming terminals from simple command executors into collaborative AI-powered development environments. The true power emerges not from isolated features but from their integration—custom agents with tailored tools and permissions, project rules encoding development standards, persistent context maintaining project intelligence, MCP servers extending capabilities to any external system, and spec-driven workflows treating specifications as executable contracts.

Success requires intentional investment in project structure and configuration. Spend time crafting effective specifications that guide development. Build agent configurations matching workflow needs. Encode team standards in project rules that ensure consistency. Leverage MCP integration for domain-specific tooling. Monitor and optimize context usage proactively. These upfront investments compound over time, accelerating development while improving quality.

The open-source Rust implementation, Claude 3.7 Sonnet's reasoning capabilities, and active AWS development ensure Q CLI continues evolving. Early adopters gain advantages as experimental features mature and new integrations emerge. Organizations embracing spec-driven development with Q CLI report dramatic productivity improvements while maintaining engineering rigor.

This comprehensive reference provides everything needed to master Amazon Q CLI—from foundational concepts through advanced optimization techniques. The journey from beginner to power user follows exploration of commands and features, experimentation with custom agents and configurations, refinement based on real-world usage, and ultimately mastery through understanding how all components integrate into cohesive workflows. Amazon Q CLI's potential grows with your expertise, scaling from simple assistance to sophisticated multi-agent orchestration powering enterprise development.