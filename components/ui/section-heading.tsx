"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="section-label">
        <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        {eyebrow}
      </span>
      <h2 className="section-heading text-gradient">{title}</h2>
      {description ? (
        <p className="section-subheading">{description}</p>
      ) : null}
    </motion.div>
  );
}
