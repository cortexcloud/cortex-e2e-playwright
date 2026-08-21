# Multi-Site Playwright E2E Testing Framework

Shared testing infrastructure supporting multi-hospital site test automation (NUH, TMH, etc.) with automated site configuration detection, feature-based page object inheritance, separated locator dictionaries, and test data isolation.

## Framework Features

- **Multi-Site Architecture**: Supports independent site execution while inheriting shared base Page Objects and utilities.
- **Feature-Based Page Object Model**: Organizes page classes and locator dictionaries into feature modules (e.g. `pages/login/`).
- **Separated Locators Layer**: Isolates raw CSS/XPath/ID selector strings into pure locator files (`loginLocators.js`).
- **Data-Driven Testing**: Keeps test data (`auth.json`, `config.json`) separate from test code for non-coding QA accessibility.
- **Tag-Based Test Execution**: Supports test execution filtering using tags (`@Module`, `@Login`, `@E2E`, `@Flow`, `@MED`, `@Regression`, `@HappyPath`, `@NegativePath`).
- **Custom Auto-Auth Fixtures**: Provides pre-authenticated page fixtures (`authenticatedPage`) for skipping repetitive login steps in full E2E flow tests.

---

## Project Structure

```bash
cortex-e2e-playwright/
├── fixtures/                           # Global Fixtures
│   ├── api.js                          # Global API context fixtures
│   └── auth.js                         # Global authentication fixtures
│
├── pages/                              # Shared Base Page Object Models (Feature-Based)
│   ├── login/                          # Login Feature Module
│   │   ├── loginLocators.js            # Selector dictionary for Login
│   │   └── LoginPage.js                # Base Page Object Class for Login
│   └── reception/                      # Reception / Registration Feature Module
│       ├── receptionLocators.js        # Selector dictionary for Reception
│       ├── CreatePatientPage.js        # Base Page Object Class for Patient Creation
│       └── SearchPatientPage.js        # Base Page Object Class for Patient Search
│
├── utils/                              # Shared Utility & Helper Functions
│   ├── authHelper.js                   # Authentication helper functions
│   ├── identityGenerator.js            # Thai CID and Passport generator functions
│   ├── patientGenerator.js             # Patient data mock generator functions
│   └── patientStorage.js               # Temporary patient data persistence helper
│
├── tests/                              # Shared / Core Tests
│   ├── unit/                           # Developer Unit Tests for Utilities
│   │   ├── README.md                   # Documentation for Unit Tests
│   │   ├── identityGenerator.spec.js   # Unit test suite for identity generators
│   │   ├── patientGenerator.spec.js    # Unit test suite for patient generator
│   │   └── patientStorage.spec.js      # Unit test suite for patient storage helper
│   ├── login.spec.js                   # Shared Login test spec
│   └── opd_walkin.spec.js              # OPD Walk-in workflow spec
│
├── sites/                              # Site-Specific Code Directory
│   ├── nuh/                            # NUH Hospital Site Directory
│   │   ├── test_data/                  # Site Test Data
│   │   │   ├── auth.json               # Credentials (physician, nurse, etc.)
│   │   │   ├── config.json             # Site URLs and path endpoints
│   │   │   ├── patient.json            # Patient test data template
│   │   │   ├── created_patients.json   # Dynamic test execution patient log
│   │   │   └── search_mockup.json      # Mockup data for patient search
│   │   ├── pages/                      # Site-Specific Page Objects
│   │   │   ├── LoginPage.js            # NUH LoginPage subclass
│   │   │   ├── CreatePatientPage.js    # NUH CreatePatientPage subclass
│   │   │   └── SearchPatientPage.js    # NUH SearchPatientPage subclass
│   │   ├── fixtures/                   # Site Fixtures
│   │   │   └── auth.js                 # Site authenticatedPage fixture
│   │   └── tests/                      # Site Test Specs
│   │       ├── login.spec.js           # Login Module Test (@Module @Login)
│   │       ├── registration.spec.js    # Patient Registration Test (@Module @Registration)
│   │       └── search_patient.spec.js  # Patient Search Test (@Module @Search)
│   │
│   └── tmh/                            # TMH Hospital Site Directory
│   │   ├── test_data/
│   │   ├── pages/
│   │   ├── fixtures/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   └── tests/
│   │
│   └── sbh/                            # SBH Hospital Site Directory
│       ├── test_data/
│       ├── pages/
│       ├── fixtures/
│       │   └── auth.js
│       └── tests/
│           └── login.spec.js
│
├── playwright.config.ts                # Shared/core config - tests/unit/* (no browser needed)
├── playwright.sites.config.ts          # Multi-site config (nuh/tmh/sbh projects)
├── package.json                        # Project dependencies and npm scripts
├── package-lock.json                   # Lockfile for dependencies
├── .env.example                       # Environment variables template
├── datatest_id_standard_proposal.md   # UI data-testid standard specification
├── cortex_automation_standards.pdf     # Framework design & architecture standard document
└── cortex_automation_standards.html    # Framework design standard web format
```

