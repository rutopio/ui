import { type Transition } from "motion/react";
import type { HoverItemRect, UseFluidHoverResult } from "../../hooks/use-fluid-hover.js";
/** What the highlight reads off the hook: the highlighted index, the
 *  measured rects, whether they are current, and the pointer session. */
export type FluidHoverSource = Pick<UseFluidHoverResult, "activeIndex" | "itemRects" | "isMeasured" | "session">;
interface HighlightFromHook {
    /** The hook's return value. The highlight sits on
     *  `itemRects[activeIndex]` once `isMeasured`, and re-keys on the session. */
    hover: FluidHoverSource;
    /** Keep the list's state but show nothing (a closed popup, hover switched
     *  off). Runs the exit fade. */
    hidden?: boolean;
    rect?: never;
    session?: never;
}
interface HighlightFromRect {
    /** For lists that resolve their own rect (the sidebar's unified scope):
     *  the rect to sit on, in the container's coordinate space. `null` hides
     *  the highlight (it fades out on `springPresets.fast.exit`). */
    rect: HoverItemRect | null;
    /** `session` from `useFluidHover`. It steps when the cursor enters the
     *  container, which re-keys the highlight so it fades in at `from ?? rect`
     *  instead of sliding over from wherever it was last. */
    session: number;
    hover?: never;
    hidden?: never;
}
export type FluidHoverHighlightProps = (HighlightFromHook | HighlightFromRect) & {
    /** Where a fresh session fades in from. A dropdown passes its checked row,
     *  a nav menu its active route. Defaults to the rect itself. */
    from?: HoverItemRect | null;
    /** `false` starts a fresh session opaque instead of fading in: for a
     *  `from` under a filled item (the calendar's range start), so the
     *  highlight reads as sliding out of it. */
    fadeIn?: boolean;
    /** Radius, z-index, anything else. Merged onto
     *  `absolute bg-hover pointer-events-none`. */
    className?: string;
    /** The positional spring. Defaults to `springPresets.fast`. Pass `false` to snap
     *  to the new rect with no travel (a layout reflow that moved the rows
     *  underneath, not a hover change). The opacity fade is always 0.08s. */
    transition?: Transition | false;
};
/** A measured rect as animation targets: position as a transform, size as
 *  layout. Exported for the unit test. */
export declare function getHighlightAnimationTarget(rect: HoverItemRect): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Resolves the positional transition. Reduced motion keeps the opacity fade
 * and drops the travel, per the motion guidelines: fewer and gentler, not
 * none. Exported for the unit test.
 */
export declare function resolveHighlightTransition(transition: Transition | false | undefined, reduceMotion: boolean): Transition;
/** The rect and session a set of props resolves to. Exported for the test. */
export declare function resolveHighlightSource(props: FluidHoverHighlightProps): {
    rect: HoverItemRect | null;
    session: number;
};
export declare function FluidHoverHighlight(props: FluidHoverHighlightProps): import("react").JSX.Element;
export {};
