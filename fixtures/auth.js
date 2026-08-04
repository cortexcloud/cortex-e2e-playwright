import { test as base } from '@playwright/test';
import { commonLogin } from '../utils/authHelper.js';

function getSiteFromConfig() {
  // Detect which config is being used from process.env or argv
  const configFile = process.env.PLAYWRIGHT_CONFIG_FILE ||
                     process.argv.find(arg => arg && arg.includes('playwright-')) ||
                     'playwright.config.js';

  if (configFile.includes('tmh')) return 'TMH';
  if (configFile.includes('nuh')) return 'NUH';
  return null;
}

export function createAuthFixture(config = {}) {
  const site = getSiteFromConfig();
  const sitePrefix = site ? `${site}_` : '';

  const defaultConfig = {
    baseUrl: process.env.BASE_URL || 'https://cortex-nuh-new.cortexcloud.co',
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

  return base.extend({
    authenticatedPage: async ({ page }, use) => {
      await commonLogin(page, finalConfig.email, finalConfig.password, finalConfig.baseUrl);
      await use(page);
    },
  });
}

export const test = createAuthFixture();
export { expect } from '@playwright/test';
