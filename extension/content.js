(function agencySkinCleanViewContentScript() {
  var namespace = window.agencySkinCleanView || {};
  var registry = namespace.selectorRegistry || {};
  var allMenuKeys = namespace.allMenuKeys || Object.keys(registry);
  var storage = namespace.storage;
  var observer = null;
  var reapplyTimer = null;
  var currentState = null;
  var currentPreset = null;
  var styleBlockId = "agencyskin-cleanview-sidebar-style";

  if (!namespace.isAllowedHost(window.location.hostname)) {
    return;
  }

  function getLocationId() {
    return namespace.getLocationIdFromUrl(window.location.pathname);
  }

  function respond(sendResponse, payload) {
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

  function getMenuElements(key) {
    var entry = registry[key];
    return entry && Array.isArray(entry.selectors) ? findElements(entry.selectors) : [];
  }

  function getLabelTargets(element) {
    var spans = Array.prototype.slice.call(element.querySelectorAll("span")).filter(function hasText(span) {
      return span.textContent && span.textContent.trim();
    });
    return spans.length > 0 ? spans : [element];
  }

  function restoreLabel(element) {
    getLabelTargets(element).forEach(function restoreTarget(target) {
      if (target.hasAttribute("data-agencyskin-original-label")) {
        target.textContent = target.getAttribute("data-agencyskin-original-label");
        target.removeAttribute("data-agencyskin-original-label");
      }
    });
  }

  function applyLabel(element, label) {
    getLabelTargets(element).forEach(function updateTarget(target) {
      if (!target.hasAttribute("data-agencyskin-original-label")) {
        target.setAttribute("data-agencyskin-original-label", target.textContent || "");
      }
      target.textContent = label;
    });
  }

  function setMenuVisible(key, isVisible, labelOverride) {
    var updatedCount = 0;
    getMenuElements(key).forEach(function updateElement(element) {
      if (isVisible) {
        element.style.removeProperty("display");
        element.removeAttribute("data-agencyskin-hidden");
      } else {
        element.style.setProperty("display", "none", "important");
        element.setAttribute("data-agencyskin-hidden", "true");
      }

      if (labelOverride) {
        applyLabel(element, labelOverride);
      } else {
        restoreLabel(element);
      }

      updatedCount += 1;
    });

    return updatedCount;
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function findGhlSidebar() {
    var sidebar = document.querySelector("#sidebar-v2");

    if (sidebar) {
      return sidebar;
    }

    var selectors = ["aside", "nav", "[class*='sidebar']", "[class*='sidenav']", "[class*='side-nav']", "[class*='menu']"];

    for (var index = 0; index < selectors.length; index += 1) {
      var candidates = Array.prototype.slice.call(document.querySelectorAll(selectors[index]));

      for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
        var text = normalizeText(candidates[candidateIndex].textContent || "");
        var hasKnownMenuItem = text.indexOf("conversations") !== -1 ||
          text.indexOf("contacts") !== -1 ||
          text.indexOf("opportunities") !== -1 ||
          text.indexOf("calendars") !== -1 ||
          text.indexOf("marketing") !== -1 ||
          text.indexOf("sites") !== -1;

        if (hasKnownMenuItem) {
          return candidates[candidateIndex];
        }
      }
    }

    return null;
  }

  function storeOriginalStyle(element) {
    if (!element.hasAttribute("data-agencyskin-cleanview-original-style")) {
      element.setAttribute("data-agencyskin-cleanview-original-style", element.getAttribute("style") || "");
    }
  }

  function markStyledElement(element, role) {
    storeOriginalStyle(element);
    element.setAttribute("data-agencyskin-cleanview-styled", "true");
    element.setAttribute("data-agencyskin-cleanview-style-role", role);
  }

  function restoreOriginalStyle(element) {
    var originalStyle = element.getAttribute("data-agencyskin-cleanview-original-style");

    if (originalStyle) {
      element.setAttribute("style", originalStyle);
    } else {
      element.removeAttribute("style");
    }

    element.removeAttribute("data-agencyskin-cleanview-styled");
    element.removeAttribute("data-agencyskin-cleanview-original-style");
    element.removeAttribute("data-agencyskin-cleanview-style-role");
  }

  function removeSidebarStyleBlock() {
    var styleBlock = document.getElementById(styleBlockId);

    if (styleBlock) {
      styleBlock.remove();
    }
  }

  function resetSidebarStyle() {
    removeSidebarStyleBlock();
    document.querySelectorAll("[data-agencyskin-cleanview-style-role='header']").forEach(function removeHeader(header) {
      header.remove();
    });
    document.querySelectorAll("[data-agencyskin-cleanview-styled='true']").forEach(function resetStyledElement(element) {
      if (element.isConnected) {
        restoreOriginalStyle(element);
      }
    });
  }

  function styleValue(value) {
    return String(value || "").trim();
  }

  function getSidebarBackground(style) {
    if (style.backgroundType === "gradient") {
      var start = styleValue(style.gradientStartColor) || styleValue(style.backgroundColor) || "#0f172a";
      var end = styleValue(style.gradientEndColor) || styleValue(style.backgroundColor) || "#1d4ed8";
      var direction = styleValue(style.gradientDirection) || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return styleValue(style.backgroundColor);
  }

  function isActiveMenuItem(element) {
    var className = element.className && element.className.toString ? element.className.toString().toLowerCase() : "";
    return element.getAttribute("aria-current") === "page" ||
      className.indexOf("active") !== -1 ||
      className.indexOf("selected") !== -1;
  }

  function injectSidebarStyleBlock(style) {
    var css = [
      "[data-agencyskin-cleanview-style-role='menu-item']:hover {",
      styleValue(style.hoverBackgroundColor) ? "background: " + style.hoverBackgroundColor + " !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='menu-item'] *,",
      "[data-agencyskin-cleanview-style-role='header'] * {",
      styleValue(style.textColor) ? "color: inherit !important;" : "",
      "}"
    ].join("\n");
    var styleBlock = document.createElement("style");

    removeSidebarStyleBlock();
    styleBlock.id = styleBlockId;
    styleBlock.textContent = css;
    document.documentElement.appendChild(styleBlock);
  }

  function injectSidebarHeader(sidebar, style) {
    var hasHeader = styleValue(style.headerLabel) || styleValue(style.logoUrl);
    var header = document.createElement("div");
    var logo = null;
    var label = null;

    if (!hasHeader) {
      return;
    }

    header.setAttribute("data-agencyskin-cleanview-custom-link", "true");
    markStyledElement(header, "header");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "8px";
    header.style.padding = "10px 12px";
    header.style.margin = "0 8px 8px";
    header.style.fontWeight = "700";
    header.style.color = styleValue(style.textColor) || "inherit";

    if (styleValue(style.logoUrl)) {
      logo = document.createElement("img");
      logo.src = style.logoUrl;
      logo.alt = "";
      logo.style.maxHeight = "24px";
      logo.style.maxWidth = "120px";
      logo.style.objectFit = "contain";
      header.appendChild(logo);
    }

    if (styleValue(style.headerLabel)) {
      label = document.createElement("span");
      label.textContent = style.headerLabel;
      header.appendChild(label);
    }

    sidebar.insertBefore(header, sidebar.firstChild);
  }

  function applySidebarStyle(sidebarStyle) {
    var style = sidebarStyle || {};
    var sidebar = null;
    var menuItems = [];

    resetSidebarStyle();

    if (!style.enabled) {
      return 0;
    }

    sidebar = findGhlSidebar();

    if (!sidebar) {
      console.warn("[AgencySkin CleanView] Could not find GHL sidebar.");
      return 0;
    }

    markStyledElement(sidebar, "sidebar");
    if (getSidebarBackground(style)) {
      sidebar.style.background = getSidebarBackground(style);
    }
    if (styleValue(style.sidebarPadding)) {
      sidebar.style.padding = style.sidebarPadding;
    }
    if (styleValue(style.textColor)) {
      sidebar.style.color = style.textColor;
    }

    injectSidebarStyleBlock(style);
    injectSidebarHeader(sidebar, style);

    menuItems = Array.prototype.slice.call(sidebar.querySelectorAll("a, button, [role='button']"));
    menuItems.forEach(function styleMenuItem(element) {
      markStyledElement(element, "menu-item");
      if (styleValue(style.textColor)) {
        element.style.color = style.textColor;
      }
      if (styleValue(style.borderRadius)) {
        element.style.borderRadius = style.borderRadius;
      }
      if (styleValue(style.itemSpacing)) {
        element.style.marginTop = style.itemSpacing;
        element.style.marginBottom = style.itemSpacing;
      }
      if (isActiveMenuItem(element)) {
        if (styleValue(style.activeBackgroundColor)) {
          element.style.backgroundColor = style.activeBackgroundColor;
        }
        if (styleValue(style.activeTextColor)) {
          element.style.color = style.activeTextColor;
        }
      }
    });

    return menuItems.length + 1;
  }

  function findMenuItemByLabel(label, root) {
    var normalizedLabel = normalizeText(label);
    var candidates = Array.prototype.slice.call((root || document).querySelectorAll("a, button, [role='button'], [role='link'], [id^='sb_'], [meta]"));

    return candidates.find(function matchesLabel(element) {
      var text = normalizeText(element.textContent || "");
      var aria = normalizeText(element.getAttribute("aria-label") || "");
      var title = normalizeText(element.getAttribute("title") || "");
      var href = normalizeText(element.getAttribute("href") || "");

      return text === normalizedLabel ||
        text.indexOf(normalizedLabel) !== -1 ||
        aria.indexOf(normalizedLabel) !== -1 ||
        title.indexOf(normalizedLabel) !== -1 ||
        href.indexOf(normalizedLabel) !== -1;
    });
  }

  function isVisibleElement(element) {
    var styles = window.getComputedStyle(element);
    return styles.display !== "none" &&
      styles.visibility !== "hidden" &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getAttribute("data-agencyskin-hidden") !== "true" &&
      element.getAttribute("data-agencyskin-cleanview-hidden") !== "true";
  }

  function getVisibleMenuElement(key, sidebar) {
    return getMenuElements(key).find(function findVisibleElement(element) {
      return (!sidebar || sidebar.contains(element)) && isVisibleElement(element);
    }) || null;
  }

  function normalMenuKeys() {
    return allMenuKeys.filter(function excludeSettings(key) {
      return key !== "settings";
    });
  }

  function getFirstVisibleNormalMenuItem(sidebar) {
    var keys = normalMenuKeys();

    for (var index = 0; index < keys.length; index += 1) {
      var element = getVisibleMenuElement(keys[index], sidebar);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function getLastVisibleNormalMenuItem(sidebar) {
    var keys = normalMenuKeys();

    for (var index = keys.length - 1; index >= 0; index -= 1) {
      var element = getVisibleMenuElement(keys[index], sidebar);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function insertBeforeTarget(sidebar, linkElement, target) {
    if (target && target.parentNode) {
      target.parentNode.insertBefore(linkElement, target);
      return true;
    }

    if (sidebar) {
      sidebar.appendChild(linkElement);
      return true;
    }

    return false;
  }

  function insertAfterTarget(sidebar, linkElement, target) {
    if (target && target.parentNode) {
      target.insertAdjacentElement("afterend", linkElement);
      return true;
    }

    if (sidebar) {
      sidebar.appendChild(linkElement);
      return true;
    }

    return false;
  }

  function removeCustomLinks() {
    document.querySelectorAll("[data-agencyskin-cleanview-custom-link='true'], [data-agencyskin-cleanview-link='true']").forEach(function removeLink(link) {
      link.remove();
    });
  }

  function normalizeHref(link) {
    var locationId = getLocationId();
    return String((link && (link.url || link.href)) || "#").replace(/LOCATION_ID/g, locationId || "");
  }

  function createCustomLinkElement(link) {
    var anchor = document.createElement("a");

    anchor.href = normalizeHref(link);
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    anchor.setAttribute("data-agencyskin-cleanview-custom-link", "true");
    anchor.setAttribute("data-agencyskin-cleanview-link-id", link.id || "");
    anchor.setAttribute("data-agencyskin-cleanview-style-role", "menu-item");
    anchor.style.display = "flex";
    anchor.style.alignItems = "center";
    anchor.style.gap = "8px";
    anchor.style.padding = "10px 14px";
    anchor.style.margin = "4px 8px";
    anchor.style.borderRadius = "8px";
    anchor.style.textDecoration = "none";
    anchor.style.fontSize = "14px";
    anchor.style.fontWeight = "500";
    anchor.style.color = "inherit";
    anchor.style.cursor = "pointer";
    anchor.addEventListener("mouseenter", function hoverQuickLink() {
      anchor.style.background = "rgba(0,0,0,0.06)";
    });
    anchor.addEventListener("mouseleave", function leaveQuickLink() {
      anchor.style.background = "transparent";
    });

    return anchor;
  }

  function placeCustomLink(sidebar, linkElement, placement) {
    var placementMap = {
      after_conversations: { key: "conversations", label: "Conversations" },
      after_contacts: { key: "contacts", label: "Contacts" },
      after_opportunities: { key: "opportunities", label: "Opportunities" },
      after_calendars: { key: "calendars", label: "Calendars" }
    };
    var settingsElement = getVisibleMenuElement("settings", sidebar) || findMenuItemByLabel("Settings", sidebar);
    var firstNormalElement = getFirstVisibleNormalMenuItem(sidebar);
    var lastNormalElement = getLastVisibleNormalMenuItem(sidebar);

    if (placement === "top") {
      insertBeforeTarget(sidebar, linkElement, firstNormalElement || settingsElement);
      return;
    }

    if (!placement || placement === "bottom" || placement === "above_settings") {
      if (settingsElement && isVisibleElement(settingsElement)) {
        insertBeforeTarget(sidebar, linkElement, settingsElement);
        return;
      }

      insertAfterTarget(sidebar, linkElement, lastNormalElement);
      return;
    }

    if (placement === "after_settings") {
      insertAfterTarget(sidebar, linkElement, settingsElement || lastNormalElement);
      return;
    }

    if (placementMap[placement]) {
      var target = getVisibleMenuElement(placementMap[placement].key, sidebar) || findMenuItemByLabel(placementMap[placement].label, sidebar);

      if (target && isVisibleElement(target)) {
        insertAfterTarget(sidebar, linkElement, target);
        return;
      }
    }

    console.warn("[AgencySkin CleanView] Placement target not found. Falling back to bottom placement.", placement);
    placeCustomLink(sidebar, linkElement, "bottom");
  }

  function injectCustomLinks(customLinks) {
    removeCustomLinks();

    console.log("[AgencySkin CleanView] Custom links found:", customLinks);

    if (!Array.isArray(customLinks) || customLinks.length === 0) {
      console.log("[AgencySkin CleanView] No enabled custom links to inject.");
      return 0;
    }

    var enabledLinks = customLinks.filter(function keepEnabledLink(link) {
      return link &&
        link.enabled !== false &&
        link.label &&
        (link.url || link.href);
    });
    var sidebar = findGhlSidebar();

    console.log("[AgencySkin CleanView] Enabled custom links:", enabledLinks);
    console.log("[AgencySkin CleanView] Sidebar found:", Boolean(sidebar));

    if (!enabledLinks.length) {
      console.log("[AgencySkin CleanView] No enabled custom links to inject.");
      return 0;
    }

    if (!sidebar) {
      console.warn("[AgencySkin CleanView] Could not find GHL sidebar. Custom links not injected.");
      return 0;
    }

    enabledLinks.forEach(function addLink(link) {
      placeCustomLink(sidebar, createCustomLinkElement(link), link.placement);
    });

    console.log("[AgencySkin CleanView] Injected " + enabledLinks.length + " custom link(s).");
    return enabledLinks.length;
  }

  function resetPage() {
    resetSidebarStyle();
    allMenuKeys.forEach(function resetKey(key) {
      getMenuElements(key).forEach(function resetElement(element) {
        element.style.removeProperty("display");
        element.removeAttribute("data-agencyskin-hidden");
        restoreLabel(element);
      });
    });
    removeCustomLinks();
    currentPreset = null;
    return { ok: true, locationId: getLocationId() };
  }

  function resolvePreset(state) {
    var locationId = getLocationId();
    var locationRule = locationId && state.locationRules ? state.locationRules[locationId] : null;
    var presetId = locationRule && locationRule.presetId ? locationRule.presetId : state.activePresetId;
    return storage.getPresetById(state, presetId) || storage.getPresetById(state, "builtin:simple");
  }

  function applyPresetObject(preset) {
    var visibleSet = new Set(Array.isArray(preset.visibleItems) ? preset.visibleItems : allMenuKeys);
    var labelOverrides = preset.labelOverrides || {};
    var changedCount = 0;

    console.log("[AgencySkin CleanView] Applying preset:", preset && (preset.name || preset.label), preset);

    resetPage();

    allMenuKeys.forEach(function applyKey(key) {
      changedCount += setMenuVisible(key, visibleSet.has(key), labelOverrides[key]);
    });

    changedCount += injectCustomLinks(preset.customLinks || []);
    changedCount += applySidebarStyle(preset.sidebarStyle || {});
    currentPreset = preset;

    return {
      ok: true,
      changedCount: changedCount,
      locationId: getLocationId(),
      presetId: preset.id,
      presetName: preset.name || preset.label
    };
  }

  function applyCurrentState(state) {
    currentState = state;

    return withObserverPaused(function applyWithObserverPaused() {
      if (!state.enabled) {
        return resetPage();
      }

      return applyPresetObject(resolvePreset(state));
    });
  }

  function loadAndApply() {
    storage.getState(function handleState(state, error) {
      if (error) {
        console.warn("[AgencySkin CleanView] Unable to load stored settings.", error);
        return;
      }
      applyCurrentState(state);
    });
  }

  function scheduleReapply() {
    window.clearTimeout(reapplyTimer);
    reapplyTimer = window.setTimeout(function reapplyCurrentState() {
      if (currentState && currentState.enabled) {
        withObserverPaused(function reapplyWithObserverPaused() {
          applyPresetObject(resolvePreset(currentState));
        });
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

  function withObserverPaused(callback) {
    var shouldResume = Boolean(observer && document.body);

    if (shouldResume) {
      observer.disconnect();
    }

    try {
      return callback();
    } finally {
      if (shouldResume) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  chrome.runtime.onMessage.addListener(function handleMessage(message, _sender, sendResponse) {
    if (!message || message.source !== namespace.messageSource) {
      return false;
    }

    if (message.type === "getPageContext") {
      storage.getState(function handleContext(state, error) {
        if (error) {
          respond(sendResponse, { ok: false, error: "Unable to load CleanView settings." });
          return;
        }
        var preset = resolvePreset(state);
        respond(sendResponse, {
          ok: true,
          locationId: getLocationId(),
          enabled: state.enabled,
          activePresetId: state.activePresetId,
          resolvedPresetId: preset && preset.id,
          resolvedPresetName: preset && (preset.name || preset.label)
        });
      });
      return true;
    }

    if (message.type === "applyPreset") {
      storage.updateState(function updatePreset(state) {
        state.activePresetId = message.presetId || "builtin:simple";
      }, function handleSaved(state, error) {
        var preset = storage.getPresetById(state, state.activePresetId);

        if (error) {
          respond(sendResponse, { ok: false, error: "Unable to save preset." });
          return;
        }

        if (state.enabled === false) {
          respond(sendResponse, {
            ok: true,
            skipped: true,
            enabled: false,
            locationId: getLocationId(),
            presetId: state.activePresetId,
            presetName: preset && (preset.name || preset.label)
          });
          return;
        }

        respond(sendResponse, applyCurrentState(state));
      });
      return true;
    }

    if (message.type === "applyPresetForLocation") {
      storage.updateState(function updateLocationRule(state) {
        var locationId = getLocationId();
        if (locationId) {
          state.locationRules[locationId] = {
            presetId: message.presetId || state.activePresetId || "builtin:simple",
            updatedAt: namespace.nowIso()
          };
        }
      }, function handleSaved(state, error) {
        if (error) {
          respond(sendResponse, { ok: false, error: "Unable to assign location rule." });
          return;
        }

        respond(sendResponse, state.enabled === false ? { ok: true, skipped: true, enabled: false, locationId: getLocationId() } : applyCurrentState(state));
      });
      return true;
    }

    if (message.type === "setEnabled") {
      storage.updateState(function updateEnabled(state) {
        state.enabled = Boolean(message.enabled);
      }, function handleSaved(state, error) {
        respond(sendResponse, error ? { ok: false, error: "Unable to update CleanView." } : applyCurrentState(state));
      });
      return true;
    }

    if (message.type === "resetPage") {
      respond(sendResponse, withObserverPaused(resetPage));
      return false;
    }

    if (message.type === "previewPreset") {
      respond(sendResponse, withObserverPaused(function previewWithObserverPaused() {
        return applyPresetObject(message.preset || storage.getPresetById(currentState, "builtin:simple"));
      }));
      return false;
    }

    respond(sendResponse, { ok: false, error: "Unknown CleanView message." });
    return false;
  });

  loadAndApply();
  startObserver();
})();
