import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, TranslateIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ActionMenu } from "./action-menu.js";
import { Button } from "../ui/button.js";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "../ui/drawer.js";
export function LanguageToggle({ label, current, options, onChange, isNarrowViewport, className, }) {
    const [open, setOpen] = useState(false);
    if (isNarrowViewport) {
        return (_jsxs(Drawer, { open: open, onOpenChange: setOpen, children: [_jsx(DrawerTrigger, { render: _jsx(Button, { variant: "ghost", size: "icon", className: className, "aria-label": label, children: _jsx(TranslateIcon, { "aria-hidden": "true" }) }) }), _jsxs(DrawerContent, { children: [_jsx(DrawerHeader, { className: "border-border border-b pb-4", children: _jsx(DrawerTitle, { children: label }) }), _jsx("div", { className: "flex flex-col gap-1 px-4 pt-4 pb-6", children: options.map((option) => (_jsxs("button", { type: "button", lang: option.htmlLang, "aria-current": current === option.value ? "true" : undefined, className: "flex min-h-10 items-center justify-between rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=true]:bg-muted", onClick: () => {
                                    setOpen(false);
                                    onChange(option.value);
                                }, children: [option.label, current === option.value && (_jsx(CheckIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }))] }, option.value))) })] })] }));
    }
    return (_jsx(ActionMenu, { label: label, trigger: _jsx(TranslateIcon, { className: "size-4", "aria-hidden": "true" }), triggerClassName: className, openOnHover: true, indicator: _jsx(CheckIcon, { className: "size-4", "aria-hidden": "true" }), items: options.map((option) => ({
            id: option.value,
            label: option.label,
            lang: option.htmlLang,
            active: current === option.value,
            ariaCurrent: current === option.value ? "true" : undefined,
            onSelect: () => onChange(option.value),
        })) }));
}
