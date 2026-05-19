// Sync `src/content/portfolio.json` and `public/resume.pdf` to Vercel Blob
// after every production build. This makes the git repo the source of truth:
// pushes to main always end up reflected in production, even when the admin
// in production has saved overlays to the blob between deploys.
//
// Runs as `postbuild` (see package.json). Silently skips when
// `BLOB_READ_WRITE_TOKEN` is not present (i.e. local `next build`).

import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.log("[sync-blob] No BLOB_READ_WRITE_TOKEN — skipping.");
  process.exit(0);
}

const { put } = await import("@vercel/blob");

const ROOT = process.cwd();
const CONTENT_PATH = path.join(ROOT, "src/content/portfolio.json");
const RESUME_PATH = path.join(ROOT, "public/resume.pdf");

const CONTENT_KEY = "portfolio/content.json";
const RESUME_KEY = "portfolio/resume.pdf";

async function syncFile({ diskPath, blobKey, contentType, label }) {
  if (!fs.existsSync(diskPath)) {
    console.log(`[sync-blob] ${label} not on disk at ${diskPath} — skipping.`);
    return;
  }
  const bytes = fs.readFileSync(diskPath);
  const result = await put(blobKey, bytes, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
    token: TOKEN,
  });
  console.log(
    `[sync-blob] Synced ${label} (${bytes.length} bytes) → ${result.url}`
  );
}

try {
  await syncFile({
    diskPath: CONTENT_PATH,
    blobKey: CONTENT_KEY,
    contentType: "application/json",
    label: "portfolio.json",
  });
  await syncFile({
    diskPath: RESUME_PATH,
    blobKey: RESUME_KEY,
    contentType: "application/pdf",
    label: "resume.pdf",
  });
  console.log("[sync-blob] Done.");
} catch (err) {
  // Don't fail the build over a blob sync error — log loudly and move on.
  console.error("[sync-blob] Failed:", err);
}
