import { type Transition } from "motion/react";
import type { HoverItemRect, UseFluidHoverResult } from "../../hooks/use-fluid-hover.js";
export type FluidHoverSource = Pick<UseFluidHoverResult, "activeIndex" | "itemRects" | "isMeasured" | "session">;
interface HighlightFromHook {
    hover: FluidHoverSource;
    /** Hide with an exit fade while retaining the list state. */
    hidden?: boolean;
    rect?: never;
    session?: never;
}
interface HighlightFromRect {
    /** Container layout coordinates; null triggers the exit fade. */
    rect: HoverItemRect | null;
    /** Key for restarting the entrance animation at `from` or the current rect. */
    session: number;
    hover?: never;
    hidden?: never;
}
export type FluidHoverHighlightProps = (HighlightFromHook | HighlightFromRect) & {
    /** Initial rect for a new session, such as the selected row. */
    from?: HoverItemRect | null;
    /** Disable when the highlight should appear to slide out of an already filled item. */
    fadeIn?: boolean;
    className?: string;
    /** False snaps position after reflow while retaining the opacity fade. */
    transition?: Transition | false;
};
export declare function getHighlightAnimationTarget(rect: HoverItemRect): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function resolveHighlightTransition(transition: Transition | false | undefined, reduceMotion: boolean): Transition;
export declare function resolveHighlightSource(props: FluidHoverHighlightProps): {
    rect: HoverItemRect | null;
    session: number;
};
export declare function FluidHoverHighlight(props: FluidHoverHighlightProps): import("react").JSX.Element;
export {};
