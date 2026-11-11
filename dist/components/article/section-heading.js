import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SectionHeadingAnchor } from "./section-heading-anchor.js";
import { cn } from "../../lib/class-names.js";
export function SectionHeading({ level = 2, id, children, className, linkTitle, onLinkClick, ...props }) {
    const Heading = level === 3 ? "h3" : "h2";
    return (_jsxs(Heading, { id: id, className: cn("group flex items-center text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50", level === 2 ? "scroll-mt-14" : "scroll-m-20", className), ...props, children: [_jsx(SectionHeadingAnchor, { id: id, title: linkTitle, onClick: onLinkClick, children: children }), level === 2 && (_jsx("span", { "aria-hidden": "true", className: "ml-4 h-0.5 min-w-4 flex-1 scale-y-50 bg-border" }))] }));
}
