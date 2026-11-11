import { spring } from "./springs.js";
export { spring };

/** Existing site motion, named by purpose rather than by the consuming site. */
export const transitions = {
  iconSwap: { ...spring.slow, bounce: 0 },
  gentleFade: { ...spring.moderate.exit, ease: "easeOut" },
  instant: { duration: 0 },
  page: { duration: 0.2, ease: "easeOut" },
  content: { duration: 0.18, ease: "easeOut" },
  progress: { type: "spring", stiffness: 200, damping: 30, mass: 0.4 },
} as const;
