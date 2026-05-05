// Builds responsive image attributes from the build-time manifest produced
// by scripts/build-image-sizes.js.
//
// Usage:
//   import { getResponsiveImage } from '@/app/utils/responsiveImage';
//   const img = getResponsiveImage('Turbulent_Waters.webp');
//   <img
//     src={img.src}
//     srcSet={img.srcSet}
//     sizes="(max-width: 768px) 90vw, 400px"
//     width={400}
//     height={600}
//     loading="lazy"
//     decoding="async"
//   />
//
// `sizes` is the caller's responsibility — it depends on layout, not on the
// asset, so the helper does not try to guess it.

import manifest from './image-manifest.json';

const IMAGE_DIR = '/images';

const stripDir = (input) =>
  String(input || '')
    .replace(/^\/+/, '')
    .replace(/^images\//, '');

/**
 * Look up a source filename in the manifest and return the URLs needed
 * to render a responsive `<img>`.
 *
 * Always returns an object with `src` populated. `srcSet` will be
 * undefined for images with only one available width (e.g. tiny logos),
 * which is fine — `<img>` ignores undefined attributes.
 */
export function getResponsiveImage(input) {
  const filename = stripDir(input);
  if (!filename) {
    return { src: '', srcSet: undefined, width: undefined, height: undefined };
  }

  const baseUrl = `${IMAGE_DIR}/${filename}`;
  const entry = manifest[filename];

  if (!entry || !entry.widths || entry.widths.length <= 1) {
    return {
      src: baseUrl,
      srcSet: undefined,
      originalWidth: entry?.originalWidth,
    };
  }

  const baseNoExt = filename.replace(/\.webp$/, '');

  const srcSet = entry.widths
    .map((w) =>
      w === entry.originalWidth
        ? `${baseUrl} ${w}w`
        : `${IMAGE_DIR}/${baseNoExt}@${w}w.webp ${w}w`
    )
    .join(', ');

  return {
    src: baseUrl,
    srcSet,
    originalWidth: entry.originalWidth,
  };
}
