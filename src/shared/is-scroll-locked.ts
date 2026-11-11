/**
 * True while something has locked body scrolling by pinning it with
 * `position: fixed` (the technique react-medium-image-zoom uses when a zoom is
 * open). During that lock `window.scrollY` reads 0, which would make any
 * scroll-driven measurement snap to its top-of-page value and then flash back
 * when the lock is released. Scroll listeners can use this to skip updating
 * while the page is frozen.
 */
export function isScrollLocked(): boolean {
  if (typeof document === "undefined") return false;
  return document.body.style.position === "fixed";
}
