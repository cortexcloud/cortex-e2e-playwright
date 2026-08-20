---
name: e2e-testcase-creation-standard
description: Workflow, architecture separation rules (Global vs Local), and distinctions between utils and fixtures when creating new Playwright E2E test cases.
---

# E2E Testcase Creation Standard Skill

Guidelines and rules for adding new E2E test cases, classifying Global vs Local components, and understanding framework architecture.

## 1. Distinction: `utils/` vs `fixtures/`

| Feature | `utils/` (Utility Functions) | `fixtures/` (Playwright Fixtures) |
|---|---|---|
| **Code Type** | Standalone Pure JavaScript Functions | Playwright Test Execution Lifecycle Extensions |
| **Primary Purpose** | Data calculation, string generation, formatting | Environment state management (Setup & Teardown, Auto-Login) |
| **Invocation** | Manually imported and invoked (`generateThaiCitizenID()`) | Injected automatically into `test(...)` parameters (`{ authenticatedPage }`) |
| **Playwright Dependency** | None (Independent Pure JS) | Strongly tied to `@playwright/test` runner lifecycle |
| **Example File** | `utils/identityGenerator.js` | `sites/nuh/fixtures/auth.js` |

---

## 2. Global vs Local Scope Decision Matrix

When adding or modifying components, use this matrix to decide where files and code belong:

| Component Layer | Global Scope (Shared Framework Base) | Local Scope (Site-Specific Workspace) |
|---|---|---|
| **Locators Dictionary** | `pages/<feature>/<feature>Locators.js` (Shared selector strings used across all hospital sites) | Custom locators override inside `sites/<site>/pages/<Feature>Page.js` (if site UI differs) |
| **Page Object Classes** | `pages/<feature>/<Feature>Page.js` (Base class containing standard Action and Assertion methods) | `sites/<site>/pages/<Feature>Page.js` (Subclass extending Base class for site-specific URLs/behaviors) |
| **Test Data** | Non-sensitive shared data schemas | `sites/<site>/test_data/*.json` (`auth.json`, `config.json` containing site credentials and URLs) |
| **Fixtures** | `fixtures/auth.js` (Shared fixture implementation) | `sites/<site>/fixtures/auth.js` (Site-specific re-export) |
| **Utilities** | `utils/` (`identityGenerator.js`, `authHelper.js`) | Local utility scripts specific to a single site |
| **Test Specs** | - | `sites/<site>/tests/` (`login.spec.js` for Module Tests, `flow_med.spec.js` for E2E Flow Tests) |

---

## 3. 5-Step Workflow for Adding a New Test Case

Follow these 5 steps when implementing any new E2E test case:

### Step 1: Inspect UI & Locators
- Verify if target UI elements have `data-testid` attributes matching standard format `[module]:[component]:[element]__[modifier]`.
- Add new selector strings to `pages/<feature>/<feature>Locators.js`.

### Step 2: Update Page Object Methods
- Add action methods (e.g. `selectDoctor()`) or assertion methods (e.g. `assertPrescriptionSuccess()`) in `pages/<feature>/<Feature>Page.js`.
- If site-specific customization is required, override in `sites/<site>/pages/<Feature>Page.js`.

### Step 3: Configure Test Data
- Add required test inputs, credentials, or expected strings to `sites/<site>/test_data/*.json`.
- Do not hardcode test data or credentials directly inside test spec files.

### Step 4: Write Test Spec (`.spec.js`)
- Create spec file in `sites/<site>/tests/<module>.spec.js` (for single module test) or `sites/<site>/tests/flow_<feature>.spec.js` (for full E2E flow test).
- Assign appropriate tags (`@Module`/`@E2E`, `@Regression`, `@HappyPath`/`@NegativePath`, `@Site`).

### Step 5: Execute Verification & Inspect Report
- Run local verification: `npx playwright test --config=playwright.sites.config.ts --project=<site> --grep "@Tag"`
- Inspect Playwright HTML report: `npx playwright show-report`
