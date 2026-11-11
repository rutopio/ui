# Rutopio UI

Shared interface components used by IntD, Mahjong Font, EmojiSalon, chingru.com, and writing.chingru.com. The package owns the button variants, dialog, theme toggle, scroll area, drawer, popover, action menu, outline navigation, header, footer, page action rail, heading link, page sharing behavior, search controls, article image rules, and shared icons. It also owns the common typography scale, neutral palette, chart colors, radii, shadows, base styles, theme transition, and shadcn state and scrollbar utilities. Each site supplies its routing, copy, fonts, and image CDN adapter. The optional `SoundCelebrationFooter` also owns the shared fill sound and confetti effect used by chingru.com and writing.chingru.com.

Install a tagged version with pnpm:

```sh
pnpm add github:rutopio/ui#v0.20.0
```

Import each component through its named entry point, such as `@rutopio/ui/site-header`, `@rutopio/ui/footer`, or `@rutopio/ui/article-image`. The five sites use the same header structure and page action rail. The footer offers `AttributionFooter` for IntD, Mahjong Font, and EmojiSalon, and `CelebrationFooter` for chingru.com and writing.chingru.com.

The section heading anchor owns the shared link icon and hover style. The search package owns shortcut, controlled-open, highlight, and mobile drawer behavior; each site supplies its search index and result rows. `usePageShare` owns native sharing, copy state, and social URLs; each site supplies its translated controls. `ArticleImage` owns zoom, portrait sizing, loader, and wrapper rules; sites supply CDN functions and captions.

Tailwind v4 sites must scan package styles, for example in `src/styles/globals.css`:

```css
@source "../../node_modules/@rutopio/ui/dist";
@import "@rutopio/ui/globals.css";
@import "@rutopio/ui/neutral-theme.css";
```

All five sites use `src/styles/globals.css` as the entry point and `src/styles/fonts.css` for font assets and locale or brand configuration. Generated declarations live in `generated-fonts.css`; font scripts must not overwrite the hand-written `fonts.css`.

Import `globals.css` before `neutral-theme.css`. The former provides shared Tailwind tokens and interaction styles; the latter provides the complete light and dark neutral palette, including monochrome charts, radii, and shadows. Site styles should contain font assets, explicit brand overrides, and product-specific content rules. Common layout and typography belong in the package. The grayscale `destructive` token remains distinct by luminance rather than hue.

`globals.css` also sets the shared dark variant, `text-autospace`, body type defaults (including optical sizing and tabular numerals), the HTML font and stable scrollbar gutter, overscroll containment, and the image zoom overlay. Keep these rules in the library so a new site receives the same baseline without copying a local reset.

The shared stylesheet sets `cursor: pointer` only on `:link` and `:visited`. Buttons and other controls keep their default cursor. Components must not add `cursor-pointer` or `cursor-default` classes that override this rule.

The shared `Button` owns the variants, sizes, and one-pixel press feedback for every site. `SiteHeader` applies the header action scale and transition to its controls automatically, including the navigation drawer trigger. The shared `ActionMenu` trigger uses the same button interaction class. Reduced motion disables the movement and transition.

`useFluidHover` and `FluidHoverHighlight` own pointer tracking and animated selection. `useMountEffect` is the named hook for one-time external subscriptions. Sites import these directly and do not keep local copies.

`ThemeProvider` accepts a site-owned `storageKey`; the package supplies the common theme settings. `usePageScrollProgress` and `isScrollLocked` keep article progress stable while image zoom locks scrolling.

`MailPopover` owns the address display and copy feedback. The site provides its email address and inline trigger so the library does not hard-code site identity.

`LanguageToggle` owns the responsive drawer/dropdown and selection state. Each site supplies its translated label, languages, current value, mobile breakpoint result, and route-change callback. The dropdown opens on hover and remains open after a click until dismissed.

The `sound` entry point exports the shared audio engine and `fillSound` recipe. `SoundCelebrationFooter` preloads and plays that recipe and runs the shared confetti burst; sites pass their author name and avatar.

## Releasing a change

1. Change the package and run `pnpm check && pnpm build`.
2. Update the package version, commit, tag, and push the tag.
3. Update each site's pinned `github:rutopio/ui#vX.Y.Z` dependency and lockfile; run its type check and production build.

The tag pin keeps production builds reproducible. A library edit reaches the sites after they update that pin and deploy. Titles inherit the library heading font.

## Layout and typography

`SiteLayout` owns the centered `max-w-2xl` frame and `px-6` gutters at every viewport width. It takes children and native div attributes, with no class override. Keep routing, skip-link translations, metadata and product state in the site. Wide tool workspaces remain inside this common frame.

The default sans font is Inter Variable; monospace is Paper Mono. The library keeps font families, weights, type sizes and font-related base rules in `fonts.css`, imported by `globals.css`. Sites with Chinese or Japanese content import `@rutopio/ui/cjk-fonts.css` from their local `fonts.css`. It adds Noto Sans TC and Noto Sans JP, prioritizing JP on Japanese pages. Sites load their own font files. `font-mono` selects Paper Mono without forcing a font size, weight, stretch or OpenType character variants; components choose their own size and weight. chingru.com intentionally overrides `--font-sans` with Albert Sans Variable.

