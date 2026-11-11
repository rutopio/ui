import { SpinnerGapIcon } from "@phosphor-icons/react"
import {
  cloneElement,
  useCallback,
  useState,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react"
import Zoom from "react-medium-image-zoom"
import { cn } from "../shared/class-names.js"

function ZoomImageWithLoader({
  img,
  isZoomImgLoaded,
  buttonUnzoom,
}: {
  img: ReactElement | null
  isZoomImgLoaded: boolean
  buttonUnzoom: ReactElement
}) {
  const [imgComplete, setImgComplete] = useState(false)
  const setRef = useCallback((element: HTMLImageElement | null) => {
    if (element?.complete) setImgComplete(true)
  }, [])
  const loaded = isZoomImgLoaded || imgComplete
  const imgWithRef = img
    ? cloneElement(img, {
        ref: setRef,
        onLoad: () => setImgComplete(true),
      } as ImgHTMLAttributes<HTMLImageElement>)
    : img
  return (
    <>
      {buttonUnzoom}
      {imgWithRef}
      <span
        aria-hidden={loaded}
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-[120ms] ease-out",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <SpinnerGapIcon
          className={cn(
            "size-8 text-white drop-shadow",
            !loaded && "animate-spin",
          )}
          aria-label="Loading full-size image"
        />
      </span>
    </>
  )
}

export type ArticleImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  enableZoom?: boolean
  sourceSizes?: Record<string, number[]>
  imageSrc?: (original: string) => string
  imageSrcSet?: (original: string) => string | undefined
  imageOnError?: ImgHTMLAttributes<HTMLImageElement>["onError"]
  caption?: ReactNode
  captionClassName?: string
  plainTitle?: string
  unknownSizeAspectRatio?: string
}

export function ArticleImage({
  className,
  alt,
  src,
  srcSet,
  title,
  width,
  height,
  style,
  enableZoom = false,
  sourceSizes,
  imageSrc,
  imageSrcSet,
  imageOnError,
  caption,
  captionClassName,
  plainTitle,
  unknownSizeAspectRatio,
  ...props
}: ArticleImageProps) {
  const original = typeof src === "string" ? src : undefined
  const sourceSize = original ? sourceSizes?.[original] : undefined
  const imageWidth = width ?? sourceSize?.[0]
  const imageHeight = height ?? sourceSize?.[1]
  const numericWidth = Number(imageWidth)
  const numericHeight = Number(imageHeight)
  const hasSize = numericWidth > 0 && numericHeight > 0
  const [measuredPortrait, setMeasuredPortrait] = useState(false)
  const portrait = hasSize
    ? numericHeight / numericWidth >= 1.05
    : measuredPortrait
  const measure = useCallback(
    (element: HTMLImageElement | null) => {
      if (!hasSize && element?.naturalWidth) {
        setMeasuredPortrait(
          element.naturalHeight / element.naturalWidth >= 1.05,
        )
      }
    },
    [hasSize],
  )
  const onLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => measure(event.currentTarget),
    [measure],
  )

  const img = (
    <img
      className={cn(
        "mx-auto rounded-sm outline outline-1 outline-black/10 dark:outline-white/10",
        portrait ? "h-[70dvh] w-auto max-w-full" : "w-full",
        enableZoom && "cursor-zoom-in",
        className,
      )}
      src={original && imageSrc ? imageSrc(original) : src}
      srcSet={srcSet ?? (original ? imageSrcSet?.(original) : undefined)}
      sizes="(max-width: 768px) 100vw, 768px"
      alt={alt}
      title={plainTitle ?? title}
      width={imageWidth}
      height={imageHeight}
      style={{
        aspectRatio: hasSize ? undefined : unknownSizeAspectRatio,
        ...style,
      }}
      loading="lazy"
      decoding="async"
      ref={measure}
      onLoad={onLoad}
      data-fallback={original}
      onError={imageOnError}
      {...props}
    />
  )

  const zoomed = enableZoom ? (
    <Zoom
      zoomMargin={24}
      classDialog="mdx-image-zoom-dialog"
      zoomImg={original ? { src: original, alt } : undefined}
      ZoomContent={ZoomImageWithLoader}
      wrapElement="span"
    >
      {img}
    </Zoom>
  ) : (
    img
  )

  if (title) {
    return (
      <span
        className={cn(
          "my-4 flex flex-col gap-2",
          portrait ? "items-center" : "items-stretch",
        )}
      >
        {zoomed}
        <span
          className={cn(
            "block text-center text-muted-foreground text-sm italic",
            captionClassName,
          )}
        >
          {caption ?? title}
        </span>
      </span>
    )
  }
  return <span className="my-4 block">{zoomed}</span>
}
