"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { normalizeHref } from "@/lib/utils";
import {
  CSMPreview,
  MediFlowPreview,
  POSPreview,
} from "@/components/visuals/project-previews";
import { Icon } from "@/lib/icons";
import type {
  Project,
  ProjectsSection,
  ProjectTone,
} from "@/src/types/portfolio";

/**
 * Maps a project's `id` to its hand-built dashboard preview component.
 * Unknown IDs render the generic placeholder.
 */
const previewMap: Record<string, React.ComponentType> = {
  mediflow: MediFlowPreview,
  csm: CSMPreview,
  pos: POSPreview,
};

const toneStyles: Record<ProjectTone, string> = {
  rose: "bg-rose-400/10 border-rose-400/30 text-rose-300",
  amber: "bg-amber-400/10 border-amber-400/30 text-amber-300",
  sky: "bg-sky-400/10 border-sky-400/30 text-sky-300",
  primary: "bg-primary/10 border-primary/30 text-primary",
  emerald: "bg-emerald-400/10 border-emerald-400/30 text-emerald-300",
};

interface ProjectsProps {
  content: ProjectsSection;
}

export function Projects({ content }: ProjectsProps) {
  return (
    <section id="projects" className="section-shell">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 grid auto-rows-fr gap-4 lg:grid-cols-12">
        {content.projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFeatured = project.featured ?? false;
  const PreviewComponent = previewMap[project.id] ?? PlaceholderPreview;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.12] hover:bg-card/60 ${project.span ?? ""}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 hsl(0 0% 100% / 0.04), 0 1px 2px 0 hsl(0 0% 0% / 0.4), 0 8px 24px -8px hsl(220 50% 2% / 0.6)",
      }}
    >
      <div
        className={`relative ${isFeatured ? "h-[300px]" : "h-[180px]"} overflow-hidden border-b border-border/40`}
      >
        <div className="absolute inset-0 mask-fade-bottom">
          {React.createElement(PreviewComponent)}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-50" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border ${toneStyles[project.tone]}`}
            >
              <Icon name={project.icon} className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {project.tagline}
              </div>
              <h3 className="mt-0.5 text-lg font-semibold text-foreground">
                {project.name}
              </h3>
            </div>
          </div>
          <ProjectLinks repoUrl={project.repoUrl} liveUrl={project.liveUrl} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {project.capabilities.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.capabilities.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-background/30 px-2 py-0.5 text-[0.7rem] text-muted-foreground"
              >
                <Icon name={c.icon} className="h-3 w-3 text-primary" />
                {c.label}
              </span>
            ))}
          </div>
        ) : null}

        {isFeatured ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.architecture.length > 0 ? (
              <div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Architecture highlights
                </div>
                <ul className="mt-2 space-y-1.5">
                  {project.architecture.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.challenges.length > 0 ? (
              <div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Engineering challenges
                </div>
                <ul className="mt-2 space-y-1.5">
                  {project.challenges.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-amber-300/70" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {project.stack.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/40 pt-4">
            {project.stack.map((s) => (
              <Badge key={s} variant="outline" className="font-mono">
                {s}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function ProjectLinks({
  repoUrl,
  liveUrl,
}: {
  repoUrl?: string;
  liveUrl?: string;
}) {
  const hasAny = !!(repoUrl || liveUrl);
  if (!hasAny) {
    return (
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors group-hover:text-foreground"
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    );
  }
  return (
    <div className="flex flex-none items-center gap-1.5">
      {repoUrl ? (
        <a
          href={normalizeHref(repoUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source repository"
          title="Source repository"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Github className="h-4 w-4" />
        </a>
      ) : null}
      {liveUrl ? (
        <a
          href={normalizeHref(liveUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open live site"
          title="Live site"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function PlaceholderPreview() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-40 mask-radial" />
    </div>
  );
}
