# AgencySkin MVP Scope

## Goal

Create a working local MVP for agencies to manage GoHighLevel white-label customization settings per sub-location.

## Included

- React dashboard with a location selector.
- Theme Builder panel for basic brand colors and logo URL.
- Menu Manager panel for toggling core GoHighLevel navigation items.
- Save Settings action for persisting draft settings to JSON.
- Publish action for marking the current location settings as published.
- Disable Customizations action for turning off a location configuration.
- Reset to Default action for restoring sample defaults.
- Express API for reading locations, reading settings, saving settings, publishing settings, disabling settings, and resetting settings.
- Public `loader.js` placeholder that can later fetch location-specific configuration and apply theme/menu changes safely.

## Not Included Yet

- Production authentication or agency user management.
- GoHighLevel OAuth or marketplace installation flow.
- Database-backed persistence.
- Audit logs, billing, roles, or multi-agency tenancy.
- Real selector validation against live GoHighLevel DOM updates.
- Hosted deployment configuration.

## Data Model

For the MVP, data is stored as JSON:

- `locations.json`: sample sub-location records.
- `settings.json`: location-specific customization settings.

This keeps local development deterministic and makes later Supabase or Postgres migration straightforward.

## Loader Direction

The loader should remain defensive:

- Fetch only location-specific config.
- Check whether customizations are enabled before making changes.
- Apply theme variables and menu visibility only through known selectors from the registry.
- Fail silently with console warnings instead of breaking the GoHighLevel UI.