Typography has three roles, all defined in `fonts.css`: `font-normal` uses weight 400 and optical size 14, `font-semibold` uses weight 550 and optical size 18, and `font-bold` uses weight 700 and optical size 25. Each utility sets both properties, including Tailwind state and responsive variants. Body text defaults to normal, headings to bold, and semantic `b`/`strong` to semibold. Components do not specify optical-size classes or inline variation settings. Fonts without an `opsz` axis simply ignore that axis.

`SectionHeading` owns h2/h3 typography, optical size, scroll offset, anchor and the h2 divider. Pass `id`, `level`, text and optional translated `linkTitle`/`onLinkClick`; do not repeat heading classes. `PageIntro` owns page titles, subtitles, dates and action slots. Dialog and drawer titles also inherit the common heading font.

## Articles

Import `@rutopio/ui/article.css` with the shared styles. `articleComponents` supplies the Writing-derived MDX typography. Spread it into the site's MDX mapping, then add only content adapters such as images, footnotes, code highlighting, embeds and routing behavior. `articleLinkClassName` is the same link treatment for those behavioral adapters.

`Article` is the reading container; `ArticleBody` owns body spacing. For hand-written pages, use `<ArticleSection heading={<SectionHeading id="example">Example</SectionHeading>}>…</ArticleSection>` so the heading-to-body gap is 8px and body blocks are 24px apart. Sections are 64px apart. In a body, paragraphs before h2/h3 leave 64px and headings before content leave 8px.

`article.css` includes the shared `katex.css` layout rules by default: long display equations scroll within their own block, and aligned or multiline equations keep IntD's 0.3em lower spacing. Sites do not need local KaTeX layout overrides. A math-only view can import `@rutopio/ui/katex.css` directly.

To render LaTeX, the site still configures its MDX math plugins and imports `katex/dist/katex.min.css` from its own installed KaTeX version in `src/styles/globals.css`. That vendor stylesheet supplies the matching glyph positioning and math fonts. The shared article styles do not load the KaTeX renderer or fonts for sites without equations.

`article.css` also includes `code-block.css`. `CodeBlock` supplies the common Paper Mono code frame and copy action, and is already the `pre` renderer in `articleComponents`. It accepts the generated `<code>` children and native `<pre>` attributes. Copying reads only code text, so line numbers, captions and copy feedback are excluded. Keyboard focus and touch reveal the copy control; clipboard errors are reported beside the code.

For syntax highlighting, install `shiki`, `rehype-pretty-code` and `@shikijs/transformers` as development dependencies, then add `rehypeCode` from `@rutopio/ui/rehype-code` to the MDX rehype plugins before `rehypeArticleSections`. This build-only entry point owns GitHub light/dark token colors, line and word highlights, diff markers and the `pseudocode` TextMate grammar. It leaves inline code unhighlighted and treats unlabelled fences as plain text. The highlighter is not imported by the component or the root package entry point.

Use a fenced block tagged `pseudocode` for algorithm notation, including `←`, `q_*`, hash comments and `sort … by`. Plain fenced blocks remain suitable for ASCII diagrams. Both use the same code-block presentation as other languages.

For MDX builds, import `rehypeArticleSections` from the matching subpath. It groups h2 sections with the same Writing rhythm, preserves MDX exports and heading IDs, and adds section labels. Each site chooses which content files run through it.

## Not-found pages

`NotFound` from `@rutopio/ui/not-found` owns the shared Writing-style 404 page, title, noindex metadata and home action. It uses React 19 metadata support. Sites pass a router link through `homeLink` to keep client navigation and the current language; they supply their normal page shell without overriding the page's styles. `NOT_FOUND_TITLE` is available to route-level metadata synchronizers.

## Development tools

`ScreenSize` from `@rutopio/ui/screen-size` shows the active Tailwind breakpoint using the shared Paper Mono `text-xs` badge. Render it behind the app’s development guard, for example `{import.meta.env.DEV && <ScreenSize />}` in Vite. The component is independent of the build tool, ignores pointer events and stays hidden from assistive technology.

## Controls and motion

Import `input`, `input-group`, `table`, `badge`, `command`, `separator` and `sonner` from their named subpaths. Badge always defaults to `text-xs`. Command and Sonner keep their optional peers isolated to those entry points; install `cmdk` or `sonner` only where used.

`PageTransition` owns the shared 200ms entrance fade, reduced motion and visible server-rendered content. Key it by pathname, with the router outlet as its child; query and hash changes must not remount it. Import `transitions` and `spring` from `motion` for common content, copy-feedback and progress animations.

`ReadingProgressRing` comes from `outline-nav`. `PageActionRail` owns the 50rem desktop breakpoint; sites no longer pass their own gutter result. `useIsMobile` from `use-mobile` owns the 768px dialog/navigation breakpoint.

Header navigation, action spacing and title typography use one common default. Site adapters supply labels, routes, logos and callbacks instead of title, navigation or action-area class overrides.

## Preview and verify

- `pnpm playground` opens a local Vite gallery for typography, controls, dialog, drawer, theme and page transitions.
- `pnpm check && pnpm build && pnpm test` checks package and gallery types, builds the distributed files and exercises article grouping, heading semantics and visible SSR output.
- `pnpm playground:build` builds the standalone gallery.
- Before releasing, check the five consuming sites at desktop and narrow widths, both themes, keyboard focus, article anchors and reduced motion. Run their type checks and production builds against the release.

The gallery is development-only and is not included in the published package.
