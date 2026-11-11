import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button.js";
export const NOT_FOUND_TITLE = "404 Page Not Found";
export function NotFound({ homeLink, }) {
    return (_jsxs(_Fragment, { children: [_jsx("title", { children: NOT_FOUND_TITLE }), _jsx("meta", { name: "robots", content: "noindex" }), _jsxs("section", { className: "flex flex-auto flex-col items-center justify-center gap-8 py-24 text-center font-heading", children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("h1", { className: "text-balance font-bold text-base leading-[1.65]", children: NOT_FOUND_TITLE }), _jsx("p", { className: "max-w-md text-pretty font-semibold text-base text-muted-foreground leading-[1.65]", children: "It looks like you are lost in cosmos!" })] }), _jsxs(Button, { variant: "outline", nativeButton: false, render: homeLink ?? _jsx("a", { href: "/" }), children: [_jsx(ArrowLeftIcon, { className: "size-4", "aria-hidden": "true" }), "Back to Home"] })] })] }));
}
