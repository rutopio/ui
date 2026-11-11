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
| JSONB field promotion | In review |
| Sequential asynchronous work | In review |
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
