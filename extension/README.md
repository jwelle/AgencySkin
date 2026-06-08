# AgencySkin Chrome Extension

AgencySkin includes CleanView, a personal-browser tool for simplifying the GoHighLevel sidebar.

CleanView runs locally in Chrome. It does not use a backend, authentication, billing, the GoHighLevel API, or hosted configuration.

## What CleanView Does

- Switch between saved sidebar Views instantly.
- Create personal CleanView Views.
- Choose a first-run starter view when no custom Views exist.
- Create new Views through a guided starter, blank, or duplicate flow.
- Hide registered GoHighLevel sidebar menu items.
- Rename registered GoHighLevel sidebar labels for your browser.
- Add CleanView Quick Links as personal shortcuts in the sidebar.
- Apply optional per-View sidebar styling.
- Optionally apply the active CleanView theme to the GHL top header for a more consistent dashboard.
- Save unsaved side-panel edits from a sticky bottom save bar.
- Reset the current page back to the original GoHighLevel sidebar.
- Enable or disable CleanView without deleting saved Views.
- Recover from content-script reachability failures with a side-panel `Reload GHL Tab` action.

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
4. Confirm the popup shows `Current View` when a saved View exists.
5. Confirm switching a saved View applies only to a validated GHL tab.
6. Click `Customize View`.
7. Confirm the popup closes immediately after the side panel opens.
8. With no custom Profiles, confirm the side panel shows `Welcome to CleanView` and the five starter views.
9. Confirm the fresh popup shows `No active view yet.`, hides the blank Current View field, and uses the first-run CTA.
10. Choose each starter view and confirm the temporary preview applies live without creating a View.
11. Adjust menu visibility/order, sidebar color, menu text color, and view name, then confirm the live preview updates without saving.
12. Click `Create My View` and confirm a custom View is created, set active, and the post-creation success state appears.
13. Confirm the success state shows `What happened` and `Skipped for now`, then test `Done`, `Edit Menu`, `Back to Summary`, `Done Editing`, and `Open Full Editor`.
14. Confirm existing custom Views skip first-run onboarding.
15. Click `My Views` from the active overview and confirm it returns to the saved View list.
16. Click `Create New View`, confirm the choice panel appears, and test `Start with a Starter`, `Start from Blank`, and `Duplicate Current View`.
17. Confirm `Start with a Starter` shows starter cards and only saves after `Create My View`.
18. Confirm `Start from Blank` uses the guided flow and only saves after `Create My View`.
19. Select a custom View and confirm the sticky primary action says `Save Changes` and `More` includes `Save a Copy`.
19. Use the Menu Items, Rename Labels, Quick Links, and Sidebar Style tabs.
20. Confirm the popup switcher lists saved custom Views only.
21. Confirm built-in templates, drafts, and starter previews do not appear in the popup switcher.
22. Add a Quick Link with `LOCATION_ID` in the URL if needed.
23. Enable a Sidebar Style preset, click `Apply Live to GHL`, and confirm the GHL sidebar updates.
24. Reproduce a content-script-not-reachable case, then confirm the side panel shows `Reload GHL Tab`.
25. Click `Reload GHL Tab` and confirm the tab reload guidance appears without losing the saved view/profile.
26. Change a style, menu, rename, quick link, or view field and confirm the sticky save bar appears.
27. Click `Save Changes` from the sticky bar and confirm the dirty state clears.
28. Change another setting, click `Revert`, and confirm the editor returns to the last saved value.
29. Change a setting, click `Save & Apply`, and confirm the GHL sidebar updates or a clear apply-later message appears.
30. Upload a sidebar image and confirm it appears in preview immediately without needing a separate styling checkbox.
31. Confirm Sidebar Style uses collapsible sections for Style Path, Presets, Background, Logo, Menu Text, Spacing, and Advanced.
32. Use `Top Header` in the full editor, confirm the local preview updates immediately, and confirm the active view theme applies to `.hl_header` and `.hl_header .container-fluid`.
33. Confirm `Use Preset` hides custom background controls, then switch to `Custom Configuration` and test None, Color, Gradient, and Image before saving.
34. Set Sidebar Branding to `Keep default`, `Hide default`, and `Replace with custom` to confirm the preview updates.
35. Save/apply `Hide default` and confirm the native GHL logo/header is hidden without removing it.
36. Save/apply `Replace with custom` and confirm the custom logo/header appears once.
37. Switch back to Color or Gradient and confirm the old image background is removed after saving/applying.
38. Navigate inside GoHighLevel and confirm the sidebar state reapplies after rerenders without duplicate branding.
39. Click `Detect GHL Sidebar` and confirm it reports `#sidebar-v2`.
40. Toggle CleanView off and confirm the original sidebar remains visible.
41. Use `More` to export the active View JSON.
42. Copy or download the exported JSON, then import it as a new View from the advanced import path.
43. Confirm invalid JSON and unsafe quick link URLs are rejected before import.

## Starters

- Simple Template
- Sales Template
- Marketing Template
- Admin Template
- Loan Officer Template

## CleanView Views

Starters are creation inputs, not saved Views. Use `Create New View` to start with a Starter, start from Blank, or duplicate the current View, then save from the guided flow:

- Visible sidebar items
- Personal menu label overrides
- CleanView Quick Links
- Sidebar Style, including curated presets, visual backgrounds, controlled rotation, and sidebar branding mode

Personal Views are stored in `chrome.storage.local` on this browser. Saved custom Views are the only items shown in the popup switcher and My Views list.

## Sidebar Image Guidance

For visual sidebar backgrounds, use vertical portrait images. Recommended size is `600 x 1600 px`, premium size is `800 x 2000 px`, and minimum size is `400 x 1200 px`. WebP is best, JPG is a good fallback, and files should stay under `750 KB` when possible. Keep important content near the center because `cover` mode may crop the image on different sidebar heights.

## View Import / Export

Use advanced import/export actions to move CleanView View JSON. Use `More` to export or copy JSON for the selected View.

- `Export View` opens a JSON preview with copy and download actions.
- `Copy View JSON` uses the same export preview.
- `Import View JSON` accepts pasted CleanView JSON or an uploaded `.json` file.
- Imported JSON is validated, previewed, and saved as a new editable View.
- Imports never overwrite the active View or edit a starter directly.

Phase 1 imports support schema version `1.0.0` and allow safe View configuration only. Quick link URLs must be relative GHL paths beginning with `/`.

## CleanView Quick Links

CleanView Quick Links are personal links injected into the GoHighLevel sidebar.

Use `LOCATION_ID` in a link URL when you want CleanView to substitute the current GoHighLevel location id.

## CleanView Location Rules

CleanView Location Rules are feature-flagged off for the current MVP. Existing stored rules are preserved for future defaults work, but the popup and View Builder do not show location assignment controls.

## Live Apply and Diagnostics

Use `Apply Live to GHL` from the side panel to apply saved settings to a validated GoHighLevel tab.

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
