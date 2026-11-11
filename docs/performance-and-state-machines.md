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
| State machines and regression fixes | Complete; 11 confirmed issue groups fixed |
| React effect ownership | Complete; state chains removed and external synchronization reviewed |

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

## State machine inventory

The tables describe application-owned behavior. Base UI, TanStack Router,
next-themes, browser APIs, and React also own internal state machines; their
implementations are outside this review. Their inputs, completion callbacks,
and failure paths are included below. States derived from several booleans or
refs are named here even where the code has no enum.

### Data loading and edge requests

| Machine and owning files | States | Event and transition | Invariant |
| --- | --- | --- | --- |
| Writing `src/lib/posts.ts`; Portfolio `src/lib/webmcp.ts` | Empty, loading, ready | Read: empty → loading; concurrent read joins; success → ready; failure → empty | Failed HTTP responses are not indexed; failed requests remain retryable |
| Both sites `src/lib/search-index-store.ts` | Idle, loading, ready, failed | Open search → loading; success → ready; failure → failed; reopen → loading | One pending request; a published snapshot has stable identity |
| Mahjong `src/lib/tiles-data.ts` | Empty, loading, ready | Import → loading; success → ready; failure → empty | Concurrent callers share the import; application cache cannot retain rejection forever |
| EmojiSalon `src/lib/emoji-utils.ts`, `src/lib/emoji-query.ts`, and `src/hooks/use-emoji-svg.ts` | Uncached, trying original, trying fallback, cached, query error | Read → original; concurrent reads join; unavailable → fallback; success → cached; exhausted → query error/uncached | Original ID wins; missing data is a query error, so retries remain possible |
| IntD, Mahjong, EmojiSalon `functions/og.ts` | Uninitialized, initializing, ready | First valid request → initializing; concurrent requests join; success → ready; failure → uninitialized | Only successful initialization is permanent; resvg marks itself initialized only after success |
| Mahjong `functions/og.ts`, `functions/img/[tile].ts` | Invalid, cache lookup, hit, render, cache write | Invalid → 400; hit → response; miss → render; render → response plus `waitUntil` write | No invalid input is rendered; response body is cloned for caching |
| Site middleware | Redirect, bypass, metadata lookup, rewrite, missing | Preview host → redirect; asset/non-GET → bypass; known page → rewrite; unknown page → 404 | Canonical host is fixed; path/query survive; HEAD does not consume an HTML body |
| Writing `src/components/pages/post-detail.tsx` | Validate type, metadata, content and translation, ready/not found | Valid metadata starts both reads; missing type/post/module → not found | Content and translation refer to the same validated post |

Browser module loaders can retain some import failures independently of the
application. Clearing Mahjong's promise cache permits a retry; it does not
promise recovery from a deleted deployment chunk without a reload.

### Editors, forms, and exports

| Machine and owning files | States | Event and transition | Invariant |
| --- | --- | --- | --- |
| EmojiSalon `src/contexts/emoji-context.tsx`, `src/lib/prepare-emoji-route.ts` | Initial query pending/error, ready, loading next selection | Route resolves URL/storage/random input; query success supplies the initial snapshot; select → loading; newest success → ready; stale success ignored; failure keeps previous ready snapshot | Identity, label, geometry, and palette change together; late initial data cannot replace edits; failed or cancelled route loads do not replace stored selections |
| Emoji palette persistence in the same provider | Clean, dirty with timer, saved, disposed | Edit → dirty; later edit replaces timer; timeout → saved; select/reset/randomize/dispose invalidates old timer | Old edits cannot overwrite a newer selection or route |
| Emoji export in the same provider | Idle, decoding, drawing, delivering, completed/failed/cancelled | Export → decode → draw → delivery; decode/delivery failure → failed; share cancellation → cancelled | Every export owns its canvas; preview is published only after decoding |
| Emoji showcase `src/components/showcase/showcase-section.tsx` | Idle, rendering, download/share, done/failed/cancelled | Click → independent canvas render → delivery; decode/delivery failure → error feedback | Each operation captures its own SVG and canvas |
| IntD `src/hooks/use-decomposition.ts`, `src/lib/prepare-calculation-route.ts` | Empty input, invalid input, results by sort mode, exhausted | Route restores a validated target or prepares the URL target before rendering; preloads do not mutate storage; submit validates; valid submit clears old modes; mode switch reuses or computes; shuffle excludes seen results; blank submit clears session | Persisted values have validated shapes; current mode, target, result offsets, and seen keys are usable |
| IntD `src/components/calculator/settings-dialog.tsx` | Closed, editing, invalid, saved, reset confirmation | Open → edit; invalid save stays open; valid save persists and clears calculations; reset requires confirmation | Only valid settings reach the solver; result data is invalidated when settings change |
| IntD `src/hooks/use-local-storage.ts` | Persistent, volatile fallback, absent | Read parses and validates; write persists or falls back; remove → absent; storage event refreshes snapshot | React sees stable raw snapshots; unavailable storage does not crash rendering |
| Mahjong `src/hooks/use-mahjong-state.ts`, `src/lib/url-state.ts` | Default, edited, empty input | Initialize from URL; input/theme/color edit → state and URL; clear → explicit empty input | URL represents the current generator state, including empty input |
| Mahjong `src/lib/tiles-export.ts` | Loading tiles, SVG, decoding, blob, delivery, done/failed/cancelled | Each step requires the previous output | A failed decode rejects; object URLs are released; operations use separate canvases |

