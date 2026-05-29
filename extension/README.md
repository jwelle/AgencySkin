# AgencySkin Chrome Extension

AgencySkin includes CleanView, a personal-browser tool for simplifying the GoHighLevel sidebar.

CleanView runs locally in Chrome. It does not use a backend, authentication, billing, the GoHighLevel API, or hosted configuration.

## What CleanView Does

- Switch between built-in sidebar views instantly.
- Create personal CleanView Views.
- Duplicate built-in views into editable personal views.
- Hide registered GoHighLevel sidebar menu items.
- Rename registered GoHighLevel sidebar labels for your browser.
- Add CleanView Quick Links as personal shortcuts in the sidebar.
- Apply optional per-view sidebar styling.
- Reset the current page back to the original GoHighLevel sidebar.
- Enable or disable CleanView without deleting saved views.

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
4. Choose `Simple View` or another Current View.
5. Confirm the selected view applies immediately.
6. Click `Edit views`.
7. Duplicate a built-in view or create a new custom view.
8. Use the Menu Items, Rename Labels, Quick Links, and Sidebar Style tabs.
9. Click `Save View`. If the saved view is the active Current View, CleanView reapplies it to the active GHL tab.
10. Uncheck `Show this view in popup`, save, and confirm the view is hidden from the popup dropdown.
11. Recheck `Show this view in popup`, save, and confirm the view returns to the popup dropdown.
12. Add a Quick Link with `LOCATION_ID` in the URL if needed.
13. Enable a Sidebar Style preset and confirm the GHL sidebar updates.
14. Change Sidebar Background Type to `Image`, enter an image URL, and confirm the preview updates.
15. Adjust Image Fit, Image Position, Overlay Color, and Overlay Opacity, then click `Save View`.
16. Set Sidebar Branding to `Keep default`, `Hide default`, and `Replace with custom` to confirm the preview updates.
17. Save/apply `Hide default` and confirm the native GHL logo/header is hidden without removing it.
18. Save/apply `Replace with custom` and confirm the custom logo/header appears once.
19. Switch back to Solid or Gradient and confirm the old image background is removed after saving/applying.
20. Navigate inside GoHighLevel and confirm the sidebar state reapplies after rerenders without duplicate branding.
21. Click `Restore current page` to restore the original sidebar for the current page.
22. Toggle CleanView off and confirm the original sidebar remains visible.

## Built-In Views

- Simple View
- Sales View
- Marketing View
- Admin View
- Loan Officer View
- Blank Custom View

## CleanView Views

Built-in views are read-only. Duplicate a built-in view or create a personal view to edit:

- Visible sidebar items
- Personal menu label overrides
- CleanView Quick Links
- Sidebar Style, including solid, gradient, URL-based image backgrounds, and sidebar branding mode

Personal views are stored in `chrome.storage.local` on this browser.

Use `Show this view in popup` to keep the popup Current View dropdown focused. Hidden views remain available in the View Builder and are not deleted.

## CleanView Quick Links

CleanView Quick Links are personal links injected into the GoHighLevel sidebar.

Use `LOCATION_ID` in a link URL when you want CleanView to substitute the current GoHighLevel location id.

## CleanView Location Rules

CleanView Location Rules are feature-flagged off for the current MVP. Existing stored rules are preserved for future defaults work, but the popup and View Builder do not show location assignment controls.

## Restore All Items

Use `Restore current page` to restore the current page to the original GoHighLevel sidebar. This does not delete saved views or location rules.

Turn off `Enable CleanView` to stop automatic reapplication.

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
