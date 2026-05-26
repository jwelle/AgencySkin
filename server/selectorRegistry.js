export const selectorRegistry = {
  menus: {
    // Live DOM audit selectors are preferred. Stable attribute/href selectors stay as fallbacks
    // because GoHighLevel may change DOM selectors and this registry should be versioned over time.
    launchpad: {
      label: "Launchpad",
      category: "sidebar",
      primarySelectors: ["#sb_launchpad"],
      fallbackSelectors: ['[meta="launchpad"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    dashboard: {
      label: "Dashboard",
      category: "sidebar",
      primarySelectors: ["#sb_dashboard"],
      fallbackSelectors: ['[meta="dashboard"]', 'a[href*="/dashboard"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    conversations: {
      label: "Conversations",
      category: "sidebar",
      primarySelectors: ["#sb_conversations"],
      fallbackSelectors: ['[meta="conversations"]', 'a[href*="/conversations"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    calendars: {
      label: "Calendars",
      category: "sidebar",
      primarySelectors: ["#sb_calendars"],
      fallbackSelectors: ['[meta="calendars"]', 'a[href*="/calendars"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    contacts: {
      label: "Contacts",
      category: "sidebar",
      primarySelectors: ["#sb_contacts"],
      fallbackSelectors: ['[meta="contacts"]', 'a[href*="/contacts"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    opportunities: {
      label: "Opportunities",
      category: "sidebar",
      primarySelectors: ["#sb_opportunities"],
      fallbackSelectors: ['[meta="opportunities"]', 'a[href*="/opportunities"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    payments: {
      label: "Payments",
      category: "sidebar",
      primarySelectors: ["#sb_payments"],
      fallbackSelectors: ['[meta="payments"]', 'a[href*="/payments"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    ask_ai: {
      label: "Ask AI",
      category: "sidebar",
      primarySelectors: ["#sb_ask-ai"],
      fallbackSelectors: ['[meta="ask-ai"]', 'a[href*="/ask-ai"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    ai_studio: {
      label: "AI Studio",
      category: "sidebar",
      primarySelectors: ["#sb_vibe"],
      fallbackSelectors: ['[meta="vibe"]', 'a[href*="/vibe"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    ai_agents: {
      label: "AI Agents",
      category: "sidebar",
      primarySelectors: ['[meta="AI Agents"]'],
      fallbackSelectors: ["#sb_AI\\ Agents", 'a[href*="/ai-agents"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    marketing: {
      label: "Marketing",
      category: "sidebar",
      primarySelectors: ["#sb_email-marketing"],
      fallbackSelectors: ['[meta="email-marketing"]', 'a[href*="/marketing"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    automation: {
      label: "Automation",
      category: "sidebar",
      primarySelectors: ["#sb_automation"],
      fallbackSelectors: ['[meta="automation"]', 'a[href*="/automation"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    sites: {
      label: "Sites",
      category: "sidebar",
      primarySelectors: ["#sb_sites"],
      fallbackSelectors: ['[meta="sites"]', 'a[href*="/sites"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    memberships: {
      label: "Memberships",
      category: "sidebar",
      primarySelectors: ["#sb_memberships"],
      fallbackSelectors: ['[meta="memberships"]', 'a[href*="/memberships"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    media: {
      label: "Media Storage",
      category: "sidebar",
      primarySelectors: ["#sb_app-media"],
      fallbackSelectors: ['[meta="app-media"]', 'a[href*="/media-storage"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    reputation: {
      label: "Reputation",
      category: "sidebar",
      primarySelectors: ["#sb_reputation"],
      fallbackSelectors: ['[meta="reputation"]', 'a[href*="/reputation"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    reporting: {
      label: "Reporting",
      category: "sidebar",
      primarySelectors: ["#sb_reporting"],
      fallbackSelectors: ['[meta="reporting"]', 'a[href*="/reporting"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    app_marketplace: {
      label: "App Marketplace",
      category: "sidebar",
      primarySelectors: ["#sb_app-marketplace"],
      fallbackSelectors: ['[meta="app-marketplace"]', 'a[href*="/integration"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    mobile_app: {
      label: "Mobile App",
      category: "sidebar",
      primarySelectors: ["#sb_location-mobile-app"],
      fallbackSelectors: ['[meta="location-mobile-app"]', 'a[href*="/mobile_app"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    },
    settings: {
      label: "Settings",
      category: "sidebar",
      primarySelectors: ["#sb_settings"],
      fallbackSelectors: ['[meta="settings"]', 'a[href*="/settings"]'],
      allowedActions: ["hide", "show"],
      risk: "medium"
    }
  },
  themeSelectors: {
    root: ":root",
    primaryColorVariable: "--agencyskin-primary-color",
    accentColorVariable: "--agencyskin-accent-color",
    backgroundColorVariable: "--agencyskin-background-color",
    // The live DOM audit found #sidebar-v2 and did not find .hl_sidebar on the tested page.
    sidebarContainer: {
      primarySelectors: ["#sidebar-v2"],
      fallbackSelectors: [".hl_sidebar"]
    },
    topHeader: ".hl_topHeader",
    loginLogo: ".login__logo img",
    logoImage: '[data-testid="agency-logo"], .agency-logo img, .login__logo img'
  }
};
