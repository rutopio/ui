export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";
export type UsePopoverOptions = {
    open: boolean;
    side?: PopoverSide;
    align?: PopoverAlign;
    offset?: number;
    padding?: number;
    arrowSize?: number;
    boundary?: React.RefObject<HTMLElement | null>;
};
export type UsePopoverResult<A extends HTMLElement = HTMLElement> = {
    anchorRef: React.RefObject<A | null>;
    floatingRef: React.RefObject<HTMLDivElement | null>;
    panelRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    arrowRef: React.RefObject<HTMLSpanElement | null>;
    side: PopoverSide;
    update: () => void;
};
export declare function usePopover<A extends HTMLElement = HTMLElement>({ open, side, align, offset, padding, arrowSize, boundary, }: UsePopoverOptions): UsePopoverResult<A>;
export type PopoverProps = {
    trigger: React.ReactNode;
    children: React.ReactNode;
    label: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: PopoverSide;
    align?: PopoverAlign;
    offset?: number;
    padding?: number;
    arrowSize?: number;
    boundary?: React.RefObject<HTMLElement | null>;
    unstyledTrigger?: boolean;
    triggerClassName?: string;
    className?: string;
};
export declare function Popover({ trigger, children, label, open: controlled, defaultOpen, onOpenChange, side, align, offset, padding, arrowSize, boundary, unstyledTrigger, triggerClassName, className, }: PopoverProps): import("react").JSX.Element;
