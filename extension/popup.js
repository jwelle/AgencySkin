(function agencySkinCleanViewPopup() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var presetSelect = document.getElementById("presetSelect");
  var enabledToggle = document.getElementById("enabledToggle");
  var resetPageButton = document.getElementById("resetPageButton");
  var editorButton = document.getElementById("editorButton");
  var statusMessage = document.getElementById("statusMessage");
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

  function isVisibleInPopup(preset) {
    return preset && preset.showInPopup !== false && preset.archived !== true;
  }

  function optionLabel(preset, isHiddenActive) {
    return preset.name + (preset.source === "builtin" ? " (Built-in)" : " (Custom)") + (isHiddenActive ? " (Hidden from popup)" : "");
  }

  function populatePresets(state) {
    var allPresets = storage.getAllPresets(state);
    var activePresetId = state.activePresetId || "builtin:simple";
    var activePreset = allPresets[activePresetId];
    var popupPresetIds = Object.keys(allPresets).filter(function keepPopupPreset(presetId) {
      return isVisibleInPopup(allPresets[presetId]);
    });

    if (activePreset && popupPresetIds.indexOf(activePresetId) === -1) {
      popupPresetIds.unshift(activePresetId);
    }

    presetSelect.innerHTML = "";

    popupPresetIds.forEach(function addOption(presetId) {
      var option = document.createElement("option");
      var preset = allPresets[presetId];
      var isHiddenActive = presetId === activePresetId && !isVisibleInPopup(preset);
      option.value = presetId;
      option.textContent = optionLabel(preset, isHiddenActive);
      presetSelect.appendChild(option);
    });

    presetSelect.value = activePreset && popupPresetIds.indexOf(activePresetId) !== -1 ? activePresetId : popupPresetIds[0] || "builtin:simple";
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
  enabledToggle.addEventListener("change", setEnabled);
  resetPageButton.addEventListener("click", resetPage);
  editorButton.addEventListener("click", openEditor);
  refreshState();
})();
