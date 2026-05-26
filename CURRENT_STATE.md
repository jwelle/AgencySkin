# Current State

## Added

- Install Code Generator added to the AgencySkin dashboard.
- Generated CSS uses current theme settings and hides only menu items disabled in the dashboard.
- Optional hosted loader script snippet is shown separately and remains experimental.
- Copy buttons added for generated CSS and the loader snippet.

## Files Changed

- `client/src/App.jsx`
- `client/src/styles.css`
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

## Known Limitations

- Generated CSS is intended for MVP copy/paste testing and has not been validated against live GoHighLevel DOM updates.
- The hosted loader script remains non-mutating and is reserved for a future hosted configuration workflow.
- Selector coverage is limited to the current MVP menu registry.
- Settings are still stored in local JSON files under `server/data`.

## Recommended Next Step

Deploy the Express app to a stable URL and replace the local loader snippet URL with the deployed loader URL once hosting is ready.
