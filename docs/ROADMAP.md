# Roadmap

Deliberately deferred from v1. Everything here exists in the pinned spec
([openapi.yaml](./openapi.yaml), MainWP Dashboard 6.1.5) and is inventoried in
[API.md](./API.md) with the skip reason inline.

## Extension-gated resources (31 actions)

Each of these requires a paid MainWP extension on the Dashboard; without it the
routes return 404 `rest_no_route`. They were deferred because they cannot be
tested without the extensions and six extra resources would double the v1 UI
surface.

| Resource | Extension | Actions |
|---|---|---|
| Comments | MainWP Comments | 4 |
| Time Tracker | MainWP Time Tracker | 16 |
| Lighthouse | MainWP Lighthouse | 4 |
| SSL Monitor | MainWP SSL Monitor | 3 |
| Domain Monitor | MainWP Domain Monitor | 3 |
| Pro Reports | MainWP Pro Reports | 1 |

## Niche Settings surface (11 actions)

API-backup providers, Dashboard Insights, cost-tracker payment methods and
product types, clear-activation-data, restore-info-messages.

## Per-controller batch routes (4 actions)

`/sites/batch`, `/clients/batch`, `/costs/batch`, `/tags/batch` — the global
`POST /batch` covers the same action groups in v1.

## Never planned

API key management (`/rest-api/*`) — a node that can mint credentials for
itself is a footgun. This exclusion is deliberate, not deferred.
