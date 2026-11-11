import { Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FluidHoverControls } from "../motion/fluid-hover-controls.js";
import { cn } from "../shared/class-names.js";
export function PageActionRail({ label, mobileOutline, desktopOutline, actions, }) {
    return (_jsxs(_Fragment, { children: [_jsxs(FluidHoverControls, { buttonGroup: true, orientation: "horizontal", label: label, className: cn("fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 h-fit", "min-[50rem]:hidden"), children: [mobileOutline, actions] }), _jsxs(FluidHoverControls, { buttonGroup: true, orientation: "vertical", label: label, className: cn("fixed top-1/2 left-[var(--gutter-offset)] z-10 h-fit -translate-y-1/2", "hidden min-[50rem]:flex"), children: [desktopOutline, actions] })] }));
}
