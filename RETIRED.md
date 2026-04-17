# aurumos-mcp

## Active: proxy.js
`proxy.js` is the active MCP server for Claude Code and Claude Desktop.
It uses stdio transport (no `mcp-remote`) and forwards every `tools/list`
and `tools/call` to the daemon's `POST /mcp` Streamable HTTP endpoint.

All 30 daemon tools available via the proxy:

### Global Travel Catalog (Track 7 — 9 tools)
- catalog.destinations.search
- catalog.destination.page
- catalog.affiliate.links
- catalog.programs.list
- catalog.program.coverage
- catalog.content.search
- catalog.destinations.trending
- catalog.route.exists
- catalog.disclosure

### Jamaica Transfers + Fleet (10 tools)
- transfers.quote, transfers.destinations, transfers.pricing,
  transfers.booking.status, transfers.booking.create,
  transfers.routes.popular, transfers.routes.resort
- fleet.airports, fleet.vehicles, fleet.chauffeur

### Tourist Business Directory (11 tools)
- directory.listing.status, directory.listing.claim,
  directory.listing.update, directory.listing.submit
- directory.images.upload, directory.images.confirm, directory.images.delete
- directory.upgrade.options, directory.upgrade.checkout
- directory.analytics, directory.search

## Retired: dist/index.js
The original Node package with 6 hardcoded tools. Kept as an emergency
local fallback only — do not add features here. Superseded by `proxy.js`
because the proxy serves the live daemon catalog (30 tools, real Supabase
data) instead of hardcoded SSOT snapshots.

## Why not mcp-remote?
`mcp-remote` crashes on Windows with EPIPE — log lines leak onto stdout
from the npx wrapper and corrupt the JSON-RPC stream. `proxy.js` avoids
this by running directly under `node` and writing every log line to
`process.stderr`.

## Why not the daemon's SSE transport?
Railway routes through the Fastly CDN which buffers SSE in
deliver-on-complete mode. The Streamable HTTP `POST /mcp` endpoint uses
short-lived requests and works fine through Fastly. See
`aurumos-daemon/api/mcp_server.py` `handle_sse_connect()` for the full
postmortem.

## Uptime fix (2026-04-17)
`GET /mcp` previously returned HTTP 500 after a 2-minute Fastly idle timeout
because the handler used HTTP/1.0 + `Connection: keep-alive` without
`Content-Length` or `Transfer-Encoding: chunked`. The client would hang
waiting for socket close while Fastly buffered the response.

Fix (Track 7): force `HTTP/1.1` + `Transfer-Encoding: chunked` +
`Connection: close`, send one SSE comment line, then write the zero-length
terminating chunk and close. Round-trip is now <50ms and Smithery probes
see a clean 200. See `handle_streamable_mcp_get()` for the fix.
