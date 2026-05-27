(function agencySkinCleanViewEditor() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var registry = namespace.selectorRegistry;
  var allMenuKeys = namespace.allMenuKeys;
  var sidebarStylePresets = namespace.sidebarStylePresets || {};
  var state = null;
  var selectedPresetId = "builtin:simple";
  var activeTab = "menu";
  var activeLocationId = null;

  var presetSelect = document.getElementById("presetSelect");
  var defaultPresetSelect = document.getElementById("defaultPresetSelect");
  var presetName = document.getElementById("presetName");
  var presetDescription = document.getElementById("presetDescription");
  var builtInNotice = document.getElementById("builtInNotice");
  var menuEditor = document.getElementById("menuEditor");
  var renameEditor = document.getElementById("renameEditor");
  var linkEditor = document.getElementById("linkEditor");
  var locationRules = document.getElementById("locationRules");
  var statusMessage = document.getElementById("statusMessage");
  var currentLocationLabel = document.getElementById("currentLocationLabel");
  var sidebarStyleEnabled = document.getElementById("sidebarStyleEnabled");
  var sidebarStylePreset = document.getElementById("sidebarStylePreset");
  var sidebarStyleEditor = document.getElementById("sidebarStyleEditor");
  var quickLinkPlacements = [
    { value: "top", label: "Top of menu" },
    { value: "bottom", label: "Bottom of menu, above Settings" },
    { value: "after_conversations", label: "After Conversations" },
    { value: "after_contacts", label: "After Contacts" },
    { value: "after_opportunities", label: "After Opportunities" },
    { value: "after_calendars", label: "After Calendars" },
    { value: "above_settings", label: "Above Settings" },
    { value: "after_settings", label: "After Settings" }
  ];
  var sidebarStyleFields = [
    { key: "backgroundColor", label: "Sidebar Background", type: "text" },
    { key: "textColor", label: "Menu Text", type: "text" },
    { key: "activeBackgroundColor", label: "Active Item Background", type: "text" },
    { key: "activeTextColor", label: "Active Item Text", type: "text" },
    { key: "hoverBackgroundColor", label: "Hover Background", type: "text" },
    { key: "borderRadius", label: "Menu Item Radius", type: "text" },
    { key: "itemSpacing", label: "Menu Item Spacing", type: "text" },
    { key: "sidebarPadding", label: "Sidebar Padding", type: "text" },
    { key: "logoUrl", label: "Optional Logo URL", type: "url" },
    { key: "headerLabel", label: "Optional Header Label", type: "text" }
  ];

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function allPresets() {
    return storage.getAllPresets(state);
  }

  function selectedPreset() {
    return storage.getPresetById(state, selectedPresetId) || storage.getPresetById(state, "builtin:simple");
  }

  function isCustomPreset(preset) {
    return preset && preset.source !== "builtin";
  }

  function selectedEditablePreset() {
    var preset = selectedPreset();

    if (isCustomPreset(preset)) {
      return storage.normalizePreset(preset);
    }

    return storage.normalizePreset({
      id: namespace.createId("custom"),
      name: (preset.name || preset.label || "View") + " Copy",
      description: preset.description || "",
      visibleItems: preset.visibleItems || [],
      labelOverrides: preset.labelOverrides || {},
      customLinks: preset.customLinks || [],
      sidebarStyle: preset.sidebarStyle || namespace.defaultSidebarStyle
    });
  }

  function getActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      callback(chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0]);
    });
  }

  function sendToContentScript(message, callback) {
    getActiveTab(function handleActiveTab(tab) {
      if (!tab || !tab.id) {
        callback({ ok: false, error: "No active GHL tab found." });
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
    return (preset.name || preset.label) + (preset.source === "builtin" ? " (Built-in)" : "");
  }

  function fillPresetSelect(select, selectedValue) {
    var presets = allPresets();
    select.innerHTML = "";

    Object.keys(presets).forEach(function addOption(presetId) {
      var option = document.createElement("option");
      option.value = presetId;
      option.textContent = optionLabel(presets[presetId]);
      select.appendChild(option);
    });

    select.value = selectedValue || selectedPresetId;
  }

  function renderPresetSelects() {
    fillPresetSelect(presetSelect, selectedPresetId);
    fillPresetSelect(defaultPresetSelect, state.activePresetId || "builtin:simple");
  }

  function renderTabState() {
    document.querySelectorAll("[data-tab-button]").forEach(function renderButton(button) {
      button.classList.toggle("active", button.dataset.tabButton === activeTab);
    });
    document.querySelectorAll("[data-tab-panel]").forEach(function renderPanel(panel) {
      panel.classList.toggle("active", panel.dataset.tabPanel === activeTab);
    });
  }

  function renderHeader() {
    var preset = selectedPreset();
    var isEditable = isCustomPreset(preset);

    presetName.value = preset.name || preset.label || "";
    presetDescription.value = preset.description || "";
    presetName.disabled = !isEditable;
    presetDescription.disabled = !isEditable;
    document.getElementById("deletePresetButton").disabled = !isEditable;
    builtInNotice.textContent = isEditable ? "" : "Built-in views cannot be edited directly. Duplicate this view to customize it.";
  }

  function renderMenuEditor() {
    var preset = selectedPreset();
    var visibleSet = new Set(preset.visibleItems || []);
    menuEditor.innerHTML = "";

    allMenuKeys.forEach(function renderMenuRow(key) {
      var entry = registry[key];
      var row = document.createElement("label");
      var checkbox = document.createElement("input");
      var name = document.createElement("span");

      row.className = "check-row";
      checkbox.type = "checkbox";
      checkbox.checked = visibleSet.has(key);
      checkbox.dataset.menuKey = key;
      name.textContent = entry ? entry.label : key;

      row.appendChild(checkbox);
      row.appendChild(name);
      menuEditor.appendChild(row);
    });
  }

  function renderRenameEditor() {
    var preset = selectedPreset();
    var labelOverrides = preset.labelOverrides || {};
    renameEditor.innerHTML = "";

    Object.keys(labelOverrides).forEach(function renderRenameRow(key) {
      appendRenameRow(key, labelOverrides[key]);
    });

    if (!Object.keys(labelOverrides).length) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = "No rename rules yet.";
      renameEditor.appendChild(empty);
    }
  }

  function appendRenameRow(key, value) {
    var row = document.createElement("div");
    var originalSelect = document.createElement("select");
    var newLabelInput = document.createElement("input");
    var removeButton = document.createElement("button");

    if (renameEditor.querySelector(".help-text")) {
      renameEditor.innerHTML = "";
    }

    row.className = "rename-row";
    row.dataset.renameRow = "true";
    allMenuKeys.forEach(function addOption(menuKey) {
      var entry = registry[menuKey];
      var option = document.createElement("option");
      option.value = menuKey;
      option.textContent = entry ? entry.label : menuKey;
      originalSelect.appendChild(option);
    });
    originalSelect.value = key || allMenuKeys[0];
    originalSelect.dataset.renameField = "key";
    newLabelInput.type = "text";
    newLabelInput.placeholder = "New label";
    newLabelInput.value = value || "";
    newLabelInput.dataset.renameField = "value";
    removeButton.type = "button";
    removeButton.className = "danger";
    removeButton.textContent = "Delete";
    removeButton.dataset.removeRename = "true";

    row.appendChild(createFieldLabel("Original Label", originalSelect));
    row.appendChild(createFieldLabel("New Label", newLabelInput));
    row.appendChild(removeButton);
    renameEditor.appendChild(row);
  }

  function normalizeUrl(url) {
    var trimmed = String(url || "").trim();

    if (!trimmed) {
      return "";
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
  }

  function createFieldLabel(text, input) {
    var label = document.createElement("label");
    label.className = "inline-field";
    label.appendChild(document.createTextNode(text));
    label.appendChild(input);
    return label;
  }

  function addPlacementOptions(select, selectedPlacement) {
    quickLinkPlacements.forEach(function addOption(placement) {
      var option = document.createElement("option");
      option.value = placement.value;
      option.textContent = placement.label;
      select.appendChild(option);
    });
    select.value = selectedPlacement || "bottom";
  }

  function renderLinks() {
    var preset = selectedPreset();
    linkEditor.innerHTML = "";

    (preset.customLinks || []).forEach(function renderLink(link) {
      var normalizedLink = storage.normalizeCustomLink(link);
      var row = document.createElement("div");
      var labelInput = document.createElement("input");
      var urlInput = document.createElement("input");
      var placementSelect = document.createElement("select");
      var enabledInput = document.createElement("input");
      var removeButton = document.createElement("button");

      row.className = "link-row";
      row.dataset.linkId = normalizedLink.id;
      labelInput.type = "text";
      labelInput.placeholder = "Link label";
      labelInput.value = normalizedLink.label;
      labelInput.dataset.linkField = "label";
      urlInput.type = "url";
      urlInput.placeholder = "https://...";
      urlInput.value = normalizedLink.url;
      urlInput.dataset.linkField = "url";
      addPlacementOptions(placementSelect, normalizedLink.placement);
      placementSelect.dataset.linkField = "placement";
      enabledInput.type = "checkbox";
      enabledInput.checked = normalizedLink.enabled !== false;
      enabledInput.dataset.linkField = "enabled";
      removeButton.type = "button";
      removeButton.className = "danger";
      removeButton.textContent = "Delete";
      removeButton.dataset.removeLinkId = normalizedLink.id;

      row.appendChild(createFieldLabel("Label", labelInput));
      row.appendChild(createFieldLabel("URL", urlInput));
      row.appendChild(createFieldLabel("Placement", placementSelect));
      row.appendChild(createFieldLabel("Enabled", enabledInput));
      row.appendChild(removeButton);
      linkEditor.appendChild(row);
    });

    if ((preset.customLinks || []).length === 0) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = "No quick links yet.";
      linkEditor.appendChild(empty);
    }
  }

  function renderSidebarStylePresetOptions() {
    sidebarStylePreset.innerHTML = "";
    Object.keys(sidebarStylePresets).forEach(function addOption(key) {
      var option = document.createElement("option");
      option.value = key;
      option.textContent = sidebarStylePresets[key].name || key;
      sidebarStylePreset.appendChild(option);
    });
  }

  function renderSidebarStyle() {
    var preset = selectedPreset();
    var style = storage.normalizeSidebarStyle(preset.sidebarStyle);
    sidebarStyleEnabled.checked = style.enabled === true;
    sidebarStylePreset.value = style.preset || "default";
    sidebarStyleEditor.innerHTML = "";

    sidebarStyleFields.forEach(function renderStyleField(field) {
      var input = document.createElement("input");
      input.type = field.type;
      input.value = style[field.key] || "";
      input.dataset.sidebarStyleField = field.key;
      sidebarStyleEditor.appendChild(createFieldLabel(field.label, input));
    });
  }

  function renderLocationRules() {
    var presets = allPresets();
    var rules = state.locationRules || {};
    locationRules.innerHTML = "";

    Object.keys(rules).forEach(function renderRule(locationId) {
      var row = document.createElement("div");
      var label = document.createElement("span");
      var presetLabel = document.createElement("span");
      var removeButton = document.createElement("button");
      var preset = presets[rules[locationId].presetId];

      row.className = "rule-row";
      label.textContent = locationId;
      presetLabel.textContent = preset ? preset.name || preset.label : "Unknown view";
      removeButton.type = "button";
      removeButton.className = "danger";
      removeButton.textContent = "Remove";
      removeButton.dataset.removeRuleId = locationId;

      row.appendChild(label);
      row.appendChild(presetLabel);
      row.appendChild(removeButton);
      locationRules.appendChild(row);
    });

    if (Object.keys(rules).length === 0) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = "No saved location rules yet.";
      locationRules.appendChild(empty);
    }
  }

  function render() {
    renderPresetSelects();
    renderTabState();
    renderHeader();
    renderMenuEditor();
    renderRenameEditor();
    renderLinks();
    renderSidebarStylePresetOptions();
    renderSidebarStyle();
    renderLocationRules();
  }

  function collectSidebarStyleFromForm() {
    var style = storage.normalizeSidebarStyle(sidebarStylePresets[sidebarStylePreset.value] || {});
    style.enabled = sidebarStyleEnabled.checked;
    style.preset = sidebarStylePreset.value || "default";

    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function collectField(input) {
      style[input.dataset.sidebarStyleField] = input.value.trim();
    });

    return style;
  }

  function collectPresetFromForm() {
    var preset = selectedEditablePreset();
    var visibleItems = [];
    var labelOverrides = {};
    var customLinks = [];

    preset.name = presetName.value.trim() || "Untitled View";
    preset.description = presetDescription.value.trim();

    menuEditor.querySelectorAll("[data-menu-key]").forEach(function collectVisible(checkbox) {
      if (checkbox.checked) {
        visibleItems.push(checkbox.dataset.menuKey);
      }
    });

    renameEditor.querySelectorAll("[data-rename-row='true']").forEach(function collectRename(row) {
      var key = row.querySelector("[data-rename-field='key']").value;
      var value = row.querySelector("[data-rename-field='value']").value.trim();
      if (key && value) {
        labelOverrides[key] = value;
      }
    });

    linkEditor.querySelectorAll(".link-row").forEach(function collectLink(row) {
      var id = row.dataset.linkId;
      var label = row.querySelector("[data-link-field='label']").value.trim();
      var url = normalizeUrl(row.querySelector("[data-link-field='url']").value);
      var placement = row.querySelector("[data-link-field='placement']").value;
      var enabled = row.querySelector("[data-link-field='enabled']").checked;

      if (label && url) {
        customLinks.push({
          id: id,
          label: label,
          url: url,
          placement: placement,
          openMode: "new_tab",
          enabled: enabled
        });
      }
    });

    preset.visibleItems = visibleItems;
    preset.labelOverrides = labelOverrides;
    preset.customLinks = customLinks;
    preset.sidebarStyle = collectSidebarStyleFromForm();
    preset.updatedAt = namespace.nowIso();
    return storage.normalizePreset(preset);
  }

  function persistPreset(preset, message, shouldApply) {
    storage.updateState(function updatePreset(nextState) {
      nextState.presets[preset.id] = storage.normalizePreset(preset);
      if (shouldApply) {
        nextState.activePresetId = preset.id;
      }
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to save CleanView view.", true);
        return;
      }
      state = nextState;
      selectedPresetId = preset.id;

      if (!shouldApply) {
        setStatus(message);
        render();
        return;
      }

      sendToContentScript({ type: "applyPreset", presetId: preset.id }, function handleApplied(result) {
        if (result.ok && result.skipped) {
          setStatus(message + " CleanView is off; turn it on to apply.");
        } else {
          setStatus(result.ok ? message + " Applied to current page." : message + " Saved; open GHL to apply.", !result.ok);
        }
        render();
      });
    });
  }

  function setMenuCheckboxes(checked) {
    menuEditor.querySelectorAll("[data-menu-key]").forEach(function updateCheckbox(checkbox) {
      checkbox.checked = checked;
    });
  }

  function resetMenuCheckboxesToPresetDefault() {
    var preset = selectedPreset();
    var visibleSet = new Set((preset && preset.visibleItems) || []);

    menuEditor.querySelectorAll("[data-menu-key]").forEach(function resetCheckbox(checkbox) {
      checkbox.checked = visibleSet.has(checkbox.dataset.menuKey);
    });
  }

  function applySidebarPresetToForm(presetKey) {
    var style = storage.normalizeSidebarStyle(sidebarStylePresets[presetKey] || {});
    sidebarStyleEnabled.checked = style.enabled === true;
    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function updateField(input) {
      input.value = style[input.dataset.sidebarStyleField] || "";
    });
  }

  function refreshActiveLocation() {
    sendToContentScript({ type: "getPageContext" }, function handleContext(result) {
      activeLocationId = result.ok ? result.locationId || null : null;
      currentLocationLabel.textContent = activeLocationId ? "Current GHL Location: " + activeLocationId : "Current GHL Location: not detected";
    });
  }

  function loadState() {
    storage.getState(function handleState(nextState, error) {
      if (error) {
        setStatus("Unable to load CleanView settings.", true);
        return;
      }
      state = nextState;
      selectedPresetId = state.activePresetId || "builtin:simple";
      render();
      refreshActiveLocation();
    });
  }

  document.querySelectorAll("[data-tab-button]").forEach(function bindTab(button) {
    button.addEventListener("click", function switchTab() {
      activeTab = button.dataset.tabButton;
      renderTabState();
    });
  });

  document.getElementById("createPresetButton").addEventListener("click", function createPreset() {
    persistPreset(storage.normalizePreset({
      id: namespace.createId("custom"),
      name: "New Custom View",
      description: "",
      visibleItems: allMenuKeys.slice(),
      labelOverrides: {},
      customLinks: [],
      sidebarStyle: namespace.defaultSidebarStyle
    }), "Custom view created.", false);
  });

  document.getElementById("duplicatePresetButton").addEventListener("click", function duplicatePreset() {
    var duplicate = storage.duplicatePreset(state, selectedPresetId);
    if (duplicate) {
      persistPreset(duplicate, "View duplicated.", false);
    }
  });

  document.getElementById("savePresetButton").addEventListener("click", function savePreset() {
    persistPreset(collectPresetFromForm(), "View saved.", false);
  });

  document.getElementById("saveApplyPresetButton").addEventListener("click", function saveAndApplyPreset() {
    persistPreset(collectPresetFromForm(), "View saved.", true);
  });

  document.getElementById("selectAllMenusButton").addEventListener("click", function selectAllMenus() {
    setMenuCheckboxes(true);
    setStatus("All GHL menu items selected.");
  });

  document.getElementById("deselectAllMenusButton").addEventListener("click", function deselectAllMenus() {
    setMenuCheckboxes(false);
    setStatus("All menu items deselected. Add back the items you want visible.");
  });

  document.getElementById("resetMenuDefaultsButton").addEventListener("click", function resetMenuDefaults() {
    resetMenuCheckboxesToPresetDefault();
    setStatus("Menu items reset to the selected view default.");
  });

  document.getElementById("deletePresetButton").addEventListener("click", function deletePreset() {
    if (!isCustomPreset(selectedPreset())) {
      return;
    }

    storage.updateState(function deleteSelectedPreset(nextState) {
      delete nextState.presets[selectedPresetId];
      Object.keys(nextState.locationRules).forEach(function removeRulesForPreset(locationId) {
        if (nextState.locationRules[locationId].presetId === selectedPresetId) {
          delete nextState.locationRules[locationId];
        }
      });
      if (nextState.activePresetId === selectedPresetId) {
        nextState.activePresetId = "builtin:simple";
      }
    }, function handleDeleted(nextState, error) {
      if (error) {
        setStatus("Unable to delete view.", true);
        return;
      }
      state = nextState;
      selectedPresetId = nextState.activePresetId || "builtin:simple";
      setStatus("Custom view deleted.");
      render();
    });
  });

  document.getElementById("addRenameButton").addEventListener("click", function addRename() {
    appendRenameRow(allMenuKeys[0], "");
  });

  document.getElementById("addLinkButton").addEventListener("click", function addLink() {
    if (linkEditor.querySelector(".help-text")) {
      linkEditor.innerHTML = "";
    }

    var row = document.createElement("div");
    var labelInput = document.createElement("input");
    var urlInput = document.createElement("input");
    var placementSelect = document.createElement("select");
    var enabledInput = document.createElement("input");
    var removeButton = document.createElement("button");

    row.className = "link-row";
    row.dataset.linkId = namespace.createId("link");
    labelInput.type = "text";
    labelInput.value = "New Quick Link";
    labelInput.dataset.linkField = "label";
    urlInput.type = "url";
    urlInput.value = "https://example.com";
    urlInput.dataset.linkField = "url";
    addPlacementOptions(placementSelect, "bottom");
    placementSelect.dataset.linkField = "placement";
    enabledInput.type = "checkbox";
    enabledInput.checked = true;
    enabledInput.dataset.linkField = "enabled";
    removeButton.type = "button";
    removeButton.className = "danger";
    removeButton.textContent = "Delete";
    removeButton.dataset.removeLinkId = row.dataset.linkId;

    row.appendChild(createFieldLabel("Label", labelInput));
    row.appendChild(createFieldLabel("URL", urlInput));
    row.appendChild(createFieldLabel("Placement", placementSelect));
    row.appendChild(createFieldLabel("Enabled", enabledInput));
    row.appendChild(removeButton);
    linkEditor.appendChild(row);
  });

  document.getElementById("resetStyleButton").addEventListener("click", function resetStyle() {
    sidebarStylePreset.value = "default";
    applySidebarPresetToForm("default");
    setStatus("Sidebar style reset.");
  });

  document.getElementById("assignCurrentLocationButton").addEventListener("click", function assignCurrentLocation() {
    if (!activeLocationId) {
      setStatus("No GHL location detected on this page.", true);
      return;
    }

    storage.updateState(function assignRule(nextState) {
      nextState.locationRules[activeLocationId] = {
        presetId: selectedPresetId,
        updatedAt: namespace.nowIso()
      };
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to save location rule.", true);
        return;
      }
      state = nextState;
      setStatus("This view will be used automatically for this GHL location.");
      render();
    });
  });

  presetSelect.addEventListener("change", function selectPreset() {
    selectedPresetId = presetSelect.value;
    render();
  });

  defaultPresetSelect.addEventListener("change", function updateDefaultPreset() {
    storage.updateState(function updateDefault(nextState) {
      nextState.activePresetId = defaultPresetSelect.value;
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to update default view.", true);
        return;
      }
      state = nextState;
      setStatus("Default view updated.");
      renderPresetSelects();
    });
  });

  renameEditor.addEventListener("click", function handleRenameClick(event) {
    if (event.target.dataset.removeRename) {
      event.target.closest("[data-rename-row='true']").remove();
    }
  });

  linkEditor.addEventListener("click", function handleLinkClick(event) {
    if (event.target.dataset.removeLinkId) {
      event.target.closest(".link-row").remove();
    }
  });

  sidebarStylePreset.addEventListener("change", function chooseStylePreset() {
    applySidebarPresetToForm(sidebarStylePreset.value);
  });

  locationRules.addEventListener("click", function handleRuleClick(event) {
    if (!event.target.dataset.removeRuleId) {
      return;
    }

    storage.updateState(function removeRule(nextState) {
      delete nextState.locationRules[event.target.dataset.removeRuleId];
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to remove location rule.", true);
        return;
      }
      state = nextState;
      setStatus("Location rule removed.");
      render();
    });
  });

  loadState();
})();
