import { test as base } from '@playwright/test';
import { commonLogin } from '../utils/authHelper.js';

/**
 * Which site is under test (e.g. 'nuh', 'tmh', 'sbh') - set per-project via
 * `use: { site: 'nuh' }` in playwright.sites.config.ts.
 *
 * NOTE: this used to be auto-detected by sniffing process.argv / PLAYWRIGHT_CONFIG_FILE for a
 * config filename. That never actually worked: Playwright runs tests in a separate worker
 * process, and the worker's process.argv does not carry the original CLI flags at all (verified
 * empirically - a worker only sees `[node, workerProcessEntry.js]`). Declaring `site` as a
 * Playwright fixture option is the supported way to pass per-project config into workers.
 */
export function createAuthFixture(config = {}) {
  return base.extend({
    site: ['', { option: true }],

    authenticatedPage: async ({ page, site }, use) => {
      const sitePrefix = site ? `${site.toUpperCase()}_` : '';

      const defaultConfig = {
        baseUrl: process.env.BASE_URL || 'https://dev-x.cortexcloud.co/cortex',
        email: process.env.TEST_EMAIL || 'user1',
        password: process.env.TEST_PASSWORD || 'MyPassw0rd',
      };

      // Site-specific config overrides defaults
      const siteConfig = {
        baseUrl: process.env[`${sitePrefix}URL`] || defaultConfig.baseUrl,
        email: process.env[`${sitePrefix}EMAIL`] || defaultConfig.email,
        password: process.env[`${sitePrefix}PASSWORD`] || defaultConfig.password,
      };

      const finalConfig = { ...siteConfig, ...config };

      await commonLogin(page, finalConfig.email, finalConfig.password, finalConfig.baseUrl);
      await use(page);
    },
  });
}

export const test = createAuthFixture();
export { expect } from '@playwright/test';
