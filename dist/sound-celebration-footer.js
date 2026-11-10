import { jsx as _jsx } from "react/jsx-runtime";
import { CelebrationFooter } from "./footer.js";
import { useMountEffect } from "./use-mount-effect.js";
import { burstConfettiFrom } from "./confetti-burst.js";
import fill from "./sounds/fill.js";
import { playSound, preloadSound } from "./sounds/react-bits-sound.js";
const FILL_TUNE = { reverb: { mix: 0.25, decay: 1.4, tone: 0 } };
export function SoundCelebrationFooter(props) {
    useMountEffect(() => {
        preloadSound(fill, FILL_TUNE);
    });
    return (_jsx(CelebrationFooter, { ...props, onCelebrate: (element) => {
            burstConfettiFrom(element);
            playSound(fill, FILL_TUNE).catch(() => { });
        } }));
}
