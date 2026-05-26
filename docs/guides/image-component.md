# Image Component Recipes

Use `Image` for optimized images in TanStack Start screens. It supports imgproxy URLs, responsive `srcSet`, layout modes, placeholders, `blurDataURL`, fallbacks, native image props, and exported URL helpers.

## Logo

Small fixed images skip placeholders by default, which avoids loader/logo flicker.

```tsx
import { Image } from "@/components/shared/image";

<Image
  src="/logo.webp"
  alt="Work Holo"
  width={96}
  aspectRatio={3 / 2}
  objectFit="contain"
  priority
/>
```

## Decorative Image

Decorative images do not need `alt`. The component renders `alt=""` and `aria-hidden`.

```tsx
<Image src="/logo.webp" decorative width={32} height={32} objectFit="contain" />
```

## Avatar

Use `fallback` for user-generated images that may be missing or private.

```tsx
<Image
  src={user.avatarUrl}
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
  fallback={<span className="text-sm">{user.initials}</span>}
/>
```

## Card Cover

Responsive layout reserves stable space with `aspectRatio`.

```tsx
<Image
  src={project.coverUrl}
  alt={project.name}
  layout="responsive"
  aspectRatio={16 / 9}
  sizes="(min-width: 1024px) 33vw, 100vw"
  objectPosition="center top"
/>
```

## Hero Image

Use `priority` only for above-the-fold images.

```tsx
<Image
  src="/images/hero.webp"
  alt="Dashboard preview"
  width={1440}
  height={900}
  sizes="100vw"
  priority
/>
```

## Fill Parent

`layout="fill"` makes the wrapper absolute. The parent must provide size and positioning.

```tsx
<div className="relative h-64 overflow-hidden rounded-xl">
  <Image src={file.url} alt={file.name} layout="fill" objectFit="cover" />
</div>
```

## Modal Preview

Use `objectFit="contain"` for previews where cropping is not acceptable.

```tsx
<Image
  src={file.url}
  alt={file.originalName}
  layout="responsive"
  objectFit="contain"
  placeholder="empty"
  className="max-h-[60vh]"
/>
```

## Fallback Source

`fallbackSrc` tries another image before rendering `fallback`.

```tsx
<Image
  src={organization.logoUrl}
  fallbackSrc="/logo.webp"
  fallback={<span>No logo</span>}
  alt={organization.name}
  width={48}
  height={48}
/>
```

## Precomputed Blur Placeholder

Use `blurDataURL` when your API stores a tiny base64/data URL placeholder. It takes precedence over generated imgproxy placeholders.

```tsx
<Image
  src={project.coverUrl}
  alt={project.name}
  layout="responsive"
  aspectRatio={16 / 9}
  blurDataURL={project.coverBlurDataUrl}
/>
```

## URL Helpers

Use `getImageProps` for meta tags, preload links, or tests without rendering the React component.

```tsx
import { getImageProps } from "@/components/shared/image";

const heroImage = getImageProps({
  src: "/images/hero.webp",
  width: 1440,
  height: 900,
  sizes: "100vw",
});

<link
  rel="preload"
  as="image"
  href={heroImage.src}
  imageSrcSet={heroImage.srcSet}
  imageSizes={heroImage.sizes}
/>
```

For reusable code outside this app, pass explicit config to `buildImageUrl`, `buildSrcSet`, or `getImageProps`.

```ts
import { buildImageUrl } from "@/components/shared/image";

const url = buildImageUrl({
  src: "/cover.webp",
  width: 800,
  height: 450,
  config: {
    environment: "production",
    imageTransformationUrl: "https://images.example.com",
    webUrl: "https://app.example.com",
  },
});
```

## Notes

SVG, GIF, `data:`, and `blob:` sources skip optimization automatically. Use `unoptimized` for private URLs or already-optimized CDN images.
