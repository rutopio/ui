interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
    toLightLabel?: string;
    toDarkLabel?: string;
}
export declare function ThemeToggle({ className, duration, toLightLabel, toDarkLabel, ...props }: ThemeToggleProps): import("react").JSX.Element;
export {};
