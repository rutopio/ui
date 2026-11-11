import { spring } from "./springs.js";
export { spring };
/** Existing site motion, named by purpose rather than by the consuming site. */
export declare const transitions: {
    readonly iconSwap: {
        readonly type: "spring";
        readonly duration: 0.24;
        readonly exit: {
            readonly duration: 0.16;
        };
        readonly bounce: 0;
    };
    readonly gentleFade: {
        readonly duration: 0.12;
        readonly ease: "easeOut";
    };
    readonly instant: {
        readonly duration: 0;
    };
    readonly page: {
        readonly duration: 0.2;
        readonly ease: "easeOut";
    };
    readonly content: {
        readonly duration: 0.18;
        readonly ease: "easeOut";
    };
    readonly progress: {
        readonly type: "spring";
        readonly stiffness: 200;
        readonly damping: 30;
        readonly mass: 0.4;
    };
};
