import { jsx as _jsx } from "react/jsx-runtime";
import { motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import { motionTransitions } from "./motion-tokens.js";
const subscribe = () => () => { };
const clientSnapshot = () => true;
const serverSnapshot = () => false;
/** Key this component by pathname; query and hash updates retain page state. */
export function PageTransition({ children, }) {
    const reducedMotion = useReducedMotion();
    const clientReady = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
    return (_jsx(motion.div, { initial: clientReady && !reducedMotion ? { opacity: 0 } : false, animate: { opacity: 1 }, transition: reducedMotion ? motionTransitions.instant : motionTransitions.page, className: "flex min-h-full min-w-0 w-full flex-auto flex-col", children: children }));
}
