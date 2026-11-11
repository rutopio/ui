# Rutopio UI

Shared React components, styles, and motion for chingru.com, Writing, IntD,
Mahjong Font, and EmojiSalon. Sites share layout, typography, controls, and
interaction behavior. Each site provides its routes, text, font files, and
image URLs.

## Install

Install a tagged version under the import name used by the sites:

```sh
pnpm add @rutopio/ui@github:rutopio/ui#v2.0.1
```

Import components through their named entry points, such as
`@rutopio/ui/site-header`, `@rutopio/ui/footer`, or `@rutopio/ui/article-image`.

## Shared styles

Tailwind v4 sites must scan package styles, for example in `src/styles/globals.css`:

```css
@source "../../node_modules/@rutopio/ui/dist";
@import "@rutopio/ui/globals.css";
@import "@rutopio/ui/neutral-theme.css";
```

All five sites use `src/styles/globals.css` as the entry point and `src/styles/fonts.css` for font assets and locale or brand configuration. Generated declarations live in `generated-fonts.css`; font scripts must not overwrite the hand-written `fonts.css`.

Import `globals.css` before `neutral-theme.css`. `globals.css` provides shared Tailwind tokens and interaction styles; `neutral-theme.css` provides the complete light and dark neutral palette, including monochrome charts, radii, and shadows. Site styles should contain font assets, explicit brand overrides, and product-specific content rules. Common layout and typography belong in the package. The grayscale `destructive` token remains distinct by luminance rather than hue.

`globals.css` also sets the shared dark variant, `text-autospace`, body typography defaults (including optical sizing and tabular numerals), the HTML font and stable scrollbar gutter, overscroll containment, and the image zoom overlay. Keep these rules in the library so a new site receives the same baseline without copying a local reset.

The shared stylesheet sets `cursor: pointer` only on `:link` and `:visited`. Buttons and other controls keep their default cursor. Components must not add `cursor-pointer` or `cursor-default` classes that override this rule.

`Button` defines shared variants and sizes. It shifts by one pixel when pressed. `SiteHeader` applies the header action scale and transition to its controls automatically, including the navigation drawer trigger. The shared `ActionMenu` trigger uses the same button interaction class. Reduced motion disables the movement and transition.

`useFluidHover` and `FluidHoverHighlight` handle pointer tracking and animated selection. Use `useMountEffect` for external subscriptions set up on mount. Sites import these directly and do not keep local copies.

`ThemeProvider` accepts a site-owned `storageKey`; the package supplies the common theme settings. `usePageScrollProgress` and `isScrollLocked` keep article progress stable while image zoom locks scrolling.

`EmailPopover` provides the address display and copy feedback. The site provides its email address and inline trigger so the library does not hard-code site identity.

`LanguageToggle` provides the responsive drawer/dropdown and selection state. Each site supplies its translated label, languages, current value, mobile breakpoint result, and route-change callback. The dropdown opens on hover and remains open after a click until dismissed.

`AttributionFooter` displays repository and author credits. `CelebrationFooter` renders the interactive avatar, while `SoundCelebrationFooter` adds sound and confetti. The `sound` entry point exports the audio engine and `fillSound` effect. Sites supply the author name and avatar.

## Release a change

1. Update the package and run `pnpm check && pnpm build && pnpm test`.
2. Update the package version, commit, tag, and push the tag.
3. Update each site's pinned `github:rutopio/ui#vX.Y.Z` dependency and lockfile; run its type check and production build.

Pinned tags keep builds reproducible. Sites receive library changes when they update the dependency and deploy.

## Layout and typography

`SiteLayout` provides the centered `max-w-2xl` frame and `px-6` gutters at every viewport width. It takes children and native div attributes, with no class override. Keep routing, skip-link translations, metadata and product state in the site. Wide tool workspaces remain inside this common frame.

The default sans font is Inter Variable; monospace is Paper Mono. The library keeps font families, weights, type sizes and font-related base rules in `fonts.css`, imported by `globals.css`. Sites with Chinese or Japanese content import `@rutopio/ui/cjk-fonts.css` from their local `fonts.css`. It adds Noto Sans TC and Noto Sans JP, prioritizing JP on Japanese pages. Sites load their own font files. `font-mono` selects Paper Mono without forcing a font size, weight, stretch or OpenType character variants; components choose their own size and weight. chingru.com intentionally overrides `--font-sans` with Albert Sans Variable.

