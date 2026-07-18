# Contributing to AsyncNode

Thanks for your interest in contributing. This is a young project — expect rough edges, and feel free to open an issue before starting large changes so we can align on direction first.

## Project layout

```
app/server/   Express API + BullMQ workers (Node.js, TypeScript, Drizzle ORM)
app/web/      Next.js frontend (React Flow workflow builder)
docs/         Architecture, API, database, and decision docs
docker/       docker-compose for local dev
```

See the [README](README.md) for what's actually implemented, and [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) for how the pieces fit together.

## Getting set up

Follow the "Running locally" section of the [README](README.md#running-locally). You'll need a PostgreSQL database (e.g. Neon) and Redis.

## Making changes

1. Fork the repo and create a branch off `main` (or `development`, whichever the maintainers indicate is the current integration branch).
2. Keep changes scoped — a bug fix shouldn't also refactor unrelated code.
3. If you change the database schema, generate a migration:
   ```bash
   cd app/server
   npm run db:generate
   ```
4. If you add or change an API route, keep the Swagger JSDoc annotations (see existing routes in `app/server/src/modules/*/*.route.ts`) and update [docs/api/API.md](docs/api/API.md) to match.
5. If you change a Drizzle schema file, update [docs/database/DATABASE.md](docs/database/DATABASE.md) to match — it should always reflect what's actually in `app/server/src/db/schemas/`.

There is currently no automated test suite. Manually verify your change against the running app (both `app/server` and `app/web`) before opening a PR, and describe how you tested it in the PR description.

## Commit / PR conventions

* Write commit messages that describe the change, not the process (`fix: handle missing webhook token` rather than `updated file`).
* Reference any related issue in the PR description.
* Keep PRs focused on one thing — separate unrelated fixes into separate PRs.

## Reporting bugs / requesting features

Open a GitHub issue with:
* What you expected to happen vs. what actually happened
* Steps to reproduce (for bugs)
* Relevant logs or screenshots

## Questions

If something in the docs doesn't match the code, that's a documentation bug — please open an issue or PR to fix it. Accuracy of `docs/` against the actual implementation is treated as seriously as code correctness in this project.
