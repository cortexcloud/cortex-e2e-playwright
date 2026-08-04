import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 60000,
  testDir: './sites/nuh/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { printSlowTest: 0 }],
    ['list', { printFlaky: false, printSlowTest: 0}]
  ],
  use: {
    video: 'retain-on-failure',
    baseURL: process.env.NUH_URL || 'https://cortex-nuh-new.cortexcloud.co',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
