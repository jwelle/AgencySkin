# CleanView Profile JSON Schema

This document is the public import/export contract for CleanView Profiles. Generate only fields listed here. The Chrome extension importer is the source of truth and rejects unsafe or unsupported executable content.

## Required Root Shape

```json
{
  "cleanViewProfile": true,
  "schemaVersion": "1.0.0",
  "type": "profile",
  "profile": {}
}
```

`profile.name` is required. Metadata, sidebar styling, menu choices, rename labels, and quick links are optional.

## Accepted Profile Fields

```json
{
  "name": "Profile Name",
  "description": "Short profile description",
  "source": {
    "kind": "ai",
    "createdBy": "CleanView Profile Designer",
    "origin": "website-assisted"
  },
  "businessContext": {},
  "designContext": {},
  "aiSummary": {},
  "sidebarStyle": {},
  "menuItems": {},
  "menuGroups": [],
  "renameLabels": {},
  "quickLinks": []
}
```

## Menu IDs

Use these IDs in `menuItems.visible` or `menuItems.hidden`:

```txt
launchpad
dashboard
conversations
calendars
contacts
opportunities
payments
ask_ai
ai_studio
ai_agents
marketing
automation
sites
memberships
communities
media
reputation
reporting
app_marketplace
mobile_app
settings
```

Labels are also accepted for renames, but IDs are preferred for menu visibility.

## Menu Items

Show only a focused set:

```json
{
  "menuItems": {
    "visible": ["dashboard", "conversations", "calendars", "contacts", "opportunities", "reporting"]
  }
}
```

Or hide specific items:

```json
{
  "menuItems": {
    "hidden": ["marketing", "automation", "memberships", "app_marketplace"]
  }
}
```

If both `visible` and `hidden` are present, `visible` wins.

## Menu Groups

`menuGroups` organize visible native GoHighLevel menu items into one-level click-to-expand accordion sections. In the Profile Builder, the Menu Builder shows hidden native items as Available Items and visible native items in Your Sidebar. Users can add, hide, and drag visible native menu chips into group cards. Quick Links stay separate and must not be placed inside groups.

```json
{
  "menuGroups": [
    {
      "label": "Client Work",
      "items": ["conversations", "calendars", "contacts", "opportunities"],
      "collapsed": false
    },
    {
      "label": "Insights",
      "items": ["dashboard", "reporting"],
      "collapsed": false
    }
  ]
}
```

Validation rules:

```txt
menuGroups: optional array, max 8 groups
menuGroups[].label: required plain text, max 40 characters
menuGroups[].items: required array, max 12 supported native menu IDs or labels
menuGroups[].collapsed: optional boolean, defaults to false, controls initial sidebar state only
Each native menu item may appear in only one group
Nested menuGroups are not allowed
URLs, hrefs, quickLinks, customLinks, and links are not allowed inside groups
```

Role examples:

```json
{
  "menuGroups": [
    {
      "label": "Borrower Work",
      "items": ["conversations", "calendars", "contacts", "opportunities"]
    },
    {
      "label": "Performance",
      "items": ["dashboard", "reporting"]
    }
  ]
}
```

```json
{
  "menuGroups": [
    {
      "label": "Operations",
      "items": ["dashboard", "reporting", "settings"]
    },
    {
      "label": "Growth Tools",
      "items": ["marketing", "automation", "sites"]
    }
  ]
}
```

Runtime behavior is defensive because GoHighLevel can change its live sidebar DOM. Unknown/new GHL sidebar items are untouched, missing grouped items are skipped, empty groups do not render accordion parents, and incompatible DOM parents are not forced. CleanView moves existing native nodes under a click-to-expand group parent only when that can be done within a compatible parent container, so native click behavior is preserved and grouped child items are not duplicated elsewhere. If a group cannot be safely applied, CleanView preserves sidebar stability over perfect visual grouping.

Accordion state is runtime-first in the MVP. The `collapsed` field controls the initial open/closed state, then user clicks persist during the current page session and normal CleanView reapply cycles. Native Menu Groups inherit existing global/sidebar menu colors for parent text, chevron, hover, and open states; there are no group-specific styling controls in the MVP. Quick Links remain separate shortcuts and are not styled or grouped as native menu children.

## Rename Labels

```json
{
  "renameLabels": {
    "Conversations": "Client Messages",
    "Calendars": "Appointments",
    "Contacts": "Clients",
    "Opportunities": "Client Pipeline"
  }
}
```

Rename values must be plain text, 60 characters or fewer.

## Quick Links

Quick links must stay inside GoHighLevel and use relative paths beginning with `/`.

```json
{
  "quickLinks": [
    {
      "label": "New Contact",
      "url": "/v2/location/LOCATION_ID/contacts",
      "icon": "contacts",
      "openIn": "same_tab"
    }
  ]
}
```

