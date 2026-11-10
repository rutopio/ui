# Base Component

Shared interface primitives used by IntD, Mahjong Font, EmojiSalon, chingru.com, and writing.chingru.com. The package owns behavior and structural styles. Each site keeps its own routing, copy, fonts, and theme tokens.

Install a tagged version with pnpm:

```sh
pnpm add github:rutopio/base-component#v0.1.0
```

Import the drawer primitives from `@rutopio/base-component/drawer`. Tailwind v4 sites must scan package styles, for example in a stylesheet under `src/`:

```css
@source "../node_modules/@rutopio/base-component/dist";
```

Consumer builds should pin a tag, update each site deliberately, and verify its generated CSS. Keep site-specific title fonts in a local wrapper rather than adding them here.
