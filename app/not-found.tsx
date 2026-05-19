import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg mask-radial opacity-50" />
      <span className="section-label">404 · Not found</span>
      <h1 className="mt-6 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
        <span className="text-gradient">This route hasn&apos;t shipped yet.</span>
      </h1>
      <p className="mt-4 max-w-md text-balance text-base text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist. Head back to the
        homepage to keep exploring.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-8">
        <Link href="/">Back to homepage</Link>
      </Button>
    </main>
  );
}
