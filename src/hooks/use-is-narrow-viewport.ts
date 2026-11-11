import { useSyncExternalStore } from "react";

const NARROW_VIEWPORT_QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(NARROW_VIEWPORT_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(NARROW_VIEWPORT_QUERY).matches;
}

export function useIsNarrowViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
