# n8n-nodes-mainwp

An [n8n](https://n8n.io) community node package for the
[MainWP Dashboard](https://mainwp.com) REST API v2. MainWP is a self-hosted
WordPress management dashboard; this package lets n8n workflows manage your
connected child sites — sites, clients, tags, updates, costs, posts, pages,
users, uptime monitors and Dashboard settings — plus a trigger node for
reacting to Dashboard events.

Built against the official OpenAPI contract pinned at MainWP Dashboard
**6.1.5** (see [docs/openapi.yaml](docs/openapi.yaml) and
[docs/API.md](docs/API.md)).

## Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Credentials](#credentials)
- [Nodes and operations](#nodes-and-operations)
- [The trigger node polls — there are no webhooks](#the-trigger-node-polls--there-are-no-webhooks)
- [Things to know before wiring workflows](#things-to-know-before-wiring-workflows)
- [Example workflows](#example-workflows)
- [What is deliberately not included](#what-is-deliberately-not-included)

## Installation

### Community-node UI (recommended, self-hosted n8n)

1. In n8n go to **Settings > Community Nodes > Install**.
2. Enter `n8n-nodes-mainwp` and confirm the risk prompt.
3. The **MainWP** and **MainWP Trigger** nodes appear in the node panel.

### Manual install

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-mainwp
```

Restart n8n afterwards.

## Prerequisites

- A self-hosted **MainWP Dashboard** (the WordPress site running the MainWP
  Dashboard plugin), reachable from your n8n instance.
- WordPress on the Dashboard site must **not** use plain permalinks
  (Settings > Permalinks must not be "Plain"), or the `/wp-json/...` REST
  routes will not resolve and every call returns 404 `rest_no_route`.

## Credentials

Create a **MainWP API** credential in n8n:

| Field | Value |
|---|---|
| Dashboard URL | The WordPress site running the Dashboard, e.g. `https://dashboard.example.com`. No path, no `/wp-json`. |
| API Key | A REST API v2 key from **MainWP Dashboard > API Access > API Keys**. |

When creating the key in MainWP:

- **The key is shown once and cannot be recovered later.** Store it in the n8n
  credential immediately; if lost, create a new key.
- **Choose the scope deliberately.** `Read` covers all GET operations;
  `Write & Delete` is needed for everything else. A key grants control over
  every WordPress site connected to the Dashboard — use a Read-scope key for
  read-only workflows.
- A key with the wrong scope returns **401**, the same status as an invalid
  key. If you get 401 on a write operation with a key that works for reads,
  the scope is the problem.

The credential test calls `GET /sites/count`, which needs only Read scope.

## Nodes and operations

### MainWP (action node)

118 operations across 11 resources, generated from the pinned spec. The full
verb/path mapping is in [docs/API.md](docs/API.md).

| Resource | Operations |
|---|---|
| Site | Get Many, Get Many (Basic), Count, Get, Add, Update, Remove, Sync, Sync All, Check, Check All, Reconnect, Disconnect, Suspend, Unsuspend, Get Plugins, Get Abandoned Plugins, Activate/Deactivate/Delete Plugins, Get Themes, Get Abandoned Themes, Activate Theme, Delete Themes, Get Security, Get Non-MainWP Changes, Get Client, Get Costs |
| Client | Get Many, Count, Get, Add, Update, Remove, Suspend, Unsuspend, Get Sites, Count Sites, Get Costs, Get Fields, Add Field, Update Field, Delete Field |
| Tag | Get Many, Get, Add, Update, Remove, Get Sites, Get Clients |
| Update | Get Many, Get for Site, Run All, Run for Site, Update Core/Plugins/Themes/Translations, Get Ignored, Get Ignored for Site, Ignore Core/Plugins/Themes |
| Cost | Get Many, Get, Add, Update, Remove, Get Sites, Get Clients |
| Post | Get Many, Get, Create, Update, Update Status, Delete |
| Page | Get Many, Get, Create, Update, Update Status, Delete |
| User | Get Many, Create, Import (CSV), Update Admin Password, Update, Delete |
| Monitor | Get Many, Get Many (Basic), Count, Get, Get Basic, Check, Get Heartbeat, Get Incidents, Count Incidents, Update Settings, Update Global Settings |
| Settings | Get/Update General, Advanced, Tools, Monitoring, Cost Tracker; Get Emails, Update Email; Destroy Sessions, Disconnect All Sites, Renew Connections (each with a job-status poll) |
| Batch | Run (grouped actions across the sites, clients, updates, costs and tags controllers — default limit 100 items across all groups) |

Site, client and tag pickers are searchable dropdowns; where the API accepts
an ID **or** a domain/email, the picker has From List / By ID / By Domain
(or By Email) modes.

### MainWP Trigger (polling)

Events: **Updates Available** (filterable by type and site), **Site Status
Changed**, **Monitor Incident**, **New Non-MainWP Change**, **New Client**,
**New Site**. On the first poll after activation the node records the current
state and emits nothing, so enabling a workflow does not flood it with
historical items.

## The trigger node polls — there are no webhooks

MainWP REST API v2 has no outgoing webhooks or event subscriptions, so the
trigger node polls the Dashboard on the schedule you configure. It is not
broken when events arrive late — tighten the poll interval instead.

## Things to know before wiring workflows

- **Some failures come back inside HTTP 200.** MainWP reports certain failed
  actions as `success: 0` in a 200 response. This package treats that as an
  error everywhere, so a red node means failure even when the HTTP layer said
  OK.
- **Sync and update runs may be queued.** `Site > Sync/Sync All` and
  `Update > Run All/Run for Site` can return a queued job
  (`job_id`, `queued_count`) instead of doing the work inline. A green node
  then means *queued*, not *done* — and the job status is only exposed through
  the WordPress Abilities API with WordPress authentication, so **this node
  cannot poll those jobs**. Plan workflows accordingly (e.g. re-check update
  counts on a later schedule).
- **Tools jobs are pollable.** Settings > Destroy Sessions / Disconnect All
  Sites / Renew Connections return a job ID with a matching Get …Status
  operation.
- **Destructive operations are real.** Site Remove, Disconnect, plugin/theme
  Delete, User Delete and the Settings tools jobs act immediately on live
  production WordPress sites and cannot be undone. The field descriptions
  carry warnings; there is no extra confirmation step.
- **Pagination is per-route.** List operations expose Return All / Limit only
  where the API actually paginates; the others state in their description
  that the full set is returned.

## Example workflows

### Nightly: run pending plugin updates and post a summary to Slack

1. **Schedule Trigger** — every night at 02:00.
2. **MainWP: Update > Get Many** with Type = Plugin — the pending plugin
   updates across all connected sites.
3. **IF** — stop when nothing is pending.
4. **MainWP: Update > Run All** with Type = Plugin — starts the updates.
   Remember: the response may be a queued job, not a completion report.
5. **Slack** — post the list from step 2 as "updates started" summary.
6. (Optional) A second scheduled workflow an hour later re-runs
   **Update > Get Many** and posts what is still pending — that is your
   completion check, since queued jobs cannot be polled.

### Weekly: export a site + client inventory to a spreadsheet

1. **Schedule Trigger** — Mondays at 07:00.
2. **MainWP: Site > Get Many** (Return All, With Tags on).
3. **MainWP: Client > Get Many** (Return All).
4. **Merge** — join sites to clients on `client_id`.
5. **Google Sheets / Excel** — append or replace the inventory sheet.

## What is deliberately not included

- **API key management** (`/rest-api/*` routes): a node that can mint
  credentials for itself is a footgun. Excluded on purpose.
- **Extension-gated resources** (Comments, Time Tracker, Lighthouse,
  SSL Monitor, Domain Monitor, Pro Reports): these need paid MainWP
  extensions on the Dashboard and return 404 without them. Deferred — see
  [docs/ROADMAP.md](docs/ROADMAP.md).
- **v1 legacy authentication** (consumer key + secret): only v2 bearer keys
  are supported.
- **Plain-permalink fallback** (`?rest_route=...`): pretty permalinks are a
  documented prerequisite instead (see
  [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md)).

## Maintenance

The node is generated against the spec pinned in
[docs/openapi.yaml](docs/openapi.yaml) (`info.version` 6.1.5, fetched
2026-08-19). When MainWP ships a new Dashboard version: re-fetch the spec,
diff against the pinned copy, update [docs/api-inventory.json](docs/api-inventory.json)
and [docs/API.md](docs/API.md), then adjust operations.

## License

[MIT](LICENSE)
