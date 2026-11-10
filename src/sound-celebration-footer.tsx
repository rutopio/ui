import type { ComponentProps } from "react";
import { CelebrationFooter } from "./footer.js";
import { useMountEffect } from "./use-mount-effect.js";
import { burstConfettiFrom } from "./confetti-burst.js";
import fill from "./sounds/fill.js";
import { playSound, preloadSound } from "./sounds/react-bits-sound.js";

const FILL_TUNE = { reverb: { mix: 0.25, decay: 1.4, tone: 0 } };

type Props = Omit<ComponentProps<typeof CelebrationFooter>, "onCelebrate">;

export function SoundCelebrationFooter(props: Props) {
  useMountEffect(() => {
    preloadSound(fill, FILL_TUNE);
  });

  return (
    <CelebrationFooter
      {...props}
      onCelebrate={(element) => {
        burstConfettiFrom(element);
        playSound(fill, FILL_TUNE).catch(() => {});
      }}
    />
  );
}
