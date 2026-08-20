const baseUrls = require('../../base-urls.json');

/**
 * Single source of truth for the TMH site's base URL.
 * Default value lives in sites/base-urls.json (one file, all sites) - devs edit that file
 * directly. TMH_URL env var (e.g. via .env) always overrides it when set.
 * @returns {string}
 */
function getTmhBaseUrl() {
  return process.env.TMH_URL || baseUrls.tmh;
}

module.exports = { getTmhBaseUrl };
