(function agencySkinContentScript() {
  var allowedHost = window.location.hostname === "app.gohighlevel.com" || window.location.hostname.endsWith(".leadconnectorhq.com");
  var registry = window.AgencySkinSelectorRegistry || {};
  var presets = window.AgencySkinPresets || {};
  var allMenuKeys = window.AgencySkinAllMenuKeys || Object.keys(registry);
  var currentVisibleItems = null;
  var observer = null;
  var reapplyTimer = null;

  if (!allowedHost) {
    return;
  }

  function getLocationIdFromUrl() {
    var match = window.location.pathname.match(/\/location\/([^/]+)/);
    return match ? match[1] : null;
  }

  function sendResponseSafely(sendResponse, payload) {
    if (typeof sendResponse === "function") {
      sendResponse(payload);
    }
  }

  function findElements(selectors) {
    return selectors.reduce(function collect(elements, selector) {
      try {
        document.querySelectorAll(selector).forEach(function addElement(element) {
          if (elements.indexOf(element) === -1) {
            elements.push(element);
          }
        });
      } catch (error) {
        console.warn("[AgencySkin CleanView] Skipped invalid selector.", selector, error);
      }

      return elements;
    }, []);
  }

  function setMenuVisible(key, isVisible) {
    var entry = registry[key];

    if (!entry || !Array.isArray(entry.selectors)) {
      return 0;
    }

    var updatedCount = 0;

    findElements(entry.selectors).forEach(function updateElement(element) {
      if (isVisible) {
        element.style.removeProperty("display");
        element.removeAttribute("data-agencyskin-hidden");
      } else {
        element.style.setProperty("display", "none", "important");
        element.setAttribute("data-agencyskin-hidden", "true");
      }

      updatedCount += 1;
    });

    return updatedCount;
  }

  function applyVisibleItems(visibleItems) {
    var visibleSet = new Set(Array.isArray(visibleItems) ? visibleItems : allMenuKeys);
    var changedCount = 0;

    allMenuKeys.forEach(function applyKey(key) {
      changedCount += setMenuVisible(key, visibleSet.has(key));
    });

    currentVisibleItems = Array.from(visibleSet);

    return {
      ok: true,
      changedCount: changedCount,
      locationId: getLocationIdFromUrl()
    };
  }

  function loadStoredSettings() {
    chrome.storage.local.get(["selectedPreset", "visibleItems", "updatedAt"], function handleStoredSettings(store) {
      if (chrome.runtime.lastError) {
        console.warn("[AgencySkin CleanView] Unable to load stored settings.", chrome.runtime.lastError);
        return;
      }

      if (Array.isArray(store.visibleItems)) {
        applyVisibleItems(store.visibleItems);
      }
    });
  }

  function scheduleReapply() {
    window.clearTimeout(reapplyTimer);
    reapplyTimer = window.setTimeout(function reapplyCurrentItems() {
      if (currentVisibleItems) {
        applyVisibleItems(currentVisibleItems);
      }
    }, 150);
  }

  function startObserver() {
    if (observer || typeof window.MutationObserver !== "function" || !document.body) {
      return;
    }

    observer = new window.MutationObserver(scheduleReapply);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  chrome.runtime.onMessage.addListener(function handleMessage(message, _sender, sendResponse) {
    if (!message || message.source !== "agencyskin-cleanview") {
      return false;
    }

    if (message.type === "applyPreset") {
      var preset = presets[message.presetKey];

      if (!preset) {
        sendResponseSafely(sendResponse, { ok: false, error: "Preset not found." });
        return false;
      }

      sendResponseSafely(sendResponse, applyVisibleItems(preset.visibleItems));
      return false;
    }

    if (message.type === "applyVisibleItems") {
      sendResponseSafely(sendResponse, applyVisibleItems(message.visibleItems));
      return false;
    }

    if (message.type === "showAll") {
      sendResponseSafely(sendResponse, applyVisibleItems(allMenuKeys));
      return false;
    }

    sendResponseSafely(sendResponse, { ok: false, error: "Unknown message type." });
    return false;
  });

  loadStoredSettings();
  startObserver();
})();
