const baseUrls = require('../../base-urls.json');

/**
 * Single source of truth for the SBH site's base URL.
 * Default value lives in sites/base-urls.json (one file, all sites) - devs edit that file
 * directly. SBH_URL env var (e.g. via .env) always overrides it when set.
 * @returns {string}
 */
function getSbhBaseUrl() {
  return process.env.SBH_URL || baseUrls.sbh;
}

module.exports = { getSbhBaseUrl };
