import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider as NextThemesProvider } from "next-themes";
function ThemeProvider({ children, storageKey, ...props }) {
    return (_jsx(NextThemesProvider, { attribute: "class", storageKey: storageKey, defaultTheme: "light", enableColorScheme: true, disableTransitionOnChange: true, ...props, children: children }));
}
export { ThemeProvider };
