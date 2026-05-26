# AgencySkin CleanView Extension

AgencySkin CleanView is a Chrome extension MVP for simplifying the GoHighLevel sidebar with local browser presets.

It is independent from the AgencySkin web app. It does not use a backend, authentication, billing, the GoHighLevel API, or a hosted loader.

## What It Does

- Runs on `https://app.gohighlevel.com/*` and `https://*.leadconnectorhq.com/*`.
- Applies sidebar visibility presets using validated GoHighLevel sidebar selectors.
- Hides registered menu items with inline `display: none !important`.
- Restores registered menu items without removing DOM elements.
- Reapplies the selected preset when GoHighLevel rerenders the sidebar.

Custom white-label domains can be added later by extending the `matches` and `host_permissions` entries in `manifest.json`.

## Load Unpacked in Chrome

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click `Load unpacked`.
4. Select the repo's `extension/` folder.
5. Pin or open the `AgencySkin CleanView` extension.

## Test on GoHighLevel

1. Open `https://app.gohighlevel.com/`.
2. Open the extension popup.
3. Choose `Simple Client View`.
4. Click `Apply Preset`.
5. Confirm only Dashboard, Conversations, Calendars, and Contacts remain visible among registered menu items.
6. Choose `Sales Team View`.
7. Click `Apply Preset`.
8. Confirm Opportunities is visible too.
9. Click `Show All` to restore all registered menu items.
10. Navigate inside GoHighLevel and confirm the selected preset reapplies after sidebar rerenders.

## Presets

- Admin View: shows every registered menu item.
- Simple Client View: shows Dashboard, Conversations, Calendars, and Contacts.
- Sales Team View: shows Dashboard, Conversations, Calendars, Contacts, and Opportunities.
- Marketing View: shows Dashboard, Marketing, Automation, Sites, and Media Storage.
- Minimal View: shows Dashboard only.

## Restore All Items

Click `Show All` in the popup. This restores all registered sidebar menu items and stores the Admin View preset.

## Known Limitations

- Settings apply globally across supported GoHighLevel domains in this browser.
- Per-location profiles are not implemented yet.
- Custom white-label domains are not included by default.
- The extension only manages registered sidebar menu selectors.
- It does not provide theme controls, raw CSS, raw JavaScript, or selector editing.

## Future Ideas

- Quick Hide Mode
- Per-location profiles
- Export CSS
- Sync with AgencySkin web app
- Theme controls
- Selector inspector
