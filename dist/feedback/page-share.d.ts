export declare function getSocialShareTargets(url: string): readonly [{
    readonly label: "Facebook";
    readonly url: `https://www.facebook.com/sharer/sharer.php?u=${string}`;
}, {
    readonly label: "X";
    readonly url: `https://twitter.com/intent/tweet?url=${string}`;
}, {
    readonly label: "Threads";
    readonly url: `https://www.threads.net/intent/post?url=${string}`;
}];
export declare function openShareWindow(url: string): void;
export declare function shareOrCopyCurrentPage({ onCopied, onShareError, onCopyError, }: {
    onCopied: () => void;
    onShareError: () => void;
    onCopyError: () => void;
}): Promise<void>;
export declare function usePageShare({ fallbackUrl, onCopied, onCopyError, }?: {
    fallbackUrl?: string;
    onCopied?: (url: string) => void;
    onCopyError?: () => void;
}): {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    copied: boolean;
    shareUrl: string;
    targets: readonly [{
        readonly label: "Facebook";
        readonly url: `https://www.facebook.com/sharer/sharer.php?u=${string}`;
    }, {
        readonly label: "X";
        readonly url: `https://twitter.com/intent/tweet?url=${string}`;
    }, {
        readonly label: "Threads";
        readonly url: `https://www.threads.net/intent/post?url=${string}`;
    }];
    copy: () => Promise<void>;
    share: () => Promise<void>;
};
