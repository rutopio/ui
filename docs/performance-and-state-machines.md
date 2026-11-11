# Performance and state machine review

Review date: 11 November 2026.

This file covers the shared UI library and the five consuming sites:
Portfolio (`chingru.com`), Writing (`writing.chingru.com`), IntD, Mahjong Font,
and EmojiSalon. Paths below are relative to each repository.

## Database projections

No database row reads were found. All five `wrangler.toml` files configure
Pages builds without database bindings. Package manifests contain no database
driver or ORM. Runtime source reads static assets, generated JSON, browser
storage, and browser or Cloudflare caches. There are no SQL projections to
narrow. Large static JSON files are not database rows.

Validation: checked all six package manifests, five Wrangler configurations,
and runtime source under `src/` and `functions/` for SQL, query builders, and
database bindings. No schema or data migration is needed for this item.

## Review progress

| Item | Status |
| --- | --- |
| Database projections | Complete; no database queries |
| URL parsing | Complete; redundant redirect and asset parsing removed |
| Regular expression allocation | Complete; static patterns moved to module scope |
| JSONB field promotion | Complete; no JSONB storage or queries |
| Sequential asynchronous work | Complete; independent work overlaps |
| State machines and regression fixes | In review |

## URL parsing

Four middleware handlers now build canonical redirect URLs from an already
parsed pathname and query. This also prevents a path beginning with `//` from
being interpreted as an external redirect host. EmojiSalon builds its emoji
asset URL directly from the parsed origin and validated emoji ID.

Request URL parsing, external-link origin checks, analytics referrer resolution,
and fragment encoding remain: those calls perform required URL normalization.
Build-time file URLs and local audit servers are outside the request hot path.

Validation: redirect regression tests exercise normal paths, encoded characters,
repeated query keys, and double/triple leading slashes. Asset URL comparisons
cover production and local origins with single and joined emoji IDs.

## Regular expressions

Static patterns in runtime code, build helpers, and preprocessing scripts now
live at module scope with descriptive names. Repeated patterns within a file
share one definition. The emoji picker's variation-selector suffix uses a
literal pattern instead of constructing a RegExp for every visible emoji.

Global patterns use `replace`, `matchAll`, or other non-leaking string
operations. The table-of-contents scanner now uses `matchAll` on the same
code-free text throughout. Previously its first `exec` read stripped text but
later calls read the original text with an offset from a different string.
This could expose code-block headings or repeat headings. Regression tests
cover fenced headings, duplicate slugs, inline formatting, and repeated calls.

## JSONB fields

No JSONB columns, JSON database queries, database clients, or database bindings
are present. There is no hot database key to promote into a column. Mahjong's
large tile asset contains geometry, palettes, and metrics used together by the
renderer; it is loaded on demand. EmojiSalon already fetches separate assets
per emoji. Neither is a database column.

Validation: searched runtime source and manifests for JSONB, JSON query
functions, and database clients, then reviewed the asset loader call sites.
Portfolio articles describing other applications are not runtime database use.

## Asynchronous hot paths

- Writing starts the article module import and translation lookup together
  after validating the article metadata.
- EmojiSalon starts JSON body parsing and WASM initialization together after
  checking the emoji asset status and content type. Unknown emoji still return
  404 without starting WASM.
- UI sound playback prepares the audio buffer while resuming AudioContext.
  Playback still waits for both; both failures have rejection handlers.

Regression tests hold one operation pending and verify that the other has
started. They also check returned content, image bytes, and rejection handling.
No wall-clock speedup is claimed without measurements.

Intentional dependencies remain sequential: response body reads require their
response; rasterization requires SVG; delivery requires the raster; emoji
fallback assets must preserve candidate priority; cache misses must be checked
before rendering. Writing's HTML shell fetch remains gated by a known route
and GET method to avoid extra reads for HEAD, missing metadata, or unknown
routes. Portfolio already reads HTML and SEO metadata concurrently.
