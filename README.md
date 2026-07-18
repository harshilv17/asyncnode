# AsyncNode

A self-hostable workflow automation platform. Design workflows visually as a graph of nodes, then run them manually, on a webhook, or on a schedule — with execution history, per-node logs, and live status over WebSockets.

---

## What it actually does

* **Visual workflow builder** — a node-based canvas (React Flow) for wiring up trigger → action graphs.
* **Node types**: `trigger`, `ai` (OpenAI / Anthropic / Groq), `http` (HTTP request), `email` (SMTP via Nodemailer), `slack` (Slack message).
* **Triggers**: manual run, webhook (unique per-workflow token URL), and interval-based scheduling (repeatable BullMQ jobs).
* **Execution engine** — resolves node dependencies from the saved graph with a topological sort and runs them in order, persisting status/input/output per node.
* **Execution history** — every run and every node run is stored in Postgres (`execution`, `node_execution`, `execution_logs`), queryable via the API.
* **Live updates** — execution/node status is pushed to the frontend over Socket.IO as it happens.
* **Auth** — email/password signup+signin with JWT access/refresh tokens in httpOnly cookies, plus email verification.
* **Rate limiting** — global API limiter, a stricter limiter on auth endpoints, and a dedicated limiter on manual workflow runs.

This is a modular monolith: one Express API process plus BullMQ workers running in the same codebase (currently in-process), backed by Postgres and Redis. There are no separate "scheduler service" or "webhook service" deployables — those are just modules inside the same app.

---

## Tech stack

**Frontend** (`app/web`)
* Next.js 16 (App Router), React 19, TypeScript
* React Flow for the workflow canvas
* Tailwind CSS 4 + shadcn/ui (Radix primitives)
* Socket.IO client for live execution updates

**Backend** (`app/server`)
* Node.js, TypeScript, Express 5
* Drizzle ORM + PostgreSQL (targets Neon's serverless driver)
* BullMQ + Redis for job queues (workflow execution, verification emails)
* Socket.IO for realtime execution events
* JWT auth (access + refresh tokens), bcrypt password hashing
* Nodemailer (SMTP) for transactional email
* Winston for server-side logging
* Swagger/OpenAPI docs generated from JSDoc annotations
* AI provider SDKs: `@anthropic-ai/sdk`, `openai`, `groq-sdk`

**Infrastructure**
* Docker Compose (web, server, redis — Postgres is external, e.g. Neon)
* Nginx reverse proxy config (for production deployment)

---

## Project structure

```text
AsyncNode/
├── app/
│   ├── server/            # Express API + BullMQ workers
│   │   └── src/
│   │       ├── config/            # env, db, redis, swagger, queue setup
│   │       ├── db/schemas/        # Drizzle table definitions
│   │       ├── executors/         # per-node-type execution logic
│   │       ├── integrations/      # AI / email / slack / http clients
│   │       ├── jobs/               # BullMQ job definitions
│   │       ├── middlewares/       # auth, rate limiting, error handling
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── workflows/
│   │       │   └── executions/    # includes webhook trigger endpoint
│   │       ├── workers/           # BullMQ worker processes
│   │       └── ws/                # Socket.IO server
│   └── web/                # Next.js frontend
│       ├── app/                   # routes: /, /signin, /signup, /dashboard, /builder/[id]
│       ├── components/builder/    # the node-based workflow editor
│       └── hooks/, services/
├── docker/                 # docker-compose.yml
├── nginx/                  # reverse proxy config
└── docs/                   # architecture, API, database, decisions
```

---

## Running locally

You need a PostgreSQL database (e.g. a free [Neon](https://neon.tech) instance) and Redis.

### 1. Backend

```bash
cd app/server
npm install
cp ../../.env.example .env   # fill in DATABASE_URL, REDIS_URL, JWT secrets, SMTP creds
npm run db:migrate
npm run dev
```

The API runs on `http://localhost:8080` (see `PORT` in `.env`). Swagger UI is available at `/api/docs`.

### 2. Frontend

```bash
cd app/web
npm install
npm run dev
```

The app runs on `http://localhost:3000` and expects the backend at the URL configured via `backend_URI` in its environment.

### 3. Redis (if not already running)

```bash
docker compose -f docker/docker-compose.yml up redis
```

Or run all three services (web, server, redis) together with `docker compose -f docker/docker-compose.yml up --build`. Postgres is not included in the compose file — point `DATABASE_URL` at an external instance.

See [.env.example](.env.example) for the full list of required environment variables.

---

## Documentation

| Document | Purpose |
|---|---|
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | How the pieces fit together |
| [docs/api/API.md](docs/api/API.md) | REST API reference |
| [docs/database/DATABASE.md](docs/database/DATABASE.md) | Database schema |
| [docs/decisions/DECISIONS.md](docs/decisions/DECISIONS.md) | Architectural decision records |
| [PRODUCT_BREAKDOWN.md](PRODUCT_BREAKDOWN.md) | Product scope and use cases |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

---

## Known limitations

* Node execution within a workflow run is sequential (in topological order), not parallelized.
* No conditional/branching/data-transform node types — only `trigger`, `ai`, `http`, `email`, `slack`.
* Only Slack is implemented as a third-party integration node; there is no Gmail, Google Sheets, or Telegram support.
* No automated test suite yet.

## License

No license has been chosen yet — treat this repository as all-rights-reserved until a LICENSE file is added.
