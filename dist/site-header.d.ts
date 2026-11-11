import { type ReactNode } from "react";
export type HeaderNavItem = {
    id: string;
    label: string;
    href: string;
    active: boolean;
};
export type HeaderLinkProps = {
    className: string;
    onClick?: () => void;
    ariaCurrent?: "page";
    children: ReactNode;
};
export declare function HeaderNavigation({ items, renderLink, label, title, menuIcon, selectedIcon, }: {
    items: HeaderNavItem[];
    renderLink: (item: HeaderNavItem, props: HeaderLinkProps) => ReactNode;
    label: string;
    title: string;
    menuIcon: ReactNode;
    selectedIcon: ReactNode;
}): import("react").JSX.Element;
export declare function SiteHeader({ brand, navigation, actions, label, actionsLabel, className, }: {
    brand: ReactNode;
    navigation?: ReactNode;
    actions: ReactNode;
    label: string;
    actionsLabel?: string;
    className?: string;
}): import("react").JSX.Element;
