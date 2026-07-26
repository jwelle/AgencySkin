(function markCleanViewCustomDomain() {
  var namespace = window.agencySkinCleanView || {};
  namespace.customDomainHostname = String(window.location.hostname || "").toLowerCase();
  window.agencySkinCleanView = namespace;
})();
