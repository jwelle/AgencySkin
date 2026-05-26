(function agencySkinLoader() {
  var script = document.currentScript;
  var locationId = script && script.getAttribute("data-location-id");
  var configUrl = script && script.getAttribute("data-config-url");
  var debug = script && script.getAttribute("data-debug") === "true";
  var mutationTimer = null;

  var menuSelectorRegistry = {
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

  function warn(message, detail) {
    if (window.console && typeof window.console.warn === "function") {
      window.console.warn("[AgencySkin]", message, detail || "");
    }
  }

  function debugLog(message, detail) {
    if (debug && window.console && typeof window.console.info === "function") {
      window.console.info("[AgencySkin]", message, detail || "");
    }
  }

  function getSelectors(entry) {
    return entry ? entry.primarySelectors.concat(entry.fallbackSelectors) : [];
  }

  function findElements(selectors) {
    return selectors.reduce(function collect(found, selector) {
      try {
        document.querySelectorAll(selector).forEach(function addElement(element) {
          if (found.indexOf(element) === -1) {
            found.push(element);
          }
        });
      } catch (error) {
        debugLog("Invalid selector skipped.", { selector: selector, error: error.message });
      }

      return found;
    }, []);
  }

  function applyMenuRules(menus) {
    if (!menus) {
      return;
    }

    Object.keys(menuSelectorRegistry).forEach(function applyMenuRule(key) {
      var selectors = getSelectors(menuSelectorRegistry[key]);
      var elements = findElements(selectors);

      if (elements.length === 0) {
        debugLog("No elements matched selector registry entry.", { key: key, selectors: selectors });
        return;
      }

      elements.forEach(function updateElement(element) {
        if (menus[key] === false) {
          if (!element.hasAttribute("data-agencyskin-original-display")) {
            element.setAttribute("data-agencyskin-original-display", element.style.display || "");
          }
          element.style.setProperty("display", "none", "important");
          return;
        }

        if (element.hasAttribute("data-agencyskin-original-display")) {
          var originalDisplay = element.getAttribute("data-agencyskin-original-display");
          element.style.display = originalDisplay;
          element.removeAttribute("data-agencyskin-original-display");
        }
      });
    });
  }

  function watchForMenuChanges(config) {
    if (typeof window.MutationObserver !== "function" || !document.body) {
      return;
    }

    var observer = new window.MutationObserver(function scheduleApply() {
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(function applyAfterMutation() {
        applyMenuRules(config.menus);
      }, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyConfig(config) {
    if (!config || config.enabled !== true) {
      return;
    }

    try {
      applyMenuRules(config.menus);
      watchForMenuChanges(config);
    } catch (error) {
      warn("Unable to apply AgencySkin config.", error);
    }

    debugLog("Loader applied config.", {
      locationId: config.locationId,
      published: config.published
    });
  }

  if (!locationId || !configUrl || typeof window.fetch !== "function") {
    warn("Loader initialized without remote config fetch.", { locationId: locationId || null });
    return;
  }

  window
    .fetch(configUrl.replace("{locationId}", encodeURIComponent(locationId)), {
      credentials: "omit",
      headers: { Accept: "application/json" }
    })
    .then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("Config request failed with status " + response.status);
      }
      return response.json();
    })
    .then(applyConfig)
    .catch(function handleError(error) {
      warn("Unable to load AgencySkin config.", error);
    });
})();