Allowed icons: `link`, `calendar`, `pipeline`, `contacts`, `dashboard`, `reporting`, `settings`, `payments`, `marketing`, `automation`, `sites`.

Do not generate external quick link URLs.

## Sidebar Style

Preset style:

```json
{
  "sidebarStyle": {
    "mode": "preset",
    "presetId": "default"
  }
}
```

Custom solid style:

```json
{
  "sidebarStyle": {
    "mode": "custom",
    "custom": {
      "type": "solid",
      "solid": {
        "backgroundColor": "#0f172a",
        "darken": 0.1,
        "fade": 0
      }
    }
  }
}
```

Custom visual with an external image:

```json
{
  "sidebarStyle": {
    "mode": "custom",
    "custom": {
      "type": "visual",
      "visual": {
        "assetSource": "external",
        "assetUrl": "https://example.com/sidebar-background.webp",
        "positionX": 50,
        "positionY": 50,
        "zoom": 1,
        "fade": 0.15,
        "darken": 0.55,
        "blur": 0
      }
    }
  }
}
```

External logo:

```json
{
  "sidebarStyle": {
    "global": {
      "applyStyling": true,
      "logo": {
        "enabled": true,
        "source": "external",
        "url": "https://example.com/logo.png",
        "size": "medium",
        "showBrandName": true,
        "brandName": "Example"
      }
    }
  }
}
```

## External Image URL Rules

External sidebar visuals and logos must:

