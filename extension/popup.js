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
  var customDomainCard = document.getElementById("customDomainCard");
  var customDomainHostname = document.getElementById("customDomainHostname");
  var customDomainMessage = document.getElementById("customDomainMessage");
  var enableCustomDomainButton = document.getElementById("enableCustomDomainButton");
  var currentState = null;
  var activeDomainStatus = null;
  var activeDomainTabId = null;

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function targetGhlTab(callback) {
    namespace.domainAccess.findTargetTab(callback);
  }

  function renderCustomDomainStatus(result, tab) {
    activeDomainStatus = result || null;
    activeDomainTabId = tab && tab.id || null;

    if (!result || result.status === "built_in" || result.status === "unsupported") {
      customDomainCard.hidden = true;
      return;
    }

    customDomainCard.hidden = false;
    customDomainCard.dataset.status = result.status || "unavailable";
    customDomainHostname.textContent = result.hostname || "Custom domain";
    enableCustomDomainButton.hidden = true;

    if (result.allowed && result.hasPermission) {
      customDomainMessage.textContent = "This agency domain is approved and enabled in this browser.";
      return;
    }

    if (result.allowed) {
      customDomainMessage.textContent = "This agency domain is approved. Grant Chrome access once to enable CleanView here.";
      enableCustomDomainButton.hidden = false;
      return;
    }

    customDomainMessage.textContent = result.status === "denied" ?
      "This agency domain is not enabled for CleanView." :
      (result.error || "CleanView cannot verify this agency domain right now.");
  }

  function refreshCustomDomainStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      var tab = chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0];
      if (!tab) {
        customDomainCard.hidden = true;
        return;
      }
      namespace.domainAccess.getUrlStatus(tab.url, function handleStatus(result) {
        renderCustomDomainStatus(result, tab);
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
    storage.touchInstallMetadata(function handleState(state, error) {
      if (error) {
        setStatus("Unable to load CleanView settings.", true);
        return;
      }

      currentState = state;
      enabledToggle.checked = state.enabled !== false;
      populatePresets(state);
      refreshCustomDomainStatus();
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

  function enableCustomDomain() {
    var requestedStatus = activeDomainStatus;
    var requestedTabId = activeDomainTabId;

    if (!requestedStatus || !requestedStatus.allowed || !requestedStatus.pattern) {
      setStatus("This agency domain is not approved for CleanView.", true);
      return;
    }

    enableCustomDomainButton.disabled = true;
    chrome.permissions.request({ origins: [requestedStatus.pattern] }, function handlePermission(granted) {
      if (chrome.runtime.lastError || !granted) {
        enableCustomDomainButton.disabled = false;
        setStatus("Chrome access was not granted for this domain.", true);
        return;
      }

      namespace.domainAccess.runtimeMessage({
        type: "CLEANVIEW_REGISTER_CUSTOM_DOMAIN",
        url: "https://" + requestedStatus.hostname + "/"
      }, function handleRegistration(result) {
        if (!result || !result.ok) {
          enableCustomDomainButton.disabled = false;
          chrome.permissions.remove({ origins: [requestedStatus.pattern] });
          setStatus(result && result.error || "Unable to enable CleanView on this domain.", true);
          refreshCustomDomainStatus();
          return;
        }

        setStatus("CleanView enabled. Reloading this agency domain...");
        if (requestedTabId) {
          chrome.tabs.reload(requestedTabId);
        }
        window.setTimeout(refreshCustomDomainStatus, 500);
      });
    });
  }

  presetSelect.addEventListener("change", saveActivePreset);
  enabledToggle.addEventListener("change", setEnabled);
  panelButton.addEventListener("click", openPanel);
  enableCustomDomainButton.addEventListener("click", enableCustomDomain);
  refreshState();
})();
