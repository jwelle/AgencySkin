# AgencySkin

AgencySkin is an MVP scaffold for a GoHighLevel white-label customization tool. It gives agencies a simple dashboard for choosing a sub-location, editing theme settings, controlling menu visibility, and publishing configuration that a future loader script can apply inside GoHighLevel.

## Project Structure

```text
AgencySkin/
  client/                React + Vite dashboard
  docs/                  Product notes and MVP scope
  public/loader.js       Safe placeholder loader script
  server/                Express API and JSON storage
    data/                Sample locations and saved settings
    selectorRegistry.js  Known GoHighLevel selector registry
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the backend and frontend together:

```bash
npm run dev
```

The React app runs on `http://localhost:5173` and proxies API requests to the Express server on `http://localhost:5174`.

Start only the production-style Express server:

```bash
npm start
```

## MVP Notes

- No production authentication is included yet.
- Settings are stored in local JSON files under `server/data`.
- The dashboard can generate copy/paste CSS install code for the selected sample location.
- The loader script is intentionally safe and does not mutate GoHighLevel yet unless a future config enables concrete behavior.
- Sample location data is included so the dashboard works immediately after install.
