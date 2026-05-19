"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/lib/icons";
import type { AboutSection } from "@/src/types/portfolio";

interface AboutProps {
  content: AboutSection;
}

export function About({ content }: AboutProps) {
  return (
    <section id="about" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.focusAreas.map((area, i) => (
          <motion.div
            key={`${area.title}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur transition-all duration-500 hover:border-border hover:bg-card/70"
          >
            <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_60%)]" />
            </div>
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Icon name={area.icon} className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {area.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {area.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
