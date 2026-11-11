import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "../primitives/drawer.js";
import { FluidHoverControls } from "../motion/fluid-hover-controls.js";
import { cn } from "../shared/utils.js";
export function HeaderNavigation({ items, renderLink, label, title, menuIcon, selectedIcon, }) {
    const [open, setOpen] = useState(false);
    const routeLinkClass = "flex h-9 items-center whitespace-nowrap rounded-lg px-3 font-semibold text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
    const drawerLinkClass = "flex min-h-10 items-center justify-between rounded-lg px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted";
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden", children: _jsxs(Drawer, { open: open, onOpenChange: setOpen, children: [_jsx(DrawerTrigger, { render: _jsx("button", { type: "button", "aria-label": label, className: cn("base-header-action inline-flex size-9 items-center justify-center rounded-md border border-transparent text-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"), children: menuIcon }) }), _jsxs(DrawerContent, { children: [_jsx(DrawerHeader, { className: "border-border border-b pb-4", children: _jsx(DrawerTitle, { children: title }) }), _jsx("nav", { "aria-label": label, className: "flex flex-col gap-1 px-4 pt-4 pb-6", children: items.map((item) => (_jsx(Fragment, { children: renderLink(item, {
                                            className: drawerLinkClass,
                                            onClick: () => setOpen(false),
                                            ariaCurrent: item.active ? "page" : undefined,
                                            children: (_jsxs(_Fragment, { children: [item.label, item.active && selectedIcon] })),
                                        }) }, item.id))) })] })] }) }), _jsx(FluidHoverControls, { label: label, className: "hidden md:flex", children: items.map((item) => (_jsx(Fragment, { children: renderLink(item, {
                        className: cn(routeLinkClass, item.active && "bg-muted"),
                        ariaCurrent: item.active ? "page" : undefined,
                        children: item.label,
                    }) }, item.id))) })] }));
}
export function SiteHeader({ brand, navigation, actions, label, actionsLabel, className, }) {
    return (_jsx("header", { className: cn("w-full", className), children: _jsxs("nav", { "aria-label": label, className: cn("relative flex w-full items-center justify-between pt-6 sm:pt-12"), children: [_jsxs("div", { className: "flex min-w-0 items-center gap-1 sm:gap-2", children: [brand, navigation] }), _jsx(FluidHoverControls, { compact: true, label: actionsLabel, className: "base-site-header-actions", children: actions })] }) }));
}
