import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const menuLabels = {
  launchpad: "Launchpad",
  dashboard: "Dashboard",
  conversations: "Conversations",
  calendars: "Calendars",
  contacts: "Contacts",
  opportunities: "Opportunities",
  payments: "Payments",
  ask_ai: "Ask AI",
  ai_studio: "AI Studio",
  ai_agents: "AI Agents",
  marketing: "Marketing",
  automation: "Automation",
  sites: "Sites",
  memberships: "Memberships",
  media: "Media Storage",
  reputation: "Reputation",
  reporting: "Reporting",
  app_marketplace: "App Marketplace",
  mobile_app: "Mobile App",
  settings: "Settings"
};

const menuPresetDefinitions = {
  admin: {
    label: "Admin View",
    visibleMenus: Object.keys(menuLabels)
  },
  show_all: {
    label: "Show All",
    visibleMenus: Object.keys(menuLabels)
  },
  simple_client: {
    label: "Simple Client View",
    visibleMenus: ["dashboard", "conversations", "calendars", "contacts"]
  },
  sales_team: {
    label: "Sales Team View",
    visibleMenus: ["dashboard", "conversations", "calendars", "contacts", "opportunities"]
  },
  marketing: {
    label: "Marketing View",
    visibleMenus: ["dashboard", "marketing", "automation", "sites", "media"]
  },
  minimal: {
    label: "Minimal View",
    visibleMenus: ["dashboard"]
  }
};

const sidebarThemePresetDefinitions = {
  clean_dark: {
    label: "Clean Dark",
    theme: {
      sidebarBackground: "#111827",
      sidebarText: "#ffffff",
      sidebarHover: "#1f2937",
      sidebarHoverText: "#ffffff",
      sidebarActive: "#3368db",
      sidebarActiveText: "#ffffff"
    }
  },
  light_blue: {
    label: "Light Blue",
    theme: {
      sidebarBackground: "#f8fafc",
      sidebarText: "#0f172a",
      sidebarHover: "#e0f2fe",
      sidebarHoverText: "#0f172a",
      sidebarActive: "#2563eb",
      sidebarActiveText: "#ffffff"
    }
  },
  slate_pro: {
    label: "Slate Pro",
    theme: {
      sidebarBackground: "#0f172a",
      sidebarText: "#cbd5e1",
      sidebarHover: "#1e293b",
      sidebarHoverText: "#ffffff",
      sidebarActive: "#475569",
      sidebarActiveText: "#ffffff"
    }
  },
  emerald: {
    label: "Emerald",
    theme: {
      sidebarBackground: "#052e2b",
      sidebarText: "#d1fae5",
      sidebarHover: "#064e3b",
      sidebarHoverText: "#ffffff",
      sidebarActive: "#10b981",
      sidebarActiveText: "#052e2b"
    }
  },
  neutral_minimal: {
    label: "Neutral Minimal",
    theme: {
      sidebarBackground: "#ffffff",
      sidebarText: "#374151",
      sidebarHover: "#f3f4f6",
      sidebarHoverText: "#111827",
      sidebarActive: "#111827",
      sidebarActiveText: "#ffffff"
    }
  }
};

