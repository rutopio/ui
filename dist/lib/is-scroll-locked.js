/** Body pinning during image zoom resets scrollY to zero; preserve scroll-driven state until unlock. */
export function isScrollLocked() {
    if (typeof document === "undefined")
        return false;
    return document.body.style.position === "fixed";
}
