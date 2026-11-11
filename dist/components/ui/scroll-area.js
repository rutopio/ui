"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "../../lib/class-names.js";
export function ScrollArea({ className, viewportClassName, viewportRef, children, scrollFade = false, scrollbarGutter = false, fill = false, clampContentMinWidth = true, overscrollContain = false, ...props }) {
    return (_jsxs(ScrollAreaPrimitive.Root, { "data-slot": "scroll-area", className: cn("size-full min-h-0", className), ...props, children: [_jsx(ScrollAreaPrimitive.Viewport, { ref: viewportRef, className: cn("h-full rounded-[inherit] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background", overscrollContain &&
                    "data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain", scrollFade &&
                    "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]", scrollbarGutter &&
                    "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5", viewportClassName), "data-slot": "scroll-area-viewport", children: _jsx(ScrollAreaPrimitive.Content, { className: cn(fill && "size-full"), "data-slot": "scroll-area-content", style: clampContentMinWidth ? { minWidth: 0 } : undefined, children: children }) }), _jsx(ScrollBar, { orientation: "vertical" }), _jsx(ScrollBar, { orientation: "horizontal" }), _jsx(ScrollAreaPrimitive.Corner, { "data-slot": "scroll-area-corner" })] }));
}
export function ScrollBar({ className, orientation = "vertical", ...props }) {
    return (_jsx(ScrollAreaPrimitive.Scrollbar, { className: cn("m-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100", className), "data-slot": "scroll-area-scrollbar", orientation: orientation, ...props, children: _jsx(ScrollAreaPrimitive.Thumb, { className: "relative flex-1 rounded-full bg-foreground/20", "data-slot": "scroll-area-thumb" }) }));
}
export { ScrollAreaPrimitive };
