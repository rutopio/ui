import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, } from "../ui/drawer.js";
export { useSearchCommand } from "../../hooks/use-search-command.js";
export function SearchHighlight({ text, ranges, }) {
    if (ranges.length === 0)
        return _jsx(_Fragment, { children: text });
    const parts = [];
    let cursor = 0;
    for (const [start, end] of ranges) {
        if (start > cursor)
            parts.push(text.slice(cursor, start));
        parts.push(_jsxs("mark", { className: "rounded-sm bg-primary/20 px-0.5 text-foreground", children: [" ", text.slice(start, end), " "] }, start));
        cursor = end;
    }
    if (cursor < text.length)
        parts.push(text.slice(cursor));
    return _jsx(_Fragment, { children: parts });
}
export function SearchMobileDrawer({ open, onOpenChange, inputRef, title, description, children, }) {
    return (_jsx(Drawer, { open: open, onOpenChange: onOpenChange, children: _jsxs(DrawerContent, { className: "h-[70dvh]", initialFocus: inputRef, children: [_jsxs(DrawerHeader, { className: "sr-only", children: [_jsx(DrawerTitle, { children: title }), _jsx(DrawerDescription, { children: description })] }), children] }) }));
}
