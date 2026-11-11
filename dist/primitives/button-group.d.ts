import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
declare const buttonGroupVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ButtonGroup({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>): React.JSX.Element;
export { ButtonGroup };
