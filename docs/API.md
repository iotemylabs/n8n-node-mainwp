# MainWP Dashboard REST API v2 — Operation Inventory

> **Pinned contract.** Generated from [`docs/openapi.yaml`](./openapi.yaml) — do not edit the tables by hand.
>
> | | |
> |---|---|
> | Spec version (`info.version`) | **6.1.5** |
> | OpenAPI version | 3.1.0 |
> | Fetched | 2026-08-19 from https://raw.githubusercontent.com/mainwp/docs/main/api-reference/openapi.yaml |
> | SHA-256 | `e5cd083e708d035637cda9f9954b0a3611e13b9943c5eee86f6e98edcadffc2e` |
> | Paths / operations | 171 paths, 277 operations, **171 canonical actions** after verb-alias dedup |

## How to read this document

Every route in the spec appears exactly once below, under its spec tag, listed by its **canonical verb**.
Most write routes are registered under two or three verbs (typically POST/PUT/PATCH with identical
semantics); the *Aliases* column records the other verbs the Dashboard accepts. Canonical verb
selection rule: `GET > DELETE > POST > PUT > PATCH`.

- **v1** — whether version 1 of the n8n node exposes the route (✅) or deliberately skips it (❌, with the reason).
- **Operation** — the `resource.operation` name in the node for exposed routes.
- **Scope** — the API-key scope the route needs: **Read** for GET, **Write & Delete** for everything else. A key without the right scope gets a 401, indistinguishable from a bad key.
- **Pagination** — the paging contract of that route and nothing else. Pagination is per-route in this API; routes marked — return the full set in one response.

All paths below are relative to `/wp-json/mainwp/v2` on the WordPress site running the MainWP Dashboard.
Auth on every route: `Authorization: Bearer <api key>`.

## Spec quirks confirmed during ingestion (they shape the node design)

1. **Verb aliases.** 277 spec operations collapse to 171 distinct actions — every multi-verb path is one action registered under 2–3 verbs with byte-identical summary, body, and responses. The node exposes one operation per action.
2. **Success envelope with non-standard semantics.** The standard envelope is `{ success: 0|1, message, data, total, pages }`. The spec states: *"Some routes report a failed action as 0 inside an HTTP 200 response."* The node treats `success: 0` as an error in one shared unwrapper.
3. **Queued vs inline work.** `POST /sites/sync`, `POST /sites/{id_domain}/sync`, `POST /updates/update`, and `POST /updates/{id_domain}/update` may return a **QueuedAction** (`job_id`, `queued_count`, `total`) instead of doing the work inline. Confirmed from the schema description: job status is exposed **only** through the `mainwp/get-batch-job-status-v1` ability on the WordPress Abilities API, which uses WordPress authentication — **no v2 REST route serves it**, so the node cannot poll these jobs with the MainWP API key. The node returns the QueuedAction as-is and says so in the operation description.
4. **Tools jobs are pollable, batch jobs are not.** `settings/tools/destroy-sessions`, `disconnect-all-sites`, and `renew-connections` each return a job-started payload and have a matching `.../{id}-status` GET route returning **ToolJobStatus** (`status`, `total`, `processed`, `failed`, `progress`, `errors`, `completed_at`). These three are the only pollable jobs in the API.
5. **Polymorphic path parameters.** `{id_domain}` = site ID or domain; `{id_email}` = client ID or email; `{id_name}` = client-field ID or name. The node uses resourceLocators with From list / By ID / By domain (or email/name) modes.
6. **Pagination is per-route.** Only 15 of 171 routes take `page`/`per_page` (see the tables). `GET /updates` has **no pagination at all** (only `type`/`search`/`include`/`exclude`). Posts/pages/comments listing routes use a `maximum` cap instead of paging. The paginator is driven by the inventory, per operation. Note: `GET /clients/fields` declares `pre_page` where every other route says `per_page` — recorded in OPEN_QUESTIONS to verify against a live Dashboard.
7. **Extension-gated routes.** 31 canonical actions across 6 tags carry `x-requires-extension` (MainWP Comments ×4, Time Tracker ×16, Lighthouse ×4, SSL Monitor ×3, Domain Monitor ×3, Pro Reports ×1). On a Dashboard without the extension these return 404 `rest_no_route`. **All six are deferred to the roadmap for v1** (rationale below).
8. **Batch limits.** `POST /batch` runs grouped actions across the sites, clients, updates, costs, and tags controllers; the spec confirms *"the default limit is 100 items across all groups."* Per-controller `/batch` routes also exist for sites, clients, costs, and tags (not updates). Response is **BatchResult**: per-item results keyed by action group; failed items carry an `error` object in place of the record.
9. **Bulk results skip the envelope.** **BulkSiteResult** is `{ total, data }` keyed by site ID, with **no `success` key** (stated in the schema description). The unwrapper must not assume the envelope; it passes BulkSiteResult, ToolJobStatus, and BatchResult through unchanged.
10. **No webhooks.** Zero occurrences of webhook/callback/event-subscription mechanisms in the spec (the only "subscri" hits are the cost-tracker `subscription` product type and the WordPress `subscriber` role). **The trigger node must poll.**

