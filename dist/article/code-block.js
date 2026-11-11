import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Button } from "../primitives/button.js";
import { CopyFeedbackIcon } from "../feedback/copy-feedback-icon.js";
/** A shared pre renderer; syntax highlighting is supplied at build time. */
export function CodeBlock({ children, ...props }) {
    const preRef = useRef(null);
    const [feedback, setFeedback] = useState(null);
    useEffect(() => {
        if (feedback?.kind !== "copied")
            return;
        const timer = setTimeout(() => setFeedback(null), 2000);
        return () => clearTimeout(timer);
    }, [feedback]);
    async function copyCode() {
        const code = preRef.current?.querySelector("code");
        if (!code)
            return;
        try {
            await navigator.clipboard.writeText(code.textContent ?? "");
            setFeedback({ kind: "copied" });
        }
        catch {
            setFeedback({ kind: "error" });
        }
    }
    const copied = feedback?.kind === "copied";
    return (_jsxs("div", { className: "base-code-block", children: [_jsx(Button, { type: "button", variant: "outline", size: "icon-sm", className: "base-code-block-copy", onClick: copyCode, "aria-label": copied ? "Copied" : "Copy code", title: copied ? "Copied" : "Copy code", children: _jsx(CopyFeedbackIcon, { copied: copied }) }), _jsx("pre", { ...props, ref: preRef, children: children }), _jsx("p", { role: "status", className: feedback?.kind === "error" ? "base-code-block-error" : "sr-only", children: feedback?.kind === "error" ? "Unable to copy. Select the code and copy it manually." : copied ? "Code copied." : "" })] }));
}
