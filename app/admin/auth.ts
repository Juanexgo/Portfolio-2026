import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "portfolio-admin";

/** Server-side gate used by the admin page (read-only). */
export async function isAdminAuthed(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === expected;
}

export function adminPasswordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}
