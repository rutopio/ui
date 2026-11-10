import { useState } from "react";
import { isScrollLocked } from "./is-scroll-locked.js";
import { useMountEffect } from "./use-mount-effect.js";
/** A 0–1 reading position across the entire document. */
export function usePageScrollProgress() {
    const [progress, setProgress] = useState(0);
    useMountEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            if (isScrollLocked())
                return;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(scrollable > 0
                ? Math.min(1, Math.max(0, window.scrollY / scrollable))
                : 1);
        };
        const schedule = () => {
            if (frame === 0)
                frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        const observer = new ResizeObserver(schedule);
        observer.observe(document.body);
        return () => {
            if (frame !== 0)
                cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            observer.disconnect();
        };
    });
    return progress;
}
