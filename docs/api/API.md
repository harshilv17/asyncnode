# API.md

# AsyncNode REST API Reference

Base URL: `http://localhost:8080/api/v1`

Interactive docs: `http://localhost:8080/api/docs` (Swagger UI, generated from JSDoc annotations on the auth and workflow routes)

All responses follow a consistent envelope:

**Success**
```json
{
  "success": true,
  "status": 200,
  "message": "...",
  "data": {},
  "request": { "ip": "...", "method": "GET", "url": "..." }
}
```

**Error**
```json
{
  "success": false,
  "status": 400,
  "message": "...",
  "data": null,
  "trace": null,
  "request": { "ip": "...", "method": "POST", "url": "..." }
}
```

Authentication uses **httpOnly cookies** (`accessToken`, `refreshToken`). Protected routes require a valid `accessToken` cookie — no Authorization header.

Rate limits: a global limiter of 100 requests / 15 minutes per IP applies to all `/api` routes; auth endpoints (`signup`, `signin`, `verify/send`, `verify/confirm`) are additionally limited to 10 requests / 15 minutes per IP; `POST /workflows/:workflowId/run` has its own dedicated rate limiter.

---

## Auth (`/auth`)

### POST /auth/signup

Register a new user.

**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**

| Status | Description |
|--------|-------------|
| 201 | User created successfully |
| 400 | Missing name, email, or password / user already exists |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

### POST /auth/signin

Sign in and receive httpOnly cookies.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**

| Status | Description |
|--------|-------------|
| 200 | Signed in — sets `accessToken` (15m) and `refreshToken` (7d) cookies |
| 400 | Missing email or password |
| 401 | User not found or invalid password |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

### POST /auth/signout

Clear auth cookies and invalidate the refresh token in the database.

| Status | Description |
|--------|-------------|
| 200 | Signed out successfully |
| 500 | Internal server error |

---

### POST /auth/token/refresh

Exchange a valid `refreshToken` cookie for a new `accessToken` cookie.

| Status | Description |
|--------|-------------|
| 200 | Access token refreshed |
| 401 | Missing or invalid refresh token |
| 500 | Internal server error |

---

### POST /auth/verify/send

Send an email verification code to the authenticated user. Requires `accessToken` cookie.

| Status | Description |
|--------|-------------|
| 200 | Verification email sent |
| 401 | Unauthorized |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

### POST /auth/verify/confirm

Confirm an email verification code. Requires `accessToken` cookie.

| Status | Description |
|--------|-------------|
| 200 | Email verified |
| 400 | Invalid or expired code |
| 401 | Unauthorized |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

### GET /auth/me

Return the authenticated user's profile. Requires `accessToken` cookie.

| Status | Description |
|--------|-------------|
| 200 | User object |
| 401 | Unauthorized |

---

## Workflows (`/workflows`)

All workflow routes require authentication (`accessToken` cookie). Note the doubled path segment (`/workflows/workflows`) — the router is mounted at `/api/v1/workflows` and each route additionally starts with `/workflows`.

### GET /workflows/workflows

Get all workflows belonging to the authenticated user.

**Response data**
```json
[
  {
    "id": 1,
    "userId": 42,
    "name": "My Workflow",
    "description": "Automates data processing",
    "graphJson": null,
    "status": "draft",
    "scheduleEnabled": false,
    "scheduleIntervalSeconds": null,
    "createdAt": "2026-06-20T10:00:00.000Z",
    "updatedAt": "2026-06-20T10:00:00.000Z"
  }
]
```

| Status | Description |
|--------|-------------|
| 200 | Array of workflow objects |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### GET /workflows/workflows/:workflowId

Get a single workflow by ID.

| Status | Description |
|--------|-------------|
| 200 | Workflow object |
| 400 | Invalid workflow ID (non-numeric) |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### POST /workflows/workflows

Create a new workflow.

**Body**
```json
{
  "name": "My Workflow",
  "description": "Automates data processing"
}
```

| Status | Description |
|--------|-------------|
| 201 | Workflow created — returns the new workflow object |
| 400 | Missing name or description |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### DELETE /workflows/workflows/:workflowId