## v1 scope decisions

- **Exposed: 118 actions** across 11 resources (Site, Client, Tag, Update, Cost, Post, Page, User, Monitor, Settings, Batch).
- **Skipped: 53 actions**, each with its reason inline. The recurring reasons:
  - *Extension-gated (31)* — untestable without the paid extension installed on the target Dashboard, and 6 extra resources would double the UI surface. Listed in `docs/ROADMAP.md` for v2.
  - *API Keys (4)* — deliberately excluded: a node that can mint credentials for itself is a footgun.
  - *Per-controller batch (4)* — the global `POST /batch` covers the same action groups; one Batch resource keeps the UI coherent.
  - *Fleet-wide disconnect/reconnect (2)* — the equivalent tools jobs (`settings.disconnectAllSites`, `settings.renewConnections`) return a pollable job ID; the `/sites/disconnect` and `/sites/reconnect` variants return an unpollable bulk blob. One way to do a dangerous thing.
  - *Niche settings surface (11)* — API-backup providers, Dashboard Insights, cost-tracker payment methods and product types, clear-activation-data, restore-info-messages. Roadmap.

## Operation tables

### Sites

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `site.getAll` | GET | `/sites` | — | Read | page + per_page | List sites |
| ✅ | `site.add` | POST | `/sites/add` | — | Write & Delete | — | Add a site |
| ✅ | `site.getAllBasic` | GET | `/sites/basic` | — | Read | page + per_page | List sites with basic fields |
| ❌ | per-controller batch — the global POST /batch covers the same groups; one Batch resource in v1 | POST | `/sites/batch` | PUT, PATCH | Write & Delete | — | Batch create, update, and delete sites. returns **BatchResult** keyed by action group |
| ✅ | `site.checkAll` | POST | `/sites/check` | PUT, PATCH | Write & Delete | — | Check all sites. returns **BulkSiteResult** (no `success` envelope) |
| ✅ | `site.count` | GET | `/sites/count` | — | Read | — | Count sites |
| ❌ | fleet-wide disconnect — use settings.disconnectAllSites, which returns a pollable job instead of an unpageable bulk result | POST | `/sites/disconnect` | PUT, PATCH | Write & Delete | — | Disconnect all sites. returns **BulkSiteResult** (no `success` envelope); **destructive/irreversible** |
| ❌ | fleet-wide reconnect — use settings.renewConnections, which returns a pollable job | POST | `/sites/reconnect` | PUT, PATCH | Write & Delete | — | Reconnect all sites. returns **BulkSiteResult** (no `success` envelope) |
| ✅ | `site.syncAll` | POST | `/sites/sync` | PUT, PATCH | Write & Delete | — | Sync all sites. may return a **QueuedAction** (job queued, not confirmed done); returns **BulkSiteResult** (no `success` envelope) |
| ✅ | `site.get` | GET | `/sites/{id_domain}` | — | Read | — | Get one site |
| ✅ | `site.check` | POST | `/sites/{id_domain}/check` | PUT, PATCH | Write & Delete | — | Check one site |
| ✅ | `site.getClient` | GET | `/sites/{id_domain}/client` | — | Read | — | Get the client linked to a site |
| ✅ | `site.getCosts` | GET | `/sites/{id_domain}/costs` | — | Read | — | List costs linked to a site |
| ✅ | `site.disconnect` | POST | `/sites/{id_domain}/disconnect` | PUT, PATCH | Write & Delete | — | Disconnect one site. **destructive/irreversible** |
| ✅ | `site.update` | POST | `/sites/{id_domain}/edit` | PUT, PATCH | Write & Delete | — | Update a site |
| ✅ | `site.getNonMainWpChanges` | GET | `/sites/{id_domain}/non-mainwp-changes` | — | Read | page + per_page | List changes made outside MainWP |
| ✅ | `site.getPlugins` | GET | `/sites/{id_domain}/plugins` | — | Read | page + per_page | List plugins on a site |
| ✅ | `site.getAbandonedPlugins` | GET | `/sites/{id_domain}/plugins/abandoned` | — | Read | — | List abandoned plugins on a site |
| ✅ | `site.activatePlugins` | POST | `/sites/{id_domain}/plugins/activate` | PUT, PATCH | Write & Delete | — | Activate plugins on a site |
| ✅ | `site.deactivatePlugins` | POST | `/sites/{id_domain}/plugins/deactivate` | PUT, PATCH | Write & Delete | — | Deactivate plugins on a site |
| ✅ | `site.deletePlugins` | DELETE | `/sites/{id_domain}/plugins/delete` | — | Write & Delete | — | Delete plugins from a site. **destructive/irreversible** |
| ✅ | `site.reconnect` | POST | `/sites/{id_domain}/reconnect` | PUT, PATCH | Write & Delete | — | Reconnect one site |
| ✅ | `site.remove` | DELETE | `/sites/{id_domain}/remove` | — | Write & Delete | — | Remove a site from the Dashboard. **destructive/irreversible** |
| ✅ | `site.getSecurity` | GET | `/sites/{id_domain}/security` | — | Read | — | Get the security snapshot for a site |
| ✅ | `site.suspend` | POST | `/sites/{id_domain}/suspend` | PUT, PATCH | Write & Delete | — | Suspend one site |
| ✅ | `site.sync` | POST | `/sites/{id_domain}/sync` | PUT, PATCH | Write & Delete | — | Sync one site. may return a **QueuedAction** (job queued, not confirmed done) |
| ✅ | `site.getThemes` | GET | `/sites/{id_domain}/themes` | — | Read | page + per_page | List themes on a site |
| ✅ | `site.getAbandonedThemes` | GET | `/sites/{id_domain}/themes/abandoned` | — | Read | — | List abandoned themes on a site |
| ✅ | `site.activateTheme` | POST | `/sites/{id_domain}/themes/activate` | PUT, PATCH | Write & Delete | — | Activate a theme on a site |
| ✅ | `site.deleteThemes` | DELETE | `/sites/{id_domain}/themes/delete` | — | Write & Delete | — | Delete themes from a site. **destructive/irreversible** |
| ✅ | `site.unsuspend` | POST | `/sites/{id_domain}/unsuspend` | PUT, PATCH | Write & Delete | — | Unsuspend one site |

