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
| URL parsing | In review |
| Regular expression allocation | In review |
| JSONB field promotion | In review |
| Sequential asynchronous work | In review |
| State machines and regression fixes | In review |
