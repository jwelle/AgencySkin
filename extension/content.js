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

  function resetSidebarStyle() {
    removeSidebarBackgroundLayers();
    removeCustomSidebarBranding();
    restoreNativeSidebarBranding();
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
      return style.autoReadability === false ? clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback)) : Math.max(fallback, clampOpacity(getByPath(style, "imageSettings.overlayOpacity", fallback)));
    }

    if (style.backgroundType === "pattern") {
      return clampOpacity(getByPath(style, "patternSettings.overlayOpacity", fallback));
    }

    return clampOpacity(style.backgroundOverlayOpacity);
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

  function getSidebarBackgroundValue(style) {
    if (style.backgroundType === "image" && styleValue(style.backgroundImageUrl)) {
      return "url(\"" + styleValue(style.backgroundImageUrl) + "\")";
    }

    if (style.backgroundType === "image") {
      var imageUrl = getImageUrl(style);
      return imageUrl ? "url(\"" + imageUrl + "\")" : styleValue(style.backgroundColor);
    }

    if (style.backgroundType === "pattern") {
      var asset = getAssetById(style.backgroundAssetId);
      return asset && asset.patternCss ? asset.patternCss : styleValue(style.backgroundColor);
    }

    if (style.backgroundType === "gradient") {
      var start = styleValue(style.gradientStartColor) || styleValue(style.backgroundColor) || "#0f172a";
      var end = styleValue(style.gradientEndColor) || styleValue(style.backgroundColor) || "#1d4ed8";
      var direction = styleValue(style.gradientDirection) || "135deg";
      return "linear-gradient(" + direction + ", " + start + ", " + end + ")";
    }

    return styleValue(style.backgroundColor);
  }

  function applySidebarBackground(sidebar, style) {
    var backgroundValue = getSidebarBackgroundValue(style);
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
      sidebar.style.background = styleValue(style.backgroundColor) || "#0f172a";
      layer = document.createElement("div");
      overlay = document.createElement("div");
      layer.setAttribute("data-agencyskin-sidebar-bg-layer", "true");
      overlay.setAttribute("data-agencyskin-sidebar-bg-layer", "true");
      layer.setAttribute("data-agencyskin-sidebar-bg-kind", style.backgroundType);
      overlay.setAttribute("data-agencyskin-sidebar-bg-kind", "overlay");
      layer.style.position = "absolute";
      layer.style.inset = "0";
      layer.style.pointerEvents = "none";
      layer.style.zIndex = "0";
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "0";
      overlay.style.background = getOverlayRgba(style.backgroundOverlayColor || "#000000", overlayOpacity);

      if (style.backgroundType === "image") {
        layer.style.backgroundImage = backgroundValue;
        layer.style.backgroundSize = style.customImageDataUrl || style.backgroundAssetId ? getImageScale(style) : styleValue(style.backgroundImageFit) || "cover";
        layer.style.backgroundPosition = style.customImageDataUrl || style.backgroundAssetId ? getImagePosition(style) : styleValue(style.backgroundImagePosition) || "center";
        layer.style.backgroundRepeat = "no-repeat";
        layer.style.opacity = imageOpacity;
        layer.style.filter = imageBlur ? "blur(" + imageBlur + "px)" : "";
      } else {
        layer.style.backgroundImage = backgroundValue;
        layer.style.backgroundSize = getPatternSize(style);
        layer.style.backgroundRepeat = "repeat";
        layer.style.opacity = patternOpacity;
      }

      sidebar.insertBefore(overlay, sidebar.firstChild);
      sidebar.insertBefore(layer, sidebar.firstChild);
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
    var css = [
      "[data-agencyskin-cleanview-style-role='menu-item']:hover {",
      styleValue(style.hoverBackgroundColor) ? "background: " + style.hoverBackgroundColor + " !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='menu-item'] *,",
      "[data-agencyskin-cleanview-style-role='header'] * {",
      styleValue(style.textColor) ? "color: inherit !important;" : "",
      "}",
      "[data-agencyskin-cleanview-style-role='sidebar'] {",
      "isolation: isolate !important;",
      "overflow: hidden !important;",
      "position: relative !important;",
      "}",
      "[data-agencyskin-cleanview-style-role='sidebar'] > *:not([data-agencyskin-sidebar-bg-layer='true']) {",
      "position: relative;",
      "z-index: 1;",
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
    return styleValue(style.logoUrl) || styleValue(brandSettings.logoUrl) || styleValue(namespace.defaultBrandLogoUrl);
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

    if (shuffle.poolMode === "professional" || shuffle.poolMode === "favorites") {
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
    var locationRule = namespace.ENABLE_LOCATION_VIEW_DEFAULTS === true && locationId && state.locationRules ? state.locationRules[locationId] : null;
    var locationPreset = locationRule && locationRule.presetId ? storage.getPresetById(state, locationRule.presetId) : null;
    var activePreset = storage.getPresetById(state, state.activePresetId);
    var preset = locationPreset || activePreset || storage.getPresetById(state, "builtin:simple");

    if (preset) {
      console.log("[AgencySkin CleanView] Active view applied:", {
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
