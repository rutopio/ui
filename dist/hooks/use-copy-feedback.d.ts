/** Copy completion owns its timer; rendering never starts or restarts it. */
export declare function useCopyFeedback(): readonly [boolean, () => void, () => void];
