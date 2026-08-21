---
name: git-flow-standard
description: Multi-tier Git workflow standards, branching strategy, QA integration branches, Conventional Commits, explicit file staging, version tagging, and push approval protocols.
---

# Git Flow Standard Skill

Guidelines and rules for managing Git branches, commit messages, file staging, tagging, and pull request approvals across multi-site QA automation teams.

## 1. Multi-Tier Branching Strategy

To maintain repository stability and prevent merge conflicts across different hospital site QA teams, Git branches follow a 3-tier structure:

```bash
main (Production / Stable Framework)
 └── site/nuh (NUH QA Team Integration Branch)
 │    ├── feat/nuh-login-flow (Individual QA Working Branch)
 │    └── feat/nuh-opd-walkin (Individual QA Working Branch)
 │
 └── site/tmh (TMH QA Team Integration Branch)
      └── feat/tmh-pharmacy (Individual QA Working Branch)
```

### Branch Types & Naming Conventions

1. **Main Branch (`main`)**:
   - Master production branch containing verified, stable code.
   - **Strict Rule**: Direct commits or pushes to `main` are strictly forbidden.

2. **Site / QA Integration Branch (`site/[site_name]`)**:
   - Integration branch for each hospital QA team (e.g. `site/nuh`, `site/tmh`).
   - Serves as the primary target branch where individual QA team members merge their completed work.

3. **Individual Feature / Bugfix Branch (`feat/[site]-[desc]` or `fix/[site]-[desc]`)**:
   - Working branch created by individual QA engineers for specific tasks or ticket IDs.
   - Examples: `feat/nuh-login-flow`, `fix/nuh-locator-triage`, `feat/tmh-opd-queue`.

---

## 2. Promotion & Merge Workflow

All code contributions must follow this 4-step promotion path:

### Step 1: Create Feature Branch
Branch off from your site integration branch:
```bash
git checkout site/nuh
git pull origin site/nuh
git checkout -b feat/nuh-opd-walkin
```

### Step 2: Explicit Staging & Conventional Commit
Verify status and stage files explicitly (never use wildcards):
```bash
git status
git add sites/nuh/test_data/opd.json sites/nuh/tests/opd_walkin.spec.js
git status
git commit -m "feat(nuh): add opd general medicine walk-in flow"
```

### Step 3: Merge to Site Integration Branch
Merge feature branch into `site/nuh`:
```bash
git checkout site/nuh
git pull origin site/nuh
git merge feat/nuh-opd-walkin
git push origin site/nuh
```

### Step 4: Promote to Main Branch & Tag Version
After regression testing passes on `site/nuh`, create a Pull Request to merge `site/nuh` into `main` and create a release tag:
```bash
git checkout main
git pull origin main
git merge site/nuh
git tag -a v1.0.0 -m "v1.0.0: Initial release of multi-site Playwright E2E framework"
git push origin main
git push origin v1.0.0
```

---

## 3. Strict Staging & Commit Message Standards

### Staging Rules
- **No Wildcards**: Never run `git add .` or `git add *`. Always stage specific files or directories explicitly.
- **Pre & Post Verification**: Always run `git status` before and after staging to confirm staged items.

### Conventional Commits Format
Format: `<type>(<scope>): <short description>`

Available Types:
- `feat`: A new feature or test spec
- `fix`: A bug fix (locator adjustment, script fix)
- `docs`: Documentation changes (`README.md`, skills)
- `style`: Formatting, semi-colons (no logic change)
- `refactor`: Restructuring code without changing functionality
- `test`: Adding or correcting tests
- `chore`: Updating dependencies, package.json, configs

Available Scopes:
- `nuh`, `tmh`, `sbh`, `core`, `config`, `locators`

Examples:
- `feat(nuh): add login happy and negative path specs`
- `refactor(core): move login page objects into pages/login/`
- `docs(readme): add RACI responsibility matrix and git flow rules`

---

## 4. Approval & Safety Protocols

- **Explicit Approval Required**: AI agents and automated scripts are forbidden from running `git push` or merging branches autonomously without the user's explicit review and approval of the diff.
- **Compiler / Test Check Required**: Run `npx playwright test --config=playwright.sites.config.ts --project=<site> --list` or execute test verification before proposing commit/push.
