import type { ReactNode } from "react";
export declare function PageActionRail({ label, mobileOutline, desktopOutline, actions, desktopVisible, }: {
    label: string;
    mobileOutline?: ReactNode;
    desktopOutline?: ReactNode;
    actions: ReactNode;
    /** Omit for the standard 50rem breakpoint. Supply a measured gutter result when the rail depends on available space. */
    desktopVisible?: boolean;
}): import("react").JSX.Element;