### Clients

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `client.getAll` | GET | `/clients` | — | Read | page + per_page | List clients |
| ✅ | `client.add` | POST | `/clients/add` | — | Write & Delete | — | Create a client |
| ❌ | per-controller batch — the global POST /batch covers the same groups; one Batch resource in v1 | POST | `/clients/batch` | PUT, PATCH | Write & Delete | — | Batch create, update, and delete clients. returns **BatchResult** keyed by action group |
| ✅ | `client.count` | GET | `/clients/count` | — | Read | — | Count clients |
| ✅ | `client.getFields` | GET | `/clients/fields` | — | Read | page + pre_page (spec typo?) | List client fields |
| ✅ | `client.addField` | POST | `/clients/fields/add` | — | Write & Delete | — | Create a client field |
| ✅ | `client.deleteField` | DELETE | `/clients/fields/{id_name}/delete` | — | Write & Delete | — | Delete a client field. **destructive/irreversible** |
| ✅ | `client.updateField` | PUT | `/clients/fields/{id_name}/edit` | PATCH | Write & Delete | — | Update a client field |
| ✅ | `client.get` | GET | `/clients/{id_email}` | — | Read | — | Get one client |
| ✅ | `client.getCosts` | GET | `/clients/{id_email}/costs` | — | Read | — | List client costs |
| ✅ | `client.update` | POST | `/clients/{id_email}/edit` | PUT, PATCH | Write & Delete | — | Update a client |
| ✅ | `client.remove` | DELETE | `/clients/{id_email}/remove` | — | Write & Delete | — | Delete a client. **destructive/irreversible** |
| ✅ | `client.getSites` | GET | `/clients/{id_email}/sites` | — | Read | — | List client sites |
| ✅ | `client.countSites` | GET | `/clients/{id_email}/sites/count` | — | Read | — | Count client sites |
| ✅ | `client.suspend` | POST | `/clients/{id_email}/suspend` | PUT, PATCH | Write & Delete | — | Suspend a client |
| ✅ | `client.unsuspend` | POST | `/clients/{id_email}/unsuspend` | PUT, PATCH | Write & Delete | — | Unsuspend a client |