Typography has three roles, all defined in `fonts.css`: `font-normal` uses weight 400 and optical size 14, `font-semibold` uses weight 550 and optical size 18, and `font-bold` uses weight 700 and optical size 25. Each utility sets both properties, including Tailwind state and responsive variants. Body text defaults to normal, headings to bold, and semantic `b`/`strong` to semibold. Components do not specify optical-size classes or inline variation settings. Fonts without an `opsz` axis simply ignore that axis.

`SectionHeading` provides h2/h3 typography, optical size, scroll offset, anchor and the h2 divider. Pass `id`, `level`, text and optional translated `linkTitle`/`onLinkClick`; do not repeat heading classes. `PageIntro` provides page titles, subtitles, dates and action slots. Dialog and drawer titles also inherit the common heading font.

## Articles

Import `@rutopio/ui/article.css` with the shared styles. `articleMdxComponents` supplies the MDX typography shared with Writing. Spread it into the site's MDX mapping, then add only content adapters such as images, footnotes, code highlighting, embeds and routing behavior. `articleLinkClassName` is the same link treatment for those site-specific link components.

`Article` contains the article; `ArticleBody` provides body spacing. For hand-written pages, use `<ArticleSection heading={<SectionHeading id="example">Example</SectionHeading>}>…</ArticleSection>` so the heading-to-body gap is 8px and body blocks are 24px apart. Sections are 64px apart. Within the body, h2/h3 headings have 64px of space above and 8px below.

`article.css` includes the shared `katex.css` layout rules by default: long display equations scroll within their own block, and aligned or multiline equations keep IntD's 0.3em lower spacing. Sites do not need local KaTeX layout overrides. A math-only view can import `@rutopio/ui/katex.css` directly.

To render LaTeX, the site still configures its MDX math plugins and imports `katex/dist/katex.min.css` from its own installed KaTeX version in `src/styles/globals.css`. That vendor stylesheet supplies the matching glyph positioning and math fonts. The shared article styles do not load the KaTeX renderer or fonts for sites without equations.

`article.css` also includes `code-block.css`. `CodeBlock` supplies the common Paper Mono code frame and copy action, and is already the `pre` renderer in `articleMdxComponents`. It accepts the generated `<code>` children and native `<pre>` attributes. Copying reads only code text, so line numbers, captions and copy feedback are excluded. Keyboard focus and touch reveal the copy control; clipboard errors are reported beside the code.

For syntax highlighting, install `shiki`, `rehype-pretty-code` and `@shikijs/transformers` as development dependencies, then add `rehypeCodeHighlighting` from `@rutopio/ui/rehype-code-highlighting` to the MDX rehype plugins before `rehypeArticleSections`. This build-only entry point provides GitHub light/dark token colors, line and word highlights, diff markers and the `pseudocode` TextMate grammar. It leaves inline code unhighlighted and treats unlabelled fences as plain text. The highlighter is not imported by the component or the root package entry point.

Use a fenced block tagged `pseudocode` for algorithm notation, including `←`, `q_*`, hash comments and `sort … by`. Plain fenced blocks remain suitable for ASCII diagrams. Both use the same code-block presentation as other languages.

For MDX builds, import `rehypeArticleSections` from the matching subpath. It groups h2 sections with the same section spacing as Writing, preserves MDX exports and heading IDs, and adds section labels. Each site chooses which content files run through it.

## Not-found pages

`NotFound` from `@rutopio/ui/not-found` provides the shared 404 page, title, noindex metadata and home action. It uses React 19 metadata support. Sites pass a router link through `homeLink` to keep client navigation and the current language; they supply their normal page shell without overriding the page's styles. `NOT_FOUND_TITLE` is available to route-level metadata synchronizers.

## Development tools

`BreakpointIndicator` from `@rutopio/ui/breakpoint-indicator` shows the active Tailwind breakpoint using the shared Paper Mono `text-xs` badge. Render it behind the app’s development guard, for example `{import.meta.env.DEV && <BreakpointIndicator />}` in Vite. The component is independent of the build tool, ignores pointer events and stays hidden from assistive technology.

## Controls and motion

