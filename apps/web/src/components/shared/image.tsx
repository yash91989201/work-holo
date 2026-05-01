import { env } from "@work-holo/env/web";
import {
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type ImageLayout = "fixed" | "responsive" | "fill";
export type ImagePlaceholder = "auto" | "blur" | "empty" | "none" | boolean;
export type ImageFormat = "webp" | "avif";

export type ImageUrlConfig = {
  environment: string;
  imageTransformationUrl: string;
  webUrl: string;
};

export type BuildImageUrlOptions = {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  unoptimized?: boolean;
  format?: ImageFormat | undefined;
  signature?: string;
  config?: ImageUrlConfig;
};

export type BuildSrcSetOptions = BuildImageUrlOptions;

export type GetImagePropsOptions = BuildImageUrlOptions & {
  aspectRatio?: number;
  layout?: ImageLayout;
  sizes?: string;
};

export type GeneratedImageProps = {
  src: string;
  srcSet?: string;
  sizes: string;
  width?: number;
  height?: number;
};

type NativeImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  | "alt"
  | "className"
  | "decoding"
  | "fetchPriority"
  | "height"
  | "loading"
  | "sizes"
  | "src"
  | "srcSet"
  | "style"
  | "width"
>;

type ImageAccessibilityProps =
  | {
      /** Accessible alternative text for content images. */
      alt: string;
      decorative?: false;
    }
  | {
      /** Optional developer label. Decorative images render empty alt text. */
      alt?: string;
      decorative: true;
    };

type ImageBaseProps = NativeImageProps & {
  /**
   * Image source.
   *
   * Supports relative paths like `/logo.webp`, absolute URLs,
   * `data:` URLs, and `blob:` URLs.
   *
   * Relative paths are converted to absolute URLs before imgproxy
   * transformation.
   */
  src: string;

  /**
   * Desired rendered width in pixels.
   *
   * Used for:
   * - the native `width` attribute
   * - imgproxy resize width
   * - responsive `srcSet` generation
   * - placeholder size calculation
   */
  width?: number;

  /**
   * Desired rendered height in pixels.
   *
   * Used for:
   * - the native `height` attribute
   * - imgproxy resize height
   * - aspect-ratio-safe `srcSet` generation
   */
  height?: number;

  /**
   * Wrapper aspect ratio.
   *
   * Useful when you want the wrapper to reserve layout space
   * without passing both `width` and `height`.
   *
   * @example
   * ```tsx
   * <Image src="/cover.jpg" alt="Cover" aspectRatio={16 / 9} />
   * ```
   */
  aspectRatio?: number;

  /**
   * Layout mode for the wrapper and image.
   *
   * - `"fixed"`: uses explicit width/height or computed height.
   * - `"responsive"`: fills available width and reserves aspect-ratio space when possible.
   * - `"fill"`: absolutely fills the wrapper; parent/wrapper must provide size.
   *
   * @default "fixed" when width/height are provided, otherwise "responsive"
   */
  layout?: ImageLayout;

  /**
   * Marks the image as decorative.
   *
   * When enabled:
   * - renders an empty `alt`
   * - sets `aria-hidden`
   *
   * Use this only for logos in loaders, background-like images,
   * repeated visual elements, or images that do not add meaning.
   */
  decorative?: boolean;

  /**
   * Loading effect applied before the main image is fully loaded.
   *
   * Options:
   * - `"none"`: no effect
   * - `"blur"`: blurred loading state
   * - `"opacity"`: fade from low opacity
   * - `"black-and-white"`: grayscale until loaded
   *
   * For loader logos and icons, prefer `"none"`.
   *
   * @default "blur" for content images with placeholders, otherwise "none"
   */
  effect?: "blur" | "opacity" | "black-and-white" | "none";

  /**
   * CSS `object-fit` value applied to the underlying image.
   *
   * Common values:
   * - `"cover"`: fill the box, cropping if needed
   * - `"contain"`: fit inside the box without cropping
   * - `"fill"`: stretch to fill
   *
   * Also controls placeholder background sizing.
   *
   * @default "cover"
   */
  objectFit?: CSSProperties["objectFit"];

  /**
   * CSS `object-position` value applied to the image and placeholder.
   *
   * @default "center"
   */
  objectPosition?: CSSProperties["objectPosition"];

  /**
   * Prioritizes loading for critical images.
   *
   * When enabled:
   * - uses `loading="eager"`
   * - uses `fetchPriority="high"`
   * - uses `decoding="sync"`
   *
   * Use for hero images, fullscreen loader logos,
   * and above-the-fold images.
   */
  priority?: boolean;

  /**
   * Image quality from `1` to `100`.
   *
   * Values are clamped automatically.
   *
   * @default 75
   */
  quality?: number;

  /**
   * Placeholder behavior while the image loads.
   *
   * - `"auto"`: blur placeholder for content images, none for small fixed images.
   * - `"blur"`: generate a low-quality image placeholder.
   * - `"empty"` / `"none"`: reserve layout space without a placeholder image.
   * - `true` / `false`: aliases for `"blur"` / `"none"`.
   *
   * @default "auto"
   */
  placeholder?: ImagePlaceholder;

  /**
   * Precomputed tiny image used as the blur placeholder.
   *
   * Useful when the backend stores a base64/data URL placeholder.
   * Takes precedence over generated imgproxy placeholders.
   */
  blurDataURL?: string;

  /**
   * Image source to try when the primary `src` fails.
   */
  fallbackSrc?: string;

  /**
   * React node rendered when the active image source fails.
   *
   * If `fallbackSrc` is also provided, this renders only when the fallback image fails.
   */
  fallback?: ReactNode;

  /**
   * Disables imgproxy optimization.
   *
   * When enabled, the original `src` is used directly and no
   * optimized `srcSet` is generated.
   *
   * Useful for SVGs, already-optimized CDN images, private URLs,
   * or debugging transformation issues.
   */
  unoptimized?: boolean;

  /**
   * Optimized output format requested from imgproxy.
   *
   * @default "webp"
   */
  format?: ImageFormat | undefined;

  /**
   * Native responsive image `sizes` attribute.
   *
   * Controls how the browser chooses from generated `srcSet`
   * candidates.
   *
   * @example
   * ```tsx
   * sizes="(min-width: 1024px) 50vw, 100vw"
   * ```
   */
  sizes?: string;

  /**
   * Class name applied to the underlying `<img>` element.
   */
  className?: string;

  /**
   * Class name applied to the outer wrapper element.
   *
   * Use this for layout, spacing, sizing, clipping, and positioning.
   */
  wrapperClassName?: string;

  /**
   * Inline style applied to the outer wrapper element.
   */
  wrapperStyle?: CSSProperties;

  /**
   * Inline style applied to the underlying `<img>` element.
   * Loading state styles still take precedence where needed.
   */
  style?: CSSProperties;

  /**
   * imgproxy signature segment.
   *
   * Use this when your imgproxy setup requires signed URLs.
   *
   * @default "_"
   */
  signature?: string;

  /**
   * Marks the image as immediately visible.
   *
   * When enabled, the image loads eagerly instead of lazily.
   * `priority` also enables eager loading.
   */
  visibleByDefault?: boolean;
};

export type ImageProps = ImageBaseProps & ImageAccessibilityProps;

const MAX_GENERATED_WIDTH = 3840;
const IMGPROXY_SIGNATURE_PLACEHOLDER = "_";
const DEFAULT_IMAGE_QUALITY = 75;
const DEFAULT_IMAGE_FORMAT = "webp";
const DEFAULT_OBJECT_FIT = "cover";
const DEFAULT_OBJECT_POSITION = "center";
const DEFAULT_PLACEHOLDER = "auto";
const SMALL_IMAGE_PLACEHOLDER_MAX_SIZE = 128;
const DEFAULT_SRCSET_WIDTHS = [
  320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2560, 3840,
];

const QUESTION_MARK_REGEX = /\?/g;
const HASH_REGEX = /#/g;
const AT_REGEX = /@/g;
const TRAILING_SLASH_REGEX = /\/$/;
const IMAGE_EXTENSION_REGEX = /\.(gif|svg)(?:[?#].*)?$/i;

const clampQuality = (quality: number): number =>
  Math.max(1, Math.min(100, Math.round(quality)));

const hasValidDimension = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const getDefaultImageUrlConfig = (): ImageUrlConfig => ({
  environment: env.VITE_ENV,
  imageTransformationUrl: env.VITE_IMAGE_TRANSFORMATION_URL,
  webUrl: env.VITE_WEB_URL,
});

export const canOptimizeImage = (
  source: string,
  unoptimized: boolean,
  config: ImageUrlConfig = getDefaultImageUrlConfig()
): boolean => {
  if (unoptimized) {
    return false;
  }

  if (source.startsWith("data:") || source.startsWith("blob:")) {
    return false;
  }

  if (IMAGE_EXTENSION_REGEX.test(source)) {
    return false;
  }

  return config.environment !== "development";
};

const encodePlainSourceUrl = (sourceUrl: string): string =>
  encodeURI(sourceUrl)
    .replace(QUESTION_MARK_REGEX, "%3F")
    .replace(HASH_REGEX, "%23")
    .replace(AT_REGEX, "%40");

export const buildImageUrl = (options: BuildImageUrlOptions): string => {
  const {
    src,
    width,
    height,
    quality = DEFAULT_IMAGE_QUALITY,
    unoptimized = false,
    format = DEFAULT_IMAGE_FORMAT,
    signature = IMGPROXY_SIGNATURE_PLACEHOLDER,
    config = getDefaultImageUrlConfig(),
  } = options;

  if (!canOptimizeImage(src, unoptimized, config)) {
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

  const baseUrl = config.imageTransformationUrl.replace(
    TRAILING_SLASH_REGEX,
    ""
  );

  const websiteUrl = config.webUrl.replace(TRAILING_SLASH_REGEX, "");

  const absoluteSource = src.startsWith("/") ? `${websiteUrl}${src}` : src;
  const plainSource = encodePlainSourceUrl(absoluteSource);
  const outputExtension = format ?? "webp";

  const signatureSegment =
    typeof signature === "string" && signature.trim()
      ? signature
      : IMGPROXY_SIGNATURE_PLACEHOLDER;

  return `${baseUrl}/${signatureSegment}/${processingOptions.join(
    "/"
  )}/plain/${plainSource}@${outputExtension}`;
};

export const buildSrcSet = (
  options: BuildSrcSetOptions
): string | undefined => {
  const {
    src,
    width,
    height,
    quality,
    unoptimized,
    format,
    signature,
    config,
  } = options;

  if (!canOptimizeImage(src, Boolean(unoptimized), config)) {
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
        config,
      });

      return `${candidateSrc} ${candidateWidth}w`;
    })
    .join(", ");
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

export const getImageProps = (
  options: GetImagePropsOptions
): GeneratedImageProps => {
  const {
    src,
    width,
    height,
    aspectRatio,
    layout,
    quality,
    unoptimized,
    format,
    signature,
    config,
    sizes,
  } = options;
  const computedHeight = getComputedHeight(width, height, aspectRatio);
  const effectiveLayout = getEffectiveLayout({
    layout,
    width,
    height,
    aspectRatio,
  });

  return {
    src: buildImageUrl({
      src,
      width,
      height: computedHeight,
      quality,
      unoptimized,
      format,
      signature,
      config,
    }),
    srcSet: buildSrcSet({
      src,
      width,
      height: computedHeight,
      quality,
      unoptimized,
      format,
      signature,
      config,
    }),
    sizes:
      sizes ??
      (effectiveLayout === "fixed" && width
        ? `${Math.round(width)}px`
        : "100vw"),
    width,
    height: computedHeight,
  };
};

const getEffectiveLayout = (options: {
  layout?: ImageLayout;
  width?: number;
  height?: number;
  aspectRatio?: number;
}): ImageLayout => {
  const { layout, width, height, aspectRatio } = options;

  if (layout) {
    return layout;
  }

  if (hasValidDimension(width) || hasValidDimension(height)) {
    return "fixed";
  }

  if (hasValidDimension(aspectRatio)) {
    return "responsive";
  }

  return "responsive";
};

const getEffectiveAspectRatio = (
  width: number | undefined,
  computedHeight: number | undefined,
  aspectRatio: number | undefined
): number | undefined => {
  if (hasValidDimension(aspectRatio)) {
    return aspectRatio;
  }

  if (hasValidDimension(width) && hasValidDimension(computedHeight)) {
    return width / computedHeight;
  }

  return;
};

const getPlaceholderMode = (options: {
  placeholder: ImagePlaceholder | undefined;
  isSmallFixedImage: boolean;
}): Exclude<ImagePlaceholder, boolean> => {
  const { placeholder = DEFAULT_PLACEHOLDER, isSmallFixedImage } = options;

  if (placeholder === true) {
    return "blur";
  }

  if (placeholder === false) {
    return "none";
  }

  if (placeholder === "auto") {
    return isSmallFixedImage ? "none" : "blur";
  }

  return placeholder;
};

const getPlaceholderSource = (options: {
  placeholder: boolean;
  blurDataURL?: string;
  src: string;
  width?: number;
  computedHeight?: number;
  unoptimized: boolean;
  format: ImageFormat | undefined;
  signature: string;
  config?: ImageUrlConfig;
}): string | undefined => {
  const {
    placeholder,
    blurDataURL,
    src,
    width,
    computedHeight,
    unoptimized,
    format,
    signature,
    config,
  } = options;

  if (!placeholder) {
    return;
  }

  if (blurDataURL) {
    return blurDataURL;
  }

  if (!canOptimizeImage(src, unoptimized, config)) {
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
    config,
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

const getContainerStyle = (options: {
  layout: ImageLayout;
  aspectRatio?: number;
  width?: number;
  computedHeight?: number;
  placeholderSrc?: string;
  showPlaceholder: boolean;
  objectFit: CSSProperties["objectFit"];
  objectPosition: CSSProperties["objectPosition"];
  wrapperStyle?: CSSProperties;
}): CSSProperties => {
  const {
    layout,
    aspectRatio,
    width,
    computedHeight,
    placeholderSrc,
    showPlaceholder,
    objectFit,
    objectPosition,
    wrapperStyle,
  } = options;

  const baseStyle: CSSProperties = {
    display: "block",
    position: layout === "fill" ? "absolute" : "relative",
    overflow: "hidden",
  };

  const layoutStyle: CSSProperties =
    layout === "fill"
      ? {
          inset: 0,
          width: "100%",
          height: "100%",
        }
      : layout === "responsive"
        ? {
            width: "100%",
            ...(hasValidDimension(width) ? { maxWidth: width } : {}),
            ...(hasValidDimension(aspectRatio)
              ? { aspectRatio: aspectRatio.toString() }
              : hasValidDimension(computedHeight)
                ? { height: computedHeight }
                : {}),
          }
        : {
            ...(hasValidDimension(width) ? { width } : {}),
            ...(hasValidDimension(computedHeight)
              ? { height: computedHeight }
              : hasValidDimension(aspectRatio)
                ? { aspectRatio: aspectRatio.toString() }
                : {}),
            ...(hasValidDimension(width) || hasValidDimension(computedHeight)
              ? {}
              : { width: "100%", height: "auto" }),
          };

  return {
    ...baseStyle,
    ...layoutStyle,
    ...(placeholderSrc && showPlaceholder
      ? {
          backgroundImage: `url("${placeholderSrc}")`,
          backgroundSize: objectFit === "contain" ? "contain" : "cover",
          backgroundPosition: objectPosition,
          backgroundRepeat: "no-repeat",
          filter: "none",
        }
      : {}),
    ...wrapperStyle,
  };
};

const getLoadedImageStyle = (options: {
  objectFit: CSSProperties["objectFit"];
  objectPosition: CSSProperties["objectPosition"];
  loaded: boolean;
  errored: boolean;
  hasPlaceholder: boolean;
  effect: ImageProps["effect"];
  reduceMotion: boolean;
}): CSSProperties => {
  const {
    objectFit,
    objectPosition,
    loaded,
    errored,
    hasPlaceholder,
    effect,
    reduceMotion,
  } = options;

  const imageBoxStyle = {
    objectFit,
    objectPosition,
  } satisfies CSSProperties;

  if (errored) {
    return {
      ...imageBoxStyle,
      opacity: 0,
      visibility: "hidden",
    };
  }

  if (reduceMotion) {
    return {
      ...imageBoxStyle,
      opacity: loaded ? 1 : hasPlaceholder ? 0 : 0.98,
      filter: "none",
      transition: "none",
    };
  }

  /**
   * Key fix:
   * If a placeholder exists, do not show the real image until it is loaded.
   * This prevents: alt/broken state -> blurred image -> final image.
   */
  if (!loaded && hasPlaceholder) {
    return {
      ...imageBoxStyle,
      opacity: 0,
      filter: "none",
      transition: "opacity 180ms ease",
    };
  }

  if (loaded || effect === "none") {
    return {
      ...imageBoxStyle,
      opacity: 1,
      filter: "none",
      transition:
        effect === "none" ? "none" : "opacity 220ms ease, filter 300ms ease",
    };
  }

  if (effect === "opacity") {
    return {
      ...imageBoxStyle,
      opacity: 0.2,
      transition: "opacity 220ms ease",
    };
  }

  if (effect === "black-and-white") {
    return {
      ...imageBoxStyle,
      filter: "grayscale(100%)",
      opacity: 0.95,
      transition: "opacity 220ms ease, filter 300ms ease",
    };
  }

  return {
    ...imageBoxStyle,
    filter: "blur(12px)",
    opacity: 0.7,
    transition: "opacity 220ms ease, filter 300ms ease",
  };
};

/**
 * App-level image component with imgproxy support.
 *
 * Works like a lightweight `next/image` replacement for TanStack Start apps.
 * It generates optimized imgproxy URLs, responsive `srcSet` values,
 * adaptive placeholders, `blurDataURL` placeholders, loading effects,
 * fallback rendering, and priority/eager loading.
 *
 * Defaults are tuned for common content images: lazy loading, WebP output,
 * quality `75`, `object-fit: cover`, blur-up placeholders, and responsive
 * `sizes`. Small fixed-size images skip placeholders by default to avoid
 * logo/icon flicker. SVG, GIF, `data:`, and `blob:` sources skip optimization.
 *
 * @example Basic optimized image
 * ```tsx
 * <Image
 *   src="/images/hero.png"
 *   alt="Dashboard preview"
 *   width={1200}
 *   height={720}
 * />
 * ```
 *
 * @example Responsive content image
 * ```tsx
 * <Image
 *   src="/images/card-cover.jpg"
 *   alt="Project cover"
 *   layout="responsive"
 *   aspectRatio={16 / 9}
 *   sizes="(min-width: 1024px) 33vw, 100vw"
 * />
 * ```
 *
 * @example Fullscreen loader or logo image
 * ```tsx
 * <Image
 *   src="/logo.webp"
 *   decorative
 *   width={96}
 *   aspectRatio={3 / 2}
 *   priority
 *   objectFit="contain"
 * />
 * ```
 *
 * @param props - Image rendering and optimization options.
 * @param props.src - Image source. Supports relative paths, absolute URLs, `data:` URLs, and `blob:` URLs.
 * @param props.alt - Accessible alternative text. Required unless `decorative` is true.
 * @param props.width - Desired rendered width in pixels. Also used for imgproxy resize and `srcSet` generation.
 * @param props.height - Desired rendered height in pixels. Also used for imgproxy resize and aspect-ratio-safe `srcSet` generation.
 * @param props.layout - Layout mode: `"fixed"`, `"responsive"`, or `"fill"`.
 * @param props.quality - Output quality from `1` to `100`. Defaults to `75`.
 * @param props.className - Class name applied to the underlying `<img>` element.
 * @param props.wrapperClassName - Class name applied to the outer wrapper element.
 * @param props.effect - Loading effect: `"none"`, `"blur"`, `"opacity"`, or `"black-and-white"`. Defaults to `"blur"` when placeholders are used, otherwise `"none"`.
 * @param props.visibleByDefault - Loads the image eagerly because it is expected to be immediately visible.
 * @param props.aspectRatio - Wrapper aspect ratio, for example `16 / 9`, used when explicit dimensions are not enough.
 * @param props.placeholder - Placeholder mode: `"auto"`, `"blur"`, `"empty"`, `"none"`, `true`, or `false`. Defaults to `"auto"`.
 * @param props.blurDataURL - Precomputed tiny image used for blur placeholders instead of generated imgproxy placeholders.
 * @param props.fallbackSrc - Source to try after the primary `src` fails.
 * @param props.fallback - React node rendered when the active image source fails.
 * @param props.unoptimized - Skips imgproxy optimization and uses the original `src` directly.
 * @param props.format - Optimized output format. Defaults to `"webp"`.
 * @param props.priority - Enables eager loading, high fetch priority, and sync decoding for critical images.
 * @param props.sizes - Native responsive image `sizes` attribute. Defaults to fixed width or `"100vw"`.
 * @param props.objectFit - CSS `object-fit` value for the image. Defaults to `"cover"`.
 * @param props.objectPosition - CSS `object-position` value for the image and placeholder. Defaults to `"center"`.
 * @param props.signature - imgproxy signature segment. Defaults to `"_"`.
 * @param props.decorative - Marks the image as decorative by rendering empty alt text and `aria-hidden`.
 * @param props.wrapperStyle - Inline style applied to the outer wrapper.
 * @param props.style - Inline style applied to the underlying `<img>`.
 *
 * @remarks
 * Optimization is disabled automatically in development and for SVG, GIF, `data:`, and `blob:` URLs.
 * Native `<img>` props like `crossOrigin`, `referrerPolicy`, `draggable`, `onClick`, `data-*`, and `aria-*` are forwarded.
 * Pass `objectFit="contain"` for logos/icons when cropping is not acceptable.
 */
export function Image({
  src,
  alt = "",
  width,
  height,
  quality = DEFAULT_IMAGE_QUALITY,
  className = "",
  wrapperClassName = "",
  effect,
  visibleByDefault = false,
  aspectRatio,
  layout,
  placeholder,
  blurDataURL,
  fallbackSrc,
  fallback,
  unoptimized = false,
  format = DEFAULT_IMAGE_FORMAT,
  priority = false,
  sizes,
  objectFit = DEFAULT_OBJECT_FIT,
  objectPosition = DEFAULT_OBJECT_POSITION,
  wrapperStyle,
  style,
  signature = IMGPROXY_SIGNATURE_PLACEHOLDER,
  decorative = false,
  onError,
  onLoad,
  ...imgProps
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduceMotion = useReducedMotionPreference();

  const [imageState, setImageState] = useState<{
    src: string;
    status: "idle" | "loaded" | "error";
  }>({
    src: "",
    status: "idle",
  });

  const [failedPrimarySrc, setFailedPrimarySrc] = useState<string | null>(null);

  const usingFallbackSrc = failedPrimarySrc === src && Boolean(fallbackSrc);
  const activeSrc = usingFallbackSrc && fallbackSrc ? fallbackSrc : src;

  const eager = priority || visibleByDefault;
  const computedHeight = getComputedHeight(width, height, aspectRatio);
  const effectiveLayout = getEffectiveLayout({
    layout,
    width,
    height,
    aspectRatio,
  });
  const effectiveAspectRatio = getEffectiveAspectRatio(
    width,
    computedHeight,
    aspectRatio
  );
  const isSmallFixedImage =
    effectiveLayout === "fixed" &&
    hasValidDimension(width) &&
    hasValidDimension(computedHeight) &&
    Math.max(width, computedHeight) <= SMALL_IMAGE_PLACEHOLDER_MAX_SIZE;
  const placeholderMode = getPlaceholderMode({
    placeholder,
    isSmallFixedImage,
  });
  const shouldRenderPlaceholderImage = placeholderMode === "blur";
  const loadingEffect =
    effect ?? (placeholderMode === "blur" ? "blur" : "none");

  const mainSrc = useMemo(
    () =>
      buildImageUrl({
        src: activeSrc,
        width,
        height: computedHeight,
        quality,
        unoptimized,
        format,
        signature,
      }),
    [activeSrc, computedHeight, format, quality, signature, unoptimized, width]
  );

  const srcSet = useMemo(
    () =>
      buildSrcSet({
        src: activeSrc,
        width,
        height: computedHeight,
        quality,
        unoptimized,
        format,
        signature,
      }),
    [activeSrc, computedHeight, format, quality, signature, unoptimized, width]
  );

  const placeholderSrc = useMemo(
    () =>
      getPlaceholderSource({
        placeholder: shouldRenderPlaceholderImage,
        blurDataURL,
        src: activeSrc,
        width,
        computedHeight,
        unoptimized,
        format,
        signature,
      }),
    [
      computedHeight,
      format,
      activeSrc,
      blurDataURL,
      shouldRenderPlaceholderImage,
      signature,
      unoptimized,
      width,
    ]
  );

  const loaded = imageState.src === mainSrc && imageState.status === "loaded";
  const errored = imageState.src === mainSrc && imageState.status === "error";
  const hasPlaceholder = placeholderMode === "empty" || Boolean(placeholderSrc);
  const showPlaceholder = hasPlaceholder && !loaded && !errored;

  useEffect(() => {
    setImageState({
      src: mainSrc,
      status: "idle",
    });
  }, [mainSrc]);

  /**
   * Key fix:
   * Handles memory-cache/browser-cache images that may already be complete
   * before React effect/listeners run.
   */
  useEffect(() => {
    const imageElement = imgRef.current;

    if (!imageElement || imageElement.currentSrc === "") {
      return;
    }

    if (imageElement.complete) {
      setImageState({
        src: mainSrc,
        status: imageElement.naturalWidth > 0 ? "loaded" : "error",
      });
    }
  }, [mainSrc]);

  const effectiveSizes =
    sizes ??
    (effectiveLayout === "fixed" && width ? `${Math.round(width)}px` : "100vw");
  const imageClassName =
    effectiveLayout === "fill" ||
    hasValidDimension(effectiveAspectRatio) ||
    hasValidDimension(computedHeight)
      ? "h-full w-full"
      : "h-auto w-full";

  const containerStyle = getContainerStyle({
    layout: effectiveLayout,
    aspectRatio: effectiveAspectRatio,
    width,
    computedHeight,
    placeholderSrc,
    showPlaceholder,
    objectFit,
    objectPosition,
    wrapperStyle,
  });

  const imageStyle = getLoadedImageStyle({
    objectFit,
    objectPosition,
    loaded,
    errored,
    hasPlaceholder,
    effect: loadingEffect,
    reduceMotion,
  });

  return (
    <span
      className={cn("block overflow-hidden", wrapperClassName)}
      style={containerStyle}
    >
      <img
        {...imgProps}
        alt={decorative ? "" : alt}
        aria-hidden={decorative ? true : undefined}
        className={cn(imageClassName, className)}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        height={computedHeight}
        loading={eager ? "eager" : "lazy"}
        onError={(event) => {
          onError?.(event);

          if (!usingFallbackSrc && fallbackSrc && fallbackSrc !== src) {
            setFailedPrimarySrc(src);
            return;
          }

          setImageState({
            src: mainSrc,
            status: "error",
          });
        }}
        onLoad={(event) => {
          onLoad?.(event);

          const imageElement = event.currentTarget;

          setImageState({
            src: mainSrc,
            status: imageElement.naturalWidth > 0 ? "loaded" : "error",
          });
        }}
        ref={imgRef}
        sizes={effectiveSizes}
        src={mainSrc}
        srcSet={srcSet}
        style={{ ...style, ...imageStyle }}
        width={width}
      />
      {errored && fallback ? (
        <span className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </span>
      ) : null}
    </span>
  );
}
