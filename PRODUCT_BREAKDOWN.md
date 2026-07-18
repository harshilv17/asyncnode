# PRODUCT_BREAKDOWN.md

# AsyncNode Product Breakdown

> This document describes the product as currently implemented, plus near-term direction. Anything not reflected in the codebase today is called out explicitly rather than presented as done.

## Core Users

### 1. Individual Developers

**Primary Goal:**
Build and automate personal workflows without writing custom backend systems.

**Needs:**

* Create workflows quickly using a visual builder
* Test workflows safely
* Connect APIs and external services
* Debug workflow failures
* Monitor execution results

---

### 2. AI Builders

**Primary Goal:**
Create AI-powered workflows using one or more AI provider nodes.

**Needs:**

* Use different AI providers (OpenAI, Anthropic, Groq) as workflow nodes
* Chain AI nodes together in a graph, passing output from one to the next
* Debug what each node actually received and returned

Note: there is no dedicated "agent" abstraction, shared context object, or structured-output enforcement today — an AI node is a graph node like any other, wired up via edges.

---

### 3. Teams & Organizations

**Primary Goal:**
Automate business processes.

**Needs:**

* Reliable workflow execution
* Visibility into workflow activity
* Execution history

Note: there is currently no multi-user workspace, sharing, or role-based access model — each workflow belongs to a single owning user.

---

# Main Workflows

## Workflow 1: Create and Execute a Workflow

1. User creates a new workflow.
2. User adds nodes to the canvas.
3. User connects nodes using edges.
4. User configures node settings.
5. User saves workflow.
6. User manually triggers execution.
7. Execution engine runs workflow.
8. User views execution results and logs.

---

## Workflow 2: Webhook-Triggered Automation

1. User creates a workflow with a webhook trigger.
2. Platform generates a unique webhook URL.
3. External application sends HTTP request.
4. Workflow execution is created.
5. Workflow processes incoming data.
6. Actions execute downstream.
7. Results are logged and stored.

Example:

Form Submission
→ Webhook Trigger
→ AI Analysis
→ Slack Notification

---

## Workflow 3: Scheduled Workflow

1. User creates workflow.
2. User configures schedule.
3. Scheduler activates workflow automatically.
4. Execution engine processes workflow.
5. Results are stored.
6. User reviews execution history.

Example:

Every Day 9 AM
→ Generate Report
→ AI Summary
→ Email Report

---

## Workflow 4: Chained AI Nodes

1. User creates a workflow with multiple AI nodes in sequence.
2. First AI node runs and produces output.
3. That output is passed as input to the next node in the graph.
4. Final node's output is sent to an external service (e.g. Slack or HTTP).
5. Full execution history — every node's input/output — is recorded.

Example:

AI Node (summarize)
→ AI Node (classify)
→ Slack Notification

This is graph-based chaining of individual nodes, not a distinct "multi-agent" runtime.

---

## Workflow 5: Failure Visibility

1. Workflow execution starts.
2. Some nodes complete successfully.
3. A node fails due to an API or AI error.
4. The failure is recorded on that node's `node_execution` row and the execution is marked `failed`.
5. User inspects the failure via the execution detail view.
6. User can re-run the workflow manually.

Note: there is no automatic retry or resume-from-failure today — a failed execution must be re-triggered from the start; BullMQ's own job-level retry primitives are available but not currently wired into workflow-level retry logic.

---

# Important Product Problems

## 1. Workflow Execution Engine

The platform executes workflows as real backend processes rather than visual diagrams, by resolving the saved graph into a run order and executing nodes against it.

Current implementation: dependency resolution via topological sort, executed **sequentially** (parallel execution of independent branches is not implemented).

---

## 2. Execution State Persistence

Execution progress is persisted to PostgreSQL as it happens (`execution` and `node_execution` rows), so execution history survives server restarts. There is no automatic resume of an in-flight execution after a crash — a failed/interrupted run must be re-triggered.

---

## 3. Data Transfer Between Nodes

Node outputs are passed to downstream nodes as JSON along graph edges. There is no schema validation or type enforcement on this data today beyond what each node's executor expects.

---

## 4. Trigger Management

Three trigger types are supported:

* Manual triggers
* Scheduled (interval-based) triggers, backed by BullMQ repeatable jobs
* Webhook triggers, identified by a unique per-trigger token

There is no generic "external event" trigger beyond webhooks, and no built-in duplicate-delivery protection on webhook calls.

---

## 5. Failure Visibility

Requirements met today:

* Preserve execution state on failure (via `node_execution`/`execution` status)
* Store completed node outputs even if a later node fails
* Surface errors per node (stored in `node_execution.output_json`)

Not implemented: automatic retry of a failed workflow run.

---

## 6. Monitoring and Observability

Available today:

* Execution history (list + detail endpoints)
* Node inputs/outputs per run
* Execution status and timestamps
* Real-time status via Socket.IO

---

## 7. Scalability

No load testing or scale targets have been established yet. The architecture (Postgres + Redis/BullMQ, stateless API layer) is intended to allow horizontal scaling of the API and worker later, but the worker currently runs in-process with the API rather than as an independently scaled deployment.

---

# Not Currently Implemented

These are explicitly out of scope for the current codebase — not planned for the immediate next iteration, and shouldn't be assumed present when integrating or contributing:

## Integrations

Only three node types touch external services today: **Slack**, **email (SMTP)**, and generic **HTTP requests**, plus the three AI providers (OpenAI, Anthropic, Groq). There is no Gmail, Google Sheets, or Telegram integration, and no integration marketplace.

## Workflow Logic

No conditional branching, parallel-path routing, or data-transformation node types — the graph is a plain DAG of the five node types (`trigger`, `ai`, `http`, `email`, `slack`).

## Collaboration

No multi-user workspaces, sharing, roles, or permissions. Each workflow belongs to exactly one user.

## Marketplace

No public workflow or node template marketplace.

## Enterprise Features

No billing, subscriptions, or multi-tenant controls.

## Mobile Applications

Web only.

## Automatic Retry / Resume

No automatic retry of a failed execution or resume of an interrupted one — re-triggering is manual.

---

# Product Understanding Summary

AsyncNode is not a diagram editor — workflows saved in the builder actually execute as backend jobs, with real state persisted per node and per run.

It is, today, a single-user, single-process workflow execution platform: one Express API (with an in-process BullMQ worker) backed by Postgres and Redis. The near-term engineering focus is hardening that execution path (retries, parallel branch execution, splitting the worker out) rather than adding new integrations or collaboration features.
