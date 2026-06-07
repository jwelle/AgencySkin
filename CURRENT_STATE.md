# Current State

## Added

- CleanView Sidebar Style is now the first Profile Builder tab.
- Curated sidebar style cards, bundled visual backgrounds, pattern-backed presets, and controlled Curated Rotation were added to the Chrome extension.
- Sidebar background settings now store structured image, pattern, readability, favorite, and rotation configuration.
- GoHighLevel sidebar backgrounds now apply through internal non-click-blocking background layers.
- Phase 1 Profile JSON import/export was added to the CleanView Profile Builder.
- CleanView daily configuration now runs in the Chrome side panel, with the popup reduced to a launcher and quick controls.
- Save now persists local settings separately from `Apply Live to GHL`, which only targets validated open GHL tabs.
- Built-in templates now open as editable drafts that save as new custom profiles, while custom profiles save in place and support `Save as Copy`.
- Fresh CleanView users now see a side-panel first-run starter flow with Sales, Marketing, AI Operator, Contact Center, and Simple starter views.
- Starter views save as normal custom Profiles, store starter metadata in `profileMetadata`, and apply through the existing live side-panel path.
- Existing custom Profile users skip first-run onboarding and can reopen the starter chooser with `Start from a View` / `Change View`.
- The side-panel editor now shows a sticky bottom save bar for unsaved changes, with Revert, Save Changes, and Save & Apply actions.
- Sidebar Style controls are now grouped into collapsible sections for Style Path, Presets, Background, Logo, Menu Text, Spacing, and Advanced.
- The popup now closes immediately after successfully opening the CleanView side panel.
- The popup now uses a single `Customize CleanView` launcher button and no longer duplicates side-panel apply/admin actions.
- Sidebar image presets and uploads now default to `cover`, and image uploads automatically enable image styling in preview.
- Advanced options now provide backup/restore/reset and sidebar diagnostics instead of the daily editor.
- Repository documentation now identifies the AgencySkin CleanView Chrome extension as the current shipping product.
- The earlier client/server/live site theme builder docs were moved into `docs/legacy-theme-builder.md`.
- `docs/extension-roadmap.md` now tracks MVP, post-MVP, hosted sync, and Chrome Web Store launch readiness.
- Install Code Generator added to the AgencySkin dashboard.
- Generated CSS uses current theme settings and hides only menu items disabled in the dashboard.
- Optional hosted loader script snippet is shown separately and remains experimental.
- Copy buttons added for generated CSS and the loader snippet.

## Files Changed

- `client/src/App.jsx`
- `client/src/styles.css`
- `extension/content.js`
- `extension/editor.css`
- `extension/editor.html`
- `extension/editor.js`
- `extension/advanced.html`
- `extension/advanced.js`
- `extension/manifest.json`
- `extension/popup.html`
- `extension/popup.js`
- `extension/README.md`
- `extension/sidebarBackgrounds.js`
- `extension/storage.js`
- `extension/assets/backgrounds/*.webp`
- `README.md`
- `CURRENT_STATE.md`
- `docs/legacy-theme-builder.md`
- `docs/extension-roadmap.md`

## How To Test

1. Run `npm install`.
2. Run `npm run dev`.
3. Open `http://localhost:5173`.
4. Select a location.
5. Change a theme color or hide a menu item.
6. Click `Save Settings`.
7. Click `Generate Install Code`.
8. Confirm the CSS output includes `/* AgencySkin Generated CSS */`.
9. Confirm hidden menu items generate `display: none !important` CSS rules.
10. Use both copy buttons and confirm feedback appears.
11. Load the unpacked Chrome extension from `extension/`.
12. Open a GHL page, click the extension popup, then click `Customize CleanView`.
13. Confirm the side panel opens while GHL remains the active page and Sidebar Style is the first tab.
14. Apply curated sidebar preset cards and confirm the local preview updates without needing a live GHL measurement.
15. Confirm the Sidebar Style tab uses a guided `Use Preset` / `Custom Configuration` editor.
16. Select a built-in template and confirm the primary action shows `Save as New Profile`.
17. Select a custom profile and confirm the sticky primary action shows `Save Changes` and `More` includes `Save as Copy`.
18. Confirm the popup closes immediately after `Customize CleanView` opens the side panel.
19. Click `Detect GHL Sidebar` and confirm `#sidebar-v2` is reported when present.
20. Export a Profile JSON file from `More`, then import it as a new editable Profile through `Create Profile`.
21. Clear or simulate an empty custom Profile state, open the side panel, choose each first-run starter view, and confirm the preview/success summaries show expected shown and hidden items.
22. Confirm `Use This View` creates or reuses a starter-created custom Profile, makes it active, and applies live when a supported GHL tab is available.
23. Confirm existing custom Profile states skip first-run onboarding and keep normal editor access.
24. Change a side-panel editor field and confirm the sticky save bar appears, remains visible while scrolling, and clears after Save Changes or Revert.
25. Click Save & Apply with and without a supported GHL tab available and confirm saved changes plus the correct apply or apply-later message.
26. Confirm Sidebar Style accordions default open to Style Path and Presets, then auto-open Background for Custom Configuration and Logo for active branding.

## Known Limitations

- The Chrome extension is the current shipping product; the React/Express theme builder is retained as legacy/deferred reference.
- Generated CSS is intended for MVP copy/paste testing and has not been validated against live GoHighLevel DOM updates.
- The hosted loader script remains non-mutating and is reserved for a future hosted configuration workflow.
- Selector coverage is limited to the current MVP menu registry.
- Settings are still stored in local JSON files under `server/data`.
- Curated image assets are bundled local placeholder/cropped WebP assets and should be replaced with approved production art if desired.
- Animated sidebar backgrounds are intentionally deferred.

## Recommended Next Step

Prepare the CleanView Chrome extension for Chrome Web Store submission using the launch checklist in `docs/extension-roadmap.md`. Treat Express deployment and hosted loader work as deferred legacy/future-hosted-sync work.
