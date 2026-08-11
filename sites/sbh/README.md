# SBH Playwright Tests

Site-specific tests using shared authentication framework for SBH (Siriraj / Somdech Phra Debaratana) Hospital site.

See main README at `../../README.md` for full documentation.

## Quick Start

```javascript
import { test, expect } from '../fixtures/auth.js';

test('My test', async ({ authenticatedPage }) => {
  // Already logged in!
});
```

## Structure

- `pages/` - SBH-specific page objects
- `tests/` - Test files (`login.spec.js`)
- `fixtures/auth.js` - Re-exports shared auth fixture
- `test_data/` - Test data files (`config.json`, `auth.json`, `created_patients.json`)

## Running

```bash
# Run SBH tests using dedicated config
npm run test:sbh

# Run with Playwright UI
npm run test:sbh:ui

# Run in debug mode
npm run test:sbh:debug
```
