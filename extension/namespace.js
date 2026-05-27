(function registerAgencySkinCleanViewNamespace() {
  var namespace = window.agencySkinCleanView || {};

  namespace.messageSource = "agencySkinCleanView";
  namespace.storageKey = "agencySkinCleanView";
  namespace.version = 1;

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