### Tags

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `tag.getAll` | GET | `/tags` | — | Read | page + per_page | List tags |
| ✅ | `tag.add` | POST | `/tags/add` | — | Write & Delete | — | Create a tag |
| ❌ | per-controller batch — the global POST /batch covers the same groups; one Batch resource in v1 | POST | `/tags/batch` | PUT, PATCH | Write & Delete | — | Batch create, update, and delete tags. returns **BatchResult** keyed by action group |
| ✅ | `tag.get` | GET | `/tags/{id}` | — | Read | — | Get one tag |
| ✅ | `tag.getClients` | GET | `/tags/{id}/clients` | — | Read | — | List clients in a tag |
| ✅ | `tag.update` | POST | `/tags/{id}/edit` | PUT, PATCH | Write & Delete | — | Update a tag |
| ✅ | `tag.remove` | DELETE | `/tags/{id}/remove` | — | Write & Delete | — | Delete a tag. **destructive/irreversible** |
| ✅ | `tag.getSites` | GET | `/tags/{id}/sites` | — | Read | — | List sites in a tag |

### Updates

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `update.getAll` | GET | `/updates` | — | Read | — | List available updates |
| ✅ | `update.getIgnored` | GET | `/updates/ignored` | — | Read | — | List ignored updates |
| ✅ | `update.runAll` | POST | `/updates/update` | PUT, PATCH | Write & Delete | — | Run updates on all sites. may return a **QueuedAction** (job queued, not confirmed done) |
| ✅ | `update.getForSite` | GET | `/updates/{id_domain}` | — | Read | — | List available updates for one site |
| ✅ | `update.ignorePlugins` | POST | `/updates/{id_domain}/ignore/plugins` | PUT, PATCH | Write & Delete | — | Ignore plugin updates on one site |
| ✅ | `update.ignoreThemes` | POST | `/updates/{id_domain}/ignore/themes` | PUT, PATCH | Write & Delete | — | Ignore theme updates on one site |
| ✅ | `update.ignoreCore` | POST | `/updates/{id_domain}/ignore/wp` | PUT, PATCH | Write & Delete | — | Ignore the core update on one site |
| ✅ | `update.getIgnoredForSite` | GET | `/updates/{id_domain}/ignored` | — | Read | — | List ignored updates for one site |
| ✅ | `update.runForSite` | POST | `/updates/{id_domain}/update` | PUT, PATCH | Write & Delete | — | Run updates on one site. may return a **QueuedAction** (job queued, not confirmed done) |
| ✅ | `update.updatePlugins` | POST | `/updates/{id_domain}/update/plugins` | PUT, PATCH | Write & Delete | — | Update plugins on one site |
| ✅ | `update.updateThemes` | POST | `/updates/{id_domain}/update/themes` | PUT, PATCH | Write & Delete | — | Update themes on one site |
| ✅ | `update.updateTranslations` | POST | `/updates/{id_domain}/update/translations` | PUT, PATCH | Write & Delete | — | Update translations on one site |
| ✅ | `update.updateCore` | POST | `/updates/{id_domain}/update/wp` | PUT, PATCH | Write & Delete | — | Update WordPress core on one site |

