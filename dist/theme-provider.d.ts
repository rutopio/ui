import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
declare function ThemeProvider({ children, storageKey, ...props }: ComponentProps<typeof NextThemesProvider> & {
    storageKey: string;
}): import("react").JSX.Element;
export { ThemeProvider };