Delete a workflow owned by the authenticated user.

| Status | Description |
|--------|-------------|
| 200 | Workflow deleted |
| 400 | Invalid workflow ID |
| 401 | Unauthorized |
| 403 | Not the workflow owner |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### PUT /workflows/workflows/:workflowId

Save a workflow's graph (nodes and edges). Syncs the `triggers` and `integrations` tables to match the trigger/integration nodes present in the graph.

**Body**
```json
{
  "graphJson": {
    "nodes": [],
    "edges": []
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Workflow saved |
| 400 | Invalid workflow ID or graph payload |
| 401 | Unauthorized |
| 403 | Not the workflow owner |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### POST /workflows/workflows/:workflowId/run

Manually run a workflow. Builds the executable node graph from `graphJson` plus each node's trigger/integration config, then queues it via BullMQ. Subject to a dedicated rate limiter.

| Status | Description |
|--------|-------------|
| 200 | Run started — returns the built `{ nodes, edges }` graph |
| 400 | Invalid workflow ID |
| 401 | Unauthorized |
| 403 | Not the workflow owner |
| 404 | Workflow not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

### POST /workflows/workflows/:workflowId/schedule/start

Enable the workflow's interval schedule (`scheduleEnabled = true`) and register a repeatable BullMQ job at `scheduleIntervalSeconds`.

| Status | Description |
|--------|-------------|
| 200 | Schedule started |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### POST /workflows/workflows/:workflowId/schedule/stop

Disable the workflow's interval schedule and remove its repeatable BullMQ job.

| Status | Description |
|--------|-------------|
| 200 | Schedule stopped |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### GET /workflows/workflows/:workflowId/triggers

List the trigger rows configured for a workflow (manual/webhook/cron), including `webhookToken` for webhook triggers.

| Status | Description |
|--------|-------------|
| 200 | Array of trigger objects |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

## Executions (`/workflows`)

Mounted under the same `/api/v1/workflows` prefix as the workflow routes above. All require authentication.

### GET /workflows/workflows/:workflowId/executions

List all executions for a workflow, most recent first.

| Status | Description |
|--------|-------------|
| 200 | Array of execution objects |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### GET /workflows/workflows/:workflowId/executions/latest

Get the most recent execution for a workflow.

| Status | Description |
|--------|-------------|
| 200 | Execution object |
| 401 | Unauthorized |
| 404 | Workflow or execution not found |
| 500 | Internal server error |

---

### GET /workflows/workflows/:workflowId/executions/:executionId

Get full detail for one execution, including its `node_execution` rows and `execution_logs`.

| Status | Description |
|--------|-------------|
| 200 | Execution detail object |
| 400 | Invalid execution ID |
| 401 | Unauthorized |
| 404 | Execution not found |
| 500 | Internal server error |

---

## Webhooks (`/webhooks`)

Public — no authentication required. Used to trigger a workflow externally via its webhook trigger's unique token.

### POST /webhooks/:token

Look up the trigger by `webhookToken`, then queue an execution of its parent workflow. Any JSON body sent is passed through as the trigger node's input.

| Status | Description |
|--------|-------------|
| 200 | Execution queued |
| 404 | No trigger found for this token |
| 500 | Internal server error |

---

## Realtime events (Socket.IO)

Not part of the REST API, but emitted by the server during execution (`ws/executionSocket.ts`) for clients subscribed to a workflow/execution room:

| Event | Payload | When |
|-------|---------|------|
| `execution:started` | `{ executionId, workflowId }` | Execution begins |
| `node:running` | `{ executionId, nodeId }` | A node starts executing |
| `node:success` | `{ executionId, nodeId, output }` | A node completes successfully |
| `node:failed` | `{ executionId, nodeId, error }` | A node fails |
| `execution:finished` | `{ executionId, status }` | Execution completes (`completed` or `failed`) |

---

## Enums

**Workflow status** (`workflow_status`): `draft`, `active`, `completed`

**Execution / node execution status** (`status_enum`): `pending`, `running`, `completed`, `failed`

**Node types**: `trigger`, `ai`, `http`, `email`, `slack`

**Trigger types**: `manual`, `webhook`, `cron`
