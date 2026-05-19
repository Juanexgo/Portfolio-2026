"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/visuals/dashboard-preview";
import { GridBackground } from "@/components/visuals/grid-background";
import { Icon } from "@/lib/icons";
import { isExternalHref, normalizeHref } from "@/lib/utils";
import type { HeroSection } from "@/src/types/portfolio";

interface HeroProps {
  content: HeroSection;
}

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 sm:pt-40">
      <GridBackground fade="radial" className="opacity-60" />
      {/* gradient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(199 92% 60% / 0.18), hsl(199 92% 60% / 0) 60%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="section-label">
            <Sparkles className="h-3 w-3 text-primary" />
            {content.eyebrow}
          </span>

          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient">{content.title}</span>
            <span className="mt-2 block bg-gradient-to-b from-foreground to-muted-foreground/70 bg-clip-text font-medium text-transparent">
              {content.subtitle}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.description}
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            {content.ctas.map((cta) => {
              const external = cta.external ?? isExternalHref(cta.href);
              return (
                <Button
                  key={cta.label}
                  asChild
                  variant={cta.variant ?? "outline"}
                  size="lg"
                >
                  <Link
                    href={normalizeHref(cta.href)}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {cta.icon ? <Icon name={cta.icon} className="h-4 w-4" /> : null}
                    {cta.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {content.stackPills.length > 0 ? (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
              {content.stackPills.map((pill) => (
                <span key={pill} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>

        <div className="relative mt-20 sm:mt-24">
          <DashboardPreview />
          <div className="mt-10 flex justify-center text-muted-foreground/70">
            <Link
              href="#about"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] hover:text-foreground transition-colors"
            >
              <ArrowDown className="h-3 w-3 animate-bounce" />
              Scroll to explore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
