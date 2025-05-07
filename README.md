Install dependencies:

```
cd frontend
pnpm install
```

# Running the project:

## Frontend
```bash
cd frontend
pnpm start
```

## Backend
and in a separate console:

```bash
cd supabase
supabase start
```

# Testing from other devices / over https
1. Ensure you have a valid ngrok config yaml (on macOS, located in  `/Users/youruser/Library/Application Support/ngrok/ngrok.yml`)
1. run `ngrok start --all`
1. Replace VITE_SUPABASE_URL in /frontend/.env with your supabase ngrok URL



# Migrating from CellarTracker
1. Log into cellartracker.com
1. Switch to the Individual Bottles view
1. Click on Export
1. Select "Wines from all pages" under "Include"
1. Select all columns and CSV type