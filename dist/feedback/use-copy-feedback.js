import { useCallback, useRef, useState } from "react";
import { useMountEffect } from "../shared/use-mount-effect.js";
/** Copy completion owns its timer; rendering never starts or restarts it. */
export function useCopyFeedback() {
    const [copied, setCopied] = useState(false);
    const timer = useRef(undefined);
    const mounted = useRef(false);
    const clearCopied = useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = undefined;
        if (mounted.current)
            setCopied(false);
    }, []);
    const showCopied = useCallback(() => {
        if (!mounted.current)
            return;
        window.clearTimeout(timer.current);
        setCopied(true);
        timer.current = window.setTimeout(() => {
            timer.current = undefined;
            setCopied(false);
        }, 2000);
    }, []);
    useMountEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            window.clearTimeout(timer.current);
        };
    });
    return [copied, showCopied, clearCopied];
}
