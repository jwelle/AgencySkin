(function agencySkinCleanViewEditor() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var registry = namespace.selectorRegistry;
  var allMenuKeys = namespace.allMenuKeys;
  var sidebarStylePresets = namespace.sidebarStylePresets || {};
  var enableLocationViewDefaults = namespace.ENABLE_LOCATION_VIEW_DEFAULTS === true;
  var state = null;
  var selectedPresetId = "";
  var activeTab = "style";
  var activeLocationId = null;
  var draftSidebarStyle = null;

  var presetSelect = document.getElementById("presetSelect");
  var firstTimeProfileOnboarding = document.getElementById("firstTimeProfileOnboarding");
  var profileManagementPanel = document.getElementById("profileManagementPanel");
  var builderPanel = document.getElementById("builderPanel");
  var onboardingTemplateSelect = document.getElementById("onboardingTemplateSelect");
  var onboardingCreateFromTemplateButton = document.getElementById("onboardingCreateFromTemplateButton");
  var blankProfileName = document.getElementById("blankProfileName");
  var onboardingCreateBlankButton = document.getElementById("onboardingCreateBlankButton");
  var onboardingImportProfileButton = document.getElementById("onboardingImportProfileButton");
  var createProfileButton = document.getElementById("createProfileButton");
  var moreProfileActionsSelect = document.getElementById("moreProfileActionsSelect");
  var defaultPresetSelect = document.getElementById("defaultPresetSelect");
  var presetName = document.getElementById("presetName");
  var presetDescription = document.getElementById("presetDescription");
  var showInPopupToggle = document.getElementById("showInPopupToggle");
  var builtInNotice = document.getElementById("builtInNotice");
  var templateNotice = document.getElementById("templateNotice");
  var createProfileFromTemplateButton = document.getElementById("createProfileFromTemplateButton");
  var menuEditor = document.getElementById("menuEditor");
  var renameEditor = document.getElementById("renameEditor");
  var linkEditor = document.getElementById("linkEditor");
  var locationRules = document.getElementById("locationRules");
  var statusMessage = document.getElementById("statusMessage");
  var currentLocationLabel = document.getElementById("currentLocationLabel");
  var sidebarStyleEnabled = document.getElementById("sidebarStyleEnabled");
  var sidebarStylePreset = document.getElementById("sidebarStylePreset");
  var sidebarStylePath = document.getElementById("sidebarStylePath");
  var sidebarBackgroundType = document.getElementById("sidebarBackgroundType");
  var sidebarStyleEditor = document.getElementById("sidebarStyleEditor");
  var globalSidebarStyleEditor = document.getElementById("globalSidebarStyleEditor");
  var presetAdjustmentEditor = document.getElementById("presetAdjustmentEditor");
  var menuColorEditor = document.getElementById("menuColorEditor");
  var presetStylePanel = document.getElementById("presetStylePanel");
  var customStylePanel = document.getElementById("customStylePanel");
  var sidebarStylePreview = document.getElementById("sidebarStylePreview");
  var sidebarStylePreviewBackground = document.getElementById("sidebarStylePreviewBackground");
  var sidebarStylePreviewOverlay = document.getElementById("sidebarStylePreviewOverlay");
  var sidebarStylePreviewHeaderText = document.getElementById("sidebarStylePreviewHeaderText");
  var sidebarStylePreviewLogo = document.getElementById("sidebarStylePreviewLogo");
  var curatedPresetGrid = document.getElementById("curatedPresetGrid");
  var curatedShuffleButton = document.getElementById("curatedShuffleButton");
  var autoReadabilityToggle = document.getElementById("autoReadabilityToggle");
  var curatedShuffleEnabled = document.getElementById("curatedShuffleEnabled");
  var curatedShufflePool = document.getElementById("curatedShufflePool");
  var curatedShuffleFrequency = document.getElementById("curatedShuffleFrequency");
  var curatedShuffleAvoidRepeats = document.getElementById("curatedShuffleAvoidRepeats");
  var curatedShuffleCustomPool = document.getElementById("curatedShuffleCustomPool");
  var profileTransferModal = document.getElementById("profileTransferModal");
  var profileTransferTitle = document.getElementById("profileTransferTitle");
  var profileTransferSubtitle = document.getElementById("profileTransferSubtitle");
  var profileTransferCloseButton = document.getElementById("profileTransferCloseButton");
  var profileCreatePanel = document.getElementById("profileCreatePanel");
  var createBlankProfileName = document.getElementById("createBlankProfileName");
  var createBlankProfileModalButton = document.getElementById("createBlankProfileModalButton");
  var createTemplateSelect = document.getElementById("createTemplateSelect");
  var createFromTemplateModalButton = document.getElementById("createFromTemplateModalButton");
  var createImportProfileButton = document.getElementById("createImportProfileButton");
  var profileImportPanel = document.getElementById("profileImportPanel");
  var profileExportPanel = document.getElementById("profileExportPanel");
  var profileImportTextarea = document.getElementById("profileImportTextarea");
  var profileImportFile = document.getElementById("profileImportFile");
  var validateProfileImportButton = document.getElementById("validateProfileImportButton");
  var profileImportPreview = document.getElementById("profileImportPreview");
  var confirmProfileImportButton = document.getElementById("confirmProfileImportButton");
  var profileExportTextarea = document.getElementById("profileExportTextarea");
  var copyProfileJsonButton = document.getElementById("copyProfileJsonButton");
  var downloadProfileJsonButton = document.getElementById("downloadProfileJsonButton");
  var pendingImportedProfile = null;
  var currentExportJson = "";
  var currentExportFilename = "";
  var sidebarBackgroundAssets = namespace.sidebarBackgroundAssets || [];
  var sidebarPatternAssets = namespace.sidebarPatternAssets || [];
  var sidebarImageAssets = namespace.sidebarImageAssets || [];
  var curatedSidebarStylePresets = namespace.curatedSidebarStylePresets || [];
  var sidebarBackgroundTypes = [
    { value: "solid", label: "Solid" },
    { value: "gradient", label: "Gradient" },
    { value: "image", label: "Visual Image" }
  ];

  function configureLocationDefaultsUi() {
    document.querySelectorAll("[data-location-defaults-ui]").forEach(function configureLocationDefaultsElement(element) {
      element.hidden = !enableLocationViewDefaults;
    });

    if (!enableLocationViewDefaults && activeTab === "locations") {
      activeTab = "style";
    }
  }
  var gradientDirections = [
    { value: "180deg", label: "Top to Bottom" },
    { value: "90deg", label: "Left to Right" },
    { value: "135deg", label: "Diagonal" },
    { value: "45deg", label: "Diagonal Reverse" },
    { value: "0deg", label: "Bottom to Top" }
  ];
  var backgroundImageFitOptions = [
    { value: "cover", label: "Cover" },
    { value: "contain", label: "Contain" },
    { value: "auto", label: "Auto" }
  ];
  var backgroundImagePositionOptions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "center top", label: "Center Top" },
    { value: "center bottom", label: "Center Bottom" }
  ];
  var curatedShufflePoolOptions = [
    { value: "professional-patterns", label: "Professional + Curated Visuals" },
    { value: "professional", label: "Professional" },
    { value: "personal", label: "Personal" },
    { value: "patterns", label: "Curated Visuals" },
    { value: "uploads", label: "My Uploads" },
    { value: "favorites", label: "Favorites Only" }
  ];
  var curatedShuffleFrequencyOptions = [
    { value: "manual", label: "Manual Shuffle" },
    { value: "daily", label: "Daily" },
    { value: "session", label: "Every Session" }
  ];
  var curatedShuffleCustomPoolOptions = [
    { value: "solids", label: "Solids" },
    { value: "gradients", label: "Gradients" },
    { value: "patterns", label: "Curated Visuals" },
    { value: "images", label: "Images" }
  ];
  var sidebarBrandingModes = [
    { value: "keep", label: "Keep default" },
    { value: "hide", label: "Hide default" },
    { value: "replace", label: "Replace with custom" }
  ];
  var sidebarBrandingAlignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" }
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
  var cleanViewProfileSchemaVersion = "1.0.0";
  var dangerousProfileKeys = [
    "customJavaScript",
    "customCSS",
    "html",
    "script",
    "remoteScriptUrl",
    "rawSelector",
    "querySelector",
    "xpath",
    "eval",
    "unsafeExternalUrl",
    "webhookUrl",
    "trackingPixel"
  ];
  var dangerousProfileKeyLookup = dangerousProfileKeys.reduce(function indexDangerousKeys(lookup, key) {
    lookup[key.toLowerCase()] = true;
    return lookup;
  }, {});
  var allowedQuickLinkIcons = [
    "link",
    "calendar",
    "pipeline",
    "contacts",
    "dashboard",
    "reporting",
    "settings",
    "payments",
    "marketing",
    "automation",
    "sites"
  ];
  var sidebarStyleFields = [
    { key: "backgroundColor", label: "Background Color", type: "color", mode: "solid" },
    { key: "backgroundOverlayOpacity", label: "Darken", type: "range", mode: "solid" },
    { key: "backgroundOpacity", label: "Fade", type: "range", mode: "solid" },
    { key: "gradientStartColor", label: "Gradient Color 1", type: "color", mode: "gradient" },
    { key: "gradientEndColor", label: "Gradient Color 2", type: "color", mode: "gradient" },
    { key: "gradientDirection", label: "Direction", type: "select", options: gradientDirections, mode: "gradient" },
    { key: "backgroundOverlayOpacity", label: "Darken", type: "range", mode: "gradient" },
    { key: "backgroundOpacity", label: "Fade", type: "range", mode: "gradient" },
    { key: "backgroundAssetId", label: "Curated Visual", type: "select", options: function imageOptions() {
      return [{ value: "", label: "Custom Upload" }].concat(sidebarImageAssets.map(function mapImage(asset) {
        return { value: asset.id, label: asset.label };
      }));
    }, mode: "image" },
    { key: "customImageDataUrl", label: "Upload Custom Image", type: "file", mode: "image" },
    { key: "imageSettings.positionX", label: "Position X", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { key: "imageSettings.positionY", label: "Position Y", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { key: "imageSettings.scale", label: "Zoom", type: "range", min: "0.5", max: "2.5", step: "0.05", mode: "image" },
    { key: "imageSettings.opacity", label: "Fade", type: "range", mode: "image" },
    { key: "imageSettings.overlayOpacity", label: "Darken", type: "range", mode: "image" },
    { key: "imageSettings.blur", label: "Blur", type: "range", min: "0", max: "12", step: "1", unit: "px", mode: "image" },
    { key: "presetAdjustmentDarken", label: "Darken", type: "range", group: "preset-adjustment" },
    { key: "presetAdjustmentFade", label: "Fade", type: "range", group: "preset-adjustment" },
    { key: "presetAdjustmentBlur", label: "Blur", type: "range", min: "0", max: "12", step: "1", unit: "px", group: "preset-adjustment" },
    { section: "Branding", key: "sidebarBrandingMode", label: "Logo Display", type: "select", options: sidebarBrandingModes, group: "global" },
    { key: "customLogoDataUrl", label: "Logo Upload", type: "logo-file", group: "global" },
    { key: "logoUrl", label: "Logo URL", type: "url", group: "global" },
    { key: "headerLabel", label: "Brand Name", type: "text", group: "global" },
    { key: "logoSize", label: "Logo Size", type: "text", group: "global" },
    { key: "brandAccentColor", label: "Brand Accent", type: "color", group: "global" },
    { key: "headerAlignment", label: "Brand Alignment", type: "select", options: sidebarBrandingAlignmentOptions, group: "global" },
    { section: "Shape", key: "borderRadius", label: "Menu Item Radius", type: "text", group: "global" },
    { key: "sidebarRadius", label: "Sidebar Radius", type: "text", group: "global" },
    { key: "buttonRadius", label: "Button Radius", type: "text", group: "global" },
    { key: "itemSpacing", label: "Spacing Density", type: "text", group: "global" },
    { key: "sidebarPadding", label: "Sidebar Padding", type: "text", group: "global" },
    { key: "shadowStrength", label: "Shadow Strength", type: "range", group: "global" },
    { key: "borderVisible", label: "Border Visible", type: "checkbox", group: "global" },
    { key: "textColor", label: "Menu Text", type: "color", group: "menu" },
    { key: "iconColor", label: "Icon Color", type: "color", group: "menu" },
    { key: "activeBackgroundColor", label: "Active Item Background", type: "color", group: "menu" },
    { key: "activeTextColor", label: "Active Item Text", type: "color", group: "menu" },
    { key: "hoverBackgroundColor", label: "Hover Background", type: "color", group: "menu" },
    { key: "dividerColor", label: "Divider Color", type: "color", group: "menu" },
    { key: "badgeColor", label: "Badge Color", type: "color", group: "menu" }
  ];

  function setStatus(message, isError) {
    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
  }

  function allPresets() {
    return storage.getAllPresets(state);
  }

  function isEditableProfile(preset) {
    return preset && preset.source !== "builtin" && preset.archived !== true;
  }

  function editableProfileIds(nextState) {
    var presets = storage.getAllPresets(nextState || state);
    return Object.keys(presets).filter(function keepEditableProfile(presetId) {
      return isEditableProfile(presets[presetId]);
    });
  }

  function templateIds() {
    var presets = allPresets();
    return Object.keys(presets).filter(function keepTemplate(presetId) {
      return presets[presetId] && presets[presetId].source === "builtin" && presetId !== "builtin:blank";
    });
  }

  function normalizeDisplayName(name, fallback) {
    return String(name || fallback || "CleanView")
      .replace(/\s+(View|Template|Profile)$/i, "")
      .trim();
  }

  function templateDisplayName(preset) {
    return normalizeDisplayName(preset && (preset.name || preset.label), "CleanView") + " Template";
  }

  function profileNameFromTemplate(preset) {
    return normalizeDisplayName(preset && (preset.name || preset.label), "CleanView") + " Profile";
  }

  function nextCopyName(name) {
    return normalizeDisplayName(name, "CleanView") + " Profile Copy";
  }

  function resolveInitialProfileId(nextState) {
    var presets = storage.getAllPresets(nextState || state);
    var profileIds = editableProfileIds(nextState || state);
    var candidates = [
      (nextState || state || {}).lastEditedProfileId,
      (nextState || state || {}).activePresetId
    ];
    var selected = "";

    candidates.some(function chooseCandidate(presetId) {
      if (presetId && presets[presetId] && isEditableProfile(presets[presetId])) {
        selected = presetId;
        return true;
      }
      return false;
    });

    return selected || profileIds[0] || "";
  }

  function selectedPreset() {
    return storage.getPresetById(state, selectedPresetId);
  }

  function isCustomPreset(preset) {
    return isEditableProfile(preset);
  }

  function selectedEditablePreset() {
    var preset = selectedPreset();

    if (isCustomPreset(preset)) {
      return storage.normalizePreset(preset);
    }

    preset = preset || storage.getPresetById(state, "builtin:blank") || {
      name: "My CleanView",
      description: "",
      visibleItems: allMenuKeys.slice(),
      labelOverrides: {},
      customLinks: [],
      sidebarStyle: namespace.defaultSidebarStyle
    };

    return storage.normalizePreset({
      id: namespace.createId("custom"),
      name: nextCopyName(preset && (preset.name || preset.label)),
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
    if (!preset) {
      return "Unknown Profile";
    }

    return (preset.source === "builtin" ? templateDisplayName(preset) : preset.name || preset.label || "Untitled Profile") + (preset.source === "builtin" ? " (Template)" : " (Profile)");
  }

  function fillPresetSelect(select, selectedValue) {
    var presets = allPresets();
    if (!select) {
      return;
    }
    select.innerHTML = "";

    Object.keys(presets).forEach(function addOption(presetId) {
      var option = document.createElement("option");
      option.value = presetId;
      option.textContent = optionLabel(presets[presetId]);
      select.appendChild(option);
    });

    select.value = selectedValue || selectedPresetId;
  }

  function renderOnboardingTemplateSelect() {
    fillTemplateSelect(onboardingTemplateSelect);
  }

  function fillTemplateSelect(select) {
    if (!select) {
      return;
    }

    select.innerHTML = "";
    templateIds().forEach(function addTemplateOption(presetId) {
      var option = document.createElement("option");
      var preset = allPresets()[presetId];
      option.value = presetId;
      option.textContent = templateDisplayName(preset);
      select.appendChild(option);
    });
  }

  function renderBuilderVisibility() {
    if (selectedPresetId && !storage.getPresetById(state, selectedPresetId)) {
      selectedPresetId = resolveInitialProfileId(state);
    }
    var showOnboarding = editableProfileIds(state).length === 0 && !selectedPresetId;
    if (firstTimeProfileOnboarding) {
      firstTimeProfileOnboarding.hidden = !showOnboarding;
    }
    if (profileManagementPanel) {
      profileManagementPanel.hidden = showOnboarding;
    }
    if (builderPanel) {
      builderPanel.hidden = showOnboarding;
    }
    if (showOnboarding) {
      renderOnboardingTemplateSelect();
    }
    return showOnboarding;
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
    if (!preset) {
      return;
    }

    presetName.value = isEditable ? preset.name || preset.label || "" : templateDisplayName(preset);
    presetDescription.value = preset.description || "";
    showInPopupToggle.checked = preset.showInPopup !== false;
    presetName.disabled = !isEditable;
    presetDescription.disabled = !isEditable;
    showInPopupToggle.disabled = !isEditable;
    document.getElementById("deletePresetButton").disabled = !isEditable;
    builtInNotice.textContent = isEditable ? "" : "";
    if (templateNotice) {
      templateNotice.hidden = isEditable;
    }
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

  function clampOpacity(value) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return 0.35;
    }

    return Math.min(1, Math.max(0, numeric));
  }

  function hexToRgb(hex) {
    var normalized = normalizeHexColor(hex || "#000000", "#000000").replace("#", "");
    var bigint = parseInt(normalized, 16);

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function getOverlayRgba(color, opacity) {
    var rgb = hexToRgb(color || "#000000");
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + clampOpacity(opacity) + ")";
  }

  function getBackgroundColorValue(color, opacity) {
    return getOverlayRgba(color || "#000000", opacity === undefined ? 1 : opacity);
  }

  function clampNumber(value, min, max, fallback) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, numeric));
  }

  function getByPath(object, path, fallback) {
    var value = String(path || "").split(".").reduce(function readPath(current, part) {
      return current && current[part] !== undefined ? current[part] : undefined;
    }, object);

    return value === undefined ? fallback : value;
  }

  function setByPath(object, path, value) {
    var parts = String(path || "").split(".");
    var target = object;

    parts.slice(0, -1).forEach(function ensurePart(part) {
      if (!target[part] || typeof target[part] !== "object") {
        target[part] = {};
      }
      target = target[part];
    });
    target[parts[parts.length - 1]] = value;
  }

  function getAssetById(assetId) {
    return namespace.getSidebarBackgroundAssetById ? namespace.getSidebarBackgroundAssetById(assetId) : sidebarBackgroundAssets.find(function findAsset(asset) {
      return asset.id === assetId;
    }) || null;
  }

  function getCuratedPresetById(presetId) {
    return namespace.getCuratedSidebarStylePresetById ? namespace.getCuratedSidebarStylePresetById(presetId) : curatedSidebarStylePresets.find(function findPreset(preset) {
      return preset.id === presetId;
    }) || null;
  }

  function getExtensionAssetUrl(asset) {
    if (!asset || !asset.filename) {
      return "";
    }

    if (typeof chrome !== "undefined" && chrome.runtime && typeof chrome.runtime.getURL === "function") {
      return chrome.runtime.getURL(asset.filename);
    }

    return asset.filename;
  }

  function getPatternSize(style) {
    var scale = clampNumber(getByPath(style, "patternSettings.scale", 1), 0.5, 2.5, 1);
    return Math.round(28 * scale) + "px " + Math.round(28 * scale) + "px";
  }

  function getImagePosition(style) {
    var x = clampNumber(getByPath(style, "imageSettings.positionX", 50), 0, 100, 50);
    var y = clampNumber(getByPath(style, "imageSettings.positionY", 50), 0, 100, 50);
    return x + "% " + y + "%";
  }

  function getImageScale(style) {
    var scale = clampNumber(getByPath(style, "imageSettings.scale", 1), 0.5, 2.5, 1);
    return Math.round(scale * 100) + "% auto";
  }

  function getImageUrl(style) {
    var asset = getAssetById(style.backgroundAssetId);

    return style.customImageDataUrl || getExtensionAssetUrl(asset) || style.backgroundImageUrl || "";
  }

  function getStylePreviewBackground(style) {
    var asset = getAssetById(style.backgroundAssetId);

    if (style.backgroundType === "image") {
      var imageUrl = getImageUrl(style);
      return imageUrl ? "url(\"" + imageUrl + "\")" : "";
    }

    if (style.backgroundType === "pattern" && asset) {
      return asset.patternCss || "";
    }

    return "";
  }

  function getOverlayOpacity(style) {
    var asset = getAssetById(style.backgroundAssetId);
    var fallback = asset && asset.recommendedOverlayOpacity !== undefined ? asset.recommendedOverlayOpacity : 0.35;

    if (style.backgroundType === "image") {
      return style.autoReadability === false ? clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback)) : Math.max(fallback, clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback)));
    }

    if (style.backgroundType === "pattern") {
      return clampOpacity(getByPath(style, "patternSettings.overlayOpacity", fallback));
    }

    return clampOpacity(style.backgroundOverlayOpacity);
  }

  function applyAssetDefaults(style, asset) {
    if (!asset) {
      return style;
    }

    style.backgroundAssetId = asset.id;
    style.backgroundType = asset.type;
    style.textColor = asset.textColor || style.textColor;
    style.activeBackgroundColor = asset.activeBackgroundColor || style.activeBackgroundColor;
    style.activeTextColor = asset.activeTextColor || style.activeTextColor;
    style.hoverBackgroundColor = asset.hoverBackgroundColor || style.hoverBackgroundColor;

    if (asset.type === "image") {
      style.customImageDataUrl = "";
      style.backgroundImageUrl = "";
      style.imageSettings = Object.assign({}, style.imageSettings || {}, {
        positionX: asset.focalPointX || 50,
        positionY: asset.focalPointY || 50,
        scale: asset.defaultScale || 1,
        blur: asset.recommendedBlur || 0,
        overlayOpacity: asset.recommendedOverlayOpacity || 0.55
      });
    }

    if (asset.type === "pattern") {
      style.backgroundColor = asset.backgroundColor || style.backgroundColor;
      style.patternSettings = Object.assign({}, style.patternSettings || {}, {
        scale: asset.defaultScale || 1,
        opacity: 0.5,
        overlayOpacity: asset.recommendedOverlayOpacity || 0.35
      });
    }

    draftSidebarStyle = storage.normalizeSidebarStyle(style);
    return draftSidebarStyle;
  }

  function applyCuratedStyleToStyle(style, preset) {
    var nextStyle = storage.normalizeSidebarStyle(Object.assign({}, style, preset.style || {}));
    var asset = preset.assetId ? getAssetById(preset.assetId) : null;

    nextStyle.enabled = true;
    nextStyle.preset = "custom";
    nextStyle.activePresetId = preset.id;
    if (asset) {
      nextStyle = applyAssetDefaults(nextStyle, asset);
    }

    return storage.normalizeSidebarStyle(nextStyle);
  }

  function applyAssetDefaultsForProfileJson(style, asset) {
    var nextStyle = storage.normalizeSidebarStyle(style);

    if (!asset) {
      return nextStyle;
    }

    nextStyle.backgroundAssetId = asset.id;
    nextStyle.backgroundType = asset.type === "pattern" ? "pattern" : "image";
    nextStyle.textColor = asset.textColor || nextStyle.textColor;
    nextStyle.activeBackgroundColor = asset.activeBackgroundColor || nextStyle.activeBackgroundColor;
    nextStyle.activeTextColor = asset.activeTextColor || nextStyle.activeTextColor;
    nextStyle.hoverBackgroundColor = asset.hoverBackgroundColor || nextStyle.hoverBackgroundColor;

    if (asset.type === "image") {
      nextStyle.customImageDataUrl = "";
      nextStyle.backgroundImageUrl = "";
      nextStyle.imageSettings = Object.assign({}, nextStyle.imageSettings || {}, {
        positionX: asset.focalPointX || 50,
        positionY: asset.focalPointY || 50,
        scale: asset.defaultScale || 1,
        blur: asset.recommendedBlur || 0,
        overlayOpacity: asset.recommendedOverlayOpacity || 0.55
      });
    }

    if (asset.type === "pattern") {
      nextStyle.backgroundColor = asset.backgroundColor || nextStyle.backgroundColor;
      nextStyle.patternSettings = Object.assign({}, nextStyle.patternSettings || {}, {
        scale: asset.defaultScale || 1,
        opacity: 0.5,
        overlayOpacity: asset.recommendedOverlayOpacity || 0.35
      });
    }

    return storage.normalizeSidebarStyle(nextStyle);
  }

  function getCuratedStyleForProfileJson(presetId) {
    var curatedPreset = getCuratedPresetById(presetId);
    var style = null;

    if (!curatedPreset) {
      return null;
    }

    style = storage.normalizeSidebarStyle(Object.assign({}, namespace.defaultSidebarStyle, curatedPreset.style || {}));
    style.enabled = true;
    style.stylePath = "preset";
    style.preset = "custom";
    style.activePresetId = curatedPreset.id;
    if (curatedPreset.assetId) {
      style = applyAssetDefaultsForProfileJson(style, getAssetById(curatedPreset.assetId));
    }
    return storage.normalizeSidebarStyle(style);
  }

  function parsePixelNumber(value, fallback) {
    var match = String(value || "").match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : fallback;
  }

  function shadowStrengthName(value) {
    var numeric = clampNumber(value, 0, 1, 0.35);
    if (numeric <= 0.05) {
      return "none";
    }
    if (numeric <= 0.3) {
      return "soft";
    }
    if (numeric <= 0.6) {
      return "medium";
    }
    return "strong";
  }

  function shadowStrengthValue(value) {
    if (value === "none") {
      return 0;
    }
    if (value === "medium") {
      return 0.5;
    }
    if (value === "strong") {
      return 0.75;
    }
    return 0.25;
  }

  function spacingDensityName(value) {
    var numeric = parsePixelNumber(value, 4);
    if (numeric <= 2) {
      return "compact";
    }
    if (numeric >= 7) {
      return "spacious";
    }
    return "comfortable";
  }

  function spacingDensityValue(value) {
    if (value === "compact") {
      return "2px";
    }
    if (value === "spacious") {
      return "8px";
    }
    return "4px";
  }

  function logoSizeName(value) {
    var numeric = parsePixelNumber(value, 32);
    if (numeric <= 26) {
      return "small";
    }
    if (numeric >= 38) {
      return "large";
    }
    return "medium";
  }

  function logoSizeValue(value) {
    if (value === "small") {
      return "24px";
    }
    if (value === "large") {
      return "40px";
    }
    return "32px";
  }

  function isSafeRgbaColor(value) {
    var match = String(value || "").trim().match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i);
    if (!match) {
      return false;
    }
    return [1, 2, 3].every(function checkChannel(index) {
      var channel = Number(match[index]);
      return channel >= 0 && channel <= 255;
    }) && Number(match[4]) >= 0 && Number(match[4]) <= 1;
  }

  function isSafeProfileColor(value) {
    return isValidHexColor(value) || isSafeRgbaColor(value);
  }

  function normalizeProfileColor(value, fallback) {
    var trimmed = String(value || "").trim();
    if (isValidHexColor(trimmed)) {
      return normalizeHexColor(trimmed, fallback);
    }
    if (isSafeRgbaColor(trimmed)) {
      return trimmed;
    }
    return fallback || "";
  }

  function isSafeImageDataUrl(value) {
    return /^data:image\/(png|jpe?g|webp);base64,/i.test(String(value || ""));
  }

  function hasUnsafeText(value) {
    return /[<>]/.test(String(value || "")) || /[\u0000-\u001f\u007f]/.test(String(value || "").replace(/[\r\n\t]/g, ""));
  }

  function sanitizeProfileText(value, maxLength, fieldName, errors, required) {
    var text = "";

    if (value !== undefined && value !== null && typeof value !== "string") {
      errors.push(fieldName + " must be plain text.");
      return "";
    }

    text = String(value === undefined || value === null ? "" : value).trim();

    if (required && !text) {
      errors.push(fieldName + " is required.");
      return "";
    }

    if (hasUnsafeText(text)) {
      errors.push(fieldName + " must be plain text.");
      return "";
    }

    if (text.length > maxLength) {
      errors.push(fieldName + " must be " + maxLength + " characters or fewer.");
      return "";
    }

    return text;
  }

  function isSafeHttpsUrl(value, maxLength) {
    var text = String(value || "").trim();
    var parsed = null;

    if (!text || text.length > (maxLength || 1000)) {
      return false;
    }
    if (!/^https:\/\//i.test(text) || hasUnsafeText(text) || /[\u0000-\u001f\u007f]/.test(text) || /javascript:|data:text\/html|expression\s*\(|<script/i.test(text)) {
      return false;
    }
    try {
      parsed = new URL(text);
    } catch (error) {
      return false;
    }
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  }

  function isSafeExternalImageUrl(value) {
    var text = String(value || "").trim();
    var parsed = null;
    var path = "";

    if (!isSafeHttpsUrl(text, 1000)) {
      return false;
    }
    if (/[\u0000-\u001f\u007f]/.test(text) || /javascript:|data:|blob:|file:|chrome-extension:/i.test(text)) {
      return false;
    }
    try {
      parsed = new URL(text);
    } catch (error) {
      return false;
    }
    path = parsed.pathname.toLowerCase();
    return /\.(png|jpe?g|webp|gif|svg)$/.test(path);
  }

  function sanitizeOptionalMetadataText(value, maxLength, fieldName, errors) {
    if (value === undefined || value === null || value === "") {
      return "";
    }
    return sanitizeProfileText(value, maxLength, fieldName, errors, false);
  }

  function validateBusinessContext(context, errors) {
    var metadata = {};

    if (context === undefined || context === null) {
      return metadata;
    }
    if (typeof context !== "object" || Array.isArray(context)) {
      errors.push("businessContext must be an object.");
      return metadata;
    }

    metadata.companyName = sanitizeOptionalMetadataText(context.companyName, 120, "businessContext.companyName", errors);
    if (context.website !== undefined && context.website !== null && context.website !== "") {
      if (typeof context.website !== "string" || !isSafeHttpsUrl(context.website, 500)) {
        errors.push("businessContext.website must be a safe HTTPS URL.");
      } else {
        metadata.website = context.website.trim();
      }
    }
    metadata.industry = sanitizeOptionalMetadataText(context.industry, 80, "businessContext.industry", errors);
    metadata.role = sanitizeOptionalMetadataText(context.role, 80, "businessContext.role", errors);
    metadata.audience = sanitizeOptionalMetadataText(context.audience, 160, "businessContext.audience", errors);
    return metadata;
  }

  function validateDesignContext(context, errors) {
    var metadata = {};

    if (context === undefined || context === null) {
      return metadata;
    }
    if (typeof context !== "object" || Array.isArray(context)) {
      errors.push("designContext must be an object.");
      return metadata;
    }

    metadata.styleIntent = sanitizeOptionalMetadataText(context.styleIntent, 160, "designContext.styleIntent", errors);
    if (context.primaryColor !== undefined && context.primaryColor !== null && context.primaryColor !== "") {
      metadata.primaryColor = requireHexProfileColor(context.primaryColor, "", "designContext.primaryColor", errors);
    }
    if (context.accentColor !== undefined && context.accentColor !== null && context.accentColor !== "") {
      metadata.accentColor = requireHexProfileColor(context.accentColor, "", "designContext.accentColor", errors);
    }
    metadata.reasoningSummary = sanitizeOptionalMetadataText(context.reasoningSummary, 300, "designContext.reasoningSummary", errors);
    return metadata;
  }

  function validateAiSummary(summary, errors) {
    var metadata = {};

    if (summary === undefined || summary === null) {
      return metadata;
    }
    if (typeof summary !== "object" || Array.isArray(summary)) {
      errors.push("aiSummary must be an object.");
      return metadata;
    }

    metadata.plainEnglishSummary = sanitizeOptionalMetadataText(summary.plainEnglishSummary, 300, "aiSummary.plainEnglishSummary", errors);
    metadata.hiddenBecause = sanitizeOptionalMetadataText(summary.hiddenBecause, 300, "aiSummary.hiddenBecause", errors);
    metadata.bestFor = sanitizeOptionalMetadataText(summary.bestFor, 240, "aiSummary.bestFor", errors);
    return metadata;
  }

  function pruneEmptyMetadataGroup(group) {
    var cleaned = {};

    Object.keys(group || {}).forEach(function keepValue(key) {
      if (group[key]) {
        cleaned[key] = group[key];
      }
    });
    return cleaned;
  }

  function normalizeProfileMetadata(profile, errors) {
    var metadata = {
      businessContext: pruneEmptyMetadataGroup(validateBusinessContext(profile.businessContext, errors)),
      designContext: pruneEmptyMetadataGroup(validateDesignContext(profile.designContext, errors)),
      aiSummary: pruneEmptyMetadataGroup(validateAiSummary(profile.aiSummary, errors))
    };

    if (!Object.keys(metadata.businessContext).length && !Object.keys(metadata.designContext).length && !Object.keys(metadata.aiSummary).length) {
      return null;
    }
    return metadata;
  }

  function findDangerousProfileFields(value, path, errors) {
    if (typeof value === "string") {
      if (/<[^>]*>|javascript:|data:text\/html|expression\s*\(/i.test(value)) {
        errors.push("Unsafe content is not allowed in " + (path || "Profile JSON") + ".");
      }
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    Object.keys(value).forEach(function inspectKey(key) {
      var keyPath = path ? path + "." + key : key;
      if (dangerousProfileKeyLookup[key.toLowerCase()] === true) {
        errors.push("Unsupported executable field is not allowed: " + keyPath);
        return;
      }
      findDangerousProfileFields(value[key], keyPath, errors);
    });
  }

  function menuKeyFromProfileJson(value) {
    var normalized = String(value || "").trim();
    var lower = normalized.toLowerCase();
    var match = null;

    if (registry[normalized]) {
      return normalized;
    }

    allMenuKeys.some(function findByLabel(key) {
      var label = registry[key] && registry[key].label ? registry[key].label.toLowerCase() : "";
      if (label === lower || key.toLowerCase() === lower) {
        match = key;
        return true;
      }
      return false;
    });

    return match;
  }

  function validateMenuList(list, fieldName, errors) {
    if (list === undefined) {
      return [];
    }
    if (!Array.isArray(list)) {
      errors.push(fieldName + " must be an array.");
      return [];
    }
    return list.reduce(function collectMenuIds(menuIds, item) {
      var key = menuKeyFromProfileJson(item);
      if (!key) {
        errors.push(fieldName + " contains an unsupported menu ID: " + item);
        return menuIds;
      }
      if (menuIds.indexOf(key) === -1) {
        menuIds.push(key);
      }
      return menuIds;
    }, []);
  }

  function resolveMenuItemsFromProfileJson(menuItems, errors) {
    var hidden = [];
    var visible = [];

    if (!menuItems || typeof menuItems !== "object" || Array.isArray(menuItems)) {
      return allMenuKeys.slice();
    }

    hidden = validateMenuList(menuItems.hidden, "menuItems.hidden", errors);
    visible = validateMenuList(menuItems.visible, "menuItems.visible", errors);

    if (visible.length) {
      return visible;
    }

    if (hidden.length) {
      return allMenuKeys.filter(function keepVisibleMenu(key) {
        return hidden.indexOf(key) === -1;
      });
    }

    return allMenuKeys.slice();
  }

  function resolveRenameLabelsFromProfileJson(renameLabels, errors) {
    var labelOverrides = {};
    var entries = [];

    if (!renameLabels) {
      return labelOverrides;
    }

    if (typeof renameLabels !== "object" || Array.isArray(renameLabels)) {
      errors.push("renameLabels must be an object.");
      return labelOverrides;
    }

    entries = Object.keys(renameLabels).slice(0, 31);
    if (entries.length > 30) {
      errors.push("renameLabels can include at most 30 entries.");
      return labelOverrides;
    }

    entries.forEach(function collectRename(originalLabel) {
      var key = menuKeyFromProfileJson(originalLabel);
      var replacement = sanitizeProfileText(renameLabels[originalLabel], 60, "renameLabels." + originalLabel, errors, true);

      if (!key) {
        errors.push("renameLabels contains an unsupported menu label: " + originalLabel);
        return;
      }
      if (String(originalLabel).length > 60) {
        errors.push("Rename source labels must be 60 characters or fewer.");
        return;
      }
      if (replacement) {
        labelOverrides[key] = replacement;
      }
    });

    return labelOverrides;
  }

  function isSafeRelativePath(value) {
    var text = String(value || "").trim();
    return /^\/(?!\/)[A-Za-z0-9/_?&=.#%+-]*$/.test(text) &&
      !/javascript:|data:|<|>|script/i.test(text);
  }

  function requireProfileColor(value, fallback, fieldName, errors) {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    if (!isSafeProfileColor(value)) {
      errors.push(fieldName + " must be a hex or safe rgba color.");
      return fallback;
    }
    return normalizeProfileColor(value, fallback);
  }

  function requireHexProfileColor(value, fallback, fieldName, errors) {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    if (!isValidHexColor(value)) {
      errors.push(fieldName + " must be a hex color.");
      return fallback;
    }
    return normalizeHexColor(value, fallback);
  }

  function normalizeImportedGradientDirection(value, errors) {
    var direction = String(value || "135deg").trim();
    var directionMap = {
      "to bottom": "180deg",
      "to right": "90deg",
      "to top": "0deg",
      "to left": "270deg"
    };
    var allowedDirections = gradientDirections.map(function mapDirection(option) {
      return option.value;
    }).concat(["270deg"]);

    direction = directionMap[direction] || direction;
    if (allowedDirections.indexOf(direction) === -1) {
      errors.push("sidebarStyle.custom.gradient.direction is not supported.");
      return "135deg";
    }
    return direction;
  }

  function resolveQuickLinksFromProfileJson(quickLinks, errors) {
    if (!quickLinks) {
      return [];
    }

    if (!Array.isArray(quickLinks)) {
      errors.push("quickLinks must be an array.");
      return [];
    }

    if (quickLinks.length > 12) {
      errors.push("quickLinks can include at most 12 links.");
      return [];
    }

    return quickLinks.reduce(function collectLinks(links, link, index) {
      var label = "";
      var url = "";
      var icon = "";
      var openIn = "";

      if (!link || typeof link !== "object" || Array.isArray(link)) {
        errors.push("quickLinks[" + index + "] must be an object.");
        return links;
      }

      label = sanitizeProfileText(link.label, 40, "quickLinks[" + index + "].label", errors, true);
      url = String(link.url || "").trim();
      icon = String(link.icon || "link").trim();
      openIn = String(link.openIn || "new_tab").trim();

      if (!isSafeRelativePath(url)) {
        errors.push("quickLinks[" + index + "].url must be a relative GHL path starting with /.");
        return links;
      }
      if (allowedQuickLinkIcons.indexOf(icon) === -1) {
        errors.push("quickLinks[" + index + "].icon is not supported.");
        return links;
      }
      if (openIn !== "same_tab" && openIn !== "new_tab") {
        errors.push("quickLinks[" + index + "].openIn must be same_tab or new_tab.");
        return links;
      }
      if (label) {
        links.push({
          id: namespace.createId("link"),
          label: label,
          url: url,
          placement: "bottom",
          openMode: openIn,
          enabled: true
        });
      }
      return links;
    }, []);
  }

  function exportSidebarStyleToProfileJson(style) {
    var normalized = storage.normalizeSidebarStyle(style || {});
    var logoSource = normalized.sidebarBrandingMode === "hide" ? "none" : "default";
    var customType = normalized.backgroundType === "gradient" ? "gradient" : normalized.backgroundType === "image" || normalized.backgroundType === "pattern" ? "visual" : "solid";
    var exportedStyle = {
      mode: normalized.stylePath === "custom" ? "custom" : "preset",
      presetId: normalized.stylePath === "custom" ? null : normalized.activePresetId || normalized.preset || "default",
      custom: null,
      global: {
        applyStyling: normalized.enabled === true,
        autoReadability: normalized.autoReadability !== false,
        readabilityStrength: "balanced",
        logo: {
          enabled: normalized.sidebarBrandingMode !== "hide",
          source: logoSource,
          url: null,
          size: logoSizeName(normalized.logoSize),
          showBrandName: Boolean(normalized.headerLabel),
          brandName: normalized.headerLabel || "CleanView"
        },
        shape: {
          sidebarRadius: parsePixelNumber(normalized.sidebarRadius, 16),
          menuItemRadius: parsePixelNumber(normalized.borderRadius || normalized.buttonRadius, 8),
          spacingDensity: spacingDensityName(normalized.itemSpacing),
          shadowStrength: shadowStrengthName(normalized.shadowStrength),
          showBorder: normalized.borderVisible !== false
        },
        menuColors: {
          textColor: normalized.textColor || "",
          iconColor: normalized.iconColor || "",
          activeBackgroundColor: normalized.activeBackgroundColor || "",
          activeTextColor: normalized.activeTextColor || "",
          hoverBackgroundColor: normalized.hoverBackgroundColor || "",
          dividerColor: normalized.dividerColor || "",
          badgeColor: normalized.badgeColor || ""
        }
      }
    };

    if (normalized.sidebarBrandingMode === "replace") {
      exportedStyle.global.logo.source = normalized.customLogoDataUrl ? "uploaded" : isSafeExternalImageUrl(normalized.logoUrl) ? "external" : "default";
      exportedStyle.global.logo.url = normalized.customLogoDataUrl || (isSafeExternalImageUrl(normalized.logoUrl) ? normalized.logoUrl : null);
    }

    if (exportedStyle.mode === "custom") {
      exportedStyle.custom = {
        type: customType,
        solid: customType === "solid" ? {
          backgroundColor: normalized.backgroundColor || "#ffffff",
          darken: clampOpacity(normalized.backgroundOverlayOpacity),
          fade: 1 - clampOpacity(normalized.backgroundOpacity === undefined ? 1 : normalized.backgroundOpacity)
        } : null,
        gradient: customType === "gradient" ? {
          color1: normalized.gradientStartColor || normalized.backgroundColor || "#0f172a",
          color2: normalized.gradientEndColor || "#1d4ed8",
          direction: normalized.gradientDirection || "135deg",
          darken: clampOpacity(normalized.backgroundOverlayOpacity),
          fade: 1 - clampOpacity(normalized.backgroundOpacity === undefined ? 1 : normalized.backgroundOpacity)
        } : null,
        visual: customType === "visual" ? {
          assetId: normalized.backgroundImageUrl && !normalized.customImageDataUrl ? null : normalized.backgroundAssetId || null,
          assetSource: normalized.customImageDataUrl ? "uploaded" : isSafeExternalImageUrl(normalized.backgroundImageUrl) ? "external" : "curated",
          assetUrl: normalized.customImageDataUrl || (isSafeExternalImageUrl(normalized.backgroundImageUrl) ? normalized.backgroundImageUrl : null),
          positionX: getByPath(normalized, "imageSettings.positionX", 50),
          positionY: getByPath(normalized, "imageSettings.positionY", 50),
          zoom: getByPath(normalized, "imageSettings.scale", 1),
          fade: 1 - clampOpacity(getByPath(normalized, "imageSettings.opacity", 0.85)),
          darken: clampOpacity(getByPath(normalized, "imageSettings.overlayOpacity", 0.55)),
          blur: getByPath(normalized, "imageSettings.blur", 0)
        } : null
      };
    }

    return exportedStyle;
  }

  function applyGlobalSidebarStyleFromProfileJson(style, globalSettings, errors) {
    var logo = globalSettings && globalSettings.logo ? globalSettings.logo : {};
    var shape = globalSettings && globalSettings.shape ? globalSettings.shape : {};
    var menuColors = globalSettings && globalSettings.menuColors ? globalSettings.menuColors : {};
    var allowedLogoSources = ["default", "uploaded", "external", "none"];
    var allowedLogoSizes = ["small", "medium", "large"];
    var allowedSpacing = ["compact", "comfortable", "spacious"];
    var allowedShadows = ["none", "soft", "medium", "strong"];

    if (!globalSettings || typeof globalSettings !== "object" || Array.isArray(globalSettings)) {
      return style;
    }

    style.enabled = globalSettings.applyStyling === true;
    style.autoReadability = globalSettings.autoReadability !== false;

    if (logo.source && allowedLogoSources.indexOf(logo.source) === -1) {
      errors.push("sidebarStyle.global.logo.source is not supported.");
    } else if (logo.source === "none") {
      style.sidebarBrandingMode = "hide";
    } else if (logo.source === "uploaded") {
      style.sidebarBrandingMode = "replace";
      if (logo.url && isSafeImageDataUrl(logo.url)) {
        style.customLogoDataUrl = logo.url;
        style.logoUrl = "";
      } else if (logo.url) {
        errors.push("sidebarStyle.global.logo.url must be a safe uploaded image data URL.");
      } else {
        errors.push("sidebarStyle.global.logo.url is required for uploaded logos.");
      }
    } else if (logo.source === "external") {
      style.sidebarBrandingMode = "replace";
      if (logo.url && isSafeExternalImageUrl(logo.url)) {
        style.logoUrl = logo.url.trim();
        style.customLogoDataUrl = "";
      } else {
        errors.push("sidebarStyle.global.logo.url must be a safe HTTPS image URL.");
      }
    } else if (logo.source === "default") {
      style.sidebarBrandingMode = logo.showBrandName === false ? "keep" : "replace";
    }

    if (logo.size && allowedLogoSizes.indexOf(logo.size) === -1) {
      errors.push("sidebarStyle.global.logo.size is not supported.");
    } else if (logo.size) {
      style.logoSize = logoSizeValue(logo.size);
    }
    if (logo.brandName !== undefined) {
      style.headerLabel = sanitizeProfileText(logo.brandName, 60, "sidebarStyle.global.logo.brandName", errors, false);
    }

    if (shape.sidebarRadius !== undefined) {
      style.sidebarRadius = Math.round(clampNumber(shape.sidebarRadius, 0, 32, 16)) + "px";
    }
    if (shape.menuItemRadius !== undefined) {
      style.borderRadius = Math.round(clampNumber(shape.menuItemRadius, 0, 32, 8)) + "px";
      style.buttonRadius = style.borderRadius;
    }
    if (shape.spacingDensity && allowedSpacing.indexOf(shape.spacingDensity) === -1) {
      errors.push("sidebarStyle.global.shape.spacingDensity is not supported.");
    } else if (shape.spacingDensity) {
      style.itemSpacing = spacingDensityValue(shape.spacingDensity);
    }
    if (shape.shadowStrength && allowedShadows.indexOf(shape.shadowStrength) === -1) {
      errors.push("sidebarStyle.global.shape.shadowStrength is not supported.");
    } else if (shape.shadowStrength) {
      style.shadowStrength = shadowStrengthValue(shape.shadowStrength);
    }
    if (shape.showBorder !== undefined) {
      style.borderVisible = shape.showBorder !== false;
    }

    [
      "textColor",
      "iconColor",
      "activeBackgroundColor",
      "activeTextColor",
      "hoverBackgroundColor",
      "dividerColor",
      "badgeColor"
    ].forEach(function applyColor(key) {
      if (menuColors[key] === undefined || menuColors[key] === null || menuColors[key] === "") {
        return;
      }
      if (!isSafeProfileColor(menuColors[key])) {
        errors.push("sidebarStyle.global.menuColors." + key + " must be a hex or safe rgba color.");
        return;
      }
      style[key] = normalizeProfileColor(menuColors[key], style[key]);
    });

    return storage.normalizeSidebarStyle(style);
  }

  function importSidebarStyleFromProfileJson(sidebarStyle, errors, warnings) {
    var style = storage.normalizeSidebarStyle(namespace.defaultSidebarStyle);
    var mode = sidebarStyle && sidebarStyle.mode ? sidebarStyle.mode : "preset";
    var custom = sidebarStyle && sidebarStyle.custom ? sidebarStyle.custom : null;
    var presetId = sidebarStyle && sidebarStyle.presetId ? String(sidebarStyle.presetId).trim() : "default";
    var asset = null;

    if (!sidebarStyle) {
      return style;
    }

    if (typeof sidebarStyle !== "object" || Array.isArray(sidebarStyle)) {
      errors.push("sidebarStyle must be an object.");
      return style;
    }

    if (mode !== "preset" && mode !== "custom") {
      errors.push("sidebarStyle.mode must be preset or custom.");
      return style;
    }

    if (mode === "preset") {
      if (sidebarStylePresets[presetId]) {
        style = storage.normalizeSidebarStyle(sidebarStylePresets[presetId]);
        style.stylePath = "preset";
        style.preset = presetId;
      } else if (getCuratedPresetById(presetId)) {
        style = getCuratedStyleForProfileJson(presetId);
      } else {
        warnings.push("Unknown sidebar preset was replaced with Default.");
        style = storage.normalizeSidebarStyle(sidebarStylePresets.default || namespace.defaultSidebarStyle);
        style.stylePath = "preset";
        style.preset = "default";
      }
    }

    if (mode === "custom") {
      if (!custom || typeof custom !== "object" || Array.isArray(custom)) {
        errors.push("sidebarStyle.custom is required for custom mode.");
      } else if (["solid", "gradient", "visual"].indexOf(custom.type) === -1) {
        errors.push("sidebarStyle.custom.type must be solid, gradient, or visual.");
      } else if (custom.type === "solid") {
        style.stylePath = "custom";
        style.backgroundType = "solid";
        style.backgroundColor = requireHexProfileColor(custom.solid && custom.solid.backgroundColor, "#ffffff", "sidebarStyle.custom.solid.backgroundColor", errors);
        style.backgroundOverlayOpacity = clampOpacity(custom.solid && custom.solid.darken);
        style.backgroundOpacity = 1 - clampOpacity(custom.solid && custom.solid.fade);
      } else if (custom.type === "gradient") {
        style.stylePath = "custom";
        style.backgroundType = "gradient";
        style.gradientStartColor = requireHexProfileColor(custom.gradient && custom.gradient.color1, "#0f172a", "sidebarStyle.custom.gradient.color1", errors);
        style.gradientEndColor = requireHexProfileColor(custom.gradient && custom.gradient.color2, "#1d4ed8", "sidebarStyle.custom.gradient.color2", errors);
        style.gradientDirection = normalizeImportedGradientDirection(custom.gradient && custom.gradient.direction, errors);
        style.backgroundOverlayOpacity = clampOpacity(custom.gradient && custom.gradient.darken);
        style.backgroundOpacity = 1 - clampOpacity(custom.gradient && custom.gradient.fade);
      } else if (custom.type === "visual") {
        style.stylePath = "custom";
        style.backgroundType = "image";
        if (custom.visual && custom.visual.assetSource === "curated") {
          asset = getAssetById(custom.visual.assetId);
          if (!asset) {
            warnings.push("Unknown curated visual was ignored.");
          } else {
            style = applyAssetDefaultsForProfileJson(style, asset);
          }
        } else if (custom.visual && custom.visual.assetSource === "uploaded") {
          if (custom.visual.assetUrl && isSafeImageDataUrl(custom.visual.assetUrl)) {
            style.customImageDataUrl = custom.visual.assetUrl;
            style.backgroundImageUrl = "";
            style.backgroundAssetId = "";
          } else if (custom.visual.assetUrl) {
            errors.push("sidebarStyle.custom.visual.assetUrl must be a safe uploaded image data URL.");
          }
        } else if (custom.visual && custom.visual.assetSource === "external") {
          if (custom.visual.assetUrl && isSafeExternalImageUrl(custom.visual.assetUrl)) {
            style.backgroundImageUrl = custom.visual.assetUrl.trim();
            style.customImageDataUrl = "";
            style.backgroundAssetId = "";
            style.backgroundType = "image";
            style.stylePath = "custom";
          } else {
            errors.push("sidebarStyle.custom.visual.assetUrl must be a safe HTTPS image URL.");
          }
        } else if (custom.visual && custom.visual.assetSource) {
          errors.push("sidebarStyle.custom.visual.assetSource must be curated, uploaded, or external.");
        }
        style.imageSettings = Object.assign({}, style.imageSettings || {}, {
          positionX: clampNumber(custom.visual && custom.visual.positionX, 0, 100, 50),
          positionY: clampNumber(custom.visual && custom.visual.positionY, 0, 100, 50),
          scale: clampNumber(custom.visual && custom.visual.zoom, 0.5, 2.5, 1),
          opacity: 1 - clampOpacity(custom.visual && custom.visual.fade),
          overlayOpacity: clampOpacity(custom.visual && custom.visual.darken),
          blur: clampNumber(custom.visual && custom.visual.blur, 0, 12, 0)
        });
      }
    }

    return applyGlobalSidebarStyleFromProfileJson(style, sidebarStyle.global, errors);
  }

  function profileJsonFromPreset(preset) {
    var visibleSet = new Set(preset.visibleItems || []);
    var hiddenMenus = allMenuKeys.filter(function findHiddenMenu(key) {
      return !visibleSet.has(key);
    });
    var renameLabels = {};
    var profileMetadata = preset.profileMetadata && typeof preset.profileMetadata === "object" && !Array.isArray(preset.profileMetadata) ? preset.profileMetadata : null;
    var exportedJson = null;

    Object.keys(preset.labelOverrides || {}).forEach(function exportRename(key) {
      var label = registry[key] && registry[key].label ? registry[key].label : key;
      renameLabels[label] = preset.labelOverrides[key];
    });

    exportedJson = {
      cleanViewProfile: true,
      schemaVersion: cleanViewProfileSchemaVersion,
      type: "profile",
      profile: {
        name: preset.name || preset.label || "Untitled Profile",
        description: preset.description || "",
        source: {
          kind: "user",
          createdBy: "CleanView",
          origin: "manual"
        },
        sidebarStyle: exportSidebarStyleToProfileJson(preset.sidebarStyle),
        menuItems: {
          hidden: hiddenMenus,
          visible: (preset.visibleItems || []).slice()
        },
        renameLabels: renameLabels,
        quickLinks: (preset.customLinks || []).map(function exportQuickLink(link) {
          return {
            label: link.label || "",
            url: link.url || link.href || "",
            icon: "link",
            openIn: link.openMode === "same_tab" ? "same_tab" : "new_tab"
          };
        })
      }
    };

    if (profileMetadata) {
      if (profileMetadata.businessContext) {
        exportedJson.profile.businessContext = Object.assign({}, profileMetadata.businessContext);
      }
      if (profileMetadata.designContext) {
        exportedJson.profile.designContext = Object.assign({}, profileMetadata.designContext);
      }
      if (profileMetadata.aiSummary) {
        exportedJson.profile.aiSummary = Object.assign({}, profileMetadata.aiSummary);
      }
    }

    return exportedJson;
  }

  function importProfileJsonObject(profileJson) {
    var errors = [];
    var warnings = [];
    var profile = profileJson && profileJson.profile;
    var name = "";
    var description = "";
    var profileMetadata = null;
    var preset = null;

    if (!profileJson || typeof profileJson !== "object" || Array.isArray(profileJson)) {
      return { ok: false, errors: ["CleanView Profile JSON must be an object."], warnings: warnings };
    }

    findDangerousProfileFields(profileJson, "", errors);

    if (profileJson.cleanViewProfile !== true) {
      errors.push("cleanViewProfile must be true.");
    }
    if (profileJson.schemaVersion !== cleanViewProfileSchemaVersion) {
      errors.push("schemaVersion must be " + cleanViewProfileSchemaVersion + ".");
    }
    if (profileJson.type !== "profile") {
      errors.push("type must be profile.");
    }
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      errors.push("profile must be an object.");
      return { ok: false, errors: errors, warnings: warnings };
    }

    name = sanitizeProfileText(profile.name, 80, "profile.name", errors, true);
    description = sanitizeProfileText(profile.description || "", 240, "profile.description", errors, false);
    profileMetadata = normalizeProfileMetadata(profile, errors);

    preset = storage.normalizePreset({
      id: namespace.createId("custom"),
      name: name || "Imported Profile",
      description: description,
      visibleItems: resolveMenuItemsFromProfileJson(profile.menuItems, errors),
      labelOverrides: resolveRenameLabelsFromProfileJson(profile.renameLabels, errors),
      customLinks: resolveQuickLinksFromProfileJson(profile.quickLinks, errors),
      sidebarStyle: importSidebarStyleFromProfileJson(profile.sidebarStyle, errors, warnings),
      profileMetadata: profileMetadata,
      showInPopup: true
    });

    return {
      ok: errors.length === 0,
      errors: errors,
      warnings: warnings,
      preset: preset,
      source: profile.source || null,
      profileMetadata: profileMetadata
    };
  }

  function validateProfileImportText() {
    var parsed = null;
    var text = profileImportTextarea ? profileImportTextarea.value.trim() : "";

    pendingImportedProfile = null;
    if (confirmProfileImportButton) {
      confirmProfileImportButton.disabled = true;
    }
    if (profileImportPreview) {
      profileImportPreview.hidden = true;
      profileImportPreview.innerHTML = "";
    }

    if (!text) {
      setStatus("Paste CleanView Profile JSON or choose a .json file.", true);
      return;
    }

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      setStatus("Invalid JSON: " + error.message, true);
      return;
    }

    renderImportPreview(importProfileJsonObject(parsed));
  }

  function appendPreviewList(container, title, items) {
    var heading = document.createElement("p");
    var list = document.createElement("ul");

    heading.textContent = title;
    container.appendChild(heading);
    items.forEach(function addItem(item) {
      var row = document.createElement("li");
      row.textContent = item;
      list.appendChild(row);
    });
    container.appendChild(list);
  }

  function appendPreviewText(container, title, text) {
    var heading = document.createElement("p");
    var body = document.createElement("p");

    if (!text) {
      return;
    }
    heading.textContent = title;
    body.textContent = text;
    container.appendChild(heading);
    container.appendChild(body);
  }

  function renderImportPreview(result) {
    var title = document.createElement("h3");
    var description = document.createElement("p");
    var source = document.createElement("p");
    var metadata = null;
    var businessContext = null;
    var designContext = null;
    var aiSummary = null;
    var businessSummary = "";
    var visibleSet = null;
    var hiddenMenus = [];
    var visibleMenus = [];
    var renamedLabels = [];
    var quickLinks = [];
    var style = null;
    var styleSummary = "";

    if (!profileImportPreview) {
      return;
    }

    profileImportPreview.innerHTML = "";
    profileImportPreview.hidden = false;

    if (!result.ok) {
      title.textContent = "Import needs attention";
      profileImportPreview.appendChild(title);
      appendPreviewList(profileImportPreview, "Errors", result.errors);
      setStatus("Profile import validation failed.", true);
      return;
    }

    pendingImportedProfile = result.preset;
    if (confirmProfileImportButton) {
      confirmProfileImportButton.disabled = false;
    }

    visibleSet = new Set(result.preset.visibleItems || []);
    hiddenMenus = allMenuKeys.filter(function findHiddenMenu(key) {
      return !visibleSet.has(key);
    }).map(function labelMenu(key) {
      return registry[key] ? registry[key].label : key;
    });
    visibleMenus = (result.preset.visibleItems || []).map(function labelVisibleMenu(key) {
      return registry[key] ? registry[key].label : key;
    });
    renamedLabels = Object.keys(result.preset.labelOverrides || {}).map(function labelRename(key) {
      return (registry[key] ? registry[key].label : key) + " -> " + result.preset.labelOverrides[key];
    });
    quickLinks = (result.preset.customLinks || []).map(function labelLink(link) {
      return link.label;
    });
    metadata = result.preset.profileMetadata || result.profileMetadata || null;
    businessContext = metadata && metadata.businessContext ? metadata.businessContext : {};
    designContext = metadata && metadata.designContext ? metadata.designContext : {};
    aiSummary = metadata && metadata.aiSummary ? metadata.aiSummary : {};
    businessSummary = [businessContext.companyName, businessContext.industry, businessContext.role].filter(Boolean).join(" - ");
    style = result.preset.sidebarStyle || {};
    styleSummary = style.stylePath === "custom" ?
      "Custom " + (style.backgroundType === "image" || style.backgroundType === "pattern" ? "Visual" : style.backgroundType || "Solid") :
      "Preset " + (style.activePresetId || style.preset || "default");

    title.textContent = "Profile Preview";
    description.textContent = result.preset.description ? result.preset.name + ": " + result.preset.description : result.preset.name;
    profileImportPreview.appendChild(title);
    profileImportPreview.appendChild(description);
    if (result.source) {
      source.textContent = "Source: " + JSON.stringify(result.source);
      profileImportPreview.appendChild(source);
    }
    appendPreviewText(profileImportPreview, "Best For", aiSummary.bestFor);
    appendPreviewText(profileImportPreview, "Plain-English Summary", aiSummary.plainEnglishSummary);
    appendPreviewText(profileImportPreview, "Why These Menus Were Hidden", aiSummary.hiddenBecause);
    appendPreviewText(profileImportPreview, "Business", businessSummary);
    appendPreviewText(profileImportPreview, "Design Intent", designContext.styleIntent);
    appendPreviewList(profileImportPreview, "Includes", [
      "Sidebar Style: " + styleSummary,
      "Hidden Menus: " + hiddenMenus.length + (hiddenMenus.length ? " (" + hiddenMenus.join(", ") + ")" : ""),
      "Visible Menus: " + visibleMenus.length + (visibleMenus.length ? " (" + visibleMenus.join(", ") + ")" : ""),
      "Renamed Labels: " + renamedLabels.length + (renamedLabels.length ? " (" + renamedLabels.join(", ") + ")" : ""),
      "Quick Links: " + quickLinks.length + (quickLinks.length ? " (" + quickLinks.join(", ") + ")" : "")
    ]);
    if (result.warnings.length) {
      appendPreviewList(profileImportPreview, "Warnings", result.warnings);
    }
    setStatus("Profile JSON is valid. Review the preview, then import.");
  }

  function safeProfileFilename(name) {
    var slug = String(name || "profile")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "profile";
    return "cleanview-profile-" + slug + ".json";
  }

  function openProfileTransferModal(mode) {
    var preset = selectedPreset();

    if (!profileTransferModal) {
      return;
    }

    profileTransferModal.hidden = false;
    if (mode === "create") {
      pendingImportedProfile = null;
      profileTransferTitle.textContent = "How would you like to start?";
      profileTransferSubtitle.textContent = "Create a new editable CleanView Profile.";
      profileCreatePanel.hidden = false;
      profileImportPanel.hidden = true;
      profileExportPanel.hidden = true;
      fillTemplateSelect(createTemplateSelect);
      if (createBlankProfileName) {
        createBlankProfileName.value = "My CleanView";
        createBlankProfileName.focus();
      }
      return;
    }

    if (mode === "export") {
      if (!isEditableProfile(preset)) {
        closeProfileTransferModal();
        setStatus("Create My Profile before exporting a Template.", true);
        return;
      }
      currentExportJson = JSON.stringify(profileJsonFromPreset(storage.normalizePreset(preset)), null, 2);
      currentExportFilename = safeProfileFilename(preset.name || preset.label);
      profileTransferTitle.textContent = "Export Profile";
      profileTransferSubtitle.textContent = "Export this Profile as CleanView JSON.";
      profileCreatePanel.hidden = true;
      profileImportPanel.hidden = true;
      profileExportPanel.hidden = false;
      profileExportTextarea.value = currentExportJson;
      setStatus("Profile JSON is ready to export.");
      return;
    }

    pendingImportedProfile = null;
    profileTransferTitle.textContent = "Import Profile";
    profileTransferSubtitle.textContent = "Paste CleanView Profile JSON or upload a .json file.";
    profileCreatePanel.hidden = true;
    profileImportPanel.hidden = false;
    profileExportPanel.hidden = true;
    profileImportTextarea.value = "";
    profileImportFile.value = "";
    profileImportPreview.innerHTML = "";
    profileImportPreview.hidden = true;
    confirmProfileImportButton.disabled = true;
    profileImportTextarea.focus();
  }

  function closeProfileTransferModal() {
    if (profileTransferModal) {
      profileTransferModal.hidden = true;
    }
  }

  function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function handleCopied() {
        setStatus(successMessage);
      }).catch(function handleCopyError() {
        profileExportTextarea.focus();
        profileExportTextarea.select();
        document.execCommand("copy");
        setStatus(successMessage);
      });
      return;
    }

    profileExportTextarea.focus();
    profileExportTextarea.select();
    document.execCommand("copy");
    setStatus(successMessage);
  }

  function downloadProfileJson() {
    var blob = new Blob([currentExportJson], { type: "application/json" });
    var link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = currentExportFilename || "cleanview-profile.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function revokeDownloadUrl() {
      URL.revokeObjectURL(link.href);
    }, 0);
    setStatus("Profile JSON downloaded.");
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

  function getSidebarBackgroundValue(style) {
    if (style.backgroundType === "image" && style.backgroundImageUrl) {
      return "url(\"" + style.backgroundImageUrl + "\")";
    }

    if (style.backgroundType === "image") {
      var imageUrl = getImageUrl(style);
      return imageUrl ? "url(\"" + imageUrl + "\")" : style.backgroundColor || "#0f172a";
    }

    if (style.backgroundType === "pattern") {
      var asset = getAssetById(style.backgroundAssetId);
      return asset && asset.patternCss ? asset.patternCss : style.backgroundColor || "#0f172a";
    }

    if (style.backgroundType === "gradient") {
      var opacity = clampOpacity(style.backgroundOpacity === undefined ? 1 : style.backgroundOpacity);
      var start = getBackgroundColorValue(style.gradientStartColor || style.backgroundColor || "#0f172a", opacity);
      var end = getBackgroundColorValue(style.gradientEndColor || style.backgroundColor || "#1d4ed8", opacity);
      var direction = style.gradientDirection || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return getBackgroundColorValue(style.backgroundColor || "#ffffff", style.backgroundOpacity);
  }

  function resolveBrandLogoUrl(style) {
    var brandSettings = namespace.brandSettings || {};
    return style.customLogoDataUrl || normalizeUrl(style.logoUrl || brandSettings.logoUrl || namespace.defaultBrandLogoUrl || "");
  }

  function resolveBrandHeaderLabel(style) {
    var brandSettings = namespace.brandSettings || {};
    return style.headerLabel || brandSettings.brandName || "AgencySkin";
  }

  function getAlignmentFlexValue(alignment) {
    if (alignment === "left") {
      return "flex-start";
    }

    if (alignment === "right") {
      return "flex-end";
    }

    return "center";
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

  function getEditorBackgroundType(style) {
    return style && style.backgroundType === "pattern" ? "image" : (style && style.backgroundType) || "solid";
  }

  function getPresetAdjustmentValue(style, key) {
    if (key === "presetAdjustmentDarken") {
      if (style.backgroundType === "image") {
        return getByPath(style, "imageSettings.overlayOpacity", 0.55);
      }
      if (style.backgroundType === "pattern") {
        return getByPath(style, "patternSettings.overlayOpacity", 0.35);
      }
      return style.backgroundOverlayOpacity;
    }

    if (key === "presetAdjustmentFade") {
      if (style.backgroundType === "image") {
        return getByPath(style, "imageSettings.opacity", 0.85);
      }
      if (style.backgroundType === "pattern") {
        return getByPath(style, "patternSettings.opacity", 0.5);
      }
      return style.backgroundOpacity;
    }

    if (key === "presetAdjustmentBlur") {
      return style.backgroundType === "image" ? getByPath(style, "imageSettings.blur", 0) : 0;
    }

    return undefined;
  }

  function setPresetAdjustmentValue(style, key, value) {
    if (key === "presetAdjustmentDarken") {
      if (style.backgroundType === "image") {
        setByPath(style, "imageSettings.overlayOpacity", clampOpacity(value));
      } else if (style.backgroundType === "pattern") {
        setByPath(style, "patternSettings.overlayOpacity", clampOpacity(value));
      } else {
        style.backgroundOverlayOpacity = clampOpacity(value);
      }
    }

    if (key === "presetAdjustmentFade") {
      if (style.backgroundType === "image") {
        setByPath(style, "imageSettings.opacity", clampOpacity(value));
      } else if (style.backgroundType === "pattern") {
        setByPath(style, "patternSettings.opacity", clampOpacity(value));
      } else {
        style.backgroundOpacity = clampOpacity(value);
      }
    }

    if (key === "presetAdjustmentBlur" && style.backgroundType === "image") {
      setByPath(style, "imageSettings.blur", clampNumber(value, 0, 12, 0));
    }
  }

  function getFieldValue(style, field) {
    if (field.group === "preset-adjustment") {
      return getPresetAdjustmentValue(style, field.key);
    }

    return getByPath(style, field.key, field.defaultValue || "");
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
    var options = typeof field.options === "function" ? field.options() : field.options || [];
    var selectedValue = getFieldValue(style, field);
    options.forEach(function addOption(optionDefinition) {
      var option = document.createElement("option");
      option.value = optionDefinition.value;
      option.textContent = optionDefinition.label;
      select.appendChild(option);
    });
    if (field.key === "backgroundAssetId" && selectedValue && !select.querySelector("option[value='" + String(selectedValue).replace(/'/g, "\\'") + "']")) {
      var asset = getAssetById(selectedValue);
      var legacyOption = document.createElement("option");
      legacyOption.value = selectedValue;
      legacyOption.textContent = asset ? asset.label : "Saved Visual";
      select.appendChild(legacyOption);
    }
    select.value = selectedValue;
    select.dataset.sidebarStyleField = field.key;
    select.addEventListener("change", function handleSelectChange() {
      if (field.key === "backgroundAssetId" && select.value) {
        var nextStyle = collectSidebarStyleFromForm();
        populateSidebarStyleForm(applyAssetDefaults(nextStyle, getAssetById(select.value)), {
          presetValue: "custom",
          optionLabel: "Custom Draft"
        });
        return;
      }
      updateSidebarStylePreview();
    });
    return createFieldLabel(field.label, select);
  }

  function createColorField(field, style) {
    var wrapper = document.createElement("label");
    var controls = document.createElement("span");
    var picker = document.createElement("input");
    var textInput = document.createElement("input");
    var value = getFieldValue(style, field) || "";

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
    input.value = getFieldValue(style, field) || "";
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("input", updateSidebarStylePreview);
    return createFieldLabel(field.label, input);
  }

  function createCheckboxField(field, style) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = getByPath(style, field.key, true) !== false;
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("change", updateSidebarStylePreview);
    return createFieldLabel(field.label, input);
  }

  function createRangeField(field, style) {
    var wrapper = document.createElement("label");
    var controls = document.createElement("span");
    var input = document.createElement("input");
    var valueLabel = document.createElement("span");

    wrapper.className = "inline-field range-field";
    controls.className = "range-control";
    input.type = "range";
    input.min = field.min || "0";
    input.max = field.max || "1";
    input.step = field.step || "0.05";
    input.value = clampNumber(getFieldValue(style, field), Number(input.min), Number(input.max), Number(input.min));
    input.dataset.sidebarStyleField = field.key;
    valueLabel.className = "range-value";
    valueLabel.textContent = formatRangeValue(input.value, field);

    input.addEventListener("input", function updateRangeValue() {
      valueLabel.textContent = formatRangeValue(input.value, field);
      updateSidebarStylePreview();
    });

    wrapper.appendChild(document.createTextNode(field.label));
    controls.appendChild(input);
    controls.appendChild(valueLabel);
    wrapper.appendChild(controls);
    return wrapper;
  }

  function formatRangeValue(value, field) {
    var numeric = Number(value);

    if (field.unit) {
      return Math.round(numeric) + field.unit;
    }

    if (field.max && Number(field.max) > 1) {
      return field.max === "100" ? Math.round(numeric) + "%" : numeric.toFixed(2).replace(/\.?0+$/, "") + "x";
    }

    return Math.round(clampOpacity(value) * 100) + "%";
  }

  function createFileField(field) {
    var wrapper = document.createElement("label");
    var controls = document.createElement("span");
    var input = document.createElement("input");
    var removeButton = document.createElement("button");

    wrapper.className = "inline-field file-field";
    controls.className = "file-control";
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("change", handleCustomImageUpload);
    removeButton.type = "button";
    removeButton.className = "secondary";
    removeButton.textContent = "Remove";
    removeButton.dataset.removeCustomImage = "true";

    wrapper.appendChild(document.createTextNode(field.label));
    controls.appendChild(input);
    controls.appendChild(removeButton);
    wrapper.appendChild(controls);
    return wrapper;
  }

  function createLogoFileField(field) {
    var wrapper = document.createElement("label");
    var controls = document.createElement("span");
    var input = document.createElement("input");
    var removeButton = document.createElement("button");

    wrapper.className = "inline-field file-field";
    controls.className = "file-control";
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("change", handleCustomLogoUpload);
    removeButton.type = "button";
    removeButton.className = "secondary";
    removeButton.textContent = "Remove";
    removeButton.dataset.removeCustomLogo = "true";

    wrapper.appendChild(document.createTextNode(field.label));
    controls.appendChild(input);
    controls.appendChild(removeButton);
    wrapper.appendChild(controls);
    return wrapper;
  }

  function handleCustomImageUpload(event) {
    var file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setStatus("Use a JPG, PNG, or WebP image.", true);
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStatus("Custom images must be 2MB or smaller.", true);
      event.target.value = "";
      return;
    }

    var reader = new FileReader();
    reader.onload = function handleReaderLoad() {
      var image = new Image();
      image.onload = function handleImageLoad() {
        var canvas = document.createElement("canvas");
        var width = 520;
        var height = 980;
        var context = canvas.getContext("2d");
        var scale = Math.max(width / image.width, height / image.height);
        var drawWidth = image.width * scale;
        var drawHeight = image.height * scale;
        var drawX = (width - drawWidth) / 2;
        var drawY = (height - drawHeight) / 2;
        var nextStyle = collectSidebarStyleFromForm();

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        nextStyle.backgroundType = "image";
        nextStyle.backgroundAssetId = "";
        nextStyle.backgroundImageUrl = "";
        nextStyle.customImageDataUrl = canvas.toDataURL("image/webp", 0.78);
        nextStyle.imageSettings = Object.assign({}, nextStyle.imageSettings || {}, {
          positionX: 50,
          positionY: 50,
          scale: 1,
          opacity: 0.85,
          blur: 0,
          overlayOpacity: Math.max(0.45, getByPath(nextStyle, "imageSettings.overlayOpacity", 0.55))
        });
        populateSidebarStyleForm(nextStyle, { presetValue: "custom", optionLabel: "Custom Image Draft" });
        setStatus("Custom image loaded. Save this Profile to keep it.");
      };
      image.onerror = function handleImageError() {
        setStatus("Unable to read that image.", true);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function handleCustomLogoUpload(event) {
    var file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setStatus("Use a JPG, PNG, or WebP logo.", true);
      event.target.value = "";
      return;
    }

    if (file.size > 512 * 1024) {
      setStatus("Logo images must be 512KB or smaller.", true);
      event.target.value = "";
      return;
    }

    var reader = new FileReader();
    reader.onload = function handleLogoReaderLoad() {
      var image = new Image();
      image.onload = function handleLogoImageLoad() {
        var canvas = document.createElement("canvas");
        var size = 160;
        var context = canvas.getContext("2d");
        var scale = Math.min(size / image.width, size / image.height, 1);
        var drawWidth = image.width * scale;
        var drawHeight = image.height * scale;
        var drawX = (size - drawWidth) / 2;
        var drawY = (size - drawHeight) / 2;
        var nextStyle = collectSidebarStyleFromForm();

        canvas.width = size;
        canvas.height = size;
        context.clearRect(0, 0, size, size);
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        nextStyle.customLogoDataUrl = canvas.toDataURL("image/webp", 0.82);
        nextStyle.sidebarBrandingMode = "replace";
        populateSidebarStyleForm(nextStyle, { presetValue: "custom", optionLabel: "Custom Logo Draft" });
        setStatus("Logo loaded. Save this Profile to keep it.");
      };
      image.onerror = function handleLogoImageError() {
        setStatus("Unable to read that logo.", true);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function syncSidebarModeState() {
    var backgroundType = sidebarBackgroundType.value || "solid";
    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-mode]").forEach(function updateMode(element) {
      var isActiveMode = element.dataset.sidebarStyleMode === backgroundType;
      element.hidden = !isActiveMode;
      element.classList.toggle("is-muted", !isActiveMode);
    });
    if (presetAdjustmentEditor) {
      presetAdjustmentEditor.querySelectorAll("[data-sidebar-style-field='presetAdjustmentBlur']").forEach(function updateBlur(input) {
        var wrapper = input.closest("[data-sidebar-style-group='preset-adjustment']");
        var style = storage.normalizeSidebarStyle(draftSidebarStyle || {});
        if (wrapper) {
          wrapper.hidden = style.backgroundType !== "image";
        }
      });
    }
  }

  function getSidebarStyleFieldContainers() {
    return [globalSidebarStyleEditor, presetAdjustmentEditor, sidebarStyleEditor, menuColorEditor].filter(Boolean);
  }

  function syncStylePathState(style) {
    var normalizedStyle = storage.normalizeSidebarStyle(style || draftSidebarStyle || {});
    var path = sidebarStylePath ? sidebarStylePath.value || normalizedStyle.stylePath || "preset" : normalizedStyle.stylePath || "preset";

    if (sidebarStylePath) {
      sidebarStylePath.value = path;
    }
    if (presetStylePanel) {
      presetStylePanel.hidden = path !== "preset";
    }
    if (customStylePanel) {
      customStylePanel.hidden = path !== "custom";
    }
  }

  function populateSidebarStyleForm(style, options) {
    var normalizedStyle = storage.normalizeSidebarStyle(style);
    var presetValue = options && options.presetValue ? options.presetValue : normalizedStyle.preset || "default";
    draftSidebarStyle = normalizedStyle;
    renderSidebarBackgroundTypeOptions(getEditorBackgroundType(normalizedStyle));
    renderCuratedPresetCards(normalizedStyle);

    if (!sidebarStylePresets[presetValue]) {
      ensureCustomStyleOption(options && options.optionLabel ? options.optionLabel : "Custom Draft");
    }

    sidebarStyleEnabled.checked = normalizedStyle.enabled === true;
    sidebarStylePreset.value = presetValue;
    if (sidebarStylePath) {
      sidebarStylePath.value = normalizedStyle.stylePath || "preset";
    }
    sidebarBackgroundType.value = getEditorBackgroundType(normalizedStyle);
    if (autoReadabilityToggle) {
      autoReadabilityToggle.checked = normalizedStyle.autoReadability !== false;
    }
    populateCuratedShuffleForm(normalizedStyle);
    getSidebarStyleFieldContainers().forEach(function updateContainer(container) {
      container.querySelectorAll("[data-sidebar-style-field]").forEach(function updateField(input) {
      var rangeField = sidebarStyleFields.find(function findRange(field) {
        return field.key === input.dataset.sidebarStyleField;
      }) || {};
      var value = getFieldValue(normalizedStyle, rangeField);
      if (input.type === "file") {
        return;
      }
      if (input.type === "checkbox") {
        input.checked = value !== false;
        return;
      }
      input.value = value === undefined || value === null ? "" : value;
      if (input.type === "range") {
        input.value = value === undefined || value === null ? input.value : value;
        if (input.closest(".range-control")) {
          input.closest(".range-control").querySelector(".range-value").textContent = formatRangeValue(input.value, rangeField);
        }
      }
      if (input.closest(".color-control")) {
        var picker = input.closest(".color-control").querySelector("input[type='color']");
        if (picker) {
          picker.value = normalizeHexColor(input.value);
        }
      }
      });
    });
    syncStylePathState(normalizedStyle);
    syncSidebarModeState();
    updateSidebarStylePreview();
  }

  function populateSelect(select, options, selectedValue) {
    if (!select) {
      return;
    }

    select.innerHTML = "";
    options.forEach(function addOption(optionDefinition) {
      var option = document.createElement("option");
      option.value = optionDefinition.value;
      option.textContent = optionDefinition.label;
      select.appendChild(option);
    });
    select.value = selectedValue;
  }

  function populateCuratedShuffleForm(style) {
    var shuffle = storage.normalizeSidebarStyle(style).curatedShuffle;

    populateSelect(curatedShufflePool, curatedShufflePoolOptions, shuffle.poolMode);
    populateSelect(curatedShuffleFrequency, curatedShuffleFrequencyOptions, shuffle.frequency);
    if (curatedShuffleEnabled) {
      curatedShuffleEnabled.checked = shuffle.enabled === true;
    }
    if (curatedShuffleAvoidRepeats) {
      curatedShuffleAvoidRepeats.checked = shuffle.avoidRecentRepeats !== false;
    }
    renderCustomPool(shuffle.customPool);
  }

  function renderCustomPool(selectedPool) {
    var selectedSet = new Set(selectedPool || []);

    if (!curatedShuffleCustomPool) {
      return;
    }

    curatedShuffleCustomPool.innerHTML = "";
    curatedShuffleCustomPool.hidden = !curatedShufflePool || curatedShufflePool.value !== "custom";
    curatedShuffleCustomPoolOptions.forEach(function renderPoolOption(poolOption) {
      var label = document.createElement("label");
      var checkbox = document.createElement("input");
      var text = document.createElement("span");

      label.className = "check-row compact-check";
      checkbox.type = "checkbox";
      checkbox.value = poolOption.value;
      checkbox.checked = selectedSet.has(poolOption.value);
      checkbox.dataset.shufflePoolType = poolOption.value;
      text.textContent = poolOption.label;
      label.appendChild(checkbox);
      label.appendChild(text);
      curatedShuffleCustomPool.appendChild(label);
    });
  }

  function collectCuratedShuffleFromForm(style) {
    var current = storage.normalizeSidebarStyle(style || {}).curatedShuffle;
    var customPool = [];

    if (curatedShuffleCustomPool) {
      curatedShuffleCustomPool.querySelectorAll("[data-shuffle-pool-type]").forEach(function collectPoolType(checkbox) {
        if (checkbox.checked) {
          customPool.push(checkbox.dataset.shufflePoolType);
        }
      });
    }

    return {
      ...current,
      enabled: curatedShuffleEnabled ? curatedShuffleEnabled.checked : current.enabled,
      poolMode: curatedShufflePool ? curatedShufflePool.value : current.poolMode,
      customPool: customPool.length ? customPool : current.customPool,
      frequency: curatedShuffleFrequency ? curatedShuffleFrequency.value : current.frequency,
      favoritesOnly: curatedShufflePool ? curatedShufflePool.value === "favorites" : current.favoritesOnly,
      avoidRecentRepeats: curatedShuffleAvoidRepeats ? curatedShuffleAvoidRepeats.checked : current.avoidRecentRepeats
    };
  }

  function createSidebarStyleField(field, style) {
    var label = null;

    if (field.type === "color") {
      label = createColorField(field, style);
    } else if (field.type === "select") {
      label = createSelectField(field, style);
    } else if (field.type === "range") {
      label = createRangeField(field, style);
    } else if (field.type === "file") {
      label = createFileField(field);
    } else if (field.type === "logo-file") {
      label = createLogoFileField(field);
    } else if (field.type === "checkbox") {
      label = createCheckboxField(field, style);
    } else {
      label = createTextField(field, style);
    }

    if (field.mode) {
      label.dataset.sidebarStyleMode = field.mode;
    }
    if (field.group) {
      label.dataset.sidebarStyleGroup = field.group;
    }

    return label;
  }

  function renderSidebarStyleFields(container, style, fields) {
    if (!container) {
      return;
    }

    container.innerHTML = "";
    fields.forEach(function renderStyleField(field) {
      if (field.section) {
        container.appendChild(createSectionHeading(field.section));
      }
      container.appendChild(createSidebarStyleField(field, style));
    });
  }

  function renderSidebarStyle() {
    var preset = selectedPreset();
    var style = storage.normalizeSidebarStyle(preset.sidebarStyle);
    var globalFields = sidebarStyleFields.filter(function keepGlobalField(field) {
      return field.group === "global";
    });
    var presetAdjustmentFields = sidebarStyleFields.filter(function keepPresetAdjustmentField(field) {
      return field.group === "preset-adjustment";
    });
    var menuFields = sidebarStyleFields.filter(function keepMenuField(field) {
      return field.group === "menu";
    });
    var customFields = sidebarStyleFields.filter(function keepCustomField(field) {
      return field.group !== "global" && field.mode;
    });

    renderSidebarBackgroundTypeOptions(getEditorBackgroundType(style));
    renderCuratedPresetCards(style);
    renderSidebarStyleFields(globalSidebarStyleEditor, style, globalFields);
    renderSidebarStyleFields(presetAdjustmentEditor, style, presetAdjustmentFields);
    renderSidebarStyleFields(sidebarStyleEditor, style, customFields);
    renderSidebarStyleFields(menuColorEditor, style, menuFields);
    populateSidebarStyleForm(style, { presetValue: style.preset || "default" });
  }

  function getCuratedPresetPreview(preset) {
    var asset = preset.assetId ? getAssetById(preset.assetId) : null;

    if (asset && asset.type === "image") {
      return "url(\"" + getExtensionAssetUrl(asset) + "\")";
    }

    if (asset && asset.type === "pattern") {
      return asset.patternCss || "";
    }

    if (preset.style && preset.style.backgroundType === "gradient") {
      return getSidebarBackgroundValue(storage.normalizeSidebarStyle(preset.style));
    }

    return preset.style && preset.style.backgroundColor ? preset.style.backgroundColor : "#0f172a";
  }

  function renderCuratedPresetCards(style) {
    var favoriteSet = new Set(style.favoriteAssetIds || []);

    if (!curatedPresetGrid) {
      return;
    }

    curatedPresetGrid.innerHTML = "";
    curatedSidebarStylePresets.forEach(function renderPresetCard(preset) {
      var card = document.createElement("button");
      var preview = document.createElement("span");
      var label = document.createElement("span");
      var meta = document.createElement("span");
      var favorite = document.createElement("span");
      var isActive = style.activePresetId === preset.id;

      card.type = "button";
      card.className = "curated-preset-card" + (isActive ? " active" : "");
      card.dataset.curatedPresetId = preset.id;
      preview.className = "curated-preset-preview";
      preview.style.background = getCuratedPresetPreview(preset);
      if (preset.type === "image") {
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
      }
      label.className = "curated-preset-label";
      label.textContent = preset.label;
      meta.className = "curated-preset-meta";
      meta.textContent = preset.category === "personal" ? "Personal" : "Professional";
      favorite.className = "curated-preset-favorite";
      favorite.dataset.favoritePresetId = preset.id;
      favorite.textContent = favoriteSet.has(preset.id) ? "Starred" : "Star";

      card.appendChild(preview);
      card.appendChild(label);
      card.appendChild(meta);
      card.appendChild(favorite);
      curatedPresetGrid.appendChild(card);
    });
  }

  function applyCuratedPresetFromCard(presetId) {
    var preset = getCuratedPresetById(presetId);
    var nextStyle = null;

    if (!preset) {
      return;
    }

    nextStyle = applyCuratedStyleToStyle(getCurrentWorkingSidebarStyle(), preset);
    nextStyle.stylePath = "preset";
    populateSidebarStyleForm(nextStyle, {
      presetValue: "custom",
      optionLabel: "Custom Draft - " + preset.label
    });
    setStatus(preset.label + " applied. Save this Profile to keep it.");
  }

  function toggleFavoritePreset(presetId) {
    var style = getCurrentWorkingSidebarStyle();
    var favoriteSet = new Set(style.favoriteAssetIds || []);
    var preset = getCuratedPresetById(presetId);

    if (!preset) {
      return;
    }

    if (favoriteSet.has(presetId)) {
      favoriteSet.delete(presetId);
    } else {
      favoriteSet.add(presetId);
    }

    style.favoriteAssetIds = Array.from(favoriteSet);
    populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
    setStatus((favoriteSet.has(presetId) ? "Favorited " : "Removed favorite ") + preset.label + ".");
  }

  function getCandidateTypesForShuffle(style, shuffle) {
    if (shuffle.poolMode === "images-patterns") {
      return ["image", "pattern"];
    }

    if (shuffle.poolMode === "custom") {
      return (shuffle.customPool || []).map(function mapPoolType(type) {
        return type === "images" ? "image" : type === "patterns" ? "pattern" : type === "gradients" ? "gradient" : "solid";
      });
    }

    if (shuffle.poolMode === "patterns") {
      return ["pattern"];
    }

    if (shuffle.poolMode === "uploads") {
      return ["image"];
    }

    if (shuffle.poolMode === "professional-patterns" || shuffle.poolMode === "professional" || shuffle.poolMode === "personal" || shuffle.poolMode === "favorites") {
      return ["solid", "gradient", "pattern", "image"];
    }

    return [style.backgroundType || "solid"];
  }

  function getShuffleCandidates(style) {
    var shuffle = collectCuratedShuffleFromForm(style);
    var types = new Set(getCandidateTypesForShuffle(style, shuffle));
    var favoriteSet = new Set(style.favoriteAssetIds || []);
    var candidates = curatedSidebarStylePresets.filter(function keepPreset(preset) {
      if (!preset.safeForCuratedShuffle || !types.has(preset.type)) {
        return false;
      }

      if (shuffle.poolMode === "professional" && preset.category !== "professional") {
        return false;
      }

      if (shuffle.poolMode === "professional-patterns" && preset.category !== "professional" && preset.type !== "pattern") {
        return false;
      }

      if (shuffle.poolMode === "personal" && preset.category !== "personal") {
        return false;
      }

      if (shuffle.poolMode === "patterns" && preset.type !== "pattern") {
        return false;
      }

      if (shuffle.poolMode === "uploads") {
        return false;
      }

      if (shuffle.poolMode === "favorites" && !favoriteSet.has(preset.id)) {
        return false;
      }

      return true;
    });
    var recent = shuffle.avoidRecentRepeats ? new Set(shuffle.lastAppliedAssetIds || []) : new Set();
    var filtered = candidates.filter(function removeRecent(preset) {
      return !recent.has(preset.id) && (!preset.assetId || !recent.has(preset.assetId));
    });

    return filtered.length ? filtered : candidates;
  }

  function applyCuratedShuffle() {
    var style = getCurrentWorkingSidebarStyle();
    var candidates = getShuffleCandidates(style);
    var selected = null;
    var shuffle = collectCuratedShuffleFromForm(style);
    var recent = (shuffle.lastAppliedAssetIds || []).slice();

    if (!candidates.length) {
      setStatus("No curated styles match this rotation pool.", true);
      return;
    }

    selected = pickRandom(candidates);
    style = applyCuratedStyleToStyle(style, selected);
    style.stylePath = "preset";
    recent.unshift(selected.assetId || selected.id);
    style.curatedShuffle = Object.assign({}, shuffle, {
      lastAppliedAssetIds: recent.slice(0, shuffle.avoidRecentCount || 3),
      lastAppliedAt: namespace.nowIso(),
      sessionKey: String(Date.now())
    });
    populateSidebarStyleForm(style, {
      presetValue: "custom",
      optionLabel: "Custom Draft - " + selected.label
    });
    setStatus("Curated Rotation picked " + selected.label + ". Save this Profile to keep it.");
  }

  function updateImagePositionFromPointer(event) {
    var rect = sidebarStylePreview.getBoundingClientRect();
    var style = getCurrentWorkingSidebarStyle();
    var x = clampNumber(((event.clientX - rect.left) / rect.width) * 100, 0, 100, 50);
    var y = clampNumber(((event.clientY - rect.top) / rect.height) * 100, 0, 100, 50);

    if (style.backgroundType !== "image") {
      return;
    }

    style.imageSettings = Object.assign({}, style.imageSettings || {}, {
      positionX: Math.round(x),
      positionY: Math.round(y)
    });
    populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
  }

  function renderLocationRules() {
    if (!enableLocationViewDefaults) {
      locationRules.innerHTML = "";
      return;
    }

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
      presetLabel.textContent = preset ? optionLabel(preset) : "Unknown Profile";
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

  function setContainerControlsDisabled(container, disabled) {
    container.querySelectorAll("input, select, button").forEach(function updateControl(control) {
      control.disabled = disabled;
    });
  }

  function syncPresetEditability() {
    var isEditable = isCustomPreset(selectedPreset());

    setContainerControlsDisabled(menuEditor, !isEditable);
    setContainerControlsDisabled(renameEditor, !isEditable);
    setContainerControlsDisabled(linkEditor, !isEditable);
    setContainerControlsDisabled(globalSidebarStyleEditor, !isEditable);
    setContainerControlsDisabled(sidebarStyleEditor, !isEditable);
    setContainerControlsDisabled(curatedPresetGrid, !isEditable);
    setContainerControlsDisabled(curatedShuffleCustomPool, !isEditable);
    sidebarStyleEnabled.disabled = !isEditable;
    sidebarStylePreset.disabled = !isEditable;
    sidebarBackgroundType.disabled = !isEditable;
    if (autoReadabilityToggle) {
      autoReadabilityToggle.disabled = !isEditable;
    }
    if (curatedShuffleEnabled) {
      curatedShuffleEnabled.disabled = !isEditable;
    }
    if (curatedShufflePool) {
      curatedShufflePool.disabled = !isEditable;
    }
    if (curatedShuffleFrequency) {
      curatedShuffleFrequency.disabled = !isEditable;
    }
    if (curatedShuffleAvoidRepeats) {
      curatedShuffleAvoidRepeats.disabled = !isEditable;
    }
    document.getElementById("selectAllMenusButton").disabled = !isEditable;
    document.getElementById("deselectAllMenusButton").disabled = !isEditable;
    document.getElementById("resetMenuDefaultsButton").disabled = !isEditable;
    document.getElementById("addRenameButton").disabled = !isEditable;
    document.getElementById("addLinkButton").disabled = !isEditable;
    curatedShuffleButton.disabled = !isEditable;
    document.getElementById("resetStyleButton").disabled = !isEditable;
    document.getElementById("savePresetButton").disabled = !isEditable;
  }

  function render() {
    if (renderBuilderVisibility()) {
      return;
    }
    renderPresetSelects();
    renderTabState();
    renderHeader();
    renderMenuEditor();
    renderRenameEditor();
    renderLinks();
    renderSidebarStylePresetOptions();
    renderSidebarStyle();
    renderLocationRules();
    syncPresetEditability();
  }

  function collectSidebarStyleFromForm() {
    var style = storage.normalizeSidebarStyle(draftSidebarStyle || sidebarStylePresets[sidebarStylePreset.value] || {});
    var previousBackgroundType = style.backgroundType || "solid";
    style.enabled = sidebarStyleEnabled.checked;
    style.preset = sidebarStylePreset.value || "default";
    style.stylePath = sidebarStylePath ? sidebarStylePath.value || "preset" : style.stylePath || "preset";
    if (style.stylePath === "custom") {
      style.backgroundType = previousBackgroundType === "pattern" && sidebarBackgroundType.value === "image" ? "pattern" : sidebarBackgroundType.value || "solid";
    }
    style.autoReadability = autoReadabilityToggle ? autoReadabilityToggle.checked : true;
    style.curatedShuffle = collectCuratedShuffleFromForm(style);

    getSidebarStyleFieldContainers().forEach(function collectContainer(container) {
      container.querySelectorAll("[data-sidebar-style-field]").forEach(function collectField(input) {
      var key = input.dataset.sidebarStyleField;
      var rangeField = sidebarStyleFields.find(function findField(field) {
        return field.key === key;
      }) || {};
      var modeElement = input.closest("[data-sidebar-style-mode]");

      if (input.closest("[hidden]")) {
        return;
      }

      if (modeElement && modeElement.hidden) {
        return;
      }

      if (input.type === "file") {
        return;
      }

      if (input.type === "checkbox") {
        setByPath(style, key, input.checked);
        return;
      }

      if (rangeField.group === "preset-adjustment") {
        if (input.type === "range") {
          setPresetAdjustmentValue(style, key, input.value);
        }
        return;
      }

      if (input.type === "range") {
        setByPath(style, key, clampNumber(input.value, Number(rangeField.min || 0), Number(rangeField.max || 1), 0));
        return;
      }

      if (key === "backgroundImageUrl" || key === "logoUrl") {
        setByPath(style, key, normalizeUrl(input.value));
        return;
      }

      setByPath(style, key, input.value.trim());
      });
    });

    if (style.backgroundType === "pattern" && (!getAssetById(style.backgroundAssetId) || getAssetById(style.backgroundAssetId).type !== "pattern")) {
      style.backgroundAssetId = sidebarPatternAssets[0] ? sidebarPatternAssets[0].id : "";
    }
    if (style.backgroundType === "image" && style.backgroundAssetId && (!getAssetById(style.backgroundAssetId) || getAssetById(style.backgroundAssetId).type !== "image")) {
      style.backgroundAssetId = "";
    }

    draftSidebarStyle = storage.normalizeSidebarStyle(style);
    return draftSidebarStyle;
  }

  function getCurrentWorkingSidebarStyle() {
    return collectSidebarStyleFromForm();
  }

  function updateSidebarStylePreview() {
    if (!sidebarStylePreview) {
      return;
    }

    var style = getCurrentWorkingSidebarStyle();
    var background = getSidebarBackgroundValue(style);
    var textColor = style.textColor || "#111827";
    var iconColor = style.iconColor || textColor;
    var activeBackgroundColor = style.activeBackgroundColor || "#e5e7eb";
    var activeTextColor = style.activeTextColor || textColor;
    var dividerColor = style.dividerColor || "rgba(255, 255, 255, 0.22)";
    var badgeColor = style.badgeColor || style.brandAccentColor || activeBackgroundColor;
    var borderRadius = style.borderRadius || "8px";
    var buttonRadius = style.buttonRadius || borderRadius;
    var sidebarRadius = style.sidebarRadius || "16px";
    var itemSpacing = style.itemSpacing || "4px";
    var sidebarPadding = style.sidebarPadding || "12px";
    var shadowStrength = clampOpacity(style.shadowStrength === undefined ? 0.35 : style.shadowStrength);
    var brandingMode = style.sidebarBrandingMode || "keep";
    var headerLabel = brandingMode === "keep" ? "GHL Default" : resolveBrandHeaderLabel(style);
    var logoUrl = brandingMode === "replace" ? resolveBrandLogoUrl(style) : "";
    var alignment = style.headerAlignment || "center";
    var alignItems = getAlignmentFlexValue(alignment);
    var overlayOpacity = getOverlayOpacity(style);
    var imageOpacity = clampOpacity(getByPath(style, "imageSettings.opacity", 0.85));
    var imageBlur = clampNumber(getByPath(style, "imageSettings.blur", 0), 0, 12, 0);
    var patternOpacity = clampOpacity(getByPath(style, "patternSettings.opacity", 0.5));

    sidebarStylePreview.style.background = "";
    sidebarStylePreview.style.backgroundImage = "";
    sidebarStylePreview.style.backgroundSize = "";
    sidebarStylePreview.style.backgroundPosition = "";
    sidebarStylePreview.style.backgroundRepeat = "";
    sidebarStylePreview.style.background = style.backgroundColor || "#ffffff";
    sidebarStylePreview.style.borderRadius = sidebarRadius;
    sidebarStylePreview.style.borderColor = style.borderVisible === false ? "transparent" : "var(--as-border)";
    sidebarStylePreview.style.boxShadow = shadowStrength > 0 ? "0 12px 32px rgba(15, 23, 42, " + shadowStrength + ")" : "none";
    if (sidebarStylePreviewBackground) {
      sidebarStylePreviewBackground.style.background = "";
      sidebarStylePreviewBackground.style.backgroundImage = "";
      sidebarStylePreviewBackground.style.backgroundSize = "";
      sidebarStylePreviewBackground.style.backgroundPosition = "";
      sidebarStylePreviewBackground.style.backgroundRepeat = "";
      sidebarStylePreviewBackground.style.opacity = "1";
      sidebarStylePreviewBackground.style.filter = "none";
    }
    if (sidebarStylePreviewOverlay) {
      sidebarStylePreviewOverlay.style.background = getOverlayRgba(style.backgroundOverlayColor || "#000000", overlayOpacity);
      sidebarStylePreviewOverlay.style.opacity = overlayOpacity > 0 ? "1" : "0";
    }
    if (style.backgroundType === "image") {
      if (sidebarStylePreviewBackground) {
        sidebarStylePreviewBackground.style.backgroundImage = background;
        sidebarStylePreviewBackground.style.backgroundSize = style.customImageDataUrl || style.backgroundAssetId ? getImageScale(style) : style.backgroundImageFit || "cover";
        sidebarStylePreviewBackground.style.backgroundPosition = style.customImageDataUrl || style.backgroundAssetId ? getImagePosition(style) : style.backgroundImagePosition || "center";
        sidebarStylePreviewBackground.style.backgroundRepeat = "no-repeat";
        sidebarStylePreviewBackground.style.opacity = imageOpacity;
        sidebarStylePreviewBackground.style.filter = imageBlur ? "blur(" + imageBlur + "px)" : "none";
      } else {
        sidebarStylePreview.style.backgroundImage = background;
      }
    } else if (style.backgroundType === "pattern") {
      if (sidebarStylePreviewBackground) {
        sidebarStylePreviewBackground.style.backgroundImage = background;
        sidebarStylePreviewBackground.style.backgroundSize = getPatternSize(style);
        sidebarStylePreviewBackground.style.backgroundRepeat = "repeat";
        sidebarStylePreviewBackground.style.opacity = patternOpacity;
      } else {
        sidebarStylePreview.style.backgroundImage = background;
      }
    } else {
      sidebarStylePreview.style.background = background || "#ffffff";
    }
    sidebarStylePreview.style.color = textColor;
    sidebarStylePreview.style.padding = sidebarPadding;
    sidebarStylePreview.classList.toggle("is-disabled", style.enabled !== true);

    if (sidebarStylePreviewHeaderText) {
      sidebarStylePreviewHeaderText.textContent = headerLabel;
      sidebarStylePreviewHeaderText.style.color = textColor;
    }

    if (sidebarStylePreviewHeaderText && sidebarStylePreviewHeaderText.parentElement) {
      sidebarStylePreviewHeaderText.parentElement.hidden = brandingMode === "hide";
      sidebarStylePreviewHeaderText.parentElement.style.alignItems = alignItems;
      sidebarStylePreviewHeaderText.parentElement.style.flexDirection = brandingMode === "replace" ? "column" : "row";
      sidebarStylePreviewHeaderText.parentElement.style.textAlign = alignment;
    }

    if (sidebarStylePreviewLogo) {
      sidebarStylePreviewLogo.src = logoUrl;
      sidebarStylePreviewLogo.hidden = !logoUrl || brandingMode !== "replace";
      sidebarStylePreviewLogo.style.maxHeight = style.logoSize || "32px";
      sidebarStylePreviewLogo.onerror = function hideBrokenLogo() {
        sidebarStylePreviewLogo.hidden = true;
      };
    }

    sidebarStylePreview.querySelectorAll(".sidebar-preview-item").forEach(function updateItem(item) {
      item.style.color = textColor;
      item.style.borderRadius = buttonRadius;
      item.style.marginTop = itemSpacing;
      item.style.marginBottom = itemSpacing;
      item.style.padding = "8px 12px";
      item.style.background = "transparent";
    });

    sidebarStylePreview.querySelectorAll(".sidebar-preview-icon").forEach(function updateIcon(icon) {
      icon.style.background = iconColor;
    });

    sidebarStylePreview.querySelectorAll(".sidebar-preview-divider").forEach(function updateDivider(divider) {
      divider.style.background = dividerColor;
    });

    sidebarStylePreview.querySelectorAll(".sidebar-preview-badge").forEach(function updateBadge(badge) {
      badge.style.background = badgeColor;
      badge.style.color = activeTextColor;
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

    preset.name = presetName.value.trim() || "Untitled Profile";
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
    preset.showInPopup = showInPopupToggle.checked;
    preset.updatedAt = namespace.nowIso();
    return storage.normalizePreset(preset);
  }

  function reapplySavedPresetIfActive(presetId, message, reapplyIfActive, nextState) {
    if (!reapplyIfActive || presetId !== nextState.activePresetId) {
      setStatus(message);
      render();
      return;
    }

    sendToContentScript({ type: "applyPreset", presetId: presetId }, function handleApplied(result) {
      if (result.ok && result.skipped) {
        setStatus(message + " CleanView is off; turn it on to apply.");
      } else {
        setStatus(result.ok ? message + " Applied to current page." : message);
      }
      render();
    });
  }

  function persistPreset(preset, message, reapplyIfActive) {
    storage.updateState(function updatePreset(nextState) {
      nextState.presets[preset.id] = storage.normalizePreset(preset);
      nextState.activePresetId = preset.id;
      nextState.lastEditedProfileId = preset.id;
      if (nextState.presetPreferences) {
        delete nextState.presetPreferences[preset.id];
      }
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to save CleanView Profile.", true);
        return;
      }
      state = nextState;
      selectedPresetId = preset.id;
      reapplySavedPresetIfActive(preset.id, message, reapplyIfActive, nextState);
    });
  }

  function persistSelectedView(message, reapplyIfActive) {
    var preset = selectedPreset();

    if (isCustomPreset(preset)) {
      persistPreset(collectPresetFromForm(), message, reapplyIfActive);
      return;
    }

    setStatus("Create My Profile to customize this Template.", true);
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
    style.stylePath = "preset";
    populateSidebarStyleForm(style, { presetValue: presetKey || "default" });
  }

  function refreshActiveLocation() {
    if (!enableLocationViewDefaults) {
      activeLocationId = null;
      currentLocationLabel.textContent = "";
      return;
    }

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
      selectedPresetId = resolveInitialProfileId(state);
      render();
      refreshActiveLocation();
    });
  }

  function createProfileFromPreset(sourcePresetId, nameOverride) {
    var sourcePreset = storage.getPresetById(state, sourcePresetId);
    var profile = storage.duplicatePreset(state, sourcePresetId);

    if (!sourcePreset || !profile) {
      setStatus("Unable to create Profile from this Template.", true);
      return;
    }

    profile.name = nameOverride || profileNameFromTemplate(sourcePreset);
    profile.description = sourcePreset.description || "";
    persistPreset(profile, "Profile created.", false);
  }

  function createBlankProfile(nameOverride) {
    persistPreset(storage.normalizePreset({
      id: namespace.createId("custom"),
      name: String(nameOverride || "My CleanView").trim() || "My CleanView",
      description: "",
      visibleItems: allMenuKeys.slice(),
      labelOverrides: {},
      customLinks: [],
      sidebarStyle: namespace.defaultSidebarStyle
    }), "Profile created.", false);
  }

  function importPendingProfile() {
    if (!pendingImportedProfile) {
      setStatus("Validate a CleanView Profile before importing.", true);
      return;
    }

    closeProfileTransferModal();
    persistPreset(pendingImportedProfile, "Imported successfully. Active Profile: " + pendingImportedProfile.name + ".", false);
  }

  function handleMoreAction(action) {
    if (!action) {
      return;
    }

    if (action === "duplicate") {
      if (!isEditableProfile(selectedPreset())) {
        setStatus("Create My Profile before duplicating a Template.", true);
        return;
      }
      document.getElementById("duplicatePresetButton").click();
    } else if (action === "rename") {
      if (!isEditableProfile(selectedPreset())) {
        setStatus("Create My Profile before renaming a Template.", true);
      } else {
        presetName.focus();
        presetName.select();
        setStatus("Update the Profile Name field, then Save Profile.");
      }
    } else if (action === "export") {
      openProfileTransferModal("export");
    } else if (action === "copy") {
      openProfileTransferModal("export");
    } else if (action === "delete") {
      document.getElementById("deletePresetButton").click();
    }
  }

  document.querySelectorAll("[data-tab-button]").forEach(function bindTab(button) {
    button.addEventListener("click", function switchTab() {
      activeTab = button.dataset.tabButton;
      renderTabState();
    });
  });

  document.getElementById("createPresetButton").addEventListener("click", function createPreset() {
    createBlankProfile(window.prompt("Profile name", "My CleanView") || "My CleanView");
  });

  document.getElementById("duplicatePresetButton").addEventListener("click", function duplicatePreset() {
    var preset = selectedPreset();
    var duplicate = storage.duplicatePreset(state, selectedPresetId);
    if (duplicate) {
      duplicate.name = preset && preset.source === "builtin" ? profileNameFromTemplate(preset) : nextCopyName(preset && (preset.name || preset.label));
      persistPreset(duplicate, "Profile created.", false);
    }
  });

  document.getElementById("savePresetButton").addEventListener("click", function savePreset() {
    persistSelectedView("Profile saved.", true);
  });

  if (createProfileButton) {
    createProfileButton.addEventListener("click", function openCreateProfile() {
      openProfileTransferModal("create");
    });
  }

  if (createBlankProfileModalButton) {
    createBlankProfileModalButton.addEventListener("click", function createBlankFromModal() {
      closeProfileTransferModal();
      createBlankProfile(createBlankProfileName.value || "My CleanView");
    });
  }

  if (createFromTemplateModalButton) {
    createFromTemplateModalButton.addEventListener("click", function createFromTemplateModal() {
      closeProfileTransferModal();
      createProfileFromPreset(createTemplateSelect.value || "builtin:simple");
    });
  }

  if (createImportProfileButton) {
    createImportProfileButton.addEventListener("click", function chooseImportCreationPath() {
      openProfileTransferModal("import");
    });
  }

  if (createProfileFromTemplateButton) {
    createProfileFromTemplateButton.addEventListener("click", function createFromSelectedTemplate() {
      createProfileFromPreset(selectedPresetId);
    });
  }

  if (onboardingCreateFromTemplateButton) {
    onboardingCreateFromTemplateButton.addEventListener("click", function createFromOnboardingTemplate() {
      createProfileFromPreset(onboardingTemplateSelect.value || "builtin:simple");
    });
  }

  if (onboardingCreateBlankButton) {
    onboardingCreateBlankButton.addEventListener("click", function createBlankFromOnboarding() {
      createBlankProfile(blankProfileName.value || "My CleanView");
    });
  }

  if (onboardingImportProfileButton) {
    onboardingImportProfileButton.addEventListener("click", function importFromOnboarding() {
      openProfileTransferModal("import");
    });
  }

  if (moreProfileActionsSelect) {
    moreProfileActionsSelect.addEventListener("change", function chooseMoreProfileAction() {
      handleMoreAction(moreProfileActionsSelect.value);
      moreProfileActionsSelect.value = "";
    });
  }

  if (profileTransferCloseButton) {
    profileTransferCloseButton.addEventListener("click", closeProfileTransferModal);
  }

  if (validateProfileImportButton) {
    validateProfileImportButton.addEventListener("click", validateProfileImportText);
  }

  if (confirmProfileImportButton) {
    confirmProfileImportButton.addEventListener("click", importPendingProfile);
  }

  if (profileImportFile) {
    profileImportFile.addEventListener("change", function readProfileImportFile(event) {
      var file = event.target.files && event.target.files[0];
      var reader = new FileReader();

      if (!file) {
        return;
      }
      if (!/\.json$/i.test(file.name) && file.type !== "application/json") {
        setStatus("Choose a .json file.", true);
        return;
      }
      if (file.size > 512 * 1024) {
        setStatus("Profile JSON files must be 512KB or smaller.", true);
        return;
      }

      reader.onload = function handleProfileFileLoaded() {
        profileImportTextarea.value = String(reader.result || "");
        validateProfileImportText();
      };
      reader.onerror = function handleProfileFileError() {
        setStatus("Unable to read that Profile JSON file.", true);
      };
      reader.readAsText(file);
    });
  }

  if (copyProfileJsonButton) {
    copyProfileJsonButton.addEventListener("click", function copyProfileJson() {
      copyTextToClipboard(currentExportJson, "Profile JSON copied.");
    });
  }

  if (downloadProfileJsonButton) {
    downloadProfileJsonButton.addEventListener("click", downloadProfileJson);
  }

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
    setStatus("Menu items reset to the selected Profile default.");
  });

  document.getElementById("deletePresetButton").addEventListener("click", function deletePreset() {
    if (!isCustomPreset(selectedPreset())) {
      setStatus("Create My Profile before deleting a Template.", true);
      return;
    }

    if (!window.confirm("Delete this Profile? This cannot be undone.")) {
      setStatus("Delete cancelled.");
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
        nextState.activePresetId = "";
      }
      if (nextState.lastEditedProfileId === selectedPresetId) {
        nextState.lastEditedProfileId = "";
      }
    }, function handleDeleted(nextState, error) {
      if (error) {
        setStatus("Unable to delete Profile.", true);
        return;
      }
      state = nextState;
      selectedPresetId = resolveInitialProfileId(nextState);
      setStatus("Profile deleted.");
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

  if (enableLocationViewDefaults) {
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
        setStatus("This Profile will be used automatically for this GHL location.");
        render();
      });
    });
  }

  presetSelect.addEventListener("change", function selectPreset() {
    selectedPresetId = presetSelect.value;
    if (isEditableProfile(selectedPreset())) {
      storage.updateState(function updateLastEdited(nextState) {
        nextState.lastEditedProfileId = selectedPresetId;
        nextState.activePresetId = selectedPresetId;
      }, function handleSelected(nextState) {
        state = nextState || state;
        render();
      });
    }
    console.log("[AgencySkin CleanView] Profile selected:", {
      id: selectedPresetId,
      name: selectedPreset() && (selectedPreset().name || selectedPreset().label)
    });
    render();
  });

  defaultPresetSelect.addEventListener("change", function updateDefaultPreset() {
    storage.updateState(function updateDefault(nextState) {
      nextState.activePresetId = defaultPresetSelect.value;
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to update default Profile.", true);
        return;
      }
      state = nextState;
      setStatus("Default Profile updated.");
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

  if (curatedPresetGrid) {
    curatedPresetGrid.addEventListener("click", function handleCuratedPresetClick(event) {
      var favorite = event.target.closest("[data-favorite-preset-id]");
      var card = event.target.closest("[data-curated-preset-id]");

      if (favorite) {
        event.stopPropagation();
        toggleFavoritePreset(favorite.dataset.favoritePresetId);
        return;
      }

      if (card) {
        applyCuratedPresetFromCard(card.dataset.curatedPresetId);
      }
    });
  }

  sidebarStyleEditor.addEventListener("click", function handleSidebarStyleEditorClick(event) {
    if (event.target.dataset.removeCustomImage) {
      var style = getCurrentWorkingSidebarStyle();
      style.customImageDataUrl = "";
      populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
      setStatus("Custom image removed. Save this Profile to keep the change.");
    }
  });

  if (globalSidebarStyleEditor) {
    globalSidebarStyleEditor.addEventListener("click", function handleGlobalSidebarStyleClick(event) {
      if (event.target.dataset.removeCustomLogo) {
        var style = getCurrentWorkingSidebarStyle();
        style.customLogoDataUrl = "";
        populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
        setStatus("Logo removed. Save this Profile to keep the change.");
      }
    });
  }

  sidebarStylePreset.addEventListener("change", function chooseStylePreset() {
    applySidebarPresetToForm(sidebarStylePreset.value);
  });

  sidebarStyleEnabled.addEventListener("change", updateSidebarStylePreview);

  if (sidebarStylePath) {
    sidebarStylePath.addEventListener("change", function changeStylePath() {
      var style = getCurrentWorkingSidebarStyle();
      style.stylePath = sidebarStylePath.value || "preset";
      populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
    });
  }

  if (autoReadabilityToggle) {
    autoReadabilityToggle.addEventListener("change", updateSidebarStylePreview);
  }

  sidebarBackgroundType.addEventListener("change", function changeBackgroundType() {
    var style = getCurrentWorkingSidebarStyle();
    style.stylePath = "custom";
    if (sidebarBackgroundType.value === "pattern" && !getAssetById(style.backgroundAssetId)) {
      style.backgroundAssetId = sidebarPatternAssets[0] ? sidebarPatternAssets[0].id : "";
      populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
      return;
    }
    syncSidebarModeState();
    updateSidebarStylePreview();
  });

  if (curatedShuffleButton) {
    curatedShuffleButton.addEventListener("click", applyCuratedShuffle);
  }

  [curatedShuffleEnabled, curatedShufflePool, curatedShuffleFrequency, curatedShuffleAvoidRepeats].forEach(function bindShuffleControl(control) {
    if (!control) {
      return;
    }

    control.addEventListener("change", function updateShuffleControl() {
      if (control === curatedShufflePool) {
        renderCustomPool(collectCuratedShuffleFromForm(getCurrentWorkingSidebarStyle()).customPool);
      }
      updateSidebarStylePreview();
    });
  });

  if (curatedShuffleCustomPool) {
    curatedShuffleCustomPool.addEventListener("change", updateSidebarStylePreview);
  }

  if (sidebarStylePreview) {
    sidebarStylePreview.addEventListener("pointerdown", function startImageDrag(event) {
      if (getCurrentWorkingSidebarStyle().backgroundType !== "image") {
        return;
      }

      sidebarStylePreview.setPointerCapture(event.pointerId);
      updateImagePositionFromPointer(event);
    });
    sidebarStylePreview.addEventListener("pointermove", function dragImage(event) {
      if (!sidebarStylePreview.hasPointerCapture(event.pointerId)) {
        return;
      }
      updateImagePositionFromPointer(event);
    });
    sidebarStylePreview.addEventListener("pointerup", function stopImageDrag(event) {
      if (sidebarStylePreview.hasPointerCapture(event.pointerId)) {
        sidebarStylePreview.releasePointerCapture(event.pointerId);
      }
    });
  }

  if (enableLocationViewDefaults) {
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
  }

  configureLocationDefaultsUi();
  loadState();
})();
