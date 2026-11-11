import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../shared/class-names.js";
const buttonGroupVariants = cva("group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10", {
    variants: {
        orientation: {
            horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
            vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
        },
    },
    defaultVariants: { orientation: "horizontal" },
});
function ButtonGroup({ className, orientation, ...props }) {
    // biome-ignore lint/a11y/useSemanticElements: A fieldset changes the control layout and form behavior.
    return (_jsx("div", { role: "group", "data-slot": "button-group", "data-orientation": orientation, className: cn(buttonGroupVariants({ orientation }), className), ...props }));
}
export { ButtonGroup };
