(function registerAgencySkinPresets() {
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
    "media",
    "reputation",
    "reporting",
    "app_marketplace",
    "mobile_app",
    "settings"
  ];

  window.AgencySkinPresets = {
    admin: {
      label: "Admin View",
      visibleItems: allMenuKeys.slice()
    },
    simple_client: {
      label: "Simple Client View",
      visibleItems: ["dashboard", "conversations", "calendars", "contacts"]
    },
    sales_team: {
      label: "Sales Team View",
      visibleItems: ["dashboard", "conversations", "calendars", "contacts", "opportunities"]
    },
    marketing: {
      label: "Marketing View",
      visibleItems: ["dashboard", "marketing", "automation", "sites", "media"]
    },
    minimal: {
      label: "Minimal View",
      visibleItems: ["dashboard"]
    }
  };

  window.AgencySkinAllMenuKeys = allMenuKeys;
})();
