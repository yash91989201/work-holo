import { env } from "@work-holo/env/www";
import { cn } from "@work-holo/ui/lib/utils";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  wrapperClassName?: string;
  effect?: "blur" | "opacity" | "black-and-white" | "none";
  visibleByDefault?: boolean;
  aspectRatio?: number;
  placeholder?: boolean;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
  priority?: boolean;
  sizes?: string;
  objectFit?: CSSProperties["objectFit"];
  signature?: string;
};

const MAX_GENERATED_WIDTH = 3840;
const IMGPROXY_SIGNATURE_PLACEHOLDER = "_";
const DEFAULT_SRCSET_WIDTHS = [
  320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2560, 3840,
];
const QUESTION_MARK_REGEX = /\?/g;
const HASH_REGEX = /#/g;
const AT_REGEX = /@/g;
const TRAILING_SLASH_REGEX = /\/$/;

const clampQuality = (quality: number): number =>
  Math.max(1, Math.min(100, Math.round(quality)));

const hasValidDimension = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const canOptimizeImage = (source: string, unoptimized: boolean): boolean => {
  if (unoptimized) {
    return false;
  }

  if (source.startsWith("data:") || source.startsWith("blob:")) {
    return false;
  }

  return env.VITE_ENV !== "development";
};

const encodePlainSourceUrl = (sourceUrl: string): string =>
  encodeURI(sourceUrl)
    .replace(QUESTION_MARK_REGEX, "%3F")
    .replace(HASH_REGEX, "%23")
    .replace(AT_REGEX, "%40");

const buildImageUrl = (options: {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
  signature?: string;
}): string => {
  const {
    src,
    width,
    height,
    quality = 75,
    unoptimized = false,
    format = "webp",
    signature = IMGPROXY_SIGNATURE_PLACEHOLDER,
  } = options;

  if (!canOptimizeImage(src, unoptimized)) {
    return src;
  }

  const processingOptions: string[] = [];
  const hasWidth = hasValidDimension(width);
  const hasHeight = hasValidDimension(height);

  if (hasWidth || hasHeight) {
    processingOptions.push(
      `resize:fit:${hasWidth ? Math.round(width) : 0}:${hasHeight ? Math.round(height) : 0}:0`
    );
  }

  processingOptions.push(`quality:${clampQuality(quality)}`);

  const baseUrl = env.VITE_IMAGE_TRANSFORMATION_URL.replace(
    TRAILING_SLASH_REGEX,
    ""
  );
  const websiteUrl = env.VITE_WWW_URL.replace(TRAILING_SLASH_REGEX, "");
  const absoluteSource = src.startsWith("/") ? `${websiteUrl}${src}` : src;
  const plainSource = encodePlainSourceUrl(absoluteSource);
  const outputExtension = format ?? "webp";
  const signatureSegment =
    typeof signature === "string" && signature.trim()
      ? signature
      : IMGPROXY_SIGNATURE_PLACEHOLDER;

  return `${baseUrl}/${signatureSegment}/${processingOptions.join("/")}/plain/${plainSource}@${outputExtension}`;
};

const buildSrcSet = (options: {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  unoptimized?: boolean;
  format?: "webp" | "avif" | undefined;
  signature?: string;
}): string | undefined => {
  const { src, width, height, quality, unoptimized, format, signature } =
    options;

  if (!canOptimizeImage(src, Boolean(unoptimized))) {
    return;
  }

  const hasWidth = hasValidDimension(width);
  const hasHeight = hasValidDimension(height);

  const candidateWidths = hasWidth
    ? Array.from(
        new Set([
          ...DEFAULT_SRCSET_WIDTHS.filter(
            (candidate) =>
              candidate <=
              Math.min(
                MAX_GENERATED_WIDTH,
                Math.max(320, Math.round(width * 2))
              )
          ),
          Math.round(width),
          Math.min(MAX_GENERATED_WIDTH, Math.round(width * 2)),
        ])
      ).sort((a, b) => a - b)
    : DEFAULT_SRCSET_WIDTHS.slice(0, 8);

  if (candidateWidths.length === 0) {
    return;
  }

  return candidateWidths
    .map((candidateWidth) => {
      const candidateHeight =
        hasWidth && hasHeight
          ? Math.max(1, Math.round((height / width) * candidateWidth))
          : undefined;

      const candidateSrc = buildImageUrl({
        src,
        width: candidateWidth,
        height: candidateHeight,
        quality,
        unoptimized,
        format,
        signature,
      });

      return `${candidateSrc} ${candidateWidth}w`;
    })
    .join(", ");
};

