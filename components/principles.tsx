"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/lib/icons";
import type { PrinciplesSection } from "@/src/types/portfolio";

interface PrinciplesProps {
  content: PrinciplesSection;
}

export function Principles({ content }: PrinciplesProps) {
  return (
    <section id="principles" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {content.principles.map((p, i) => (
          <motion.div
            key={`${p.title}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 transition-all duration-500 hover:border-border hover:bg-card/70"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Icon name={p.icon} className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
