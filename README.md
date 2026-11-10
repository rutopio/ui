# Base Component

Shared interface components used by IntD, Mahjong Font, EmojiSalon, chingru.com, and writing.chingru.com. The package owns the button variants, dialog, theme toggle, scroll area, drawer, action menu, outline navigation, header, footer, page action rail, heading link, page sharing behavior, search controls, article image rules, and shared icons. Each site supplies its routing, copy, fonts, image CDN adapter, and theme tokens.

Install a tagged version with pnpm:

```sh
pnpm add github:rutopio/base-component#v0.5.0
```

Import each component through its named entry point, such as `@rutopio/base-component/site-header`, `@rutopio/base-component/footer`, or `@rutopio/base-component/article-image`. The five sites use the same header structure and page action rail. The footer offers `AttributionFooter` for IntD, Mahjong Font, and EmojiSalon, and `CelebrationFooter` for chingru.com and writing.chingru.com.

The section heading anchor owns the shared link icon and hover style. The search package owns shortcut, controlled-open, highlight, and mobile drawer behavior; each site supplies its search index and result rows. `usePageShare` owns native sharing, copy state, and social URLs; each site supplies its translated controls. `ArticleImage` owns zoom, portrait sizing, loader, and wrapper rules; sites supply CDN functions and captions.

Tailwind v4 sites must scan package styles, for example in `src/styles.css`:

```css
@source "../node_modules/@rutopio/base-component/dist";
@import "@rutopio/base-component/styles.css";
```

For `src/styles/globals.css`, use `../../node_modules/...` instead.

The shared stylesheet sets `cursor: pointer` only on `:link` and `:visited`. Buttons and other controls keep their default cursor. Components must not add `cursor-pointer` or `cursor-default` classes that override this rule.

The shared `Button` owns the variants, sizes, and one-pixel press feedback for every site. `SiteHeader` applies the header action scale and transition to its controls automatically, including the navigation drawer trigger. The shared `ActionMenu` trigger uses the same button interaction class. Reduced motion disables the movement and transition.

## Releasing a change

1. Change the package and run `pnpm check && pnpm build`.
2. Update the package version, commit, tag, and push the tag.
3. Update each site's pinned `github:rutopio/base-component#vX.Y.Z` dependency and lockfile; run its type check and production build.

The tag pin keeps production builds reproducible. A library edit reaches the sites after they update that pin and deploy. Pass site-specific heading fonts to drawer and dialog titles with `className`.
