(function registerCleanViewPresets() {
  var namespace = window.agencySkinCleanView || {};
  var allMenuKeys = [
    "launchpad",
    "dashboard",
    "conversations",
    "calendars",
    "contacts",
    "opportunities",
    "payments",
    "ask_ai",
    "ai_studio",
    "ai_agents",
    "marketing",
    "automation",
    "sites",
    "memberships",
    "communities",
    "media",
    "reputation",
    "reporting",
    "app_marketplace",
    "mobile_app",
    "settings"
  ];
  var defaultSidebarStyle = {
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
  };
  var sidebarStylePresets = {
    default: Object.assign({ name: "Default" }, defaultSidebarStyle),
    cleanLight: {
      name: "Clean Light",
      enabled: true,
      preset: "cleanLight",
      backgroundType: "solid",
      backgroundColor: "#ffffff",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      textColor: "#111827",
      activeBackgroundColor: "#e5e7eb",
      activeTextColor: "#111827",
      hoverBackgroundColor: "#f3f4f6",
      borderRadius: "8px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    agencyDark: {
      name: "Agency Dark",
      enabled: true,
      preset: "agencyDark",
      backgroundType: "solid",
      backgroundColor: "#111827",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#374151",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1f2937",
      borderRadius: "8px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    navyPro: {
      name: "Navy Pro",
      enabled: true,
      preset: "navyPro",
      backgroundType: "solid",
      backgroundColor: "#0f172a",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#1d4ed8",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1e293b",
      borderRadius: "8px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    slateMinimal: {
      name: "Slate Minimal",
      enabled: true,
      preset: "slateMinimal",
      backgroundType: "solid",
      backgroundColor: "#1f2937",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      textColor: "#f9fafb",
      activeBackgroundColor: "#4b5563",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#374151",
      borderRadius: "6px",
      itemSpacing: "3px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    highContrast: {
      name: "High Contrast",
      enabled: true,
      preset: "highContrast",
      backgroundType: "solid",
      backgroundColor: "#000000",
      gradientStartColor: "",
      gradientEndColor: "",
      gradientDirection: "135deg",
      textColor: "#ffffff",
      activeBackgroundColor: "#ffffff",
      activeTextColor: "#000000",
      hoverBackgroundColor: "#333333",
      borderRadius: "4px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    midnightGradient: {
      name: "Midnight Gradient",
      enabled: true,
      preset: "midnightGradient",
      backgroundType: "gradient",
      backgroundColor: "#0f172a",
      gradientStartColor: "#020617",
      gradientEndColor: "#1d4ed8",
      gradientDirection: "135deg",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#2563eb",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1e293b",
      borderRadius: "8px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    },
    emeraldGradient: {
      name: "Emerald Gradient",
      enabled: true,
      preset: "emeraldGradient",
      backgroundType: "gradient",
      backgroundColor: "#064e3b",
      gradientStartColor: "#022c22",
      gradientEndColor: "#047857",
      gradientDirection: "135deg",
      textColor: "#ecfdf5",
      activeBackgroundColor: "#10b981",
      activeTextColor: "#052e16",
      hoverBackgroundColor: "#065f46",
      borderRadius: "8px",
      itemSpacing: "4px",
      sidebarPadding: "8px",
      logoUrl: "",
      headerLabel: ""
    }
  };

  function without(hiddenKeys) {
    var hiddenSet = new Set(hiddenKeys || []);
    return allMenuKeys.filter(function keepVisible(key) {
      return !hiddenSet.has(key);
    });
  }

  function stylePreset(presetKey) {
    return Object.assign({}, defaultSidebarStyle, sidebarStylePresets[presetKey] || sidebarStylePresets.default, { preset: presetKey || "default" });
  }

  namespace.builtInPresets = {
    "builtin:simple": {
      id: "builtin:simple",
      label: "Simple Template",
      name: "Simple Template",
      description: "A clean workspace with core day-to-day menu items.",
      source: "builtin",
      visibleItems: without(["memberships", "communities", "app_marketplace", "payments", "sites"]),
      labelOverrides: {
        opportunities: "Pipeline",
        conversations: "Inbox"
      },
      sidebarStyle: stylePreset("default")
    },
    "builtin:sales": {
      id: "builtin:sales",
      label: "Sales Template",
      name: "Sales Template",
      description: "Clean workspace for sales reps and appointment setters.",
      source: "builtin",
      visibleItems: without(["memberships", "communities", "app_marketplace", "sites"]),
      labelOverrides: {
        opportunities: "Pipeline",
        contacts: "Leads",
        conversations: "Inbox"
      },
      sidebarStyle: stylePreset("default")
    },
    "builtin:marketing": {
      id: "builtin:marketing",
      label: "Marketing Template",
      name: "Marketing Template",
      description: "Workspace focused on marketing, sites, and campaign work.",
      source: "builtin",
      visibleItems: without(["payments", "memberships", "communities", "app_marketplace"]),
      labelOverrides: {
        sites: "Pages & Funnels",
        contacts: "Leads"
      },
      sidebarStyle: stylePreset("default")
    },
    "builtin:admin": {
      id: "builtin:admin",
      label: "Admin Template",
      name: "Admin Template",
      description: "Administrative workspace with most standard tools visible.",
      source: "builtin",
      visibleItems: without(["communities", "memberships", "app_marketplace"]),
      labelOverrides: {
        opportunities: "Pipeline"
      },
      sidebarStyle: stylePreset("default")
    },
    "builtin:loan_officer": {
      id: "builtin:loan_officer",
      label: "Loan Officer Template",
      name: "Loan Officer Template",
      description: "Workspace for loan officers and mortgage teams.",
      source: "builtin",
      visibleItems: without(["memberships", "communities", "app_marketplace", "payments"]),
      labelOverrides: {
        opportunities: "Loan Pipeline",
        contacts: "Borrowers & Partners",
        conversations: "Inbox",
        calendars: "Consultations"
      },
      sidebarStyle: stylePreset("navyPro")
    },
    "builtin:blank": {
      id: "builtin:blank",
      label: "Blank Profile Template",
      name: "Blank Profile Template",
      description: "A starting point with no hidden items or label changes.",
      source: "builtin",
      visibleItems: allMenuKeys.slice(),
      labelOverrides: {},
      customLinks: [],
      sidebarStyle: stylePreset("default")
    }
  };

  namespace.allMenuKeys = allMenuKeys;
  namespace.defaultSidebarStyle = defaultSidebarStyle;
  namespace.sidebarStylePresets = sidebarStylePresets;
  window.agencySkinCleanView = namespace;
})();