Import `input`, `input-group`, `table`, `badge`, `command`, `separator` and `sonner` from their named subpaths. Badge always defaults to `text-xs`. Command and Sonner keep their optional peers isolated to those entry points; install `cmdk` or `sonner` only where used.

`PageTransition` fades content in over 200ms. It respects reduced-motion preferences and keeps server-rendered content visible. Key it by pathname, with the router outlet as its child; query and hash changes must not remount it. Import `motionTransitions` and `springPresets` from `motion-tokens` for common content, copy-feedback and progress animations.

`ReadingProgressRing` comes from `outline-menu`. `PageActionRail` switches to its desktop layout at 50rem. `useIsNarrowViewport` from `use-is-narrow-viewport` reports whether the viewport is narrower than 768px. Dialogs and navigation use this breakpoint.

Header navigation, action spacing and title typography use one common default. Site adapters supply labels, routes, logos and callbacks instead of title, navigation or action-area class overrides.

## Develop and verify

Use Node.js 26.13.0 and pnpm 12.18.0, as pinned in `.nvmrc` and
`package.json`. Run `nvm use`, then `pnpm install --frozen-lockfile`.

- `pnpm playground` opens a local Vite gallery for typography, controls, dialog, drawer, theme and page transitions.
- `pnpm check && pnpm build && pnpm test` checks package and gallery types, builds the distributed files and exercises article grouping, heading semantics and visible SSR output.
- `pnpm playground:build` builds the standalone gallery.
- Before releasing, check the five consuming sites at desktop and narrow widths, both themes, keyboard focus, article anchors and reduced motion. Run their type checks and production builds against the release.

The gallery is development-only and is not included in the published package.

## Source organization

See [Repository structure](docs/repository-structure.md) for shared directory
roles, naming rules, asset placement, and the exceptions used by these sites.

Use the same top-level source roles as the five consuming sites:

- `src/components/`: React components, grouped into `ui`, `article`, `layout`,
  `navigation`, `motion`, `feedback`, `theme`, and `icons`
- `src/hooks/`: reusable React hooks, named `use-*.ts`
- `src/lib/`: utilities, motion tokens, audio code, and build-only MDX transforms
- `src/providers/`: application-wide provider components
- `src/types/`: types shared across modules
- `src/styles/`: CSS, design tokens, typography, and theme defaults
- `src/entries/`: public entry points that combine several implementation modules

`src/index.ts` is the public runtime entry. Build-only transforms stay under
`src/lib/build/` and are exported by subpath, so client imports do not load
syntax highlighters. `package.json` maps public imports such as
`@rutopio/ui/button` to their implementation files.

## Naming and v2 migration

Version 2 uses explicit names throughout the shared API. All five sites migrate
together; old export names and paths are removed.

| Previous name | Current name | Meaning |
| --- | --- | --- |
| ScreenSize / screen-size | BreakpointIndicator / breakpoint-indicator | Active Tailwind breakpoint, not physical screen dimensions |
| useIsMobile / use-mobile | useIsNarrowViewport / use-is-narrow-viewport | Viewport below 768px, not device detection |
| MailPopover / mail-popover | EmailPopover / email-popover | Display and copy an email address |
| OutlineNav / outline-nav | OutlineMenu / outline-menu | Heading dropdown with reading progress |
| useOutlineActive | useActiveOutlineId | Returns the active heading ID |
| motion | motion-tokens | Named Motion transition configuration |
| transitions / spring | motionTransitions / springPresets | Transition tokens and grouped spring presets |
| rehypeCode / rehype-code | rehypeCodeHighlighting / rehype-code-highlighting | Build-time syntax highlighting |
| articleComponents | articleMdxComponents | MDX element-to-component mapping |
| navigateToSection | scrollToSection | Scroll and replace the current hash |
| shareTargets | getSocialShareTargets | Build platform-specific share URLs |
| ItemRect / UseFluidHoverReturn | HoverItemRect / UseFluidHoverResult | Hover geometry and hook result |

LanguageToggle takes `isNarrowViewport` instead of `isMobile`. OutlineMenu takes
`sectionProgress` for the per-heading map and `pageProgress` for the whole page.

Use domain nouns for data and components, verbs for functions, and include the
returned value in a hook name when it avoids ambiguity. Keep familiar primitive
names such as Button, Dialog and cn. Local site wrappers describe their role
(for example ContactEmailLink) rather than shadowing the shared component.
