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
  var sidebarBackgroundType = document.getElementById("sidebarBackgroundType");
  var sidebarStyleEditor = document.getElementById("sidebarStyleEditor");
  var sidebarStylePreview = document.getElementById("sidebarStylePreview");
  var sidebarStylePreviewHeaderText = document.getElementById("sidebarStylePreviewHeaderText");
  var sidebarStylePreviewLogo = document.getElementById("sidebarStylePreviewLogo");
  var sidebarBackgroundTypes = [
    { value: "solid", label: "Solid Color" },
    { value: "gradient", label: "Gradient" }
  ];
  var gradientDirections = [
    { value: "180deg", label: "Top to Bottom" },
    { value: "90deg", label: "Left to Right" },
    { value: "135deg", label: "Diagonal" },
    { value: "45deg", label: "Diagonal Reverse" },
    { value: "0deg", label: "Bottom to Top" }
  ];
  var randomGradientDirections = ["135deg", "180deg", "90deg", "45deg"];
  var borderRadiusOptions = ["6px", "8px", "10px", "12px"];
  var itemSpacingOptions = ["2px", "3px", "4px", "6px"];
  var sidebarPaddingOptions = ["8px", "10px", "12px"];
  var randomStylePalettes = [
    {
      name: "Midnight Blue",
      backgroundType: "gradient",
      backgroundColor: "#0f172a",
      gradientStartColor: "#020617",
      gradientEndColor: "#1d4ed8",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#2563eb",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1e293b"
    },
    {
      name: "Emerald Night",
      backgroundType: "gradient",
      backgroundColor: "#064e3b",
      gradientStartColor: "#022c22",
      gradientEndColor: "#047857",
      textColor: "#ecfdf5",
      activeBackgroundColor: "#10b981",
      activeTextColor: "#052e16",
      hoverBackgroundColor: "#065f46"
    },
    {
      name: "Purple Slate",
      backgroundType: "gradient",
      backgroundColor: "#312e81",
      gradientStartColor: "#111827",
      gradientEndColor: "#7c3aed",
      textColor: "#f5f3ff",
      activeBackgroundColor: "#8b5cf6",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#4c1d95"
    },
    {
      name: "Ocean Steel",
      backgroundType: "gradient",
      backgroundColor: "#0f172a",
      gradientStartColor: "#0f172a",
      gradientEndColor: "#0891b2",
      textColor: "#ecfeff",
      activeBackgroundColor: "#06b6d4",
      activeTextColor: "#083344",
      hoverBackgroundColor: "#155e75"
    },
    {
      name: "Graphite",
      backgroundType: "solid",
      backgroundColor: "#18181b",
      gradientStartColor: "",
      gradientEndColor: "",
      textColor: "#f4f4f5",
      activeBackgroundColor: "#3f3f46",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#27272a"
    },
    {
      name: "Clean Cloud",
      backgroundType: "solid",
      backgroundColor: "#ffffff",
      gradientStartColor: "",
      gradientEndColor: "",
      textColor: "#111827",
      activeBackgroundColor: "#dbeafe",
      activeTextColor: "#1e3a8a",
      hoverBackgroundColor: "#f1f5f9"
    },
    {
      name: "Royal Night",
      backgroundType: "gradient",
      backgroundColor: "#1e1b4b",
      gradientStartColor: "#0f172a",
      gradientEndColor: "#4f46e5",
      textColor: "#eef2ff",
      activeBackgroundColor: "#6366f1",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#312e81"
    },
    {
      name: "Copper Slate",
      backgroundType: "gradient",
      backgroundColor: "#292524",
      gradientStartColor: "#1c1917",
      gradientEndColor: "#b45309",
      textColor: "#fffbeb",
      activeBackgroundColor: "#f59e0b",
      activeTextColor: "#1c1917",
      hoverBackgroundColor: "#78350f"
    }
  ];
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
    { section: "Solid Background", key: "backgroundColor", label: "Sidebar Background", type: "color", mode: "solid" },
    { section: "Gradient Background", key: "gradientStartColor", label: "Start Color", type: "color", mode: "gradient" },
    { key: "gradientEndColor", label: "End Color", type: "color", mode: "gradient" },
    { key: "gradientDirection", label: "Direction", type: "select", options: gradientDirections, mode: "gradient" },
    { section: "Menu Colors", key: "textColor", label: "Menu Text", type: "color" },
    { key: "activeBackgroundColor", label: "Active Item Background", type: "color" },
    { key: "activeTextColor", label: "Active Item Text", type: "color" },
    { key: "hoverBackgroundColor", label: "Hover Background", type: "color" },
    { section: "Shape", key: "borderRadius", label: "Menu Item Radius", type: "text" },
    { key: "itemSpacing", label: "Menu Item Spacing", type: "text" },
    { key: "sidebarPadding", label: "Sidebar Padding", type: "text" },
    { section: "Branding", key: "logoUrl", label: "Optional Logo URL", type: "url" },
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

  function createSectionHeading(text) {
    var heading = document.createElement("h3");
    heading.className = "form-section-heading";
    heading.textContent = text;
    return heading;
  }

  function isValidHexColor(value) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(String(value || "").trim());
  }

  function normalizeHexColor(value, fallback) {
    var trimmed = String(value || "").trim();

    if (isValidHexColor(trimmed)) {
      return trimmed.length === 4 ?
        "#" + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3] :
        trimmed;
    }

    return fallback || "#000000";
  }

  function bindColorControl(pickerEl, textEl, onChange) {
    if (!pickerEl || !textEl) {
      return;
    }

    pickerEl.addEventListener("input", function updateFromPicker() {
      textEl.value = pickerEl.value;
      onChange(pickerEl.value);
      updateSidebarStylePreview();
    });

    textEl.addEventListener("input", function updateFromText() {
      var value = textEl.value.trim();

      if (isValidHexColor(value)) {
        var normalized = normalizeHexColor(value);
        pickerEl.value = normalized;
        onChange(normalized);
        updateSidebarStylePreview();
        return;
      }

      onChange(value);
      updateSidebarStylePreview();
    });
  }

  function getSidebarBackground(style) {
    if (style.backgroundType === "gradient") {
      var start = style.gradientStartColor || style.backgroundColor || "#0f172a";
      var end = style.gradientEndColor || style.backgroundColor || "#1d4ed8";
      var direction = style.gradientDirection || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return style.backgroundColor || "#ffffff";
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
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

  function ensureCustomStyleOption(labelText) {
    var option = sidebarStylePreset.querySelector("option[value='custom']");

    if (!option) {
      option = document.createElement("option");
      option.value = "custom";
      sidebarStylePreset.appendChild(option);
    }

    option.textContent = labelText || "Custom Draft";
  }

  function renderSidebarBackgroundTypeOptions(selectedValue) {
    sidebarBackgroundType.innerHTML = "";
    sidebarBackgroundTypes.forEach(function addOption(backgroundType) {
      var option = document.createElement("option");
      option.value = backgroundType.value;
      option.textContent = backgroundType.label;
      sidebarBackgroundType.appendChild(option);
    });
    sidebarBackgroundType.value = selectedValue || "solid";
  }

  function createSelectField(field, style) {
    var select = document.createElement("select");
    (field.options || []).forEach(function addOption(optionDefinition) {
      var option = document.createElement("option");
      option.value = optionDefinition.value;
      option.textContent = optionDefinition.label;
      select.appendChild(option);
    });
    select.value = style[field.key] || field.defaultValue || "";
    select.dataset.sidebarStyleField = field.key;
    select.addEventListener("change", updateSidebarStylePreview);
    return createFieldLabel(field.label, select);
  }

  function createColorField(field, style) {
    var wrapper = document.createElement("label");
    var controls = document.createElement("span");
    var picker = document.createElement("input");
    var textInput = document.createElement("input");
    var value = style[field.key] || "";

    wrapper.className = "inline-field color-field";
    controls.className = "color-control";
    picker.type = "color";
    picker.value = normalizeHexColor(value);
    textInput.type = "text";
    textInput.value = value;
    textInput.placeholder = "#0f172a";
    textInput.dataset.sidebarStyleField = field.key;

    bindColorControl(picker, textInput, function syncColor(value) {
      textInput.value = value;
    });

    wrapper.appendChild(document.createTextNode(field.label));
    controls.appendChild(picker);
    controls.appendChild(textInput);
    wrapper.appendChild(controls);
    return wrapper;
  }

  function createTextField(field, style) {
    var input = document.createElement("input");
    input.type = field.type;
    input.value = style[field.key] || "";
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("input", updateSidebarStylePreview);
    return createFieldLabel(field.label, input);
  }

  function syncSidebarModeState() {
    var backgroundType = sidebarBackgroundType.value || "solid";
    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-mode]").forEach(function updateMode(element) {
      element.classList.toggle("is-muted", element.dataset.sidebarStyleMode !== backgroundType);
    });
  }

  function populateSidebarStyleForm(style, options) {
    var normalizedStyle = storage.normalizeSidebarStyle(style);
    var presetValue = options && options.presetValue ? options.presetValue : normalizedStyle.preset || "default";

    if (!sidebarStylePresets[presetValue]) {
      ensureCustomStyleOption(options && options.optionLabel ? options.optionLabel : "Custom Draft");
    }

    sidebarStyleEnabled.checked = normalizedStyle.enabled === true;
    sidebarStylePreset.value = presetValue;
    sidebarBackgroundType.value = normalizedStyle.backgroundType || "solid";
    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function updateField(input) {
      input.value = normalizedStyle[input.dataset.sidebarStyleField] || "";
      if (input.closest(".color-control")) {
        var picker = input.closest(".color-control").querySelector("input[type='color']");
        if (picker) {
          picker.value = normalizeHexColor(input.value);
        }
      }
    });
    syncSidebarModeState();
    updateSidebarStylePreview();
  }

  function renderSidebarStyle() {
    var preset = selectedPreset();
    var style = storage.normalizeSidebarStyle(preset.sidebarStyle);
    renderSidebarBackgroundTypeOptions(style.backgroundType);
    sidebarStyleEditor.innerHTML = "";

    sidebarStyleFields.forEach(function renderStyleField(field) {
      var label = null;

      if (field.section) {
        sidebarStyleEditor.appendChild(createSectionHeading(field.section));
      }

      if (field.type === "color") {
        label = createColorField(field, style);
      } else if (field.type === "select") {
        label = createSelectField(field, style);
      } else {
        label = createTextField(field, style);
      }

      if (field.mode) {
        label.dataset.sidebarStyleMode = field.mode;
      }
      sidebarStyleEditor.appendChild(label);
    });
    populateSidebarStyleForm(style, { presetValue: style.preset || "default" });
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
    style.backgroundType = sidebarBackgroundType.value || "solid";

    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function collectField(input) {
      style[input.dataset.sidebarStyleField] = input.value.trim();
    });

    return style;
  }

  function getCurrentWorkingSidebarStyle() {
    return collectSidebarStyleFromForm();
  }

  function updateSidebarStylePreview() {
    if (!sidebarStylePreview) {
      return;
    }

    var style = getCurrentWorkingSidebarStyle();
    var background = getSidebarBackground(style);
    var textColor = style.textColor || "#111827";
    var activeBackgroundColor = style.activeBackgroundColor || "#e5e7eb";
    var activeTextColor = style.activeTextColor || textColor;
    var borderRadius = style.borderRadius || "8px";
    var itemSpacing = style.itemSpacing || "4px";
    var sidebarPadding = style.sidebarPadding || "12px";
    var headerLabel = style.headerLabel || "AgencySkin";

    sidebarStylePreview.style.background = background;
    sidebarStylePreview.style.color = textColor;
    sidebarStylePreview.style.padding = sidebarPadding;
    sidebarStylePreview.classList.toggle("is-disabled", style.enabled !== true);

    if (sidebarStylePreviewHeaderText) {
      sidebarStylePreviewHeaderText.textContent = headerLabel;
      sidebarStylePreviewHeaderText.style.color = textColor;
    }

    if (sidebarStylePreviewLogo) {
      sidebarStylePreviewLogo.src = style.logoUrl || "";
      sidebarStylePreviewLogo.hidden = !style.logoUrl;
      sidebarStylePreviewLogo.onerror = function hideBrokenLogo() {
        sidebarStylePreviewLogo.hidden = true;
      };
    }

    sidebarStylePreview.querySelectorAll(".sidebar-preview-item").forEach(function updateItem(item) {
      item.style.color = textColor;
      item.style.borderRadius = borderRadius;
      item.style.marginTop = itemSpacing;
      item.style.marginBottom = itemSpacing;
      item.style.padding = "8px 12px";
      item.style.background = "transparent";
    });

    var activeItem = sidebarStylePreview.querySelector(".sidebar-preview-item.active");
    if (activeItem) {
      activeItem.style.background = activeBackgroundColor;
      activeItem.style.color = activeTextColor;
    }
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
    populateSidebarStyleForm(style, { presetValue: presetKey || "default" });
  }

  function randomizeSidebarStyle() {
    var palette = pickRandom(randomStylePalettes);
    var backgroundType = palette.backgroundType === "gradient" ? "gradient" : "solid";
    var randomizedStyle = storage.normalizeSidebarStyle({
      enabled: true,
      preset: "custom",
      backgroundType: backgroundType,
      backgroundColor: palette.backgroundColor,
      gradientStartColor: backgroundType === "gradient" ? palette.gradientStartColor : "",
      gradientEndColor: backgroundType === "gradient" ? palette.gradientEndColor : "",
      gradientDirection: backgroundType === "gradient" ? pickRandom(randomGradientDirections) : "135deg",
      textColor: palette.textColor,
      activeBackgroundColor: palette.activeBackgroundColor,
      activeTextColor: palette.activeTextColor,
      hoverBackgroundColor: palette.hoverBackgroundColor,
      borderRadius: pickRandom(borderRadiusOptions),
      itemSpacing: pickRandom(itemSpacingOptions),
      sidebarPadding: pickRandom(sidebarPaddingOptions),
      logoUrl: "",
      headerLabel: "AgencySkin"
    });

    populateSidebarStyleForm(randomizedStyle, {
      presetValue: "custom",
      optionLabel: "Custom Draft - " + palette.name
    });
    setStatus("Randomized style preview. Save this view to keep it.");
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

  document.getElementById("randomizeStyleButton").addEventListener("click", randomizeSidebarStyle);

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

  sidebarStyleEnabled.addEventListener("change", updateSidebarStylePreview);

  sidebarBackgroundType.addEventListener("change", function changeBackgroundType() {
    syncSidebarModeState();
    updateSidebarStylePreview();
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
