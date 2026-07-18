# AsyncNode — Web

Next.js (App Router) frontend for AsyncNode: the workflow builder UI, dashboard, and auth pages.

See the [root README](../../README.md) for the full project overview and setup instructions.

## Development

```bash
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000). Requires the backend (`app/server`) running and reachable at the URL configured via `backend_URI` (see the root [.env.example](../../.env.example)).

## Structure

* `app/` — routes: `/`, `/signin`, `/signup`, `/verification/[id]`, `/dashboard`, `/builder/[id]`
* `components/builder/` — the React Flow-based workflow canvas and node editor
* `components/dashboard/`, `components/signin/`, `components/signup/` — page-specific components
* `hooks/` — `useWorkflow`, `useWorkflows`, `useMe`, `useExecutionSocket` (Socket.IO client for live execution updates)
* `services/` — API client functions grouped by domain (`auth/`, `workflows/`)
