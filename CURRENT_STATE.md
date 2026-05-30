# Current State

## Added

- CleanView Sidebar Style is now the first Profile Builder tab.
- Curated sidebar style cards, bundled visual backgrounds, pattern-backed presets, and controlled Curated Rotation were added to the Chrome extension.
- Sidebar background settings now store structured image, pattern, readability, favorite, and rotation configuration.
- GoHighLevel sidebar backgrounds now apply through internal non-click-blocking background layers.
- Phase 1 Profile JSON import/export was added to the CleanView Profile Builder.
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
- `extension/manifest.json`
- `extension/popup.html`
- `extension/sidebarBackgrounds.js`
- `extension/storage.js`
- `extension/assets/backgrounds/*.webp`
- `README.md`
- `CURRENT_STATE.md`

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
12. Open the Profile Builder and confirm Sidebar Style is the first tab.
13. Apply curated sidebar preset cards and confirm the preview updates.
14. Confirm the Sidebar Style tab uses a guided `Use Preset` / `Custom Configuration` editor.
15. Confirm the right panel keeps a tall sticky sidebar preview, Menu Colors, and Save / Reset controls visible while scrolling.
16. Save a custom Profile and apply it on a supported GoHighLevel page.
17. Export a Profile JSON file from `More`, then import it as a new editable Profile through `Create Profile`.

## Known Limitations

- Generated CSS is intended for MVP copy/paste testing and has not been validated against live GoHighLevel DOM updates.
- The hosted loader script remains non-mutating and is reserved for a future hosted configuration workflow.
- Selector coverage is limited to the current MVP menu registry.
- Settings are still stored in local JSON files under `server/data`.
- Curated image assets are bundled local placeholder/cropped WebP assets and should be replaced with approved production art if desired.
- Animated sidebar backgrounds are intentionally deferred.

## Recommended Next Step

Deploy the Express app to a stable URL and replace the local loader snippet URL with the deployed loader URL once hosting is ready.
