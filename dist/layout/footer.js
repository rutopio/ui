import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../shared/class-names.js";
const linkClass = "rounded-sm hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring";
export function AttributionFooter({ repository, author, partner, className, }) {
    const authorLink = (_jsx("a", { href: author.href, target: "_blank", rel: "noopener noreferrer", className: linkClass, children: author.label }));
    return (_jsx("footer", { className: cn("mt-auto w-full", className), children: _jsx("div", { className: "w-full py-12 text-center font-mono text-muted-foreground text-sm", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("a", { href: repository.href, target: "_blank", rel: "noopener noreferrer", className: cn("block", linkClass), children: repository.label }), partner ? (_jsxs("p", { children: [authorLink, " ", " / ", " ", _jsx("a", { href: partner.href, target: "_blank", rel: "noopener noreferrer", className: linkClass, children: partner.label })] })) : (authorLink)] }) }) }));
}
export function CelebrationFooter({ authorName, avatarSrc, onCelebrate, className, avatarClassName, children, }) {
    return (_jsx("footer", { className: cn("mt-12 flex w-full justify-center py-12", className), children: _jsx("button", { type: "button", "aria-label": `Celebrate ${authorName}`, className: "footer-celebrate-button size-20 rounded-full", onClick: (event) => onCelebrate(event.currentTarget), children: children ?? (_jsx("img", { src: avatarSrc, alt: "", "aria-hidden": "true", className: cn("size-full dark:invert", avatarClassName) })) }) }));
}
