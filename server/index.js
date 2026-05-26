import cors from "cors";
import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectorRegistry } from "./selectorRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(__dirname, "data");
const locationsPath = path.join(dataDir, "locations.json");
const settingsPath = path.join(dataDir, "settings.json");
const port = process.env.PORT || 5174;

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(rootDir, "public")));

async function readJson(filePath) {
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file);
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function defaultSettings(locationId) {
  return {
    locationId,
    enabled: true,
    published: false,
    theme: {
      primaryColor: "#2563eb",
      accentColor: "#14b8a6",
      backgroundColor: "#ffffff",
      logoUrl: ""
    },
    menus: {
      launchpad: true,
      dashboard: true,
      conversations: true,
      calendars: true,
      contacts: true,
      opportunities: true,
      payments: true,
      ask_ai: true,
      ai_studio: true,
      ai_agents: true,
      marketing: true,
      automation: true,
      sites: true,
      memberships: true,
      media: true,
      reputation: true,
      reporting: true,
      app_marketplace: true,
      mobile_app: true,
      settings: true
    },
    updatedAt: new Date().toISOString()
  };
}

function mergeSettings(locationId, incoming) {
  const base = defaultSettings(locationId);
  return {
    ...base,
    ...incoming,
    locationId,
    theme: {
      ...base.theme,
      ...(incoming.theme || {})
    },
    menus: {
      ...base.menus,
      ...(incoming.menus || {})
    },
    updatedAt: new Date().toISOString()
  };
}

async function getSettingsStore() {
  return readJson(settingsPath);
}

async function saveLocationSettings(locationId, settings) {
  const store = await getSettingsStore();
  store[locationId] = settings;
  await writeJson(settingsPath, store);
  return settings;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "agencyskin-api" });
});

app.get("/api/selector-registry", (_req, res) => {
  res.json(selectorRegistry);
});

app.get("/api/locations", async (_req, res, next) => {
  try {
    const locations = await readJson(locationsPath);
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

app.get("/api/locations/:locationId/settings", async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const store = await getSettingsStore();
    res.json(store[locationId] || defaultSettings(locationId));
  } catch (error) {
    next(error);
  }
});

app.put("/api/locations/:locationId/settings", async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const settings = mergeSettings(locationId, req.body);
    const saved = await saveLocationSettings(locationId, settings);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

app.post("/api/locations/:locationId/publish", async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const store = await getSettingsStore();
    const settings = mergeSettings(locationId, {
      ...(store[locationId] || {}),
      published: true,
      publishedAt: new Date().toISOString()
    });
    const saved = await saveLocationSettings(locationId, settings);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

app.post("/api/locations/:locationId/disable", async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const store = await getSettingsStore();
    const settings = mergeSettings(locationId, {
      ...(store[locationId] || {}),
      enabled: false,
      published: false
    });
    const saved = await saveLocationSettings(locationId, settings);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

app.post("/api/locations/:locationId/reset", async (req, res, next) => {
  try {
    const settings = defaultSettings(req.params.locationId);
    const saved = await saveLocationSettings(req.params.locationId, settings);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`AgencySkin API listening on http://localhost:${port}`);
});