### Shared interaction and display state

| Machine and owning files | States | Event and transition | Invariant |
| --- | --- | --- | --- |
| UI `src/components/navigation/action-menu.tsx` | Closed, hover delay, hover open, click open | Enter schedules; leave cancels/closes hover; click promotes; arrows move focus; Escape/outside closes | At most one hover timer/focus frame; cleanup cancels both; empty menus do not open |
| UI popover, search command, language toggle, site header; site outline/download/share dialogs | Closed/open, plus focused item or selected tab | Trigger/keyboard → open; selection/Escape/outside → close | Controlled state belongs to the caller; uncontrolled state stays local; focus behavior delegates to primitives where applicable |
| UI `src/hooks/use-fluid-hover.ts` | Unmeasured, measured inactive, active item, leaving, disposed | Registration/resize measures; pointer/focus activates; leave clears; cleanup removes observers/listeners | Active geometry comes from registered items; handlers, DOM attributes, and React subscribers read one selection store |
| UI `src/components/theme/theme-toggle.tsx` | Not hydrated, idle, transitioning | Hydrate resolves theme; reduced motion toggles directly; click starts transition; settlement returns to idle | One active transition; temporary styles are removed; failure does not swallow the requested theme |
| UI `src/lib/feedback/page-share.ts`, `email-popover.tsx`; Mahjong action buttons | Idle, copying, copied, failed; native sharing or dialog | Clipboard success → copied; another success renews feedback; timeout → idle; cancellation → idle | Failed copying never shows success; timers do not outlive their component |
| UI `src/components/article/code-block.tsx` | Idle, copied, error | Clipboard success starts or renews expiry; failure clears copied feedback; timeout → idle; unmount cancels the timer | Completion handlers own expiry; rendering does not start timers |
| UI `src/lib/feedback/sounds/react-bits-sound.js` | Muted/unavailable, suspended/running, buffer loading/ready, playing/ended | Play resumes and renders concurrently; both ready → playback; ended → resolve | Render failures can retry; rejected evicted buffers cannot remove a newer cache entry |
| UI article image; site tile preview | Loading, loaded/error, zoom closed/open | Source change/load updates preview; zoom opens/closes | Zoom and measurement use the current element; image ownership stays with the component |
| UI `section-navigation.ts` | Idle, delayed scroll, cancelled/completed | Heading click replaces pending scroll; URL change cancels its effect; timeout on the same URL → scroll and fragment | An old click cannot navigate a new route |
| UI scroll progress, site reading progress and outline hooks | Tracking, scroll locked, disposed | Scroll/resize schedules a frame; locked reads are skipped; cleanup cancels observers/frames | Fractions stay in 0..1; old observers do not update a replaced article |
| Site Taipei clocks, client-only and viewport stores | Server snapshot, subscribed client snapshot, disposed | Subscribe installs interval/media listener; cleanup removes it | Server snapshot is stable; subscriptions do not leak after unmount |

Simple dialog/tab states include IntD copy formatting options and reset
confirmation, Mahjong notation visibility and yaku selection, EmojiSalon picker
and CSS dialogs, and both article sites' search query/outline state. They have
no persistence or asynchronous transition of their own. They use the relevant
closed/open or selected-value transitions above.

## Confirmed issues and regression work

These are local issue groups, not GitHub issues. Priority reflects user impact.
Evidence paths refer to the implementation before each fix; tests preserve the
reachable sequence rather than merely checking source text.

