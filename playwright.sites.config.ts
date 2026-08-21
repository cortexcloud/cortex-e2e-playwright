import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Loads .env (see .env.example) so NUH_URL/TMH_URL/SBH_URL etc. can be set in one file instead
// of editing each site's test_data/config.json. Comment out whichever URL you're not using -
// only the active site's *_URL is read per --project run, so unused ones are simply ignored.
require('dotenv').config({ path: path.resolve(__dirname, '.env'), quiet: true });

const { getNuhBaseUrl } = require('./sites/nuh/utils/baseUrl.js');
const { getTmhBaseUrl } = require('./sites/tmh/utils/baseUrl.js');
const { getSbhBaseUrl } = require('./sites/sbh/utils/baseUrl.js');

// `site` is the custom fixture option declared in fixtures/auth.js - typing it here lets
// each project's `use: { site: '...' }` type-check against defineConfig().
type CustomOptions = { site: string };

/**
 * Shared multi-site config. Replaces the old playwright-nuh/tmh/sbh.config.ts trio -
 * each site is a project here instead of a separate config file.
 * Run one site with `--project=<site>` (e.g. `--project=nuh`); omit --project to run all three.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<CustomOptions>({
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { printSlowTest: 0 }],
    ['list', { printFlaky: false, printSlowTest: 0 }],
  ],
  use: {
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    },
  },

  projects: [
    {
      name: 'nuh',
      testDir: './sites/nuh/tests',
      // `site` is a custom fixture option (see fixtures/auth.js) - it's how the authenticatedPage
      // fixture learns which site it's running as inside the worker process, since worker
      // processes don't inherit the CLI's --project flag through process.argv.
      use: { ...devices['Desktop Chrome'], baseURL: getNuhBaseUrl(), site: 'nuh', screenshot: 'only-on-failure' },
    },
    {
      name: 'tmh',
      testDir: './sites/tmh/tests',
      use: { ...devices['Desktop Chrome'], baseURL: getTmhBaseUrl(), site: 'tmh' },
    },
    {
      name: 'sbh',
      testDir: './sites/sbh/tests',
      use: { ...devices['Desktop Chrome'], baseURL: getSbhBaseUrl(), site: 'sbh' },
    },
  ],
});
