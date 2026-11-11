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
