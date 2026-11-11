export { useActiveOutlineId } from "../../hooks/use-active-outline-id.js";
import type { OutlineItem } from "../../types/outline.js";
export type { OutlineItem } from "../../types/outline.js";
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