### Costs

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `cost.getAll` | GET | `/costs` | — | Read | page + per_page | List costs |
| ✅ | `cost.add` | POST | `/costs/add` | PUT, PATCH | Write & Delete | — | Create a cost |
| ❌ | per-controller batch — the global POST /batch covers the same groups; one Batch resource in v1 | POST | `/costs/batch` | PUT, PATCH | Write & Delete | — | Batch create, update, and delete costs. returns **BatchResult** keyed by action group |
| ✅ | `cost.get` | GET | `/costs/{id}` | — | Read | — | Get one cost |
| ✅ | `cost.getClients` | GET | `/costs/{id}/clients` | — | Read | — | List clients linked to a cost |
| ✅ | `cost.update` | POST | `/costs/{id}/edit` | PUT, PATCH | Write & Delete | — | Update a cost |
| ✅ | `cost.remove` | DELETE | `/costs/{id}/remove` | — | Write & Delete | — | Delete a cost. **destructive/irreversible** |
| ✅ | `cost.getSites` | GET | `/costs/{id}/sites` | — | Read | — | List sites linked to a cost |

### Posts

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `post.getAll` | GET | `/posts` | — | Read | `maximum` cap only | List posts across sites |
| ✅ | `post.create` | POST | `/posts/{id_domain}/create` | — | Write & Delete | — | Create a post |
| ✅ | `post.get` | GET | `/posts/{id_domain}/{id_post}` | — | Read | — | Get one post |
| ✅ | `post.delete` | DELETE | `/posts/{id_domain}/{id_post}/delete` | — | Write & Delete | — | Delete a post. **destructive/irreversible** |
| ✅ | `post.update` | PUT | `/posts/{id_domain}/{id_post}/edit` | PATCH | Write & Delete | — | Update a post |
| ✅ | `post.updateStatus` | PUT | `/posts/{id_domain}/{id_post}/update-status` | PATCH | Write & Delete | — | Change post status |

### Pages

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `page.getAll` | GET | `/pages` | — | Read | `maximum` cap only | List pages across sites |
| ✅ | `page.create` | POST | `/pages/{id_domain}/create` | — | Write & Delete | — | Create a page |
| ✅ | `page.get` | GET | `/pages/{id_domain}/{id_page}` | — | Read | — | Get one page |
| ✅ | `page.delete` | DELETE | `/pages/{id_domain}/{id_page}/delete` | — | Write & Delete | — | Delete a page. **destructive/irreversible** |
| ✅ | `page.update` | PUT | `/pages/{id_domain}/{id_page}/edit` | PATCH | Write & Delete | — | Update a page |
| ✅ | `page.updateStatus` | PUT | `/pages/{id_domain}/{id_page}/update-status` | PATCH | Write & Delete | — | Change page status |

### Users

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `user.getAll` | GET | `/users` | — | Read | — | List users across sites |
| ✅ | `user.create` | POST | `/users/create` | — | Write & Delete | — | Create a user on selected sites |
| ✅ | `user.import` | POST | `/users/import` | — | Write & Delete | — | Import users from a CSV file. multipart/form-data CSV upload |
| ✅ | `user.updateAdminPassword` | PUT | `/users/update-admin-password` | PATCH | Write & Delete | — | Update administrator passwords |
| ✅ | `user.delete` | DELETE | `/users/{id_domain}/{user_id}/delete` | — | Write & Delete | — | Delete a user from one site. **destructive/irreversible** |
| ✅ | `user.update` | PUT | `/users/{id_domain}/{user_id}/edit` | PATCH | Write & Delete | — | Update a user on one site |

