"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ADMIN_COOKIE_NAME, isAdminAuthed } from "./auth";
import { savePortfolioContent } from "@/src/content/portfolio-store";
import type { PortfolioContent } from "@/src/types/portfolio";

export type LoginState = { ok: boolean; error?: string };

/** Validate the submitted password against the ADMIN_PASSWORD env var. */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      ok: false,
      error:
        "ADMIN_PASSWORD is not set. Create .env.local with ADMIN_PASSWORD=your_password and restart the dev server.",
    };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, error: "Password required." };
  }

  if (password !== expected) {
    return { ok: false, error: "Invalid password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24h
  });

  redirect("/admin");
}

/** Clear the admin cookie. */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

export type SaveState = {
  ok: boolean;
  error?: string;
  /** Epoch millis of the successful write. */
  savedAt?: number;
};

/**
 * Persist edits from the admin editor to `src/content/portfolio.json`
 * and revalidate the public site so the change is visible immediately.
 */
export async function saveContentAction(
  content: PortfolioContent
): Promise<SaveState> {
  if (!(await isAdminAuthed())) {
    return { ok: false, error: "Session expired. Reload and log in again." };
  }

  try {
    savePortfolioContent(content);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to write portfolio content to disk.",
    };
  }

  // Re-render the public site on next request.
  revalidatePath("/", "layout");

  return { ok: true, savedAt: Date.now() };
}

const RESUME_PUBLIC_PATH = "/resume.pdf";
const RESUME_DISK_PATH = path.join(process.cwd(), "public", "resume.pdf");
const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadResumeState = {
  ok: boolean;
  error?: string;
  /** Public path the file is now served from (e.g. "/resume.pdf"). */
  url?: string;
  /** Byte size of the written file. */
  size?: number;
};

/**
 * Persist a PDF resume to `public/resume.pdf` so it is served at /resume.pdf.
 * Any CTA whose `href` already points to `/resume.pdf` will pick up the new
 * file with no further edits.
 */
export async function uploadResumeAction(
  formData: FormData
): Promise<UploadResumeState> {
  if (!(await isAdminAuthed())) {
    return { ok: false, error: "Session expired. Reload and log in again." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file received." };
  }
  if (file.size === 0) {
    return { ok: false, error: "File is empty." };
  }
  if (file.size > MAX_RESUME_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    const max = (MAX_RESUME_BYTES / 1024 / 1024).toFixed(0);
    return { ok: false, error: `File is ${mb}MB · max ${max}MB.` };
  }

  const lowerName = file.name.toLowerCase();
  const looksLikePdf =
    file.type === "application/pdf" || lowerName.endsWith(".pdf");
  if (!looksLikePdf) {
    return { ok: false, error: "Only PDF files are accepted." };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(path.dirname(RESUME_DISK_PATH), { recursive: true });
    await fs.writeFile(RESUME_DISK_PATH, bytes);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to write resume file to disk.",
    };
  }

  // Bust any caching on the public route serving the PDF.
  revalidatePath("/", "layout");
  revalidatePath(RESUME_PUBLIC_PATH);

  return { ok: true, url: RESUME_PUBLIC_PATH, size: file.size };
}
