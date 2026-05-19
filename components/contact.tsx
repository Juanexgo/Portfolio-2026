"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/visuals/grid-background";
import { Icon } from "@/lib/icons";
import { isExternalHref, normalizeHref } from "@/lib/utils";
import type { ContactSection } from "@/src/types/portfolio";

interface ContactProps {
  content: ContactSection;
}

export function Contact({ content }: ContactProps) {
  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <GridBackground fade="radial" className="opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(199 92% 60% / 0.18), hsl(199 92% 60% / 0) 60%)",
        }}
      />

      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-card/50 p-10 backdrop-blur-2xl sm:p-14 md:p-20"
          style={{
            boxShadow:
              "inset 0 1px 0 0 hsl(0 0% 100% / 0.06), 0 1px 2px 0 hsl(0 0% 0% / 0.4), 0 32px 80px -32px hsl(199 92% 60% / 0.25)",
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="relative flex flex-col items-center text-center">
            <span className="section-label">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {content.eyebrow}
            </span>

            <h2 className="mt-6 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              <span className="text-gradient">{content.titlePrimary}</span>{" "}
              <span className="text-gradient-accent">{content.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.description}
            </p>

            {content.ctas.length > 0 ? (
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
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
                        {cta.icon ? (
                          <Icon name={cta.icon} className="h-4 w-4" />
                        ) : null}
                        {cta.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            ) : null}

            {content.channels.length > 0 ? (
              <div className="mt-12 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
                {content.channels.map((c) => {
                  const external = isExternalHref(c.href);
                  return (
                  <Link
                    key={c.label}
                    href={normalizeHref(c.href)}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-left transition-all hover:border-border hover:bg-background/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-card/40 text-primary">
                        <Icon name={c.icon} className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          {c.label}
                        </div>
                        <div className="text-xs text-foreground">{c.value}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
