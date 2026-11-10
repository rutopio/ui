import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type React from "react";
export declare function ScrollArea({ className, children, scrollFade, scrollbarGutter, fill, clampContentMinWidth, overscrollContain, ...props }: ScrollAreaPrimitive.Root.Props & {
    scrollFade?: boolean;
    scrollbarGutter?: boolean;
    fill?: boolean;
    clampContentMinWidth?: boolean;
    overscrollContain?: boolean;
}): React.ReactElement;
export declare function ScrollBar({ className, orientation, ...props }: ScrollAreaPrimitive.Scrollbar.Props): React.ReactElement;
export { ScrollAreaPrimitive };
