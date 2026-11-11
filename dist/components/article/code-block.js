import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { useCopyFeedback } from "../../hooks/use-copy-feedback.js";
import { Button } from "../ui/button.js";
import { CopyFeedbackIcon } from "../feedback/copy-feedback-icon.js";
/** A shared pre renderer; syntax highlighting is supplied at build time. */
export function CodeBlock({ children, ...props }) {
    const preRef = useRef(null);
    const [copied, showCopied, clearCopied] = useCopyFeedback();
    const [copyError, setCopyError] = useState(false);
    async function copyCode() {
        const code = preRef.current?.querySelector("code");
        if (!code)
            return;
        try {
            await navigator.clipboard.writeText(code.textContent ?? "");
            setCopyError(false);
            showCopied();
        }
        catch {
            clearCopied();
            setCopyError(true);
        }
    }
    return (_jsxs("div", { className: "base-code-block", children: [_jsx(Button, { type: "button", variant: "outline", size: "icon-sm", className: "base-code-block-copy", onClick: copyCode, "aria-label": copied ? "Copied" : "Copy code", title: copied ? "Copied" : "Copy code", children: _jsx(CopyFeedbackIcon, { copied: copied }) }), _jsx("pre", { ...props, ref: preRef, children: children }), _jsx("p", { role: "status", className: copyError ? "base-code-block-error" : "sr-only", children: copyError ? "Unable to copy. Select the code and copy it manually." : copied ? "Code copied." : "" })] }));
}
