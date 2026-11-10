export type LanguageOption<T extends string = string> = {
    value: T;
    label: string;
    htmlLang?: string;
};
export declare function LanguageToggle<T extends string>({ label, current, options, onChange, isMobile, className, titleClassName, }: {
    label: string;
    current: T;
    options: readonly LanguageOption<T>[];
    onChange: (value: T) => void;
    isMobile: boolean;
    className?: string;
    titleClassName?: string;
}): import("react").JSX.Element;
