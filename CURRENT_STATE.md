# Current State

## Added

- CleanView Sidebar Style is now the first View Builder tab.
- Curated sidebar style cards, bundled visual backgrounds, pattern-backed presets, and controlled Curated Rotation were added to the Chrome extension.
- Sidebar background settings now store structured image, pattern, readability, favorite, and rotation configuration.
- GoHighLevel sidebar backgrounds now apply through internal non-click-blocking background layers.
- Phase 1 View JSON import/export was added to the CleanView View Builder.
- CleanView daily configuration now runs in the Chrome side panel, with the popup reduced to a launcher and quick controls.
- Save now persists local settings separately from `Apply Live to GHL`, which only targets validated open GHL tabs.
- Built-in templates are hidden from the normal creation path; normal users create saved Views through the guided creation flow.
- Fresh CleanView users now see a side-panel first-run starter flow with Sales, Marketing, AI Operator, Contact Center, and Simple starter views.
- Starter views now preview as temporary first-run drafts, retry through early GHL sidebar churn, allow pre-save view naming, and then `Create My View` saves a normal custom View with starter metadata, menu visibility/order, sidebar color, menu text color mode, and a dedicated post-creation success state.
- Existing custom View users skip first-run onboarding, use `My Views` to manage saved views, and use `Create New View` to start with a starter, start from blank, or duplicate the current view.
- The popup now shows `Current View`, saved custom Views only, a `Switch View` dropdown only when needed, and a `Customize View` CTA.
- The side panel now has a `My Views` management list with Active/Saved status and Make Active, Edit, Rename, Duplicate, and Delete actions.
- Full-editor Sidebar Style now includes a simple top-header theme toggle that applies the active CleanView theme to the GHL header, while keeping deeper header-controls schema support behind the scenes for future use.
- The side-panel editor now shows a sticky bottom save bar for unsaved changes, with Revert, Save Changes, and Save & Apply actions.
- Sidebar Style controls are now grouped into collapsible sections for Style Path, Presets, Background, Logo, Menu Text, Spacing, and Advanced.
- The side panel now surfaces a `Reload GHL Tab` recovery action when `Apply Live to GHL` cannot reach the GHL content script.
- The popup now closes immediately after successfully opening the CleanView side panel.
- The popup now shows a friendlier first-run empty state, first-run CTA, and toggle-style CleanView switch without a blank Current View field.
- The popup now uses a single `Customize View` launcher button and no longer duplicates side-panel apply/admin actions.
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
12. Open a GHL page, click the extension popup, then click `Customize View`.
13. Confirm the side panel opens while GHL remains the active page and Sidebar Style is the first tab.
14. Apply curated sidebar preset cards and confirm the local preview updates without needing a live GHL measurement.
15. Confirm the Sidebar Style tab uses a guided `Use Preset` / `Custom Configuration` editor.
16. Confirm `My Views` lists only saved custom Views and clearly labels the active View.
17. Select a custom View and confirm the sticky primary action shows `Save Changes` and `More` includes `Save a Copy`.
18. Confirm the popup closes immediately after `Customize View` opens the side panel.
19. Click `Detect GHL Sidebar` and confirm `#sidebar-v2` is reported when present.
20. Export a View JSON file from `More`, then import it as a new editable View through advanced import.
21. Clear or simulate an empty custom View state, confirm the popup shows the first-run empty state, then open the side panel and choose each first-run starter view.
22. Confirm the live GHL preview applies on the first click and stays visible without creating a View.
23. Confirm onboarding menu visibility/order, sidebar color, menu text color, and view name changes update the temporary preview, then `Create My View` saves a custom View, makes it active, and shows the post-creation success state.
24. Confirm the success state shows the saved View name plus `What happened` and `Skipped for now`, including `Menu groups: Not added`, and that `Done`, `Edit Menu`, `Back to Summary`, `Done Editing`, and `Open Full Editor` each land in the correct next state without recreating the View.
25. Confirm existing custom View states skip first-run onboarding and keep normal editor access.
26. Confirm `My Views` from the active overview returns existing users to the saved View list.
27. Confirm `Create New View` opens the unified choice panel, `Start with a Starter` opens starter cards, `Start from Blank` opens guided blank setup, and `Duplicate Current View` creates one active copy and shows success.
28. Reproduce a content-script-not-reachable case and confirm `Reload GHL Tab` appears, then reload guidance shows after clicking it.
29. Change a side-panel editor field and confirm the sticky save bar appears, remains visible while scrolling, and clears after Save Changes or Revert.
30. Click Save & Apply with and without a supported GHL tab available and confirm saved changes plus the correct apply or apply-later message.
31. Confirm Sidebar Style accordions default open to Style Path and Presets, then auto-open Background for Custom Configuration and Logo for active branding.

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
