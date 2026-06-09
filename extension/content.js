(function agencySkinCleanViewContentScript() {
  var namespace = window.agencySkinCleanView || {};
  var registry = namespace.selectorRegistry || {};
  var allMenuKeys = namespace.allMenuKeys || Object.keys(registry);
  var storage = namespace.storage;
  var observer = null;
  var reapplyTimer = null;
  var currentState = null;
  var currentPreset = null;
  var activePreviewPreset = null;
  var styleBlockId = "agencyskin-cleanview-sidebar-style";
  var preloadGuardStyleId = "agencyskin-cleanview-preload-guard";
  var preloadGuardTimer = null;
  var preloadGuardMinimumTimer = null;
  var preloadGuardAttachTimer = null;
  var preloadGuardInstalledAt = 0;
  var preloadGuardEnabled = false;
  var CLEANVIEW_DEBUG_STARTUP_MASK = false;
  var firstApplyTimer = null;
  var firstApplyStartedAt = 0;
  var menuGroupOrderCounter = 0;
  var menuGroupExpandedState = {};
  var preferredSidebarSelector = "#sidebar-v2";
  var sidebarWaitTimeoutMs = 20000;

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

  function debugStartupMask(message, details) {
    if (CLEANVIEW_DEBUG_STARTUP_MASK) {
      console.debug("[AgencySkin CleanView startup mask] " + message, details || "");
    }
  }

  function removePreloadGuard() {
    var styleBlock = document.getElementById(preloadGuardStyleId);

    window.clearTimeout(preloadGuardTimer);
    window.clearTimeout(preloadGuardMinimumTimer);
    window.clearTimeout(preloadGuardAttachTimer);
    preloadGuardTimer = null;
    preloadGuardMinimumTimer = null;
    preloadGuardAttachTimer = null;
    preloadGuardEnabled = false;
    preloadGuardInstalledAt = 0;
    document.documentElement.removeAttribute("data-agencyskin-cleanview-preparing");
    document.querySelectorAll("[data-agencyskin-cleanview-startup-mask='true']").forEach(function removeMask(mask) {
      mask.remove();
    });
    document.querySelectorAll("[data-agencyskin-cleanview-startup-host='true']").forEach(function removeMaskHost(host) {
      host.removeAttribute("data-agencyskin-cleanview-startup-host");
    });
    if (styleBlock) {
      styleBlock.remove();
    }
    debugStartupMask("removed");
  }

  function removePreloadGuardAfterMinimum() {
    var elapsed = preloadGuardInstalledAt ? Date.now() - preloadGuardInstalledAt : 0;
    var minimumVisibleMs = CLEANVIEW_DEBUG_STARTUP_MASK ? 1000 : 200;
    var remaining = Math.max(0, minimumVisibleMs - elapsed);

    window.clearTimeout(preloadGuardMinimumTimer);
    if (remaining > 0) {
      preloadGuardMinimumTimer = window.setTimeout(removePreloadGuard, remaining);
      debugStartupMask("scheduled minimum-duration removal", { remaining: remaining });
      return;
    }

    removePreloadGuard();
  }

  function createStartupMask() {
    var mask = document.createElement("div");
    var brand = document.createElement("p");
    var message = document.createElement("p");
    var skeleton = document.createElement("div");

    mask.setAttribute("data-agencyskin-cleanview-startup-mask", "true");
    mask.setAttribute("aria-live", "polite");
    brand.setAttribute("data-agencyskin-cleanview-startup-brand", "true");
    message.setAttribute("data-agencyskin-cleanview-startup-message", "true");
    skeleton.setAttribute("data-agencyskin-cleanview-startup-skeleton", "true");
    brand.textContent = "CleanView";
    message.textContent = "Preparing your workspace...";
    [0, 1, 2, 3, 4, 5, 6].forEach(function addSkeletonRow(index) {
      var row = document.createElement("span");

      row.setAttribute("data-agencyskin-cleanview-startup-row", "true");
      row.style.width = index % 3 === 0 ? "72%" : (index % 3 === 1 ? "88%" : "62%");
      skeleton.appendChild(row);
    });
    mask.appendChild(brand);
    mask.appendChild(message);
    mask.appendChild(skeleton);
    return mask;
  }

  function installPreloadGuard() {
    var styleBlock = document.getElementById(preloadGuardStyleId);
    var sidebar = null;

    if (!document.documentElement || !preloadGuardEnabled) {
      return;
    }

    document.documentElement.setAttribute("data-agencyskin-cleanview-preparing", "true");
    if (!styleBlock) {
      styleBlock = document.createElement("style");
      styleBlock.id = preloadGuardStyleId;
      styleBlock.textContent = [
        "html[data-agencyskin-cleanview-preparing='true'] #sidebar-v2,",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='sidebar'],",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='sidebar'],",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='sidenav'],",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='sidenav'],",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='side-nav'],",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='side-nav'],",
        "html[data-agencyskin-cleanview-preparing='true'] [data-agencyskin-cleanview-startup-host='true'] {",
        "position: relative !important;",
        "}",
        "html[data-agencyskin-cleanview-preparing='true'] #sidebar-v2 > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='sidebar'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='sidebar'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='sidenav'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='sidenav'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] aside[class*='side-nav'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] nav[class*='side-nav'] > *:not([data-agencyskin-cleanview-startup-mask='true']),",
        "html[data-agencyskin-cleanview-preparing='true'] [data-agencyskin-cleanview-startup-host='true'] > *:not([data-agencyskin-cleanview-startup-mask='true']) {",
        "opacity: 0 !important;",
        "pointer-events: none !important;",
        "transition: none !important;",
        "}",
        "[data-agencyskin-cleanview-startup-mask='true'] {",
        "background: linear-gradient(180deg, #071126 0%, #102349 100%) !important;",
        "box-sizing: border-box !important;",
        "color: #e5eefc !important;",
        "display: grid !important;",
        "font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;",
        "gap: 10px !important;",
        "inset: 0 !important;",
        "overflow: hidden !important;",
        "padding: 18px 14px !important;",
        "pointer-events: auto !important;",
        "position: absolute !important;",
        "min-height: 100vh !important;",
        "width: 100% !important;",
        "z-index: 2147483000 !important;",
        "}",
        "[data-agencyskin-cleanview-startup-brand='true'] {",
        "font-size: 13px !important;",
        "font-weight: 800 !important;",
        "letter-spacing: 0 !important;",
        "line-height: 1.2 !important;",
        "margin: 0 !important;",
        "}",
        "[data-agencyskin-cleanview-startup-message='true'] {",
        "color: rgba(229,238,252,0.72) !important;",
        "font-size: 11px !important;",
        "font-weight: 650 !important;",
        "line-height: 1.35 !important;",
        "margin: 0 0 8px !important;",
        "}",
        "[data-agencyskin-cleanview-startup-skeleton='true'] {",
        "display: grid !important;",
        "gap: 9px !important;",
        "margin-top: 4px !important;",
        "}",
        "[data-agencyskin-cleanview-startup-row='true'] {",
        "background: rgba(255,255,255,0.13) !important;",
        "border-radius: 7px !important;",
        "display: block !important;",
        "height: 30px !important;",
        "max-width: 100% !important;",
        "min-width: 56% !important;",
        "}"
      ].join("\n");
      document.documentElement.appendChild(styleBlock);
    }

    sidebar = document.querySelector("#sidebar-v2") || findGhlSidebar();
    if (sidebar && !sidebar.querySelector("[data-agencyskin-cleanview-startup-mask='true']")) {
      sidebar.setAttribute("data-agencyskin-cleanview-startup-host", "true");
      sidebar.appendChild(createStartupMask());
      if (!preloadGuardInstalledAt) {
        preloadGuardInstalledAt = Date.now();
      }
      debugStartupMask("inserted", { id: sidebar.id, tagName: sidebar.tagName });
    } else if (!sidebar) {
      debugStartupMask("waiting for sidebar");
      window.clearTimeout(preloadGuardAttachTimer);
      preloadGuardAttachTimer = window.setTimeout(installPreloadGuard, 40);
    }

    if (!preloadGuardTimer) {
      preloadGuardTimer = window.setTimeout(removePreloadGuard, 2200);
    }
  }

  function primePreloadGuardFromRawState() {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      return;
    }

    chrome.storage.local.get([namespace.storageKey], function handleRawStartupState(store) {
      var rawState = store && store[namespace.storageKey];

      if (chrome.runtime.lastError) {
        debugStartupMask("raw state unavailable", chrome.runtime.lastError);
        return;
      }

      if (rawState && rawState.enabled === false) {
        debugStartupMask("not installed because CleanView is disabled");
        removePreloadGuard();
        return;
      }

      if (!rawState) {
        debugStartupMask("not installed because no stored CleanView state exists");
        return;
      }

      preloadGuardEnabled = true;
      installPreloadGuard();
    });
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
    var sidebar = document.querySelector(preferredSidebarSelector);

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

  function removeSidebarBackgroundLayers() {
    document.querySelectorAll("[data-agencyskin-sidebar-bg-layer='true']").forEach(function removeLayer(layer) {
      layer.remove();
    });
  }

  function removeCustomSidebarBranding() {
    document.querySelectorAll("[data-agencyskin-custom-sidebar-branding='true']").forEach(function removeBranding(branding) {
      branding.remove();
    });
  }

  function restoreNativeSidebarBranding() {
    document.querySelectorAll("[data-agencyskin-hidden-native-branding='true']").forEach(function restoreBranding(element) {
      var originalStyle = element.getAttribute("data-agencyskin-native-branding-original-style") || "";

      if (originalStyle) {
        element.setAttribute("style", originalStyle);
      } else {
        element.removeAttribute("style");
      }

      element.removeAttribute("data-agencyskin-hidden-native-branding");
      element.removeAttribute("data-agencyskin-native-branding-original-style");
    });
  }

  function clearTopHeaderThemeState() {
    if (document.body) {
      document.body.classList.remove("cleanview-enabled", "cleanview-theme-header");
      document.body.style.removeProperty("--cleanview-top-header-bg");
      document.body.style.removeProperty("--cleanview-top-header-border");
    }
  }

  function resetSidebarStyle() {
    removeSidebarBackgroundLayers();
    removeCustomSidebarBranding();
    restoreNativeSidebarBranding();
    clearTopHeaderThemeState();
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

  function clampOpacity(value) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return 0.35;
    }

    return Math.min(1, Math.max(0, numeric));
  }

  function normalizeHexColor(value, fallback) {
    var trimmed = String(value || "").trim();

    if (/^#([0-9A-F]{3}){1,2}$/i.test(trimmed)) {
      return trimmed.length === 4 ?
        "#" + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3] :
        trimmed;
    }

    return fallback || "#000000";
  }

  function hexToRgb(hex) {
    var normalized = normalizeHexColor(hex || "#000000", "#000000").replace("#", "");
    var bigint = parseInt(normalized, 16);

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function getOverlayRgba(color, opacity) {
    var rgb = hexToRgb(color || "#000000");
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + clampOpacity(opacity) + ")";
  }

  function getBackgroundColorValue(color, opacity) {
    return getOverlayRgba(color || "#000000", opacity === undefined ? 1 : opacity);
  }

  function getSubtleBackgroundColor(color, fallback) {
    var value = styleValue(color);

    if (!value) {
      return styleValue(fallback);
    }

    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      return getOverlayRgba(value, 0.18);
    }

    return value;
  }

  function clampNumber(value, min, max, fallback) {
    var numeric = Number(value);

    if (Number.isNaN(numeric)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, numeric));
  }

  function getByPath(object, path, fallback) {
    var value = String(path || "").split(".").reduce(function readPath(current, part) {
      return current && current[part] !== undefined ? current[part] : undefined;
    }, object);

    return value === undefined ? fallback : value;
  }

  function getAssetById(assetId) {
    return namespace.getSidebarBackgroundAssetById ? namespace.getSidebarBackgroundAssetById(assetId) : null;
  }

  function getCuratedPresetById(presetId) {
    return namespace.getCuratedSidebarStylePresetById ? namespace.getCuratedSidebarStylePresetById(presetId) : null;
  }

  function getExtensionAssetUrl(asset) {
    if (!asset || !asset.filename || !chrome.runtime || typeof chrome.runtime.getURL !== "function") {
      return "";
    }

    return chrome.runtime.getURL(asset.filename);
  }

  function getImageUrl(style) {
    var asset = getAssetById(style.backgroundAssetId);
    return style.customImageDataUrl || getExtensionAssetUrl(asset) || styleValue(style.backgroundImageUrl);
  }

  function getOverlayOpacity(style) {
    var asset = getAssetById(style.backgroundAssetId);
    var fallback = asset && asset.recommendedOverlayOpacity !== undefined ? asset.recommendedOverlayOpacity : 0.35;

    if (style.backgroundType === "image") {
      if (getByPath(style, "imageSettings.overlayEnabled", true) === false) {
        return 0;
      }
      return clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback));
    }

    if (style.backgroundType === "pattern") {
      return clampOpacity(getByPath(style, "patternSettings.overlayOpacity", fallback));
    }

    return clampOpacity(style.backgroundOverlayOpacity);
  }

  function getOverlayColor(style) {
    if (style.backgroundType === "image") {
      return getByPath(style, "imageSettings.overlayColor", "#000000");
    }

    return style.backgroundOverlayColor || "#000000";
  }

  function getPatternSize(style) {
    var scale = clampNumber(getByPath(style, "patternSettings.scale", 1), 0.5, 2.5, 1);
    return Math.round(28 * scale) + "px " + Math.round(28 * scale) + "px";
  }

  function getImagePosition(style) {
    var x = clampNumber(getByPath(style, "imageSettings.positionX", 50), 0, 100, 50);
    var y = clampNumber(getByPath(style, "imageSettings.positionY", 50), 0, 100, 50);
    return x + "% " + y + "%";
  }

  function getImageScale(style) {
    var scale = clampNumber(getByPath(style, "imageSettings.scale", 1), 0.5, 2.5, 1);
    return Math.round(scale * 100) + "% auto";
  }

  function getImageCssSettings(style) {
    var fit = styleValue(style.backgroundImageFit) || "cover";
    var scale = clampNumber(getByPath(style, "imageSettings.scale", 1), 0.5, 2.5, 1);
    var settings = {
      size: "cover",
      position: getImagePosition(style),
      repeat: "no-repeat"
    };

    if (fit === "contain") {
      settings.size = "contain";
    } else if (fit === "stretch") {
      settings.size = "100% 100%";
      settings.position = "center";
    } else if (fit === "tile") {
      settings.size = "auto";
      settings.repeat = "repeat";
    } else if (fit === "center") {
      settings.size = "auto";
    } else {
      settings.size = "cover";
    }

    if (scale !== 1 && fit !== "stretch" && fit !== "tile") {
      settings.size = getImageScale(style);
    }

    return settings;
  }

  function getImageBaseBackgroundColor(style) {
    return styleValue(style.backgroundImageBaseColor) || styleValue(style.backgroundColor) || "#0f172a";
  }

  function roundedDimension(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function rectDimensions(rect) {
    if (!rect || !Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) {
      return null;
    }

    return {
      width: roundedDimension(rect.width),
      height: roundedDimension(rect.height)
    };
  }

  function measureGhlSidebarDimensions() {
    var sidebar = findGhlSidebar();
    var dimensions = sidebar ? rectDimensions(sidebar.getBoundingClientRect()) : null;

    if (!sidebar || !dimensions) {
      return null;
    }

    return {
      sidebar: sidebar,
      sidebarWidth: dimensions.width,
      sidebarHeight: dimensions.height
    };
  }

  function measureAgencySkinImageSlotDimensions(sidebar) {
    var slot = sidebar ? sidebar.querySelector("[data-agencyskin-sidebar-bg-kind='wrapper']") : null;
    var dimensions = slot ? rectDimensions(slot.getBoundingClientRect()) : null;

    if (!dimensions && sidebar) {
      dimensions = rectDimensions(sidebar.getBoundingClientRect());
    }

    if (!dimensions) {
      return null;
    }

    return {
      imageSlotWidth: dimensions.width,
      imageSlotHeight: dimensions.height,
      imageSlotAspectRatio: roundedDimension(dimensions.width / dimensions.height)
    };
  }

  function measureSidebarPreviewLayout() {
    var sidebarMeasurement = measureGhlSidebarDimensions();
    var slotMeasurement = sidebarMeasurement ? measureAgencySkinImageSlotDimensions(sidebarMeasurement.sidebar) : null;

    if (!sidebarMeasurement || !slotMeasurement) {
      return null;
    }

    return {
      sidebarWidth: sidebarMeasurement.sidebarWidth,
      sidebarHeight: sidebarMeasurement.sidebarHeight,
      imageSlotWidth: slotMeasurement.imageSlotWidth,
      imageSlotHeight: slotMeasurement.imageSlotHeight,
      imageSlotAspectRatio: slotMeasurement.imageSlotAspectRatio
    };
  }

  function sidebarStatus(sidebar, options) {
    var dimensions = sidebar ? rectDimensions(sidebar.getBoundingClientRect()) : null;
    var selectorUsed = sidebar && sidebar.matches && sidebar.matches(preferredSidebarSelector) ? preferredSidebarSelector : "";

    options = options || {};
    return {
      ok: Boolean(sidebar && dimensions),
      message: sidebar && dimensions ? "Sidebar found." : "No GHL sidebar found on this page.",
      currentUrl: window.location.href,
      foundSidebar: Boolean(sidebar && dimensions),
      selectorUsed: selectorUsed || (sidebar ? "fallback sidebar selector" : ""),
      width: dimensions ? dimensions.width : 0,
      height: dimensions ? dimensions.height : 0,
      applied: Boolean(options.applied),
      cleanViewApplied: Boolean(sidebar && sidebar.getAttribute("data-agencyskin-cleanview-style-role") === "sidebar"),
      error: options.error || ""
    };
  }

  function waitForGhlSidebar(callback, timeoutMs) {
    var startedAt = Date.now();
    var waitMs = timeoutMs || sidebarWaitTimeoutMs;

    function checkSidebar() {
      var sidebar = findGhlSidebar();

      if (sidebar) {
        callback(sidebar);
        return;
      }

      if (Date.now() - startedAt >= waitMs) {
        callback(null);
        return;
      }

      window.setTimeout(checkSidebar, 100);
    }

    checkSidebar();
  }

  function getSidebarBackgroundValue(style) {
    if (style.backgroundType === "image" && styleValue(style.backgroundImageUrl)) {
      return "url(\"" + styleValue(style.backgroundImageUrl) + "\")";
    }

    if (style.backgroundType === "image") {
      var imageUrl = getImageUrl(style);
      return imageUrl ? "url(\"" + imageUrl + "\")" : "";
    }

    if (style.backgroundType === "pattern") {
      var asset = getAssetById(style.backgroundAssetId);
      return asset && asset.patternCss ? asset.patternCss : styleValue(style.backgroundColor);
    }

    if (style.backgroundType === "gradient") {
      var opacity = clampOpacity(style.backgroundOpacity === undefined ? 1 : style.backgroundOpacity);
      var start = getBackgroundColorValue(styleValue(style.gradientStartColor) || styleValue(style.backgroundColor) || "#0f172a", opacity);
      var end = getBackgroundColorValue(styleValue(style.gradientEndColor) || styleValue(style.backgroundColor) || "#1d4ed8", opacity);
      var direction = styleValue(style.gradientDirection) || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return styleValue(style.backgroundColor) ? getBackgroundColorValue(style.backgroundColor, style.backgroundOpacity) : "";
  }

  function colorValueToRgb(value) {
    var trimmed = String(value || "").trim();
    var rgbaMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);

    if (/^#([0-9A-F]{3}){1,2}$/i.test(trimmed)) {
      return hexToRgb(trimmed);
    }
    if (rgbaMatch) {
      return {
        r: clampNumber(rgbaMatch[1], 0, 255, 15),
        g: clampNumber(rgbaMatch[2], 0, 255, 23),
        b: clampNumber(rgbaMatch[3], 0, 255, 42)
      };
    }

    return null;
  }

  function isLightColorValue(value) {
    var rgb = colorValueToRgb(value);

    if (!rgb) {
      return false;
    }

    return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000 >= 160;
  }

  function getTopHeaderRepresentativeColor(style) {
    if (style.backgroundType === "gradient") {
      return style.gradientStartColor || style.backgroundColor || "#0f172a";
    }

    if (style.backgroundType === "image") {
      return getImageBaseBackgroundColor(style);
    }

    if (style.backgroundType === "pattern") {
      return style.backgroundColor || "#0f172a";
    }

    return style.backgroundColor || "#0f172a";
  }

  function getTopHeaderBackgroundValue(style) {
    if (style.backgroundType === "gradient") {
      return getSidebarBackgroundValue(style) || getBackgroundColorValue(style.backgroundColor || "#0f172a", style.backgroundOpacity);
    }

    if (style.backgroundType === "image") {
      return getBackgroundColorValue(getImageBaseBackgroundColor(style), 1);
    }

    if (style.backgroundType === "pattern") {
      return getBackgroundColorValue(style.backgroundColor || "#0f172a", 1);
    }

    return getSidebarBackgroundValue(style) || getBackgroundColorValue(style.backgroundColor || "#0f172a", style.backgroundOpacity);
  }

  function getTopHeaderBorderColor(style) {
    return isLightColorValue(getTopHeaderRepresentativeColor(style)) ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.12)";
  }

  function applySidebarBackground(sidebar, style) {
    var backgroundValue = getSidebarBackgroundValue(style);
    var wrapper = null;
    var layer = null;
    var overlay = null;
    var imageOpacity = clampOpacity(getByPath(style, "imageSettings.opacity", 0.85));
    var imageBlur = clampNumber(getByPath(style, "imageSettings.blur", 0), 0, 12, 0);
    var patternOpacity = clampOpacity(getByPath(style, "patternSettings.opacity", 0.5));
    var overlayOpacity = getOverlayOpacity(style);

    removeSidebarBackgroundLayers();
    sidebar.style.background = "";
    sidebar.style.backgroundImage = "";
    sidebar.style.backgroundSize = "";
    sidebar.style.backgroundPosition = "";
    sidebar.style.backgroundRepeat = "";

    if (style.backgroundType === "image" || style.backgroundType === "pattern") {
      var imageCss = style.backgroundType === "image" ? getImageCssSettings(style) : null;
      sidebar.style.background = style.backgroundType === "image" ? getImageBaseBackgroundColor(style) : (styleValue(style.backgroundColor) || "#0f172a");
      wrapper = document.createElement("div");
      layer = document.createElement("div");
      overlay = document.createElement("div");
      wrapper.setAttribute("data-agencyskin-sidebar-bg-layer", "true");
      wrapper.setAttribute("data-agencyskin-sidebar-bg-kind", "wrapper");
      layer.setAttribute("data-agencyskin-sidebar-bg-layer", "true");
      overlay.setAttribute("data-agencyskin-sidebar-bg-layer", "true");
      layer.setAttribute("data-agencyskin-sidebar-bg-kind", style.backgroundType);
      overlay.setAttribute("data-agencyskin-sidebar-bg-kind", "overlay");
      wrapper.style.position = "absolute";
      wrapper.style.inset = "0";
      wrapper.style.pointerEvents = "none";
      wrapper.style.zIndex = "0";
      wrapper.style.overflow = "hidden";
      wrapper.style.borderRadius = "inherit";
      layer.style.position = "absolute";
      layer.style.inset = "0";
      layer.style.pointerEvents = "none";
      layer.style.zIndex = "0";
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "0";
      overlay.style.background = getOverlayRgba(getOverlayColor(style), overlayOpacity);

      if (style.backgroundType === "image") {
        layer.style.backgroundColor = getImageBaseBackgroundColor(style);
        layer.style.backgroundImage = backgroundValue;
        layer.style.backgroundSize = imageCss.size;
        layer.style.backgroundPosition = imageCss.position;
        layer.style.backgroundRepeat = imageCss.repeat;
        layer.style.opacity = imageOpacity;
        layer.style.filter = imageBlur ? "blur(" + imageBlur + "px)" : "";
      } else {
        layer.style.backgroundImage = backgroundValue;
        layer.style.backgroundSize = getPatternSize(style);
        layer.style.backgroundRepeat = "repeat";
        layer.style.opacity = patternOpacity;
      }

      wrapper.appendChild(layer);
      wrapper.appendChild(overlay);
      sidebar.insertBefore(wrapper, sidebar.firstChild);
      return;
    }

    if (backgroundValue) {
      sidebar.style.background = backgroundValue;
    }
  }

  function isActiveMenuItem(element) {
    var className = element.className && element.className.toString ? element.className.toString().toLowerCase() : "";
    return element.getAttribute("aria-current") === "page" ||
      className.indexOf("active") !== -1 ||
      className.indexOf("selected") !== -1;
  }

  function injectSidebarStyleBlock(style) {
    var normalized = storage.normalizeSidebarStyle(style || {});
    var headerControls = normalized.headerControls || {};
    var topHeader = normalized.topHeader || {};
    var topHeaderBackground = topHeader.inheritFromTheme !== false ? getTopHeaderBackgroundValue(normalized) : "";
    var topHeaderBorder = topHeader.inheritFromTheme !== false ? getTopHeaderBorderColor(normalized) : "";
    var groupHoverBackground = styleValue(style.hoverBackgroundColor) || "rgba(255,255,255,0.08)";
    var groupExpandedBackground = getSubtleBackgroundColor(style.activeBackgroundColor, groupHoverBackground);
    var css = [
      "body.cleanview-enabled.cleanview-theme-header {",
      topHeaderBackground ? "--cleanview-top-header-bg: " + topHeaderBackground + ";" : "",
      topHeaderBorder ? "--cleanview-top-header-border: " + topHeaderBorder + ";" : "",
      "}",
      "body.cleanview-enabled.cleanview-theme-header .hl_header,",
      "body.cleanview-enabled.cleanview-theme-header .hl_header .container-fluid {",
      "background: var(--cleanview-top-header-bg) !important;",
      "border-bottom: 1px solid var(--cleanview-top-header-border, rgba(255,255,255,0.12)) !important;",
      "border-radius: 0 !important;",
      "border-top-left-radius: 0 !important;",
      "border-top-right-radius: 0 !important;",
      "}",
      "[data-agencyskin-cleanview-style-role='menu-item']:hover {",
      styleValue(style.hoverBackgroundColor) ? "background: " + style.hoverBackgroundColor + " !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='menu-item'] *,",
      "[data-agencyskin-cleanview-style-role='header'] * {",
      styleValue(style.textColor) ? "color: inherit !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='menu-item'] svg,",
      "[data-agencyskin-cleanview-style-role='menu-item'] i {",
      styleValue(style.iconColor) ? "color: " + style.iconColor + " !important; stroke: " + style.iconColor + " !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='header-control-button'] *,",
      "[data-agencyskin-cleanview-style-role='header-controls-cluster'] * {",
      headerControls.enabled && styleValue(getByPath(headerControls, "button.iconColor", "")) ? "color: inherit !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='header-control-button'] svg,",
      "[data-agencyskin-cleanview-style-role='header-control-button'] i,",
      "[data-agencyskin-cleanview-style-role='header-control-button'] path {",
      headerControls.enabled && styleValue(getByPath(headerControls, "button.iconColor", "")) ? "color: currentColor !important; fill: currentColor !important; stroke: currentColor !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='sidebar'] hr,",
      "[data-agencyskin-cleanview-style-role='sidebar'] [role='separator'] {",
      styleValue(style.dividerColor) ? "border-color: " + style.dividerColor + " !important; background: " + style.dividerColor + " !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='sidebar'] {",
      "isolation: isolate !important;",
      "position: relative !important;",
      "}",
      "[data-agencyskin-cleanview-style-role='sidebar'] > *:not([data-agencyskin-sidebar-bg-layer='true']) {",
      "position: relative;",
      "z-index: 1;",
      "}",
      "[data-agencyskin-cleanview-menu-group-row='true'] {",
      "align-items: center !important;",
      "background: transparent !important;",
      "border: 0 !important;",
      "box-sizing: border-box !important;",
      styleValue(style.textColor) ? "color: " + style.textColor + " !important;" : "color: inherit !important;",
      "cursor: pointer !important;",
      "display: flex !important;",
      "font: inherit !important;",
      "font-size: 12px !important;",
      "font-weight: 800 !important;",
      "gap: 8px !important;",
      "height: 34px !important;",
      "justify-content: flex-start !important;",
      "letter-spacing: 0 !important;",
      "line-height: 1 !important;",
      "margin: 3px 8px !important;",
      "max-width: calc(100% - 16px) !important;",
      "min-height: 34px !important;",
      "opacity: 0.82 !important;",
      "overflow: hidden !important;",
      "padding: 0 10px !important;",
      "position: relative !important;",
      "text-align: left !important;",
      "width: calc(100% - 16px) !important;",
      "z-index: 1 !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-row='true']:hover {",
      "background: " + groupHoverBackground + " !important;",
      "box-shadow: none !important;",
      "transform: none !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-row='true'][data-agencyskin-cleanview-menu-group-expanded='true'] {",
      "background: " + groupExpandedBackground + " !important;",
      "box-shadow: none !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-caret='true'] {",
      styleValue(style.iconColor) ? "color: " + style.iconColor + " !important;" : "",
      "display: inline-flex !important;",
      "flex: 0 0 12px !important;",
      "font-size: 11px !important;",
      "justify-content: center !important;",
      "opacity: 0.7 !important;",
      "width: 12px !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-label='true'] {",
      "display: block !important;",
      "min-width: 0 !important;",
      "overflow: hidden !important;",
      "text-overflow: ellipsis !important;",
      "white-space: nowrap !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-child='true'] {",
      "box-sizing: border-box !important;",
      "margin-left: 10px !important;",
      "max-width: calc(100% - 10px) !important;",
      "position: relative !important;",
      "z-index: 1 !important;",
      "}",
      "[data-agencyskin-cleanview-menu-group-header='true'] {",
      "box-sizing: border-box !important;",
      "color: inherit !important;",
      "font-size: 10px !important;",
      "font-weight: 800 !important;",
      "letter-spacing: 0.08em !important;",
      "line-height: 1.2 !important;",
      "margin: 10px 8px 4px !important;",
      "max-width: calc(100% - 16px) !important;",
      "opacity: 0.62 !important;",
      "overflow: hidden !important;",
      "padding: 0 6px !important;",
      "pointer-events: none !important;",
      "position: relative !important;",
      "text-overflow: ellipsis !important;",
      "text-transform: uppercase !important;",
      "white-space: nowrap !important;",
      "z-index: 1 !important;",
      "}"
    ].join("\n");
    var styleBlock = document.createElement("style");

    removeSidebarStyleBlock();
    styleBlock.id = styleBlockId;
    styleBlock.textContent = css;
    document.documentElement.appendChild(styleBlock);
  }

  function hasKnownMenuText(element) {
    var text = normalizeText(element && element.textContent);
    return text.indexOf("conversations") !== -1 ||
      text.indexOf("contacts") !== -1 ||
      text.indexOf("opportunities") !== -1 ||
      text.indexOf("calendars") !== -1 ||
      text.indexOf("marketing") !== -1 ||
      text.indexOf("settings") !== -1;
  }

  function isBeforeElement(element, reference) {
    if (!element || !reference || element === reference) {
      return true;
    }

    return Boolean(element.compareDocumentPosition(reference) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function getElementSignalText(element) {
    return normalizeText([
      element.tagName,
      element.id,
      element.className && element.className.toString ? element.className.toString() : "",
      element.getAttribute("alt"),
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("src")
    ].join(" "));
  }

  function findBrandingContainer(sidebar, candidate) {
    var container = candidate.closest("a[href], button, [class*='logo'], [id*='logo'], [class*='brand'], [id*='brand']") || candidate;

    if (!sidebar.contains(container)) {
      return candidate;
    }

    if (hasKnownMenuText(container) || normalizeText(container.textContent).length > 80) {
      return candidate;
    }

    return container;
  }

  function findGhlSidebarBrandingBlock(sidebar) {
    var sidebarRect = sidebar.getBoundingClientRect();
    var firstMenuItem = getFirstVisibleNormalMenuItem(sidebar);
    var candidates = Array.prototype.slice.call(sidebar.querySelectorAll("img, svg, [class*='logo'], [id*='logo'], [class*='brand'], [id*='brand'], [aria-label], [title]"));

    for (var index = 0; index < candidates.length; index += 1) {
      var candidate = candidates[index];
      var signal = getElementSignalText(candidate);
      var isBrandSignal = signal.indexOf("highlevel") !== -1 ||
        signal.indexOf("leadconnector") !== -1 ||
        signal.indexOf("gohighlevel") !== -1 ||
        signal.indexOf("logo") !== -1 ||
        signal.indexOf("brand") !== -1;
      var candidateRect = candidate.getBoundingClientRect();
      var isNearTop = candidateRect.top <= sidebarRect.top + Math.max(140, sidebarRect.height * 0.25);

      if (candidate.closest("[data-agencyskin-custom-sidebar-branding='true']")) {
        continue;
      }

      if (!isBrandSignal && candidate.tagName.toLowerCase() !== "img") {
        continue;
      }

      if (!isNearTop || !isBeforeElement(candidate, firstMenuItem)) {
        continue;
      }

      return findBrandingContainer(sidebar, candidate);
    }

    console.warn("[AgencySkin CleanView] Could not confidently find native sidebar branding block.");
    return null;
  }

  function hideNativeSidebarBranding(brandingElement) {
    if (!brandingElement) {
      return false;
    }

    if (!brandingElement.hasAttribute("data-agencyskin-native-branding-original-style")) {
      brandingElement.setAttribute("data-agencyskin-native-branding-original-style", brandingElement.getAttribute("style") || "");
    }

    brandingElement.setAttribute("data-agencyskin-hidden-native-branding", "true");
    brandingElement.style.setProperty("display", "none", "important");
    return true;
  }

  function getAlignmentFlexValue(alignment) {
    if (alignment === "left") {
      return "flex-start";
    }

    if (alignment === "right") {
      return "flex-end";
    }

    return "center";
  }

  function resolveBrandLogoUrl(style) {
    var brandSettings = namespace.brandSettings || {};
    return styleValue(style.customLogoDataUrl) || styleValue(style.logoUrl) || styleValue(brandSettings.logoUrl) || styleValue(namespace.defaultBrandLogoUrl);
  }

  function resolveBrandHeaderLabel(style) {
    var brandSettings = namespace.brandSettings || {};
    return styleValue(style.headerLabel) || styleValue(brandSettings.brandName) || "AgencySkin";
  }

  function injectCustomSidebarBranding(sidebar, style) {
    var alignment = style.headerAlignment || "center";
    var branding = document.createElement("div");
    var logoUrl = resolveBrandLogoUrl(style);
    var labelText = resolveBrandHeaderLabel(style);
    var alignItems = getAlignmentFlexValue(alignment);
    var logo = null;
    var label = null;

    removeCustomSidebarBranding();
    branding.setAttribute("data-agencyskin-custom-sidebar-branding", "true");
    markStyledElement(branding, "header");
    branding.style.display = "flex";
    branding.style.flexDirection = "column";
    branding.style.alignItems = alignItems;
    branding.style.justifyContent = "center";
    branding.style.gap = "6px";
    branding.style.padding = "10px 8px 12px";
    branding.style.color = styleValue(style.textColor) || "#ffffff";
    branding.style.textAlign = alignment;
    branding.style.fontWeight = "700";

    if (logoUrl) {
      logo = document.createElement("img");
      logo.src = logoUrl;
      logo.alt = labelText;
      logo.style.maxHeight = style.logoSize || "32px";
      logo.style.maxWidth = "100%";
      logo.style.objectFit = "contain";
      logo.onerror = function hideBrokenLogo() {
        logo.hidden = true;
      };
      branding.appendChild(logo);
    }

    if (labelText) {
      label = document.createElement("div");
      label.className = "agencyskin-sidebar-branding-label";
      label.textContent = labelText;
      branding.appendChild(label);
    }

    sidebar.insertBefore(branding, sidebar.firstChild);
  }

  function applySidebarBranding(sidebar, style) {
    var brandingMode = style.sidebarBrandingMode || "keep";
    var nativeBranding = null;
    var changedCount = 0;

    removeCustomSidebarBranding();
    restoreNativeSidebarBranding();

    if (brandingMode === "keep") {
      return changedCount;
    }

    nativeBranding = findGhlSidebarBrandingBlock(sidebar);
    if (hideNativeSidebarBranding(nativeBranding)) {
      changedCount += 1;
    }

    if (brandingMode === "replace") {
      injectCustomSidebarBranding(sidebar, style);
      changedCount += 1;
    }

    return changedCount;
  }

  function applyTopHeaderTheme(sidebarStyle) {
    var style = storage.normalizeSidebarStyle(sidebarStyle || {});
    var topHeader = style.topHeader || {};

    clearTopHeaderThemeState();
    if (!style.enabled || topHeader.inheritFromTheme === false || !document.body) {
      return 0;
    }

    injectSidebarStyleBlock(style);
    document.body.classList.add("cleanview-enabled", "cleanview-theme-header");
    document.body.style.setProperty("--cleanview-top-header-bg", getTopHeaderBackgroundValue(style));
    document.body.style.setProperty("--cleanview-top-header-border", getTopHeaderBorderColor(style));
    return document.querySelector(".hl_header") ? 1 : 0;
  }

  function findHeaderControlsCluster() {
    return document.querySelector(".hl_header--controls");
  }

  function findHeaderControlsWrapper(cluster) {
    var wrapper = cluster && cluster.closest ? cluster.closest(".container-fluid.justify-end") : null;

    if (wrapper && wrapper.contains(cluster)) {
      return wrapper;
    }

    return null;
  }

  function topLevelHeaderControlForNode(cluster, node) {
    var current = node;

    while (current && current.parentElement && current.parentElement !== cluster) {
      current = current.parentElement;
    }

    return current && current.parentElement === cluster ? current : null;
  }

  function getHeaderControlCandidates(cluster) {
    var directChildren = cluster ? Array.prototype.slice.call(cluster.children || []) : [];
    var matches = cluster ? Array.prototype.slice.call(cluster.querySelectorAll("a, button, [role='button'], [aria-label], [title], img")) : [];
    var candidates = [];

    directChildren.forEach(function addDirectChild(child) {
      if (candidates.indexOf(child) === -1) {
        candidates.push(child);
      }
    });

    matches.forEach(function addMatch(match) {
      var topLevel = topLevelHeaderControlForNode(cluster, match);

      if (topLevel && candidates.indexOf(topLevel) === -1) {
        candidates.push(topLevel);
      }
    });

    return candidates.filter(function keepCandidate(candidate) {
      return candidate && candidate.nodeType === 1;
    });
  }

  function headerControlSignalText(element) {
    var descendantSignals = Array.prototype.slice.call(element.querySelectorAll("*")).slice(0, 12).map(function mapNode(node) {
      return [
        node.tagName,
        node.id,
        node.className && node.className.toString ? node.className.toString() : "",
        node.getAttribute("aria-label"),
        node.getAttribute("title"),
        node.getAttribute("href"),
        node.getAttribute("alt"),
        node.textContent
      ].join(" ");
    }).join(" ");

    return normalizeText([
      element.tagName,
      element.id,
      element.className && element.className.toString ? element.className.toString() : "",
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("href"),
      element.getAttribute("alt"),
      element.textContent,
      descendantSignals
    ].join(" "));
  }

  function headerControlMatchScore(element, key) {
    var signal = headerControlSignalText(element);
    var hasImage = Boolean(element.querySelector("img, [class*='avatar'], [class*='profile'], [class*='user']"));

    if (key === "askAi") {
      if (signal.indexOf("ask ai") !== -1 || signal.indexOf("ask-ai") !== -1 || signal.indexOf("askai") !== -1) {
        return 10;
      }
      if (signal.indexOf("assistant") !== -1) {
        return 6;
      }
      return 0;
    }
    if (key === "call") {
      if (signal.indexOf("call") !== -1 || signal.indexOf("phone") !== -1 || signal.indexOf("dial") !== -1) {
        return 8;
      }
      return 0;
    }
    if (key === "notifications") {
      if (signal.indexOf("notification") !== -1 || signal.indexOf("notifications") !== -1 || signal.indexOf("bell") !== -1 || signal.indexOf("alert") !== -1) {
        return 8;
      }
      return 0;
    }
    if (key === "help") {
      if (signal.indexOf("help") !== -1 || signal.indexOf("support") !== -1 || signal.indexOf("question") !== -1) {
        return 8;
      }
      return 0;
    }
    if (key === "avatar") {
      if (signal.indexOf("avatar") !== -1 || signal.indexOf("profile") !== -1 || signal.indexOf("account") !== -1 || signal.indexOf("user") !== -1) {
        return 8;
      }
      if (hasImage) {
        return 5;
      }
      return 0;
    }

    return 0;
  }

  function findHeaderControlElements(cluster) {
    var controlKeys = ["askAi", "call", "notifications", "help", "avatar"];
    var candidates = getHeaderControlCandidates(cluster);
    var matches = {};
    var usedCandidates = [];

    controlKeys.forEach(function matchControl(key) {
      var bestCandidate = null;
      var bestScore = 0;

      candidates.forEach(function scoreCandidate(candidate) {
        var score = usedCandidates.indexOf(candidate) === -1 ? headerControlMatchScore(candidate, key) : 0;

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      });

      if (bestCandidate && bestScore > 0) {
        matches[key] = bestCandidate;
        usedCandidates.push(bestCandidate);
      }
    });

    return matches;
  }

  function applyHeaderControlsStyle(sidebarStyle) {
    var style = storage.normalizeSidebarStyle(sidebarStyle || {});
    var controls = style.headerControls || {};
    var cluster = null;
    var wrapper = null;
    var target = null;
    var matchedControls = {};
    var changedCount = 0;

    if (!controls.enabled) {
      return 0;
    }

    cluster = findHeaderControlsCluster();
    if (!cluster) {
      console.warn("[AgencySkin CleanView] Could not find GHL header controls cluster.");
      return 0;
    }

    wrapper = findHeaderControlsWrapper(cluster);
    target = wrapper || cluster;
    matchedControls = findHeaderControlElements(cluster);

    injectSidebarStyleBlock(style);
    markStyledElement(cluster, "header-controls-cluster");
    if (target !== cluster) {
      markStyledElement(target, "header-controls-wrapper");
    }

    if (controls.visibility && controls.visibility.cluster === false) {
      cluster.style.setProperty("display", "none", "important");
      return 1;
    }

    cluster.style.removeProperty("display");
    if (styleValue(getByPath(controls, "wrapper.backgroundColor", ""))) {
      target.style.background = controls.wrapper.backgroundColor;
    }
    if (styleValue(getByPath(controls, "wrapper.borderRadius", ""))) {
      target.style.borderRadius = controls.wrapper.borderRadius;
    }
    if (styleValue(getByPath(controls, "wrapper.gap", ""))) {
      target.style.gap = controls.wrapper.gap;
      cluster.style.gap = controls.wrapper.gap;
    }
    target.style.opacity = String(clampOpacity(getByPath(controls, "wrapper.opacity", 1)));
    changedCount += target === cluster ? 1 : 2;

    Object.keys(matchedControls).forEach(function applyControl(key) {
      var element = matchedControls[key];

      if (!element) {
        return;
      }

      markStyledElement(element, "header-control-button");
      if (controls.visibility && controls.visibility[key] === false) {
        element.style.setProperty("display", "none", "important");
        changedCount += 1;
        return;
      }

      element.style.removeProperty("display");
      if (styleValue(getByPath(controls, "button.backgroundColor", ""))) {
        element.style.background = controls.button.backgroundColor;
      }
      if (styleValue(getByPath(controls, "button.iconColor", ""))) {
        element.style.color = controls.button.iconColor;
      }
      if (styleValue(getByPath(controls, "button.borderRadius", ""))) {
        element.style.borderRadius = controls.button.borderRadius;
      }
      element.style.opacity = String(clampOpacity(getByPath(controls, "button.opacity", 1)));
      changedCount += 1;
    });

    return changedCount;
  }

  function applyAssetDefaults(style, asset) {
    if (!asset) {
      return style;
    }

    style.backgroundType = asset.type;
    style.backgroundAssetId = asset.id;
    style.textColor = asset.textColor || style.textColor;
    style.activeBackgroundColor = asset.activeBackgroundColor || style.activeBackgroundColor;
    style.activeTextColor = asset.activeTextColor || style.activeTextColor;
    style.hoverBackgroundColor = asset.hoverBackgroundColor || style.hoverBackgroundColor;

    if (asset.type === "image") {
      style.customImageDataUrl = "";
      style.backgroundImageUrl = "";
      style.imageSettings = Object.assign({}, style.imageSettings || {}, {
        positionX: asset.focalPointX || 50,
        positionY: asset.focalPointY || 50,
        scale: asset.defaultScale || 1,
        blur: asset.recommendedBlur || 0,
        overlayOpacity: asset.recommendedOverlayOpacity || 0.55
      });
    }

    if (asset.type === "pattern") {
      style.backgroundColor = asset.backgroundColor || style.backgroundColor;
      style.patternSettings = Object.assign({}, style.patternSettings || {}, {
        scale: asset.defaultScale || 1,
        opacity: getByPath(style, "patternSettings.opacity", 0.5),
        overlayOpacity: asset.recommendedOverlayOpacity || 0.35
      });
    }

    return style;
  }

  function applyCuratedStylePreset(style, preset) {
    var nextStyle = Object.assign({}, style, preset.style || {});
    var asset = preset.assetId ? getAssetById(preset.assetId) : null;

    nextStyle.activePresetId = preset.id;
    if (asset) {
      nextStyle = applyAssetDefaults(nextStyle, asset);
    }

    return nextStyle;
  }

  function getShuffleTypes(style, shuffle) {
    if (shuffle.poolMode === "images-patterns") {
      return ["image", "pattern"];
    }

    if (shuffle.poolMode === "custom") {
      return (shuffle.customPool || []).map(function mapCustomType(type) {
        return type === "images" ? "image" : type === "patterns" ? "pattern" : type === "gradients" ? "gradient" : "solid";
      });
    }

    if (shuffle.poolMode === "patterns") {
      return ["pattern"];
    }

    if (shuffle.poolMode === "uploads") {
      return ["image"];
    }

    if (shuffle.poolMode === "professional-patterns" || shuffle.poolMode === "professional" || shuffle.poolMode === "personal" || shuffle.poolMode === "favorites") {
      return ["solid", "gradient", "pattern", "image"];
    }

    return [style.backgroundType || "solid"];
  }

  function shouldShuffleNow(style, shuffle) {
    var key = "agencyskin-shuffle-" + (style.activePresetId || style.preset || "custom");
    var today = new Date().toISOString().slice(0, 10);
    var stored = null;

    if (!shuffle.enabled || shuffle.frequency === "manual") {
      return false;
    }

    if (shuffle.frequency === "page-load") {
      return true;
    }

    try {
      if (shuffle.frequency === "session") {
        stored = window.sessionStorage.getItem(key);
        if (stored) {
          return false;
        }
        window.sessionStorage.setItem(key, "1");
        return true;
      }

      if (shuffle.frequency === "daily") {
        stored = window.localStorage.getItem(key);
        if (stored === today) {
          return false;
        }
        window.localStorage.setItem(key, today);
        return true;
      }
    } catch (error) {
      return shuffle.frequency === "page-load";
    }

    return false;
  }

  function resolveShuffledSidebarStyle(sidebarStyle) {
    var style = Object.assign({}, sidebarStyle || {});
    var shuffle = style.curatedShuffle || {};
    var types = new Set(getShuffleTypes(style, shuffle));
    var favorites = new Set(style.favoriteAssetIds || []);
    var recent = shuffle.avoidRecentRepeats ? new Set(shuffle.lastAppliedAssetIds || []) : new Set();
    var candidates = (namespace.curatedSidebarStylePresets || []).filter(function keepPreset(preset) {
      if (!preset.safeForCuratedShuffle || !types.has(preset.type)) {
        return false;
      }
      if (shuffle.poolMode === "professional" && preset.category !== "professional") {
        return false;
      }
      if (shuffle.poolMode === "professional-patterns" && preset.category !== "professional" && preset.type !== "pattern") {
        return false;
      }
      if (shuffle.poolMode === "personal" && preset.category !== "personal") {
        return false;
      }
      if (shuffle.poolMode === "patterns" && preset.type !== "pattern") {
        return false;
      }
      if (shuffle.poolMode === "uploads") {
        return false;
      }
      if (shuffle.poolMode === "favorites" && !favorites.has(preset.id)) {
        return false;
      }
      return true;
    });
    var filtered = candidates.filter(function removeRecent(preset) {
      return !recent.has(preset.id) && (!preset.assetId || !recent.has(preset.assetId));
    });
    var selected = null;

    if (!shouldShuffleNow(style, shuffle)) {
      return style;
    }

    candidates = filtered.length ? filtered : candidates;
    if (!candidates.length) {
      return style;
    }

    selected = candidates[Math.floor(Math.random() * candidates.length)];
    return applyCuratedStylePreset(style, selected);
  }

  function applySidebarStyle(sidebarStyle) {
    var style = resolveShuffledSidebarStyle(sidebarStyle || {});
    var sidebar = null;
    var menuItems = [];
    var brandingCount = 0;

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
    applySidebarBackground(sidebar, style);
    if (styleValue(style.sidebarPadding)) {
      sidebar.style.padding = style.sidebarPadding;
    }
    sidebar.style.borderRadius = style.structuralChromeRadius || "0px";
    sidebar.style.borderTopLeftRadius = style.structuralChromeRadius || "0px";
    sidebar.style.borderTopRightRadius = style.structuralChromeRadius || "0px";
    if (style.borderVisible === false) {
      sidebar.style.borderColor = "transparent";
    }
    if (style.shadowStrength !== undefined) {
      sidebar.style.boxShadow = "0 12px 32px rgba(15, 23, 42, " + clampOpacity(style.shadowStrength) + ")";
    }
    if (styleValue(style.textColor)) {
      sidebar.style.color = style.textColor;
    }

    injectSidebarStyleBlock(style);
    brandingCount = applySidebarBranding(sidebar, style);

    menuItems = Array.prototype.slice.call(sidebar.querySelectorAll("a, button, [role='button']"));
    menuItems.forEach(function styleMenuItem(element) {
      markStyledElement(element, "menu-item");
      if (styleValue(style.textColor)) {
        element.style.color = style.textColor;
      }
      if (styleValue(style.menuItemRadius) || styleValue(style.borderRadius)) {
        element.style.borderRadius = style.menuItemRadius || style.borderRadius;
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

    return menuItems.length + brandingCount + 1;
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

  function applyMenuOrder(visibleItems, visibleSet, menuGroups) {
    var sidebar = findGhlSidebar();
    var orderedKeys = [];
    var seen = {};
    var elements = [];
    var parent = null;
    var firstCurrentElement = null;
    var insertionPoint = null;

    if (!sidebar || !Array.isArray(visibleItems) || !visibleItems.length || Array.isArray(menuGroups) && menuGroups.length) {
      return 0;
    }

    visibleItems.concat(allMenuKeys).forEach(function collectOrderedKey(key) {
      if (allMenuKeys.indexOf(key) !== -1 && visibleSet.has(key) && !seen[key]) {
        seen[key] = true;
        orderedKeys.push(key);
      }
    });

    orderedKeys.forEach(function collectOrderedElement(key) {
      var element = getVisibleMenuElement(key, sidebar);

      if (!element || !element.parentNode) {
        return;
      }
      if (!parent) {
        parent = element.parentNode;
      }
      if (element.parentNode === parent) {
        elements.push(element);
      }
    });

    if (!parent || elements.length < 2) {
      return 0;
    }

    firstCurrentElement = Array.prototype.slice.call(parent.children).find(function findFirstMenuChild(child) {
      return elements.indexOf(child) !== -1;
    });

    elements.forEach(function rememberOrderedElement(element) {
      rememberMenuGroupOriginalPosition(element);
    });

    if (firstCurrentElement && firstCurrentElement !== elements[0]) {
      parent.insertBefore(elements[0], firstCurrentElement);
    }
    insertionPoint = elements[0];
    elements.slice(1).forEach(function moveOrderedElement(element) {
      if (element.parentNode === parent && insertionPoint.nextSibling !== element) {
        parent.insertBefore(element, insertionPoint.nextSibling);
      }
      insertionPoint = element;
    });

    return elements.length;
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

  function menuGroupParentRowForChild(element) {
    var groupId = element && element.getAttribute("data-agencyskin-cleanview-menu-group-id");

    if (!groupId || element.getAttribute("data-agencyskin-cleanview-menu-group-child") !== "true") {
      return null;
    }

    return Array.prototype.slice.call(document.querySelectorAll("[data-agencyskin-cleanview-menu-group-row='true']")).find(function matchGroup(row) {
      return row.getAttribute("data-agencyskin-cleanview-menu-group-id") === groupId;
    }) || null;
  }

  function lastMenuGroupChildForTarget(element) {
    var groupId = element && element.getAttribute("data-agencyskin-cleanview-menu-group-id");
    var children = groupId ? menuGroupChildren(groupId).filter(function keepConnected(child) {
      return child.isConnected;
    }) : [];

    return children.length ? children[children.length - 1] : element;
  }

  function insertBeforeTarget(sidebar, linkElement, target) {
    var groupParent = menuGroupParentRowForChild(target);

    if (groupParent) {
      target = groupParent;
    }

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
    if (target && target.getAttribute("data-agencyskin-cleanview-menu-group-child") === "true") {
      target = lastMenuGroupChildForTarget(target);
    }

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

  function removeMenuGroupRows() {
    document.querySelectorAll("[data-agencyskin-cleanview-menu-group-header='true'], [data-agencyskin-cleanview-menu-group-row='true']").forEach(function removeGroupRow(row) {
      row.remove();
    });
  }

  function restoreMenuGroupChildState(sidebar) {
    var root = sidebar || document;

    root.querySelectorAll("[data-agencyskin-cleanview-menu-group-child='true']").forEach(function restoreChild(element) {
      var originalDisplay = element.getAttribute("data-agencyskin-cleanview-menu-group-original-display");
      var originalMarginLeft = element.getAttribute("data-agencyskin-cleanview-menu-group-original-margin-left");
      var originalMaxWidth = element.getAttribute("data-agencyskin-cleanview-menu-group-original-max-width");
      var originalBoxSizing = element.getAttribute("data-agencyskin-cleanview-menu-group-original-box-sizing");

      if (originalDisplay) {
        element.style.display = originalDisplay;
      } else {
        element.style.removeProperty("display");
      }
      if (originalMarginLeft) {
        element.style.marginLeft = originalMarginLeft;
      } else {
        element.style.removeProperty("margin-left");
      }
      if (originalMaxWidth) {
        element.style.maxWidth = originalMaxWidth;
      } else {
        element.style.removeProperty("max-width");
      }
      if (originalBoxSizing) {
        element.style.boxSizing = originalBoxSizing;
      } else {
        element.style.removeProperty("box-sizing");
      }

      element.removeAttribute("data-agencyskin-cleanview-menu-group-child");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-id");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-collapsed");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-original-display");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-original-margin-left");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-original-max-width");
      element.removeAttribute("data-agencyskin-cleanview-menu-group-original-box-sizing");
    });
  }

  function rememberMenuGroupOriginalPosition(element) {
    if (element.__agencySkinMenuGroupOriginalParent) {
      return;
    }

    menuGroupOrderCounter += 1;
    element.__agencySkinMenuGroupOriginalParent = element.parentNode;
    element.__agencySkinMenuGroupOriginalNextSibling = element.nextSibling;
    element.__agencySkinMenuGroupOriginalOrder = menuGroupOrderCounter;
  }

  function restoreMenuGroupOriginalOrder(sidebar) {
    var elements = [];

    if (!sidebar) {
      return;
    }

    allMenuKeys.forEach(function collectMenuElements(key) {
      getMenuElements(key).forEach(function collectElement(element) {
        if (sidebar.contains(element) && element.__agencySkinMenuGroupOriginalParent) {
          elements.push(element);
        }
      });
    });

    elements.sort(function sortByOriginalOrder(a, b) {
      return (b.__agencySkinMenuGroupOriginalOrder || 0) - (a.__agencySkinMenuGroupOriginalOrder || 0);
    }).forEach(function restoreElement(element) {
      var parent = element.__agencySkinMenuGroupOriginalParent;
      var nextSibling = element.__agencySkinMenuGroupOriginalNextSibling;

      if (parent && parent.isConnected && element.isConnected) {
        parent.insertBefore(element, nextSibling && nextSibling.parentNode === parent ? nextSibling : null);
      }

      delete element.__agencySkinMenuGroupOriginalParent;
      delete element.__agencySkinMenuGroupOriginalNextSibling;
      delete element.__agencySkinMenuGroupOriginalOrder;
    });
  }

  function menuGroupChildren(groupId) {
    return Array.prototype.slice.call(document.querySelectorAll("[data-agencyskin-cleanview-menu-group-child='true']")).filter(function matchGroup(element) {
      return element.getAttribute("data-agencyskin-cleanview-menu-group-id") === groupId;
    });
  }

  function resolveMenuGroupId(group, groupIndex) {
    return group && group.id ? group.id : "cleanview-group-" + groupIndex;
  }

  function getMenuGroupExpandedState(group, groupId) {
    if (menuGroupExpandedState[groupId] === undefined) {
      menuGroupExpandedState[groupId] = !(group && group.collapsed === true);
    }

    return menuGroupExpandedState[groupId] !== false;
  }

  function setMenuGroupExpanded(parentRow, expanded) {
    var groupId = parentRow.getAttribute("data-agencyskin-cleanview-menu-group-id");
    var caret = parentRow.querySelector("[data-agencyskin-cleanview-menu-group-caret='true']");

    menuGroupExpandedState[groupId] = expanded === true;
    parentRow.setAttribute("data-agencyskin-cleanview-menu-group-expanded", expanded ? "true" : "false");
    parentRow.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (caret) {
      caret.textContent = expanded ? "v" : ">";
    }

    menuGroupChildren(groupId).forEach(function updateChild(element) {
      var originalDisplay = element.getAttribute("data-agencyskin-cleanview-menu-group-original-display");

      if (!expanded) {
        if (!element.hasAttribute("data-agencyskin-cleanview-menu-group-original-display")) {
          element.setAttribute("data-agencyskin-cleanview-menu-group-original-display", element.style.display || "");
        }
        element.style.setProperty("display", "none", "important");
        element.setAttribute("data-agencyskin-cleanview-menu-group-collapsed", "true");
        return;
      }

      if (originalDisplay) {
        element.style.display = originalDisplay;
      } else {
        element.style.removeProperty("display");
      }
      element.removeAttribute("data-agencyskin-cleanview-menu-group-collapsed");
    });
  }

  function toggleMenuGroup(parentRow) {
    var nextExpanded = parentRow.getAttribute("data-agencyskin-cleanview-menu-group-expanded") !== "true";

    return withObserverPaused(function toggleWithObserverPaused() {
      setMenuGroupExpanded(parentRow, nextExpanded);
    });
  }

  function createMenuGroupParentRow(group, groupId) {
    var parentRow = document.createElement("button");
    var caret = document.createElement("span");
    var label = document.createElement("span");
    var expanded = getMenuGroupExpandedState(group, groupId);

    parentRow.type = "button";
    parentRow.setAttribute("data-agencyskin-cleanview-menu-group-row", "true");
    parentRow.setAttribute("data-agencyskin-cleanview-menu-group", "true");
    parentRow.setAttribute("data-agencyskin-cleanview-menu-group-id", groupId);
    parentRow.setAttribute("data-agencyskin-cleanview-style-role", "group-parent");
    parentRow.setAttribute("aria-expanded", expanded ? "true" : "false");
    caret.setAttribute("data-agencyskin-cleanview-menu-group-caret", "true");
    label.setAttribute("data-agencyskin-cleanview-menu-group-label", "true");
    caret.textContent = expanded ? "v" : ">";
    label.textContent = (group && group.label) || "Menu Group";
    parentRow.appendChild(caret);
    parentRow.appendChild(label);
    parentRow.style.alignItems = "center";
    parentRow.style.background = "transparent";
    parentRow.style.border = "0";
    parentRow.style.boxSizing = "border-box";
    parentRow.style.color = "inherit";
    parentRow.style.cursor = "pointer";
    parentRow.style.display = "flex";
    parentRow.style.fontSize = "12px";
    parentRow.style.fontWeight = "800";
    parentRow.style.gap = "8px";
    parentRow.style.height = "34px";
    parentRow.style.lineHeight = "1";
    parentRow.style.margin = "3px 8px";
    parentRow.style.maxWidth = "calc(100% - 16px)";
    parentRow.style.minHeight = "34px";
    parentRow.style.overflow = "hidden";
    parentRow.style.padding = "0 10px";
    parentRow.style.textAlign = "left";
    parentRow.style.width = "calc(100% - 16px)";
    parentRow.addEventListener("click", function toggleGroup(event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenuGroup(parentRow);
    });
    return parentRow;
  }

  function markMenuGroupChild(element, groupId) {
    if (!element.hasAttribute("data-agencyskin-cleanview-menu-group-original-display")) {
      element.setAttribute("data-agencyskin-cleanview-menu-group-original-display", element.style.display || "");
    }
    if (!element.hasAttribute("data-agencyskin-cleanview-menu-group-original-margin-left")) {
      element.setAttribute("data-agencyskin-cleanview-menu-group-original-margin-left", element.style.marginLeft || "");
      element.setAttribute("data-agencyskin-cleanview-menu-group-original-max-width", element.style.maxWidth || "");
      element.setAttribute("data-agencyskin-cleanview-menu-group-original-box-sizing", element.style.boxSizing || "");
    }
    element.setAttribute("data-agencyskin-cleanview-menu-group-child", "true");
    element.setAttribute("data-agencyskin-cleanview-menu-group", "true");
    element.setAttribute("data-agencyskin-cleanview-menu-group-id", groupId);
    element.style.boxSizing = "border-box";
    element.style.marginLeft = "10px";
    element.style.maxWidth = "calc(100% - 10px)";
  }

  function applyMenuGroups(menuGroups, visibleSet) {
    var sidebar = findGhlSidebar();
    var appliedCount = 0;
    var groupedKeys = {};

    if (!sidebar) {
      removeMenuGroupRows();
      return 0;
    }

    restoreMenuGroupChildState(sidebar);
    restoreMenuGroupOriginalOrder(sidebar);
    removeMenuGroupRows();

    if (!Array.isArray(menuGroups) || menuGroups.length === 0) {
      return 0;
    }

    menuGroups.forEach(function applyGroup(group, groupIndex) {
      var groupItems = Array.isArray(group.items) ? group.items : [];
      var foundElements = [];
      var parent = null;
      var parentRow = null;
      var insertionPoint = null;
      var groupId = resolveMenuGroupId(group, groupIndex);

      groupItems.forEach(function collectGroupItem(key) {
        var element = null;

        if (allMenuKeys.indexOf(key) === -1 || !visibleSet.has(key) || groupedKeys[key]) {
          return;
        }

        element = getVisibleMenuElement(key, sidebar);
        if (!element ||
            element.getAttribute("data-agencyskin-cleanview-menu-group-row") === "true" ||
            element.getAttribute("data-agencyskin-cleanview-menu-group-header") === "true") {
          return;
        }

        if (!parent) {
          parent = element.parentNode;
        }

        if (element.parentNode === parent) {
          foundElements.push(element);
          groupedKeys[key] = true;
        }
      });

      if (!parent || foundElements.length === 0) {
        return;
      }

      parentRow = createMenuGroupParentRow(group, groupId);
      parent.insertBefore(parentRow, foundElements[0]);
      insertionPoint = parentRow;
      foundElements.forEach(function moveItem(element) {
        if (element.parentNode !== parent) {
          return;
        }
        rememberMenuGroupOriginalPosition(element);
        if (insertionPoint.nextSibling !== element) {
          parent.insertBefore(element, insertionPoint.nextSibling);
        }
        markMenuGroupChild(element, groupId);
        insertionPoint = element;
      });
      setMenuGroupExpanded(parentRow, getMenuGroupExpandedState(group, groupId));
      appliedCount += 1;
    });

    return appliedCount;
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

  function resetPage(options) {
    var sidebar = findGhlSidebar();

    options = options || {};
    if (!options.preserveMenuGroupState) {
      menuGroupExpandedState = {};
      removePreloadGuard();
    }
    restoreMenuGroupChildState(sidebar);
    restoreMenuGroupOriginalOrder(sidebar);
    resetSidebarStyle();
    removeMenuGroupRows();
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
    var locationRule = namespace.ENABLE_LOCATION_VIEW_DEFAULTS === true && locationId && state.locationRules ? state.locationRules[locationId] : null;
    var locationPreset = locationRule && locationRule.presetId ? storage.getPresetById(state, locationRule.presetId) : null;
    var activePreset = storage.getPresetById(state, state.activePresetId);
    var preset = locationPreset || activePreset || storage.getPresetById(state, "builtin:simple");

    if (preset) {
      console.log("[AgencySkin CleanView] Active Profile applied:", {
        id: preset.id,
        name: preset.name || preset.label
      });
    }

    return preset;
  }

  function applyPresetObject(preset) {
    var visibleSet = new Set(Array.isArray(preset.visibleItems) ? preset.visibleItems : allMenuKeys);
    var labelOverrides = preset.labelOverrides || {};
    var changedCount = 0;

    console.log("[AgencySkin CleanView] Applying preset:", preset && (preset.name || preset.label), preset);

    resetPage({ preserveMenuGroupState: true });

    allMenuKeys.forEach(function applyKey(key) {
      changedCount += setMenuVisible(key, visibleSet.has(key), labelOverrides[key]);
    });

    changedCount += applyMenuGroups(preset.menuGroups || [], visibleSet);
    changedCount += applyMenuOrder(preset.visibleItems || [], visibleSet, preset.menuGroups || []);
    changedCount += injectCustomLinks(preset.customLinks || []);
    changedCount += applySidebarStyle(preset.sidebarStyle || {});
    changedCount += applyTopHeaderTheme(preset.sidebarStyle || {});
    changedCount += applyHeaderControlsStyle(preset.sidebarStyle || {});
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
    activePreviewPreset = null;

    return withObserverPaused(function applyWithObserverPaused() {
      if (!state.enabled) {
        removePreloadGuard();
        return resetPage();
      }

      var result = applyPresetObject(resolvePreset(state));
      removePreloadGuardAfterMinimum();
      startObserverWhenReady();
      return result;
    });
  }

  function applyStateWhenSidebarReady(state, callback) {
    currentState = state;
    if (!state.enabled) {
      callback(applyCurrentState(state));
      return;
    }

    waitForGhlSidebar(function handleSidebarReady(sidebar) {
      var result = null;
      var status = null;

      if (!sidebar) {
        callback(Object.assign(sidebarStatus(null, {
          error: "Sidebar not found yet. Try reloading the GHL page."
        }), {
          ok: false,
          message: "Sidebar not found yet. Try reloading the GHL page."
        }));
        return;
      }

      result = applyCurrentState(state);
      status = sidebarStatus(findGhlSidebar() || sidebar, { applied: true });
      callback(Object.assign({}, result, status, {
        ok: true,
        message: result.skipped ? "CleanView is off; turn it on to apply." : "Applied to open GHL tab.",
        applied: !result.skipped
      }));
    }, sidebarWaitTimeoutMs);
  }

  function applyInitialStateWhenSidebarReady(state) {
    var elapsed = firstApplyStartedAt ? Date.now() - firstApplyStartedAt : 0;

    currentState = state;
    window.clearTimeout(firstApplyTimer);

    if (!state.enabled) {
      removePreloadGuard();
      applyCurrentState(state);
      return;
    }

    preloadGuardEnabled = true;
    installPreloadGuard();
    if (findGhlSidebar() || elapsed > sidebarWaitTimeoutMs) {
      applyCurrentState(state);
      return;
    }

    firstApplyTimer = window.setTimeout(function retryInitialApply() {
      applyInitialStateWhenSidebarReady(state);
    }, elapsed < 600 ? 40 : 90);
  }

  function loadAndApply() {
    storage.touchInstallMetadata(function handleState(state, error) {
      if (error) {
        console.warn("[AgencySkin CleanView] Unable to load stored settings.", error);
        removePreloadGuard();
        return;
      }
      firstApplyStartedAt = Date.now();
      applyInitialStateWhenSidebarReady(state);
    });
  }

  function scheduleReapply() {
    window.clearTimeout(reapplyTimer);
    reapplyTimer = window.setTimeout(function reapplyCurrentState() {
      if (activePreviewPreset) {
        withObserverPaused(function reapplyPreviewPreset() {
          applyPresetObject(activePreviewPreset);
        });
        return;
      }
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

  function startObserverWhenReady() {
    if (observer) {
      return;
    }

    if (document.body) {
      startObserver();
      return;
    }

    window.setTimeout(startObserverWhenReady, 50);
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

    if (message.type === "measureSidebarPreview") {
      var measuredLayout = measureSidebarPreviewLayout();

      respond(sendResponse, measuredLayout ? {
        ok: true,
        measuredLayout: measuredLayout
      } : {
        ok: false,
        error: "Could not measure the GoHighLevel sidebar on this page."
      });
      return false;
    }

    if (message.type === "CLEANVIEW_DETECT_GHL_SIDEBAR") {
      waitForGhlSidebar(function handleDetected(sidebar) {
        respond(sendResponse, sidebarStatus(sidebar, sidebar ? {} : {
          error: "No GHL sidebar found on this page."
        }));
      }, 5000);
      return true;
    }

    if (message.type === "CLEANVIEW_GET_PAGE_STATUS") {
      respond(sendResponse, sidebarStatus(findGhlSidebar()));
      return false;
    }

    if (message.type === "CLEANVIEW_APPLY_ACTIVE_SETTINGS") {
      storage.getState(function handleActiveSettings(state, error) {
        if (error) {
          respond(sendResponse, { ok: false, error: "Unable to load CleanView settings." });
          return;
        }

        applyStateWhenSidebarReady(state, function handleApplied(result) {
          respond(sendResponse, result);
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

        applyStateWhenSidebarReady(state, function handleApplied(result) {
          respond(sendResponse, result);
        });
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
        activePreviewPreset = message.preset || storage.getPresetById(currentState, "builtin:simple");
        return applyPresetObject(activePreviewPreset);
      }));
      return false;
    }

    respond(sendResponse, { ok: false, error: "Unknown CleanView message." });
    return false;
  });

  primePreloadGuardFromRawState();
  loadAndApply();
  startObserverWhenReady();
})();
