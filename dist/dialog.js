import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XIcon } from "@phosphor-icons/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "./button.js";
import { cn } from "./utils.js";
function Dialog({ ...props }) {
    return _jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({ ...props }) {
    return _jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogClose({ ...props }) {
    return _jsx(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogPortal({ ...props }) {
    return _jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({ className, ...props }) {
    return (_jsx(DialogPrimitive.Backdrop, { "data-slot": "dialog-overlay", className: cn("fixed inset-0 isolate z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className), ...props }));
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return (_jsxs(DialogPortal, { children: [_jsx(DialogOverlay, {}), _jsxs(DialogPrimitive.Popup, { "data-slot": "dialog-content", className: cn("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-base text-popover-foreground ring-1 ring-foreground/10 outline-none transition duration-200 ease-out sm:max-w-md data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0", className), ...props, children: [children, showCloseButton && (_jsx(DialogPrimitive.Close, { "data-slot": "dialog-close", render: _jsxs(Button, { variant: "ghost", className: "absolute top-4 right-4", size: "icon-sm", children: [_jsx(XIcon, {}), _jsx("span", { className: "sr-only", children: "Close" })] }) }))] })] }));
}
function DialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "dialog-header", className: cn("flex flex-col gap-2", className), ...props }));
}
function DialogFooter({ className, children, ...props }) {
    return (_jsx("div", { "data-slot": "dialog-footer", className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props, children: children }));
}
function DialogTitle({ className, ...props }) {
    return (_jsx(DialogPrimitive.Title, { "data-slot": "dialog-title", className: cn("font-heading text-balance text-lg leading-none font-semibold", className), ...props }));
}
function DialogDescription({ className, ...props }) {
    return (_jsx(DialogPrimitive.Description, { "data-slot": "dialog-description", className: cn("text-pretty text-base text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className), ...props }));
}
export { Dialog, DialogClose, DialogContent, DialogFooter, DialogOverlay, DialogPortal, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, };
