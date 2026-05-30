# CleanView Chrome Extension Roadmap

AgencySkin's current shipping product is the CleanView Chrome extension for GoHighLevel sidebar customization.

## MVP

- Package the local Chrome extension from `extension/`.
- Keep Profiles and Templates local to `chrome.storage.local`.
- Support Profile creation from Templates, blank Profiles, and imported Profile JSON.
- Support sidebar menu visibility, label renaming, Quick Links, and per-Profile sidebar styling.
- Keep popup controls focused on applying, restoring, and opening the Profile Builder.
- Preserve safe runtime behavior: registered selectors only, no raw CSS or JavaScript editor, no GoHighLevel API dependency.
- Prepare for Chrome Web Store submission.

## Post-MVP

- Improve first-run onboarding and Profile creation guidance.
- Replace placeholder/cropped curated visuals with approved production art.
- Expand visual QA across GoHighLevel and LeadConnector sidebar states.
- Refine import/export validation, previews, and error copy.
- Add clearer user documentation, quick-start walkthroughs, and troubleshooting notes.
- Improve curated Profile packs and starter Templates.

## Future Hosted Sync

- Add AgencySkin accounts and authenticated cloud Profile sync.
- Support team/shared Profiles and admin-managed Profile packs.
- Provide hosted configuration, remote defaults, and controlled rollout settings.
- Add security review, audit trails, permission boundaries, and privacy controls.
- Consider billing and marketplace workflows after hosted sync proves useful.

## Chrome Web Store Launch Checklist

- Confirm `manifest.json` name, description, version, icons, permissions, host permissions, and web-accessible resources are accurate.
- Review Chrome Web Store data-use disclosures and publish a privacy policy.
- Prepare listing copy, screenshots, promotional images, and support contact details.
- QA install, popup, Profile Builder, Profile import/export, restore, and CleanView toggle behavior from a fresh Chrome profile.
- QA against `https://app.gohighlevel.com/*` and `https://*.leadconnectorhq.com/*`.
- Confirm sidebar layers do not block clicks and text remains readable across bundled visual backgrounds.
- Confirm invalid imported Profile JSON and unsafe Quick Link URLs are rejected.
- Remove or gate noisy development logging if any appears during QA.
- Bump the extension version and write release notes.
- Pack the extension and upload the production build to the Chrome Web Store developer dashboard.
- Track review feedback and fix rejection risks before public rollout.
