(function registerCleanViewSidebarBackgrounds() {
  var namespace = window.agencySkinCleanView || {};

  var patternAssets = [
    {
      id: "dark-grid-01",
      label: "Dark Grid",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.34,
      safeForCuratedShuffle: true,
      backgroundColor: "#0f172a",
      textColor: "#e5e7eb",
      activeBackgroundColor: "#2563eb",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1e293b",
      patternCss:
        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      defaultScale: 1
    },
    {
      id: "navy-diagonal-lines-01",
      label: "Navy Diagonal Lines",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.28,
      safeForCuratedShuffle: true,
      backgroundColor: "#0b1220",
      textColor: "#dbeafe",
      activeBackgroundColor: "#1d4ed8",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#172554",
      patternCss:
        "repeating-linear-gradient(135deg, rgba(147,197,253,0.12) 0, rgba(147,197,253,0.12) 1px, transparent 1px, transparent 14px)",
      defaultScale: 1
    },
    {
      id: "soft-blue-waves-01",
      label: "Soft Blue Waves",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.18,
      safeForCuratedShuffle: true,
      backgroundColor: "#eff6ff",
      textColor: "#172554",
      activeBackgroundColor: "#bfdbfe",
      activeTextColor: "#172554",
      hoverBackgroundColor: "#dbeafe",
      patternCss:
        "radial-gradient(ellipse at 30% 20%, rgba(37,99,235,0.16), transparent 36%), radial-gradient(ellipse at 70% 70%, rgba(14,165,233,0.14), transparent 34%)",
      defaultScale: 1
    },
    {
      id: "subtle-dots-01",
      label: "Subtle Dots",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.2,
      safeForCuratedShuffle: true,
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
      activeBackgroundColor: "#e2e8f0",
      activeTextColor: "#0f172a",
      hoverBackgroundColor: "#f1f5f9",
      patternCss: "radial-gradient(circle, rgba(15,23,42,0.16) 1px, transparent 1.5px)",
      defaultScale: 1
    },
    {
      id: "glass-texture-01",
      label: "Glass Texture",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.32,
      safeForCuratedShuffle: true,
      backgroundColor: "#111827",
      textColor: "#f9fafb",
      activeBackgroundColor: "#334155",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1f2937",
      patternCss:
        "linear-gradient(145deg, rgba(255,255,255,0.14), transparent 30%), linear-gradient(315deg, rgba(96,165,250,0.12), transparent 36%)",
      defaultScale: 1
    },
    {
      id: "carbon-fiber-01",
      label: "Carbon Fiber",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.36,
      safeForCuratedShuffle: true,
      backgroundColor: "#18181b",
      textColor: "#f4f4f5",
      activeBackgroundColor: "#3f3f46",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#27272a",
      patternCss:
        "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)",
      defaultScale: 1
    },
    {
      id: "light-geometric-01",
      label: "Light Geometric",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.22,
      safeForCuratedShuffle: true,
      backgroundColor: "#ffffff",
      textColor: "#111827",
      activeBackgroundColor: "#dbeafe",
      activeTextColor: "#1e3a8a",
      hoverBackgroundColor: "#f3f4f6",
      patternCss:
        "linear-gradient(30deg, rgba(37,99,235,0.08) 12%, transparent 12.5%, transparent 87%, rgba(37,99,235,0.08) 87.5%), linear-gradient(150deg, rgba(20,184,166,0.08) 12%, transparent 12.5%, transparent 87%, rgba(20,184,166,0.08) 87.5%)",
      defaultScale: 1
    },
    {
      id: "minimal-noise-01",
      label: "Minimal Noise Texture",
      type: "pattern",
      category: "professional",
      recommendedOverlayOpacity: 0.28,
      safeForCuratedShuffle: true,
      backgroundColor: "#0f172a",
      textColor: "#e2e8f0",
      activeBackgroundColor: "#475569",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "#1e293b",
      patternCss:
        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06) 0 1px, transparent 1px)",
      defaultScale: 1
    }
  ];

  var imageAssets = [
    {
      id: "american-flag-01",
      label: "American Flag",
      type: "image",
      category: "personal",
      subcategory: "patriotic",
      filename: "assets/backgrounds/american-flag.webp",
      focalPointX: 50,
      focalPointY: 38,
      recommendedOverlayOpacity: 0.52,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.08,
      textColor: "#ffffff",
      activeBackgroundColor: "#1d4ed8",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "orange-cat-01",
      label: "Orange Cat",
      type: "image",
      category: "personal",
      subcategory: "animals",
      filename: "assets/backgrounds/orange-cat.webp",
      focalPointX: 50,
      focalPointY: 40,
      recommendedOverlayOpacity: 0.55,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.12,
      textColor: "#ffffff",
      activeBackgroundColor: "#f97316",
      activeTextColor: "#1c1917",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "blue-sky-01",
      label: "Blue Sky",
      type: "image",
      category: "personal",
      filename: "assets/backgrounds/blue-sky.webp",
      focalPointX: 50,
      focalPointY: 35,
      recommendedOverlayOpacity: 0.28,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1,
      textColor: "#0f172a",
      activeBackgroundColor: "#bfdbfe",
      activeTextColor: "#172554",
      hoverBackgroundColor: "rgba(255,255,255,0.36)"
    },
    {
      id: "sunset-01",
      label: "Sunset",
      type: "image",
      category: "personal",
      filename: "assets/backgrounds/sunset.webp",
      focalPointX: 50,
      focalPointY: 55,
      recommendedOverlayOpacity: 0.48,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.05,
      textColor: "#fff7ed",
      activeBackgroundColor: "#f97316",
      activeTextColor: "#111827",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "ocean-01",
      label: "Ocean",
      type: "image",
      category: "personal",
      filename: "assets/backgrounds/ocean.webp",
      focalPointX: 52,
      focalPointY: 45,
      recommendedOverlayOpacity: 0.42,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.05,
      textColor: "#ecfeff",
      activeBackgroundColor: "#06b6d4",
      activeTextColor: "#083344",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "mountains-01",
      label: "Mountains",
      type: "image",
      category: "professional",
      filename: "assets/backgrounds/mountains.webp",
      focalPointX: 50,
      focalPointY: 62,
      recommendedOverlayOpacity: 0.5,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.08,
      textColor: "#f8fafc",
      activeBackgroundColor: "#64748b",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "forest-01",
      label: "Forest",
      type: "image",
      category: "personal",
      filename: "assets/backgrounds/forest.webp",
      focalPointX: 50,
      focalPointY: 55,
      recommendedOverlayOpacity: 0.48,
      recommendedBlur: 0,
      safeForCuratedShuffle: true,
      defaultScale: 1.05,
      textColor: "#ecfdf5",
      activeBackgroundColor: "#10b981",
      activeTextColor: "#052e16",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    },
    {
      id: "city-lights-01",
      label: "City Lights",
      type: "image",
      category: "professional",
      filename: "assets/backgrounds/city-lights.webp",
      focalPointX: 50,
      focalPointY: 48,
      recommendedOverlayOpacity: 0.58,
      recommendedBlur: 1,
      safeForCuratedShuffle: true,
      defaultScale: 1.05,
      textColor: "#eef2ff",
      activeBackgroundColor: "#6366f1",
      activeTextColor: "#ffffff",
      hoverBackgroundColor: "rgba(255,255,255,0.12)"
    }
  ];

  var curatedStylePresets = [
    {
      id: "clean-navy-01",
      label: "Clean Navy",
      category: "professional",
      type: "solid",
      safeForCuratedShuffle: true,
      style: {
        backgroundType: "solid",
        backgroundColor: "#0f172a",
        textColor: "#e5e7eb",
        activeBackgroundColor: "#1d4ed8",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#1e293b"
      }
    },
    {
      id: "midnight-glass-01",
      label: "Midnight Glass",
      category: "professional",
      type: "gradient",
      safeForCuratedShuffle: true,
      style: {
        backgroundType: "gradient",
        backgroundColor: "#111827",
        gradientStartColor: "#020617",
        gradientEndColor: "#334155",
        gradientDirection: "145deg",
        backgroundOverlayOpacity: 0.25,
        textColor: "#f8fafc",
        activeBackgroundColor: "#475569",
        activeTextColor: "#ffffff",
        hoverBackgroundColor: "#1f2937"
      }
    },
    {
      id: "blue-wave-01",
      label: "Blue Wave",
      category: "professional",
      type: "pattern",
      assetId: "soft-blue-waves-01",
      safeForCuratedShuffle: true
    },
    {
      id: "dark-grid-style-01",
      label: "Dark Grid",
      category: "professional",
      type: "pattern",
      assetId: "dark-grid-01",
      safeForCuratedShuffle: true
    },
    {
      id: "city-lights-style-01",
      label: "City Lights",
      category: "professional",
      type: "image",
      assetId: "city-lights-01",
      safeForCuratedShuffle: true
    },
    {
      id: "subtle-mountain-01",
      label: "Subtle Mountain",
      category: "professional",
      type: "image",
      assetId: "mountains-01",
      safeForCuratedShuffle: true
    },
    {
      id: "american-flag-style-01",
      label: "American Flag",
      category: "personal",
      type: "image",
      assetId: "american-flag-01",
      safeForCuratedShuffle: true
    },
    {
      id: "orange-cat-style-01",
      label: "Orange Cat",
      category: "personal",
      type: "image",
      assetId: "orange-cat-01",
      safeForCuratedShuffle: true
    },
    {
      id: "blue-sky-style-01",
      label: "Blue Sky",
      category: "personal",
      type: "image",
      assetId: "blue-sky-01",
      safeForCuratedShuffle: true
    },
    {
      id: "sunset-style-01",
      label: "Sunset",
      category: "personal",
      type: "image",
      assetId: "sunset-01",
      safeForCuratedShuffle: true
    },
    {
      id: "ocean-style-01",
      label: "Ocean",
      category: "personal",
      type: "image",
      assetId: "ocean-01",
      safeForCuratedShuffle: true
    },
    {
      id: "forest-style-01",
      label: "Forest",
      category: "personal",
      type: "image",
      assetId: "forest-01",
      safeForCuratedShuffle: true
    }
  ];

  function allAssets() {
    return patternAssets.concat(imageAssets);
  }

  function getAssetById(id) {
    return allAssets().find(function findAsset(asset) {
      return asset.id === id;
    }) || null;
  }

  function getCuratedStylePresetById(id) {
    return curatedStylePresets.find(function findPreset(preset) {
      return preset.id === id;
    }) || null;
  }

  namespace.sidebarBackgroundAssets = allAssets();
  namespace.sidebarPatternAssets = patternAssets;
  namespace.sidebarImageAssets = imageAssets;
  namespace.curatedSidebarStylePresets = curatedStylePresets;
  namespace.getSidebarBackgroundAssetById = getAssetById;
  namespace.getCuratedSidebarStylePresetById = getCuratedStylePresetById;
  window.agencySkinCleanView = namespace;
})();
