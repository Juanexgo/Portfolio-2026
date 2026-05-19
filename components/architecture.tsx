"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/lib/icons";
import type {
  ArchitectureLayer,
  ArchitectureSection,
} from "@/src/types/portfolio";

interface ArchitectureProps {
  content: ArchitectureSection;
}

export function Architecture({ content }: ArchitectureProps) {
  return (
    <section id="architecture" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 backdrop-blur-xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 hsl(0 0% 100% / 0.04), 0 1px 2px 0 hsl(0 0% 0% / 0.4), 0 8px 24px -8px hsl(220 50% 2% / 0.6)",
        }}
      >
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 grid-bg mask-radial opacity-50" />
          <div className="relative flex flex-col gap-4">
            {content.layers.map((layer, i) => (
              <LayerRow
                key={layer.label}
                layer={layer}
                index={i}
                total={content.layers.length}
              />
            ))}
          </div>
        </div>

        {content.legend.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 border-t border-border/40 bg-background/30 p-4 sm:grid-cols-4">
            {content.legend.map((l) => (
              <div
                key={l.label}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${l.dotClassName}`} />
                {l.label}
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}

function LayerRow({
  layer,
  index,
  total,
}: {
  layer: ArchitectureLayer;
  index: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-stretch gap-4">
        <div className="hidden w-32 flex-none flex-col justify-center sm:flex">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Layer {String(index + 1).padStart(2, "0")}
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            {layer.label}
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
            {layer.label}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {layer.nodes.map((node) => (
              <Node
                key={node.label}
                iconName={node.icon}
                label={node.label}
                color={layer.color}
              />
            ))}
          </div>
        </div>
      </div>

      {index < total - 1 ? (
        <div className="flex justify-center py-1.5">
          <div className="relative h-5 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0">
            <div className="absolute -inset-x-2 inset-y-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

function Node({
  iconName,
  label,
  color,
}: {
  iconName: string;
  label: string;
  color: "primary" | "accent" | "muted";
}) {
  const colorMap: Record<typeof color, string> = {
    primary: "border-primary/30 bg-primary/10 text-primary",
    accent: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    muted: "border-border/60 bg-secondary/40 text-muted-foreground",
  };
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-card/30 px-3 py-2.5 transition-colors hover:border-border/80">
      <span
        className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-md border ${colorMap[color]}`}
      >
        <Icon name={iconName} className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs leading-tight text-foreground/90">{label}</span>
    </div>
  );
}
