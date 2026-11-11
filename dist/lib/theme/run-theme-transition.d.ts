/** Keep the transition lock until both promises settle, including skipped animations. */
export declare function runThemeTransition(applyTheme: () => void): Promise<void>;
