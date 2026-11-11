import { jsx as _jsx } from "react/jsx-runtime";
import { CheckCircleIcon, CircleNotchIcon, InfoIcon, WarningIcon, XCircleIcon, } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
const Toaster = ({ ...props }) => {
    const { theme = "system" } = useTheme();
    return (_jsx(Sonner, { theme: theme, className: "toaster group", icons: {
            success: _jsx(CheckCircleIcon, { className: "size-4" }),
            info: _jsx(InfoIcon, { className: "size-4" }),
            warning: _jsx(WarningIcon, { className: "size-4" }),
            error: _jsx(XCircleIcon, { className: "size-4" }),
            loading: (_jsx(CircleNotchIcon, { className: "size-4 animate-spin motion-reduce:animate-none" })),
        }, style: {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "var(--radius)",
        }, ...props }));
};
export { Toaster };
