export interface OutlineItem {
    id: string;
    label: string;
    href: string;
    depth: 2 | 3;
}
export declare function useActiveOutlineId(items: OutlineItem[], sectionProgress: Record<string, number>): string;
export declare function ReadingProgressRing({ progress }: {
    progress: number;
}): import("react").JSX.Element;
export declare function OutlineMenu({ items, ariaLabel, pageProgress, sectionProgress, className, }: {
    items: OutlineItem[];
    ariaLabel: string;
    pageProgress: number;
    sectionProgress: Record<string, number>;
    className?: string;
}): import("react").JSX.Element | null;
