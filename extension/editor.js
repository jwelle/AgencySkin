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
  var draggedMenuGroupKey = "";
  var draggedStarterMenuKey = "";
  var onboardingMode = "";
  var selectedStarterViewId = "";
  var onboardingDraftPreset = null;
  var postCreationMenuOnlyMode = false;
  var starterApplyMessage = "";
  var starterFlowSource = "first_run";
  var isDirty = false;
  var lastSavedDraftSnapshot = "";
  var reloadGhlTabTargetId = null;
  var styleAccordionState = {
    stylePath: true,
    presets: true,
    background: false,
    logo: false,
    menuText: false,
    spacing: false,
    advanced: false
  };
  var suppressDirtyTracking = false;

  var presetSelect = document.getElementById("presetSelect");
  var firstTimeProfileOnboarding = document.getElementById("firstTimeProfileOnboarding");
  var starterChooserPanel = document.getElementById("starterChooserPanel");
  var starterPreviewPanel = document.getElementById("starterPreviewPanel");
  var starterSuccessPanel = document.getElementById("starterSuccessPanel");
  var starterViewGrid = document.getElementById("starterViewGrid");
  var starterPreviewTitle = document.getElementById("starterPreviewTitle");
  var starterPreviewDescription = document.getElementById("starterPreviewDescription");
  var starterPreviewBadge = document.getElementById("starterPreviewBadge");
  var starterPreviewMeta = document.getElementById("starterPreviewMeta");
  var starterPreviewShownList = document.getElementById("starterPreviewShownList");
  var starterPreviewHiddenList = document.getElementById("starterPreviewHiddenList");
  var starterPreviewHelper = document.getElementById("starterPreviewHelper");
  var starterColorPresetList = document.getElementById("starterColorPresetList");
  var starterCustomColorPicker = document.getElementById("starterCustomColorPicker");
  var starterCustomColorValue = document.getElementById("starterCustomColorValue");
  var starterTextColorMode = document.getElementById("starterTextColorMode");
  var starterViewNameInput = document.getElementById("starterViewNameInput");
  var starterChooserBackButton = document.getElementById("starterChooserBackButton");
  var starterPreviewBackButton = document.getElementById("starterPreviewBackButton");
  var useStarterViewButton = document.getElementById("useStarterViewButton");
  var starterSuccessTitle = document.getElementById("starterSuccessTitle");
  var starterSuccessMessage = document.getElementById("starterSuccessMessage");
  var starterSuccessProfileName = document.getElementById("starterSuccessProfileName");
  var starterSuccessBadge = document.getElementById("starterSuccessBadge");
  var starterSuccessMeta = document.getElementById("starterSuccessMeta");
  var starterSuccessWhatHappened = document.getElementById("starterSuccessWhatHappened");
  var starterSuccessSkipped = document.getElementById("starterSuccessSkipped");
  var editStarterMenuButton = document.getElementById("editStarterMenuButton");
  var openStarterFullEditorButton = document.getElementById("openStarterFullEditorButton");
  var doneStarterViewButton = document.getElementById("doneStarterViewButton");
  var activeViewOverviewPanel = document.getElementById("activeViewOverviewPanel");
  var activeViewBadge = document.getElementById("activeViewBadge");
  var activeViewMeta = document.getElementById("activeViewMeta");
  var activeViewName = document.getElementById("activeViewName");
  var activeViewStatus = document.getElementById("activeViewStatus");
  var changeStarterViewButton = document.getElementById("changeStarterViewButton");
  var customizeActiveViewButton = document.getElementById("customizeActiveViewButton");
  var overviewApplyLiveButton = document.getElementById("overviewApplyLiveButton");
  var overviewResetPageButton = document.getElementById("overviewResetPageButton");
  var profileManagementPanel = document.getElementById("profileManagementPanel");
  var builderPanel = document.getElementById("builderPanel");
  var onboardingTemplateSelect = document.getElementById("onboardingTemplateSelect");
  var onboardingCreateFromTemplateButton = document.getElementById("onboardingCreateFromTemplateButton");
  var blankProfileName = document.getElementById("blankProfileName");
  var onboardingCreateBlankButton = document.getElementById("onboardingCreateBlankButton");
  var onboardingImportProfileButton = document.getElementById("onboardingImportProfileButton");
  var startFromViewButton = document.getElementById("startFromViewButton");
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
  var menuGroupEditor = document.getElementById("menuGroupEditor");
  var menuBuilderDescription = document.getElementById("menuBuilderDescription");
  var addMenuGroupButton = document.getElementById("addMenuGroupButton");
  var renameEditor = document.getElementById("renameEditor");
  var linkEditor = document.getElementById("linkEditor");
  var locationRules = document.getElementById("locationRules");
  var statusMessage = document.getElementById("statusMessage");
  var reloadGhlTabButton = document.getElementById("reloadGhlTabButton");
  var postCreationMenuActions = document.getElementById("postCreationMenuActions");
  var backToStarterSummaryButton = document.getElementById("backToStarterSummaryButton");
  var doneEditingStarterMenuButton = document.getElementById("doneEditingStarterMenuButton");
  var currentLocationLabel = document.getElementById("currentLocationLabel");
  var sidebarStyleEnabled = document.getElementById("sidebarStyleEnabled");
  var sidebarStylePreset = document.getElementById("sidebarStylePreset");
  var sidebarStylePath = document.getElementById("sidebarStylePath");
  var sidebarBackgroundType = document.getElementById("sidebarBackgroundType");
  var sidebarStyleEditor = document.getElementById("sidebarStyleEditor");
  var globalSidebarStyleEditor = document.getElementById("globalSidebarStyleEditor");
  var spacingStyleEditor = document.getElementById("spacingStyleEditor");
  var advancedStyleEditor = document.getElementById("advancedStyleEditor");
  var presetAdjustmentEditor = document.getElementById("presetAdjustmentEditor");
  var menuColorEditor = document.getElementById("menuColorEditor");
  var stickySaveBar = document.getElementById("stickySaveBar");
  var stickySaveStatus = document.getElementById("stickySaveStatus");
  var stickyRevertButton = document.getElementById("stickyRevertButton");
  var stickySaveButton = document.getElementById("stickySaveButton");
  var stickySaveApplyButton = document.getElementById("stickySaveApplyButton");
  var presetStylePanel = document.getElementById("presetStylePanel");
  var customStylePanel = document.getElementById("customStylePanel");
  var sidebarStylePreview = document.getElementById("sidebarStylePreview");
  var sidebarStylePreviewBackground = document.getElementById("sidebarStylePreviewBackground");
  var sidebarStylePreviewOverlay = document.getElementById("sidebarStylePreviewOverlay");
  var sidebarStylePreviewHeaderText = document.getElementById("sidebarStylePreviewHeaderText");
  var sidebarStylePreviewLogo = document.getElementById("sidebarStylePreviewLogo");
  var applyLiveButton = document.getElementById("applyLiveButton");
  var detectGhlSidebarButton = document.getElementById("detectGhlSidebarButton");
  var sidebarMeasurementStatus = document.getElementById("sidebarMeasurementStatus");
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
  var saveAsCopyButton = document.getElementById("saveAsCopyButton");
  var pendingImportedProfile = null;
  var currentExportJson = "";
  var currentExportFilename = "";
  var sidebarBackgroundAssets = namespace.sidebarBackgroundAssets || [];
  var sidebarPatternAssets = namespace.sidebarPatternAssets || [];
  var sidebarImageAssets = namespace.sidebarImageAssets || [];
  var curatedSidebarStylePresets = namespace.curatedSidebarStylePresets || [];
  var sidebarBackgroundTypes = [
    { value: "none", label: "None" },
    { value: "solid", label: "Color" },
    { value: "gradient", label: "Gradient" },
    { value: "image", label: "Image" }
  ];
  var starterSidebarColorPresets = [
    { id: "dark", label: "Dark", color: "#111827" },
    { id: "charcoal", label: "Charcoal", color: "#233044" },
    { id: "blue", label: "Blue", color: "#123a5c" },
    { id: "green", label: "Green", color: "#14532d" },
    { id: "purple", label: "Purple", color: "#3b1d5a" },
    { id: "light", label: "Light", color: "#f8fafc" },
    { id: "custom", label: "Custom", color: "" }
  ];
  var starterViews = [
    {
      id: "sales",
      name: "Sales View",
      cardTitle: "Sales",
      description: "Keep inbox, pipeline, calendar, contacts, payments, and reporting close at hand.",
      bestFor: "Best for reps, closers, and appointment setters.",
      keepsLine: "Keeps Inbox, Pipeline, Calendar, Contacts, Payments, and Reporting.",
      accentColor: "#2563eb",
      accentSoft: "#dbeafe",
      accentBorder: "#93c5fd",
      iconId: "sales",
      sidebarStyle: {
        stylePath: "custom",
        enabled: true,
        backgroundType: "solid",
        backgroundColor: "#123a5c",
        textColor: "#e0f2fe",
        activeBackgroundColor: "#1d4ed8",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#1e3a5f"
      },
      visibleItems: ["dashboard", "conversations", "calendars", "contacts", "opportunities", "payments", "reporting", "settings"],
      labelOverrides: {
        conversations: "Inbox",
        opportunities: "Pipeline"
      }
    },
    {
      id: "marketing",
      name: "Marketing View",
      cardTitle: "Marketing",
      description: "Focus the sidebar on campaigns, workflows, sites, media, reputation, and reports.",
      bestFor: "Best for campaign builders, media work, and funnels.",
      keepsLine: "Keeps Marketing, Workflows, Sites, Media, Reputation, and Reporting.",
      accentColor: "#7c3aed",
      accentSoft: "#ede9fe",
      accentBorder: "#c4b5fd",
      iconId: "marketing",
      sidebarStyle: {
        stylePath: "custom",
        enabled: true,
        backgroundType: "solid",
        backgroundColor: "#3b1d5a",
        textColor: "#f3e8ff",
        activeBackgroundColor: "#7c3aed",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#4c1d6f"
      },
      visibleItems: ["dashboard", "marketing", "automation", "sites", "media", "reputation", "reporting", "contacts", "settings"],
      labelOverrides: {
        automation: "Workflows"
      }
    },
    {
      id: "ai-operator",
      name: "AI Operator View",
      cardTitle: "AI Operator",
      description: "Prioritize AI tools, workflows, inbox review, contacts, and reporting.",
      bestFor: "Best for AI teams managing agents, prompts, and automation.",
      keepsLine: "Keeps Ask AI, AI Studio, AI Agents, Workflows, Inbox, and Reporting.",
      accentColor: "#0f766e",
      accentSoft: "#ccfbf1",
      accentBorder: "#5eead4",
      iconId: "ai-operator",
      sidebarStyle: {
        stylePath: "custom",
        enabled: true,
        backgroundType: "solid",
        backgroundColor: "#0f4c5c",
        textColor: "#ecfeff",
        activeBackgroundColor: "#0ea5b7",
        activeTextColor: "#062b33",
        hoverBackgroundColor: "#155e75"
      },
      visibleItems: ["ask_ai", "ai_studio", "ai_agents", "automation", "conversations", "contacts", "reporting", "settings"],
      labelOverrides: {
        automation: "Workflows",
        conversations: "Inbox"
      }
    },
    {
      id: "contact-center",
      name: "Contact Center View",
      cardTitle: "Contact Center",
      description: "Streamline around inbox, appointments, contacts, reputation, and reporting.",
      bestFor: "Best for teams living in messages, calls, and appointments.",
      keepsLine: "Keeps Inbox, Appointments, Contacts, Reputation, and Reporting.",
      accentColor: "#ea580c",
      accentSoft: "#ffedd5",
      accentBorder: "#fdba74",
      iconId: "contact-center",
      sidebarStyle: {
        stylePath: "custom",
        enabled: true,
        backgroundType: "solid",
        backgroundColor: "#4a2a12",
        textColor: "#fff7ed",
        activeBackgroundColor: "#c2410c",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#5b3416"
      },
      visibleItems: ["dashboard", "conversations", "calendars", "contacts", "reputation", "reporting", "settings"],
      labelOverrides: {
        conversations: "Inbox",
        calendars: "Appointments"
      }
    },
    {
      id: "simple",
      name: "Simple View",
      cardTitle: "Start Simple",
      description: "Start with a quiet sidebar for common day-to-day work.",
      bestFor: "Best for a calm, everyday workspace with fewer distractions.",
      keepsLine: "Keeps Inbox, Calendar, Contacts, Pipeline, and Reporting.",
      accentColor: "#475569",
      accentSoft: "#e2e8f0",
      accentBorder: "#cbd5e1",
      iconId: "simple",
      sidebarStyle: {
        stylePath: "custom",
        enabled: true,
        backgroundType: "solid",
        backgroundColor: "#1f2937",
        textColor: "#f8fafc",
        activeBackgroundColor: "#475569",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#334155"
      },
      visibleItems: ["dashboard", "conversations", "calendars", "contacts", "opportunities", "reporting", "settings"],
      labelOverrides: {
        conversations: "Inbox"
      }
    }
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
    { value: "stretch", label: "Stretch" },
    { value: "tile", label: "Tile" },
    { value: "center", label: "Center" }
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
    { key: "backgroundImageFit", label: "Fit", type: "select", options: backgroundImageFitOptions, mode: "image" },
    { key: "imageSettings.positionX", label: "Position X", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { key: "imageSettings.positionY", label: "Position Y", type: "range", min: "0", max: "100", step: "1", mode: "image" },
    { key: "imageSettings.scale", label: "Zoom", type: "range", min: "0.5", max: "2.5", step: "0.05", mode: "image" },
    { key: "resetImagePosition", label: "Position", type: "image-reset", mode: "image" },
    { key: "backgroundImageBaseColor", label: "Base Background Color", type: "color", mode: "image", helpText: "Shows behind contained, smaller, or transparent images." },
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

  function setReloadGhlActionState(tabId, visible) {
    reloadGhlTabTargetId = visible && tabId ? tabId : null;
    if (reloadGhlTabButton) {
      reloadGhlTabButton.hidden = !visible || !tabId;
    }
  }

  function setStatus(message, isError, options) {
    var statusOptions = options || {};

    statusMessage.textContent = message;
    statusMessage.className = isError ? "status error" : "status";
    setReloadGhlActionState(statusOptions.reloadTabId, statusOptions.showReloadGhlAction === true);
  }

  function allPresets() {
    return storage.getAllPresets(state);
  }

  function isEditableProfile(preset) {
    return preset && preset.source !== "builtin" && preset.archived !== true;
  }

  function isTemplatePreset(preset) {
    return preset && preset.source === "builtin";
  }

  function isBlankTemplatePreset(preset) {
    return isTemplatePreset(preset) && preset.id === "builtin:blank";
  }

  function canEditSelectedPreset(preset) {
    return Boolean(preset) && preset.archived !== true;
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
    var baseMetadata = null;

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

    if (preset && isTemplatePreset(preset) && !isBlankTemplatePreset(preset)) {
      baseMetadata = Object.assign({}, preset.profileMetadata || {}, {
        basedOnTemplateId: preset.id
      });
    } else {
      baseMetadata = preset && preset.profileMetadata ? Object.assign({}, preset.profileMetadata) : null;
    }

    return storage.normalizePreset({
      id: namespace.createId("custom"),
      name: isBlankTemplatePreset(preset) ? "My CleanView" : profileNameFromTemplate(preset),
      description: isBlankTemplatePreset(preset) ? "" : preset.description || "",
      visibleItems: preset.visibleItems || [],
      labelOverrides: preset.labelOverrides || {},
      customLinks: preset.customLinks || [],
      sidebarStyle: preset.sidebarStyle || namespace.defaultSidebarStyle,
      profileMetadata: baseMetadata
    });
  }

  function primarySaveLabel(preset) {
    return isCustomPreset(preset) ? "Save Changes" : "Save as New Profile";
  }

  function editableNoticeText(preset) {
    if (isBlankTemplatePreset(preset)) {
      return "You are editing a blank draft. Save it as a new profile when you are ready.";
    }

    if (isTemplatePreset(preset)) {
      return "You are editing a draft based on this template. Saving will create a new custom profile.";
    }

    return "";
  }

  function saveHintText() {
    return isCustomPreset(selectedPreset()) ? "Save Changes to keep it." : "Save as New Profile to keep it.";
  }

  function loadPresetIntoEditor(presetId, nameOverride) {
    selectedPresetId = presetId;
    render();
    if (presetName && nameOverride) {
      presetName.value = String(nameOverride || "").trim() || presetName.value;
    }
    resetDirtyStateFromRenderedDraft();
  }

  function getActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function handleTabs(tabs) {
      callback(chrome.runtime.lastError || !tabs || !tabs[0] ? null : tabs[0]);
    });
  }

  function isGhlUrl(url) {
    try {
      var parsed = new URL(url || "");
      return parsed.protocol === "https:" && namespace.isAllowedHost(parsed.hostname);
    } catch (_error) {
      return false;
    }
  }

  function getTargetGhlTab(callback) {
    getActiveTab(function handleActiveTab(tab) {
      if (tab && tab.id && isGhlUrl(tab.url)) {
        callback(tab);
        return;
      }

      chrome.tabs.query({
        currentWindow: true,
        url: ["https://app.gohighlevel.com/*", "https://*.leadconnectorhq.com/*"]
      }, function handleGhlTabs(tabs) {
        if (chrome.runtime.lastError || !tabs || tabs.length !== 1) {
          callback(null, tab, tabs || []);
          return;
        }
        callback(tabs[0], tab, tabs);
      });
    });
  }

  function sendToContentScript(message, callback) {
    getTargetGhlTab(function handleActiveTab(tab, activeTab, ghlTabs) {
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
          callback({
            ok: false,
            error: "Content script not reachable. Reload the GHL page and try again.",
            contentScriptUnreachable: true,
            targetTabId: tab.id,
            lastErrorMessage: chrome.runtime.lastError.message || ""
          });
          return;
        }
        callback(Object.assign({ targetTabId: tab.id }, response || { ok: false, error: "No response from page." }));
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

  function hasEditableProfiles(nextState) {
    return editableProfileIds(nextState || state).length > 0;
  }

  function getStarterViewById(starterId) {
    var selectedStarter = null;

    starterViews.some(function findStarter(starter) {
      if (starter.id === starterId) {
        selectedStarter = starter;
        return true;
      }
      return false;
    });

    return selectedStarter;
  }

  function starterVisibleKeys(starter) {
    return normalizeMenuKeyList(starter && starter.visibleItems || []);
  }

  function starterHiddenKeys(starter) {
    var visibleSet = new Set(starterVisibleKeys(starter));

    return allMenuKeys.filter(function keepHiddenStarterItem(key) {
      return !visibleSet.has(key);
    });
  }

  function starterIconSvg(iconId) {
    if (iconId === "sales") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"></circle><path d="M15.5 8.5 20 4"></path><path d="m16.4 4 3.6.1-.1 3.6"></path></svg>';
    }
    if (iconId === "marketing") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13.5V10c0-1 .8-1.8 1.8-1.8H8l7-3.2v13.9L8 15.8H5.8c-1 0-1.8-.8-1.8-1.8Z"></path><path d="M8 15.8 9.5 20"></path><path d="M18.5 8.5c1.1.8 1.8 2.1 1.8 3.5s-.7 2.7-1.8 3.5"></path></svg>';
    }
    if (iconId === "ai-operator") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="3"></rect><path d="M9 9h.01"></path><path d="M15 9h.01"></path><path d="M8.5 13.5c1 .9 2.2 1.4 3.5 1.4s2.5-.5 3.5-1.4"></path><path d="M12 3v3"></path><path d="M12 18v3"></path></svg>';
    }
    if (iconId === "contact-center") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 13a7.5 7.5 0 1 1 15 0"></path><path d="M5 13h1.5c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5H5.7A1.7 1.7 0 0 1 4 17.3v-2.6A1.7 1.7 0 0 1 5.7 13Z"></path><path d="M17.5 13H19a1.7 1.7 0 0 1 1.7 1.7v2.6A1.7 1.7 0 0 1 19 19h-.8c-.8 0-1.5-.7-1.5-1.5v-3c0-.8.7-1.5 1.5-1.5Z"></path><path d="M12 19v1.5"></path></svg>';
    }

    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.4"></rect><rect x="14" y="4" width="6" height="6" rx="1.4"></rect><rect x="4" y="14" width="6" height="6" rx="1.4"></rect><rect x="14" y="14" width="6" height="6" rx="1.4"></rect></svg>';
  }

  function setStarterTheme(surface, starter) {
    if (!surface) {
      return;
    }

    if (!starter) {
      delete surface.dataset.starterThemed;
      surface.style.removeProperty("--starter-accent");
      surface.style.removeProperty("--starter-accent-soft");
      surface.style.removeProperty("--starter-accent-border");
      return;
    }

    surface.dataset.starterThemed = "true";
    surface.style.setProperty("--starter-accent", starter.accentColor || "#2563eb");
    surface.style.setProperty("--starter-accent-soft", starter.accentSoft || "#dbeafe");
    surface.style.setProperty("--starter-accent-border", starter.accentBorder || starter.accentColor || "#93c5fd");
  }

  function starterThemeFromPreset(preset) {
    var metadata = preset && preset.profileMetadata || {};
    var starter = metadata.onboardingStarterViewId ? getStarterViewById(metadata.onboardingStarterViewId) : null;
    var style = storage.normalizeSidebarStyle(preset && preset.sidebarStyle || {});
    var backgroundColor = normalizeHexColor(metadata.sidebarBackgroundColor || style.backgroundColor || (starter && starter.accentColor) || "#2563eb", "#2563eb");
    var accentColor = normalizeHexColor(metadata.accentColor || backgroundColor, backgroundColor);
    var accentBorder = normalizeHexColor(metadata.accentBorder || style.activeBackgroundColor || accentColor, accentColor);

    if (!starter && !metadata.iconId && !metadata.onboardingStarterViewName) {
      return null;
    }

    return Object.assign({}, starter || {}, {
      id: metadata.sourceTemplateId || metadata.onboardingStarterViewId || (starter && starter.id) || "",
      name: metadata.onboardingStarterViewName || (starter && starter.name) || preset && (preset.name || preset.label) || "Starter View",
      cardTitle: metadata.onboardingStarterViewName || (starter && starter.cardTitle) || (starter && starter.name) || "Starter View",
      iconId: metadata.iconId || (starter && starter.iconId) || "simple",
      accentColor: accentColor,
      accentSoft: getOverlayRgba(backgroundColor, 0.12),
      accentBorder: accentBorder,
      bestFor: metadata.bestFor || (starter && starter.bestFor) || "",
      keepsLine: metadata.keepsLine || (starter && starter.keepsLine) || ""
    });
  }

  function renderStarterBadge(badge, surface, starter, metaElement, metaText) {
    if (!badge) {
      return;
    }

    setStarterTheme(surface, starter);

    if (!starter) {
      badge.hidden = true;
      badge.innerHTML = "";
      if (metaElement) {
        metaElement.hidden = true;
        metaElement.textContent = "";
      }
      return;
    }

    badge.innerHTML = '<span class="starter-context-icon">' + starterIconSvg(starter.iconId) + '</span><span>' + (starter.cardTitle || starter.name) + "</span>";
    badge.hidden = false;

    if (metaElement) {
      metaElement.textContent = metaText || starter.bestFor || "";
      metaElement.hidden = !metaElement.textContent;
    }
  }

  function starterViewFromPreset(preset) {
    return starterThemeFromPreset(preset);
  }

  function fallbackMenuLabel(key) {
    return String(key || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, function uppercaseFirstLetter(letter) {
        return letter.toUpperCase();
      });
  }

  function starterMenuLabel(key, starter) {
    var overrides = starter && starter.labelOverrides || {};
    var entry = registry[key];

    return overrides[key] || (entry && entry.label) || fallbackMenuLabel(key);
  }

  function renderStarterItemList(container, keys, starter, emptyText) {
    if (!container) {
      return;
    }

    container.innerHTML = "";
    if (!keys.length) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }

    keys.forEach(function renderStarterItem(key) {
      var item = document.createElement("span");
      item.className = "starter-item-chip";
      item.textContent = starterMenuLabel(key, starter);
      container.appendChild(item);
    });
  }

  function starterDraftVisibleKeys() {
    return normalizeMenuKeyList(onboardingDraftPreset && onboardingDraftPreset.visibleItems || []);
  }

  function starterDraftHiddenKeys() {
    var visibleSet = new Set(starterDraftVisibleKeys());

    return allMenuKeys.filter(function keepHiddenStarterDraftItem(key) {
      return !visibleSet.has(key);
    });
  }

  function starterDraftColor(starter) {
    var style = storage.normalizeSidebarStyle(onboardingDraftPreset && onboardingDraftPreset.sidebarStyle || starter && starter.sidebarStyle || {});

    return normalizeHexColor(style.backgroundColor || starter && starter.sidebarStyle && starter.sidebarStyle.backgroundColor || starter && starter.accentColor || "#123a5c", "#123a5c");
  }

  function defaultStarterProfileName(starter) {
    return String(starter && starter.name || "My CleanView").trim() || "My CleanView";
  }

  function resolvedStarterProfileName(starter, value) {
    return String(value || "").trim() || defaultStarterProfileName(starter);
  }

  function starterDraftName(starter) {
    return resolvedStarterProfileName(starter, onboardingDraftPreset && onboardingDraftPreset.name);
  }

  function normalizeStarterTextColorMode(value) {
    return ["auto", "light", "dark"].indexOf(String(value || "").toLowerCase()) !== -1 ? String(value || "").toLowerCase() : "auto";
  }

  function starterDraftTextColorMode() {
    return normalizeStarterTextColorMode(onboardingDraftPreset && onboardingDraftPreset.profileMetadata && onboardingDraftPreset.profileMetadata.onboardingMenuTextColorMode);
  }

  function parseHexColorChannels(color) {
    var normalized = normalizeHexColor(color, "#000000").replace("#", "");

    return {
      red: parseInt(normalized.slice(0, 2), 16),
      green: parseInt(normalized.slice(2, 4), 16),
      blue: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function relativeLuminanceChannel(channel) {
    var normalized = channel / 255;

    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  }

  function isLightStarterColor(color) {
    var channels = parseHexColorChannels(color);
    var luminance = 0.2126 * relativeLuminanceChannel(channels.red) + 0.7152 * relativeLuminanceChannel(channels.green) + 0.0722 * relativeLuminanceChannel(channels.blue);

    return luminance >= 0.62;
  }

  function resolveStarterMenuTextColor(backgroundColor, textMode) {
    var normalizedMode = normalizeStarterTextColorMode(textMode);

    if (normalizedMode === "light") {
      return "#f8fafc";
    }
    if (normalizedMode === "dark") {
      return "#0f172a";
    }

    return isLightStarterColor(backgroundColor) ? "#0f172a" : "#f8fafc";
  }

  function starterColorPresetForColor(color) {
    var normalizedColor = normalizeHexColor(color, "#123a5c");

    return starterSidebarColorPresets.find(function findMatchingStarterColorPreset(preset) {
      return preset.color && normalizeHexColor(preset.color, "") === normalizedColor;
    }) || starterSidebarColorPresets.find(function findCustomStarterColorPreset(preset) {
      return preset.id === "custom";
    }) || null;
  }

  function starterColorLabel(color) {
    var normalizedColor = normalizeHexColor(color, "#123a5c");
    var preset = starterColorPresetForColor(normalizedColor);

    if (!preset || preset.id === "custom") {
      return normalizedColor || "Custom";
    }

    return preset.label || normalizedColor;
  }

  function starterTextColorModeLabel(value) {
    var normalizedMode = normalizeStarterTextColorMode(value);

    if (normalizedMode === "light") {
      return "Light";
    }
    if (normalizedMode === "dark") {
      return "Dark";
    }

    return "Auto";
  }

  function buildStarterSuccessSummaryRows(rows) {
    var fragment = document.createDocumentFragment();

    rows.forEach(function renderStarterSummaryRow(row) {
      var wrapper = document.createElement("div");
      var label = document.createElement("span");
      var value = document.createElement("span");

      wrapper.className = "starter-summary-row";
      label.className = "starter-summary-label";
      value.className = "starter-summary-value";
      label.textContent = row.label;
      value.textContent = row.value;
      wrapper.appendChild(label);
      wrapper.appendChild(value);
      fragment.appendChild(wrapper);
    });

    return fragment;
  }

  function buildStarterDraft(starter, draftOverrides) {
    var sourceStyle = Object.assign({}, namespace.defaultSidebarStyle || {}, starter && starter.sidebarStyle || {}, draftOverrides && draftOverrides.sidebarStyle || {});
    var sidebarStyle = storage.normalizeSidebarStyle(Object.assign(sourceStyle, {
      enabled: true,
      stylePath: "custom",
      backgroundType: "solid",
      backgroundAssetId: "",
      customImageDataUrl: "",
      gradientStartColor: "",
      gradientEndColor: "",
      backgroundImageUrl: "",
      curatedShuffle: Object.assign({}, sourceStyle.curatedShuffle || {}, { enabled: false })
    }));
    var visibleItems = normalizeMenuKeyList(draftOverrides && draftOverrides.visibleItems || starter && starter.visibleItems || []);
    var metadata = Object.assign({}, draftOverrides && draftOverrides.profileMetadata || {}, {
      onboardingStarterViewId: starter.id,
      onboardingStarterViewName: starter.name,
      createdFromFirstRun: true,
      sourceTemplateId: starter.sourceTemplateId || starter.id,
      accentColor: starter.accentColor || "",
      accentBorder: starter.accentBorder || starter.accentColor || "",
      iconId: starter.iconId || "",
      bestFor: starter.bestFor || "",
      keepsLine: starter.keepsLine || "",
      sidebarBackgroundColor: sidebarStyle.backgroundColor || ""
    });
    var normalizedBackgroundColor = normalizeHexColor(sidebarStyle.backgroundColor || starter && starter.sidebarStyle && starter.sidebarStyle.backgroundColor || starter && starter.accentColor || "#123a5c", "#123a5c");
    var textColorMode = normalizeStarterTextColorMode(metadata.onboardingMenuTextColorMode);
    var menuTextColor = resolveStarterMenuTextColor(normalizedBackgroundColor, textColorMode);

    sidebarStyle.backgroundColor = normalizedBackgroundColor;
    sidebarStyle.textColor = menuTextColor;
    sidebarStyle.iconColor = menuTextColor;
    metadata.sidebarBackgroundColor = normalizedBackgroundColor;
    metadata.onboardingMenuTextColorMode = textColorMode;
    metadata.onboardingMenuTextColor = menuTextColor;

    return storage.normalizePreset({
      id: draftOverrides && draftOverrides.id || namespace.createId("custom"),
      name: resolvedStarterProfileName(starter, draftOverrides && draftOverrides.name || starter && starter.name || "My CleanView"),
      description: starter.description,
      source: "custom",
      visibleItems: visibleItems,
      labelOverrides: Object.assign({}, starter.labelOverrides || {}),
      customLinks: [],
      menuGroups: [],
      sidebarStyle: sidebarStyle,
      profileMetadata: metadata,
      showInPopup: true,
      archived: false,
      updatedAt: namespace.nowIso()
    });
  }

  function ensureOnboardingDraft(starter) {
    if (!starter) {
      return null;
    }

    if (!onboardingDraftPreset || !onboardingDraftPreset.profileMetadata || onboardingDraftPreset.profileMetadata.onboardingStarterViewId !== starter.id) {
      onboardingDraftPreset = buildStarterDraft(starter);
    }

    return onboardingDraftPreset;
  }

  function setStarterDraftVisibleKeys(items) {
    var starter = getStarterViewById(selectedStarterViewId);

    if (!starter) {
      return;
    }

    onboardingDraftPreset = buildStarterDraft(starter, Object.assign({}, onboardingDraftPreset || {}, {
      name: starterDraftName(starter),
      visibleItems: normalizeMenuKeyList(items),
      sidebarStyle: onboardingDraftPreset && onboardingDraftPreset.sidebarStyle
    }));
  }

  function updateStarterDraftName(name) {
    var starter = getStarterViewById(selectedStarterViewId);
    var nextName = resolvedStarterProfileName(starter, name);

    if (!starter) {
      return;
    }

    onboardingDraftPreset = buildStarterDraft(starter, Object.assign({}, onboardingDraftPreset || {}, {
      name: nextName,
      sidebarStyle: onboardingDraftPreset && onboardingDraftPreset.sidebarStyle,
      visibleItems: starterDraftVisibleKeys(),
      profileMetadata: onboardingDraftPreset && onboardingDraftPreset.profileMetadata
    }));
  }

  function updateStarterDraftColor(color) {
    var starter = getStarterViewById(selectedStarterViewId);
    var normalizedColor = normalizeHexColor(color, starterDraftColor(starter));
    var nextStyle = storage.normalizeSidebarStyle(Object.assign({}, onboardingDraftPreset && onboardingDraftPreset.sidebarStyle || starter && starter.sidebarStyle || {}, {
      enabled: true,
      stylePath: "custom",
      backgroundType: "solid",
      backgroundColor: normalizedColor,
      backgroundAssetId: "",
      customImageDataUrl: "",
      gradientStartColor: "",
      gradientEndColor: "",
      backgroundImageUrl: ""
    }));

    if (!starter) {
      return;
    }

    onboardingDraftPreset = buildStarterDraft(starter, Object.assign({}, onboardingDraftPreset || {}, {
      name: starterDraftName(starter),
      sidebarStyle: nextStyle,
      visibleItems: starterDraftVisibleKeys()
    }));
  }

  function updateStarterDraftTextColorMode(mode) {
    var starter = getStarterViewById(selectedStarterViewId);
    var normalizedMode = normalizeStarterTextColorMode(mode);

    if (!starter) {
      return;
    }

    onboardingDraftPreset = buildStarterDraft(starter, Object.assign({}, onboardingDraftPreset || {}, {
      name: starterDraftName(starter),
      sidebarStyle: Object.assign({}, onboardingDraftPreset && onboardingDraftPreset.sidebarStyle || starter.sidebarStyle || {}),
      visibleItems: starterDraftVisibleKeys(),
      profileMetadata: Object.assign({}, onboardingDraftPreset && onboardingDraftPreset.profileMetadata || {}, {
        onboardingMenuTextColorMode: normalizedMode
      })
    }));
  }

  function applyOnboardingDraftPreview() {
    var starter = getStarterViewById(selectedStarterViewId);
    var draft = ensureOnboardingDraft(starter);

    if (!starter || !draft) {
      return;
    }

    sendToContentScript({ type: "previewPreset", preset: draft }, function handlePreviewApplied(result) {
      if (!result || !result.ok) {
        if (starterPreviewHelper) {
          starterPreviewHelper.textContent = "Previewing " + (starter && starter.name || "Starter") + ". This has not been saved yet.";
        }
        setStatus(result && result.contentScriptUnreachable ? "Preview is queued while GHL finishes loading. Reload the tab if it does not appear." : "Previewing " + (starter && starter.name || "Starter") + ". This has not been saved yet.", result && result.contentScriptUnreachable, result && result.contentScriptUnreachable ? {
          showReloadGhlAction: true,
          reloadTabId: result.targetTabId
        } : undefined);
        return;
      }

      if (starterPreviewHelper) {
        starterPreviewHelper.textContent = "Previewing " + starter.name + ". This has not been saved yet.";
      }
      setStatus("Previewing " + starter.name + ". This has not been saved yet.");
    });
  }

  function renderStarterMenuChip(key, isVisible) {
    var starter = getStarterViewById(selectedStarterViewId);
    var chip = document.createElement("div");
    var label = document.createElement("span");
    var button = document.createElement("button");

    chip.className = "menu-group-chip starter-menu-chip";
    chip.draggable = true;
    chip.tabIndex = 0;
    chip.dataset.starterMenuKey = key;
    label.textContent = starterMenuLabel(key, starter);
    button.type = "button";
    button.className = "menu-group-chip-remove";
    button.textContent = isVisible ? "Hide" : "Show";
    button.dataset.starterMenuToggle = key;
    button.dataset.starterMenuVisible = isVisible ? "false" : "true";
    chip.appendChild(label);
    chip.appendChild(button);
    return chip;
  }

  function renderStarterMenuCustomizer(starter) {
    var visibleKeys = starterDraftVisibleKeys();
    var hiddenKeys = starterDraftHiddenKeys();

    if (starterPreviewShownList) {
      starterPreviewShownList.innerHTML = "";
      visibleKeys.forEach(function renderVisibleStarterItem(key) {
        starterPreviewShownList.appendChild(renderStarterMenuChip(key, true));
      });
    }

    if (starterPreviewHiddenList) {
      starterPreviewHiddenList.innerHTML = "";
      hiddenKeys.forEach(function renderHiddenStarterItem(key) {
        starterPreviewHiddenList.appendChild(renderStarterMenuChip(key, false));
      });
    }

    if (starterPreviewHelper) {
      starterPreviewHelper.textContent = "Previewing " + starter.name + ". This has not been saved yet.";
    }
  }

  function renderStarterColorGrid(starter) {
    var currentColor = starterDraftColor(starter);
    var activePreset = starterColorPresetForColor(currentColor);
    var currentTextMode = starterDraftTextColorMode();

    if (starterColorPresetList) {
      starterColorPresetList.innerHTML = "";
      starterSidebarColorPresets.forEach(function renderColorPreset(preset) {
      var swatch = document.createElement("button");
      var swatchDot = document.createElement("span");
      var label = document.createElement("span");
      var presetColor = preset.color ? normalizeHexColor(preset.color, currentColor) : currentColor;

      swatch.type = "button";
      swatch.className = "starter-color-option";
      if (activePreset && preset.id === activePreset.id) {
        swatch.className += " is-selected";
      }
      swatch.dataset.starterColorPreset = preset.id;
      swatch.dataset.starterColor = presetColor;
      swatchDot.className = "starter-color-option-swatch";
      swatchDot.style.setProperty("--starter-swatch-color", presetColor);
      label.className = "starter-color-option-label";
      label.textContent = preset.label;
      swatch.appendChild(swatchDot);
      swatch.appendChild(label);
      starterColorPresetList.appendChild(swatch);
      });
    }

    if (starterCustomColorPicker) {
      starterCustomColorPicker.value = currentColor;
    }
    if (starterCustomColorValue) {
      starterCustomColorValue.value = currentColor;
    }
    if (starterTextColorMode) {
      starterTextColorMode.value = currentTextMode;
    }
  }

  function renderStarterChooser() {
    if (!starterViewGrid) {
      return;
    }

    starterViewGrid.innerHTML = "";
    starterViews.forEach(function renderStarterCard(starter) {
      var card = document.createElement("button");
      var hero = document.createElement("span");
      var icon = document.createElement("span");
      var copy = document.createElement("span");
      var title = document.createElement("span");
      var description = document.createElement("span");
      var meta = document.createElement("span");
      var keeps = document.createElement("span");
      var count = document.createElement("span");
      var selectedBadge = document.createElement("span");
      var isSelected = starter.id === selectedStarterViewId;

      card.type = "button";
      card.className = "starter-view-card";
      if (isSelected) {
        card.className += " is-selected";
      }
      card.setAttribute("aria-pressed", isSelected ? "true" : "false");
      card.dataset.starterViewId = starter.id;
      card.style.setProperty("--starter-accent", starter.accentColor || "#2563eb");
      card.style.setProperty("--starter-accent-soft", starter.accentSoft || "#dbeafe");
      card.style.setProperty("--starter-accent-border", starter.accentBorder || starter.accentColor || "#93c5fd");
      hero.className = "starter-card-hero";
      icon.className = "starter-card-icon";
      icon.innerHTML = starterIconSvg(starter.iconId);
      copy.className = "starter-card-copy";
      title.className = "starter-card-title";
      title.textContent = starter.cardTitle || starter.name;
      description.className = "starter-card-description";
      description.textContent = starter.description;
      meta.className = "starter-card-meta";
      meta.textContent = starter.bestFor || "";
      keeps.className = "starter-card-keeps";
      keeps.textContent = starter.keepsLine || "";
      count.className = "starter-card-count";
      count.textContent = starterVisibleKeys(starter).length + " shown / " + starterHiddenKeys(starter).length + " hidden";
      selectedBadge.className = "starter-card-selected-badge";
      selectedBadge.textContent = "Selected";
      selectedBadge.hidden = !isSelected;

      copy.appendChild(title);
      copy.appendChild(meta);
      hero.appendChild(icon);
      hero.appendChild(copy);
      card.appendChild(selectedBadge);
      card.appendChild(hero);
      card.appendChild(description);
      card.appendChild(keeps);
      card.appendChild(count);
      starterViewGrid.appendChild(card);
    });
  }

  function renderStarterPreview(starter) {
    if (!starter) {
      return;
    }

    ensureOnboardingDraft(starter);
    if (starterPreviewTitle) {
      starterPreviewTitle.textContent = starter.name;
    }
    if (starterPreviewDescription) {
      starterPreviewDescription.textContent = starter.description;
    }
    renderStarterBadge(starterPreviewBadge, starterPreviewPanel, starter, starterPreviewMeta, starter.keepsLine || starter.bestFor);
    renderStarterMenuCustomizer(starter);
    renderStarterColorGrid(starter);
    if (starterViewNameInput) {
      starterViewNameInput.value = starterDraftName(starter);
    }
  }

  function renderStarterSuccess(starter) {
    var preset = selectedPreset();
    var metadata = preset && preset.profileMetadata || {};
    var profileName = preset && (preset.name || preset.label) || "My CleanView";
    var visibleCount = preset && Array.isArray(preset.visibleItems) ? preset.visibleItems.length : starter ? starterVisibleKeys(starter).length : 0;
    var hiddenCount = Math.max(0, allMenuKeys.length - visibleCount);
    var sidebarColor = starterColorLabel(metadata.sidebarBackgroundColor || preset && preset.sidebarStyle && preset.sidebarStyle.backgroundColor || "");
    var textColorMode = starterTextColorModeLabel(metadata.onboardingMenuTextColorMode);
    var starterName = metadata.onboardingStarterViewName || starter && starter.name || "Starter";

    if (!preset) {
      return;
    }

    if (starterSuccessTitle) {
      starterSuccessTitle.textContent = "Your CleanView is ready";
    }
    if (starterSuccessMessage) {
      starterSuccessMessage.textContent = "Your GHL sidebar has been simplified and saved as:";
    }
    if (starterSuccessProfileName) {
      starterSuccessProfileName.textContent = '"' + profileName + '"';
    }
    renderStarterBadge(starterSuccessBadge, starterSuccessPanel, starter, starterSuccessMeta, starterApplyMessage || "Quick setup is complete. You can add more later.");

    if (starterSuccessWhatHappened) {
      starterSuccessWhatHappened.innerHTML = "";
      starterSuccessWhatHappened.appendChild(buildStarterSuccessSummaryRows([
        { label: "Starter used", value: starterName },
        { label: "Menu items shown", value: String(visibleCount) },
        { label: "Menu items hidden", value: String(hiddenCount) },
        { label: "Sidebar color", value: sidebarColor || "Custom" },
        { label: "Menu text color", value: textColorMode || "Auto" }
      ]));
    }

    if (starterSuccessSkipped) {
      starterSuccessSkipped.innerHTML = "";
      starterSuccessSkipped.appendChild(buildStarterSuccessSummaryRows([
        { label: "Logo", value: "Not added" },
        { label: "Menu groups", value: "Not added" },
        { label: "Style gradient", value: "Not added" },
        { label: "Image upload", value: "Not added" },
        { label: "Quick links", value: "0 configured" },
        { label: "Deep links", value: "0 configured" }
      ]));
    }
  }

  function renderStarterChooserBackButton() {
    if (!starterChooserBackButton) {
      return;
    }

    starterChooserBackButton.hidden = starterFlowSource !== "profiles";
  }

  function renderOnboardingPanels() {
    var starter = getStarterViewById(selectedStarterViewId) || starterViews[0];

    if (starterChooserPanel) {
      starterChooserPanel.hidden = onboardingMode !== "chooser";
    }
    if (starterPreviewPanel) {
      starterPreviewPanel.hidden = onboardingMode !== "preview";
    }
    if (starterSuccessPanel) {
      starterSuccessPanel.hidden = onboardingMode !== "success";
    }

    renderStarterChooserBackButton();
    renderStarterChooser();
    if (onboardingMode === "preview") {
      renderStarterPreview(starter);
    } else if (onboardingMode === "success") {
      renderStarterSuccess(starter);
    }
  }

  function renderActiveViewOverview() {
    var preset = selectedPreset();
    var starter = starterViewFromPreset(preset);
    var viewName = preset ? preset.name || preset.label || "CleanView" : "Active View";
    var enabledText = state && state.enabled === false ? "CleanView is off." : "CleanView is on.";

    if (activeViewName) {
      activeViewName.textContent = viewName;
    }
    if (activeViewStatus) {
      activeViewStatus.textContent = enabledText + " Apply Live to GHL when you want to refresh the open page.";
    }
    renderStarterBadge(
      activeViewBadge,
      activeViewOverviewPanel,
      starter,
      activeViewMeta,
      starter ? "Based on the " + (starter.cardTitle || starter.name) + " starter view." : ""
    );
  }

  function setOnboardingMode(mode, starterId) {
    onboardingMode = mode || "";
    postCreationMenuOnlyMode = false;
    if (onboardingMode) {
      clearDirtyState();
      if (!starterFlowSource) {
        starterFlowSource = hasEditableProfiles(state) ? "profiles" : "first_run";
      }
    }
    if (starterId) {
      if (starterId !== selectedStarterViewId) {
        onboardingDraftPreset = null;
      }
      selectedStarterViewId = starterId;
    }
    render();
  }

  function openProfilesView(statusText) {
    onboardingMode = "";
    postCreationMenuOnlyMode = false;
    starterFlowSource = "profiles";
    render();
    if (presetSelect) {
      presetSelect.scrollIntoView({ block: "nearest" });
      presetSelect.focus();
    }
    if (statusText) {
      setStatus(statusText);
    }
  }

  function renderBuilderVisibility() {
    if (selectedPresetId && !storage.getPresetById(state, selectedPresetId)) {
      selectedPresetId = resolveInitialProfileId(state);
    }
    var showOnboarding = Boolean(onboardingMode) || !hasEditableProfiles(state);
    if (showOnboarding && !onboardingMode) {
      onboardingMode = "chooser";
      starterFlowSource = "first_run";
    }
    if (firstTimeProfileOnboarding) {
      firstTimeProfileOnboarding.hidden = !showOnboarding;
    }
    if (activeViewOverviewPanel) {
      activeViewOverviewPanel.hidden = showOnboarding || !selectedPresetId || postCreationMenuOnlyMode;
    }
    if (profileManagementPanel) {
      profileManagementPanel.hidden = showOnboarding || postCreationMenuOnlyMode;
    }
    if (builderPanel) {
      builderPanel.hidden = showOnboarding ? true : false;
    }
    if (postCreationMenuActions) {
      postCreationMenuActions.hidden = showOnboarding || !postCreationMenuOnlyMode;
    }
    if (showOnboarding) {
      if (stickySaveBar) {
        stickySaveBar.hidden = true;
      }
      renderOnboardingPanels();
    } else {
      renderActiveViewOverview();
    }
    return showOnboarding;
  }

  function renderPresetSelects() {
    fillPresetSelect(presetSelect, selectedPresetId);
    fillPresetSelect(defaultPresetSelect, state.activePresetId || "builtin:simple");
  }

  function renderTabState() {
    document.querySelectorAll("[data-tab-button]").forEach(function renderButton(button) {
      var shouldHideForMenuOnly = postCreationMenuOnlyMode && button.dataset.tabButton !== "menu";
      var shouldHideForLocationDefaults = button.dataset.locationDefaultsUi !== undefined && !enableLocationViewDefaults;

      button.hidden = shouldHideForMenuOnly || shouldHideForLocationDefaults;
      button.classList.toggle("active", button.dataset.tabButton === activeTab);
    });
    document.querySelectorAll("[data-tab-panel]").forEach(function renderPanel(panel) {
      var shouldHideForMenuOnly = postCreationMenuOnlyMode && panel.dataset.tabPanel !== "menu";
      var shouldHideForLocationDefaults = panel.dataset.locationDefaultsUi !== undefined && !enableLocationViewDefaults;

      panel.classList.toggle("active", panel.dataset.tabPanel === activeTab);
      panel.hidden = shouldHideForMenuOnly || shouldHideForLocationDefaults;
    });
  }

  function renderHeader() {
    var preset = selectedPreset();
    var canEdit = canEditSelectedPreset(preset);
    var isEditable = isCustomPreset(preset);
    var displayPreset = isEditable ? preset : selectedEditablePreset();
    var templateButton = createProfileFromTemplateButton;

    if (!preset) {
      return;
    }

    presetName.value = displayPreset.name || displayPreset.label || "";
    presetDescription.value = displayPreset.description || "";
    showInPopupToggle.checked = displayPreset.showInPopup !== false;
    presetName.disabled = !canEdit;
    presetDescription.disabled = !canEdit;
    showInPopupToggle.disabled = !canEdit;
    document.getElementById("deletePresetButton").disabled = !isEditable;
    builtInNotice.textContent = editableNoticeText(preset);
    document.getElementById("savePresetButton").textContent = primarySaveLabel(preset);
    document.getElementById("savePresetButton").hidden = true;
    if (saveAsCopyButton) {
      saveAsCopyButton.hidden = true;
      saveAsCopyButton.disabled = !isEditable;
    }
    if (templateNotice) {
      templateNotice.hidden = !isTemplatePreset(preset);
    }
    if (templateButton) {
      templateButton.hidden = !isTemplatePreset(preset);
    }
  }

  function renderPostCreationMenuOnlyState() {
    if (menuBuilderDescription) {
      menuBuilderDescription.textContent = postCreationMenuOnlyMode ?
        "Choose which GoHighLevel menu items appear in your sidebar and drag them into the order you want." :
        "Choose which GoHighLevel menu items appear in your sidebar, then organize them into simple groups. Quick Links stay separate.";
    }
    if (addMenuGroupButton) {
      addMenuGroupButton.hidden = postCreationMenuOnlyMode;
    }
  }

  function renderMenuEditor() {
    var visibleSet = new Set(visibleMenuKeysFromEditor());
    var hiddenKeys = allMenuKeys.filter(function keepHidden(key) {
      return !visibleSet.has(key);
    });

    menuEditor.innerHTML = "";

    if (!hiddenKeys.length) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = "All native menu items are in your sidebar.";
      menuEditor.appendChild(empty);
      return;
    }

    hiddenKeys.forEach(function renderAvailableItem(key) {
      menuEditor.appendChild(renderMenuGroupChip(key, {
        available: true,
        groupId: "available"
      }));
    });
  }

  function menuLabel(key) {
    var entry = registry[key];
    var preset = selectedPreset();
    var override = preset && preset.labelOverrides ? preset.labelOverrides[key] : "";

    return override || (entry ? entry.label : key);
  }

  function visibleMenuKeysFromEditor() {
    var preset = selectedPreset();

    if (menuGroupEditor && menuGroupEditor.dataset.visibleMenuItems !== undefined) {
      return normalizeMenuKeyList(String(menuGroupEditor.dataset.visibleMenuItems || "").split(","));
    }

    return normalizeMenuKeyList((preset && preset.visibleItems) || []);
  }

  function normalizeMenuKeyList(items) {
    var seen = {};
    var normalizedItems = [];

    (items || []).forEach(function markMenuKey(key) {
      if (allMenuKeys.indexOf(key) !== -1 && !seen[key]) {
        seen[key] = true;
        normalizedItems.push(key);
      }
    });

    return normalizedItems;
  }

  function setVisibleMenuKeysInEditor(items) {
    if (!menuGroupEditor) {
      return;
    }

    menuGroupEditor.dataset.visibleMenuItems = normalizeMenuKeyList(items).join(",");
  }

  function setMenuKeyVisibleInEditor(key, isVisible) {
    var visibleItems = visibleMenuKeysFromEditor().filter(function keepOther(itemKey) {
      return itemKey !== key;
    });

    if (isVisible && allMenuKeys.indexOf(key) !== -1) {
      visibleItems.push(key);
    }

    setVisibleMenuKeysInEditor(visibleItems);
  }

  function menuGroupItemsFromCard(card) {
    return String(card.dataset.menuGroupItems || "").split(",").filter(function keepItem(key) {
      return allMenuKeys.indexOf(key) !== -1;
    });
  }

  function setMenuGroupItems(card, items) {
    var seen = {};
    card.dataset.menuGroupItems = (items || []).filter(function keepItem(key) {
      if (allMenuKeys.indexOf(key) === -1 || seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    }).join(",");
  }

  function assignedMenuKeysFromGroups(excludedCard) {
    var assigned = {};

    if (!menuGroupEditor) {
      return assigned;
    }

    menuGroupEditor.querySelectorAll("[data-menu-group-card='true']").forEach(function collectAssigned(card) {
      if (card === excludedCard) {
        return;
      }
      menuGroupItemsFromCard(card).forEach(function markAssigned(key) {
        assigned[key] = true;
      });
    });
    return assigned;
  }

  function renderMenuGroupAssignedItems(card) {
    var assignedList = card.querySelector("[data-menu-group-assigned]");
    var visibleSet = new Set(visibleMenuKeysFromEditor());
    var items = menuGroupItemsFromCard(card).filter(function keepVisibleAssigned(key) {
      return visibleSet.has(key);
    });

    assignedList.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "help-text";
      empty.textContent = "Drop menu items here.";
      assignedList.appendChild(empty);
      return;
    }

    items.forEach(function renderAssignedItem(key, index) {
      assignedList.appendChild(renderMenuGroupChip(key, {
        assigned: true,
        groupId: card.dataset.menuGroupId,
        index: index
      }));
    });
  }

  function refreshMenuGroupOptions() {
    var visibleKeys = visibleMenuKeysFromEditor();
    var ungroupedItems = [];

    if (!menuGroupEditor) {
      return;
    }

    menuGroupEditor.querySelectorAll("[data-menu-group-card='true']").forEach(function refreshGroup(card) {
      renderMenuGroupAssignedItems(card);
    });

    ungroupedItems = visibleKeys.filter(function keepUngrouped(key) {
      return !assignedMenuKeysFromGroups()[key];
    });
    renderUngroupedMenuItems(ungroupedItems);
    renderMenuEditor();
  }

  function renderUngroupedMenuItems(ungroupedItems) {
    var container = menuGroupEditor.querySelector("[data-ungrouped-menu-items]");

    if (!container) {
      return;
    }

    container.innerHTML = "";
    if (!ungroupedItems.length) {
      container.textContent = "Drop visible menu items here.";
      return;
    }
    ungroupedItems.forEach(function renderUngroupedItem(key) {
      container.appendChild(renderMenuGroupChip(key, {
        assigned: false,
        groupId: "ungrouped"
      }));
    });
  }

  function renderMenuGroupChip(key, options) {
    var chip = document.createElement("div");
    var label = document.createElement("span");
    var canEdit = canEditSelectedPreset(selectedPreset());

    options = options || {};
    chip.className = "menu-group-chip";
    chip.draggable = canEdit;
    chip.tabIndex = canEdit ? 0 : -1;
    chip.dataset.menuGroupDragKey = key;
    chip.dataset.menuKey = key;
    chip.dataset.menuGroupSource = options.groupId || "ungrouped";
    if (options.index !== undefined) {
      chip.dataset.menuGroupInsertIndex = String(options.index);
    }
    chip.title = canEdit ? "Drag to organize" : "";
    label.textContent = menuLabel(key);
    chip.appendChild(label);

    if (options.available) {
      chip.appendChild(createMenuGroupChipButton("Add", "addMenuItem", key, canEdit));
    } else if (options.assigned) {
      chip.appendChild(createMenuGroupChipButton("Remove from group", "removeGroupItem", key, canEdit));
      chip.appendChild(createMenuGroupChipButton("Hide", "hideMenuItem", key, canEdit));
    } else {
      chip.appendChild(createMenuGroupChipButton("Hide", "hideMenuItem", key, canEdit));
    }

    return chip;
  }

  function createMenuGroupChipButton(label, dataKey, key, canEdit) {
    var button = document.createElement("button");

    button.type = "button";
    button.className = "menu-group-chip-remove";
    button.textContent = label;
    button.dataset[dataKey] = key;
    button.disabled = !canEdit;
    return button;
  }

  function getMenuGroupDropTarget(eventTarget) {
    var chip = eventTarget && eventTarget.closest ? eventTarget.closest("[data-menu-group-drag-key]") : null;

    if (chip && chip.parentElement && chip.parentElement.dataset.menuGroupDropTarget) {
      return chip.parentElement;
    }

    return eventTarget && eventTarget.closest ? eventTarget.closest("[data-menu-group-drop-target]") : null;
  }

  function getMenuGroupInsertIndex(event, dropTarget) {
    var chip = event.target && event.target.closest ? event.target.closest("[data-menu-group-drag-key]") : null;
    var index = Number(chip && chip.dataset.menuGroupInsertIndex);
    var rect = chip && chip.getBoundingClientRect ? chip.getBoundingClientRect() : null;
    var afterMidpoint = rect && (event.clientY > rect.top + rect.height / 2 || event.clientX > rect.left + rect.width / 2);

    if (!chip || chip.parentElement !== dropTarget || Number.isNaN(index)) {
      return undefined;
    }

    return afterMidpoint ? index + 1 : index;
  }

  function clearMenuGroupDropState() {
    [menuEditor, menuGroupEditor].forEach(function clearContainer(container) {
      if (!container) {
        return;
      }
      container.querySelectorAll(".is-drop-target, .is-dragging").forEach(function clearState(element) {
        element.classList.remove("is-drop-target");
        element.classList.remove("is-dragging");
      });
      container.classList.remove("is-drop-target");
    });
  }

  function removeMenuKeyFromAllGroups(key) {
    menuGroupEditor.querySelectorAll("[data-menu-group-card='true']").forEach(function removeFromGroup(card) {
      setMenuGroupItems(card, menuGroupItemsFromCard(card).filter(function keepItem(itemKey) {
        return itemKey !== key;
      }));
    });
  }

  function moveMenuKeyToGroup(key, groupId, insertIndex) {
    var sourceCard = null;
    var sourceIndex = -1;
    var targetCard = null;
    var items = [];
    var nextIndex = Number(insertIndex);

    if (allMenuKeys.indexOf(key) === -1) {
      return;
    }

    Array.prototype.slice.call(menuGroupEditor.querySelectorAll("[data-menu-group-card='true']")).some(function findSource(card) {
      var cardItems = menuGroupItemsFromCard(card);

      sourceIndex = cardItems.indexOf(key);
      if (sourceIndex !== -1) {
        sourceCard = card;
        return true;
      }
      return false;
    });
    if (groupId === "available") {
      removeMenuKeyFromAllGroups(key);
      setMenuKeyVisibleInEditor(key, false);
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
      return;
    }

    setMenuKeyVisibleInEditor(key, true);
    removeMenuKeyFromAllGroups(key);
    if (!groupId || groupId === "ungrouped") {
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
      return;
    }

    targetCard = Array.prototype.slice.call(menuGroupEditor.querySelectorAll("[data-menu-group-card='true']")).find(function findCard(card) {
      return card.dataset.menuGroupId === groupId;
    });
    if (!targetCard) {
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
      return;
    }

    items = menuGroupItemsFromCard(targetCard);
    if (Number.isNaN(nextIndex) || nextIndex < 0 || nextIndex > items.length) {
      nextIndex = items.length;
    } else if (sourceCard === targetCard && sourceIndex !== -1 && sourceIndex < nextIndex) {
      nextIndex -= 1;
    }
    items.splice(nextIndex, 0, key);
    setMenuGroupItems(targetCard, items);
    refreshMenuGroupOptions();
    scheduleDirtyCheck();
  }

  function appendMenuGroupCard(group) {
    var card = document.createElement("section");
    var header = document.createElement("div");
    var labelInput = document.createElement("input");
    var deleteButton = document.createElement("button");
    var assignedList = document.createElement("div");

    card.className = "menu-group-card";
    card.dataset.menuGroupCard = "true";
    card.dataset.menuGroupId = group.id || namespace.createId("group");
    card.dataset.menuGroupDropTarget = card.dataset.menuGroupId;
    setMenuGroupItems(card, group.items || []);

    header.className = "menu-group-card-header";
    labelInput.type = "text";
    labelInput.placeholder = "Group name, like Client Work";
    labelInput.value = group.label || "";
    labelInput.maxLength = 40;
    labelInput.dataset.menuGroupLabel = "true";
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete Group";
    deleteButton.dataset.deleteMenuGroup = "true";
    header.appendChild(createFieldLabel("Group Name", labelInput));
    header.appendChild(deleteButton);

    assignedList.className = "menu-group-assigned-list";
    assignedList.dataset.menuGroupAssigned = "true";
    assignedList.dataset.menuGroupDropTarget = card.dataset.menuGroupId;

    card.appendChild(header);
    card.appendChild(assignedList);
    menuGroupEditor.appendChild(card);
  }

  function renderMenuGroupEditor() {
    var preset = selectedPreset();
    var groups = storage.normalizeMenuGroups(preset.menuGroups || []);
    var ungrouped = document.createElement("section");
    var ungroupedTitle = document.createElement("h3");
    var ungroupedItems = document.createElement("div");

    if (!menuGroupEditor) {
      return;
    }

    menuGroupEditor.innerHTML = "";
    setVisibleMenuKeysInEditor((preset && preset.visibleItems) || []);

    ungrouped.className = "menu-group-ungrouped";
    ungrouped.dataset.menuGroupUngrouped = "true";
    ungroupedTitle.textContent = "Ungrouped Items";
    ungroupedItems.className = "menu-group-chip-list";
    ungroupedItems.dataset.ungroupedMenuItems = "true";
    ungroupedItems.dataset.menuGroupDropTarget = "ungrouped";
    ungrouped.appendChild(ungroupedTitle);
    ungrouped.appendChild(ungroupedItems);
    menuGroupEditor.appendChild(ungrouped);

    groups.forEach(appendMenuGroupCard);
    refreshMenuGroupOptions();
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

  function isPositiveDimension(value) {
    var numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  }

  function hasMeasuredLayout(style) {
    var layout = style && style.measuredLayout;
    return Boolean(layout &&
      isPositiveDimension(layout.sidebarWidth) &&
      isPositiveDimension(layout.sidebarHeight) &&
      isPositiveDimension(layout.imageSlotWidth) &&
      isPositiveDimension(layout.imageSlotHeight));
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

  function getImageCssSettings(style) {
    var fit = style.backgroundImageFit || "cover";
    var scale = clampNumber(getByPath(style, "imageSettings.scale", 1), 0.5, 2.5, 1);
    var settings = {
      size: "cover",
      position: getImagePosition(style),
      repeat: "no-repeat"
    };

    if (fit === "contain") {
      settings.size = "contain";
    } else if (fit === "stretch") {
      settings.size = "100% 100%";
      settings.position = "center";
    } else if (fit === "tile") {
      settings.size = "auto";
      settings.repeat = "repeat";
    } else if (fit === "center") {
      settings.size = "auto";
    } else {
      settings.size = "cover";
    }

    if (scale !== 1 && fit !== "stretch" && fit !== "tile") {
      settings.size = getImageScale(style);
    }

    return settings;
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

  function getImageBaseBackgroundColor(style) {
    return style.backgroundImageBaseColor || style.backgroundColor || "#0f172a";
  }

  function getOverlayOpacity(style) {
    var asset = getAssetById(style.backgroundAssetId);
    var fallback = asset && asset.recommendedOverlayOpacity !== undefined ? asset.recommendedOverlayOpacity : 0.35;

    if (style.backgroundType === "image") {
      if (getByPath(style, "imageSettings.overlayEnabled", true) === false) {
        return 0;
      }
      return clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback));
    }

    if (style.backgroundType === "pattern") {
      return clampOpacity(getByPath(style, "patternSettings.overlayOpacity", fallback));
    }

    return clampOpacity(style.backgroundOverlayOpacity);
  }

  function getOverlayColor(style) {
    if (style.backgroundType === "image") {
      return getByPath(style, "imageSettings.overlayColor", "#000000");
    }

    return style.backgroundOverlayColor || "#000000";
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
      style.enabled = true;
      style.backgroundImageFit = "cover";
      style.backgroundImagePosition = "center center";
      style.customImageDataUrl = "";
      style.backgroundImageUrl = "";
      style.imageSettings = Object.assign({}, style.imageSettings || {}, {
        positionX: 50,
        positionY: 50,
        scale: 1,
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
      nextStyle.enabled = true;
      nextStyle.backgroundImageFit = "cover";
      nextStyle.backgroundImagePosition = "center center";
      nextStyle.customImageDataUrl = "";
      nextStyle.backgroundImageUrl = "";
      nextStyle.imageSettings = Object.assign({}, nextStyle.imageSettings || {}, {
        positionX: 50,
        positionY: 50,
        scale: 1,
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

  function resolveMenuGroupsFromProfileJson(menuGroups, errors) {
    var assignedItems = {};

    if (menuGroups === undefined || menuGroups === null) {
      return [];
    }

    if (!Array.isArray(menuGroups)) {
      errors.push("menuGroups must be an array.");
      return [];
    }

    if (menuGroups.length > 8) {
      errors.push("menuGroups can include at most 8 groups.");
      return [];
    }

    return menuGroups.reduce(function collectGroups(groups, group, groupIndex) {
      var label = "";
      var items = [];
      var blockedFields = ["url", "href", "quickLinks", "customLinks", "links", "menuGroups"];

      if (!group || typeof group !== "object" || Array.isArray(group)) {
        errors.push("menuGroups[" + groupIndex + "] must be an object.");
        return groups;
      }

      blockedFields.forEach(function rejectBlockedField(fieldName) {
        if (group[fieldName] !== undefined) {
          errors.push("menuGroups[" + groupIndex + "]." + fieldName + " is not supported.");
        }
      });

      label = sanitizeProfileText(group.label, 40, "menuGroups[" + groupIndex + "].label", errors, true);
      if (!Array.isArray(group.items)) {
        errors.push("menuGroups[" + groupIndex + "].items must be an array.");
        return groups;
      }
      if (group.items.length > 12) {
        errors.push("menuGroups[" + groupIndex + "].items can include at most 12 items.");
        return groups;
      }

      group.items.forEach(function collectItem(item) {
        var key = menuKeyFromProfileJson(item);

        if (!key) {
          errors.push("menuGroups[" + groupIndex + "].items contains an unsupported menu ID: " + item);
          return;
        }
        if (assignedItems[key]) {
          errors.push("menuGroups cannot assign the same menu item to more than one group: " + item);
          return;
        }
        assignedItems[key] = true;
        items.push(key);
      });

      if (label) {
        groups.push({
          id: namespace.createId("group"),
          label: label,
          items: items,
          collapsed: group.collapsed === true
        });
      }
      return groups;
    }, []);
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
      measurements: normalized.measuredLayout ? Object.assign({}, normalized.measuredLayout) : null,
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
          imageUrl: normalized.customImageDataUrl || (isSafeExternalImageUrl(normalized.backgroundImageUrl) ? normalized.backgroundImageUrl : null),
          imageFit: normalized.backgroundImageFit || "cover",
          positionX: getByPath(normalized, "imageSettings.positionX", 50),
          positionY: getByPath(normalized, "imageSettings.positionY", 50),
          zoom: getByPath(normalized, "imageSettings.scale", 1),
          imagePositionX: getByPath(normalized, "imageSettings.positionX", 50),
          imagePositionY: getByPath(normalized, "imageSettings.positionY", 50),
          imageScale: Math.round(clampNumber(getByPath(normalized, "imageSettings.scale", 1), 0.5, 2.5, 1) * 100),
          imageRepeat: normalized.backgroundImageFit === "tile" ? "repeat" : "no-repeat",
          baseBackgroundColor: normalized.backgroundImageBaseColor || normalized.backgroundColor || "#0f172a",
          fade: 1 - clampOpacity(getByPath(normalized, "imageSettings.opacity", 0.85)),
          darken: clampOpacity(getByPath(normalized, "imageSettings.overlayOpacity", 0.55)),
          overlay: {
            enabled: getByPath(normalized, "imageSettings.overlayEnabled", true) !== false,
            color: getByPath(normalized, "imageSettings.overlayColor", "#000000"),
            opacity: clampOpacity(getByPath(normalized, "imageSettings.overlayOpacity", 0.55))
          },
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
        var visual = custom.visual || {};
        var visualUrl = visual.assetUrl || visual.imageUrl || "";
        var visualFit = visual.imageFit || visual.fit || (visual.imageRepeat === "repeat" ? "tile" : "cover");
        var baseBackgroundColor = visual.baseBackgroundColor || visual.backgroundColor || style.backgroundImageBaseColor || style.backgroundColor || "#0f172a";
        var overlay = visual.overlay && typeof visual.overlay === "object" && !Array.isArray(visual.overlay) ? visual.overlay : null;
        var overlayOpacity = overlay && overlay.enabled === false ? 0 : overlay && overlay.opacity !== undefined ? overlay.opacity : visual.darken;
        var overlayColor = overlay && overlay.color ? overlay.color : "#000000";
        if (visual.assetSource === "curated") {
          asset = getAssetById(visual.assetId);
          if (!asset) {
            warnings.push("Unknown curated visual was ignored.");
          } else {
            style = applyAssetDefaultsForProfileJson(style, asset);
          }
        } else if (visual.assetSource === "uploaded") {
          if (visualUrl && isSafeImageDataUrl(visualUrl)) {
            style.customImageDataUrl = visualUrl;
            style.backgroundImageUrl = "";
            style.backgroundAssetId = "";
          } else if (visualUrl) {
            errors.push("sidebarStyle.custom.visual.assetUrl must be a safe uploaded image data URL.");
          }
        } else if (visual.assetSource === "external" || (!visual.assetSource && visualUrl)) {
          if (visualUrl && isSafeExternalImageUrl(visualUrl)) {
            style.backgroundImageUrl = visualUrl.trim();
            style.customImageDataUrl = "";
            style.backgroundAssetId = "";
            style.backgroundType = "image";
            style.stylePath = "custom";
          } else {
            errors.push("sidebarStyle.custom.visual.assetUrl must be a safe HTTPS image URL.");
          }
        } else if (visual.assetSource) {
          errors.push("sidebarStyle.custom.visual.assetSource must be curated, uploaded, or external.");
        }
        style.backgroundImageFit = ["cover", "contain", "stretch", "tile", "center"].indexOf(visualFit) === -1 ? "cover" : visualFit;
        if (!isSafeProfileColor(baseBackgroundColor)) {
          errors.push("sidebarStyle.custom.visual.baseBackgroundColor must be a hex or safe rgba color.");
          baseBackgroundColor = "#0f172a";
        }
        style.backgroundImageBaseColor = normalizeProfileColor(baseBackgroundColor, "#0f172a");
        if (overlay && overlay.color && !isSafeProfileColor(overlay.color)) {
          errors.push("sidebarStyle.custom.visual.overlay.color must be a hex or safe rgba color.");
          overlayColor = "#000000";
        }
        style.imageSettings = Object.assign({}, style.imageSettings || {}, {
          positionX: clampNumber(visual.imagePositionX !== undefined ? visual.imagePositionX : visual.positionX, 0, 100, 50),
          positionY: clampNumber(visual.imagePositionY !== undefined ? visual.imagePositionY : visual.positionY, 0, 100, 50),
          scale: clampNumber(visual.imageScale !== undefined ? Number(visual.imageScale) / 100 : visual.zoom, 0.5, 2.5, 1),
          opacity: 1 - clampOpacity(visual.fade),
          overlayEnabled: !overlay || overlay.enabled !== false,
          overlayColor: normalizeProfileColor(overlayColor, "#000000"),
          overlayOpacity: clampOpacity(overlayOpacity),
          blur: clampNumber(visual.blur, 0, 12, 0)
        });
      }
    }

    if (sidebarStyle.measurements && typeof sidebarStyle.measurements === "object" && !Array.isArray(sidebarStyle.measurements)) {
      style.measuredLayout = {
        sidebarWidth: clampNumber(sidebarStyle.measurements.sidebarWidth, 1, 10000, 0),
        sidebarHeight: clampNumber(sidebarStyle.measurements.sidebarHeight, 1, 10000, 0),
        imageSlotWidth: clampNumber(sidebarStyle.measurements.imageSlotWidth, 1, 10000, 0),
        imageSlotHeight: clampNumber(sidebarStyle.measurements.imageSlotHeight, 1, 10000, 0),
        imageSlotAspectRatio: clampNumber(sidebarStyle.measurements.imageSlotAspectRatio, 0.001, 10000, 0)
      };
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
    var menuGroups = Array.isArray(preset.menuGroups) ? storage.normalizeMenuGroups(preset.menuGroups) : [];
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

    if (menuGroups.length) {
      exportedJson.profile.menuGroups = menuGroups.map(function exportGroup(group) {
        return {
          label: group.label,
          items: (group.items || []).slice(),
          collapsed: group.collapsed === true
        };
      });
    }

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
      menuGroups: resolveMenuGroupsFromProfileJson(profile.menuGroups, errors),
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
    var menuGroups = [];
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
    menuGroups = (result.preset.menuGroups || []).map(function labelGroup(group) {
      return group.label + " (" + (group.items || []).length + ")";
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
      "Menu Groups: " + menuGroups.length + (menuGroups.length ? " (" + menuGroups.join(", ") + ")" : ""),
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
        setStatus("Save this template as a new profile before exporting it.", true);
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
      return imageUrl ? "url(\"" + imageUrl + "\")" : "";
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
    if (style && style.enabled === false) {
      return "none";
    }
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

  function createImageResetField(field) {
    var wrapper = document.createElement("div");
    var button = document.createElement("button");

    wrapper.className = "inline-field image-reset-field";
    button.type = "button";
    button.className = "secondary";
    button.textContent = "Reset Position";
    button.dataset.resetImagePosition = "true";
    wrapper.appendChild(document.createTextNode(field.label));
    wrapper.appendChild(button);
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
        var maxDimension = 1600;
        var resizeScale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        var width = Math.max(1, Math.round(image.width * resizeScale));
        var height = Math.max(1, Math.round(image.height * resizeScale));
        var context = canvas.getContext("2d");
        var nextStyle = collectSidebarStyleFromForm();
        var preserveCustomPosition = nextStyle.backgroundType === "image" &&
          (getByPath(nextStyle, "imageSettings.positionX", 50) !== 50 || getByPath(nextStyle, "imageSettings.positionY", 50) !== 50);

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        nextStyle.enabled = true;
        nextStyle.backgroundType = "image";
        nextStyle.backgroundImageFit = "cover";
        nextStyle.backgroundImagePosition = "center center";
        nextStyle.backgroundAssetId = "";
        nextStyle.backgroundImageUrl = "";
        nextStyle.customImageDataUrl = canvas.toDataURL("image/webp", 0.78);
        nextStyle.imageSettings = Object.assign({}, nextStyle.imageSettings || {}, {
          positionX: preserveCustomPosition ? getByPath(nextStyle, "imageSettings.positionX", 50) : 50,
          positionY: preserveCustomPosition ? getByPath(nextStyle, "imageSettings.positionY", 50) : 50,
          scale: 1,
          opacity: 0.85,
          blur: 0,
          overlayOpacity: clampOpacity(getByPath(nextStyle, "imageSettings.overlayOpacity", 0.15))
        });
        populateSidebarStyleForm(nextStyle, { presetValue: "custom", optionLabel: "Custom Image Draft" });
        setStatus("Custom image loaded. " + saveHintText());
        scheduleDirtyCheck();
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
        setStatus("Logo loaded. " + saveHintText());
        scheduleDirtyCheck();
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
    return [globalSidebarStyleEditor, spacingStyleEditor, advancedStyleEditor, presetAdjustmentEditor, sidebarStyleEditor, menuColorEditor].filter(Boolean);
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

    if (sidebarStyleEnabled) {
      sidebarStyleEnabled.checked = normalizedStyle.enabled === true;
    }
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
    renderStyleAccordionState(normalizedStyle);
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
    } else if (field.type === "image-reset") {
      label = createImageResetField(field);
    } else {
      label = createTextField(field, style);
    }

    if (field.mode) {
      label.dataset.sidebarStyleMode = field.mode;
    }
    if (field.group) {
      label.dataset.sidebarStyleGroup = field.group;
    }
    if (field.helpText) {
      var helper = document.createElement("span");
      helper.className = "help-text";
      helper.textContent = field.helpText;
      label.appendChild(helper);
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
    if (fields.some(function hasImageField(field) { return field.mode === "image"; })) {
      var guidance = document.createElement("p");
      guidance.className = "help-text image-guidance";
      guidance.dataset.sidebarStyleMode = "image";
      guidance.textContent = "Recommended image size: 600 x 1600 px minimum, 800 x 2000 px preferred. Use WebP or JPG, keep files under 750 KB, and place important content near the center because cover mode may crop.";
      container.appendChild(guidance);
    }
  }

  function isLogoStyleField(field) {
    return ["sidebarBrandingMode", "customLogoDataUrl", "logoUrl", "headerLabel", "logoSize", "brandAccentColor", "headerAlignment"].indexOf(field.key) !== -1;
  }

  function isSpacingStyleField(field) {
    return ["borderRadius", "sidebarRadius", "buttonRadius", "itemSpacing", "sidebarPadding"].indexOf(field.key) !== -1;
  }

  function isAdvancedStyleField(field) {
    return ["shadowStrength", "borderVisible"].indexOf(field.key) !== -1;
  }

  function hasActiveLogoSettings(style) {
    return style.sidebarBrandingMode && style.sidebarBrandingMode !== "keep" ||
      Boolean(style.customLogoDataUrl || style.logoUrl || style.headerLabel || style.brandAccentColor);
  }

  function renderStyleAccordionState(style) {
    var normalizedStyle = storage.normalizeSidebarStyle(style || {});

    document.querySelectorAll("[data-style-accordion]").forEach(function updateAccordion(details) {
      var key = details.dataset.styleAccordion;
      var shouldOpen = styleAccordionState[key] === true;

      if (key === "background" && normalizedStyle.stylePath === "custom") {
        shouldOpen = true;
      }
      if (key === "logo" && hasActiveLogoSettings(normalizedStyle)) {
        shouldOpen = true;
      }

      details.open = shouldOpen;
    });
  }

  function renderSidebarStyle() {
    var preset = selectedPreset();
    var style = storage.normalizeSidebarStyle(preset.sidebarStyle);
    var logoFields = sidebarStyleFields.filter(function keepLogoField(field) {
      return field.group === "global" && isLogoStyleField(field);
    });
    var spacingFields = sidebarStyleFields.filter(function keepSpacingField(field) {
      return field.group === "global" && isSpacingStyleField(field);
    });
    var advancedFields = sidebarStyleFields.filter(function keepAdvancedField(field) {
      return field.group === "global" && isAdvancedStyleField(field);
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
    renderSidebarStyleFields(globalSidebarStyleEditor, style, logoFields);
    renderSidebarStyleFields(spacingStyleEditor, style, spacingFields);
    renderSidebarStyleFields(advancedStyleEditor, style, advancedFields);
    renderSidebarStyleFields(presetAdjustmentEditor, style, presetAdjustmentFields);
    renderSidebarStyleFields(sidebarStyleEditor, style, customFields);
    renderSidebarStyleFields(menuColorEditor, style, menuFields);
    populateSidebarStyleForm(style, { presetValue: style.preset || "default" });
    renderStyleAccordionState(style);
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
    setStatus(preset.label + " applied. " + saveHintText());
    scheduleDirtyCheck();
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
    scheduleDirtyCheck();
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
    setStatus("Curated Rotation picked " + selected.label + ". " + saveHintText());
    scheduleDirtyCheck();
  }

  function updateImagePositionFromPointer(event) {
    var slotElement = sidebarStylePreviewBackground || sidebarStylePreview;
    var rect = slotElement.getBoundingClientRect();
    var style = getCurrentWorkingSidebarStyle();
    var x = 50;
    var y = 50;

    if (style.backgroundType !== "image" || !rect.width || !rect.height) {
      return;
    }

    x = clampNumber(((event.clientX - rect.left) / rect.width) * 100, 0, 100, 50);
    y = clampNumber(((event.clientY - rect.top) / rect.height) * 100, 0, 100, 50);

    style.imageSettings = Object.assign({}, style.imageSettings || {}, {
      positionX: Math.round(x),
      positionY: Math.round(y)
    });
    populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
  }

  function measuredLayoutSummary(layout) {
    if (!layout) {
      return "GHL sidebar model: 224 x 1156.";
    }

    return "Detected: sidebar " + Math.round(layout.sidebarWidth) + " x " + Math.round(layout.sidebarHeight) +
      ", image slot " + Math.round(layout.imageSlotWidth) + " x " + Math.round(layout.imageSlotHeight) + ".";
  }

  function updateMeasuredLayoutStatus(style) {
    if (!sidebarMeasurementStatus) {
      return;
    }

    sidebarMeasurementStatus.textContent = "GHL sidebar model: 224 x 1156.";
  }

  function setLayerMeasuredDimensions(element, width, height) {
    if (!element) {
      return;
    }

    element.style.inset = "auto";
    element.style.left = "0";
    element.style.top = "0";
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.width = width + "px";
    element.style.height = height + "px";
    element.style.overflow = "hidden";
  }

  function resetLayerMeasuredDimensions(element) {
    if (!element) {
      return;
    }

    element.style.inset = "0";
    element.style.left = "";
    element.style.top = "";
    element.style.right = "";
    element.style.bottom = "";
    element.style.width = "";
    element.style.height = "";
    element.style.overflow = "";
  }

  function applyMeasuredPreviewLayout(style) {
    resetLayerMeasuredDimensions(sidebarStylePreviewBackground);
    resetLayerMeasuredDimensions(sidebarStylePreviewOverlay);
  }

  function detectGhlSidebar() {
    if (detectGhlSidebarButton) {
      detectGhlSidebarButton.disabled = true;
    }
    setStatus("Detecting the GHL sidebar...");
    sendToContentScript({ type: "CLEANVIEW_DETECT_GHL_SIDEBAR" }, function handleDetected(result) {
      if (detectGhlSidebarButton) {
        detectGhlSidebarButton.disabled = false;
      }
      if (!result || !result.ok || !result.foundSidebar) {
        setStatus(result && (result.message || result.error) ? result.message || result.error : "No GHL sidebar found on this page.", true);
        return;
      }
      setStatus("GHL sidebar found: " + result.selectorUsed + ", " + Math.round(result.width) + " x " + Math.round(result.height) + ".");
    });
  }

  function applyLiveToGhl(options) {
    var applyOptions = options || {};
    var unreachableMessage = applyOptions.afterSave ?
      "Changes saved, but CleanView could not reach the GHL page yet. Reload the tab, then click Apply Live to GHL." :
      "CleanView could not reach the GHL page yet. Reload the tab, then click Apply Live to GHL.";

    if (applyLiveButton) {
      applyLiveButton.disabled = true;
    }
    if (overviewApplyLiveButton) {
      overviewApplyLiveButton.disabled = true;
    }
    sendToContentScript({ type: "CLEANVIEW_APPLY_ACTIVE_SETTINGS" }, function handleApplied(result) {
      if (applyLiveButton) {
        applyLiveButton.disabled = false;
      }
      if (overviewApplyLiveButton) {
        overviewApplyLiveButton.disabled = false;
      }
      if (!result || !result.ok) {
        if (result && result.contentScriptUnreachable) {
          setStatus(unreachableMessage, true, {
            showReloadGhlAction: true,
            reloadTabId: result.targetTabId
          });
          return;
        }
        if (applyOptions.afterSave) {
          var applyMessage = result && (result.message || result.error) ? result.message || result.error : "";
          if (/Open a GHL page|Focus the GHL tab/i.test(applyMessage)) {
            setStatus("Changes saved, but no active GoHighLevel tab was found. Open GHL and click Apply Live to GHL.", true);
          } else {
            setStatus("Changes saved, but CleanView could not apply them yet. Refresh your GHL tab and try Apply Live to GHL.", true);
          }
          return;
        }
        setStatus(result && (result.message || result.error) ? result.message || result.error : "Unable to apply live to GHL.", true);
        return;
      }
      setStatus(applyOptions.successMessage || result.message || "Applied to open GHL tab.");
    });
  }

  function saveThenApplyLive() {
    if (!canEditSelectedPreset(selectedPreset())) {
      setStatus("Select a profile draft before applying live.", true);
      return;
    }

    persistSelectedView("Changes saved.", false, function applySavedView() {
      applyLiveToGhl({
        afterSave: true,
        successMessage: "Changes saved and applied."
      });
    });
  }

  function resetCurrentGhlPage() {
    if (overviewResetPageButton) {
      overviewResetPageButton.disabled = true;
    }
    sendToContentScript({ type: "resetPage" }, function handleReset(result) {
      if (overviewResetPageButton) {
        overviewResetPageButton.disabled = false;
      }
      if (!result || !result.ok) {
        setStatus(result && (result.message || result.error) ? result.message || result.error : "Unable to reset the GHL page.", true);
        return;
      }
      setStatus(result.message || "GHL page reset.");
    });
  }

  function reloadCurrentGhlTab() {
    if (!reloadGhlTabTargetId) {
      setStatus("No GHL tab is ready to reload right now.", true);
      return;
    }

    if (reloadGhlTabButton) {
      reloadGhlTabButton.disabled = true;
    }

    chrome.tabs.reload(reloadGhlTabTargetId, function handleReloaded() {
      if (reloadGhlTabButton) {
        reloadGhlTabButton.disabled = false;
      }

      if (chrome.runtime.lastError) {
        setStatus("Unable to reload the GHL tab. Try refreshing it manually.", true, {
          showReloadGhlAction: true,
          reloadTabId: reloadGhlTabTargetId
        });
        return;
      }

      setStatus("GHL tab reloading. Wait for the page to finish loading, then click Apply Live to GHL again.");
    });
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
    if (!container) {
      return;
    }

    container.querySelectorAll("input, select, button").forEach(function updateControl(control) {
      control.disabled = disabled;
    });
  }

  function syncPresetEditability() {
    var canEdit = canEditSelectedPreset(selectedPreset());
    var isEditable = isCustomPreset(selectedPreset());

    setContainerControlsDisabled(menuEditor, !canEdit);
    if (menuGroupEditor) {
      setContainerControlsDisabled(menuGroupEditor, !canEdit);
    }
    setContainerControlsDisabled(renameEditor, !canEdit);
    setContainerControlsDisabled(linkEditor, !canEdit);
    setContainerControlsDisabled(globalSidebarStyleEditor, !canEdit);
    setContainerControlsDisabled(spacingStyleEditor, !canEdit);
    setContainerControlsDisabled(advancedStyleEditor, !canEdit);
    setContainerControlsDisabled(sidebarStyleEditor, !canEdit);
    setContainerControlsDisabled(menuColorEditor, !canEdit);
    setContainerControlsDisabled(curatedPresetGrid, !canEdit);
    setContainerControlsDisabled(curatedShuffleCustomPool, !canEdit);
    sidebarStyleEnabled.disabled = !canEdit;
    sidebarStylePreset.disabled = !canEdit;
    sidebarBackgroundType.disabled = !canEdit;
    if (autoReadabilityToggle) {
      autoReadabilityToggle.disabled = !canEdit;
    }
    if (curatedShuffleEnabled) {
      curatedShuffleEnabled.disabled = !canEdit;
    }
    if (curatedShufflePool) {
      curatedShufflePool.disabled = !canEdit;
    }
    if (curatedShuffleFrequency) {
      curatedShuffleFrequency.disabled = !canEdit;
    }
    if (curatedShuffleAvoidRepeats) {
      curatedShuffleAvoidRepeats.disabled = !canEdit;
    }
    document.getElementById("selectAllMenusButton").disabled = !canEdit;
    document.getElementById("deselectAllMenusButton").disabled = !canEdit;
    document.getElementById("resetMenuDefaultsButton").disabled = !canEdit;
    if (addMenuGroupButton) {
      addMenuGroupButton.disabled = !canEdit;
    }
    document.getElementById("addRenameButton").disabled = !canEdit;
    document.getElementById("addLinkButton").disabled = !canEdit;
    curatedShuffleButton.disabled = !canEdit;
    if (applyLiveButton) {
      applyLiveButton.disabled = !canEdit;
    }
    if (stickySaveButton) {
      stickySaveButton.disabled = !canEdit;
    }
    if (stickySaveApplyButton) {
      stickySaveApplyButton.disabled = !canEdit;
    }
    if (stickyRevertButton) {
      stickyRevertButton.disabled = !canEdit;
    }
    if (detectGhlSidebarButton) {
      detectGhlSidebarButton.disabled = false;
    }
    document.getElementById("resetStyleButton").disabled = !canEdit;
    document.getElementById("savePresetButton").disabled = !canEdit;
    if (saveAsCopyButton) {
      saveAsCopyButton.hidden = true;
      saveAsCopyButton.disabled = !isEditable;
    }
  }

  function render() {
    if (renderBuilderVisibility()) {
      return;
    }
    renderPresetSelects();
    renderTabState();
    renderHeader();
    renderPostCreationMenuOnlyState();
    renderMenuGroupEditor();
    renderMenuEditor();
    renderRenameEditor();
    renderLinks();
    renderSidebarStylePresetOptions();
    renderSidebarStyle();
    renderLocationRules();
    syncPresetEditability();
    renderStickySaveBar();
  }

  function collectSidebarStyleFromForm() {
    var style = storage.normalizeSidebarStyle(draftSidebarStyle || sidebarStylePresets[sidebarStylePreset.value] || {});
    var previousBackgroundType = style.backgroundType || "solid";
    var selectedBackgroundType = sidebarBackgroundType ? sidebarBackgroundType.value || "solid" : getEditorBackgroundType(style);
    style.enabled = sidebarStyleEnabled ? sidebarStyleEnabled.checked : style.enabled === true;
    style.preset = sidebarStylePreset.value || "default";
    style.stylePath = sidebarStylePath ? sidebarStylePath.value || "preset" : style.stylePath || "preset";
    if (style.stylePath === "custom") {
      style.enabled = selectedBackgroundType !== "none";
      if (selectedBackgroundType !== "none") {
        style.backgroundType = previousBackgroundType === "pattern" && selectedBackgroundType === "image" ? "pattern" : selectedBackgroundType || "solid";
      }
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
    var imageCss = getImageCssSettings(style);
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
    sidebarStylePreview.style.background = style.backgroundType === "image" ? getImageBaseBackgroundColor(style) : (style.backgroundColor || "#ffffff");
    applyMeasuredPreviewLayout(style);
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
      sidebarStylePreviewOverlay.style.background = getOverlayRgba(getOverlayColor(style), overlayOpacity);
      sidebarStylePreviewOverlay.style.opacity = overlayOpacity > 0 ? "1" : "0";
    }
    if (style.backgroundType === "image") {
      if (sidebarStylePreviewBackground) {
        sidebarStylePreviewBackground.style.backgroundColor = getImageBaseBackgroundColor(style);
        sidebarStylePreviewBackground.style.backgroundImage = background;
        sidebarStylePreviewBackground.style.backgroundSize = imageCss.size;
        sidebarStylePreviewBackground.style.backgroundPosition = imageCss.position;
        sidebarStylePreviewBackground.style.backgroundRepeat = imageCss.repeat;
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
    updateMeasuredLayoutStatus(style);

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
    var menuGroups = [];

    preset.name = presetName.value.trim() || "Untitled Profile";
    preset.description = presetDescription.value.trim();

    visibleItems = visibleMenuKeysFromEditor();

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

    if (menuGroupEditor) {
      menuGroupEditor.querySelectorAll("[data-menu-group-card='true']").forEach(function collectGroup(card) {
        var labelInput = card.querySelector("[data-menu-group-label]");
        var label = labelInput ? labelInput.value.trim() : "";
        var items = menuGroupItemsFromCard(card);

        if (label) {
          menuGroups.push({
            id: card.dataset.menuGroupId || namespace.createId("group"),
            label: label,
            items: items,
            collapsed: false
          });
        }
      });
    }

    preset.visibleItems = visibleItems;
    preset.labelOverrides = labelOverrides;
    preset.customLinks = customLinks;
    preset.menuGroups = menuGroups;
    preset.sidebarStyle = collectSidebarStyleFromForm();
    preset.showInPopup = isTemplatePreset(selectedPreset()) ? true : showInPopupToggle.checked;
    preset.updatedAt = namespace.nowIso();
    return storage.normalizePreset(preset);
  }

  function sortComparableValue(value) {
    if (Array.isArray(value)) {
      return value.map(sortComparableValue);
    }

    if (value && typeof value === "object") {
      return Object.keys(value).sort().reduce(function sortObjectKeys(sorted, key) {
        sorted[key] = sortComparableValue(value[key]);
        return sorted;
      }, {});
    }

    return value;
  }

  function comparableDraftPayload(preset) {
    return sortComparableValue({
      name: preset.name || "",
      description: preset.description || "",
      showInPopup: preset.showInPopup !== false,
      visibleItems: preset.visibleItems || [],
      labelOverrides: preset.labelOverrides || {},
      customLinks: (preset.customLinks || []).map(function comparableLink(link) {
        return {
          label: link.label || "",
          url: link.url || "",
          placement: link.placement || "bottom",
          openMode: link.openMode || "new_tab",
          enabled: link.enabled !== false
        };
      }),
      menuGroups: (preset.menuGroups || []).map(function comparableMenuGroup(group) {
        return {
          label: group.label || "",
          items: group.items || [],
          collapsed: group.collapsed === true
        };
      }),
      sidebarStyle: preset.sidebarStyle || {}
    });
  }

  function getCurrentDraftSnapshot() {
    if (!state || !selectedPresetId || !canEditSelectedPreset(selectedPreset())) {
      return "";
    }

    try {
      return JSON.stringify(comparableDraftPayload(collectPresetFromForm()));
    } catch (_error) {
      return "";
    }
  }

  function clearDirtyState() {
    isDirty = false;
    lastSavedDraftSnapshot = "";
    renderStickySaveBar();
  }

  function resetDirtyStateFromRenderedDraft() {
    lastSavedDraftSnapshot = getCurrentDraftSnapshot();
    isDirty = false;
    renderStickySaveBar();
  }

  function updateDirtyStateFromRenderedDraft() {
    var currentSnapshot = "";

    if (suppressDirtyTracking || !lastSavedDraftSnapshot) {
      renderStickySaveBar();
      return;
    }

    currentSnapshot = getCurrentDraftSnapshot();
    isDirty = Boolean(currentSnapshot && currentSnapshot !== lastSavedDraftSnapshot);
    renderStickySaveBar();
  }

  function scheduleDirtyCheck() {
    if (suppressDirtyTracking) {
      return;
    }

    window.setTimeout(updateDirtyStateFromRenderedDraft, 0);
  }

  function isStickySaveEligible() {
    return ["style", "menu", "rename", "links"].indexOf(activeTab) !== -1 &&
      !onboardingMode &&
      canEditSelectedPreset(selectedPreset());
  }

  function renderStickySaveBar() {
    var canEdit = canEditSelectedPreset(selectedPreset());

    if (!stickySaveBar) {
      return;
    }

    stickySaveBar.hidden = !isDirty || !isStickySaveEligible();
    if (stickySaveStatus) {
      stickySaveStatus.textContent = "Unsaved changes";
    }
    if (stickySaveButton) {
      stickySaveButton.textContent = primarySaveLabel(selectedPreset());
      stickySaveButton.disabled = !canEdit;
    }
    if (stickySaveApplyButton) {
      stickySaveApplyButton.disabled = !canEdit;
    }
    if (stickyRevertButton) {
      stickyRevertButton.disabled = !canEdit;
    }
  }

  function saveCurrentDraftFromSticky() {
    persistSelectedView(isCustomPreset(selectedPreset()) ? "Changes saved." : "New profile saved.", false);
  }

  function saveAndApplyCurrentDraftFromSticky() {
    persistSelectedView("Changes saved.", false, function applySavedDraft() {
      applyLiveToGhl({
        afterSave: true,
        successMessage: "Changes saved and applied."
      });
    });
  }

  function revertCurrentDraft() {
    render();
    resetDirtyStateFromRenderedDraft();
    setStatus("Changes reverted.");
  }

  function reapplySavedPresetIfActive(presetId, message, reapplyIfActive, nextState, afterSave) {
    if (!reapplyIfActive || presetId !== nextState.activePresetId) {
      setStatus(message);
      render();
      resetDirtyStateFromRenderedDraft();
      if (afterSave) {
        afterSave(nextState);
      }
      return;
    }

    sendToContentScript({ type: "applyPreset", presetId: presetId }, function handleApplied(result) {
      if (result.ok && result.skipped) {
        setStatus(message + " CleanView is off; turn it on to apply.");
      } else {
        setStatus(result.ok ? message + " Applied Live to GHL." : message);
      }
      render();
      resetDirtyStateFromRenderedDraft();
      if (afterSave) {
        afterSave(nextState);
      }
    });
  }

  function persistPreset(preset, message, reapplyIfActive, afterSave) {
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
      reapplySavedPresetIfActive(preset.id, message, reapplyIfActive, nextState, afterSave);
    });
  }

  function persistSelectedView(message, reapplyIfActive, afterSave) {
    if (canEditSelectedPreset(selectedPreset())) {
      persistPreset(collectPresetFromForm(), message, reapplyIfActive, afterSave);
      return;
    }

    setStatus("Open a template or blank draft before saving.", true);
  }

  function setMenuCheckboxes(checked) {
    setVisibleMenuKeysInEditor(checked ? allMenuKeys.slice() : []);
    if (!checked && menuGroupEditor) {
      menuGroupEditor.querySelectorAll("[data-menu-group-card='true']").forEach(function clearGroup(card) {
        setMenuGroupItems(card, []);
      });
    }
  }

  function resetMenuCheckboxesToPresetDefault() {
    renderMenuGroupEditor();
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
      onboardingMode = hasEditableProfiles(state) ? "" : "chooser";
      postCreationMenuOnlyMode = false;
      starterFlowSource = hasEditableProfiles(state) ? "profiles" : "first_run";
      render();
      resetDirtyStateFromRenderedDraft();
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
      menuGroups: [],
      sidebarStyle: namespace.defaultSidebarStyle
    }), "Profile created.", false);
  }

  function findReusableStarterProfile(nextState, starter) {
    var activePreset = storage.getPresetById(nextState, nextState.activePresetId);
    var metadata = activePreset && activePreset.profileMetadata;

    if (isEditableProfile(activePreset) && metadata && metadata.onboardingStarterViewId === starter.id) {
      return activePreset;
    }

    return null;
  }

  function buildStarterProfile(starter, existingProfile, draftPreset) {
    var draft = draftPreset || {};
    var draftStyle = draft.sidebarStyle || {};
    var draftMetadata = draft.profileMetadata || {};
    var draftName = resolvedStarterProfileName(starter, draft.name);
    var draftVisibleItems = Array.isArray(draft.visibleItems) && draft.visibleItems.length ? draft.visibleItems : starterVisibleKeys(starter);
    var starterSidebarStyle = storage.normalizeSidebarStyle(Object.assign({}, namespace.defaultSidebarStyle || {}, starter && starter.sidebarStyle || {}, draftStyle));
    var metadata = Object.assign({}, existingProfile && existingProfile.profileMetadata || {}, draftMetadata, {
      onboardingStarterViewId: starter.id,
      onboardingStarterViewName: starter.name,
      createdFromFirstRun: true,
      sourceTemplateId: starter.sourceTemplateId || starter.id,
      accentColor: starter.accentColor || "",
      accentBorder: starter.accentBorder || starter.accentColor || "",
      iconId: starter.iconId || "",
      bestFor: starter.bestFor || "",
      keepsLine: starter.keepsLine || "",
      sidebarBackgroundColor: starterSidebarStyle.backgroundColor || "",
      onboardingMenuTextColorMode: normalizeStarterTextColorMode(draftMetadata.onboardingMenuTextColorMode),
      onboardingMenuTextColor: starterSidebarStyle.textColor || ""
    });

    return storage.normalizePreset({
      id: existingProfile && existingProfile.id || namespace.createId("custom"),
      name: draftName,
      description: starter.description,
      source: "custom",
      visibleItems: normalizeMenuKeyList(draftVisibleItems),
      labelOverrides: Object.assign({}, starter.labelOverrides || {}),
      customLinks: existingProfile && Array.isArray(existingProfile.customLinks) ? existingProfile.customLinks.slice() : [],
      menuGroups: [],
      sidebarStyle: starterSidebarStyle,
      profileMetadata: metadata,
      showInPopup: existingProfile ? existingProfile.showInPopup !== false : true,
      archived: false,
      updatedAt: namespace.nowIso()
    });
  }

  function openCreatedStarterMenuEditor() {
    onboardingMode = "";
    postCreationMenuOnlyMode = true;
    activeTab = "menu";
    render();
    setStatus("Editing your menu.");
    resetDirtyStateFromRenderedDraft();
  }

  function returnToStarterSuccessSummary() {
    postCreationMenuOnlyMode = false;
    setOnboardingMode("success", selectedStarterViewId);
    setStatus("Your CleanView is ready.");
    resetDirtyStateFromRenderedDraft();
  }

  function openCreatedStarterFullEditor() {
    onboardingMode = "";
    postCreationMenuOnlyMode = false;
    activeTab = "style";
    render();
    setStatus("Full editor ready.");
    resetDirtyStateFromRenderedDraft();
  }

  function finishStarterSuccessFlow() {
    onboardingMode = "";
    postCreationMenuOnlyMode = false;
    render();
    setStatus("Your CleanView is active.");
    resetDirtyStateFromRenderedDraft();
  }

  function applyStarterViewAfterSave(starter) {
    sendToContentScript({ type: "CLEANVIEW_APPLY_ACTIVE_SETTINGS" }, function handleStarterApplied(result) {
      if (useStarterViewButton) {
        useStarterViewButton.disabled = false;
      }

      postCreationMenuOnlyMode = false;
      if (!result || !result.ok) {
        if (result && result.contentScriptUnreachable) {
          starterApplyMessage = "View saved, but CleanView could not reach the GHL page yet. Reload the tab, then click Apply Live to GHL.";
          setOnboardingMode("success", starter.id);
          setStatus(starterApplyMessage, true, {
            showReloadGhlAction: true,
            reloadTabId: result.targetTabId
          });
          return;
        }
        starterApplyMessage = result && (result.message || result.error) ? result.message || result.error : "Saved. Open a GHL page to apply this view live.";
        setOnboardingMode("success", starter.id);
        setStatus(starterApplyMessage, true);
        return;
      }

      starterApplyMessage = result.message || "Applied to open GHL tab.";
      setOnboardingMode("success", starter.id);
      setStatus("View created and set active.");
      resetDirtyStateFromRenderedDraft();
    });
  }

  function saveStarterView(starter) {
    var starterNameValue = starterViewNameInput ? starterViewNameInput.value : "";

    if (!starter) {
      setStatus("Choose a starter view first.", true);
      return;
    }

    updateStarterDraftName(starterNameValue);

    if (useStarterViewButton) {
      useStarterViewButton.disabled = true;
    }

    storage.updateState(function updateStarterProfile(nextState) {
      var profile = buildStarterProfile(starter, null, ensureOnboardingDraft(starter));

      nextState.presets[profile.id] = profile;
      nextState.activePresetId = profile.id;
      nextState.lastEditedProfileId = profile.id;
      if (nextState.presetPreferences) {
        delete nextState.presetPreferences[profile.id];
      }
    }, function handleStarterSaved(nextState, error) {
      if (error) {
        if (useStarterViewButton) {
          useStarterViewButton.disabled = false;
        }
        setStatus("Unable to save starter view.", true);
        return;
      }

      state = nextState;
      selectedPresetId = nextState.activePresetId;
      starterApplyMessage = "View created.";
      applyStarterViewAfterSave(starter);
    });
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
        setStatus("Save this template as a new profile before making a copy.", true);
        return;
      }
      document.getElementById("duplicatePresetButton").click();
    } else if (action === "save-copy") {
      if (!isEditableProfile(selectedPreset())) {
        setStatus("Save this template as a new profile before making a copy.", true);
        return;
      }
      document.getElementById("saveAsCopyButton").click();
    } else if (action === "rename") {
      if (!isEditableProfile(selectedPreset())) {
        setStatus("Save this template as a new profile before renaming it.", true);
      } else {
        presetName.focus();
        presetName.select();
        setStatus("Update the Profile Name field, then Save Changes.");
      }
    } else if (action === "export") {
      openProfileTransferModal("export");
    } else if (action === "copy") {
      openProfileTransferModal("export");
    } else if (action === "delete") {
      document.getElementById("deletePresetButton").click();
    }
  }

  [profileManagementPanel, builderPanel].forEach(function bindDirtyContainer(container) {
    if (!container) {
      return;
    }

    container.addEventListener("input", scheduleDirtyCheck);
    container.addEventListener("change", scheduleDirtyCheck);
  });

  document.querySelectorAll("[data-style-accordion]").forEach(function bindStyleAccordion(details) {
    details.addEventListener("toggle", function rememberStyleAccordionState() {
      styleAccordionState[details.dataset.styleAccordion] = details.open;
    });
  });

  document.querySelectorAll("[data-tab-button]").forEach(function bindTab(button) {
    button.addEventListener("click", function switchTab() {
      activeTab = button.dataset.tabButton;
      renderTabState();
      renderStickySaveBar();
    });
  });

  document.getElementById("createPresetButton").addEventListener("click", function createPreset() {
    loadPresetIntoEditor("builtin:blank", window.prompt("Profile name", "My CleanView") || "My CleanView");
    setStatus("Blank draft ready. Save as New Profile when you are ready.");
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
    persistSelectedView(isCustomPreset(selectedPreset()) ? "Changes saved." : "New profile saved.", false);
  });

  if (stickyRevertButton) {
    stickyRevertButton.addEventListener("click", revertCurrentDraft);
  }

  if (stickySaveButton) {
    stickySaveButton.addEventListener("click", saveCurrentDraftFromSticky);
  }

  if (stickySaveApplyButton) {
    stickySaveApplyButton.addEventListener("click", saveAndApplyCurrentDraftFromSticky);
  }

  if (saveAsCopyButton) {
    saveAsCopyButton.addEventListener("click", function saveAsCopy() {
      var currentPreset = selectedPreset();
      var draftPreset = collectPresetFromForm();
      var duplicate = storage.duplicatePreset(state, selectedPresetId);

      if (!isCustomPreset(currentPreset) || !duplicate) {
        setStatus("Save as Copy is available for custom profiles only.", true);
        return;
      }

      duplicate.name = nextCopyName(draftPreset.name || currentPreset.name || currentPreset.label);
      duplicate.description = draftPreset.description || "";
      duplicate.visibleItems = draftPreset.visibleItems || [];
      duplicate.labelOverrides = draftPreset.labelOverrides || {};
      duplicate.customLinks = draftPreset.customLinks || [];
      duplicate.menuGroups = draftPreset.menuGroups || [];
      duplicate.sidebarStyle = draftPreset.sidebarStyle || namespace.defaultSidebarStyle;
      duplicate.showInPopup = draftPreset.showInPopup !== false;
      duplicate.profileMetadata = draftPreset.profileMetadata || null;
      persistPreset(duplicate, "Profile copy saved.", false);
    });
  }

  if (createProfileButton) {
    createProfileButton.addEventListener("click", function openCreateProfile() {
      openProfileTransferModal("create");
    });
  }

  if (createBlankProfileModalButton) {
    createBlankProfileModalButton.addEventListener("click", function createBlankFromModal() {
      closeProfileTransferModal();
      loadPresetIntoEditor("builtin:blank", createBlankProfileName.value || "My CleanView");
      setStatus("Blank draft ready. Save as New Profile when you are ready.");
    });
  }

  if (createFromTemplateModalButton) {
    createFromTemplateModalButton.addEventListener("click", function createFromTemplateModal() {
      closeProfileTransferModal();
      loadPresetIntoEditor(createTemplateSelect.value || "builtin:simple");
      setStatus("Template draft ready. Customize it, then save as a new profile.");
    });
  }

  if (createImportProfileButton) {
    createImportProfileButton.addEventListener("click", function chooseImportCreationPath() {
      openProfileTransferModal("import");
    });
  }

  if (createProfileFromTemplateButton) {
    createProfileFromTemplateButton.addEventListener("click", function createFromSelectedTemplate() {
      persistSelectedView("New profile saved.", false);
    });
  }

  if (starterViewGrid) {
    starterViewGrid.addEventListener("click", function chooseStarterView(event) {
      var card = event.target.closest("[data-starter-view-id]");

      if (!card) {
        return;
      }

      setOnboardingMode("preview", card.dataset.starterViewId);
      applyOnboardingDraftPreview();
    });
  }

  if (starterPreviewBackButton) {
    starterPreviewBackButton.addEventListener("click", function returnToStarterChooser() {
      setOnboardingMode("chooser");
    });
  }

  if (starterChooserBackButton) {
    starterChooserBackButton.addEventListener("click", function returnToProfilesFromStarterChooser() {
      openProfilesView("Choose an existing profile or start from template.");
    });
  }

  if (useStarterViewButton) {
    useStarterViewButton.addEventListener("click", function useStarterView() {
      saveStarterView(getStarterViewById(selectedStarterViewId));
    });
  }

  function getStarterMenuDropZone(target) {
    return target && target.closest ? target.closest("[data-starter-menu-drop-zone]") : null;
  }

  function getStarterMenuInsertIndex(event, dropZone) {
    var chip = event.target && event.target.closest ? event.target.closest("[data-starter-menu-key]") : null;
    var chips = dropZone ? Array.prototype.slice.call(dropZone.querySelectorAll("[data-starter-menu-key]")) : [];
    var index = chips.indexOf(chip);
    var rect = chip && chip.getBoundingClientRect ? chip.getBoundingClientRect() : null;
    var afterMidpoint = rect && (event.clientY > rect.top + rect.height / 2 || event.clientX > rect.left + rect.width / 2);

    if (!chip || index === -1) {
      return chips.length;
    }

    return afterMidpoint ? index + 1 : index;
  }

  function clearStarterMenuDropState() {
    [starterPreviewShownList, starterPreviewHiddenList].forEach(function clearStarterZone(zone) {
      if (!zone) {
        return;
      }
      zone.classList.remove("is-drop-target");
      zone.querySelectorAll(".is-dragging").forEach(function clearDragged(chip) {
        chip.classList.remove("is-dragging");
      });
    });
  }

  function updateStarterMenuVisibility(key, shouldShow, insertIndex) {
    var currentVisibleKeys = starterDraftVisibleKeys();
    var currentIndex = currentVisibleKeys.indexOf(key);
    var visibleKeys = currentVisibleKeys.filter(function keepOtherStarterKey(itemKey) {
      return itemKey !== key;
    });
    var nextIndex = Number(insertIndex);

    if (shouldShow && allMenuKeys.indexOf(key) !== -1) {
      if (Number.isNaN(nextIndex) || nextIndex < 0 || nextIndex > visibleKeys.length) {
        nextIndex = visibleKeys.length;
      } else if (currentIndex !== -1 && currentIndex < nextIndex) {
        nextIndex -= 1;
      }
      visibleKeys.splice(nextIndex, 0, key);
    }

    setStarterDraftVisibleKeys(visibleKeys);
    renderStarterPreview(getStarterViewById(selectedStarterViewId));
    applyOnboardingDraftPreview();
  }

  function attachStarterMenuEvents(container) {
    if (!container) {
      return;
    }

    container.addEventListener("click", function handleStarterMenuClick(event) {
      var key = event.target.dataset.starterMenuToggle;

      if (!key) {
        return;
      }

      updateStarterMenuVisibility(key, event.target.dataset.starterMenuVisible === "true");
    });

    container.addEventListener("dragstart", function handleStarterMenuDragStart(event) {
      var chip = event.target.closest("[data-starter-menu-key]");

      if (!chip) {
        return;
      }

      draggedStarterMenuKey = chip.dataset.starterMenuKey;
      chip.classList.add("is-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedStarterMenuKey);
      }
    });

    container.addEventListener("dragover", function handleStarterMenuDragOver(event) {
      var dropZone = getStarterMenuDropZone(event.target);

      if (!dropZone || !draggedStarterMenuKey) {
        return;
      }

      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      clearStarterMenuDropState();
      dropZone.classList.add("is-drop-target");
    });

    container.addEventListener("dragleave", function handleStarterMenuDragLeave(event) {
      var dropZone = getStarterMenuDropZone(event.target);

      if (dropZone && event.relatedTarget && dropZone.contains(event.relatedTarget)) {
        return;
      }
      if (dropZone) {
        dropZone.classList.remove("is-drop-target");
      }
    });

    container.addEventListener("drop", function handleStarterMenuDrop(event) {
      var dropZone = getStarterMenuDropZone(event.target);
      var draggedKey = draggedStarterMenuKey;
      var shouldShow = dropZone && dropZone.dataset.starterMenuDropZone === "visible";
      var insertIndex = shouldShow ? getStarterMenuInsertIndex(event, dropZone) : undefined;

      if (event.dataTransfer) {
        draggedKey = event.dataTransfer.getData("text/plain") || draggedKey;
      }
      if (!dropZone || !draggedKey) {
        clearStarterMenuDropState();
        draggedStarterMenuKey = "";
        return;
      }

      event.preventDefault();
      updateStarterMenuVisibility(draggedKey, shouldShow, insertIndex);
      clearStarterMenuDropState();
      draggedStarterMenuKey = "";
    });

    container.addEventListener("dragend", function handleStarterMenuDragEnd() {
      clearStarterMenuDropState();
      draggedStarterMenuKey = "";
    });
  }

  attachStarterMenuEvents(starterPreviewShownList);
  attachStarterMenuEvents(starterPreviewHiddenList);

  function refreshStarterColorStepPreview() {
    renderStarterPreview(getStarterViewById(selectedStarterViewId));
    applyOnboardingDraftPreview();
  }

  if (starterColorPresetList) {
    starterColorPresetList.addEventListener("click", function chooseStarterColorPreset(event) {
      var swatch = event.target.closest("[data-starter-color-preset]");
      var presetId = swatch && swatch.dataset.starterColorPreset;

      if (!swatch) {
        return;
      }

      if (presetId === "custom") {
        if (starterCustomColorPicker) {
          starterCustomColorPicker.focus();
          starterCustomColorPicker.click();
        }
        return;
      }

      updateStarterDraftColor(swatch.dataset.starterColor);
      refreshStarterColorStepPreview();
    });
  }

  if (starterCustomColorPicker) {
    starterCustomColorPicker.addEventListener("input", function chooseStarterCustomColor() {
      if (starterCustomColorValue) {
        starterCustomColorValue.value = starterCustomColorPicker.value;
      }
      updateStarterDraftColor(starterCustomColorPicker.value);
      refreshStarterColorStepPreview();
    });
  }

  if (starterCustomColorValue) {
    starterCustomColorValue.addEventListener("input", function editStarterCustomColorValue() {
      var normalizedValue = normalizeHexColor(starterCustomColorValue.value, "");

      if (!isValidHexColor(starterCustomColorValue.value)) {
        return;
      }

      starterCustomColorValue.value = normalizedValue;
      if (starterCustomColorPicker) {
        starterCustomColorPicker.value = normalizedValue;
      }
      updateStarterDraftColor(normalizedValue);
      refreshStarterColorStepPreview();
    });
  }

  if (starterTextColorMode) {
    starterTextColorMode.addEventListener("change", function chooseStarterTextColorMode() {
      updateStarterDraftTextColorMode(starterTextColorMode.value);
      refreshStarterColorStepPreview();
    });
  }

  if (starterViewNameInput) {
    starterViewNameInput.addEventListener("input", function updateStarterViewName() {
      updateStarterDraftName(starterViewNameInput.value);
    });
  }

  if (editStarterMenuButton) {
    editStarterMenuButton.addEventListener("click", function editStarterMenu() {
      openCreatedStarterMenuEditor();
    });
  }

  if (openStarterFullEditorButton) {
    openStarterFullEditorButton.addEventListener("click", function openStarterFullEditor() {
      openCreatedStarterFullEditor();
    });
  }

  if (doneStarterViewButton) {
    doneStarterViewButton.addEventListener("click", function finishStarterView() {
      finishStarterSuccessFlow();
    });
  }

  if (backToStarterSummaryButton) {
    backToStarterSummaryButton.addEventListener("click", function backToStarterSummary() {
      returnToStarterSuccessSummary();
    });
  }

  if (doneEditingStarterMenuButton) {
    doneEditingStarterMenuButton.addEventListener("click", function doneEditingStarterMenu() {
      finishStarterSuccessFlow();
    });
  }

  if (startFromViewButton) {
    startFromViewButton.addEventListener("click", function openStarterChooserFromProfiles() {
      starterFlowSource = "profiles";
      setOnboardingMode("chooser");
    });
  }

  if (changeStarterViewButton) {
    changeStarterViewButton.addEventListener("click", function openStarterChooserFromOverview() {
      openProfilesView("Choose an existing profile or start from template.");
    });
  }

  if (customizeActiveViewButton) {
    customizeActiveViewButton.addEventListener("click", function focusActiveViewEditor() {
      activeTab = "menu";
      renderTabState();
      setStatus("Customize the active view below.");
    });
  }

  if (overviewApplyLiveButton) {
    overviewApplyLiveButton.addEventListener("click", applyLiveToGhl);
  }

  if (overviewResetPageButton) {
    overviewResetPageButton.addEventListener("click", resetCurrentGhlPage);
  }

  if (reloadGhlTabButton) {
    reloadGhlTabButton.addEventListener("click", reloadCurrentGhlTab);
  }

  if (onboardingCreateFromTemplateButton) {
    onboardingCreateFromTemplateButton.addEventListener("click", function createFromOnboardingTemplate() {
      loadPresetIntoEditor(onboardingTemplateSelect.value || "builtin:simple");
      setStatus("Template draft ready. Customize it, then save as a new profile.");
    });
  }

  if (onboardingCreateBlankButton) {
    onboardingCreateBlankButton.addEventListener("click", function createBlankFromOnboarding() {
      loadPresetIntoEditor("builtin:blank", blankProfileName.value || "My CleanView");
      setStatus("Blank draft ready. Save as New Profile when you are ready.");
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
    refreshMenuGroupOptions();
    setStatus("All native menu items moved into Your Sidebar.");
    scheduleDirtyCheck();
  });

  document.getElementById("deselectAllMenusButton").addEventListener("click", function deselectAllMenus() {
    setMenuCheckboxes(false);
    refreshMenuGroupOptions();
    setStatus("All native menu items moved back to Available Items.");
    scheduleDirtyCheck();
  });

  document.getElementById("resetMenuDefaultsButton").addEventListener("click", function resetMenuDefaults() {
    resetMenuCheckboxesToPresetDefault();
    refreshMenuGroupOptions();
    setStatus("Menu Builder reset to the selected Profile default.");
    scheduleDirtyCheck();
  });

  document.getElementById("deletePresetButton").addEventListener("click", function deletePreset() {
    if (!isCustomPreset(selectedPreset())) {
      setStatus("Templates are read-only. Save this draft as a new profile before deleting anything.", true);
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
    scheduleDirtyCheck();
  });

  if (addMenuGroupButton) {
    addMenuGroupButton.addEventListener("click", function addMenuGroup() {
      if (menuGroupEditor.querySelector(".help-text")) {
        menuGroupEditor.querySelectorAll(":scope > .help-text").forEach(function removeEmptyState(emptyState) {
          emptyState.remove();
        });
      }
      appendMenuGroupCard({
        id: namespace.createId("group"),
        label: "New Group",
        items: [],
        collapsed: false
      });
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
    });
  }

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
    scheduleDirtyCheck();
  });

  document.getElementById("resetStyleButton").addEventListener("click", function resetStyle() {
    sidebarStylePreset.value = "default";
    applySidebarPresetToForm("default");
    setStatus("Sidebar style reset.");
    scheduleDirtyCheck();
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
        resetDirtyStateFromRenderedDraft();
      });
    }
    console.log("[AgencySkin CleanView] Profile selected:", {
      id: selectedPresetId,
      name: selectedPreset() && (selectedPreset().name || selectedPreset().label)
    });
    render();
    resetDirtyStateFromRenderedDraft();
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
      scheduleDirtyCheck();
    }
  });

  function handleMenuBuilderClick(event) {
    var card = event.target.closest("[data-menu-group-card='true']");

    if (!canEditSelectedPreset(selectedPreset())) {
      return;
    }

    if (event.target.dataset.deleteMenuGroup && card) {
      card.remove();
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
      return;
    }

    if (event.target.dataset.addMenuItem) {
      removeMenuKeyFromAllGroups(event.target.dataset.addMenuItem);
      setMenuKeyVisibleInEditor(event.target.dataset.addMenuItem, true);
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
      return;
    }

    if (event.target.dataset.hideMenuItem) {
      moveMenuKeyToGroup(event.target.dataset.hideMenuItem, "available");
      return;
    }

    if (event.target.dataset.removeGroupItem && card) {
      setMenuGroupItems(card, menuGroupItemsFromCard(card).filter(function keepItem(key) {
        return key !== event.target.dataset.removeGroupItem;
      }));
      refreshMenuGroupOptions();
      scheduleDirtyCheck();
    }
  }

  function attachMenuBuilderDragEvents(container) {
    if (!container) {
      return;
    }

    container.addEventListener("click", handleMenuBuilderClick);

    container.addEventListener("dragstart", function handleMenuGroupDragStart(event) {
      var chip = event.target.closest("[data-menu-group-drag-key]");

      if (!canEditSelectedPreset(selectedPreset()) || !chip || !chip.draggable) {
        return;
      }

      draggedMenuGroupKey = chip.dataset.menuGroupDragKey;
      chip.classList.add("is-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedMenuGroupKey);
      }
    });

    container.addEventListener("dragover", function handleMenuGroupDragOver(event) {
      var dropTarget = getMenuGroupDropTarget(event.target);

      if (!canEditSelectedPreset(selectedPreset()) || !draggedMenuGroupKey || !dropTarget) {
        return;
      }

      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      clearMenuGroupDropState();
      dropTarget.classList.add("is-drop-target");
    });

    container.addEventListener("dragleave", function handleMenuGroupDragLeave(event) {
      var dropTarget = event.target.closest ? event.target.closest("[data-menu-group-drop-target]") : null;

      if (dropTarget && event.relatedTarget && dropTarget.contains(event.relatedTarget)) {
        return;
      }
      if (dropTarget) {
        dropTarget.classList.remove("is-drop-target");
      }
    });

    container.addEventListener("drop", function handleMenuGroupDrop(event) {
      var dropTarget = getMenuGroupDropTarget(event.target);
      var draggedKey = draggedMenuGroupKey;
      var groupId = dropTarget ? dropTarget.dataset.menuGroupDropTarget : "";
      var insertIndex = dropTarget ? getMenuGroupInsertIndex(event, dropTarget) : undefined;

      if (event.dataTransfer) {
        draggedKey = event.dataTransfer.getData("text/plain") || draggedKey;
      }
      if (!canEditSelectedPreset(selectedPreset()) || !dropTarget || !draggedKey) {
        clearMenuGroupDropState();
        draggedMenuGroupKey = "";
        return;
      }

      event.preventDefault();
      moveMenuKeyToGroup(draggedKey, groupId, insertIndex);
      clearMenuGroupDropState();
      draggedMenuGroupKey = "";
    });

    container.addEventListener("dragend", function handleMenuGroupDragEnd() {
      clearMenuGroupDropState();
      draggedMenuGroupKey = "";
    });
  }

  attachMenuBuilderDragEvents(menuEditor);
  attachMenuBuilderDragEvents(menuGroupEditor);

  linkEditor.addEventListener("click", function handleLinkClick(event) {
    if (event.target.dataset.removeLinkId) {
      event.target.closest(".link-row").remove();
      scheduleDirtyCheck();
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
      setStatus("Custom image removed. " + saveHintText());
      scheduleDirtyCheck();
    }
    if (event.target.dataset.resetImagePosition) {
      var resetStyle = getCurrentWorkingSidebarStyle();
      resetStyle.imageSettings = Object.assign({}, resetStyle.imageSettings || {}, {
        positionX: 50,
        positionY: 50,
        scale: 1
      });
      populateSidebarStyleForm(resetStyle, { presetValue: "custom", optionLabel: "Custom Draft" });
      setStatus("Image position reset. " + saveHintText());
      scheduleDirtyCheck();
    }
  });

  if (globalSidebarStyleEditor) {
    globalSidebarStyleEditor.addEventListener("click", function handleGlobalSidebarStyleClick(event) {
      if (event.target.dataset.removeCustomLogo) {
        var style = getCurrentWorkingSidebarStyle();
        style.customLogoDataUrl = "";
        populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
        setStatus("Logo removed. " + saveHintText());
        scheduleDirtyCheck();
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
    if (sidebarBackgroundType.value === "none") {
      style.enabled = false;
      populateSidebarStyleForm(style, { presetValue: "custom", optionLabel: "Custom Draft" });
      return;
    }
    style.enabled = true;
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

  if (applyLiveButton) {
    applyLiveButton.addEventListener("click", saveThenApplyLive);
  }

  if (detectGhlSidebarButton) {
    detectGhlSidebarButton.addEventListener("click", detectGhlSidebar);
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
      if (!canEditSelectedPreset(selectedPreset())) {
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
        scheduleDirtyCheck();
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
