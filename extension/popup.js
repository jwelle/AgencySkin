(function agencySkinPopup() {
  var presets = window.AgencySkinPresets || {};
  var allMenuKeys = window.AgencySkinAllMenuKeys || [];
  var presetSelect = document.getElementById("presetSelect");
  var applyPresetButton = document.getElementById("applyPresetButton");
  var showAllButton = document.getElementById("showAllButton");
  var statusMessage = document.getElementById("statusMessage");

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function populatePresets() {
    Object.keys(presets).forEach(function addPresetOption(key) {
      var option = document.createElement("option");
      option.value = key;
      option.textContent = presets[key].label;
      presetSelect.appendChild(option);
    });
  }

  function getActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      if (chrome.runtime.lastError || !tabs || !tabs[0] || !tabs[0].id) {
        callback(null);
        return;
      }

      callback(tabs[0]);
    });
  }

  function sendToContentScript(message, callback) {
    getActiveTab(function handleActiveTab(tab) {
      if (!tab) {
        callback({ ok: false, error: "No active tab found." });
        return;
      }

      chrome.tabs.sendMessage(tab.id, message, function handleResponse(response) {
        if (chrome.runtime.lastError) {
          callback({ ok: false, error: "Open a supported GoHighLevel page, then try again." });
          return;
        }

        callback(response || { ok: false, error: "No response from page." });
      });
    });
  }

  function saveSettings(selectedPreset, visibleItems, callback) {
    chrome.storage.local.set(
      {
        selectedPreset: selectedPreset,
        visibleItems: visibleItems,
        updatedAt: new Date().toISOString()
      },
      function handleSaved() {
        if (chrome.runtime.lastError) {
          callback({ ok: false, error: "Unable to save preset." });
          return;
        }

        callback({ ok: true });
      }
    );
  }

  function applyPreset() {
    var presetKey = presetSelect.value;
    var preset = presets[presetKey];

    if (!preset) {
      setStatus("Choose a preset first.", true);
      return;
    }

    saveSettings(presetKey, preset.visibleItems, function handleSaved(saveResult) {
      if (!saveResult.ok) {
        setStatus(saveResult.error, true);
        return;
      }

      sendToContentScript(
        {
          source: "agencyskin-cleanview",
          type: "applyPreset",
          presetKey: presetKey
        },
        function handleApplied(result) {
          if (!result.ok) {
            setStatus(result.error || "Unable to apply preset.", true);
            return;
          }

          setStatus(preset.label + " applied.");
        }
      );
    });
  }

  function showAll() {
    saveSettings("admin", allMenuKeys, function handleSaved(saveResult) {
      if (!saveResult.ok) {
        setStatus(saveResult.error, true);
        return;
      }

      presetSelect.value = "admin";
      sendToContentScript(
        {
          source: "agencyskin-cleanview",
          type: "showAll"
        },
        function handleShown(result) {
          if (!result.ok) {
            setStatus(result.error || "Unable to show all items.", true);
            return;
          }

          setStatus("All registered items restored.");
        }
      );
    });
  }

  function restoreSelectedPreset() {
    chrome.storage.local.get(["selectedPreset"], function handleStore(store) {
      if (chrome.runtime.lastError) {
        setStatus("Unable to load saved preset.", true);
        return;
      }

      if (store.selectedPreset && presets[store.selectedPreset]) {
        presetSelect.value = store.selectedPreset;
      }
    });
  }

  populatePresets();
  restoreSelectedPreset();
  applyPresetButton.addEventListener("click", applyPreset);
  showAllButton.addEventListener("click", showAll);
})();
