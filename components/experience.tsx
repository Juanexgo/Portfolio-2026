"use client";

import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import type {
  ExperienceItem,
  ExperienceSection,
} from "@/src/types/portfolio";

interface ExperienceProps {
  content: ExperienceSection;
}

export function Experience({ content }: ExperienceProps) {
  return (
    <section id="experience" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="relative mt-16">
        <div
          aria-hidden
          className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-12">
          {content.roles.map((role, i) => (
            <TimelineItem
              key={`${role.company}-${role.period}`}
              role={role}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ role, index }: { role: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 md:pl-0"
    >
      {/* node */}
      <div className="absolute left-[12px] top-2 flex h-5 w-5 items-center justify-center md:left-1/2 md:-translate-x-1/2">
        <span className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
        <span className="relative h-2.5 w-2.5 rounded-full border border-primary/60 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>

      <div
        className={`md:grid md:grid-cols-2 md:gap-12 ${
          index % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
        }`}
      >
        {/* meta column */}
        <div
          className={`mb-4 flex flex-col gap-1.5 md:mb-0 ${
            index % 2 === 0 ? "md:items-end md:text-right md:pr-6" : "md:pl-6"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary">
              {role.period}
            </span>
            {role.current ? (
              <Badge variant="success" className="font-mono">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Current
              </Badge>
            ) : null}
          </div>
          <div className="text-base font-semibold text-foreground">
            {role.role}
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span>{role.company}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/80">
            <MapPin className="h-3 w-3" />
            <span>{role.location}</span>
          </div>
        </div>

        {/* card column */}
        <div
          className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-border hover:bg-card/70 ${
            index % 2 === 0 ? "md:pl-8" : "md:pr-8"
          }`}
        >
          <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_60%)]" />
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {role.summary}
          </p>

          <ul className="mt-5 space-y-2">
            {role.highlights.map((h, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-foreground/90"
              >
                <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary/70" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>

          {role.metrics.length > 0 ? (
            <div
              className="mt-5 grid gap-3 border-t border-border/40 pt-5"
              style={{
                gridTemplateColumns: `repeat(${Math.min(role.metrics.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {role.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-mono text-lg font-semibold tracking-tight text-foreground">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {role.stack.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {role.stack.map((s) => (
                <Badge key={s} variant="outline" className="font-mono">
                  {s}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