const menuSelectorRegistry = {
  // Live DOM audit selectors are preferred. Stable attribute/href selectors are retained as fallbacks because
  // GoHighLevel DOM selectors can change and this registry should be versioned over time.
  launchpad: {
    primarySelectors: ["#sb_launchpad"],
    fallbackSelectors: ['[meta="launchpad"]']
  },
  dashboard: {
    primarySelectors: ["#sb_dashboard"],
    fallbackSelectors: ['[meta="dashboard"]', 'a[href*="/dashboard"]']
  },
  conversations: {
    primarySelectors: ["#sb_conversations"],
    fallbackSelectors: ['[meta="conversations"]', 'a[href*="/conversations"]']
  },
  calendars: {
    primarySelectors: ["#sb_calendars"],
    fallbackSelectors: ['[meta="calendars"]', 'a[href*="/calendars"]']
  },
  contacts: {
    primarySelectors: ["#sb_contacts"],
    fallbackSelectors: ['[meta="contacts"]', 'a[href*="/contacts"]']
  },
  opportunities: {
    primarySelectors: ["#sb_opportunities"],
    fallbackSelectors: ['[meta="opportunities"]', 'a[href*="/opportunities"]']
  },
  payments: {
    primarySelectors: ["#sb_payments"],
    fallbackSelectors: ['[meta="payments"]', 'a[href*="/payments"]']
  },
  ask_ai: {
    primarySelectors: ["#sb_ask-ai"],
    fallbackSelectors: ['[meta="ask-ai"]', 'a[href*="/ask-ai"]']
  },
  ai_studio: {
    primarySelectors: ["#sb_vibe"],
    fallbackSelectors: ['[meta="vibe"]', 'a[href*="/vibe"]']
  },
  ai_agents: {
    primarySelectors: ['[meta="AI Agents"]'],
    fallbackSelectors: ["#sb_AI\\ Agents", 'a[href*="/ai-agents"]']
  },
  marketing: {
    primarySelectors: ["#sb_email-marketing"],
    fallbackSelectors: ['[meta="email-marketing"]', 'a[href*="/marketing"]']
  },
  automation: {
    primarySelectors: ["#sb_automation"],
    fallbackSelectors: ['[meta="automation"]', 'a[href*="/automation"]']
  },
  sites: {
    primarySelectors: ["#sb_sites"],
    fallbackSelectors: ['[meta="sites"]', 'a[href*="/sites"]']
  },
  memberships: {
    primarySelectors: ["#sb_memberships"],
    fallbackSelectors: ['[meta="memberships"]', 'a[href*="/memberships"]']
  },
  media: {
    primarySelectors: ["#sb_app-media"],
    fallbackSelectors: ['[meta="app-media"]', 'a[href*="/media-storage"]']
  },
  reputation: {
    primarySelectors: ["#sb_reputation"],
    fallbackSelectors: ['[meta="reputation"]', 'a[href*="/reputation"]']
  },
  reporting: {
    primarySelectors: ["#sb_reporting"],
    fallbackSelectors: ['[meta="reporting"]', 'a[href*="/reporting"]']
  },
  app_marketplace: {
    primarySelectors: ["#sb_app-marketplace"],
    fallbackSelectors: ['[meta="app-marketplace"]', 'a[href*="/integration"]']
  },
  mobile_app: {
    primarySelectors: ["#sb_location-mobile-app"],
    fallbackSelectors: ['[meta="location-mobile-app"]', 'a[href*="/mobile_app"]']
  },
  settings: {
    primarySelectors: ["#sb_settings"],
    fallbackSelectors: ['[meta="settings"]', 'a[href*="/settings"]']
  }
};

const emptySettings = {
  enabled: true,
  published: false,
  theme: {
    primaryColor: "#2563eb",
    accentColor: "#14b8a6",
    backgroundColor: "#ffffff",
    includeSidebarTheme: true,
    sidebarBackground: "",
    sidebarText: "#ffffff",
    sidebarHover: "",
    sidebarHoverText: "#ffffff",
    sidebarActive: "",
    sidebarActiveText: "#ffffff",
    logoUrl: ""
  },
  menus: Object.fromEntries(Object.keys(menuLabels).map((key) => [key, true]))
};

function mergeLoadedSettings(data) {
  return {
    ...emptySettings,
    ...data,
    theme: {
      ...emptySettings.theme,
      ...(data.theme || {})
    },
    menus: {
      ...emptySettings.menus,
      ...(data.menus || {})
    }
  };
}

function getMenuSelectors(key) {
  const entry = menuSelectorRegistry[key];
  return entry ? [...entry.primarySelectors, ...entry.fallbackSelectors] : [];
}

function resolveTheme(settingsTheme) {
  const theme = { ...emptySettings.theme, ...(settingsTheme || {}) };
  return {
    ...theme,
    sidebarBackground: theme.sidebarBackground || theme.backgroundColor,
    sidebarText: theme.sidebarText || "#ffffff",
    sidebarHover: theme.sidebarHover || theme.accentColor,
    sidebarHoverText: theme.sidebarHoverText || "#ffffff",
    sidebarActive: theme.sidebarActive || theme.primaryColor,
    sidebarActiveText: theme.sidebarActiveText || "#ffffff"
  };
}

