import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Command as CommandPrimitive } from "cmdk";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, } from "./dialog.js";
import { cn } from "../shared/class-names.js";
function Command({ className, ...props }) {
    return (_jsx(CommandPrimitive, { "data-slot": "command", className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className), ...props }));
}
function CommandDialog({ title = "Search", description = "Search by title or content", children, className, shouldFilter, ...props }) {
    return (_jsx(Dialog, { ...props, children: _jsxs(DialogContent, { showCloseButton: false, className: cn("overflow-hidden p-0", className), children: [_jsx(DialogTitle, { className: "sr-only", children: title }), _jsx(DialogDescription, { className: "sr-only", children: description }), _jsx(Command, { shouldFilter: shouldFilter, className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5", children: children })] }) }));
}
function CommandInput({ className, ...props }) {
    return (_jsxs("div", { "data-slot": "command-input-wrapper", className: "flex items-center gap-2 border-b px-3", "cmdk-input-wrapper": "", children: [_jsx(MagnifyingGlassIcon, { className: "size-4 shrink-0 opacity-50", "aria-hidden": "true" }), _jsx(CommandPrimitive.Input, { "data-slot": "command-input", className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-base outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className), ...props })] }));
}
function CommandList({ className, ...props }) {
    return (_jsx(CommandPrimitive.List, { "data-slot": "command-list", className: cn("max-h-[320px] scroll-py-1 overflow-x-hidden overflow-y-auto", className), ...props }));
}
function CommandEmpty({ ...props }) {
    return (_jsx(CommandPrimitive.Empty, { "data-slot": "command-empty", className: "py-6 text-center text-base", ...props }));
}
function CommandGroup({ className, ...props }) {
    return (_jsx(CommandPrimitive.Group, { "data-slot": "command-group", className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-sm", className), ...props }));
}
function CommandItem({ className, ...props }) {
    return (_jsx(CommandPrimitive.Item, { "data-slot": "command-item", className: cn("relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-base outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0", className), ...props }));
}
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, };
