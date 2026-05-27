(function registerAgencySkinStorage() {
  var namespace = window.agencySkinCleanView || {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultState() {
    return {
      version: namespace.version,
      enabled: true,
      activePresetId: "builtin:simple",
      presets: {},
      locationRules: {},
      updatedAt: namespace.nowIso()
    };
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
      textColor: "",
      activeBackgroundColor: "",
      activeTextColor: "",
      hoverBackgroundColor: "",
      borderRadius: "",
      itemSpacing: "",
      sidebarPadding: "",
      logoUrl: "",
      headerLabel: ""
    }, namespace.defaultSidebarStyle || {});
  }

  function normalizeSidebarStyle(style) {
    var normalized = Object.assign(defaultSidebarStyle(), style || {});
    normalized.enabled = normalized.enabled === true;
    normalized.preset = normalized.preset || "default";
    normalized.backgroundType = normalized.backgroundType === "gradient" ? "gradient" : "solid";
    normalized.gradientDirection = normalized.gradientDirection || "135deg";
    return normalized;
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

  function normalizePreset(preset) {
    return {
      id: preset.id,
      name: preset.name || preset.label || "Untitled Preset",
      description: preset.description || "",
      source: preset.source || "custom",
      visibleItems: Array.isArray(preset.visibleItems) ? preset.visibleItems.slice() : [],
      labelOverrides: Object.assign({}, preset.labelOverrides || {}),
      customLinks: Array.isArray(preset.customLinks) ? preset.customLinks.map(normalizeCustomLink) : [],
      sidebarStyle: normalizeSidebarStyle(preset.sidebarStyle),
      updatedAt: preset.updatedAt || namespace.nowIso()
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
    normalized.presets = normalized.presets || {};
    Object.keys(normalized.presets).forEach(function normalizeStoredPreset(presetId) {
      normalized.presets[presetId] = normalizePreset(normalized.presets[presetId]);
    });
    normalized.locationRules = normalized.locationRules || {};
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
    return Object.assign({}, namespace.builtInPresets || {}, (state && state.presets) || {});
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
    getState: getState,
    saveState: saveState,
    updateState: updateState,
    getAllPresets: getAllPresets,
    getPresetById: getPresetById,
    duplicatePreset: duplicatePreset
  };

  window.agencySkinCleanView = namespace;
})();
