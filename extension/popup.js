(function agencySkinCleanViewPopup() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var currentViewSummary = document.getElementById("currentViewSummary");
  var currentViewName = document.getElementById("currentViewName");
  var presetField = document.getElementById("presetField");
  var presetSelect = document.getElementById("presetSelect");
  var emptyStateMessage = document.getElementById("emptyStateMessage");
  var enabledToggle = document.getElementById("enabledToggle");
  var panelButton = document.getElementById("panelButton");
  var statusMessage = document.getElementById("statusMessage");
  var currentState = null;

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

  function targetGhlTab(callback) {
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

  function sendToGhlTab(message, callback) {
    targetGhlTab(function handleTarget(tab, activeTab, ghlTabs) {
      if (!tab || !tab.id) {
        callback({
          ok: false,
          error: ghlTabs && ghlTabs.length > 1 ?
            "Focus the GHL tab you want to update, then try again." :
            "Open a GHL page to apply this live. Your settings are saved and will apply next time GHL opens.",
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

  function isSavedView(preset) {
    return preset && preset.source !== "builtin" && preset.archived !== true;
  }

  function optionLabel(preset) {
    return preset && (preset.name || preset.label) || "Untitled View";
  }

  function selectedOptionName() {
    var option = presetSelect.options[presetSelect.selectedIndex];
    return option ? option.textContent : "View";
  }

  function populatePresets(state) {
    var allPresets = storage.getAllPresets(state);
    var activePresetId = state.activePresetId || "builtin:simple";
    var activePreset = allPresets[activePresetId];
    var popupPresetIds = Object.keys(allPresets).filter(function keepPopupPreset(presetId) {
      return isSavedView(allPresets[presetId]);
    });

    presetSelect.innerHTML = "";

    popupPresetIds.forEach(function addOption(presetId) {
      var option = document.createElement("option");
      var preset = allPresets[presetId];
      option.value = presetId;
      option.textContent = optionLabel(preset);
      presetSelect.appendChild(option);
    });

    presetSelect.value = activePreset && popupPresetIds.indexOf(activePresetId) !== -1 ? activePresetId : popupPresetIds[0] || "";
    presetSelect.disabled = popupPresetIds.length === 0;
    if (currentViewSummary) {
      currentViewSummary.hidden = popupPresetIds.length === 0;
    }
    if (currentViewName) {
      currentViewName.textContent = isSavedView(activePreset) ? optionLabel(activePreset) : "No saved view active";
    }
    if (presetField) {
      presetField.hidden = popupPresetIds.length <= 1 && isSavedView(activePreset);
    }
    if (emptyStateMessage) {
      emptyStateMessage.hidden = popupPresetIds.length !== 0;
    }
    if (panelButton) {
      panelButton.textContent = popupPresetIds.length === 0 ? "Create Your First View" : "Customize View";
    }
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

  function applyCurrentSettings(statusPrefix) {
    sendToGhlTab({ type: "CLEANVIEW_APPLY_ACTIVE_SETTINGS" }, function handleApplied(result) {
      if (!result.ok) {
        setStatus(result.error || "Unable to apply live to GHL.", true);
        return;
      }
      setStatus(statusPrefix || result.message || "Applied to open GHL tab.");
      refreshState();
    });
  }

  function saveActivePreset() {
    if (!presetSelect.value) {
      return;
    }

    storage.updateState(function updateActivePreset(state) {
      state.activePresetId = presetSelect.value;
      state.lastEditedProfileId = state.activePresetId.indexOf("custom:") === 0 ? state.activePresetId : state.lastEditedProfileId;
    }, function handleSaved(state, error) {
      if (error) {
        setStatus("Unable to save current View.", true);
        return;
      }
      currentState = state;
      applyCurrentSettings(selectedOptionName() + " saved and applied.");
    });
  }

  function setEnabled() {
    storage.updateState(function updateEnabled(state) {
      state.enabled = Boolean(enabledToggle.checked);
    }, function handleSaved(state, error) {
      if (error) {
        setStatus("Unable to update CleanView.", true);
        return;
      }
      currentState = state;
      applyCurrentSettings(enabledToggle.checked ? "CleanView enabled and applied." : "CleanView disabled on GHL.");
    });
  }

  function openPanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      var tab = tabs && tabs[0];
      var options = tab && tab.windowId ? { windowId: tab.windowId } : {};
      var opened = null;

      if (chrome.sidePanel && chrome.sidePanel.open) {
        try {
          opened = chrome.sidePanel.open(options);
        } catch (_error) {
          setStatus("Could not open CleanView Panel. Try again.", true);
          return;
        }

        if (opened && typeof opened.then === "function") {
          opened.then(function handleOpened() {
            window.close();
          }).catch(function handleOpenError() {
            setStatus("Could not open CleanView Panel. Try again.", true);
          });
          return;
        }

        setStatus("Could not open CleanView Panel. Try again.", true);
        return;
      }

      setStatus("CleanView Panel is not available in this browser.", true);
    });
  }

  presetSelect.addEventListener("change", saveActivePreset);
  enabledToggle.addEventListener("change", setEnabled);
  panelButton.addEventListener("click", openPanel);
  refreshState();
})();
