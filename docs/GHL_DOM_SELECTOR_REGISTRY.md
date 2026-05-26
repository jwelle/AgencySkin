# GoHighLevel DOM Selector Registry

## Audit Summary

- Source files:
  - `docs/audits/agencyskin_ghl_dom_audit_full.csv`
  - `docs/audits/agencyskin_ghl_dom_audit_summary.csv`
- Audit version: `0.1.0`
- Audit timestamp: `2026-05-26T19:26:41.976Z`
- Tested URL: `https://app.gohighlevel.com/v2/location/32I2I26T8CHTnRx8K9Zb/conversations/conversations`
- Summary counts:
  - Known selector results: 18
  - Target label results: 29
  - Sidebar element results: 231
  - Total full CSV rows: 278

The active MVP registry should prefer safe global sidebar selectors found in the live DOM audit. Location-specific UUID links and page-specific controls should remain documentation-only until they are intentionally productized.

## Core Sidebar Selectors

These selectors were found as stable sidebar anchors and are safe for the CSS-first MVP menu toggles.

| Menu | Primary selector | Fallback selectors |
| --- | --- | --- |
| Launchpad | `#sb_launchpad` | `[meta="launchpad"]` |
| Dashboard | `#sb_dashboard` | `[meta="dashboard"]`, `a[href*="/dashboard"]` |
| Conversations | `#sb_conversations` | `[meta="conversations"]`, `a[href*="/conversations"]` |
| Calendars | `#sb_calendars` | `[meta="calendars"]`, `a[href*="/calendars"]` |
| Contacts | `#sb_contacts` | `[meta="contacts"]`, `a[href*="/contacts"]` |
| Opportunities | `#sb_opportunities` | `[meta="opportunities"]`, `a[href*="/opportunities"]` |
| Payments | `#sb_payments` | `[meta="payments"]`, `a[href*="/payments"]` |
| Marketing | `#sb_email-marketing` | `[meta="email-marketing"]`, `a[href*="/marketing"]` |
| Automation | `#sb_automation` | `[meta="automation"]`, `a[href*="/automation"]` |
| Sites | `#sb_sites` | `[meta="sites"]`, `a[href*="/sites"]` |
| Memberships | `#sb_memberships` | `[meta="memberships"]`, `a[href*="/memberships"]` |
| Media Storage | `#sb_app-media` | `[meta="app-media"]`, `a[href*="/media-storage"]` |
| Reputation | `#sb_reputation` | `[meta="reputation"]`, `a[href*="/reputation"]` |
| Reporting | `#sb_reporting` | `[meta="reporting"]`, `a[href*="/reporting"]` |
| App Marketplace | `#sb_app-marketplace` | `[meta="app-marketplace"]`, `a[href*="/integration"]` |
| Mobile App | `#sb_location-mobile-app` | `[meta="location-mobile-app"]`, `a[href*="/mobile_app"]` |
| Settings | `#sb_settings` | `[meta="settings"]`, `a[href*="/settings"]` |

## AI / New Sidebar Selectors

These selectors were found in `sidebarElementResults` and are included in the active MVP menu toggles.

| Menu | Primary selector | Fallback selectors | Notes |
| --- | --- | --- | --- |
| Ask AI | `#sb_ask-ai` | `[meta="ask-ai"]`, `a[href*="/ask-ai"]` | Found as a sidebar item. |
| AI Studio | `#sb_vibe` | `[meta="vibe"]`, `a[href*="/vibe"]` | Text appeared as `AI StudioBeta` in the audit. |
| AI Agents | `[meta="AI Agents"]` | `#sb_AI\ Agents`, `a[href*="/ai-agents"]` | The id contains a space, so the meta selector is preferred. |

## Sidebar Shell Selectors

- Found: `#sidebar-v2`
- Not found on tested page: `.hl_sidebar`

Use `#sidebar-v2` as the active sidebar shell selector. Keep `.hl_sidebar` only as a fallback/reference for older or alternate GoHighLevel shells.

## Header / Utility Selectors

These selectors appeared in the audit but are not active MVP controls.

| Selector | Observed text / purpose |
| --- | --- |
| `#quickActions` | Quick Actions container |
| `#hl_header--copilot-icon` | Ask AI Assistant header icon |
| `#canny_logs-toggle` | View Changelog |
| `#recent_activities-toggle` | Notifications |
| `#hl_header--help-icon` | Help and Support |

## Page-Specific Top Tab Selectors

These selectors are page-specific to the audited Conversations surface and should not be added to the default sidebar menu UI.

| Selector | Observed text |
| --- | --- |
| `#tb_conversations-tab` | Conversations |
| `#tb_manial-actions` | Manual Actions |
| `#tb_conversations-templates` | Templates |
| `#tb_trigger-links` | Trigger Links |
| `#tb_conversations-analytics` | Analytics |
| `#tb_settings` | Settings |

## Custom Location Links

The audit found location-specific URLs and custom/internal elements, including UUID-like menu links. These are useful for future diagnostics but should not be active MVP controls because they may vary by account, location, app install, or page.

Examples include custom links, conversation card ids, modal containers, and location-scoped full href selectors from the audited account.

## Selectors Not Found

The audit explicitly checked and did not find these legacy selectors on the tested page:

- `.hl_sidebar`
- `.hl_topHeader`
- `.login__logo img`

These may still be relevant to older shells or login pages, but they should not be treated as the active dashboard source of truth for this MVP.

## Recommended MVP Registry Updates

- Use the active sidebar selectors listed above for Generate CSS output.
- Keep selector order deterministic: primary selectors first, fallback selectors second.
- Include Launchpad, Ask AI, AI Studio, AI Agents, and Mobile App as menu toggles.
- Use `[meta="AI Agents"]` before `#sb_AI\ Agents` because the id contains a space.
- Keep header utility controls, page-specific top tabs, custom UUID/location links, and raw selectors documentation-only.
- Version this registry over time as GoHighLevel changes the DOM.
