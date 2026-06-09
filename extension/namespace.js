(function registerAgencySkinCleanViewNamespace() {
  var namespace = window.agencySkinCleanView || {};
  var manifestVersion = "";

  namespace.messageSource = "agencySkinCleanView";
  namespace.storageKey = "agencySkinCleanView";

  try {
    manifestVersion = chrome.runtime && chrome.runtime.getManifest ? chrome.runtime.getManifest().version : "";
  } catch (_error) {
    manifestVersion = "";
  }

  namespace.appVersion = namespace.appVersion || manifestVersion || "0.1.0";
  namespace.version = namespace.version || namespace.appVersion;
  namespace.ENABLE_LOCATION_VIEW_DEFAULTS = false;
  namespace.defaultBrandLogoUrl = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/68dc14d7a969ba71daf21593.png";
  namespace.brandSettings = Object.assign({
    brandName: "AgencySkin",
    logoUrl: namespace.defaultBrandLogoUrl
  }, namespace.brandSettings || {});

  namespace.nowIso = function nowIso() {
    return new Date().toISOString();
  };

  namespace.createId = function createId(prefix) {
    return prefix + ":" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  };

  namespace.supportedUrlPatterns = [
    "https://app.gohighlevel.com/*",
    "https://*.gohighlevel.com/*",
    "https://*.leadconnectorhq.com/*",
    "https://app.automationsplus.com/*"
  ];

  namespace.isAllowedHost = function isAllowedHost(hostname) {
    return hostname === "app.gohighlevel.com" ||
      hostname.endsWith(".gohighlevel.com") ||
      hostname.endsWith(".leadconnectorhq.com") ||
      hostname === "app.automationsplus.com";
  };

  namespace.getLocationIdFromUrl = function getLocationIdFromUrl(pathname) {
    var match = String(pathname || "").match(/\/location\/([^/]+)/);
    return match ? match[1] : null;
  };

  window.agencySkinCleanView = namespace;
})();
