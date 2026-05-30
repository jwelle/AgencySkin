(function agencySkinCleanViewEditor() {
  var namespace = window.agencySkinCleanView;
  var storage = namespace.storage;
  var registry = namespace.selectorRegistry;
  var allMenuKeys = namespace.allMenuKeys;
  var sidebarStylePresets = namespace.sidebarStylePresets || {};
  var enableLocationViewDefaults = namespace.ENABLE_LOCATION_VIEW_DEFAULTS === true;
  var state = null;
  var selectedPresetId = "builtin:simple";
  var activeTab = "style";
  var activeLocationId = null;
  var draftSidebarStyle = null;

  var presetSelect = document.getElementById("presetSelect");
  var defaultPresetSelect = document.getElementById("defaultPresetSelect");
  var presetName = document.getElementById("presetName");
  var presetDescription = document.getElementById("presetDescription");
  var showInPopupToggle = document.getElementById("showInPopupToggle");
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
  var sidebarBackgroundAssets = namespace.sidebarBackgroundAssets || [];
  var sidebarPatternAssets = namespace.sidebarPatternAssets || [];
  var sidebarImageAssets = namespace.sidebarImageAssets || [];
  var curatedSidebarStylePresets = namespace.curatedSidebarStylePresets || [];
  var sidebarBackgroundTypes = [
    { value: "solid", label: "Solid Color" },
    { value: "gradient", label: "Gradient" },
    { value: "pattern", label: "Pattern" },
    { value: "image", label: "Image" }
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
    { value: "selected-type-only", label: "Selected Type Only" },
    { value: "images-patterns", label: "Images + Patterns" },
    { value: "professional", label: "Professional Presets" },
    { value: "favorites", label: "Favorites Only" },
    { value: "custom", label: "Custom Pool" }
  ];
  var curatedShuffleFrequencyOptions = [
    { value: "manual", label: "Manual only" },
    { value: "session", label: "Every session" },
    { value: "daily", label: "Daily" },
    { value: "page-load", label: "Every page load" }
  ];
  var curatedShuffleCustomPoolOptions = [
    { value: "solids", label: "Solids" },
    { value: "gradients", label: "Gradients" },
    { value: "patterns", label: "Patterns" },
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
  var sidebarStyleFields = [
    { section: "Solid Background", key: "backgroundColor", label: "Sidebar Background", type: "color", mode: "solid" },
    { key: "backgroundOverlayOpacity", label: "Darken Overlay", type: "range", mode: "solid" },
    { section: "Gradient Background", key: "gradientStartColor", label: "Start Color", type: "color", mode: "gradient" },
    { key: "gradientEndColor", label: "End Color", type: "color", mode: "gradient" },
    { key: "gradientDirection", label: "Direction", type: "select", options: gradientDirections, mode: "gradient" },
    { key: "backgroundOverlayOpacity", label: "Darken Overlay", type: "range", mode: "gradient" },
    { section: "Pattern Background", key: "backgroundAssetId", label: "Pattern", type: "select", options: function patternOptions() {
      return sidebarPatternAssets.map(function mapPattern(asset) {
        return { value: asset.id, label: asset.label };
      });
    }, mode: "pattern" },
    { key: "patternSettings.scale", label: "Pattern Scale", type: "range", min: "0.5", max: "2.5", step: "0.05", mode: "pattern" },
    { key: "patternSettings.opacity", label: "Pattern Opacity", type: "range", mode: "pattern" },
    { key: "patternSettings.overlayOpacity", label: "Darken Overlay", type: "range", mode: "pattern" },
    { key: "patternSettings.accentColor", label: "Accent Color", type: "color", mode: "pattern" },
    { section: "Image Background", key: "backgroundImageUrl", label: "Image URL", type: "url", mode: "image" },
    { key: "backgroundAssetId", label: "Curated Image", type: "select", options: function imageOptions() {
      return [{ value: "", label: "Custom / URL" }].concat(sidebarImageAssets.map(function mapImage(asset) {
        return { value: asset.id, label: asset.label };
      }));
    }, mode: "image" },
    { key: "customImageDataUrl", label: "Upload Custom Image", type: "file", mode: "image" },
    { key: "imageSettings.scale", label: "Zoom", type: "range", min: "0.5", max: "2.5", step: "0.05", mode: "image" },
    { key: "imageSettings.opacity", label: "Fade", type: "range", mode: "image" },
    { key: "imageSettings.overlayOpacity", label: "Darken Overlay", type: "range", mode: "image" },
    { key: "imageSettings.blur", label: "Blur", type: "range", min: "0", max: "12", step: "1", mode: "image" },
    { key: "backgroundImageFit", label: "Image Fit", type: "select", options: backgroundImageFitOptions, mode: "image" },
    { key: "backgroundImagePosition", label: "Image Position", type: "select", options: backgroundImagePositionOptions, mode: "image" },
    { key: "backgroundOverlayColor", label: "Overlay Color", type: "color", mode: "image" },
    { key: "imageSettings.positionX", label: "Position X", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { key: "imageSettings.positionY", label: "Position Y", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { section: "Menu Colors", key: "textColor", label: "Menu Text", type: "color" },
    { key: "activeBackgroundColor", label: "Active Item Background", type: "color" },
    { key: "activeTextColor", label: "Active Item Text", type: "color" },
    { key: "hoverBackgroundColor", label: "Hover Background", type: "color" },
    { section: "Shape", key: "borderRadius", label: "Menu Item Radius", type: "text" },
    { key: "itemSpacing", label: "Menu Item Spacing", type: "text" },
    { key: "sidebarPadding", label: "Sidebar Padding", type: "text" },
    { section: "Branding", key: "sidebarBrandingMode", label: "Sidebar Branding", type: "select", options: sidebarBrandingModes },
    { key: "logoUrl", label: "Logo URL", type: "url" },
    { key: "headerLabel", label: "Header Text", type: "text" },
    { key: "logoSize", label: "Logo Size", type: "text" },
    { key: "headerAlignment", label: "Alignment", type: "select", options: sidebarBrandingAlignmentOptions }
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
    return (preset.name || preset.label) + (preset.source === "builtin" ? " (Built-in)" : " (Custom)");
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
    showInPopupToggle.checked = preset.showInPopup !== false;
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
      var start = style.gradientStartColor || style.backgroundColor || "#0f172a";
      var end = style.gradientEndColor || style.backgroundColor || "#1d4ed8";
      var direction = style.gradientDirection || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return style.backgroundColor || "#ffffff";
  }

  function resolveBrandLogoUrl(style) {
    var brandSettings = namespace.brandSettings || {};
    return normalizeUrl(style.logoUrl || brandSettings.logoUrl || namespace.defaultBrandLogoUrl || "");
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
    options.forEach(function addOption(optionDefinition) {
      var option = document.createElement("option");
      option.value = optionDefinition.value;
      option.textContent = optionDefinition.label;
      select.appendChild(option);
    });
    select.value = getByPath(style, field.key, field.defaultValue || "");
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
    var value = getByPath(style, field.key, "");

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
    input.value = getByPath(style, field.key, "");
    input.dataset.sidebarStyleField = field.key;
    input.addEventListener("input", updateSidebarStylePreview);
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
    input.value = clampNumber(getByPath(style, field.key, 0), Number(input.min), Number(input.max), Number(input.min));
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
        setStatus("Custom image loaded. Save this view to keep it.");
      };
      image.onerror = function handleImageError() {
        setStatus("Unable to read that image.", true);
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
  }

  function populateSidebarStyleForm(style, options) {
    var normalizedStyle = storage.normalizeSidebarStyle(style);
    var presetValue = options && options.presetValue ? options.presetValue : normalizedStyle.preset || "default";
    draftSidebarStyle = normalizedStyle;
    renderCuratedPresetCards(normalizedStyle);

    if (!sidebarStylePresets[presetValue]) {
      ensureCustomStyleOption(options && options.optionLabel ? options.optionLabel : "Custom Draft");
    }

    sidebarStyleEnabled.checked = normalizedStyle.enabled === true;
    sidebarStylePreset.value = presetValue;
    sidebarBackgroundType.value = normalizedStyle.backgroundType || "solid";
    if (autoReadabilityToggle) {
      autoReadabilityToggle.checked = normalizedStyle.autoReadability !== false;
    }
    populateCuratedShuffleForm(normalizedStyle);
    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function updateField(input) {
      var value = getByPath(normalizedStyle, input.dataset.sidebarStyleField, "");
      if (input.type === "file") {
        return;
      }
      input.value = value === undefined || value === null ? "" : value;
      if (input.type === "range") {
        input.value = value === undefined || value === null ? input.value : value;
        if (input.closest(".range-control")) {
          var rangeField = sidebarStyleFields.find(function findRange(field) {
            return field.key === input.dataset.sidebarStyleField;
          }) || {};
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

  function renderSidebarStyle() {
    var preset = selectedPreset();
    var style = storage.normalizeSidebarStyle(preset.sidebarStyle);
    renderSidebarBackgroundTypeOptions(style.backgroundType);
    renderCuratedPresetCards(style);
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
      } else if (field.type === "range") {
        label = createRangeField(field, style);
      } else if (field.type === "file") {
        label = createFileField(field);
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

    if (!preset) {
      return;
    }

    populateSidebarStyleForm(applyCuratedStyleToStyle(getCurrentWorkingSidebarStyle(), preset), {
      presetValue: "custom",
      optionLabel: "Custom Draft - " + preset.label
    });
    setStatus(preset.label + " applied. Save this view to keep it.");
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

    if (shuffle.poolMode === "professional" || shuffle.poolMode === "favorites") {
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
      setStatus("No curated styles match this shuffle pool.", true);
      return;
    }

    selected = pickRandom(candidates);
    style = applyCuratedStyleToStyle(style, selected);
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
    setStatus("Curated Shuffle picked " + selected.label + ". Save this view to keep it.");
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
    syncPresetEditability();
  }

  function collectSidebarStyleFromForm() {
    var style = storage.normalizeSidebarStyle(draftSidebarStyle || sidebarStylePresets[sidebarStylePreset.value] || {});
    style.enabled = sidebarStyleEnabled.checked;
    style.preset = sidebarStylePreset.value || "default";
    style.backgroundType = sidebarBackgroundType.value || "solid";
    style.autoReadability = autoReadabilityToggle ? autoReadabilityToggle.checked : true;
    style.curatedShuffle = collectCuratedShuffleFromForm(style);

    sidebarStyleEditor.querySelectorAll("[data-sidebar-style-field]").forEach(function collectField(input) {
      var key = input.dataset.sidebarStyleField;
      var rangeField = sidebarStyleFields.find(function findField(field) {
        return field.key === key;
      }) || {};
      var modeElement = input.closest("[data-sidebar-style-mode]");

      if (modeElement && modeElement.hidden) {
        return;
      }

      if (input.type === "file") {
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

    if (style.backgroundType === "pattern" && !getAssetById(style.backgroundAssetId)) {
      style.backgroundAssetId = sidebarPatternAssets[0] ? sidebarPatternAssets[0].id : "";
    }
    if (style.backgroundType === "image" && style.backgroundAssetId && !getAssetById(style.backgroundAssetId)) {
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
    var activeBackgroundColor = style.activeBackgroundColor || "#e5e7eb";
    var activeTextColor = style.activeTextColor || textColor;
    var borderRadius = style.borderRadius || "8px";
    var itemSpacing = style.itemSpacing || "4px";
    var sidebarPadding = style.sidebarPadding || "12px";
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
      if (nextState.presetPreferences) {
        delete nextState.presetPreferences[preset.id];
      }
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to save CleanView view.", true);
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

    storage.updateState(function updateBuiltInPreference(nextState) {
      nextState.presetPreferences = nextState.presetPreferences || {};
      nextState.presetPreferences[selectedPresetId] = storage.normalizePresetPreference(Object.assign({}, nextState.presetPreferences[selectedPresetId] || {}, {
        showInPopup: showInPopupToggle.checked,
        updatedAt: namespace.nowIso()
      }));
    }, function handleSaved(nextState, error) {
      if (error) {
        setStatus("Unable to save CleanView view.", true);
        return;
      }

      state = nextState;
      selectedPresetId = preset.id;
      reapplySavedPresetIfActive(preset.id, message, reapplyIfActive, nextState);
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
    persistSelectedView("View saved.", true);
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
        setStatus("This view will be used automatically for this GHL location.");
        render();
      });
    });
  }

  presetSelect.addEventListener("change", function selectPreset() {
    selectedPresetId = presetSelect.value;
    console.log("[AgencySkin CleanView] View selected:", {
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
      setStatus("Custom image removed. Save this view to keep the change.");
    }
  });

  sidebarStylePreset.addEventListener("change", function chooseStylePreset() {
    applySidebarPresetToForm(sidebarStylePreset.value);
  });

  sidebarStyleEnabled.addEventListener("change", updateSidebarStylePreview);

  if (autoReadabilityToggle) {
    autoReadabilityToggle.addEventListener("change", updateSidebarStylePreview);
  }

  sidebarBackgroundType.addEventListener("change", function changeBackgroundType() {
    var style = getCurrentWorkingSidebarStyle();
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
