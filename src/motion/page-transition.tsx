import { motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import type { ComponentProps } from "react";
import { transitions } from "./motion.js";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Key this component by pathname; query and hash updates retain page state. */
export function PageTransition({
  children,
}: Pick<ComponentProps<"div">, "children">) {
  const reducedMotion = useReducedMotion();
  const clientReady = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  return (
    <motion.div
      initial={clientReady && !reducedMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? transitions.instant : transitions.page}
      className="flex min-h-full min-w-0 w-full flex-auto flex-col"
    >
      {children}
    </motion.div>
  );
}
