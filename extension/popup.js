(function agencySkinCleanViewPopup() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var presetSelect = document.getElementById("presetSelect");
  var enabledToggle = document.getElementById("enabledToggle");
  var locationLabel = document.getElementById("locationLabel");
  var assignLocationButton = document.getElementById("assignLocationButton");
  var resetPageButton = document.getElementById("resetPageButton");
  var editorButton = document.getElementById("editorButton");
  var statusMessage = document.getElementById("statusMessage");
  var activeLocationId = null;
  var currentState = null;

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function getActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      callback(chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0]);
    });
  }

  function sendToContentScript(message, callback) {
    getActiveTab(function handleActiveTab(tab) {
      if (!tab || !tab.id) {
        callback({ ok: false, error: "No active tab found." });
        return;
      }

      chrome.tabs.sendMessage(tab.id, Object.assign({ source: namespace.messageSource }, message), function handleResponse(response) {
        if (chrome.runtime.lastError) {
          callback({ ok: false, error: "Open a supported GoHighLevel page, then try again." });
          return;
        }
        callback(response || { ok: false, error: "No response from page." });
      });
    });
  }

  function optionLabel(preset) {
    return preset.source === "builtin" ? preset.name + " (Built-in)" : preset.name;
  }

  function populatePresets(state) {
    var allPresets = storage.getAllPresets(state);
    presetSelect.innerHTML = "";

    Object.keys(allPresets).forEach(function addOption(presetId) {
      var option = document.createElement("option");
      option.value = presetId;
      option.textContent = optionLabel(allPresets[presetId]);
      presetSelect.appendChild(option);
    });

    presetSelect.value = state.activePresetId || "builtin:simple";
  }

  function refreshState() {
    storage.getState(function handleState(state, error) {
      if (error) {
        setStatus("Unable to load CleanView settings.", true);
        return;
      }

      currentState = state;
      enabledToggle.checked = state.enabled !== false;
      populatePresets(state);

      sendToContentScript({ type: "getPageContext" }, function handleContext(result) {
        if (!result.ok) {
          locationLabel.textContent = "Current location: open GoHighLevel";
          return;
        }

        activeLocationId = result.locationId || null;
        locationLabel.textContent = activeLocationId ? "Current location: " + activeLocationId : "Current location: not detected";

        if (activeLocationId && state.locationRules[activeLocationId]) {
          presetSelect.value = state.locationRules[activeLocationId].presetId;
        }
      });
    });
  }

  function applyPreset() {
    sendToContentScript({ type: "applyPreset", presetId: presetSelect.value }, function handleApplied(result) {
      if (!result.ok) {
        setStatus(result.error || "Unable to apply view.", true);
        return;
      }
      if (result.skipped) {
        setStatus("Current view saved. Turn CleanView on to apply.");
        refreshState();
        return;
      }
      setStatus((result.presetName || "View") + " applied.");
      refreshState();
    });
  }

  function assignToLocation() {
    if (!activeLocationId) {
      setStatus("No GHL location detected on this page.", true);
      return;
    }

    sendToContentScript({ type: "applyPresetForLocation", presetId: presetSelect.value }, function handleAssigned(result) {
      if (!result.ok) {
        setStatus(result.error || "Unable to assign location rule.", true);
        return;
      }
      setStatus("This view will be used automatically for this GHL location.");
      refreshState();
    });
  }

  function setEnabled() {
    sendToContentScript({ type: "setEnabled", enabled: enabledToggle.checked }, function handleEnabled(result) {
      if (!result.ok) {
        setStatus(result.error || "Unable to update CleanView.", true);
        return;
      }
      setStatus(enabledToggle.checked ? "CleanView enabled." : "CleanView disabled.");
      refreshState();
    });
  }

  function resetPage() {
    sendToContentScript({ type: "resetPage" }, function handleReset(result) {
      setStatus(result.ok ? "CleanView changes removed from this page." : result.error || "Unable to restore page.", !result.ok);
    });
  }

  function openEditor() {
    chrome.runtime.openOptionsPage();
  }

  presetSelect.addEventListener("change", applyPreset);
  assignLocationButton.addEventListener("click", assignToLocation);
  enabledToggle.addEventListener("change", setEnabled);
  resetPageButton.addEventListener("click", resetPage);
  editorButton.addEventListener("click", openEditor);
  refreshState();
})();
