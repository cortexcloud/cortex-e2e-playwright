const baseUrls = require('../../base-urls.json');

/**
 * Single source of truth for the NUH site's base URL.
 * Default value lives in sites/base-urls.json (one file, all sites) - devs edit that file
 * directly. NUH_URL env var (e.g. via .env) always overrides it when set.
 * @returns {string}
 */
function getNuhBaseUrl() {
  return process.env.NUH_URL || baseUrls.nuh;
}

module.exports = { getNuhBaseUrl };
