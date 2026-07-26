importScripts("domainAccessConfig.js");

(function cleanViewDomainAccessWorker() {
  var GRANTS_STORAGE_KEY = "agencySkinCleanViewCustomDomainGrants";
  var SCRIPT_PREFIX = "cleanview_custom_";
  var SCRIPT_FILES = [
    "customDomainMarker.js",
    "namespace.js",
    "selectorRegistry.js",
    "sidebarBackgrounds.js",
    "presets.js",
    "plans.js",
    "storage.js",
    "content.js"
  ];

  function isBuiltInHost(hostname) {
    hostname = String(hostname || "").toLowerCase();
    return hostname === "app.gohighlevel.com" ||
      hostname.endsWith(".gohighlevel.com") ||
      hostname.endsWith(".leadconnectorhq.com");
  }

  function canonicalHostname(value) {
    var raw = String(value || "").trim().toLowerCase().replace(/\.$/, "");
    var parsed = null;
    var labels = null;

    if (!raw || raw.length > 253 || raw.indexOf(":") !== -1 || raw.indexOf("/") !== -1) {
      return "";
    }

    try {
      parsed = new URL("https://" + raw + "/");
    } catch (_error) {
      return "";
    }

    if (parsed.hostname !== raw || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(raw) || raw === "localhost") {
      return "";
    }

    labels = raw.split(".");
    if (labels.length < 2 || labels.some(function invalidLabel(label) {
      return !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label);
    })) {
      return "";
    }

    return raw;
  }

  function parseHttpsUrl(value) {
    try {
      var parsed = new URL(value || "");
      var hostname = canonicalHostname(parsed.hostname);
      if (parsed.protocol !== "https:" || !hostname || parsed.port) {
        return null;
      }
      return {
        hostname: hostname,
        pattern: "https://" + hostname + "/*"
      };
    } catch (_error) {
      return null;
    }
  }

  function scriptIdForHostname(hostname) {
    var firstHash = 2166136261;
    var secondHash = 2246822519;
    var index = 0;
    for (index = 0; index < hostname.length; index += 1) {
      firstHash ^= hostname.charCodeAt(index);
      firstHash = Math.imul(firstHash, 16777619);
      secondHash ^= hostname.charCodeAt(hostname.length - index - 1);
      secondHash = Math.imul(secondHash, 3266489917);
    }
    return SCRIPT_PREFIX +
      (firstHash >>> 0).toString(16).padStart(8, "0") +
      (secondHash >>> 0).toString(16).padStart(8, "0");
  }

  async function getGrants() {
    var stored = await chrome.storage.local.get(GRANTS_STORAGE_KEY);
    var grants = stored && stored[GRANTS_STORAGE_KEY];
    return grants && typeof grants === "object" && !Array.isArray(grants) ? grants : {};
  }

  async function saveGrants(grants) {
    var payload = {};
    payload[GRANTS_STORAGE_KEY] = grants;
    await chrome.storage.local.set(payload);
  }

  async function checkCentralAllowlist(hostname) {
    var config = self.CLEANVIEW_DOMAIN_ACCESS_CONFIG || {};
    var endpointUrl = String(config.endpointUrl || "").trim();
    var controller = new AbortController();
    var timeoutId = null;
    var response = null;
    var payload = null;

    if (!endpointUrl) {
      return {
        ok: false,
        status: "unavailable",
        error: "Custom-domain access has not been configured."
      };
    }

    timeoutId = setTimeout(function abortRequest() {
      controller.abort();
    }, 5000);

    try {
      response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: hostname }),
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) {
        return {
          ok: false,
          status: "unavailable",
          error: "Unable to verify this agency domain."
        };
      }

      payload = await response.json();
      return {
        ok: true,
        status: payload && payload.allowed === true ? "allowed" : "denied",
        allowed: Boolean(payload && payload.allowed === true)
      };
    } catch (_error) {
      return {
        ok: false,
        status: "unavailable",
        error: "Unable to verify this agency domain."
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function permissionStatus(pattern) {
    return chrome.permissions.contains({ origins: [pattern] });
  }

  async function removeCustomDomain(hostname, options) {
    var pattern = "https://" + hostname + "/*";
    var scriptId = scriptIdForHostname(hostname);
    var grants = await getGrants();

    try {
      await chrome.scripting.unregisterContentScripts({ ids: [scriptId] });
    } catch (_error) {
      // Registration may already be absent.
    }

    delete grants[hostname];
    await saveGrants(grants);

    if (!options || options.removePermission !== false) {
      try {
        await chrome.permissions.remove({ origins: [pattern] });
      } catch (_error) {
        // Permission may already be absent.
      }
    }
  }

  async function registerCustomDomain(hostname) {
    var pattern = "https://" + hostname + "/*";
    var scriptId = scriptIdForHostname(hostname);
    var grants = await getGrants();

    if (!(await permissionStatus(pattern))) {
      return { ok: false, error: "Chrome access was not granted for this domain." };
    }

    try {
      await chrome.scripting.unregisterContentScripts({ ids: [scriptId] });
    } catch (_error) {
      // A first-time registration has nothing to remove.
    }

    await chrome.scripting.registerContentScripts([{
      id: scriptId,
      matches: [pattern],
      js: SCRIPT_FILES,
      runAt: "document_start",
      persistAcrossSessions: true,
      allFrames: false
    }]);

    grants[hostname] = {
      hostname: hostname,
      pattern: pattern,
      scriptId: scriptId,
      grantedAt: new Date().toISOString()
    };
    await saveGrants(grants);
    return { ok: true, hostname: hostname, pattern: pattern };
  }

  async function getDomainStatus(url) {
    var parsed = parseHttpsUrl(url);
    var central = null;
    var hasPermission = false;

    if (!parsed) {
      return { ok: true, status: "unsupported", allowed: false, hasPermission: false };
    }

    if (isBuiltInHost(parsed.hostname)) {
      return {
        ok: true,
        status: "built_in",
        allowed: true,
        hasPermission: true,
        hostname: parsed.hostname,
        pattern: parsed.pattern
      };
    }

    central = await checkCentralAllowlist(parsed.hostname);
    hasPermission = await permissionStatus(parsed.pattern);
    return Object.assign({}, central, {
      hostname: parsed.hostname,
      pattern: parsed.pattern,
      hasPermission: hasPermission,
      needsPermission: Boolean(central.allowed && !hasPermission)
    });
  }

  async function restoreRegistrations() {
    var grants = await getGrants();
    var hostnames = Object.keys(grants);

    await Promise.all(hostnames.map(async function restore(hostname) {
      var canonical = canonicalHostname(hostname);
      var pattern = canonical ? "https://" + canonical + "/*" : "";
      if (!canonical || !(await permissionStatus(pattern))) {
        await removeCustomDomain(hostname, { removePermission: false });
        return;
      }
      try {
        await registerCustomDomain(canonical);
      } catch (_error) {
        // The next popup or navigation will surface registration failures.
      }
    }));
  }

  chrome.runtime.onMessage.addListener(function handleMessage(message, sender, sendResponse) {
    if (!message || typeof message.type !== "string") {
      return false;
    }

    if (message.type === "CLEANVIEW_GET_DOMAIN_STATUS") {
      getDomainStatus(message.url).then(sendResponse).catch(function handleError() {
        sendResponse({ ok: false, status: "unavailable", error: "Unable to verify this agency domain." });
      });
      return true;
    }

    if (message.type === "CLEANVIEW_REGISTER_CUSTOM_DOMAIN") {
      (async function registerRequestedDomain() {
        var status = await getDomainStatus(message.url);
        if (!status.allowed || !status.hostname || isBuiltInHost(status.hostname)) {
          return status.allowed ? { ok: true, builtIn: true } : status;
        }
        return registerCustomDomain(status.hostname);
      })().then(sendResponse).catch(function handleError() {
        sendResponse({ ok: false, error: "Unable to enable CleanView on this domain." });
      });
      return true;
    }

    if (message.type === "CLEANVIEW_CUSTOM_DOMAIN_PAGE_CHECK") {
      (async function authorizeCustomPage() {
        var senderUrl = sender && sender.tab && sender.tab.url || "";
        var status = await getDomainStatus(senderUrl);

        if (status.status === "denied" && status.hostname) {
          await removeCustomDomain(status.hostname);
        }

        return status;
      })().then(sendResponse).catch(function handleError() {
        sendResponse({ ok: false, status: "unavailable", allowed: false });
      });
      return true;
    }

    if (message.type === "CLEANVIEW_GET_GRANTED_PATTERNS") {
      getGrants().then(function handleGrants(grants) {
        sendResponse({
          ok: true,
          patterns: Object.keys(grants).map(function mapGrant(hostname) {
            return grants[hostname].pattern;
          }).filter(Boolean)
        });
      }).catch(function handleError() {
        sendResponse({ ok: false, patterns: [] });
      });
      return true;
    }

    return false;
  });

  chrome.runtime.onInstalled.addListener(restoreRegistrations);
  chrome.runtime.onStartup.addListener(restoreRegistrations);
})();
