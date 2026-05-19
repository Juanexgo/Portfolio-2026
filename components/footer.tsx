import Link from "next/link";
import { Icon } from "@/lib/icons";
import { isExternalHref, normalizeHref } from "@/lib/utils";
import type {
  FooterSection,
  PersonalInfo,
} from "@/src/types/portfolio";

interface FooterProps {
  content: FooterSection;
  personal: PersonalInfo;
}

export function Footer({ content, personal }: FooterProps) {
  const copyright = content.copyright.replace(
    "{year}",
    String(new Date().getFullYear())
  );

  return (
    <footer className="relative border-t border-border/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-mono text-[0.7rem] text-primary">
              {personal.initials}
            </span>
            <div>
              <div className="text-sm font-medium text-foreground">
                {personal.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {content.tagline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {content.socials.map((s) => {
              const external = isExternalHref(s.href);
              return (
                <Link
                  key={s.label}
                  href={normalizeHref(s.href)}
                  aria-label={s.label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="font-mono">{copyright}</div>
          <div className="flex items-center gap-2 font-mono">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="uppercase tracking-wider">{content.status}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