function generateInstallCode(locationId, settings) {
  const theme = resolveTheme(settings.theme);
  const menus = { ...emptySettings.menus, ...(settings.menus || {}) };
  const hiddenMenuEntries = Object.entries(menus).filter(([, isVisible]) => isVisible === false);
  const safeLogoUrlComment = String(theme.logoUrl || "")
    .replace(/\*\//g, "* /")
    .replace(/[\r\n]/g, " ");
  const warnings = [];
  const cssLines = [
    "/* AgencySkin Generated CSS */",
    "/* Paste this into GoHighLevel Custom CSS */",
    "/* Best used with your GoHighLevel white-label domain. */",
    "",
    ":root {",
    `  --agencyskin-primary: ${theme.primaryColor};`,
    `  --agencyskin-accent: ${theme.accentColor};`,
    `  --agencyskin-background: ${theme.backgroundColor};`,
    `  --agencyskin-sidebar-background: ${theme.sidebarBackground};`,
    `  --agencyskin-sidebar-text: ${theme.sidebarText};`,
    `  --agencyskin-sidebar-hover: ${theme.sidebarHover};`,
    `  --agencyskin-sidebar-hover-text: ${theme.sidebarHoverText};`,
    `  --agencyskin-sidebar-active: ${theme.sidebarActive};`,
    `  --agencyskin-sidebar-active-text: ${theme.sidebarActiveText};`,
    "}"
  ];

  if (menus.settings === false) {
    warnings.push("You are hiding Settings. Make sure you can still access GHL settings another way before using this CSS.");
  }

  if (safeLogoUrlComment) {
    cssLines.push("", `/* Logo URL saved in AgencySkin: ${safeLogoUrlComment} */`);
  }

  if (theme.includeSidebarTheme !== false) {
    cssLines.push(
      "",
      "/* AgencySkin Sidebar Theme */",
      "",
      "/* Sidebar container */",
      "#sidebar-v2 {",
      "  background: var(--agencyskin-sidebar-background) !important;",
      "}",
      "",
      "/* Sidebar links */",
      '#sidebar-v2 a[id^="sb_"] {',
      "  color: var(--agencyskin-sidebar-text) !important;",
      "}",
      "",
      "/* Sidebar icons and text */",
      '#sidebar-v2 a[id^="sb_"] svg,',
      '#sidebar-v2 a[id^="sb_"] span {',
      "  color: var(--agencyskin-sidebar-text) !important;",
      "}",
      "",
      "/* Sidebar hover */",
      '#sidebar-v2 a[id^="sb_"]:hover {',
      "  background: var(--agencyskin-sidebar-hover) !important;",
      "  color: var(--agencyskin-sidebar-hover-text) !important;",
      "}",
      "",
      '#sidebar-v2 a[id^="sb_"]:hover svg,',
      '#sidebar-v2 a[id^="sb_"]:hover span {',
      "  color: var(--agencyskin-sidebar-hover-text) !important;",
      "}",
      "",
      "/* Active sidebar item */",
      '#sidebar-v2 a[id^="sb_"].active {',
      "  background: var(--agencyskin-sidebar-active) !important;",
      "  color: var(--agencyskin-sidebar-active-text) !important;",
      "}",
      "",
      '#sidebar-v2 a[id^="sb_"].active svg,',
      '#sidebar-v2 a[id^="sb_"].active span {',
      "  color: var(--agencyskin-sidebar-active-text) !important;",
      "}"
    );
  }

  cssLines.push("", "/* Hide selected GoHighLevel menu items */");

  if (hiddenMenuEntries.length === 0) {
    cssLines.push("/* No hidden menu items selected. */");
  }

  hiddenMenuEntries.forEach(([key]) => {
    const selectors = getMenuSelectors(key);

    if (selectors.length === 0) {
      const warning = `No selector registered yet for: ${menuLabels[key] || key}`;
      warnings.push(warning);
      cssLines.push(`/* ${warning} */`);
      return;
    }

    cssLines.push("", `/* Hide ${menuLabels[key]} */`, `${selectors.join(",\n")} {`, "  display: none !important;", "}");
  });

  return {
    css: cssLines.join("\n"),
    loaderScript: "",
    warnings
  };
}

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [settings, setSettings] = useState(emptySettings);
  const [installCode, setInstallCode] = useState({ css: "", loaderScript: "", warnings: [] });
  const [copyStatus, setCopyStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId),
    [locations, selectedLocationId]
  );

  useEffect(() => {
    async function loadLocations() {
      setIsLoading(true);
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data);
      setSelectedLocationId(data[0]?.id || "");
      setIsLoading(false);
    }

    loadLocations().catch(() => {
      setStatus("Unable to load sample locations.");
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedLocationId) {
      return;
    }

    async function loadSettings() {
      setStatus("");
      setCopyStatus("");
      setInstallCode({ css: "", loaderScript: "", warnings: [] });
      const response = await fetch(`/api/locations/${selectedLocationId}/settings`);
      const data = await response.json();
      setSettings(mergeLoadedSettings(data));
    }

    loadSettings().catch(() => setStatus("Unable to load location settings."));
  }, [selectedLocationId]);

  function updateTheme(key, value) {
    setSettings((current) => ({
      ...current,
      theme: {
        ...current.theme,
        [key]: value
      }
    }));
  }

  function updateMenu(key, value) {
    setSettings((current) => ({
      ...current,
      menus: {
        ...current.menus,
        [key]: value
      }
    }));
  }

  function applyMenuPreset(presetKey) {
    const preset = menuPresetDefinitions[presetKey];

    if (!preset) {
      return;
    }

    const visibleMenuSet = new Set(preset.visibleMenus);

    setSettings((current) => ({
      ...current,
      menus: Object.fromEntries(Object.keys(menuLabels).map((key) => [key, visibleMenuSet.has(key)]))
    }));
    setStatus(`${preset.label} applied.`);
    setCopyStatus("");
  }

  function applyThemePreset(presetKey) {
    const preset = sidebarThemePresetDefinitions[presetKey];

    if (!preset) {
      return;
    }

    setSettings((current) => ({
      ...current,
      theme: {
        ...current.theme,
        ...preset.theme
      }
    }));
    setStatus(`${preset.label} theme applied.`);
    setCopyStatus("");
  }

  async function persistSettings(action, path, payload = settings) {
    if (!selectedLocationId) {
      return;
    }

    setIsSaving(true);
    setStatus("");

    try {
      const response = await fetch(`/api/locations/${selectedLocationId}${path}`, {
        method: action === "save" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: action === "save" ? JSON.stringify(payload) : undefined
      });
      const data = await response.json();
      setSettings(data);
      setStatus(action);
    } catch {
      setStatus("Unable to complete request.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleGenerateInstallCode() {
    if (!selectedLocationId) {
      setCopyStatus("Nothing to copy yet");
      return;
    }

    const menus = { ...emptySettings.menus, ...(settings.menus || {}) };
    const hasVisibleMenu = Object.keys(menuLabels).some((key) => menus[key] !== false);

    if (!hasVisibleMenu) {
      setCopyStatus("");
      setStatus("At least one menu item must remain visible. Unhide at least one item before generating CSS.");
      return;
    }

    try {
      const generated = generateInstallCode(selectedLocationId, settings);
      setInstallCode(generated);
      setCopyStatus("");
      setStatus("CSS generated.");
    } catch (error) {
      console.error("[AgencySkin] Unable to generate CSS.", error);
      setInstallCode({ css: "", loaderScript: "", warnings: [] });
      setCopyStatus("");
      setStatus("Unable to generate CSS. Check the selector registry.");
    }
  }

  async function copyToClipboard(value, target) {
    if (!value) {
      setCopyStatus("Nothing to copy yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${target} copied`);
    } catch {
      setCopyStatus("Copy failed");
    }
  }

  if (isLoading) {
    return <main className="app-shell">Loading AgencySkin...</main>;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">White-label controls</p>
          <h1>AgencySkin dashboard</h1>
        </div>
        <span className={settings.enabled ? "status-pill active" : "status-pill"}>
          {settings.enabled ? "Customizations enabled" : "Customizations disabled"}
        </span>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={selectedLocationId}
            onChange={(event) => setSelectedLocationId(event.target.value)}
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          {selectedLocation ? (
            <div className="location-summary">
              <strong>{selectedLocation.agency}</strong>
              <span>
                {selectedLocation.city}, {selectedLocation.state}
              </span>
            </div>
          ) : null}
        </aside>

        <section className="panel-grid">
          <section className="panel">
            <div className="panel-header">
              <h2>Theme Builder</h2>
              <span>{settings.published ? "Published" : "Draft"}</span>
            </div>

            <div className="preset-controls">
              <p className="preset-helper">
                Sidebar theme profiles update only the GoHighLevel sidebar colors.
              </p>
              <div className="preset-list" aria-label="Sidebar theme presets">
                {Object.entries(sidebarThemePresetDefinitions).map(([key, preset]) => (
                  <button key={key} type="button" onClick={() => applyThemePreset(key)}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="checkbox-row">
              <span>Include sidebar theme styling</span>
              <input
                type="checkbox"
                checked={settings.theme.includeSidebarTheme !== false}
                onChange={(event) => updateTheme("includeSidebarTheme", event.target.checked)}
              />
            </label>

            <div className="field-row">
              <label htmlFor="primaryColor">Primary</label>
              <input
                id="primaryColor"
                type="color"
                value={settings.theme.primaryColor}
                onChange={(event) => updateTheme("primaryColor", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="accentColor">Accent</label>
              <input
                id="accentColor"
                type="color"
                value={settings.theme.accentColor}
                onChange={(event) => updateTheme("accentColor", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="backgroundColor">Background</label>
              <input
                id="backgroundColor"
                type="color"
                value={settings.theme.backgroundColor}
                onChange={(event) => updateTheme("backgroundColor", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarBackground">Sidebar background</label>
              <input
                id="sidebarBackground"
                type="color"
                value={resolveTheme(settings.theme).sidebarBackground}
                onChange={(event) => updateTheme("sidebarBackground", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarText">Sidebar text</label>
              <input
                id="sidebarText"
                type="color"
                value={resolveTheme(settings.theme).sidebarText}
                onChange={(event) => updateTheme("sidebarText", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarHover">Sidebar hover background</label>
              <input
                id="sidebarHover"
                type="color"
                value={resolveTheme(settings.theme).sidebarHover}
                onChange={(event) => updateTheme("sidebarHover", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarHoverText">Sidebar hover text</label>
              <input
                id="sidebarHoverText"
                type="color"
                value={resolveTheme(settings.theme).sidebarHoverText}
                onChange={(event) => updateTheme("sidebarHoverText", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarActive">Active item background</label>
              <input
                id="sidebarActive"
                type="color"
                value={resolveTheme(settings.theme).sidebarActive}
                onChange={(event) => updateTheme("sidebarActive", event.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="sidebarActiveText">Active item text</label>
              <input
                id="sidebarActiveText"
                type="color"
                value={resolveTheme(settings.theme).sidebarActiveText}
                onChange={(event) => updateTheme("sidebarActiveText", event.target.value)}
              />
            </div>

            <label className="stacked-field" htmlFor="logoUrl">
              Logo URL
              <input
                id="logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                value={settings.theme.logoUrl}
                onChange={(event) => updateTheme("logoUrl", event.target.value)}
              />
            </label>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Menu Manager</h2>
              <span>{Object.values(settings.menus).filter(Boolean).length} visible</span>
            </div>

            <div className="preset-controls">
              <p className="preset-helper">
                Presets quickly choose which GHL menu items are visible. You can adjust individual
                toggles after selecting a preset.
              </p>
              <div className="preset-list" aria-label="Menu visibility presets">
                {Object.entries(menuPresetDefinitions).map(([key, preset]) => (
                  <button
                    className={key === "show_all" ? "preset-button-secondary" : undefined}
                    key={key}
                    type="button"
                    onClick={() => applyMenuPreset(key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-list">
              {Object.entries(menuLabels).map(([key, label]) => (
                <label className="toggle-row" key={key}>
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.menus[key])}
                    onChange={(event) => updateMenu(key, event.target.checked)}
                  />
                </label>
              ))}
            </div>
          </section>
        </section>
      </section>

      <footer className="action-bar">
        <button disabled={isSaving} onClick={() => persistSettings("save", "/settings")}>
          Save Settings
        </button>
        <button disabled={isSaving} onClick={() => persistSettings("publish", "/publish")}>
          Publish
        </button>
        <button disabled={isSaving} onClick={() => persistSettings("disable", "/disable")}>
          Disable Customizations
        </button>
        <button disabled={isSaving} onClick={() => persistSettings("reset", "/reset")}>
          Reset to Default
        </button>
        <p className="action-helper">
          Save Settings stores your choices in this app. Generate CSS creates copy/paste CSS from the
          current screen. Publish is reserved for a future hosted-loader workflow.
        </p>
        {status ? <span className="save-status">{status}</span> : null}
      </footer>

      <section className="install-section panel">
        <div className="panel-header">
          <div>
            <h2>Install Code</h2>
            <p>
              Copy this CSS into GoHighLevel Custom CSS. This MVP uses copy/paste CSS. Save Settings
              stores your choices in this app, but the generated CSS is what changes GoHighLevel.
            </p>
          </div>
          <button type="button" onClick={handleGenerateInstallCode}>
            Generate CSS
          </button>
        </div>

        <p className="domain-warning">
          Dashboard/sidebar CSS customizations are intended for your GoHighLevel white-label domain.
          If users log in through app.gohighlevel.com instead of your branded domain, some changes may
          not appear.
        </p>

        <label className="code-field" htmlFor="generatedCss">
          Generated CSS
          <textarea id="generatedCss" readOnly value={installCode.css} />
        </label>
        <button type="button" onClick={() => copyToClipboard(installCode.css, "CSS")}>
          Copy CSS
        </button>

        <div className="loader-snippet">
          <div>
            <h3>Experimental Future Loader</h3>
            <p>
              Not part of the current CSS-first MVP. Use the generated CSS above for GoHighLevel.
            </p>
          </div>
        </div>

        {installCode.warnings.length > 0 ? (
          <ul className="warning-list">
            {installCode.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        <p className="install-warning">
          The current MVP uses copy/paste CSS. The hosted loader script is experimental and reserved
          for a future version.
        </p>
        {copyStatus ? <span className="save-status">{copyStatus}</span> : null}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
