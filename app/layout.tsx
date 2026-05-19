import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { portfolioContent } from "@/src/content/portfolio";
import "./globals.css";

const { personal } = portfolioContent;
const title = `${personal.name} — ${personal.role}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://juancanul.dev"),
  title: {
    default: title,
    template: `%s · ${personal.name}`,
  },
  description: personal.tagline,
  keywords: [
    personal.name,
    personal.role,
    "Software Engineer",
    "Next.js",
    "NestJS",
    "TypeScript",
    "Enterprise Software",
    "Healthcare Software",
    "Realtime Systems",
  ],
  authors: [{ name: personal.name }],
  creator: personal.name,
  openGraph: {
    type: "website",
    title,
    description: personal.tagline,
    url: "https://juancanul.dev",
    siteName: personal.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: personal.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
