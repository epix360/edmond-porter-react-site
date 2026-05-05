// Local asset path helper.
//
// Assets are served same-origin from /images/* (GitHub Pages + Fastly CDN).
// We previously routed images through cdn.jsdelivr.net/gh/... but that added
// an extra DNS+TLS hop without any caching benefit, and jsDelivr's /gh/
// endpoint does not support image transformations — so query-string
// "optimization" params (w, h, f, q) were silently ignored.
//
// This module is kept as a thin compatibility shim so existing call sites
// (`getImagePath(...)`) keep working without change.

const IMAGE_DIR = '/images';

/**
 * Normalize any of these inputs to "/images/<filename>":
 *   "Edmond_Headshot.webp"
 *   "/Edmond_Headshot.webp"
 *   "/images/Edmond_Headshot.webp"
 *   "images/Edmond_Headshot.webp"
 */
export const getImagePath = (path = '') => {
  if (!path) return '';
  const stripped = String(path).replace(/^\/+/, '').replace(/^images\//, '');
  return `${IMAGE_DIR}/${stripped}`;
};

// Alias preserved for older call sites.
export const getAssetUrl = getImagePath;

export default { getImagePath, getAssetUrl };
