"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TechStackSection } from "@/src/types/portfolio";

interface TechStackProps {
  content: TechStackSection;
}

export function TechStack({ content }: TechStackProps) {
  return (
    <section id="stack" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {content.categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-3">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {cat.label}
              </div>
              <div className="font-mono text-[0.65rem] text-muted-foreground/60">
                {String(cat.items.length).padStart(2, "0")} tools
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cat.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.02 * idx,
                    ease: "easeOut",
                  }}
                  className="group relative overflow-hidden rounded-lg border border-border/40 bg-background/30 px-3 py-2.5 transition-colors hover:border-border/80 hover:bg-background/50"
                >
                  <div className="text-sm font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">
                    {item.note}
                  </div>
                  <span className="absolute inset-y-0 right-2 my-auto h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
