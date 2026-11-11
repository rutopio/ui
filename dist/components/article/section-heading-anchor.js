import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LinkIcon } from "@phosphor-icons/react";
export function SectionHeadingAnchor({ id, children, title, onClick, }) {
    if (!id)
        return _jsx("span", { children: children });
    return (_jsxs("a", { href: `#${id}`, title: title, onClick: onClick, className: "relative inline text-inherit no-underline", children: [_jsx("span", { className: "absolute top-1/2 -left-6 flex h-4 w-5 -translate-y-1/2 items-center justify-end opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 sm:-left-8", "aria-hidden": "true", children: _jsx(LinkIcon, { className: "size-4 text-neutral-400 dark:text-neutral-500" }) }), children] }));
}