### Monitors

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `monitor.getAll` | GET | `/monitors` | — | Read | page + per_page | List monitors |
| ✅ | `monitor.getAllBasic` | GET | `/monitors/basic` | — | Read | page + per_page | List monitors with basic fields |
| ✅ | `monitor.count` | GET | `/monitors/count` | — | Read | — | Count monitors |
| ✅ | `monitor.updateGlobalSettings` | PUT | `/monitors/settings` | PATCH | Write & Delete | — | Update global monitor settings |
| ✅ | `monitor.get` | GET | `/monitors/{id_domain}` | — | Read | — | Get one monitor |
| ✅ | `monitor.getBasic` | GET | `/monitors/{id_domain}/basic` | — | Read | — | Get basic monitor details |
| ✅ | `monitor.check` | POST | `/monitors/{id_domain}/check` | — | Write & Delete | — | Run a monitor check now |
| ✅ | `monitor.getHeartbeat` | GET | `/monitors/{id_domain}/heartbeat` | — | Read | `limit` cap only | Get heartbeat history |
| ✅ | `monitor.getIncidents` | GET | `/monitors/{id_domain}/incidents` | — | Read | page + per_page | List monitor incidents |
| ✅ | `monitor.countIncidents` | GET | `/monitors/{id_domain}/incidents/count` | — | Read | page + per_page | Count monitor incidents |
| ✅ | `monitor.updateSettings` | PUT | `/monitors/{id_domain}/settings` | PATCH | Write & Delete | — | Update settings for one monitor |