- Be strings.
- Start with `https://`.
- Parse with the standard URL parser.
- Use protocol `https:`.
- Include a hostname.
- Have a path ending in `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, or `.svg`.
- Avoid `<`, `>`, control characters, `javascript:`, `data:`, `blob:`, `file:`, and `chrome-extension:`.
- Be 1000 characters or fewer.

Allowed:

```txt
https://example.com/sidebar.webp
https://cdn.example.com/images/luxury-sidebar.jpg
https://assets.example.com/logo.svg?version=1
```

Rejected:

```txt
http://example.com/sidebar.webp
javascript:alert(1)
data:text/html;base64,abc
blob:https://example.com/abc
file:///Users/me/image.png
chrome-extension://abc/image.png
https://example.com/sidebar.exe
/images/sidebar.webp
```

## Metadata Fields

All metadata is optional and must be safe plain text. Do not include HTML, scripts, selectors, executable snippets, webhooks, or tracking fields.

```json
{
  "businessContext": {
    "companyName": "Sotheby's International Realty",
    "website": "https://www.sothebysrealty.com",
    "industry": "Luxury Real Estate",
    "role": "Real Estate Agent",
    "audience": "buyers, sellers, luxury homeowners"
  },
  "designContext": {
    "styleIntent": "luxury, minimal, calm, premium",
    "primaryColor": "#0f172a",
    "accentColor": "#b8a06a",
    "reasoningSummary": "Inspired by luxury real estate branding and a simple agent workflow."
  },
  "aiSummary": {
    "plainEnglishSummary": "This profile keeps daily client tools visible and hides extra software clutter.",
    "hiddenBecause": "Advanced tools were hidden to keep the workspace simple.",
    "bestFor": "Agents focused on conversations, appointments, clients, and active deals."
  }
}
```

Limits:

```txt
businessContext.companyName: 120 characters
businessContext.website: safe HTTPS URL, 500 characters
businessContext.industry: 80 characters
businessContext.role: 80 characters
businessContext.audience: 160 characters
designContext.styleIntent: 160 characters
designContext.primaryColor: hex color only
designContext.accentColor: hex color only
designContext.reasoningSummary: 300 characters
aiSummary.plainEnglishSummary: 300 characters
aiSummary.hiddenBecause: 300 characters
aiSummary.bestFor: 240 characters
```

## Full AI-Generated Example

```json
{
  "cleanViewProfile": true,
  "schemaVersion": "1.0.0",
  "type": "profile",
  "profile": {
    "name": "Luxury Real Estate Agent",
    "description": "A clean, premium workspace for client conversations, appointments, contacts, opportunities, dashboard review, and reporting.",
    "source": {
      "kind": "ai",
      "createdBy": "CleanView Profile Designer",
      "origin": "website-assisted"
    },
    "businessContext": {
      "companyName": "Sotheby's International Realty",
      "website": "https://www.sothebysrealty.com",
      "industry": "Luxury Real Estate",
      "role": "Real Estate Agent",
      "audience": "buyers, sellers, luxury homeowners"
    },
    "designContext": {
      "styleIntent": "luxury, minimal, calm, premium",
      "primaryColor": "#0f172a",
      "accentColor": "#b8a06a",
      "reasoningSummary": "Inspired by luxury real estate branding and a simple agent workflow."
    },
    "aiSummary": {
      "plainEnglishSummary": "This profile keeps the daily tools a luxury real estate agent is most likely to use and hides extra software clutter.",
      "hiddenBecause": "Advanced marketing, automation, app marketplace, memberships, AI tools, and payment menus were hidden to keep the workspace simple.",
      "bestFor": "Agents focused on buyer and seller conversations, appointments, client records, and active deals."
    },
    "sidebarStyle": {
      "mode": "custom",
      "custom": {
        "type": "solid",
        "solid": {
          "backgroundColor": "#0f172a",
          "darken": 0.1,
          "fade": 0
        }
      },
      "global": {
        "applyStyling": true,
        "autoReadability": true,
        "logo": {
          "enabled": true,
          "source": "external",
          "url": "https://example.com/logo.png",
          "size": "medium",
          "showBrandName": true,
          "brandName": "Sotheby's"
        },
        "shape": {
          "sidebarRadius": 16,
          "menuItemRadius": 8,
          "spacingDensity": "comfortable",
          "shadowStrength": "soft",
          "showBorder": true
        },
        "menuColors": {
          "textColor": "#ffffff",
          "iconColor": "#ffffff",
          "activeBackgroundColor": "#1d4ed8",
          "activeTextColor": "#ffffff",
          "hoverBackgroundColor": "rgba(255,255,255,0.12)",
          "dividerColor": "rgba(255,255,255,0.18)",
          "badgeColor": "#b8a06a"
        }
      }
    },
    "menuItems": {
      "visible": ["dashboard", "conversations", "calendars", "contacts", "opportunities", "reporting"]
    },
    "menuGroups": [
      {
        "label": "Client Work",
        "items": ["conversations", "calendars", "contacts", "opportunities"],
        "collapsed": false
      },
      {
        "label": "Insights",
        "items": ["dashboard", "reporting"],
        "collapsed": false
      }
    ],
    "renameLabels": {
      "Conversations": "Client Messages",
      "Calendars": "Appointments",
      "Contacts": "Clients",
      "Opportunities": "Client Pipeline"
    },
    "quickLinks": []
  }
}
```

## Security Rules

Never generate these fields or anything equivalent:

```txt
customJavaScript
customCSS
html
script
remoteScriptUrl
rawSelector
querySelector
xpath
eval
unsafeExternalUrl
webhookUrl
trackingPixel
```

Never generate arbitrary CSS, JavaScript, HTML, raw selectors, XPath, webhook URLs, tracking pixels, external quick links, or executable snippets.

For `menuGroups`, never generate URLs, quick links, custom links, nested groups, custom menu items, or unsupported menu IDs.

## Manual Validation Fixtures

Passing fixtures:

- Existing profile with root shape, `name`, `sidebarStyle`, `menuItems`, `renameLabels`, and `quickLinks`.
- Existing profile without `menuGroups`.
- Valid profile with `menuGroups`; editor shows the visual Menu Builder with Available Items, Your Sidebar, draggable native chips, and click-to-expand accordion parents in the applied sidebar.
- External sidebar visual using `https://example.com/sidebar.webp`.
- External logo using `https://example.com/logo.png`.
- AI metadata using the example metadata fields above.

Failing fixture values:

```txt
sidebarStyle.custom.visual.assetUrl = "http://example.com/sidebar.webp"
sidebarStyle.custom.visual.assetUrl = "javascript:alert(1)"
sidebarStyle.custom.visual.assetUrl = "data:text/html;base64,abc"
sidebarStyle.custom.visual.assetUrl = "blob:https://example.com/abc"
sidebarStyle.custom.visual.assetUrl = "file:///Users/me/sidebar.webp"
sidebarStyle.custom.visual.assetUrl = "chrome-extension://abc/sidebar.webp"
sidebarStyle.custom.visual.assetUrl = "/images/sidebar.webp"
sidebarStyle.custom.visual.assetUrl = "https://example.com/sidebar.exe"
sidebarStyle.global.logo.url = "http://example.com/logo.png"
sidebarStyle.global.logo.url = "javascript:alert(1)"
sidebarStyle.global.logo.url = "https://example.com/logo.exe"
businessContext.companyName contains "<script>"
designContext.reasoningSummary contains "javascript:"
aiSummary.bestFor is longer than 240 characters
quickLinks[0].url = "https://example.com"
menuGroups = "Client Work"
menuGroups[0].items = ["not_a_supported_menu"]
menuGroups[0].items = ["conversations"] and menuGroups[1].items = ["conversations"]
menuGroups[0].url = "/v2/location/LOCATION_ID/contacts"
menuGroups[0].quickLinks = []
menuGroups[0].menuGroups = []
```
