// Converts every PNG under assets/wacca/img into a WebP file at the same
// relative path under public/wacca/img, so the app can keep serving from
// exactly the same URLs it always did, just smaller. Source PNGs live
// outside public/ so they're never shipped - only the generated WebP is.
//
// Runs as part of `yarn build` (production compile) and once via
// `postinstall` so a fresh clone has images to look at in `yarn dev`
// without needing a full production build first. Skips files that are
// already up to date so repeat runs (e.g. every `yarn dev` start) are
// near-instant.

import { readdir, mkdir, stat } from "node:fs/promises";
import { join, dirname, relative, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "assets", "wacca", "img");
const DEST_DIR = join(__dirname, "..", "public", "wacca", "img");
const WEBP_QUALITY = 82;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (extname(entry.name).toLowerCase() === ".png") {
      yield fullPath;
    }
  }
}

async function isUpToDate(srcPath, destPath) {
  try {
    const [srcStat, destStat] = await Promise.all([
      stat(srcPath),
      stat(destPath),
    ]);
    return destStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

async function main() {
  let converted = 0;
  let skipped = 0;

  for await (const srcPath of walk(SRC_DIR)) {
    const relPath = relative(SRC_DIR, srcPath);
    const destPath = join(
      DEST_DIR,
      dirname(relPath),
      `${basename(relPath, ".png")}.webp`
    );

    if (await isUpToDate(srcPath, destPath)) {
      skipped++;
      continue;
    }

    await mkdir(dirname(destPath), { recursive: true });
    await sharp(srcPath).webp({ quality: WEBP_QUALITY }).toFile(destPath);
    converted++;
  }

  console.log(`[buildImages] ${converted} converted, ${skipped} up to date`);
}

main().catch((error) => {
  console.error("[buildImages] failed:", error);
  process.exit(1);
});
