import { type MouseEvent, type ReactNode } from "react";
export type ActionMenuItem = {
    id: string;
    label: string;
    lang?: string;
    href?: string;
    onSelect?: (event: MouseEvent<HTMLElement>) => void;
    active?: boolean;
    depth?: 2 | 3;
    leading?: ReactNode;
    trailing?: ReactNode;
    ariaCurrent?: "true" | "location" | "page";
    external?: boolean;
};
export type ActionMenuProps = {
    label: string;
    trigger: ReactNode;
    items: ActionMenuItem[];
    side?: "bottom" | "left";
    align?: "start" | "end";
    openOnHover?: boolean;
    triggerLabel?: string;
    triggerClassName?: string;
    className?: string;
    indicator?: ReactNode;
    scrollToActive?: boolean;
};
export declare function ActionMenu({ label, trigger, items, side, align, openOnHover, triggerLabel, triggerClassName, className, indicator, scrollToActive, }: ActionMenuProps): import("react").JSX.Element;
