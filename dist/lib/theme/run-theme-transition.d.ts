/** Callers keep their transition lock until both promises settle, even if animation is skipped. */
export declare function runThemeTransition(applyTheme: () => void): Promise<void>;
