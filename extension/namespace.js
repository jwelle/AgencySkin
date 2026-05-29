(function registerAgencySkinCleanViewNamespace() {
  var namespace = window.agencySkinCleanView || {};

  namespace.messageSource = "agencySkinCleanView";
  namespace.storageKey = "agencySkinCleanView";
  namespace.version = 1;
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

  namespace.isAllowedHost = function isAllowedHost(hostname) {
    return hostname === "app.gohighlevel.com" || hostname.endsWith(".leadconnectorhq.com");
  };

  namespace.getLocationIdFromUrl = function getLocationIdFromUrl(pathname) {
    var match = String(pathname || "").match(/\/location\/([^/]+)/);
    return match ? match[1] : null;
  };

  window.agencySkinCleanView = namespace;
})();
