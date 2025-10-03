# Deploying FilmRitz to Vercel

This document summarizes the minimal steps to deploy FilmRitz to Vercel and keep your TMDB API key secret.

1. Environment variables (on Vercel)

- Go to your Vercel project → Settings → Environment Variables.
- Add the variable:
  - Name: `TMDB_API_KEY`
  - Value: <your_tmdb_api_key>
  - Environment: Production (and Preview/Development if you want)

2. `vercel.json`

- The repository already includes a `vercel.json` that:
  - Rewrites all paths to `/index.html` so SPA client routing works (no 404s for deep links).
  - Adds caching headers for static assets and prevents aggressive caching for `index.html`.

3. Serverless proxy

- The project includes a serverless function at `api/tmdb/[...path].js`.
- Client code calls `/api/tmdb/*` which proxies to The Movie DB using the `TMDB_API_KEY` on the server. This keeps your API key secret.

4. Local testing

- To test the serverless proxy locally, set the environment variable before running dev server:

  macOS / Linux (bash):
  ```bash
  export TMDB_API_KEY=your_key_here
  npm run dev
  ```

  Windows PowerShell:
  ```powershell
  $env:TMDB_API_KEY='your_key_here'
  npm run dev
  ```

5. If `.env` was previously committed

- If you accidentally committed your `.env` with the key, rotate the key in TMDB immediately and remove the file from git history. To remove from history you can use the BFG or git filter-repo. I can help with that.

6. Optional improvements

- Convert the serverless function to an Edge function for lower latency.
- Add automated tests for the proxy.
- Optimize large assets (Hero Image) to reduce page load.

If you want, I can rotate the key in your repository (remove from history) and convert the proxy to an Edge Function.
