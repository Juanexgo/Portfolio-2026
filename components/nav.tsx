"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isExternalHref, normalizeHref } from "@/lib/utils";
import { Icon } from "@/lib/icons";
import type { NavSection } from "@/src/types/portfolio";

interface NavProps {
  content: NavSection;
}

export function Nav({ content }: NavProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaExternal = content.cta.external ?? isExternalHref(content.cta.href);
  const ctaHref = normalizeHref(content.cta.href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <nav
          className={cn(
            "relative flex items-center justify-between rounded-2xl border border-transparent px-4 py-2.5 transition-all duration-500",
            scrolled &&
              "border-border/50 bg-card/60 backdrop-blur-xl shadow-[0_8px_24px_-12px_hsl(220_50%_2%/0.4)]"
          )}
        >
          <Link
            href="#top"
            className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <span className="absolute inset-0 rounded-md bg-primary/20 blur-sm transition-opacity duration-500 group-hover:opacity-80 opacity-40" />
              <span className="relative font-mono text-[0.7rem] tracking-wider">
                {content.initials}
              </span>
            </span>
            <span className="text-foreground">{content.brand}</span>
            {content.brandSuffix ? (
              <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
                {content.brandSuffix}
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {content.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={content.cta.variant ?? "outline"}
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link
                href={ctaHref}
                target={ctaExternal ? "_blank" : undefined}
                rel={ctaExternal ? "noopener noreferrer" : undefined}
              >
                {content.cta.label}
                <Icon name={content.cta.icon} className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl border border-border/60 bg-card/80 p-2 backdrop-blur-xl md:hidden"
            >
              {content.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                target={ctaExternal ? "_blank" : undefined}
                rel={ctaExternal ? "noopener noreferrer" : undefined}
                className="block rounded-md px-3 py-2 text-sm text-primary"
              >
                {content.cta.label} →
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
