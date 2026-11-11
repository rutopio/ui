import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ComponentProps } from "react";

function ThemeProvider({
  children,
  storageKey,
  ...props
}: ComponentProps<typeof NextThemesProvider> & { storageKey: string }) {
  return (
    <NextThemesProvider
      attribute="class"
      storageKey={storageKey}
      defaultTheme="light"
      enableColorScheme
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export { ThemeProvider };
