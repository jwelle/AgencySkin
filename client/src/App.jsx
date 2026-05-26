import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const menuLabels = {
  dashboard: "Dashboard",
  conversations: "Conversations",
  calendars: "Calendars",
  contacts: "Contacts",
  opportunities: "Opportunities",
  payments: "Payments",
  marketing: "Marketing",
  automation: "Automation",
  sites: "Sites",
  reporting: "Reporting",
  settings: "Settings",
  memberships: "Memberships",
  reputation: "Reputation",
  app_marketplace: "App Marketplace",
  media: "Media"
};

const menuSelectorRegistry = {
  // CSV selectors are preferred. Existing guessed selectors are retained as fallbacks because
  // GoHighLevel DOM selectors can change and this registry should be versioned over time.
  dashboard: {
    primarySelectors: ["#sb_dashboard"],
    fallbackSelectors: ['[data-testid="sidebar-dashboard"]', 'a[href*="/dashboard"]']
  },
  conversations: {
    primarySelectors: ["#sb_conversations"],
    fallbackSelectors: ['[data-testid="sidebar-conversations"]', 'a[href*="/conversations"]']
  },
  calendars: {
    primarySelectors: ["#sb_calendars"],
    fallbackSelectors: ['[data-testid="sidebar-calendars"]', 'a[href*="/calendars"]']
  },
  contacts: {
    primarySelectors: ["#sb_contacts"],
    fallbackSelectors: ['[data-testid="sidebar-contacts"]', 'a[href*="/contacts"]']
  },
  opportunities: {
    primarySelectors: ["#sb_opportunities"],
    fallbackSelectors: ['[data-testid="sidebar-opportunities"]', 'a[href*="/opportunities"]']
  },
  payments: {
    primarySelectors: ["#sb_payments"],
    fallbackSelectors: ['[data-testid="sidebar-payments"]', 'a[href*="/payments"]']
  },
  marketing: {
    primarySelectors: ["#sb_email-marketing"],
    fallbackSelectors: ['[data-testid="sidebar-marketing"]', 'a[href*="/marketing"]']
  },
  automation: {
    primarySelectors: [],
    fallbackSelectors: ['[data-testid="sidebar-automation"]', 'a[href*="/automation"]']
  },
  sites: {
    primarySelectors: ["#sb_sites"],
    fallbackSelectors: ['[data-testid="sidebar-sites"]', 'a[href*="/sites"]']
  },
  reporting: {
    primarySelectors: ["#sb_reporting"],
    fallbackSelectors: ['[data-testid="sidebar-reporting"]', 'a[href*="/reporting"]']
  },
  settings: {
    primarySelectors: ["#sb_settings"],
    fallbackSelectors: ['[data-testid="sidebar-settings"]', 'a[href*="/settings"]']
  },
  memberships: {
    primarySelectors: ["#sb_memberships"],
    fallbackSelectors: ['a[meta="memberships"]', 'a[href*="/memberships"]']
  },
  reputation: {
    primarySelectors: ["#sb_reputation"],
    fallbackSelectors: ['a[href*="/reputation"]']
  },
  app_marketplace: {
    primarySelectors: ["#sb_app-marketplace"],
    fallbackSelectors: ['a[href*="/marketplace"]']
  },
  media: {
    primarySelectors: ["#sb_app-media"],
    fallbackSelectors: ['a[href*="/media"]']
  }
};

const emptySettings = {
  enabled: true,
  published: false,
  theme: {
    primaryColor: "#2563eb",
    accentColor: "#14b8a6",
    backgroundColor: "#ffffff",
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

function generateInstallCode(locationId, settings) {
  const theme = { ...emptySettings.theme, ...(settings.theme || {}) };
  const menus = { ...emptySettings.menus, ...(settings.menus || {}) };
  const hiddenMenuEntries = Object.entries(menus).filter(([, isVisible]) => isVisible === false);
  const menuSelectorList = Object.values(menuSelectors).join(",\n");
  const safeLogoUrlComment = String(theme.logoUrl || "")
    .replace(/\*\//g, "* /")
    .replace(/[\r\n]/g, " ");
  const warnings = [];
  const cssLines = [
    "/* AgencySkin Generated CSS */",
    "/* Paste this into GoHighLevel Custom CSS */",
    "",
    ":root {",
    `  --agencyskin-primary: ${theme.primaryColor};`,
    `  --agencyskin-accent: ${theme.accentColor};`,
    `  --agencyskin-background: ${theme.backgroundColor};`,
    "}",
    "",
    "/* Example shell styling */",
    "body {",
    "  --agencyskin-active-primary: var(--agencyskin-primary);",
    "  background: var(--agencyskin-background) !important;",
    "}",
    "",
    "/* Example registered menu styling */",
    `${menuSelectorList} {`,
    "  color: var(--agencyskin-primary) !important;",
    "}"
  ];

  if (safeLogoUrlComment) {
    cssLines.push("", `/* Logo URL saved in AgencySkin: ${safeLogoUrlComment} */`);
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
    loaderScript: `<script src="http://localhost:5174/loader.js" data-location-id="${locationId}" data-config-url="http://localhost:5174/api/locations/{locationId}/settings"></script>`,
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

    const generated = generateInstallCode(selectedLocationId, settings);
    setInstallCode(generated);
    setCopyStatus("");
    setStatus("Install code generated.");
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
        {status ? <span className="save-status">{status}</span> : null}
      </footer>

      <section className="install-section panel">
        <div className="panel-header">
          <div>
            <h2>Install Code</h2>
            <p>Copy this CSS into GoHighLevel Custom CSS to apply the current AgencySkin settings.</p>
          </div>
          <button type="button" onClick={handleGenerateInstallCode}>
            Generate Install Code
          </button>
        </div>

        <label className="code-field" htmlFor="generatedCss">
          Generated CSS
          <textarea id="generatedCss" readOnly value={installCode.css} />
        </label>
        <button type="button" onClick={() => copyToClipboard(installCode.css, "CSS")}>
          Copy CSS
        </button>

        <div className="loader-snippet">
          <div>
            <h3>Optional Hosted Loader Script</h3>
            <p>
              Use the CSS snippet for the current MVP. The loader script is reserved for a future
              hosted configuration workflow.
            </p>
          </div>
          <label className="code-field" htmlFor="loaderScript">
            Loader snippet
            <textarea id="loaderScript" readOnly value={installCode.loaderScript} />
          </label>
          <button type="button" onClick={() => copyToClipboard(installCode.loaderScript, "Loader script")}>
            Copy Loader Script
          </button>
        </div>

        {installCode.warnings.length > 0 ? (
          <ul className="warning-list">
            {installCode.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        <p className="install-warning">
          The current MVP uses copy/paste CSS. The hosted loader script is experimental and intended
          for a future version.
        </p>
        {copyStatus ? <span className="save-status">{copyStatus}</span> : null}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
