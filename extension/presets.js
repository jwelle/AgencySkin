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
    backgroundColor: "",
    textColor: "",
    activeBackgroundColor: "",
    activeTextColor: "",
    hoverBackgroundColor: "",
    borderRadius: "",
    itemSpacing: "",
    sidebarPadding: "",
    logoUrl: "",
    headerLabel: ""
  };
  var sidebarStylePresets = {
    default: Object.assign({ name: "Default" }, defaultSidebarStyle),
    cleanLight: {
      name: "Clean Light",
      enabled: true,
      preset: "cleanLight",
      backgroundColor: "#ffffff",
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
      backgroundColor: "#111827",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#374151",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.08)",
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
      backgroundColor: "#0f172a",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#1d4ed8",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.08)",
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
      backgroundColor: "#1f2937",
      textColor: "#f9fafb",
      activeBackgroundColor: "#4b5563",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.10)",
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
      backgroundColor: "#000000",
      textColor: "#ffffff",
      activeBackgroundColor: "#ffffff",
      activeTextColor: "#000000",
      hoverBackgroundColor: "#333333",
      borderRadius: "4px",
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
      label: "Simple View",
      name: "Simple View",
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
      label: "Sales View",
      name: "Sales View",
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
      label: "Marketing View",
      name: "Marketing View",
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
      label: "Admin View",
      name: "Admin View",
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
      label: "Loan Officer View",
      name: "Loan Officer View",
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
      label: "Blank Custom View",
      name: "Blank Custom View",
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
