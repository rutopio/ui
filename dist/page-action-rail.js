import { jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FluidHoverControls } from "./fluid-hover-controls.js";
import { cn } from "./utils.js";
export function PageActionRail({ label, mobileOutline, desktopOutline, actions, desktopVisible, }) {
    return (_jsxs(_Fragment, { children: [_jsxs(FluidHoverControls, { buttonGroup: true, orientation: "horizontal", label: label, className: cn("fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 h-fit", desktopVisible === undefined
                    ? "min-[50rem]:hidden"
                    : desktopVisible && "hidden"), children: [mobileOutline, actions] }), _jsxs(FluidHoverControls, { buttonGroup: true, orientation: "vertical", label: label, className: cn("fixed top-1/2 left-[var(--gutter-offset)] z-10 h-fit -translate-y-1/2", desktopVisible === undefined
                    ? "hidden min-[50rem]:flex"
                    : !desktopVisible && "hidden"), children: [desktopOutline, actions] })] }));
}
