import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AtIcon } from "@phosphor-icons/react";
import { useCopyFeedback } from "../../hooks/use-copy-feedback.js";
import { CopyFeedbackIcon } from "./copy-feedback-icon.js";
import { Popover } from "../ui/popover.js";
import { Button } from "../ui/button.js";
export function EmailPopover({ email, trigger, triggerClassName }) {
    const [emailLocal, emailDomain] = email.split("@");
    const obfuscated = `${emailLocal}[AT]${emailDomain}`;
    const [copied, showCopied] = useCopyFeedback();
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(obfuscated);
            showCopied();
        }
        catch {
            // Clipboard unavailable; leave the address visible for manual copying.
        }
    };
    return (_jsx(Popover, { label: "Email contact", side: "bottom", align: "start", offset: 8, unstyledTrigger: true, trigger: trigger, triggerClassName: triggerClassName, className: "w-fit max-w-[calc(100vw-1rem)]", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "flex-1 rounded-md bg-muted px-3 py-2 font-sans text-base", children: [emailLocal, _jsx(AtIcon, { size: 16, "aria-label": "at", className: "mx-px inline" }), emailDomain] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: handleCopy, className: "shrink-0", "aria-label": copied ? "Email copied" : "Copy email", children: _jsx(CopyFeedbackIcon, { copied: copied }) })] }) }));
}
