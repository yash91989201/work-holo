import { env } from "@work-holo/env/web";
import { type CSSProperties, type FC, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  wrapperClassName?: string;
  effect?: "blur" | "opacity" | "black-and-white";
  visibleByDefault?: boolean;
  aspectRatio?: number;
  placeholder?: boolean;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
  priority?: boolean;
};

const MAX_GENERATED_WIDTH = 3840;

const canOptimizeImage = (source: string, unoptimized: boolean): boolean => {
  if (unoptimized) {
    return false;
  }

  if (source.startsWith("data:")) {
    return false;
  }

  return env.VITE_ENV !== "development";
};

const buildImageUrl = (options: {
  src: string;
  width?: number;
  quality?: number;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
}): string => {
  const {
    src,
    width,
    quality = 75,
    unoptimized = false,
    format = "webp",
  } = options;

  if (!canOptimizeImage(src, unoptimized)) {
    return src;
  }

  const params = new URLSearchParams();

  if (typeof width === "number" && Number.isFinite(width) && width > 0) {
    params.set("width", Math.round(width).toString());
  }

  params.set(
    "quality",
    Math.max(1, Math.min(100, Math.round(quality))).toString()
  );
  if (format) {
    params.set("format", format);
  }

  const baseUrl = env.VITE_IMAGE_TRANSFORMATION_URL;
  const websiteUrl = env.VITE_WEB_URL.replace(/\/$/, "");
  const absoluteSource = src.startsWith("/") ? `${websiteUrl}${src}` : src;
  const encodedSrc = encodeURIComponent(absoluteSource);

  return `${baseUrl}/image/${encodedSrc}?${params.toString()}`;
};

const buildSrcSet = (options: {
  src: string;
  width?: number;
  quality?: number;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
}): string | undefined => {
  const { src, width, quality, unoptimized, format } = options;

  if (!(width && canOptimizeImage(src, Boolean(unoptimized)))) {
    return undefined;
  }

  const candidateWidths = Array.from(
    new Set([
      Math.max(1, Math.round(width)),
      Math.min(MAX_GENERATED_WIDTH, Math.max(1, Math.round(width * 2))),
    ])
  ).sort((a, b) => a - b);

  return candidateWidths
    .map((candidateWidth) => {
      const candidateSrc = buildImageUrl({
        src,
        width: candidateWidth,
        quality,
        unoptimized,
        format,
      });
      return `${candidateSrc} ${candidateWidth}w`;
    })
    .join(", ");
};

const getLoadingEffectStyles = (
  effect: "blur" | "opacity" | "black-and-white",
  loaded: boolean
): CSSProperties => {
  if (loaded) {
    return {
      filter: "none",
      opacity: 1,
      transition: "opacity 220ms ease, filter 300ms ease",
    };
  }

  if (effect === "opacity") {
    return {
      opacity: 0.2,
      transition: "opacity 220ms ease, filter 300ms ease",
    };
  }

  if (effect === "black-and-white") {
    return {
      filter: "grayscale(100%)",
      opacity: 0.95,
      transition: "opacity 220ms ease, filter 300ms ease",
    };
  }

  return {
    filter: "blur(12px)",
    opacity: 0.7,
    transition: "opacity 220ms ease, filter 300ms ease",
  };
};

export const Image: FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  className = "",
  wrapperClassName = "",
  effect = "blur",
  visibleByDefault = false,
  aspectRatio,
  placeholder = true,
  unoptimized = false,
  format = "webp",
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  const eager = priority || visibleByDefault;

  const computedHeight =
    height ??
    (width && aspectRatio ? Math.round(width / aspectRatio) : undefined);

  const shouldUseAspectRatio = Boolean(aspectRatio && !(width && height));

  const mainSrc = useMemo(
    () => buildImageUrl({ src, width, quality, unoptimized, format }),
    [format, quality, src, unoptimized, width]
  );

  const srcSet = useMemo(
    () => buildSrcSet({ src, width, quality, unoptimized, format }),
    [format, quality, src, unoptimized, width]
  );

  const placeholderSrc = useMemo(() => {
    if (!placeholder) {
      return undefined;
    }

    const placeholderWidth = width
      ? Math.max(32, Math.round(width * 0.12))
      : 48;

    return buildImageUrl({
      src,
      width: placeholderWidth,
      quality: 15,
      unoptimized,
      format,
    });
  }, [format, placeholder, src, unoptimized, width]);

  const containerStyle: CSSProperties = {
    display: "block",
    position: "relative",
    overflow: "hidden",
    ...(shouldUseAspectRatio && aspectRatio
      ? { aspectRatio: aspectRatio.toString() }
      : {}),
    ...(!shouldUseAspectRatio && typeof width === "number" ? { width } : {}),
    ...(!shouldUseAspectRatio && typeof computedHeight === "number"
      ? { height: computedHeight }
      : {}),
    ...(shouldUseAspectRatio || width || computedHeight
      ? {}
      : {
          width: "100%",
          height: "auto",
        }),
    ...(placeholderSrc && !loaded
      ? {
          backgroundImage: `url(${placeholderSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {}),
  };

  const imageStyle: CSSProperties = {
    ...getLoadingEffectStyles(effect, loaded),
  };

  return (
    <span
      className={cn("block overflow-hidden", wrapperClassName)}
      style={containerStyle}
    >
      <img
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        height={computedHeight}
        loading={eager ? "eager" : "lazy"}
        onError={() => {
          setLoaded(true);
        }}
        onLoad={() => {
          setLoaded(true);
        }}
        sizes={width ? `${Math.round(width)}px` : "100vw"}
        src={mainSrc}
        srcSet={srcSet}
        style={imageStyle}
        width={width}
      />
    </span>
  );
};
