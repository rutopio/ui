import { useState } from "react";
import { useCopyFeedback } from "./use-copy-feedback.js";
import { getSocialShareTargets } from "../lib/feedback/page-share.js";
export function usePageShare({ fallbackUrl = "", onCopied, onCopyError, } = {}) {
    const [open, setOpen] = useState(false);
    const [copied, showCopied] = useCopyFeedback();
    const shareUrl = typeof window !== "undefined" ? window.location.href : fallbackUrl;
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            showCopied();
            onCopied?.(shareUrl);
        }
        catch {
            onCopyError?.();
        }
    };
    const share = async () => {
        if (window.matchMedia("(pointer: coarse)").matches && navigator.share) {
            try {
                await navigator.share({ title: document.title, url: shareUrl });
            }
            catch (error) {
                if (!(error instanceof Error && error.name === "AbortError"))
                    setOpen(true);
            }
            return;
        }
        setOpen(true);
    };
    return {
        open,
        setOpen,
        copied,
        shareUrl,
        targets: getSocialShareTargets(shareUrl),
        copy,
        share,
    };
}