### Settings

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `settings.getAdvanced` | GET | `/settings/advanced` | — | Read | — | Get Advanced settings |
| ✅ | `settings.updateAdvanced` | PUT | `/settings/advanced/edit` | PATCH | Write & Delete | — | Update Advanced settings |
| ❌ | niche settings surface — roadmap | GET | `/settings/api-backups` | — | Read | — | Get API backup provider settings |
| ❌ | niche settings surface — roadmap | PUT | `/settings/api-backups/{api_slug}/edit` | PATCH | Write & Delete | — | Update an API backup provider |
| ✅ | `settings.getCostTracker` | GET | `/settings/cost-tracker` | — | Read | — | Get Cost Tracker settings |
| ✅ | `settings.updateCostTracker` | PUT | `/settings/cost-tracker/edit` | PATCH | Write & Delete | — | Update Cost Tracker settings |
| ❌ | cost-tracker taxonomy management — roadmap | POST | `/settings/cost-tracker/payment-methods/add` | — | Write & Delete | — | Add a payment method |
| ❌ | cost-tracker taxonomy management — roadmap | DELETE | `/settings/cost-tracker/payment-methods/{slug}/delete` | — | Write & Delete | — | Delete a payment method. **destructive/irreversible** |
| ❌ | cost-tracker taxonomy management — roadmap | PUT | `/settings/cost-tracker/payment-methods/{slug}/edit` | PATCH | Write & Delete | — | Update a payment method |
| ❌ | cost-tracker taxonomy management — roadmap | POST | `/settings/cost-tracker/product-types/add` | — | Write & Delete | — | Add a product type |
| ❌ | cost-tracker taxonomy management — roadmap | DELETE | `/settings/cost-tracker/product-types/{slug}/delete` | — | Write & Delete | — | Delete a product type. **destructive/irreversible** |
| ❌ | cost-tracker taxonomy management — roadmap | PUT | `/settings/cost-tracker/product-types/{slug}/edit` | PATCH | Write & Delete | — | Update a product type |
| ❌ | niche settings surface — roadmap | GET | `/settings/dashboard-insights` | — | Read | — | Get Dashboard Insights settings |
| ❌ | niche settings surface — roadmap | PUT | `/settings/dashboard-insights/edit` | PATCH | Write & Delete | — | Update Dashboard Insights settings |
| ✅ | `settings.getEmails` | GET | `/settings/emails` | — | Read | — | Get email notification settings |
| ✅ | `settings.updateEmail` | PUT | `/settings/emails/{mail_type}/edit` | PATCH | Write & Delete | — | Update one email notification |
| ✅ | `settings.getGeneral` | GET | `/settings/general` | — | Read | — | Get General settings |
| ✅ | `settings.updateGeneral` | PUT | `/settings/general/edit` | PATCH | Write & Delete | — | Update General settings |
| ✅ | `settings.getMonitoring` | GET | `/settings/monitoring` | — | Read | — | Get monitoring settings |
| ✅ | `settings.updateMonitoring` | PUT | `/settings/monitoring/edit` | PATCH | Write & Delete | — | Update monitoring settings |
| ✅ | `settings.getTools` | GET | `/settings/tools` | — | Read | — | Get Tools settings |
| ❌ | irreversible niche maintenance action with no workflow value — roadmap | POST | `/settings/tools/clear-activation-data` | — | Write & Delete | — | Clear add-on activation data |
| ✅ | `settings.destroySessions` | POST | `/settings/tools/destroy-sessions` | — | Write & Delete | — | Start a destroy sessions job. **destructive/irreversible** |
| ✅ | `settings.getDestroySessionsStatus` | GET | `/settings/tools/destroy-sessions-status/{destroy_id}` | — | Read | — | Get destroy sessions job status. returns **ToolJobStatus**; **destructive/irreversible** |
| ✅ | `settings.disconnectAllSites` | POST | `/settings/tools/disconnect-all-sites` | — | Write & Delete | — | Start a disconnect all sites job. **destructive/irreversible** |
| ✅ | `settings.getDisconnectAllSitesStatus` | GET | `/settings/tools/disconnect-all-sites-status/{disconnect_id}` | — | Read | — | Get disconnect all sites job status. returns **ToolJobStatus**; **destructive/irreversible** |
| ✅ | `settings.updateTools` | PUT | `/settings/tools/edit` | PATCH | Write & Delete | — | Update Tools settings |
| ✅ | `settings.renewConnections` | POST | `/settings/tools/renew-connections` | — | Write & Delete | — | Start a renew connections job |
| ✅ | `settings.getRenewConnectionsStatus` | GET | `/settings/tools/renew-connections-status/{renew_id}` | — | Read | — | Get renew connections job status. returns **ToolJobStatus** |
| ❌ | niche maintenance action — roadmap | POST | `/settings/tools/restore-info-messages` | — | Write & Delete | — | Restore dismissed messages |

### Batch

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ✅ | `batch.run` | POST | `/batch` | PUT, PATCH | Write & Delete | — | Run grouped actions across controllers. returns **BatchResult** keyed by action group |

### API Keys

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | API key management excluded from v1 — a node that can mint credentials for itself is a footgun | POST | `/rest-api/add-key` | — | Write & Delete | — | Create an API key |
| ❌ | API key management excluded from v1 | DELETE | `/rest-api/delete-key/{key_identifier}` | — | Write & Delete | — | Delete an API key. **destructive/irreversible** |
| ❌ | API key management excluded from v1 | PUT | `/rest-api/edit-key/{key_identifier}` | PATCH | Write & Delete | — | Update an API key |
| ❌ | API key management excluded from v1 | GET | `/rest-api/keys` | — | Read | page + per_page | List API keys |

### Comments _(requires the MainWP Comments extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP Comments extension — deferred to roadmap | GET | `/comments` | — | Read | `maximum` cap only | List comments across sites |
| ❌ | requires the MainWP Comments extension — deferred to roadmap | GET | `/comments/{id_domain}` | — | Read | `maximum` cap only | List comments on one site |
| ❌ | requires the MainWP Comments extension — deferred to roadmap | PUT | `/comments/{id_domain}/bulk-action` | PATCH | Write & Delete | — | Act on several comments |
| ❌ | requires the MainWP Comments extension — deferred to roadmap | PUT | `/comments/{id_domain}/{id_comment}/action` | PATCH | Write & Delete | — | Act on one comment |

