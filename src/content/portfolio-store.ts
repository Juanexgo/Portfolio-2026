import "server-only";
import fs from "node:fs";
import path from "node:path";

import type { PortfolioContent } from "@/src/types/portfolio";
import { portfolioContent as defaultContent } from "./portfolio";

/**
 * Runtime overlay produced by the admin editor.
 *
 * `portfolio.ts` holds the code-authored defaults (and is also the seed used
 * the first time the editor is opened). This JSON file becomes the live
 * source of truth once the user clicks **Save** in /admin.
 *
 * It is intentionally not gitignored: committing it is how saved content
 * makes it to production (filesystems on most hosts are read-only at runtime,
 * so saves only succeed locally — `git push` is the deploy step).
 */
const STORE_PATH = path.join(process.cwd(), "src/content/portfolio.json");

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
  return TOP_LEVEL_KEYS.every((key) => key in record && typeof record[key] === "object");
}

/**
 * Returns the live portfolio content.
 *
 * Order of precedence:
 *   1. JSON overlay written by the admin editor (if present and valid).
 *   2. The default object literal from `portfolio.ts`.
 */
export function getPortfolioContent(): PortfolioContent {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (isValidShape(parsed)) return parsed;
  } catch {
    // ENOENT (no overlay yet) or invalid JSON — fall back to defaults.
  }
  return defaultContent;
}

/** Persist the given content to the overlay JSON file. Throws on I/O error. */
export function savePortfolioContent(content: PortfolioContent): void {
  if (!isValidShape(content)) {
    throw new Error("Invalid portfolio content shape.");
  }
  const dir = path.dirname(STORE_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(content, null, 2) + "\n", "utf8");
}

/** Path of the overlay file, exposed for diagnostics / display. */
export const PORTFOLIO_STORE_PATH = STORE_PATH;
