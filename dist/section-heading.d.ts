import type { HTMLAttributes, MouseEventHandler } from "react";
export declare function SectionHeading({ level, id, children, className, linkTitle, onLinkClick, ...props }: HTMLAttributes<HTMLHeadingElement> & {
    level?: 2 | 3;
    linkTitle?: string;
    onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}): import("react").JSX.Element;
