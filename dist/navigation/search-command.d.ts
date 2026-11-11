import { type ReactNode, type RefObject } from "react";
export declare function useSearchCommand({ open: openProp, onOpenChange, onOpen, }?: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => void;
}): {
    open: boolean;
    setOpen: (value: boolean | ((open: boolean) => boolean)) => void;
    subscribeShortcut: () => () => void;
};
export declare function SearchHighlight({ text, ranges, }: {
    text: string;
    ranges: [number, number][];
}): import("react").JSX.Element;
export declare function SearchMobileDrawer({ open, onOpenChange, inputRef, title, description, children, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    title: string;
    description: string;
    children: ReactNode;
}): import("react").JSX.Element;
