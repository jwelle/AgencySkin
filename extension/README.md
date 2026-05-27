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
- Assign a view to the current GoHighLevel location with CleanView Location Rules.
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
8. Use the Menu Items, Rename Labels, Quick Links, Sidebar Style, and Location Rules tabs.
9. Save the view, then use `Save and Apply` to apply it to the active GHL tab.
10. Add a Quick Link with `LOCATION_ID` in the URL if needed.
11. Enable a Sidebar Style preset and confirm the GHL sidebar updates.
12. Click `Use this view for this location` to assign the selected view to the current GHL location.
13. Navigate inside GoHighLevel and confirm the sidebar state reapplies after rerenders.
14. Click `Restore current page` to restore the original sidebar for the current page.
15. Toggle CleanView off and confirm the original sidebar remains visible.

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
- Sidebar Style

Personal views are stored in `chrome.storage.local` on this browser.

## CleanView Quick Links

CleanView Quick Links are personal links injected into the GoHighLevel sidebar.

Use `LOCATION_ID` in a link URL when you want CleanView to substitute the current GoHighLevel location id.

## CleanView Location Rules

CleanView Location Rules map a GoHighLevel location id to a view. When a location rule exists, it takes priority over the global current view.

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
