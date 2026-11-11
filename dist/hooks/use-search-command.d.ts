export declare function useSearchCommand({ open: openProp, onOpenChange, onOpen, }?: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpen?: () => void;
}): {
    open: boolean;
    setOpen: (value: boolean | ((open: boolean) => boolean)) => void;
    subscribeShortcut: () => () => void;
};
