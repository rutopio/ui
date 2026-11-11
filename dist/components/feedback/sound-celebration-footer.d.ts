import type { ComponentProps } from "react";
import { CelebrationFooter } from "../layout/footer.js";
type Props = Omit<ComponentProps<typeof CelebrationFooter>, "onCelebrate">;
export declare function SoundCelebrationFooter(props: Props): import("react").JSX.Element;
export {};
