import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Render behind the consuming app's development-mode guard. */
export function BreakpointIndicator() {
    return (_jsxs("div", { "aria-hidden": "true", className: "pointer-events-none fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex size-8 items-center justify-center rounded-full bg-gray-800 font-mono text-xs text-white", children: [_jsx("span", { className: "sm:hidden", children: "xs" }), _jsx("span", { className: "hidden sm:block md:hidden", children: "sm" }), _jsx("span", { className: "hidden md:block lg:hidden", children: "md" }), _jsx("span", { className: "hidden lg:block xl:hidden", children: "lg" }), _jsx("span", { className: "hidden xl:block 2xl:hidden", children: "xl" }), _jsx("span", { className: "hidden 2xl:block", children: "2xl" })] }));
}
