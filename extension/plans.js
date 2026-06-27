(function registerAgencySkinCleanViewPlans() {
  var namespace = window.agencySkinCleanView || {};
  var DAY_IN_MS = 24 * 60 * 60 * 1000;
  var PLAN_IDS = Object.freeze([
    "free",
    "pro_trial",
    "legacy_pro",
    "pro",
    "agency"
  ]);
  var FEATURE_KEYS = Object.freeze([
    "guidedFlow",
    "basicTemplates",
    "premiumTemplates",
    "menuVisibility",
    "renameMenuLabels",
    "quickLinks",
    "solidColors",
    "gradients",
    "imageBackgrounds",
    "logoUpload",
    "customBranding",
    "profileDuplication",
    "importExport",
    "advancedImagePositioning",
    "cloudSync",
    "agencyProfilePacks",
    "teamControls",
    "sharedTemplates"
  ]);

  function createFeatureRecord(enabledKeys) {
    var enabledSet = new Set(enabledKeys || []);

    return FEATURE_KEYS.reduce(function buildFeatureRecord(record, key) {
      record[key] = enabledSet.has(key);
      return record;
    }, {});
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function addDays(isoString, dayCount) {
    var startedAt = isoString ? new Date(isoString) : new Date();

    if (!Number.isFinite(startedAt.getTime())) {
      startedAt = new Date();
    }

    return new Date(startedAt.getTime() + dayCount * DAY_IN_MS).toISOString();
  }

  function generateInstallId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "install-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function parseIsoOrFallback(value, fallback) {
    var parsed = new Date(value || "");

    if (!Number.isFinite(parsed.getTime())) {
      return fallback;
    }

    return parsed.toISOString();
  }

  function isPlanId(value) {
    return PLAN_IDS.indexOf(String(value || "")) !== -1;
  }

  var PLAN_CONFIG = Object.freeze({
    free: {
      id: "free",
      label: "Free",
      description: "Basic sidebar cleanup.",
      limits: {
        maxProfiles: 1,
        maxQuickLinks: 0
      },
      features: createFeatureRecord([
        "guidedFlow",
        "basicTemplates",
        "menuVisibility",
        "solidColors"
      ])
    },
    pro_trial: {
      id: "pro_trial",
      label: "CleanView V1",
      description: "Local customization features enabled.",
      limits: {
        maxProfiles: 999,
        maxQuickLinks: 999
      },
      features: createFeatureRecord([
        "guidedFlow",
        "basicTemplates",
        "premiumTemplates",
        "menuVisibility",
        "renameMenuLabels",
        "quickLinks",
        "solidColors",
        "gradients",
        "imageBackgrounds",
        "logoUpload",
        "customBranding",
        "profileDuplication",
        "importExport",
        "advancedImagePositioning"
      ])
    },
    legacy_pro: {
      id: "legacy_pro",
      label: "Legacy Pro",
      description: "Legacy Pro access.",
      limits: {
        maxProfiles: 999,
        maxQuickLinks: 999
      },
      features: createFeatureRecord([
        "guidedFlow",
        "basicTemplates",
        "premiumTemplates",
        "menuVisibility",
        "renameMenuLabels",
        "quickLinks",
        "solidColors",
        "gradients",
        "imageBackgrounds",
        "logoUpload",
        "customBranding",
        "profileDuplication",
        "importExport",
        "advancedImagePositioning",
        "cloudSync"
      ])
    },
    pro: {
      id: "pro",
      label: "Pro",
      description: "Full personalization and branding.",
      limits: {
        maxProfiles: 999,
        maxQuickLinks: 999
      },
      features: createFeatureRecord([
        "guidedFlow",
        "basicTemplates",
        "premiumTemplates",
        "menuVisibility",
        "renameMenuLabels",
        "quickLinks",
        "solidColors",
        "gradients",
        "imageBackgrounds",
        "logoUpload",
        "customBranding",
        "profileDuplication",
        "importExport",
        "advancedImagePositioning",
        "cloudSync"
      ])
    },
    agency: {
      id: "agency",
      label: "Agency",
      description: "Agency and team-level controls.",
      limits: {
        maxProfiles: 999,
        maxQuickLinks: 999
      },
      features: createFeatureRecord([
        "guidedFlow",
        "basicTemplates",
        "premiumTemplates",
        "menuVisibility",
        "renameMenuLabels",
        "quickLinks",
        "solidColors",
        "gradients",
        "imageBackgrounds",
        "logoUpload",
        "customBranding",
        "profileDuplication",
        "importExport",
        "advancedImagePositioning",
        "cloudSync",
        "agencyProfilePacks",
        "teamControls",
        "sharedTemplates"
      ])
    }
  });

  function getCurrentPlan(state) {
    var metadata = state && state.installMetadata;
    var planId = metadata && metadata.plan;

    return isPlanId(planId) ? planId : "pro_trial";
  }

  function getCurrentPlanConfig(state) {
    return PLAN_CONFIG[getCurrentPlan(state)] || PLAN_CONFIG.pro_trial;
  }

  function canUseFeature(featureKey, state) {
    var config = getCurrentPlanConfig(state);

    return Boolean(config.features && config.features[featureKey] === true);
  }

  function getPlanLimit(limitKey, state) {
    var config = getCurrentPlanConfig(state);

    return config && config.limits ? config.limits[limitKey] : undefined;
  }

  function isAtProfileLimit(currentProfileCount, state) {
    var limit = Number(getPlanLimit("maxProfiles", state));

    if (!Number.isFinite(limit) || limit <= 0) {
      return false;
    }

    return Number(currentProfileCount || 0) >= limit;
  }

  function isAtQuickLinkLimit(currentQuickLinkCount, state) {
    var limit = Number(getPlanLimit("maxQuickLinks", state));

    if (!Number.isFinite(limit) || limit < 0) {
      return false;
    }

    return Number(currentQuickLinkCount || 0) >= limit;
  }

  function getTrialStatus(state) {
    var metadata = state && state.installMetadata || {};
    var planId = getCurrentPlan(state);
    var isTrial = planId === "pro_trial";
    var startedAt = metadata.trialStartedAt || "";
    var endsAt = metadata.trialEndsAt || "";
    var now = Date.now();
    var endTime = endsAt ? new Date(endsAt).getTime() : NaN;
    var daysRemaining = undefined;
    var isExpired = false;

    if (isTrial && Number.isFinite(endTime)) {
      daysRemaining = Math.max(0, Math.ceil((endTime - now) / DAY_IN_MS));
      isExpired = endTime <= now;
    }

    return {
      isTrial: isTrial,
      trialStartedAt: startedAt || undefined,
      trialEndsAt: endsAt || undefined,
      daysRemaining: daysRemaining,
      isExpired: isExpired
    };
  }

  function ensureInstallMetadata(state) {
    var nextState = state || {};
    var nowIso = typeof namespace.nowIso === "function" ? namespace.nowIso() : new Date().toISOString();
    var currentMetadata = nextState.installMetadata && typeof nextState.installMetadata === "object" ? clone(nextState.installMetadata) : {};
    var installedAt = parseIsoOrFallback(currentMetadata.installedAt, nowIso);
    var trialStartedAt = parseIsoOrFallback(currentMetadata.trialStartedAt, installedAt);
    var installId = currentMetadata.installId || generateInstallId();
    var planId = isPlanId(currentMetadata.plan) ? currentMetadata.plan : "pro_trial";
    var trialEndsAt = parseIsoOrFallback(currentMetadata.trialEndsAt, addDays(trialStartedAt, 30));

    nextState.installMetadata = Object.assign({}, currentMetadata, {
      installId: installId,
      installedAt: installedAt,
      plan: planId,
      trialStartedAt: trialStartedAt,
      trialEndsAt: trialEndsAt,
      appVersionAtInstall: currentMetadata.appVersionAtInstall || namespace.appVersion || namespace.version || "",
      lastSeenAt: parseIsoOrFallback(currentMetadata.lastSeenAt, nowIso)
    });

    return nextState.installMetadata;
  }

  function touchInstallMetadata(state) {
    var nextState = state || {};
    var nowIso = typeof namespace.nowIso === "function" ? namespace.nowIso() : new Date().toISOString();

    ensureInstallMetadata(nextState);
    nextState.installMetadata.lastSeenAt = nowIso;
    return nextState.installMetadata;
  }

  namespace.plans = {
    PLAN_IDS: PLAN_IDS,
    FEATURE_KEYS: FEATURE_KEYS,
    PLAN_CONFIG: PLAN_CONFIG,
    getCurrentPlan: getCurrentPlan,
    getCurrentPlanConfig: getCurrentPlanConfig,
    canUseFeature: canUseFeature,
    getPlanLimit: getPlanLimit,
    isAtProfileLimit: isAtProfileLimit,
    isAtQuickLinkLimit: isAtQuickLinkLimit,
    getTrialStatus: getTrialStatus,
    ensureInstallMetadata: ensureInstallMetadata,
    touchInstallMetadata: touchInstallMetadata
  };

  window.agencySkinCleanView = namespace;
})();
