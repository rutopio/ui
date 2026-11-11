export type LanguageOption<T extends string = string> = {
    value: T;
    label: string;
    htmlLang?: string;
};
export declare function LanguageToggle<T extends string>({ label, current, options, onChange, isMobile, className, }: {
    label: string;
    current: T;
    options: readonly LanguageOption<T>[];
    onChange: (value: T) => void;
    isMobile: boolean;
    className?: string;
}): import("react").JSX.Element;
