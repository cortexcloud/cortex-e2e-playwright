# AI Coding Agent Standards and Rules

As an AI coding agent working in this workspace, you MUST strictly adhere to the following workflow, planning, and Git control standards. These rules are mandatory to maintain quality, coordinate cleanly with the developer, and prevent data loss or conflicts.

---

## Part I: Agent Execution & Workflow Rules

When you receive any command, instruction, or task request from the user, you MUST follow these execution guidelines before modifying any code:

### 1. Analysis and Gap Identification
- **Analyze First**: Before suggesting any solution or writing code, perform a thorough analysis of the requirements and the codebase.
- **Identify Missing Requirements**: Actively look for gaps, contradictions, or missing details in the user's request.
- **Ask Clarifying Questions**: Present a clear list of questions to the user regarding any missing information or ambiguities before proceeding. Do not make assumptions.

### 2. Strict Objectivity (No Hype or Sugarcoating)
- **Provide Objective Critiques**: Never oversell a solution, use empty marketing buzzwords, or sugarcoat designs. Be 100% honest and objective.
- **Always Challenge Decisions**: Critically review the proposed approach, list its concrete tradeoffs, and ask questions to verify if it is indeed the best path for this system's architecture.

### 3. Mandatory Planning
- **Plan Before Action**: You are FORBIDDEN from making code changes or running modifying commands before presenting a detailed implementation plan.
- **Document the Plan**: Create or update the `implementation_plan.md` artifact detailing your findings, proposed files, and changes, and wait for the user's explicit approval.

### 4. Phased Execution & Prioritization
- **Divide into Phases**: Break down complex tasks into smaller, logical implementation phases (e.g., Phase 1: Setup, Phase 2: Page Objects, Phase 3: Workflows, Phase 4: Specs).
- **Prioritize Tasks**: Order the phases and tasks logically (dependencies first, high-priority features next) to ensure a stable step-by-step build.

### 5. Jira-like Task Cards and Status Tracking
- **Create Task Cards**: Under your `task.md` or similar task tracker, structure work as Jira-like task cards (e.g., ticket ID, task description, status).
- **Continuous Status Updates**: Every time you complete a task or a phase, you MUST immediately update its status in the task list (e.g., from `[ ]` to `[x]`) before moving to the next task.

### 6. Minimal Icons and Symbol Usage
- **No Unnecessary Emojis or Icons**: You are FORBIDDEN from using unnecessary emojis, icons, decorative symbols, or ASCII art in source code, comments, docstrings, log messages, commit messages, and documentation unless explicitly requested by the user. Keep code, logs, and text clean, readable, and standard.

### 7. Explicit Notification Before Renaming API / Method Signatures
- **Inform & Confirm First**: Before renaming any existing function, class, variable, or method signature in shared modules, the agent MUST explicitly inform the user, explain the technical rationale, and obtain explicit user confirmation before applying the change.

---

## Part II: Git Control Rules and Standards

### 8. Pre-Change Check Rules
- **Verify Clean State**: Before making any code modifications, you MUST run `git status` to verify if there are any uncommitted changes made by the user.
- **Consult User on Stash/Commit**: If the workspace has uncommitted changes, do NOT overwrite them. Warn the user or ask for permission to proceed.
- **Ensure Latest Code**: Always pull the latest code using `git pull` (or request/recommend the user to run it if write permission to remote is not set) before starting a new task, to avoid merge conflicts.

### 9. File Staging (Staging Rules)
- **NO Wildcards**: NEVER run `git add .` or `git add *`. This is to prevent accidentally staging sensitive files like `.env`, local configuration files, or build artifacts.
- **Explicit Add**: Always stage files individually or by specific folders. E.g., `git add products/cortex/config/sites/nuh/config.ts`.
- **Double Check Status**: Always run `git status` after staging to confirm exactly what files are ready for commit.

### 10. Commit Message Standards (Conventional Commits)
All commit messages written by you MUST follow the Conventional Commits specification.
- **Format**: `<type>(<scope>): <short description>`
- **Available Types**:
  - `feat`: A new feature (e.g. adding a new page object, flow, or testcase).
  - `fix`: A bug fix (e.g. fixing a locator, flaky test, or script failure).
  - `docs`: Documentation changes (e.g. updating README.md or architecture doc).
  - `style`: Changes that do not affect the meaning of the code (e.g. formatting, missing semi-colons).
  - `refactor`: A code change that neither fixes a bug nor adds a feature (e.g. reorganizing directory layout).
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Updating build tasks, package manager configs, etc.
- **Scope**: Must specify the module or hospital site affected. E.g., `nuh`, `tmh`, `sbh`, `core`, `config`.
- **Examples**:
  - `feat(nuh): add opd general medicine walk-in flow`
  - `fix(core): improve base page click method auto-retry`

### 11. Branching Standards & Naming Conventions
- **Naming Format**: Always follow `neran/[module]-[feature]` (or `feat/[module]-[feature]`).
  - Example: `neran/reception-create-patient`
  - Structure: `[developer]/[module-name]-[feature-name]` using all lowercase and kebab-case.
- **No Direct Master Commit**: Never commit or push directly to `main` or `master` branches unless explicitly instructed by the user. Always work on feature branches.

### 12. Merging and Pushing Rules
- **Explicit Approval Required**: You are FORBIDDEN from running `git push` or merging branches autonomously without the user's explicit review and approval of the final diff.
- **Verification Before Commit/Push**: You must run compiler check (e.g., `npx tsc --noEmit` or playwright validation) to verify that your changes compile successfully before suggesting any commit or push.
