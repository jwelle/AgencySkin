(function agencySkinCleanViewAdvanced() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var statusMessage = document.getElementById("statusMessage");
  var backupTextarea = document.getElementById("backupTextarea");
  var diagnosticsOutput = document.getElementById("diagnosticsOutput");
  var exportButton = document.getElementById("exportButton");
  var importButton = document.getElementById("importButton");
  var resetButton = document.getElementById("resetButton");
  var detectButton = document.getElementById("detectButton");

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function isGhlUrl(url) {
    try {
      var parsed = new URL(url || "");
      return parsed.protocol === "https:" && namespace.isAllowedHost(parsed.hostname);
    } catch (_error) {
      return false;
    }
  }

  function getTargetGhlTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleActive(tabs) {
      var activeTab = chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0];

      if (activeTab && activeTab.id && isGhlUrl(activeTab.url)) {
        callback(activeTab);
        return;
      }

      chrome.tabs.query({
        currentWindow: true,
        url: ["https://app.gohighlevel.com/*", "https://*.leadconnectorhq.com/*"]
      }, function handleGhlTabs(ghlTabs) {
        if (chrome.runtime.lastError || !ghlTabs || ghlTabs.length !== 1) {
          callback(null, activeTab, ghlTabs || []);
          return;
        }
        callback(ghlTabs[0], activeTab, ghlTabs);
      });
    });
  }

  function sendToGhl(message, callback) {
    getTargetGhlTab(function handleTab(tab, activeTab, ghlTabs) {
      if (!tab || !tab.id) {
        callback({
          ok: false,
          error: ghlTabs && ghlTabs.length > 1 ?
            "Focus the GHL tab you want to inspect, then try again." :
            "Open a GHL location page and try again.",
          activeUrl: activeTab && activeTab.url
        });
        return;
      }

      chrome.tabs.sendMessage(tab.id, Object.assign({ source: namespace.messageSource }, message), function handleResponse(response) {
        if (chrome.runtime.lastError) {
          callback({ ok: false, error: "Content script not reachable. Reload the GHL page and try again." });
          return;
        }
        callback(response || { ok: false, error: "No response from GHL page." });
      });
    });
  }

  function loadBackup() {
    storage.getState(function handleState(state, error) {
      if (error) {
        setStatus("Unable to load CleanView data.", true);
        return;
      }
      backupTextarea.value = JSON.stringify(state, null, 2);
      setStatus("Backup loaded.");
    });
  }

  exportButton.addEventListener("click", loadBackup);

  importButton.addEventListener("click", function restoreBackup() {
    var parsed = null;

    try {
      parsed = JSON.parse(backupTextarea.value || "{}");
    } catch (_error) {
      setStatus("Backup JSON is invalid.", true);
      return;
    }

    storage.saveState(parsed, function handleSaved(_state, error) {
      if (error) {
        setStatus("Unable to restore backup.", true);
        return;
      }
      setStatus("Backup restored.");
    });
  });

  resetButton.addEventListener("click", function resetData() {
    if (!window.confirm("Reset local CleanView data in this browser?")) {
      return;
    }

    storage.saveState(storage.defaultState(), function handleSaved(state, error) {
      if (error) {
        setStatus("Unable to reset data.", true);
        return;
      }
      backupTextarea.value = JSON.stringify(state, null, 2);
      setStatus("CleanView data reset.");
    });
  });

  detectButton.addEventListener("click", function detectSidebar() {
    detectButton.disabled = true;
    setStatus("Detecting GHL sidebar...");
    sendToGhl({ type: "CLEANVIEW_DETECT_GHL_SIDEBAR" }, function handleDetected(result) {
      detectButton.disabled = false;
      diagnosticsOutput.hidden = false;
      diagnosticsOutput.textContent = JSON.stringify(result, null, 2);
      setStatus(result && result.ok ? "Sidebar found." : result && result.error ? result.error : "Sidebar not found.", !(result && result.ok));
    });
  });

  loadBackup();
})();
