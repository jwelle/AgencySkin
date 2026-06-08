(function registerAgencySkinStorage() {
  var namespace = window.agencySkinCleanView || {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultState() {
    return {
      version: namespace.version,
      schemaVersion: 1,
      enabled: true,
      activePresetId: "builtin:simple",
      lastEditedProfileId: "",
      presets: {},
      presetPreferences: {},
      locationRules: {},
      updatedAt: namespace.nowIso()
    };
  }

  function isPresetId(value) {
    return /^(builtin|custom|view)[:_]/.test(String(value || ""));
  }

  function defaultSidebarStyle() {
    return Object.assign({
      enabled: false,
      preset: "default",
      activePresetId: "",
      backgroundType: "solid",
      backgroundAssetId: "",
      customImageDataUrl: "",
      backgroundColor: "",
      backgroundOpacity: 1,
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      backgroundImageUrl: "",
      backgroundImageBaseColor: "#0f172a",
      backgroundImageFit: "cover",
      backgroundImagePosition: "center",
      backgroundOverlayColor: "#000000",
      backgroundOverlayOpacity: 0.35,
      imageSettings: {
        positionX: 50,
        positionY: 50,
        scale: 1,
        opacity: 0.85,
        blur: 0,
        overlayEnabled: true,
        overlayColor: "#000000",
        overlayOpacity: 0.15
      },
      patternSettings: {
        scale: 1,
        opacity: 0.5,
        overlayOpacity: 0.35,
        accentColor: "#60a5fa"
      },
      curatedShuffle: {
        enabled: false,
        poolMode: "professional-patterns",
        customPool: ["patterns", "images"],
        frequency: "daily",
        favoritesOnly: false,
        avoidRecentRepeats: true,
        avoidRecentCount: 3,
        lastAppliedAssetIds: [],
        lastAppliedAt: "",
        sessionKey: ""
      },
      measuredLayout: null,
      favoriteAssetIds: [],
      stylePath: "preset",
      autoReadability: true,
      textColor: "",
      iconColor: "",
      activeBackgroundColor: "",
      activeTextColor: "",
      hoverBackgroundColor: "",
      dividerColor: "",
      badgeColor: "",
      borderRadius: "",
      sidebarRadius: "16px",
      buttonRadius: "",
      itemSpacing: "",
      sidebarPadding: "",
      shadowStrength: 0.35,
      borderVisible: true,
      sidebarBrandingMode: "keep",
      logoUrl: "",
      customLogoDataUrl: "",
      headerLabel: "",
      brandAccentColor: "",
      logoSize: "32px",
      headerAlignment: "center"
    }, namespace.defaultSidebarStyle || {});
  }

  function normalizeSidebarStyle(style) {
    var normalized = Object.assign(defaultSidebarStyle(), style || {});
    var allowedBackgroundTypes = ["solid", "gradient", "pattern", "image"];
    var allowedBrandingModes = ["keep", "hide", "replace"];
    var allowedHeaderAlignments = ["left", "center", "right"];
    var allowedStylePaths = ["preset", "custom"];
    var defaultImageSettings = defaultSidebarStyle().imageSettings;
    var defaultPatternSettings = defaultSidebarStyle().patternSettings;
    var defaultShuffle = defaultSidebarStyle().curatedShuffle;
    var allowedShufflePools = ["professional-patterns", "professional", "personal", "patterns", "uploads", "favorites"];
    var allowedShuffleFrequencies = ["manual", "session", "daily"];
    var legacyShufflePools = {
      "selected-type-only": "professional-patterns",
      "images-patterns": "professional-patterns",
      custom: "professional-patterns"
    };
    var allowedCustomPool = ["solids", "gradients", "patterns", "images"];
    normalized.enabled = normalized.enabled === true;
    normalized.preset = normalized.preset || "default";
    normalized.backgroundType = allowedBackgroundTypes.indexOf(normalized.backgroundType) === -1 ? "solid" : normalized.backgroundType;
    normalized.activePresetId = normalized.activePresetId || "";
    normalized.backgroundAssetId = normalized.backgroundAssetId || "";
    normalized.customImageDataUrl = isSafeImageDataUrl(normalized.customImageDataUrl) ? normalized.customImageDataUrl : "";
    normalized.gradientDirection = normalized.gradientDirection || "135deg";
    normalized.backgroundImageUrl = normalizeUrl(normalized.backgroundImageUrl);
    if (normalized.backgroundImageFit === "auto") {
      normalized.backgroundImageFit = "center";
    }
    normalized.backgroundImageFit = ["cover", "contain", "stretch", "tile", "center"].indexOf(normalized.backgroundImageFit) === -1 ? "cover" : normalized.backgroundImageFit;
    normalized.backgroundImagePosition = normalized.backgroundImagePosition || "center";
    normalized.backgroundOverlayColor = normalized.backgroundOverlayColor || "#000000";
    normalized.backgroundOpacity = clampOpacity(normalized.backgroundOpacity === undefined ? 1 : normalized.backgroundOpacity);
    normalized.backgroundOverlayOpacity = clampOpacity(normalized.backgroundOverlayOpacity);
    normalized.imageSettings = Object.assign({}, defaultImageSettings, normalized.imageSettings || {});
    normalized.imageSettings.positionX = clampPercent(normalized.imageSettings.positionX, defaultImageSettings.positionX);
    normalized.imageSettings.positionY = clampPercent(normalized.imageSettings.positionY, defaultImageSettings.positionY);
    normalized.imageSettings.scale = clampNumber(normalized.imageSettings.scale, 0.5, 2.5, defaultImageSettings.scale);
    normalized.imageSettings.opacity = clampOpacity(normalized.imageSettings.opacity);
    normalized.imageSettings.blur = clampNumber(normalized.imageSettings.blur, 0, 12, defaultImageSettings.blur);
    normalized.imageSettings.overlayEnabled = normalized.imageSettings.overlayEnabled !== false;
    normalized.imageSettings.overlayColor = normalized.imageSettings.overlayColor || "#000000";
    normalized.imageSettings.overlayOpacity = clampOpacity(normalized.imageSettings.overlayOpacity);
    normalized.patternSettings = Object.assign({}, defaultPatternSettings, normalized.patternSettings || {});
    normalized.patternSettings.scale = clampNumber(normalized.patternSettings.scale, 0.5, 2.5, defaultPatternSettings.scale);
    normalized.patternSettings.opacity = clampOpacity(normalized.patternSettings.opacity);
    normalized.patternSettings.overlayOpacity = clampOpacity(normalized.patternSettings.overlayOpacity);
    normalized.patternSettings.accentColor = normalized.patternSettings.accentColor || "#60a5fa";
    normalized.curatedShuffle = Object.assign({}, defaultShuffle, normalized.curatedShuffle || {});
    normalized.curatedShuffle.enabled = normalized.curatedShuffle.enabled === true;
    normalized.curatedShuffle.poolMode = legacyShufflePools[normalized.curatedShuffle.poolMode] || normalized.curatedShuffle.poolMode;
    normalized.curatedShuffle.poolMode = allowedShufflePools.indexOf(normalized.curatedShuffle.poolMode) === -1 ? "professional-patterns" : normalized.curatedShuffle.poolMode;
    normalized.curatedShuffle.customPool = Array.isArray(normalized.curatedShuffle.customPool) ?
      normalized.curatedShuffle.customPool.filter(function keepPoolType(type) {
        return allowedCustomPool.indexOf(type) !== -1;
      }) :
      defaultShuffle.customPool.slice();
    if (normalized.curatedShuffle.customPool.length === 0) {
      normalized.curatedShuffle.customPool = defaultShuffle.customPool.slice();
    }
    normalized.curatedShuffle.frequency = normalized.curatedShuffle.frequency === "page-load" ? "daily" : normalized.curatedShuffle.frequency;
    normalized.curatedShuffle.frequency = allowedShuffleFrequencies.indexOf(normalized.curatedShuffle.frequency) === -1 ? "daily" : normalized.curatedShuffle.frequency;
    normalized.curatedShuffle.favoritesOnly = normalized.curatedShuffle.favoritesOnly === true;
    normalized.curatedShuffle.avoidRecentRepeats = normalized.curatedShuffle.avoidRecentRepeats !== false;
    normalized.curatedShuffle.avoidRecentCount = Math.round(clampNumber(normalized.curatedShuffle.avoidRecentCount, 0, 10, 3));
    normalized.curatedShuffle.lastAppliedAssetIds = Array.isArray(normalized.curatedShuffle.lastAppliedAssetIds) ? normalized.curatedShuffle.lastAppliedAssetIds.slice(0, 10) : [];
    normalized.curatedShuffle.lastAppliedAt = normalized.curatedShuffle.lastAppliedAt || "";
    normalized.curatedShuffle.sessionKey = normalized.curatedShuffle.sessionKey || "";
    normalized.measuredLayout = normalizeMeasuredLayout(normalized.measuredLayout);
    normalized.favoriteAssetIds = Array.isArray(normalized.favoriteAssetIds) ? normalized.favoriteAssetIds.filter(Boolean) : [];
    normalized.stylePath = allowedStylePaths.indexOf(normalized.stylePath) === -1 ? "preset" : normalized.stylePath;
    normalized.autoReadability = normalized.autoReadability !== false;
    normalized.shadowStrength = clampOpacity(normalized.shadowStrength === undefined ? 0.35 : normalized.shadowStrength);
    normalized.borderVisible = normalized.borderVisible !== false;
    normalized.sidebarBrandingMode = allowedBrandingModes.indexOf(normalized.sidebarBrandingMode) === -1 ? "keep" : normalized.sidebarBrandingMode;
    normalized.logoUrl = normalizeUrl(normalized.logoUrl);
    normalized.customLogoDataUrl = isSafeImageDataUrl(normalized.customLogoDataUrl) ? normalized.customLogoDataUrl : "";
    normalized.headerLabel = normalized.headerLabel || "";
    normalized.brandAccentColor = normalized.brandAccentColor || "";
    normalized.logoSize = normalized.logoSize || "32px";
    normalized.headerAlignment = allowedHeaderAlignments.indexOf(normalized.headerAlignment) === -1 ? "center" : normalized.headerAlignment;
    return normalized;
  }

  function normalizeMeasuredLayout(layout) {
    var sidebarWidth = 0;
    var sidebarHeight = 0;
    var imageSlotWidth = 0;
    var imageSlotHeight = 0;

    if (!layout || typeof layout !== "object" || Array.isArray(layout)) {
      return null;
    }

    sidebarWidth = normalizePositiveDimension(layout.sidebarWidth);
    sidebarHeight = normalizePositiveDimension(layout.sidebarHeight);
    imageSlotWidth = normalizePositiveDimension(layout.imageSlotWidth);
    imageSlotHeight = normalizePositiveDimension(layout.imageSlotHeight);

    if (!sidebarWidth || !sidebarHeight || !imageSlotWidth || !imageSlotHeight) {
      return null;
    }

    return {
      sidebarWidth: sidebarWidth,
      sidebarHeight: sidebarHeight,
      imageSlotWidth: imageSlotWidth,
      imageSlotHeight: imageSlotHeight,
      imageSlotAspectRatio: roundDimension(imageSlotWidth / imageSlotHeight)
    };
  }

  function normalizePositiveDimension(value) {
    var numeric = Number(value);

    if (!Number.isFinite(numeric) || numeric <= 0) {
      return 0;
    }

    return roundDimension(numeric);
  }

  function roundDimension(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function normalizeUrl(url) {
    var trimmed = String(url || "").trim();

    if (!trimmed) {
      return "";
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
  }

  function isSafeImageDataUrl(value) {
    return /^data:image\/(png|jpe?g|webp);base64,/i.test(String(value || ""));
  }

  function clampOpacity(value) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return 0.35;
    }

    return Math.min(1, Math.max(0, numeric));
  }

  function clampPercent(value, fallback) {
    return clampNumber(value, 0, 100, fallback);
  }

  function clampNumber(value, min, max, fallback) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, numeric));
  }

  function normalizeCustomLink(link) {
    return {
      id: link.id || namespace.createId("link"),
      label: link.label || "",
      url: link.url || link.href || "",
      placement: link.placement || "bottom",
      openMode: link.openMode || "new_tab",
      enabled: link.enabled !== false
    };
  }

  function normalizeMenuGroupLabel(value) {
    var text = String(value || "").trim();

    if (!text || /[<>]/.test(text) || /[\u0000-\u001f\u007f]/.test(text)) {
      return "Menu Group";
    }

    return text.slice(0, 40);
  }

  function normalizeMenuGroups(menuGroups) {
    var supportedMenuKeys = Array.isArray(namespace.allMenuKeys) ? namespace.allMenuKeys : [];
    var assignedItems = {};

    if (!Array.isArray(menuGroups)) {
      return [];
    }

    return menuGroups.slice(0, 8).reduce(function collectGroups(groups, group) {
      var normalizedItems = [];

      if (!group || typeof group !== "object" || Array.isArray(group)) {
        return groups;
      }

      if (Array.isArray(group.items)) {
        group.items.slice(0, 12).forEach(function collectItem(item) {
          var key = String(item || "").trim();

          if (supportedMenuKeys.indexOf(key) === -1 || assignedItems[key]) {
            return;
          }

          assignedItems[key] = true;
          normalizedItems.push(key);
        });
      }

      groups.push({
        id: group.id || namespace.createId("group"),
        label: normalizeMenuGroupLabel(group.label),
        items: normalizedItems,
        collapsed: group.collapsed === true
      });
      return groups;
    }, []);
  }

  function normalizePreset(preset, fallbackId) {
    preset = preset || {};

    var canUsePresetId = isPresetId(preset.id);
    var canUseFallbackId = isPresetId(fallbackId);
    var presetId = canUsePresetId ? preset.id : (canUseFallbackId ? fallbackId : namespace.createId("custom"));

    if (!canUsePresetId && !canUseFallbackId) {
      console.warn("[AgencySkin CleanView] Missing preset ID, generated fallback ID:", preset);
    }

    return {
      id: presetId,
      name: preset.name || preset.label || "Untitled Preset",
      description: preset.description || "",
      source: preset.source || "custom",
      visibleItems: Array.isArray(preset.visibleItems) ? preset.visibleItems.slice() : [],
      labelOverrides: Object.assign({}, preset.labelOverrides || {}),
      customLinks: Array.isArray(preset.customLinks) ? preset.customLinks.map(normalizeCustomLink) : [],
      menuGroups: normalizeMenuGroups(preset.menuGroups),
      sidebarStyle: normalizeSidebarStyle(preset.sidebarStyle),
      profileMetadata: preset.profileMetadata && typeof preset.profileMetadata === "object" && !Array.isArray(preset.profileMetadata) ? clone(preset.profileMetadata) : null,
      showInPopup: preset.showInPopup !== false,
      archived: preset.archived === true,
      updatedAt: preset.updatedAt || namespace.nowIso()
    };
  }

  function normalizePresetPreference(preference) {
    preference = preference || {};

    return {
      showInPopup: preference.showInPopup !== false,
      archived: preference.archived === true,
      updatedAt: preference.updatedAt || namespace.nowIso()
    };
  }

  function migrateOldStore(store) {
    var state = defaultState();

    if (store && Array.isArray(store.visibleItems)) {
      state.activePresetId = store.selectedPreset ? "custom:migrated" : "builtin:admin";
      state.presets["custom:migrated"] = normalizePreset({
        id: "custom:migrated",
        name: "Migrated CleanView Profile",
        visibleItems: store.visibleItems,
        sidebarStyle: defaultSidebarStyle(),
        updatedAt: store.updatedAt
      });
    }

    return state;
  }

  function normalizeState(state) {
    var normalized = Object.assign(defaultState(), state || {});
    var allPresets = null;
    if (Array.isArray(normalized.presets)) {
      normalized.presets = normalized.presets.reduce(function collectPresets(presets, preset) {
        var normalizedPreset = normalizePreset(preset);
        presets[normalizedPreset.id] = normalizedPreset;
        return presets;
      }, {});
    } else {
      normalized.presets = normalized.presets || {};
    }
    normalized.schemaVersion = normalized.schemaVersion || 1;
    normalized.presetPreferences = normalized.presetPreferences && !Array.isArray(normalized.presetPreferences) ? normalized.presetPreferences : {};
    Object.keys(normalized.presets).forEach(function normalizeStoredPreset(presetId) {
      var normalizedPreset = normalizePreset(normalized.presets[presetId], presetId);
      if (normalizedPreset.id !== presetId) {
        delete normalized.presets[presetId];
      }
      normalized.presets[normalizedPreset.id] = normalizedPreset;
    });
    Object.keys(normalized.presetPreferences).forEach(function normalizeStoredPreference(presetId) {
      if (!isPresetId(presetId)) {
        delete normalized.presetPreferences[presetId];
        return;
      }

      normalized.presetPreferences[presetId] = normalizePresetPreference(normalized.presetPreferences[presetId]);
    });
    normalized.locationRules = normalized.locationRules && !Array.isArray(normalized.locationRules) ? normalized.locationRules : {};
    allPresets = getAllPresets(normalized);
    if (!normalized.lastEditedProfileId || !allPresets[normalized.lastEditedProfileId] || allPresets[normalized.lastEditedProfileId].source === "builtin" || allPresets[normalized.lastEditedProfileId].archived === true) {
      normalized.lastEditedProfileId = "";
    }
    if (!allPresets[normalized.activePresetId]) {
      console.warn("[AgencySkin CleanView] Active preset ID missing, falling back to Simple Template:", normalized.activePresetId);
      normalized.activePresetId = "builtin:simple";
    }
    Object.keys(normalized.locationRules).forEach(function normalizeLocationRule(locationId) {
      var rule = normalized.locationRules[locationId];
      var presetId = typeof rule === "string" ? rule : rule && rule.presetId;

      if (!presetId || !allPresets[presetId]) {
        if (!isPresetId(presetId)) {
          delete normalized.locationRules[locationId];
          return;
        }
      }

      normalized.locationRules[locationId] = {
        presetId: presetId,
        updatedAt: rule.updatedAt || normalized.updatedAt || namespace.nowIso()
      };
    });
    normalized.updatedAt = normalized.updatedAt || namespace.nowIso();
    return normalized;
  }

  function getState(callback) {
    chrome.storage.local.get([namespace.storageKey, "selectedPreset", "visibleItems", "updatedAt"], function handleStore(store) {
      if (chrome.runtime.lastError) {
        callback(null, chrome.runtime.lastError);
        return;
      }

      if (store[namespace.storageKey]) {
        callback(normalizeState(store[namespace.storageKey]));
        return;
      }

      var migrated = migrateOldStore(store);
      saveState(migrated, function handleSaved(_state, error) {
        callback(migrated, error);
      });
    });
  }

  function saveState(state, callback) {
    var normalized = normalizeState(state);
    normalized.updatedAt = namespace.nowIso();
    chrome.storage.local.set({ agencySkinCleanView: normalized }, function handleSaved() {
      if (chrome.runtime.lastError) {
        if (callback) {
          callback(null, chrome.runtime.lastError);
        }
        return;
      }

      if (callback) {
        callback(normalized);
      }
    });
  }

  function updateState(mutator, callback) {
    getState(function handleState(state, error) {
      if (error) {
        callback(null, error);
        return;
      }

      var nextState = clone(state || defaultState());
      mutator(nextState);
      saveState(nextState, callback);
    });
  }

  function getAllPresets(state) {
    var presets = Object.assign({}, namespace.builtInPresets || {}, (state && state.presets) || {});
    var preferences = state && state.presetPreferences ? state.presetPreferences : {};
    var normalized = {};

    Object.keys(presets).forEach(function applyPresetPreference(presetId) {
      var preset = normalizePreset(presets[presetId], presetId);
      var preference = preferences[presetId];

      if (preference) {
        preset.showInPopup = preference.showInPopup !== false;
        preset.archived = preference.archived === true;
      }

      normalized[preset.id] = preset;
    });

    return normalized;
  }

  function getPresetById(state, presetId) {
    return getAllPresets(state)[presetId] || null;
  }

  function duplicatePreset(state, sourcePresetId) {
    var sourcePreset = getPresetById(state, sourcePresetId);

    if (!sourcePreset) {
      return null;
    }

    return normalizePreset({
      id: namespace.createId("custom"),
      name: (sourcePreset.name || sourcePreset.label) + " Copy",
      description: sourcePreset.description || "",
      visibleItems: sourcePreset.visibleItems || [],
      labelOverrides: sourcePreset.labelOverrides || {},
      customLinks: (sourcePreset.customLinks || []).map(function copyLink(link) {
        var nextLink = normalizeCustomLink(link);
        nextLink.id = namespace.createId("link");
        return nextLink;
      }),
      sidebarStyle: normalizeSidebarStyle(sourcePreset.sidebarStyle),
      menuGroups: sourcePreset.menuGroups || [],
      profileMetadata: sourcePreset.profileMetadata || null
    });
  }

  namespace.storage = {
    defaultState: defaultState,
    normalizeCustomLink: normalizeCustomLink,
    normalizeMenuGroups: normalizeMenuGroups,
    normalizeSidebarStyle: normalizeSidebarStyle,
    normalizePreset: normalizePreset,
    normalizePresetPreference: normalizePresetPreference,
    getState: getState,
    saveState: saveState,
    updateState: updateState,
    getAllPresets: getAllPresets,
    getPresetById: getPresetById,
    duplicatePreset: duplicatePreset
  };

  window.agencySkinCleanView = namespace;
})();
