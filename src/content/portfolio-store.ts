import "server-only";
import fs from "node:fs";
import path from "node:path";

import { head, list, put } from "@vercel/blob";

import type { PortfolioContent } from "@/src/types/portfolio";
import { portfolioContent as defaultContent } from "./portfolio";

/**
 * Dual-mode runtime store for portfolio content.
 *
 * - **Local dev** (`BLOB_READ_WRITE_TOKEN` unset): reads / writes the JSON
 *   overlay at `src/content/portfolio.json`. Same as before — instant, no
 *   network.
 * - **Production** (Vercel Blob configured): reads / writes a blob at
 *   `portfolio/content.json`. Saves are instant and survive across the
 *   serverless filesystem reset that happens on every cold start.
 *
 * `portfolio.ts` remains the seed: if neither source has data yet, the
 * default object literal is used.
 */

const LOCAL_STORE_PATH = path.join(
  process.cwd(),
  "src/content/portfolio.json"
);
const BLOB_KEY = "portfolio/content.json";

const TOP_LEVEL_KEYS: ReadonlyArray<keyof PortfolioContent> = [
  "personal",
  "nav",
  "hero",
  "about",
  "experience",
  "projects",
  "architecture",
  "principles",
  "techStack",
  "contact",
  "footer",
];

function isValidShape(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return TOP_LEVEL_KEYS.every(
    (key) => key in record && typeof record[key] === "object"
  );
}

function blobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function readFromBlob(): Promise<PortfolioContent | null> {
  try {
    // `head` does not expose content; we need to find the blob URL via list
    // (cached by Next so it's cheap) and then fetch it.
    const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!blob) return null;
    const res = await fetch(blob.url, {
      // Skip the Next data cache: we revalidate manually after every save.
      cache: "no-store",
    });
    if (!res.ok) return null;
    const parsed = (await res.json()) as unknown;
    return isValidShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readFromLocalFile(): PortfolioContent | null {
  try {
    const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return isValidShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the live portfolio content.
 *
 * Precedence:
 *   1. Vercel Blob overlay (when configured).
 *   2. Local JSON overlay (dev).
 *   3. Default object literal from `portfolio.ts`.
 */
export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (blobConfigured()) {
    const remote = await readFromBlob();
    if (remote) return remote;
  }
  const local = readFromLocalFile();
  if (local) return local;
  return defaultContent;
}

async function writeToBlob(content: PortfolioContent): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(content, null, 2) + "\n", {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

function writeToLocalFile(content: PortfolioContent): void {
  fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  fs.writeFileSync(
    LOCAL_STORE_PATH,
    JSON.stringify(content, null, 2) + "\n",
    "utf8"
  );
}

/** Persist the given content to the active store. Throws on I/O error. */
export async function savePortfolioContent(
  content: PortfolioContent
): Promise<void> {
  if (!isValidShape(content)) {
    throw new Error("Invalid portfolio content shape.");
  }
  if (blobConfigured()) {
    await writeToBlob(content);
    return;
  }
  writeToLocalFile(content);
}

/** Whether the runtime is using Vercel Blob vs the local filesystem. */
export function getStoreMode(): "blob" | "local" {
  return blobConfigured() ? "blob" : "local";
}