| Issue | Priority | Reachable failure and evidence | Status and regression coverage |
| --- | --- | --- | --- |
| STATE-01: Rejected caches prevent retry | P1 | A network/parse failure in Writing `loadPostsData`, Portfolio `searchIndex`, or Mahjong `loadTilesData` leaves the rejected promise assigned. OG `ensureWasm` and sound `bufferFor` have the same failure state. Every later caller receives that rejection. | Fixed: clear rejected cache entries; check HTTP status; tests cover concurrent callers, failure, retry, and reuse |
| STATE-02: Emoji selection and delayed persistence | P1 | `updateEmoji` changed identity before awaiting data; failure retained old geometry. A color timer captured the old emoji and survived selection, reset, and unmount. | Fixed: React tests cover out-of-order selection, failure, timer invalidation, route changes, and blocked storage |
| STATE-03: Emoji export completion and races | P1 | `updateCanvas` returned after assigning `onload`, so awaiting it opened an empty preview. Editor and showcase exports shared canvases. Decode had no error callback; showcase object URLs were never released. | Fixed: independent canvases, awaited decoding/delivery, no object URLs; tests cover reverse completion, JPG background, failed decoding/encoding, and stale previews, including explicitly closed dialogs |
| STATE-04: Invalid persisted calculator data | P2 | `JSON.parse` was cast to any requested type. Stored `null` for `idc:byMode` reached `byMode[sortMode]`; malformed settings reached `items.map`. Saving new items retained results from the old settings. Failed removal could reveal the old persistent value. | Fixed: validate storage with schemas, invalidate results on item changes, retain an absent-value fallback on removal failure; schema and React storage tests pass. Target/settings compatibility checks reject partial or interleaved cross-tab snapshots before display or shuffle. |
| STATE-05: Clipboard feedback lifetime | P2 | Copy twice less than two seconds apart: the first timer clears the second success. Mahjong marked copied before clipboard completion. | Fixed: React tests cover delayed success, rejection, renewed expiry, and unmount cleanup |
| STATE-06: Empty Mahjong input and URL mismatch | P2 | `update` returned early for empty input, leaving the prior tiles in the share URL. Decoder also treated explicit empty input as missing. | Fixed: React and decoder tests cover clear, round-trip, color/hash preservation, and subsequent editing |
| STATE-07: Theme transition failure | P2 | A skipped/rejected `ready` left `finished` unobserved; synchronous transition failure skipped the theme callback. Cleanup could run before a delayed callback. | Fixed: tests cover skipped animation, delayed update, both promise failures, and synchronous start failure |
| STATE-08: Markdown scanner cursor | P2 | TOC scanning switched from stripped to original text while retaining an `exec` offset. | Fixed in regex step; fenced-heading, duplicate-slug, repeated-call tests |
| STATE-09: Canonical redirect host | P1 | Passing a `//host/path` pathname to a base-URL constructor selected that host. | Fixed in URL step; double/triple-slash regression tests |
| STATE-10: Showcase caches failed loads as success | P2 | `useShowcaseEmojiData` returned `null` on fetch failure with infinite stale time. React Query treated it as permanent successful data and skipped retries. | Fixed: reject missing data; query-client tests cover retry and successful caching. Concurrent raw emoji reads also share one pending request. |
| STATE-11: Delayed outline navigation crosses routes | P2 | `scrollToSection` waited 350 ms without checking the current URL or cancelling an earlier click. Navigating to another article with the same heading ID let the old callback scroll it and change its fragment. | Fixed: latest click wins and callbacks verify the source URL; timer tests cover both cases. |

## React effect review

The review covers runtime source in all six repositories, including effects
hidden behind `useMountEffect` and layout effects. Application state should be
derived during rendering or changed by its owning event. External systems still
need subscriptions and cleanup.

### Changes

| Owner | Previous coupling | Current ownership |
| --- | --- | --- |
| UI `useCopyFeedback` and `CodeBlock`; Mahjong action buttons | Success state triggered an effect that created the expiry timer | Clipboard completion starts or renews the timer directly; mount cleanup cancels it |
| UI `useFluidHover` | React state was copied into a ref/store in a layout effect, then another effect updated DOM attributes | One store publishes selection and DOM changes synchronously; React reads it with `useSyncExternalStore` |
| Portfolio and Writing `useReadingProgress` | An effect mirrored browser readings into local React state | A subscribed store caches section readings and preserves snapshot identity when values do not change |
| IntD `useDecomposition` | A guarded mount effect copied search parameters into several storage states and calculated results | Route `beforeLoad` restores or prepares the target; submit, strategy, and shuffle handlers own later changes |
| IntD `GlowCard` | A prop change triggered imperative animation controls | The overlay is keyed by its signature and uses declarative Motion animation; card children retain their state |
| IntD `PageActions` | Heading discovery set state, which started a second subscription effect; opening the drawer triggered another effect | One mount subscription reads the article; language keys refresh ownership; a ref callback positions the mounted drawer and cancels its frame on removal |
| EmojiSalon editor | A zero-delay mount timer fetched data and updated seven state fields; a pathname effect invalidated pending work | Routes prepare a shared React Query request; initial display is derived from query data; handlers replace one complete edited snapshot; a pathname key disposes the previous editor |

