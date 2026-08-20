# Open questions

Things Phase 0 could not settle from the pinned spec (`docs/openapi.yaml`, v6.1.5, fetched 2026-08-19).
Each needs either a live call against a real MainWP Dashboard or a decision from the package owner.
Items get moved to API.md / README as they are resolved.

## Needs a live Dashboard to verify

1. **`pre_page` on `GET /clients/fields`.** Every other paginated route declares `per_page`; this one
   declares `pre_page`. Almost certainly a spec typo, but it could be a faithful transcription of a
   plugin-side typo — in which case `per_page` would be silently ignored on that route. Verify which
   spelling the Dashboard honors before wiring the paginator for `client.getFields`.
2. **When does queued mode kick in?** `POST /sites/sync` and `POST /updates/update` (and their per-site
   variants) return either inline results or a `QueuedAction`. The spec does not say what triggers
   queueing (site count? a Dashboard setting?). The node handles both shapes either way, but the docs
   should tell users when to expect a `job_id`.
3. **Which routes actually return `success: 0` inside HTTP 200.** The spec says "some routes" without
   naming them. Need at least one live reproduction to pin a fixture for the unwrapper test
   (candidate: an action against a disconnected site).
4. **`page`/`per_page` on `GET /monitors/{id_domain}/incidents/count`.** A count route declaring
   pagination parameters is suspicious; verify whether they change the response or are copy-paste
   residue in the plugin's route registration.
5. **Trigger watermark fields.** Phase 4 needs a monotonic field per poll source (sites/basic,
   incidents, non-mainwp-changes, clients). The spec's response schemas must be checked against live
   payloads before choosing (`dtsSync`? incident `started_at`? change `dts`?). Do not assume
   `created_at` exists.
6. **`context` query parameter semantics.** Several routes take `context` (default `view`). The spec
   says it "determines which fields the response carries" but does not enumerate the other values
   (`edit`?) or the field differences. v1 passes it through where declared, defaulting to `view`.

## Found while implementing Phase 3 (needs a live Dashboard to verify)

9. **Batch `updates` group is declared but reportedly non-functional.** The spec declares an
   `updates` action group on `POST /batch` while describing it as returning `invalid-method`
   errors for every item. The node exposes it with a warning in the field description. Verify
   against a live Dashboard and drop the field if confirmed dead.
10. **Monitor `active` type mismatch.** Per-monitor settings declare `active` as a string enum
    (`0`/`1`/`useglobal`); global monitor settings declare it as a boolean. Implemented faithfully;
    looks like a spec inconsistency worth confirming live.
11. **`cost.update` requires the full record.** `POST /costs/{id}/edit` declares the same nine
    required fields as create, so the node sends the full record on update. Verify a partial
    update is truly rejected.

## Needs an owner decision

7. **Plain-permalink fallback (`?rest_route=/mainwp/v2/...`).** Not implemented in v1. The README
   documents pretty permalinks as a hard prerequisite instead. If real-world installs need the
   fallback, it will be an explicit credential toggle — never sniffing. Confirm this is acceptable.
8. **Live test target.** No live calls have been made. Awaiting a base URL and an API key (Read scope
   is enough for the credential test and most verification; a Write & Delete key would let us verify
   the `success: 0` behavior against a throwaway record).
