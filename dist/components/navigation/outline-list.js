import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/class-names.js";
export function OutlineList({ items, activeId, onNavigate, indicator, className, }) {
    return (_jsx("ul", { className: cn("flex flex-col gap-1", className), children: items.map((item) => {
            const active = activeId === item.id;
            return (_jsx("li", { children: _jsxs("a", { href: item.href ?? `#${encodeURIComponent(item.id)}`, "data-active": active || undefined, "aria-current": active ? "location" : undefined, onClick: (event) => {
                        if (!onNavigate)
                            return;
                        event.preventDefault();
                        onNavigate(item.id);
                    }, className: "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:bg-muted", children: [_jsx("span", { className: cn("min-w-0", item.depth === 3 && "pl-6"), children: item.label }), _jsx("span", { className: cn("flex size-4 shrink-0 items-center justify-center", !active && "invisible"), "aria-hidden": "true", children: indicator })] }) }, item.id));
        }) }));
}
