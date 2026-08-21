# Cortex E2E Playwright — Agent Instructions

This project has detailed AI coding agent standards checked into the repo. **Read these before
writing or editing any code, every session, not just when asked to check compliance:**

- [.agents/AGENTS.md](.agents/AGENTS.md) — mandatory planning workflow, Git control rules
  (branching, staging, Conventional Commits), no-emoji rule, explicit-approval-before-push.
- [.agents/skills/e2e-testcase-creation-standard/SKILL.md](.agents/skills/e2e-testcase-creation-standard/SKILL.md) —
  Global vs Local architecture (`pages/<feature>/` base classes vs `sites/<site>/pages/`
  subclasses), utils/ vs fixtures/ distinction, 5-step workflow for new test cases.
- [.agents/skills/git-flow-standard/SKILL.md](.agents/skills/git-flow-standard/SKILL.md) —
  branching strategy, promotion path, commit message format.
- [.agents/skills/datatest-id-standard/SKILL.md](.agents/skills/datatest-id-standard/SKILL.md) —
  `data-testid` naming convention for the app UI (relevant when coordinating with UI devs, not
  something test code itself can enforce — the app doesn't always follow it).

## High-violation-risk checklist (embedded here because it keeps getting missed)

Before writing or editing a `*.spec.js` file:
- [ ] No literal test input data (names, dates, ages, IDs, clinic names, credentials) hardcoded
      inline in the spec — put it in `sites/<site>/test_data/*.json` and `require()` it in.
      This has been missed twice in this repo already (`create_visit.spec.js` clinic constants,
      `registration.spec.js` TC05/TC06 dob/age literals) — check every new `const x = 'literal'`
      or `const x = <number>` inside a test body against this rule.
- [ ] No fabricated/fake fallback data either (e.g. a hardcoded HN that may not exist in the real
      system) — if data must exist for real, generate + register it via the UI
      (`utils/patientGenerator.js` + the relevant Page Object), don't invent it.
- [ ] No emoji anywhere in source code, comments, docstrings, log messages, or commit messages
      (AGENTS.md #6). Plain `NOTE:` / `WARNING:` prefixes instead.
- [ ] New locators go in `pages/<feature>/<feature>Locators.js` (shared) — never inline CSS/XPath
      strings inside a Page Object or spec file.
- [ ] New Page Object logic goes in the base class `pages/<feature>/<Feature>Page.js`; only
      site-specific overrides (URL, path) belong in `sites/<site>/pages/<Feature>Page.js`.
- [ ] Tags on every test: site (`@NUH`/`@TMH`/`@SBH`), `@Module` or `@E2E`, `@HappyPath` or
      `@NegativePath`, `@Regression` (or `@Smoke`).
- [ ] Before assuming a selector, route, or navigation pattern works, verify it against a real
      DOM inspection (or ask for one) — this codebase has embedded iframes
      (`iframe[src*="/reception/embedded/"]`) with routes that behave inconsistently: some
      support direct `page.goto()`, others require in-app UI navigation. Don't assume either way
      without evidence; guessed selectors have caused repeated debugging cycles here.

Before running `git add`/`git commit`: re-read AGENTS.md Part II — no wildcard staging, run
`npx playwright test --config=playwright-<site>.config.ts --list` first, Conventional Commits
format, never push/merge without explicit user approval.
