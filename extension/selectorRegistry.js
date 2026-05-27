(function registerAgencySkinSelectors() {
  var namespace = window.agencySkinCleanView || {};

  namespace.selectorRegistry = {
    launchpad: {
      label: "Launchpad",
      selectors: ["#sb_launchpad", "[meta='launchpad']"]
    },
    dashboard: {
      label: "Dashboard",
      selectors: ["#sb_dashboard", "[meta='dashboard']"]
    },
    conversations: {
      label: "Conversations",
      selectors: ["#sb_conversations", "[meta='conversations']"]
    },
    calendars: {
      label: "Calendars",
      selectors: ["#sb_calendars", "[meta='calendars']"]
    },
    contacts: {
      label: "Contacts",
      selectors: ["#sb_contacts", "[meta='contacts']"]
    },
    opportunities: {
      label: "Opportunities",
      selectors: ["#sb_opportunities", "[meta='opportunities']"]
    },
    payments: {
      label: "Payments",
      selectors: ["#sb_payments", "[meta='payments']"]
    },
    ask_ai: {
      label: "Ask AI",
      selectors: ["#sb_ask-ai", "[meta='ask-ai']"]
    },
    ai_studio: {
      label: "AI Studio",
      selectors: ["#sb_vibe", "[meta='vibe']"]
    },
    ai_agents: {
      label: "AI Agents",
      selectors: ["[meta='AI Agents']", "#sb_AI\\ Agents"]
    },
    marketing: {
      label: "Marketing",
      selectors: ["#sb_email-marketing", "[meta='email-marketing']"]
    },
    automation: {
      label: "Automation",
      selectors: ["#sb_automation", "[meta='automation']"]
    },
    sites: {
      label: "Sites",
      selectors: ["#sb_sites", "[meta='sites']"]
    },
    memberships: {
      label: "Memberships",
      selectors: ["#sb_memberships", "[meta='memberships']"]
    },
    communities: {
      label: "Communities",
      selectors: ["#sb_communities", "[meta='communities']"]
    },
    media: {
      label: "Media Storage",
      selectors: ["#sb_app-media", "[meta='app-media']"]
    },
    reputation: {
      label: "Reputation",
      selectors: ["#sb_reputation", "[meta='reputation']"]
    },
    reporting: {
      label: "Reporting",
      selectors: ["#sb_reporting", "[meta='reporting']"]
    },
    app_marketplace: {
      label: "App Marketplace",
      selectors: ["#sb_app-marketplace", "[meta='app-marketplace']"]
    },
    mobile_app: {
      label: "Mobile App",
      selectors: ["#sb_location-mobile-app", "[meta='location-mobile-app']"]
    },
    settings: {
      label: "Settings",
      selectors: ["#sb_settings", "[meta='settings']"]
    }
  };

  namespace.allMenuKeys = Object.keys(namespace.selectorRegistry);
  window.agencySkinCleanView = namespace;
})();
