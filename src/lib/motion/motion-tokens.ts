import { springPresets } from "./spring-presets.js";
export { springPresets };

/** Existing site motion, named by purpose rather than by the consuming site. */
export const motionTransitions = {
  iconSwap: { ...springPresets.slow, bounce: 0 },
  gentleFade: { ...springPresets.moderate.exit, ease: "easeOut" },
  instant: { duration: 0 },
  page: { duration: 0.2, ease: "easeOut" },
  content: { duration: 0.18, ease: "easeOut" },
  progress: { type: "spring", stiffness: 200, damping: 30, mass: 0.4 },
} as const;
