# AgencySkin

AgencySkin's current shipping product is the **AgencySkin CleanView Chrome extension**.

CleanView is a Chrome extension for GoHighLevel sidebar customization. Profiles remain local to the browser; a small Supabase allowlist controls which exact agency white-label domains may run the extension.

## Current Shipping Product

- Chrome extension MVP: `extension/`
- Detailed extension guide: `extension/README.md`
- Roadmap and launch checklist: `docs/extension-roadmap.md`

CleanView runs in the browser with `chrome.storage.local`. Profiles and Templates are managed inside the extension popup and Profile Builder.

## What CleanView Does

- Switch between sidebar Profiles.
- Create editable Profiles from Templates or from blank.
- Hide registered GoHighLevel sidebar menu items.
- Rename registered GoHighLevel sidebar labels.
- Add personal CleanView Quick Links.
- Apply per-Profile sidebar styling.
- Import and export Profile JSON.
- Restore the current page back to the original GoHighLevel sidebar.

## Load the Extension Locally

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click `Load unpacked`.
4. Select this repo's `extension/` folder.
5. Pin or open the `AgencySkin` extension.

See `extension/README.md` for the full extension test flow.

## Repository Structure

```text
AgencySkin/
  extension/             CleanView Chrome extension MVP
  supabase/              Custom-domain allowlist migration and check function
  docs/                  Extension roadmap, selector notes, legacy docs
  client/                Legacy React + Vite theme builder surface
  server/                Legacy Express API and JSON storage
  public/loader.js       Legacy safe placeholder loader script
```

## Legacy Theme Builder

The earlier client/server/live site theme builder remains in the repository for reference and is not the current shipping surface.

Do not delete `client/`, `server/`, or `public/loader.js` yet. Their original MVP description has been moved to `docs/legacy-theme-builder.md`.

## Development Notes

- The extension does not require `npm install` or a local server to load unpacked in Chrome.
- Custom-domain testing requires the Supabase migration/function to be deployed and its public function URL configured in `extension/domainAccessConfig.js`.
- The legacy dashboard/server can still be run for reference with the root `package.json` scripts.
- Future hosted sync work should build from the extension Profile model instead of treating the legacy theme builder as the active product.
