export const selectorRegistry = {
  menus: {
    // CSV selectors are the preferred source of truth. Existing guessed selectors stay as fallbacks
    // because GoHighLevel may change DOM selectors and this registry should be versioned over time.
    dashboard: {
      label: "Dashboard",
      category: "sidebar",
      primarySelectors: ["#sb_dashboard"],
      fallbackSelectors: ['[data-testid="sidebar-dashboard"]', 'a[href*="/dashboard"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    conversations: {
      label: "Conversations",
      category: "sidebar",
      primarySelectors: ["#sb_conversations"],
      fallbackSelectors: ['[data-testid="sidebar-conversations"]', 'a[href*="/conversations"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    calendars: {
      label: "Calendars",
      category: "sidebar",
      primarySelectors: ["#sb_calendars"],
      fallbackSelectors: ['[data-testid="sidebar-calendars"]', 'a[href*="/calendars"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    contacts: {
      label: "Contacts",
      category: "sidebar",
      primarySelectors: ["#sb_contacts"],
      fallbackSelectors: ['[data-testid="sidebar-contacts"]', 'a[href*="/contacts"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    opportunities: {
      label: "Opportunities",
      category: "sidebar",
      primarySelectors: ["#sb_opportunities"],
      fallbackSelectors: ['[data-testid="sidebar-opportunities"]', 'a[href*="/opportunities"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    payments: {
      label: "Payments",
      category: "sidebar",
      primarySelectors: ["#sb_payments"],
      fallbackSelectors: ['[data-testid="sidebar-payments"]', 'a[href*="/payments"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    marketing: {
      label: "Marketing",
      category: "sidebar",
      primarySelectors: ["#sb_email-marketing"],
      fallbackSelectors: ['[data-testid="sidebar-marketing"]', 'a[href*="/marketing"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    automation: {
      label: "Automation",
      category: "sidebar",
      primarySelectors: [],
      fallbackSelectors: ['[data-testid="sidebar-automation"]', 'a[href*="/automation"]'],
      allowedActions: ["hide", "show"],
      risk: "high"
    },
    sites: {
      label: "Sites",
      category: "sidebar",
      primarySelectors: ["#sb_sites"],
      fallbackSelectors: ['[data-testid="sidebar-sites"]', 'a[href*="/sites"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    reporting: {
      label: "Reporting",
      category: "sidebar",
      primarySelectors: ["#sb_reporting"],
      fallbackSelectors: ['[data-testid="sidebar-reporting"]', 'a[href*="/reporting"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    settings: {
      label: "Settings",
      category: "sidebar",
      primarySelectors: ["#sb_settings"],
      fallbackSelectors: ['[data-testid="sidebar-settings"]', 'a[href*="/settings"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    memberships: {
      label: "Memberships",
      category: "sidebar",
      primarySelectors: ["#sb_memberships"],
      fallbackSelectors: ['a[meta="memberships"]', 'a[href*="/memberships"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    reputation: {
      label: "Reputation",
      category: "sidebar",
      primarySelectors: ["#sb_reputation"],
      fallbackSelectors: ['a[href*="/reputation"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    app_marketplace: {
      label: "App Marketplace",
      category: "sidebar",
      primarySelectors: ["#sb_app-marketplace"],
      fallbackSelectors: ['a[href*="/marketplace"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    media: {
      label: "Media",
      category: "sidebar",
      primarySelectors: ["#sb_app-media"],
      fallbackSelectors: ['a[href*="/media"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    }
  },
  themeSelectors: {
    root: ":root",
    primaryColorVariable: "--agencyskin-primary-color",
    accentColorVariable: "--agencyskin-accent-color",
    backgroundColorVariable: "--agencyskin-background-color",
    sidebarContainer: ".hl_sidebar",
    topHeader: ".hl_topHeader",
    loginLogo: ".login__logo img",
    logoImage: '[data-testid="agency-logo"], .agency-logo img, .login__logo img'
  }
};
