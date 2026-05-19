import type { Metadata } from "next";
import { getPortfolioContent } from "@/src/content/portfolio-store";
import { AdminEditor } from "./admin-editor";
import { LoginForm } from "./login-form";
import { adminPasswordConfigured, isAdminAuthed } from "./auth";

export const metadata: Metadata = {
  title: "Admin · Portfolio Editor",
  robots: { index: false, follow: false },
};

/**
 * The admin page is always dynamic — it reads cookies + env at request time
 * to decide whether to render the editor or the login screen.
 */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthed())) {
    return <LoginForm configured={adminPasswordConfigured()} />;
  }
  return <AdminEditor initialContent={await getPortfolioContent()} />;
}
