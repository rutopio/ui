# Base Component

Shared interface primitives used by IntD, Mahjong Font, EmojiSalon, chingru.com, and writing.chingru.com. The package owns drawer, action menu, and outline list behavior and structural styles. Each site keeps its own routing, copy, fonts, and theme tokens.

Install a tagged version with pnpm:

```sh
pnpm add github:rutopio/base-component#v0.1.0
```

Import `Drawer` from `@rutopio/base-component/drawer`, `ActionMenu` from `@rutopio/base-component/action-menu`, and `OutlineList` from `@rutopio/base-component/outline-list`. All five sites use these shared implementations. Tailwind v4 sites must scan package styles, for example in `src/styles.css`:

```css
@source "../node_modules/@rutopio/base-component/dist";
```

For `src/styles/globals.css`, use `../../node_modules/...` instead.

Consumer builds should pin a tag, update each site deliberately, and verify its generated CSS. Keep site-specific title fonts in a local wrapper rather than adding them here.