const getLoadingEffectStyles = (
  effect: "blur" | "opacity" | "black-and-white" | "none",
  loaded: boolean,
  reduceMotion: boolean
): CSSProperties => {
  if (reduceMotion) {
    return {
      filter: "none",
      opacity: loaded ? 1 : 0.98,
      transition: "none",
    };
  }

  if (effect === "none" || loaded) {
    return {
      filter: "none",
      opacity: 1,
      transition:
        effect === "none" ? "none" : "opacity 220ms ease, filter 300ms ease",
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

const getComputedHeight = (
  width: number | undefined,
  height: number | undefined,
  aspectRatio: number | undefined
): number | undefined => {
  if (hasValidDimension(height)) {
    return height;
  }

  if (hasValidDimension(width) && hasValidDimension(aspectRatio)) {
    return Math.round(width / aspectRatio);
  }

  return;
};

const getPlaceholderSource = (options: {
  placeholder: boolean;
  src: string;
  width?: number;
  computedHeight?: number;
  unoptimized: boolean;
  format: "webp" | "avif" | undefined;
  signature: string;
}): string | undefined => {
  const {
    placeholder,
    src,
    width,
    computedHeight,
    unoptimized,
    format,
    signature,
  } = options;

  if (!placeholder) {
    return;
  }

  const hasWidth = hasValidDimension(width);
  const hasHeight = hasValidDimension(computedHeight);
  const placeholderWidth = hasWidth
    ? Math.max(32, Math.round(width * 0.12))
    : 48;
  const placeholderHeight =
    hasWidth && hasHeight
      ? Math.max(1, Math.round((computedHeight / width) * placeholderWidth))
      : undefined;

  return buildImageUrl({
    src,
    width: placeholderWidth,
    height: placeholderHeight,
    quality: 15,
    unoptimized,
    format,
    signature,
  });
};

const useReducedMotionPreference = (): boolean => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyPreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);

    return () => {
      mediaQuery.removeEventListener("change", applyPreference);
    };
  }, []);

  return reduceMotion;
};

const usePlaceholderErrorState = (
  placeholderSrc: string | undefined
): boolean => {
  const [placeholderErrored, setPlaceholderErrored] = useState(false);

  useEffect(() => {
    if (!placeholderSrc) {
      setPlaceholderErrored(false);
      return;
    }

    let cancelled = false;
    const probe = new window.Image();

    probe.onload = () => {
      if (!cancelled) {
        setPlaceholderErrored(false);
      }
    };

    probe.onerror = () => {
      if (!cancelled) {
        setPlaceholderErrored(true);
      }
    };

    probe.src = placeholderSrc;

    return () => {
      cancelled = true;
    };
  }, [placeholderSrc]);

  return placeholderErrored;
};

