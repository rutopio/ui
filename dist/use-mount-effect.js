import { useEffect } from "react";
// For one-time synchronization with systems outside React. Callers should not
// use this to derive state that can be calculated during render.
export function useMountEffect(effect) {
    // biome-ignore lint/correctness/useExhaustiveDependencies: the mount-only contract is intentional
    useEffect(effect, []);
}
