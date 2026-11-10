import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState, } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, } from "./drawer.js";
export function useSearchCommand({ open: openProp, onOpenChange, onOpen, } = {}) {
    const [openState, setOpenState] = useState(false);
    const open = openProp ?? openState;
    const openRef = useRef(open);
    openRef.current = open;
    const setOpen = useCallback((value) => {
        const next = typeof value === "function" ? value(openRef.current) : value;
        if (next)
            onOpen?.();
        if (openProp === undefined)
            setOpenState(next);
        onOpenChange?.(next);
    }, [onOpen, onOpenChange, openProp]);
    const setOpenRef = useRef(setOpen);
    setOpenRef.current = setOpen;
    // A global key handler needs one subscription; the ref keeps it current.
    const subscribeShortcut = useCallback(() => {
        const onKey = (event) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpenRef.current((current) => !current);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);
    return { open, setOpen, subscribeShortcut };
}
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
