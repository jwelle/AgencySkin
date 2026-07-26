(function registerCleanViewDomainAccess() {
  var namespace = window.agencySkinCleanView || {};

  function runtimeMessage(message, callback) {
    chrome.runtime.sendMessage(message, function handleResponse(response) {
      if (chrome.runtime.lastError) {
        callback({
          ok: false,
          status: "unavailable",
          error: "CleanView domain access is unavailable."
        });
        return;
      }

      callback(response || {
        ok: false,
        status: "unavailable",
        error: "CleanView domain access returned no response."
      });
    });
  }

  function getUrlStatus(url, callback) {
    runtimeMessage({
      type: "CLEANVIEW_GET_DOMAIN_STATUS",
      url: url || ""
    }, callback);
  }

  function getSupportedPatterns(callback) {
    runtimeMessage({ type: "CLEANVIEW_GET_GRANTED_PATTERNS" }, function handlePatterns(result) {
      var customPatterns = result && Array.isArray(result.patterns) ? result.patterns : [];
      callback(namespace.supportedUrlPatterns.concat(customPatterns));
    });
  }

  function findTargetTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleActive(tabs) {
      var activeTab = chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0];

      if (!activeTab || !activeTab.id) {
        callback(null, activeTab, []);
        return;
      }

      getUrlStatus(activeTab.url, function handleActiveStatus(status) {
        if (status && status.allowed && status.hasPermission !== false) {
          callback(activeTab);
          return;
        }

        getSupportedPatterns(function handlePatterns(patterns) {
          chrome.tabs.query({ currentWindow: true, url: patterns }, function handleSupportedTabs(supportedTabs) {
            if (chrome.runtime.lastError || !supportedTabs || supportedTabs.length !== 1) {
              callback(null, activeTab, supportedTabs || []);
              return;
            }
            callback(supportedTabs[0], activeTab, supportedTabs);
          });
        });
      });
    });
  }

  namespace.domainAccess = {
    getUrlStatus: getUrlStatus,
    getSupportedPatterns: getSupportedPatterns,
    findTargetTab: findTargetTab,
    runtimeMessage: runtimeMessage
  };

  window.agencySkinCleanView = namespace;
})();