const getContainerStyle = (options: {
  shouldUseAspectRatio: boolean;
  aspectRatio?: number;
  width?: number;
  computedHeight?: number;
  placeholderSrc?: string;
  placeholderErrored: boolean;
  loaded: boolean;
  objectFit: CSSProperties["objectFit"];
}): CSSProperties => {
  const {
    shouldUseAspectRatio,
    aspectRatio,
    width,
    computedHeight,
    placeholderSrc,
    placeholderErrored,
    loaded,
    objectFit,
  } = options;

  return {
    display: "block",
    position: "relative",
    overflow: "hidden",
    ...(shouldUseAspectRatio && aspectRatio
      ? { aspectRatio: aspectRatio.toString() }
      : {}),
    ...(!shouldUseAspectRatio && hasValidDimension(width) ? { width } : {}),
    ...(!shouldUseAspectRatio && hasValidDimension(computedHeight)
      ? { height: computedHeight }
      : {}),
    ...(shouldUseAspectRatio ||
    hasValidDimension(width) ||
    hasValidDimension(computedHeight)
      ? {}
      : {
          width: "100%",
          height: "auto",
        }),
    ...(placeholderSrc && !placeholderErrored && !loaded
      ? {
          backgroundImage: `url(${placeholderSrc})`,
          backgroundSize: objectFit === "contain" ? "contain" : "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {}),
  };
};

export function Image({
  src,
  alt,
  width,
  height,
  quality = 75,
  className = "",
  wrapperClassName = "",
  effect = "none",
  visibleByDefault = false,
  aspectRatio,
  placeholder = true,
  unoptimized = false,
  format = "webp",
  priority = false,
  sizes,
  objectFit = "cover",
  signature = IMGPROXY_SIGNATURE_PLACEHOLDER,
}: ImageProps) {
  const [loadedSourceKey, setLoadedSourceKey] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduceMotion = useReducedMotionPreference();

  const eager = priority || visibleByDefault;
  const computedHeight = getComputedHeight(width, height, aspectRatio);
  const shouldUseAspectRatio = Boolean(aspectRatio && !(width && height));

  const mainSrc = useMemo(
    () =>
      buildImageUrl({
        src,
        width,
        height: computedHeight,
        quality,
        unoptimized,
        format,
        signature,
      }),
    [computedHeight, format, quality, signature, src, unoptimized, width]
  );

  const loaded = loadedSourceKey === mainSrc;

  const srcSet = useMemo(
    () =>
      buildSrcSet({
        src,
        width,
        height: computedHeight,
        quality,
        unoptimized,
        format,
        signature,
      }),
    [computedHeight, format, quality, signature, src, unoptimized, width]
  );

  const placeholderSrc = useMemo(
    () =>
      getPlaceholderSource({
        placeholder,
        src,
        width,
        computedHeight,
        unoptimized,
        format,
        signature,
      }),
    [computedHeight, format, placeholder, signature, src, unoptimized, width]
  );

  const placeholderErrored = usePlaceholderErrorState(placeholderSrc);

  useEffect(() => {
    const imageElement = imgRef.current;

    if (!imageElement) {
      return;
    }

    const markLoaded = () => {
      const sourceKey =
        imageElement.dataset.sourceKey ?? imageElement.currentSrc;
      setLoadedSourceKey(sourceKey || null);
    };

    imageElement.addEventListener("load", markLoaded);
    imageElement.addEventListener("error", markLoaded);

    return () => {
      imageElement.removeEventListener("load", markLoaded);
      imageElement.removeEventListener("error", markLoaded);
    };
  }, []);

  const effectiveSizes = sizes ?? (width ? `${Math.round(width)}px` : "100vw");

  const containerStyle = getContainerStyle({
    shouldUseAspectRatio,
    aspectRatio,
    width,
    computedHeight,
    placeholderSrc,
    placeholderErrored,
    loaded,
    objectFit,
  });

  const imageStyle: CSSProperties = {
    objectFit,
    ...getLoadingEffectStyles(effect, loaded, reduceMotion),
  };

  return (
    <span
      className={cn("block overflow-hidden", wrapperClassName)}
      style={containerStyle}
    >
      <img
        alt={alt}
        className={cn("h-full w-full", className)}
        data-source-key={mainSrc}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        height={computedHeight}
        loading={eager ? "eager" : "lazy"}
        ref={imgRef}
        sizes={effectiveSizes}
        src={mainSrc}
        srcSet={srcSet}
        style={imageStyle}
        width={width}
      />
    </span>
  );
}