---

## Role & Responsibility Assignment Matrix (RACI)

To support team members with varying levels of coding experience across sites, responsibilities are partitioned as follows:

| Step  | Task                                | Primary Role               | Secondary Role  | Description                                                                              |
| ----- | ----------------------------------- | -------------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| **0** | Add `data-testid` to Web UI         | UI Developer / UI Agent    | Lead Automation | Adds `data-testid="[module]:[component]:[element]__[modifier]"` to HTML elements.        |
| **1** | Prepare Test Data (JSON)            | Site QA                    | Lead Automation | Configures credentials, URLs, and test input data in `sites/<site>/test_data/*.json`.    |
| **2** | Create Base Page Objects & Locators | Lead Automation / Core Dev | Site QA         | Maintains `pages/<feature>/<feature>Locators.js` and `pages/<feature>/<Feature>Page.js`. |
| **3** | Create Helpers & Unit Tests         | Lead Automation / Core Dev | -               | Develops utility functions in `utils/` and unit test specs in `tests/unit/`.             |
| **4** | Write Test Specs (`.spec.js`)       | Site QA                    | Lead Automation | Creates test scripts in `sites/<site>/tests/` calling Page Objects and assigning tags.   |
| **5** | Execute Tests & Verify Reports      | Site QA                    | Lead Automation | Runs test commands by tag and inspects Playwright HTML Reports.                          |

---

## Test Category & Tagging Standards

Tests are categorized and tagged to allow running specific suites during CI/CD or local verification:

### 1. Module / Component Tests (`login.spec.js`)

- **Focus**: Verifying isolated module functionality (e.g. login form, valid/invalid inputs, error messages).
- **Standard Tags**: `@Module`, `@Login`, `@HappyPath`, `@NegativePath`, `@Smoke`
- **Execution Mode**: Direct browser UI navigation via Page Object methods.

### 2. Full End-to-End Flow Tests (`flow_med.spec.js`)

- **Focus**: Verifying end-to-end business workflows across multiple screens (Registration -> OPD -> Pharmacy -> Cashier).
- **Standard Tags**: `@E2E`, `@Flow`, `@MED`, `@CriticalPath`
- **Execution Mode**: Auto-authenticated background login using `{ authenticatedPage }` fixture.

### 3. Suite & Site Filter Tags

- **Site Tags**: `@NUH`, `@TMH`, `@SBH`
- **Suite Tags**: `@Regression`, `@Smoke`

---

## Quick Start & Execution Commands

### 1. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your site URLs and credentials
```

### 2. Running Tests by Site

```bash
# Run NUH site tests
npm run test:nuh

# Run TMH site tests
npm run test:tmh

# Run SBH site tests
npm run test:sbh
```

### 3. Running Tests by Tag

```bash
# Run NUH Regression suite
npx playwright test --config=playwright.sites.config.ts --project=nuh --grep "@Regression"

# Run NUH Login Module tests
npx playwright test --config=playwright.sites.config.ts --project=nuh --grep "@Login"

# Run NUH Negative Path tests
npx playwright test --config=playwright.sites.config.ts --project=nuh --grep "@NegativePath"

# Run NUH E2E Flow tests
npx playwright test --config=playwright.sites.config.ts --project=nuh --grep "@E2E"
```

NUH also has a dedicated tag-based runner script (`scripts/run-nuh-tests.sh`) with a `-m headed|headless`
flag - see `npm run test:nuh:tag -- -h` for usage.

### 4. Running Utility Unit Tests

```bash
npm run test:unit
```

### 5. Viewing Test Reports

```bash
npx playwright show-report
```
