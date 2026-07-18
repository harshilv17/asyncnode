# AsyncNode — Server (Docker)

Express API + BullMQ workers for AsyncNode.

See the [root README](../../README.md) for the full project overview.

### Building and running with Docker Compose

From the repo root:

```bash
docker compose -f docker/docker-compose.yml up --build
```

This starts the `server`, `web`, and `redis` services. PostgreSQL is not included — point `DATABASE_URL` at an external instance (e.g. [Neon](https://neon.tech)).

The API is available at [http://localhost:8080](http://localhost:8080) (`PORT` in `.env`). Swagger UI is at `/api/docs`.

### Building the server image standalone

```bash
docker build -t asyncnode-server .
```

If your cloud uses a different CPU architecture than your development machine (e.g. Mac M1 vs. amd64), build for that platform:

```bash
docker build --platform=linux/amd64 -t asyncnode-server .
```

### References

* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