### Time Tracker _(requires the MainWP Time Tracker extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker` | — | Read | — | List time tracker tasks |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/buckets` | — | Read | — | List buckets |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/buckets/{id}` | — | Read | — | Get one bucket |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/clients` | — | Read | — | List Time Tracker clients |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/clients/{id_email}` | — | Read | — | Get one Time Tracker client |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/clients/{id_email}/buckets` | — | Read | — | List buckets for one client |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/clients/{id_email}/settings` | — | Read | — | Get Time Tracker settings for one client |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/clients/{id_email}/tasks` | — | Read | — | List tasks for one client |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/settings` | — | Read | — | Get Time Tracker settings |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/sites/{id_domain}/tasks` | — | Read | — | List tasks for one site |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | POST | `/time-tracker/tasks/add` | — | Write & Delete | — | Create a task |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | GET | `/time-tracker/tasks/{id}` | — | Read | — | Get one task |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | POST | `/time-tracker/tasks/{id}/edit` | PUT, PATCH | Write & Delete | — | Update a task |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | POST | `/time-tracker/tasks/{id}/pause` | PUT, PATCH | Write & Delete | — | Pause a task timer |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | POST | `/time-tracker/tasks/{id}/start` | PUT, PATCH | Write & Delete | — | Start a task timer |
| ❌ | requires the MainWP Time Tracker extension — deferred to roadmap | POST | `/time-tracker/tasks/{id}/stop` | PUT, PATCH | Write & Delete | — | Stop a task timer |

### Lighthouse _(requires the MainWP Lighthouse extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP Lighthouse extension — deferred to roadmap | POST | `/lighthouse/audit` | PUT, PATCH | Write & Delete | — | Run Lighthouse audits for all sites |
| ❌ | requires the MainWP Lighthouse extension — deferred to roadmap | POST | `/lighthouse/audit/{id_domain}` | PUT, PATCH | Write & Delete | — | Run a Lighthouse audit for one site |
| ❌ | requires the MainWP Lighthouse extension — deferred to roadmap | GET | `/lighthouse/results` | — | Read | — | List Lighthouse results for all sites |
| ❌ | requires the MainWP Lighthouse extension — deferred to roadmap | GET | `/lighthouse/results/{id_domain}` | — | Read | — | Get Lighthouse results for one site |

### SSL Monitor _(requires the MainWP SSL Monitor extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP SSL Monitor extension — deferred to roadmap | GET | `/ssl-monitor/info` | — | Read | — | List SSL status for all sites |
| ❌ | requires the MainWP SSL Monitor extension — deferred to roadmap | GET | `/ssl-monitor/info/{id_domain}` | — | Read | — | Get SSL status for one site |
| ❌ | requires the MainWP SSL Monitor extension — deferred to roadmap | POST | `/ssl-monitor/{id_domain}` | PUT, PATCH | Write & Delete | — | Run an SSL check for one site |

### Domain Monitor _(requires the MainWP Domain Monitor extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP Domain Monitor extension — deferred to roadmap | GET | `/domain-monitor/profiles` | — | Read | — | List domain profiles for all sites |
| ❌ | requires the MainWP Domain Monitor extension — deferred to roadmap | GET | `/domain-monitor/profiles/{id_domain}` | — | Read | — | Get the domain profile for one site |
| ❌ | requires the MainWP Domain Monitor extension — deferred to roadmap | POST | `/domain-monitor/{id_domain}` | PUT, PATCH | Write & Delete | — | Run a domain check for one site |

### Pro Reports _(requires the MainWP Pro Reports extension)_

| v1 | Operation | Verb | Path | Aliases | Scope | Pagination | Notes |
|----|-----------|------|------|---------|-------|------------|-------|
| ❌ | requires the MainWP Pro Reports extension — deferred to roadmap | GET | `/pro-reports/{id_domain}/{report}` | — | Read | — | Get one Pro Reports data set |
