import { type ImgHTMLAttributes, type ReactNode } from "react";
export type ArticleImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    enableZoom?: boolean;
    sourceSizes?: Record<string, number[]>;
    imageSrc?: (original: string) => string;
    imageSrcSet?: (original: string) => string | undefined;
    imageOnError?: ImgHTMLAttributes<HTMLImageElement>["onError"];
    caption?: ReactNode;
    captionClassName?: string;
    plainTitle?: string;
    unknownSizeAspectRatio?: string;
};
export declare function ArticleImage({ className, alt, src, srcSet, title, width, height, style, enableZoom, sourceSizes, imageSrc, imageSrcSet, imageOnError, caption, captionClassName, plainTitle, unknownSizeAspectRatio, ...props }: ArticleImageProps): import("react").JSX.Element;
