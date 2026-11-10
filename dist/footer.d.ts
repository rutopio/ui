import type { ReactNode } from "react";
type FooterLink = {
    href: string;
    label: string;
};
export declare function AttributionFooter({ repository, author, partner, className, }: {
    repository: FooterLink;
    author: FooterLink;
    partner?: FooterLink;
    className?: string;
}): import("react").JSX.Element;
export declare function CelebrationFooter({ authorName, avatarSrc, onCelebrate, className, avatarClassName, children, }: {
    authorName: string;
    avatarSrc: string;
    onCelebrate: (element: HTMLButtonElement) => void;
    className?: string;
    avatarClassName?: string;
    children?: ReactNode;
}): import("react").JSX.Element;
export {};
