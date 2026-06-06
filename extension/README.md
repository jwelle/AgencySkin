# AgencySkin Chrome Extension

AgencySkin includes CleanView, a personal-browser tool for simplifying the GoHighLevel sidebar.

CleanView runs locally in Chrome. It does not use a backend, authentication, billing, the GoHighLevel API, or hosted configuration.

## What CleanView Does

- Switch between sidebar Profiles instantly.
- Create personal CleanView Profiles.
- Create editable Profiles from Templates.
- Hide registered GoHighLevel sidebar menu items.
- Rename registered GoHighLevel sidebar labels for your browser.
- Add CleanView Quick Links as personal shortcuts in the sidebar.
- Apply optional per-Profile sidebar styling.
- Reset the current page back to the original GoHighLevel sidebar.
- Enable or disable CleanView without deleting saved Profiles.

## Load Unpacked in Chrome

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click `Load unpacked`.
4. Select this repo's `extension/` folder.
5. Pin or open the `AgencySkin` extension.

## Test on GoHighLevel

1. Open `https://app.gohighlevel.com/`.
2. Open the AgencySkin extension popup.
3. Confirm the popup shows `CleanView`.
4. Choose an Active Profile.
5. Confirm the selected Profile is saved and applies only to a validated GHL tab.
6. Click `Customize CleanView`.
7. Confirm the popup closes immediately after the side panel opens.
8. Select a built-in template and confirm the primary button says `Save as New Profile`.
9. Edit the template and save it as a new custom profile.
10. Select a custom profile and confirm the primary button says `Save Changes` and the secondary button says `Save as Copy`.
11. Use the Menu Items, Rename Labels, Quick Links, and Sidebar Style tabs.
12. Uncheck `Show this Profile in popup`, save, and confirm the Profile is hidden from the popup dropdown.
13. Recheck `Show this Profile in popup`, save, and confirm the Profile returns to the popup dropdown.
14. Add a Quick Link with `LOCATION_ID` in the URL if needed.
15. Enable a Sidebar Style preset, click `Apply Live to GHL`, and confirm the GHL sidebar updates.
16. Upload a sidebar image and confirm it appears in preview immediately without needing a separate styling checkbox.
17. Confirm Sidebar Style uses a two-column guided editor with `Use Preset` / `Custom Configuration` on the left, plus sticky preview and Menu Colors on the right.
18. Confirm `Use Preset` hides custom background controls, then switch to `Custom Configuration` and test None, Color, Gradient, and Image before saving.
19. Set Sidebar Branding to `Keep default`, `Hide default`, and `Replace with custom` to confirm the preview updates.
20. Save/apply `Hide default` and confirm the native GHL logo/header is hidden without removing it.
21. Save/apply `Replace with custom` and confirm the custom logo/header appears once.
22. Switch back to Color or Gradient and confirm the old image background is removed after saving/applying.
23. Navigate inside GoHighLevel and confirm the sidebar state reapplies after rerenders without duplicate branding.
24. Click `Detect GHL Sidebar` and confirm it reports `#sidebar-v2`.
25. Toggle CleanView off and confirm the original sidebar remains visible.
26. Use `More` to export the active Profile JSON.
27. Copy or download the exported JSON, then use `Create Profile` to import it as a new Profile.
28. Confirm invalid JSON and unsafe quick link URLs are rejected before import.

## Templates

- Simple Template
- Sales Template
- Marketing Template
- Admin Template
- Loan Officer Template

## CleanView Profiles

Templates are read-only starting points. Create a Profile from a Template or create a blank Profile to edit:

- Visible sidebar items
- Personal menu label overrides
- CleanView Quick Links
- Sidebar Style, including curated presets, visual backgrounds, controlled rotation, and sidebar branding mode

Personal Profiles are stored in `chrome.storage.local` on this browser.

Use `Show this Profile in popup` to keep the popup Active Profile dropdown focused. Hidden Profiles remain available in the Profile Builder and are not deleted.

## Sidebar Image Guidance

For visual sidebar backgrounds, use vertical portrait images. Recommended size is `600 x 1600 px`, premium size is `800 x 2000 px`, and minimum size is `400 x 1200 px`. WebP is best, JPG is a good fallback, and files should stay under `750 KB` when possible. Keep important content near the center because `cover` mode may crop the image on different sidebar heights.

## Profile Import / Export

Use `Create Profile` in the Profile Builder to import CleanView Profile JSON. Use `More` to export or copy JSON for the selected Profile.

- `Export Profile` opens a JSON preview with copy and download actions.
- `Copy Profile JSON` uses the same export preview.
- `Import Profile JSON` accepts pasted CleanView JSON or an uploaded `.json` file.
- Imported JSON is validated, previewed, and saved as a new editable Profile.
- Imports never overwrite the active Profile or edit a Template directly.

Phase 1 imports support schema version `1.0.0` and allow safe Profile configuration only. Quick link URLs must be relative GHL paths beginning with `/`.

## CleanView Quick Links

CleanView Quick Links are personal links injected into the GoHighLevel sidebar.

Use `LOCATION_ID` in a link URL when you want CleanView to substitute the current GoHighLevel location id.

## CleanView Location Rules

CleanView Location Rules are feature-flagged off for the current MVP. Existing stored rules are preserved for future defaults work, but the popup and Profile Builder do not show location assignment controls.

## Live Apply and Diagnostics

Use `Apply Live to GHL` from the side panel or popup to apply saved settings to a validated GoHighLevel tab.

Use `Detect GHL Sidebar` to confirm CleanView can reach `#sidebar-v2`. Turn off `Enable CleanView` to stop automatic reapplication.

## Supported Sites

- `https://app.gohighlevel.com/*`
- `https://*.leadconnectorhq.com/*`

Custom white-label domains can be added later by extending `matches` and `host_permissions` in `manifest.json`.

## Known Limitations

- Storage is local to the current Chrome browser.
- No cloud sync or AgencySkin web app sync yet.
- No GoHighLevel API access.
- Sidebar Style is scoped to the detected GHL sidebar/menu area.
- No raw CSS, raw JavaScript, or selector editor.
- CleanView only manages registered selectors and its own injected quick links.

## Future Ideas

- Quick Hide Mode
- Per-location profile improvements
- Export CSS
- Sync with AgencySkin web app
- Theme controls
- Selector inspector
