import { useCallback, useEffect, useRef, useState } from "react";
/** Each successful copy starts a fresh feedback interval. */
export function useCopyFeedback() {
    const [copyId, setCopyId] = useState(null);
    const nextId = useRef(0);
    const showCopied = useCallback(() => setCopyId(++nextId.current), []);
    useEffect(() => {
        if (copyId === null)
            return;
        const timer = window.setTimeout(() => setCopyId(null), 2000);
        return () => window.clearTimeout(timer);
    }, [copyId]);
    return [copyId !== null, showCopied];
}
