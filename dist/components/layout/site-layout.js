import { jsx as _jsx } from "react/jsx-runtime";
/** The shared page frame. Wider workspaces belong inside the content area. */
export function SiteLayout(props) {
    return (_jsx("div", { className: "mx-auto flex min-h-full w-full max-w-2xl flex-col px-6", ...props }));
}
