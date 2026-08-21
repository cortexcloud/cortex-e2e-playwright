import { defineConfig } from '@playwright/test';

/**
 * Shared/core config - used by `npm test`, `test:unit`, `test:headed`, `test:debug`, `test:ui`
 * (any script with no --config flag). Covers ./tests: pure-function unit tests (tests/unit/*)
 * that don't touch a browser, plus any other shared/global specs added directly under ./tests.
 * Site-specific test suites (NUH/TMH/SBH) run through playwright.sites.config.ts instead.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
    },
  ],
});
