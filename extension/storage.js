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
      backgroundType: "solid",
      backgroundColor: "",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      backgroundImageUrl: "",
      backgroundImageFit: "cover",
      backgroundImagePosition: "center",
      backgroundOverlayColor: "#000000",
      backgroundOverlayOpacity: 0.35,
      textColor: "",
      activeBackgroundColor: "",
      activeTextColor: "",
      hoverBackgroundColor: "",
      borderRadius: "",
      itemSpacing: "",
      sidebarPadding: "",
      sidebarBrandingMode: "keep",
      logoUrl: "",
      headerLabel: "",
      logoSize: "32px",
      headerAlignment: "center"
    }, namespace.defaultSidebarStyle || {});
  }

  function normalizeSidebarStyle(style) {
    var normalized = Object.assign(defaultSidebarStyle(), style || {});
    var allowedBackgroundTypes = ["solid", "gradient", "image"];
    var allowedBrandingModes = ["keep", "hide", "replace"];
    var allowedHeaderAlignments = ["left", "center", "right"];
    normalized.enabled = normalized.enabled === true;
    normalized.preset = normalized.preset || "default";
    normalized.backgroundType = allowedBackgroundTypes.indexOf(normalized.backgroundType) === -1 ? "solid" : normalized.backgroundType;
    normalized.gradientDirection = normalized.gradientDirection || "135deg";
    normalized.backgroundImageUrl = normalizeUrl(normalized.backgroundImageUrl);
    normalized.backgroundImageFit = ["cover", "contain", "auto"].indexOf(normalized.backgroundImageFit) === -1 ? "cover" : normalized.backgroundImageFit;
    normalized.backgroundImagePosition = normalized.backgroundImagePosition || "center";
    normalized.backgroundOverlayColor = normalized.backgroundOverlayColor || "#000000";
    normalized.backgroundOverlayOpacity = clampOpacity(normalized.backgroundOverlayOpacity);
    normalized.sidebarBrandingMode = allowedBrandingModes.indexOf(normalized.sidebarBrandingMode) === -1 ? "keep" : normalized.sidebarBrandingMode;
    normalized.logoUrl = normalizeUrl(normalized.logoUrl);
    normalized.headerLabel = normalized.headerLabel || "";
    normalized.logoSize = normalized.logoSize || "32px";
    normalized.headerAlignment = allowedHeaderAlignments.indexOf(normalized.headerAlignment) === -1 ? "center" : normalized.headerAlignment;
    return normalized;
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
      sidebarStyle: normalizeSidebarStyle(preset.sidebarStyle),
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
        name: "Migrated CleanView Preset",
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
    if (!allPresets[normalized.activePresetId]) {
      console.warn("[AgencySkin CleanView] Active preset ID missing, falling back to built-in Simple View:", normalized.activePresetId);
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
      sidebarStyle: normalizeSidebarStyle(sourcePreset.sidebarStyle)
    });
  }

  namespace.storage = {
    defaultState: defaultState,
    normalizeCustomLink: normalizeCustomLink,
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
