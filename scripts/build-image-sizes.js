#!/usr/bin/env node

/**
 * Pre-generate responsive WebP variants from images in public/images/.
 *
 * For each source image we emit smaller variants alongside the original
 * (e.g. Turbulent_Waters@400w.webp, Turbulent_Waters@640w.webp) and write
 * a JSON manifest mapping each source filename to the list of available
 * widths. The manifest is imported at build time by
 * app/utils/responsiveImage.js so React components can build proper
 * srcset attributes without needing a runtime image-transform service.
 *
 * Re-runs are idempotent: a variant is regenerated only when missing or
 * older than its source.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MANIFEST_PATH = path.join(__dirname, '..', 'app', 'utils', 'image-manifest.json');

// Target widths to generate. Picked to cover the common breakpoints
// the design actually uses (book covers ~300px, hero ~400-450px, headshot
// ~400-560px) at both 1x and 2x device-pixel ratios.
const TARGET_WIDTHS = [400, 640, 960];

// Don't bother generating variants from sources smaller than this — tiny
// logos don't benefit from responsive sizing.
const MIN_SOURCE_WIDTH = 320;

// WebP encoder quality. 80 is a good middle ground for photography.
const QUALITY = 80;

const VARIANT_SUFFIX = /@\d+w\.webp$/;

const isSource = (filename) => {
  if (!filename.endsWith('.webp')) return false;
  if (VARIANT_SUFFIX.test(filename)) return false;     // skip already-generated variants
  if (filename.includes('_mobile')) return false;       // skip hand-authored mobile crops
  return true;
};

const variantPath = (basename, width) =>
  path.join(IMAGES_DIR, `${basename}@${width}w.webp`);

const isUpToDate = (variantFile, sourceFile) => {
  if (!fs.existsSync(variantFile)) return false;
  return fs.statSync(variantFile).mtimeMs >= fs.statSync(sourceFile).mtimeMs;
};

(async () => {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`No image directory at ${IMAGES_DIR}`);
    process.exit(1);
  }

  const manifest = {};
  const sources = fs.readdirSync(IMAGES_DIR).filter(isSource).sort();
  let generated = 0;
  let skipped = 0;

  for (const filename of sources) {
    const sourceFile = path.join(IMAGES_DIR, filename);
    const meta = await sharp(sourceFile).metadata();
    const originalWidth = meta.width || 0;

    if (originalWidth < MIN_SOURCE_WIDTH) {
      // Tiny logos etc. — no variants, just record the original width
      // so the helper can emit a single-source `<img>` cleanly.
      manifest[filename] = { widths: [originalWidth], originalWidth };
      continue;
    }

    // Only generate variants meaningfully smaller than the source.
    // The 1.25x guard avoids producing a 960w variant of a 1000w original.
    const widths = TARGET_WIDTHS.filter((w) => w * 1.25 <= originalWidth);
    const basename = filename.replace(/\.webp$/, '');

    for (const w of widths) {
      const out = variantPath(basename, w);
      if (isUpToDate(out, sourceFile)) {
        skipped++;
        continue;
      }
      await sharp(sourceFile)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      generated++;
      const kb = Math.round(fs.statSync(out).size / 1024);
      console.log(`  generated ${path.basename(out)} (${kb}KB)`);
    }

    manifest[filename] = {
      widths: [...widths, originalWidth].sort((a, b) => a - b),
      originalWidth,
    };
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(
    `\n  ${generated} variant${generated === 1 ? '' : 's'} generated, ${skipped} up-to-date.\n  manifest: ${path.relative(process.cwd(), MANIFEST_PATH)}`
  );
})().catch((err) => {
  console.error('Image build failed:', err);
  process.exit(1);
});
