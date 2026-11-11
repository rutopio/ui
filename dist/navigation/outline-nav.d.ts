export interface OutlineItem {
    id: string;
    label: string;
    href: string;
    depth: 2 | 3;
}
export declare function useOutlineActive(items: OutlineItem[], progress: Record<string, number>): string;
export declare function ReadingProgressRing({ progress }: {
    progress: number;
}): import("react").JSX.Element;
export declare function OutlineNav({ items, ariaLabel, pageProgress, progress, className, }: {
    items: OutlineItem[];
    ariaLabel: string;
    pageProgress: number;
    progress: Record<string, number>;
    className?: string;
}): import("react").JSX.Element | null;
