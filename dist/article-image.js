import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { SpinnerGapIcon } from "@phosphor-icons/react";
import { cloneElement, useCallback, useState, } from "react";
import Zoom from "react-medium-image-zoom";
import { cn } from "./utils.js";
function ZoomLoaderContent({ img, isZoomImgLoaded, buttonUnzoom, }) {
    const [imgComplete, setImgComplete] = useState(false);
    const setRef = useCallback((element) => {
        if (element?.complete)
            setImgComplete(true);
    }, []);
    const loaded = isZoomImgLoaded || imgComplete;
    const imgWithRef = img
        ? cloneElement(img, {
            ref: setRef,
            onLoad: () => setImgComplete(true),
        })
        : img;
    return (_jsxs(_Fragment, { children: [buttonUnzoom, imgWithRef, _jsx("span", { "aria-hidden": loaded, className: cn("pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-[120ms] ease-out", loaded ? "opacity-0" : "opacity-100"), children: _jsx(SpinnerGapIcon, { className: cn("size-8 text-white drop-shadow", !loaded && "animate-spin"), "aria-label": "Loading full-size image" }) })] }));
}
export function ArticleImage({ className, alt, src, srcSet, title, width, height, style, enableZoom = false, sourceSizes, imageSrc, imageSrcSet, imageOnError, caption, captionClassName, plainTitle, unknownSizeAspectRatio, ...props }) {
    const original = typeof src === "string" ? src : undefined;
    const sourceSize = original ? sourceSizes?.[original] : undefined;
    const imageWidth = width ?? sourceSize?.[0];
    const imageHeight = height ?? sourceSize?.[1];
    const numericWidth = Number(imageWidth);
    const numericHeight = Number(imageHeight);
    const hasSize = numericWidth > 0 && numericHeight > 0;
    const [measuredPortrait, setMeasuredPortrait] = useState(false);
    const portrait = hasSize
        ? numericHeight / numericWidth >= 1.05
        : measuredPortrait;
    const measure = useCallback((element) => {
        if (!hasSize && element?.naturalWidth) {
            setMeasuredPortrait(element.naturalHeight / element.naturalWidth >= 1.05);
        }
    }, [hasSize]);
    const onLoad = useCallback((event) => measure(event.currentTarget), [measure]);
    const img = (_jsx("img", { className: cn("mx-auto rounded-sm outline outline-1 outline-black/10 dark:outline-white/10", portrait ? "h-[70dvh] w-auto max-w-full" : "w-full", enableZoom && "cursor-zoom-in", className), src: original && imageSrc ? imageSrc(original) : src, srcSet: srcSet ?? (original ? imageSrcSet?.(original) : undefined), sizes: "(max-width: 768px) 100vw, 768px", alt: alt, title: plainTitle ?? title, width: imageWidth, height: imageHeight, style: {
            aspectRatio: hasSize ? undefined : unknownSizeAspectRatio,
            ...style,
        }, loading: "lazy", decoding: "async", ref: measure, onLoad: onLoad, "data-fallback": original, onError: imageOnError, ...props }));
    const zoomed = enableZoom ? (_jsx(Zoom, { zoomMargin: 24, classDialog: "mdx-image-zoom-dialog", zoomImg: original ? { src: original, alt } : undefined, ZoomContent: ZoomLoaderContent, wrapElement: "span", children: img })) : (img);
    if (title) {
        return (_jsxs("span", { className: cn("my-4 flex flex-col gap-2", portrait ? "items-center" : "items-stretch"), children: [zoomed, _jsx("span", { className: cn("block text-center text-muted-foreground text-sm italic", captionClassName), children: caption ?? title })] }));
    }
    return _jsx("span", { className: "my-4 block", children: zoomed });
}
