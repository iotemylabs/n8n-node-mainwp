# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of the MainWP node and MainWP Trigger node.
- Generated against the MainWP Dashboard REST API v2 OpenAPI spec pinned at
  `info.version` **6.1.5** (fetched 2026-08-19, sha256 `e5cd083e…` — see
  `docs/openapi.yaml`), which ships with MainWP Dashboard 6.1.x.
- MainWP node: 118 operations across 11 resources — Site, Client, Tag, Update,
  Cost, Post, Page, User, Monitor, Settings, Batch.
- MainWP Trigger node: polling trigger (MainWP v2 has no webhooks) with events
  for available updates, site status changes, monitor incidents, non-MainWP
  changes, new clients and new sites.
- `MainWpApi` credential: Dashboard URL + API key (bearer), credential test
  against `GET /sites/count`.
