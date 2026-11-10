import type { ReactNode } from "react";
export type OutlineListItem = {
    id: string;
    label: string;
    depth: 2 | 3;
    href?: string;
};
export declare function OutlineList({ items, activeId, onNavigate, indicator, className, }: {
    items: OutlineListItem[];
    activeId: string;
    onNavigate?: (id: string) => void;
    indicator: ReactNode;
    className?: string;
}): import("react").JSX.Element;