### Retained reactive effects

| Owner | External system and reason |
| --- | --- |
| UI `usePopover` layout effect | Measures DOM geometry before paint when the popover opens or positioning options change |
| UI `usePopover` passive effect | Subscribes to scroll, resize, and `ResizeObserver` while open, using the current positioning callback |
| UI `Popover` passive effect | Owns document-level outside-pointer and Escape listeners only while open, including controlled opens |
| UI `useFluidHover` container observer | Observes the container and reconnects if its ref or measurement callback changes |
| UI `useRegisterFluidHoverItem` | Registers DOM nodes against the current list and index, with cleanup on index or owner changes |
| UI `FluidHoverControls` layout effect | Observes actual child nodes and registers them for measurement before paint |
| IntD `RollNumber` | Synchronizes an external MotionValue with the current target and reduced-motion preference, stopping interrupted animations; remounting would lose the current interpolated value |

These dependencies describe external synchronization. Replacing them with an
empty dependency array would capture stale inputs. A blanket hook ban would
hide this ownership rather than improve it.

### Retained mount synchronization

- Search commands subscribe to a document keyboard shortcut.
- Writing's Tweet and Instagram children initialize third-party embeds. Their
  existing ID/URL keys give each embed its own lifecycle.
- UI page progress, IntD outlines, Mahjong API outlines, and EmojiSalon About
  outlines read DOM geometry and subscribe to scroll/resize observers. Their
  route or language boundaries own their lifetime.
- UI action menus and logo wobble release listeners, timers, animation frames,
  or animation handles. Copy feedback and the emoji editor cancel pending work.
- The sound footer prepares an external audio resource.

`useMountEffect` is reserved for these lifecycle operations. It must not become
a wrapper for fetching application data, copying props into state, or triggering
user actions through flags. If a subscription depends on changing inputs, use a
reactive subscription or an explicit keyed boundary.

Regression coverage includes repeated copy completion, clipboard completion
after unmount, hover store consistency and row replacement, stable progress
snapshots and cleanup, route preloads, calculator cache compatibility, keyed
outline replacement, drawer frame cancellation, preserved card child state,
late initial emoji queries, failed-query retry, stale selection completion,
and palette actions before data is ready.

Official references: [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect),
[`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore),
and [ref callbacks](https://react.dev/reference/react-dom/components/common#ref-callback).

## Final validation

The counts below include the effect review. Its frontend changes also passed
Vite builds with the current pins and with the updated local UI package. The
OG generation and prerender results refer to the preceding performance review;
those pipelines were not changed by the effect work.

| Repository | Type/lint checks | Regression tests | Build |
| --- | --- | --- | --- |
| UI | Passed | 12 passed | Library and declarations passed |
| Portfolio | Passed | 2 passed | Production build, OG generation, and prerender passed |
| Writing | Passed, including 223 MDX compilation checks | 6 passed | Production build and OG generation passed |
| IntD | Passed | 8 passed | Production build passed |
| Mahjong | Passed | 5 passed | Production build passed |
| EmojiSalon | Passed | 15 passed | Production build passed |

All five sites also passed type checks, Vite production builds, and their tests
with a temporary copy of the updated UI package. The original dependency links
were restored afterward. This verifies local compatibility without changing the
sites' pinned library version. Publishing UI and updating those pins is a
separate release step; these changes have only been committed locally.

All six dependency audits reported zero known vulnerabilities. Happy DOM is a
development-only dependency in UI, IntD, Mahjong, and EmojiSalon for React DOM
regression tests. Tests use deferred promises and controlled timers to reproduce
ordering problems without timing-dependent sleeps.

A final syntax-tree scan found no regular-expression construction inside
production functions or loops. It also covered module-level script loops. The
last script-only hoists passed syntax checks, lint/type checks, tests, and the
real article image-size checker; an AST comparison verified that their pattern
text and flags did not change. Font audit data and history remain untouched.

The tests mock browser image decoding, clipboard/share outcomes, and WASM
initialization failures. They verify application transitions and generated
outputs, not physical-device share sheets or Cloudflare isolate behavior.
No deployment or benchmark was run. Existing bundle-size warnings remain.
