import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Whether an href points outside the current site.
 *
 * Internal: empty, anchor (#…), absolute path (/…), `mailto:`, `tel:`.
 * Everything else is treated as external — including bare domains like
 * `www.example.com` that would otherwise resolve as a relative path.
 */
export function isExternalHref(href: string | undefined | null): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return false;
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("sms:")
  ) {
    return false;
  }
  return true;
}

/**
 * Normalize an href so the browser resolves it correctly.
 *
 * Bare domains entered without a protocol (e.g. `www.linkedin.com/in/me` or
 * `github.com/me`) get an `https://` prefix so they navigate off-site instead
 * of being treated as relative paths under the current origin.
 */
export function normalizeHref(href: string | undefined | null): string {
  if (!href) return "#";
  const trimmed = href.trim();
  if (trimmed.length === 0) return "#";
  if (!isExternalHref(trimmed)) return trimmed;
  // Already has a protocol (http, https, ftp, etc.).
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
