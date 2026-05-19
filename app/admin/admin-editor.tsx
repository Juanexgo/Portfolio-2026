"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardCopy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Link2,
  Loader2,
  LogOut,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Architecture } from "@/components/architecture";
import { Principles } from "@/components/principles";
import { TechStack } from "@/components/tech-stack";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

import type {
  ArchitectureLayer,
  ExperienceItem,
  ExperienceMetric,
  FocusArea,
  PortfolioContent,
  Principle,
  Project,
  ProjectCapability,
  ProjectTone,
  SocialLink,
  TechStackGroup,
  TechStackItem,
  ContactChannel,
  CTAButton,
  NavLink,
} from "@/src/types/portfolio";

import {
  AddItemButton,
  ArrayItem,
  CheckboxField,
  Field,
  IconInput,
  Select,
  StringListField,
  TextArea,
  TextInput,
} from "./editor-primitives";

import {
  logoutAction,
  saveContentAction,
  uploadResumeAction,
} from "./actions";

type TabId =
  | "personal"
  | "nav"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "architecture"
  | "principles"
  | "techStack"
  | "contact"
  | "footer";

const tabs: { id: TabId; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "nav", label: "Nav" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "principles", label: "Principles" },
  { id: "techStack", label: "Tech Stack" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer" },
];

const ctaVariantOptions = [
  { value: "primary" as const, label: "primary" },
  { value: "outline" as const, label: "outline" },
  { value: "ghost" as const, label: "ghost" },
  { value: "default" as const, label: "default" },
];

const projectToneOptions: { value: ProjectTone; label: string }[] = [
  { value: "rose", label: "rose" },
  { value: "amber", label: "amber" },
  { value: "sky", label: "sky" },
  { value: "primary", label: "primary" },
  { value: "emerald", label: "emerald" },
];

const layerColorOptions = [
  { value: "primary" as const, label: "primary" },
  { value: "accent" as const, label: "accent" },
  { value: "muted" as const, label: "muted" },
];

interface AdminEditorProps {
  initialContent: PortfolioContent;
}

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: number }
  | { kind: "error"; message: string };

export function AdminEditor({ initialContent }: AdminEditorProps) {
  const [content, setContent] = React.useState<PortfolioContent>(initialContent);
  const [tab, setTab] = React.useState<TabId>("personal");
  const [preview, setPreview] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [savedSnapshot, setSavedSnapshot] = React.useState<string>(() =>
    JSON.stringify(initialContent)
  );
  const [status, setStatus] = React.useState<SaveStatus>({ kind: "idle" });

  const json = React.useMemo(() => JSON.stringify(content, null, 2), [content]);
  const compactJson = React.useMemo(() => JSON.stringify(content), [content]);
  const isDirty = compactJson !== savedSnapshot;
  const isSaving = status.kind === "saving";

  function update<K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K]
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    if (!isDirty) return;
    if (
      confirm(
        "Discard unsaved changes and revert to the last saved content?"
      )
    ) {
      try {
        setContent(JSON.parse(savedSnapshot) as PortfolioContent);
      } catch {
        setContent(initialContent);
      }
      setStatus({ kind: "idle" });
    }
  }

  const save = React.useCallback(async () => {
    setStatus({ kind: "saving" });
    try {
      const res = await saveContentAction(content);
      if (res.ok) {
        setSavedSnapshot(JSON.stringify(content));
        setStatus({ kind: "saved", at: res.savedAt ?? Date.now() });
      } else {
        setStatus({
          kind: "error",
          message: res.error ?? "Save failed.",
        });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Save failed.",
      });
    }
  }, [content]);

  // Auto-fade the "Saved" pill — long enough that a glancing user catches it.
  React.useEffect(() => {
    if (status.kind !== "saved") return;
    const id = setTimeout(() => setStatus({ kind: "idle" }), 6000);
    return () => clearTimeout(id);
  }, [status]);

  // Cmd/Ctrl+S — save.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        if (!isSaving && isDirty) void save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSaving, isDirty, save]);

  // Warn before leaving with unsaved changes.
  React.useEffect(() => {
    if (!isDirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function downloadJson() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (preview) {
    return (
      <PreviewMode content={content} onExit={() => setPreview(false)} />
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Header bar */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-mono text-[0.7rem] text-primary">
              JC
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                Portfolio Editor
                <StatusBadge status={status} dirty={isDirty} />
              </div>
              <div className="truncate text-[0.65rem] text-muted-foreground">
                Save writes{" "}
                <code className="font-mono">src/content/portfolio.json</code>{" "}
                and refreshes <code className="font-mono">/</code>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(true)}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                title="Open the live site in a new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View live
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={!isDirty || isSaving}
              title={isDirty ? "Discard unsaved changes" : "Nothing to discard"}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={save}
              disabled={!isDirty || isSaving}
              title={
                isSaving
                  ? "Saving…"
                  : isDirty
                    ? "Save changes (⌘S)"
                    : status.kind === "saved"
                      ? "All changes saved"
                      : "No changes to save"
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : !isDirty && status.kind === "saved" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved
                </>
              ) : !isDirty ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All saved
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </form>
          </div>
        </div>
        {status.kind === "saved" ? (
          <div className="border-t border-emerald-500/30 bg-emerald-500/10">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-2 text-[0.7rem] text-emerald-200">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">Saved</span>
                <span className="text-emerald-300/70">
                  · wrote{" "}
                  <code className="font-mono">src/content/portfolio.json</code>
                </span>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 font-medium text-emerald-200 underline-offset-2 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Open live site
              </a>
            </div>
          </div>
        ) : null}
        {status.kind === "error" ? (
          <div className="border-t border-rose-500/30 bg-rose-500/10">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-6 py-2 text-[0.7rem] text-rose-200">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium">Save failed:</span>
              <span className="truncate">{status.message}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[200px_1fr]">
        {/* Tabs */}
        <aside className="self-start lg:sticky lg:top-24">
          <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors",
                  tab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-card/40 hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Editor panel */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-xl sm:p-6">
            {tab === "personal" ? (
              <PersonalEditor
                value={content.personal}
                onChange={(v) => update("personal", v)}
              />
            ) : null}
            {tab === "nav" ? (
              <NavEditor
                value={content.nav}
                onChange={(v) => update("nav", v)}
              />
            ) : null}
            {tab === "hero" ? (
              <HeroEditor
                value={content.hero}
                onChange={(v) => update("hero", v)}
              />
            ) : null}
            {tab === "about" ? (
              <AboutEditor
                value={content.about}
                onChange={(v) => update("about", v)}
              />
            ) : null}
            {tab === "experience" ? (
              <ExperienceEditor
                value={content.experience}
                onChange={(v) => update("experience", v)}
              />
            ) : null}
            {tab === "projects" ? (
              <ProjectsEditor
                value={content.projects}
                onChange={(v) => update("projects", v)}
              />
            ) : null}
            {tab === "architecture" ? (
              <ArchitectureEditor
                value={content.architecture}
                onChange={(v) => update("architecture", v)}
              />
            ) : null}
            {tab === "principles" ? (
              <PrinciplesEditor
                value={content.principles}
                onChange={(v) => update("principles", v)}
              />
            ) : null}
            {tab === "techStack" ? (
              <TechStackEditor
                value={content.techStack}
                onChange={(v) => update("techStack", v)}
              />
            ) : null}
            {tab === "contact" ? (
              <ContactEditor
                value={content.contact}
                onChange={(v) => update("contact", v)}
              />
            ) : null}
            {tab === "footer" ? (
              <FooterEditor
                value={content.footer}
                onChange={(v) => update("footer", v)}
              />
            ) : null}
          </div>

          {/* Export / backup */}
          <div className="mt-6 rounded-xl border border-border/50 bg-card/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Export &amp; backup
                </div>
                <p className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
                  Save (⌘S) is the canonical way to persist. Use these to copy
                  the raw JSON or download a backup file.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyJson}>
                  {copied ? (
                    <>
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-3.5 w-3.5" />
                      Copy JSON
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadJson}>
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>

            <details className="mt-3 overflow-hidden rounded-lg border border-border/40 bg-background/30">
              <summary className="cursor-pointer px-3 py-2 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                Raw JSON output
              </summary>
              <pre className="max-h-[420px] overflow-auto border-t border-border/40 bg-background/60 p-4 font-mono text-[0.7rem] leading-relaxed text-foreground/80">
                {json}
              </pre>
            </details>
          </div>

          <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
            Commit{" "}
            <code className="font-mono">src/content/portfolio.json</code> (and{" "}
            <code className="font-mono">public/resume.pdf</code> if you replaced
            it) to ship changes to production — hosted runtimes have read-only
            filesystems, so saves only persist locally until you{" "}
            <code className="font-mono">git push</code>.
          </p>
        </section>
      </div>
    </div>
  );
}

/* ---------- Preview Mode ---------- */

function PreviewMode({
  content,
  onExit,
}: {
  content: PortfolioContent;
  onExit: () => void;
}) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-3 backdrop-blur-xl">
        <div className="text-xs font-medium uppercase tracking-wider text-primary">
          Preview mode · live edits
        </div>
        <Button variant="outline" size="sm" onClick={onExit}>
          <EyeOff className="h-3.5 w-3.5" />
          Exit Preview
        </Button>
      </div>
      <main className="relative min-h-screen overflow-x-clip">
        <Nav content={content.nav} />
        <Hero content={content.hero} />
        <About content={content.about} />
        <Experience content={content.experience} />
        <Projects content={content.projects} />
        <Architecture content={content.architecture} />
        <Principles content={content.principles} />
        <TechStack content={content.techStack} />
        <Contact content={content.contact} />
        <Footer content={content.footer} personal={content.personal} />
      </main>
    </div>
  );
}

/* ---------- Section editors ---------- */

function PersonalEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["personal"];
  onChange: (v: PortfolioContent["personal"]) => void;
}) {
  const set = <K extends keyof typeof value>(k: K, v: (typeof value)[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <Section title="Personal info" hint="Used in metadata, footer and the brand badge.">
      <Grid>
        <Field label="Name">
          <TextInput value={value.name} onChange={(v) => set("name", v)} />
        </Field>
        <Field label="Initials">
          <TextInput
            value={value.initials}
            onChange={(v) => set("initials", v)}
          />
        </Field>
        <Field label="Role">
          <TextInput value={value.role} onChange={(v) => set("role", v)} />
        </Field>
        <Field label="Location">
          <TextInput
            value={value.location}
            onChange={(v) => set("location", v)}
          />
        </Field>
        <Field label="Email">
          <TextInput value={value.email} onChange={(v) => set("email", v)} />
        </Field>
        <Field label="Resume URL" hint="Path or absolute URL to your resume PDF.">
          <TextInput
            value={value.resumeUrl}
            onChange={(v) => set("resumeUrl", v)}
          />
        </Field>
      </Grid>
      <ResumeUpload
        currentUrl={value.resumeUrl}
        onUploaded={(url) => set("resumeUrl", url)}
        hint="Drop or pick a PDF — uploads to public/resume.pdf and updates the URL above."
      />
      <Field label="Tagline" hint="One-line summary used in metadata and OG tags.">
        <TextArea value={value.tagline} onChange={(v) => set("tagline", v)} />
      </Field>
      <Field label="Availability pill">
        <TextInput
          value={value.availability}
          onChange={(v) => set("availability", v)}
        />
      </Field>
    </Section>
  );
}

function NavEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["nav"];
  onChange: (v: PortfolioContent["nav"]) => void;
}) {
  const set = <K extends keyof typeof value>(k: K, v: (typeof value)[K]) =>
    onChange({ ...value, [k]: v });

  function updateCta<K extends keyof CTAButton>(k: K, v: CTAButton[K]) {
    onChange({ ...value, cta: { ...value.cta, [k]: v } });
  }

  function updateItems(items: NavLink[]) {
    onChange({ ...value, items });
  }

  return (
    <Section title="Navigation">
      <Grid>
        <Field label="Brand">
          <TextInput value={value.brand} onChange={(v) => set("brand", v)} />
        </Field>
        <Field label="Brand suffix">
          <TextInput
            value={value.brandSuffix}
            onChange={(v) => set("brandSuffix", v)}
          />
        </Field>
        <Field label="Initials (logo)">
          <TextInput
            value={value.initials}
            onChange={(v) => set("initials", v)}
          />
        </Field>
      </Grid>

      <div className="rounded-xl border border-border/40 bg-background/30 p-3">
        <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Top-right CTA
        </div>
        <Grid>
          <Field label="Label">
            <TextInput
              value={value.cta.label}
              onChange={(v) => updateCta("label", v)}
            />
          </Field>
          <Field label="Href">
            <TextInput
              value={value.cta.href}
              onChange={(v) => updateCta("href", v)}
            />
          </Field>
          <Field label="Icon">
            <IconInput
              value={value.cta.icon ?? ""}
              onChange={(v) => updateCta("icon", v)}
            />
          </Field>
          <Field label="Variant">
            <Select
              value={value.cta.variant ?? "outline"}
              onChange={(v) => updateCta("variant", v)}
              options={ctaVariantOptions}
            />
          </Field>
        </Grid>
        <CheckboxField
          label="Opens in new tab"
          checked={!!value.cta.external}
          onChange={(v) => updateCta("external", v)}
        />
      </div>

      <SubsectionTitle title="Links" />
      <ArrayEditor
        items={value.items}
        onChange={updateItems}
        addLabel="Add link"
        empty={() => ({ label: "", href: "" })}
        renderItem={(item, idx, updateItem) => (
          <Grid>
            <Field label="Label">
              <TextInput
                value={item.label}
                onChange={(v) => updateItem({ ...item, label: v })}
              />
            </Field>
            <Field label="Href">
              <TextInput
                value={item.href}
                onChange={(v) => updateItem({ ...item, href: v })}
              />
            </Field>
          </Grid>
        )}
        titleFor={(item) => item.label}
        subtitleFor={(item) => item.href}
      />
    </Section>
  );
}

function HeroEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["hero"];
  onChange: (v: PortfolioContent["hero"]) => void;
}) {
  const set = <K extends keyof typeof value>(k: K, v: (typeof value)[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Section title="Hero section">
      <Field label="Eyebrow">
        <TextInput value={value.eyebrow} onChange={(v) => set("eyebrow", v)} />
      </Field>
      <Grid>
        <Field label="Title (line 1)">
          <TextInput value={value.title} onChange={(v) => set("title", v)} />
        </Field>
        <Field label="Subtitle (line 2)">
          <TextInput
            value={value.subtitle}
            onChange={(v) => set("subtitle", v)}
          />
        </Field>
      </Grid>
      <Field label="Description">
        <TextArea
          value={value.description}
          onChange={(v) => set("description", v)}
          rows={4}
        />
      </Field>

      <SubsectionTitle title="Call-to-action buttons" />
      <CTAArrayEditor
        items={value.ctas}
        onChange={(ctas) => set("ctas", ctas)}
      />

      <StringListField
        label="Stack pills"
        values={value.stackPills}
        onChange={(stackPills) => set("stackPills", stackPills)}
        placeholder="Next.js&#10;TypeScript&#10;NestJS"
      />
    </Section>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["about"];
  onChange: (v: PortfolioContent["about"]) => void;
}) {
  const set = <K extends keyof typeof value>(k: K, v: (typeof value)[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Section title="About">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Focus areas" />
      <ArrayEditor<FocusArea>
        items={value.focusAreas}
        onChange={(focusAreas) => set("focusAreas", focusAreas)}
        empty={() => ({ icon: "Sparkles", title: "", body: "" })}
        addLabel="Add focus area"
        renderItem={(item, idx, upd) => (
          <>
            <Grid>
              <Field label="Title">
                <TextInput
                  value={item.title}
                  onChange={(v) => upd({ ...item, title: v })}
                />
              </Field>
              <Field label="Icon">
                <IconInput
                  value={item.icon}
                  onChange={(v) => upd({ ...item, icon: v })}
                />
              </Field>
            </Grid>
            <Field label="Body">
              <TextArea
                value={item.body}
                onChange={(v) => upd({ ...item, body: v })}
              />
            </Field>
          </>
        )}
        titleFor={(i) => i.title}
        subtitleFor={(i) => i.body}
      />
    </Section>
  );
}

function ExperienceEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["experience"];
  onChange: (v: PortfolioContent["experience"]) => void;
}) {
  return (
    <Section title="Experience">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Roles (timeline)" />
      <ArrayEditor<ExperienceItem>
        items={value.roles}
        onChange={(roles) => onChange({ ...value, roles })}
        empty={() => ({
          company: "",
          role: "",
          period: "",
          location: "",
          summary: "",
          highlights: [],
          metrics: [],
          stack: [],
        })}
        addLabel="Add role"
        renderItem={(item, idx, upd) => (
          <>
            <Grid>
              <Field label="Company">
                <TextInput
                  value={item.company}
                  onChange={(v) => upd({ ...item, company: v })}
                />
              </Field>
              <Field label="Role">
                <TextInput
                  value={item.role}
                  onChange={(v) => upd({ ...item, role: v })}
                />
              </Field>
              <Field label="Period">
                <TextInput
                  value={item.period}
                  onChange={(v) => upd({ ...item, period: v })}
                />
              </Field>
              <Field label="Location">
                <TextInput
                  value={item.location}
                  onChange={(v) => upd({ ...item, location: v })}
                />
              </Field>
            </Grid>
            <CheckboxField
              label="Mark as current role"
              checked={!!item.current}
              onChange={(v) => upd({ ...item, current: v })}
            />
            <Field label="Summary">
              <TextArea
                value={item.summary}
                onChange={(v) => upd({ ...item, summary: v })}
              />
            </Field>
            <StringListField
              label="Highlights"
              values={item.highlights}
              onChange={(highlights) => upd({ ...item, highlights })}
            />
            <SubsectionTitle title="Metrics" />
            <ArrayEditor<ExperienceMetric>
              items={item.metrics}
              onChange={(metrics) => upd({ ...item, metrics })}
              empty={() => ({ label: "", value: "" })}
              addLabel="Add metric"
              compact
              renderItem={(metric, _, updMetric) => (
                <Grid>
                  <Field label="Label">
                    <TextInput
                      value={metric.label}
                      onChange={(v) => updMetric({ ...metric, label: v })}
                    />
                  </Field>
                  <Field label="Value">
                    <TextInput
                      value={metric.value}
                      onChange={(v) => updMetric({ ...metric, value: v })}
                    />
                  </Field>
                </Grid>
              )}
              titleFor={(m) => m.label}
              subtitleFor={(m) => m.value}
            />
            <StringListField
              label="Stack"
              values={item.stack}
              onChange={(stack) => upd({ ...item, stack })}
            />
          </>
        )}
        titleFor={(i) => i.role || i.company}
        subtitleFor={(i) => `${i.company} · ${i.period}`}
      />
    </Section>
  );
}

function ProjectsEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["projects"];
  onChange: (v: PortfolioContent["projects"]) => void;
}) {
  return (
    <Section title="Projects">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Projects" />
      <p className="-mt-1 mb-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        Built-in dashboard previews exist for ids{" "}
        <code className="font-mono">mediflow</code>,{" "}
        <code className="font-mono">csm</code>,{" "}
        <code className="font-mono">pos</code>. Other ids render a neutral
        placeholder preview.
      </p>
      <ArrayEditor<Project>
        items={value.projects}
        onChange={(projects) => onChange({ ...value, projects })}
        empty={() => ({
          id: `project-${Date.now()}`,
          name: "",
          tagline: "",
          description: "",
          icon: "Layers",
          tone: "primary",
          capabilities: [],
          architecture: [],
          challenges: [],
          stack: [],
        })}
        addLabel="Add project"
        renderItem={(item, idx, upd) => (
          <>
            <Grid>
              <Field label="ID" hint="Stable identifier · maps to preview component">
                <TextInput
                  value={item.id}
                  onChange={(v) => upd({ ...item, id: v })}
                />
              </Field>
              <Field label="Name">
                <TextInput
                  value={item.name}
                  onChange={(v) => upd({ ...item, name: v })}
                />
              </Field>
              <Field label="Tagline">
                <TextInput
                  value={item.tagline}
                  onChange={(v) => upd({ ...item, tagline: v })}
                />
              </Field>
              <Field label="Icon">
                <IconInput
                  value={item.icon}
                  onChange={(v) => upd({ ...item, icon: v })}
                />
              </Field>
              <Field label="Tone">
                <Select
                  value={item.tone}
                  onChange={(v) => upd({ ...item, tone: v })}
                  options={projectToneOptions}
                />
              </Field>
              <Field label="Grid span (optional)">
                <TextInput
                  value={item.span ?? ""}
                  onChange={(v) =>
                    upd({ ...item, span: v.length ? v : undefined })
                  }
                  placeholder="lg:col-span-7 lg:row-span-2"
                />
              </Field>
              <Field
                label="Repo URL"
                hint="GitHub / GitLab / source — rendered as an icon link."
              >
                <TextInput
                  value={item.repoUrl ?? ""}
                  onChange={(v) =>
                    upd({ ...item, repoUrl: v.length ? v : undefined })
                  }
                  placeholder="https://github.com/user/repo"
                />
              </Field>
              <Field
                label="Live URL"
                hint="Deployed site / demo — rendered as an icon link."
              >
                <TextInput
                  value={item.liveUrl ?? ""}
                  onChange={(v) =>
                    upd({ ...item, liveUrl: v.length ? v : undefined })
                  }
                  placeholder="https://example.com"
                />
              </Field>
            </Grid>
            <CheckboxField
              label="Featured (expanded card)"
              checked={!!item.featured}
              onChange={(v) => upd({ ...item, featured: v })}
            />
            <Field label="Description">
              <TextArea
                value={item.description}
                onChange={(v) => upd({ ...item, description: v })}
                rows={3}
              />
            </Field>

            <SubsectionTitle title="Capabilities" />
            <ArrayEditor<ProjectCapability>
              items={item.capabilities}
              onChange={(capabilities) => upd({ ...item, capabilities })}
              empty={() => ({ icon: "Sparkles", label: "" })}
              addLabel="Add capability"
              compact
              renderItem={(cap, _, updCap) => (
                <Grid>
                  <Field label="Icon">
                    <IconInput
                      value={cap.icon}
                      onChange={(v) => updCap({ ...cap, icon: v })}
                    />
                  </Field>
                  <Field label="Label">
                    <TextInput
                      value={cap.label}
                      onChange={(v) => updCap({ ...cap, label: v })}
                    />
                  </Field>
                </Grid>
              )}
              titleFor={(c) => c.label}
            />
            <StringListField
              label="Architecture highlights"
              values={item.architecture}
              onChange={(architecture) => upd({ ...item, architecture })}
            />
            <StringListField
              label="Engineering challenges"
              values={item.challenges}
              onChange={(challenges) => upd({ ...item, challenges })}
            />
            <StringListField
              label="Stack"
              values={item.stack}
              onChange={(stack) => upd({ ...item, stack })}
            />
          </>
        )}
        titleFor={(p) => p.name}
        subtitleFor={(p) => p.tagline}
      />
    </Section>
  );
}

function ArchitectureEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["architecture"];
  onChange: (v: PortfolioContent["architecture"]) => void;
}) {
  return (
    <Section title="System architecture">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Layers" />
      <ArrayEditor<ArchitectureLayer>
        items={value.layers}
        onChange={(layers) => onChange({ ...value, layers })}
        empty={() => ({ label: "", color: "primary", nodes: [] })}
        addLabel="Add layer"
        renderItem={(item, idx, upd) => (
          <>
            <Grid>
              <Field label="Label">
                <TextInput
                  value={item.label}
                  onChange={(v) => upd({ ...item, label: v })}
                />
              </Field>
              <Field label="Color">
                <Select
                  value={item.color}
                  onChange={(v) => upd({ ...item, color: v })}
                  options={layerColorOptions}
                />
              </Field>
            </Grid>
            <SubsectionTitle title="Nodes" />
            <ArrayEditor
              items={item.nodes}
              onChange={(nodes) => upd({ ...item, nodes })}
              empty={() => ({ icon: "Layers", label: "" })}
              addLabel="Add node"
              compact
              renderItem={(node, _, updNode) => (
                <Grid>
                  <Field label="Icon">
                    <IconInput
                      value={node.icon}
                      onChange={(v) => updNode({ ...node, icon: v })}
                    />
                  </Field>
                  <Field label="Label">
                    <TextInput
                      value={node.label}
                      onChange={(v) => updNode({ ...node, label: v })}
                    />
                  </Field>
                </Grid>
              )}
              titleFor={(n) => n.label}
            />
          </>
        )}
        titleFor={(l) => l.label}
        subtitleFor={(l) => `${l.nodes.length} nodes · ${l.color}`}
      />

      <SubsectionTitle title="Legend" />
      <ArrayEditor
        items={value.legend}
        onChange={(legend) => onChange({ ...value, legend })}
        empty={() => ({ dotClassName: "bg-primary", label: "" })}
        addLabel="Add legend entry"
        compact
        renderItem={(item, _, upd) => (
          <Grid>
            <Field label="Dot class" hint="Tailwind bg-* class for the dot">
              <TextInput
                value={item.dotClassName}
                onChange={(v) => upd({ ...item, dotClassName: v })}
              />
            </Field>
            <Field label="Label">
              <TextInput
                value={item.label}
                onChange={(v) => upd({ ...item, label: v })}
              />
            </Field>
          </Grid>
        )}
        titleFor={(l) => l.label}
      />
    </Section>
  );
}

function PrinciplesEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["principles"];
  onChange: (v: PortfolioContent["principles"]) => void;
}) {
  return (
    <Section title="Engineering principles">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Principles" />
      <ArrayEditor<Principle>
        items={value.principles}
        onChange={(principles) => onChange({ ...value, principles })}
        empty={() => ({ icon: "Sparkles", title: "", body: "" })}
        addLabel="Add principle"
        renderItem={(item, _, upd) => (
          <>
            <Grid>
              <Field label="Title">
                <TextInput
                  value={item.title}
                  onChange={(v) => upd({ ...item, title: v })}
                />
              </Field>
              <Field label="Icon">
                <IconInput
                  value={item.icon}
                  onChange={(v) => upd({ ...item, icon: v })}
                />
              </Field>
            </Grid>
            <Field label="Body">
              <TextArea
                value={item.body}
                onChange={(v) => upd({ ...item, body: v })}
              />
            </Field>
          </>
        )}
        titleFor={(p) => p.title}
        subtitleFor={(p) => p.body}
      />
    </Section>
  );
}

function TechStackEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["techStack"];
  onChange: (v: PortfolioContent["techStack"]) => void;
}) {
  return (
    <Section title="Tech stack">
      <HeaderFields
        eyebrow={value.eyebrow}
        title={value.title}
        description={value.description}
        onChange={(p) => onChange({ ...value, ...p })}
      />
      <SubsectionTitle title="Categories" />
      <ArrayEditor<TechStackGroup>
        items={value.categories}
        onChange={(categories) => onChange({ ...value, categories })}
        empty={() => ({ label: "", items: [] })}
        addLabel="Add category"
        renderItem={(cat, _, upd) => (
          <>
            <Field label="Category label">
              <TextInput
                value={cat.label}
                onChange={(v) => upd({ ...cat, label: v })}
              />
            </Field>
            <SubsectionTitle title="Tools" />
            <ArrayEditor<TechStackItem>
              items={cat.items}
              onChange={(items) => upd({ ...cat, items })}
              empty={() => ({ name: "", note: "" })}
              addLabel="Add tool"
              compact
              renderItem={(tool, _, updTool) => (
                <Grid>
                  <Field label="Name">
                    <TextInput
                      value={tool.name}
                      onChange={(v) => updTool({ ...tool, name: v })}
                    />
                  </Field>
                  <Field label="Note">
                    <TextInput
                      value={tool.note}
                      onChange={(v) => updTool({ ...tool, note: v })}
                    />
                  </Field>
                </Grid>
              )}
              titleFor={(t) => t.name}
              subtitleFor={(t) => t.note}
            />
          </>
        )}
        titleFor={(c) => c.label}
        subtitleFor={(c) => `${c.items.length} tools`}
      />
    </Section>
  );
}

function ContactEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["contact"];
  onChange: (v: PortfolioContent["contact"]) => void;
}) {
  return (
    <Section title="Contact">
      <Field label="Eyebrow">
        <TextInput
          value={value.eyebrow}
          onChange={(v) => onChange({ ...value, eyebrow: v })}
        />
      </Field>
      <Grid>
        <Field label="Title — primary">
          <TextInput
            value={value.titlePrimary}
            onChange={(v) => onChange({ ...value, titlePrimary: v })}
          />
        </Field>
        <Field label="Title — accent">
          <TextInput
            value={value.titleAccent}
            onChange={(v) => onChange({ ...value, titleAccent: v })}
          />
        </Field>
      </Grid>
      <Field label="Description">
        <TextArea
          value={value.description}
          onChange={(v) => onChange({ ...value, description: v })}
        />
      </Field>

      <SubsectionTitle title="Resume PDF" />
      <ContactResumeUpload
        value={value}
        onChange={onChange}
      />

      <SubsectionTitle title="CTA buttons" />
      <CTAArrayEditor
        items={value.ctas}
        onChange={(ctas) => onChange({ ...value, ctas })}
      />

      <SubsectionTitle title="Channels" />
      <ArrayEditor<ContactChannel>
        items={value.channels}
        onChange={(channels) => onChange({ ...value, channels })}
        empty={() => ({ icon: "Mail", label: "", value: "", href: "" })}
        addLabel="Add channel"
        renderItem={(item, _, upd) => (
          <Grid>
            <Field label="Icon">
              <IconInput
                value={item.icon}
                onChange={(v) => upd({ ...item, icon: v })}
              />
            </Field>
            <Field label="Label">
              <TextInput
                value={item.label}
                onChange={(v) => upd({ ...item, label: v })}
              />
            </Field>
            <Field label="Value (displayed)">
              <TextInput
                value={item.value}
                onChange={(v) => upd({ ...item, value: v })}
              />
            </Field>
            <Field label="Href (link target)">
              <TextInput
                value={item.href}
                onChange={(v) => upd({ ...item, href: v })}
              />
            </Field>
          </Grid>
        )}
        titleFor={(c) => c.label}
        subtitleFor={(c) => c.value}
      />
    </Section>
  );
}

function FooterEditor({
  value,
  onChange,
}: {
  value: PortfolioContent["footer"];
  onChange: (v: PortfolioContent["footer"]) => void;
}) {
  return (
    <Section title="Footer">
      <Field label="Tagline">
        <TextInput
          value={value.tagline}
          onChange={(v) => onChange({ ...value, tagline: v })}
        />
      </Field>
      <Field label="Status text">
        <TextInput
          value={value.status}
          onChange={(v) => onChange({ ...value, status: v })}
        />
      </Field>
      <Field
        label="Copyright"
        hint="Use {year} as a placeholder for the current year."
      >
        <TextInput
          value={value.copyright}
          onChange={(v) => onChange({ ...value, copyright: v })}
        />
      </Field>

      <SubsectionTitle title="Socials" />
      <ArrayEditor<SocialLink>
        items={value.socials}
        onChange={(socials) => onChange({ ...value, socials })}
        empty={() => ({ icon: "Mail", label: "", href: "" })}
        addLabel="Add social link"
        compact
        renderItem={(item, _, upd) => (
          <Grid>
            <Field label="Icon">
              <IconInput
                value={item.icon}
                onChange={(v) => upd({ ...item, icon: v })}
              />
            </Field>
            <Field label="Label">
              <TextInput
                value={item.label}
                onChange={(v) => upd({ ...item, label: v })}
              />
            </Field>
            <Field label="Href">
              <TextInput
                value={item.href}
                onChange={(v) => upd({ ...item, href: v })}
              />
            </Field>
          </Grid>
        )}
        titleFor={(s) => s.label}
        subtitleFor={(s) => s.href}
      />
    </Section>
  );
}

/* ---------- Contact-aware resume upload ---------- */

function ContactResumeUpload({
  value,
  onChange,
}: {
  value: PortfolioContent["contact"];
  onChange: (v: PortfolioContent["contact"]) => void;
}) {
  // Pick a representative current URL: the most common href among
  // resume-looking CTAs, falling back to the conventional /resume.pdf.
  const resumeCandidates = React.useMemo(() => {
    const looksLikeResume = (href: string) =>
      href.toLowerCase().endsWith(".pdf") ||
      /resume|cv/i.test(href);
    return value.ctas.filter((c) => looksLikeResume(c.href));
  }, [value.ctas]);

  const currentUrl =
    resumeCandidates[0]?.href ?? "/resume.pdf";

  return (
    <ResumeUpload
      currentUrl={currentUrl}
      linkedTargets={resumeCandidates.map((c) => c.label || c.href)}
      onUploaded={(newUrl) => {
        // Rewrite every CTA that pointed at the previous resume URL so the
        // user doesn't have to re-link by hand when the path changes
        // (e.g. moving from /resume.pdf to a Vercel Blob URL).
        const nextCtas = value.ctas.map((cta) =>
          cta.href === currentUrl ? { ...cta, href: newUrl } : cta
        );
        onChange({ ...value, ctas: nextCtas });
      }}
    />
  );
}

/* ---------- Resume upload ---------- */

type UploadStatus =
  | { kind: "idle" }
  | { kind: "uploading"; name: string }
  | { kind: "success"; name: string; size: number }
  | { kind: "error"; message: string };

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function ResumeUpload({
  currentUrl,
  onUploaded,
  hint,
  linkedTargets,
}: {
  currentUrl?: string;
  onUploaded?: (url: string) => void;
  hint?: string;
  /**
   * Labels of CTAs/links in the current section that point to `currentUrl`.
   * When provided, the widget surfaces whether the upload is actually wired
   * up to something downstream, or warns when no consumer references it.
   */
  linkedTargets?: string[];
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<UploadStatus>({ kind: "idle" });
  const [dragActive, setDragActive] = React.useState(false);

  const acceptingPdfs = currentUrl?.toLowerCase().endsWith(".pdf") ?? true;

  async function handleFile(file: File) {
    setStatus({ kind: "uploading", name: file.name });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadResumeAction(fd);
      if (res.ok) {
        setStatus({
          kind: "success",
          name: file.name,
          size: res.size ?? file.size,
        });
        onUploaded?.(res.url ?? "/resume.pdf");
      } else {
        setStatus({ kind: "error", message: res.error ?? "Upload failed." });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  // Auto-clear success state so the row settles back to the resting label.
  React.useEffect(() => {
    if (status.kind !== "success") return;
    const id = setTimeout(() => setStatus({ kind: "idle" }), 3000);
    return () => clearTimeout(id);
  }, [status]);

  const isUploading = status.kind === "uploading";

  let primaryLabel: React.ReactNode;
  let secondaryLabel: React.ReactNode;
  if (status.kind === "uploading") {
    primaryLabel = `Uploading ${status.name}…`;
    secondaryLabel = "Writing to public/resume.pdf";
  } else if (status.kind === "success") {
    primaryLabel = (
      <span className="text-emerald-300">Uploaded · {formatBytes(status.size)}</span>
    );
    secondaryLabel = "Served at /resume.pdf";
  } else if (status.kind === "error") {
    primaryLabel = <span className="text-rose-300">Upload failed</span>;
    secondaryLabel = status.message;
  } else if (currentUrl) {
    primaryLabel = "Current resume PDF";
    secondaryLabel = (
      <a
        href={currentUrl}
        target="_blank"
        rel="noreferrer"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        {currentUrl}
      </a>
    );
  } else {
    primaryLabel = "No resume uploaded";
    secondaryLabel = hint ?? "Pick or drop a PDF to publish to /resume.pdf.";
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed bg-background/30 p-3 transition-colors",
        dragActive
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 hover:border-border"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isUploading) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (isUploading) return;
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/40 text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {primaryLabel}
          </div>
          <div className="truncate text-[0.65rem] text-muted-foreground">
            {secondaryLabel}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              {currentUrl && acceptingPdfs ? "Replace PDF" : "Upload PDF"}
            </>
          )}
        </Button>
      </div>
      {linkedTargets ? (
        <div className="mt-2.5 flex items-start gap-1.5 border-t border-border/30 pt-2.5 text-[0.65rem]">
          <Link2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          {linkedTargets.length > 0 ? (
            <span className="text-muted-foreground">
              Linked from{" "}
              {linkedTargets.map((label, i) => (
                <React.Fragment key={`${label}-${i}`}>
                  {i > 0 ? ", " : ""}
                  <strong className="text-foreground">{label}</strong>
                </React.Fragment>
              ))}
              {" · "}any CTA whose href is{" "}
              <code className="font-mono">{currentUrl}</code> serves this PDF.
            </span>
          ) : (
            <span className="text-amber-300/90">
              No CTA in this section points to{" "}
              <code className="font-mono">{currentUrl}</code> — add one to
              expose the download.
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Status badge ---------- */

function StatusBadge({
  status,
  dirty,
}: {
  status: SaveStatus;
  dirty: boolean;
}) {
  if (status.kind === "saving") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-primary">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving
      </span>
    );
  }
  if (status.kind === "saved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-emerald-300">
        <CheckCircle2 className="h-3 w-3" />
        Saved
      </span>
    );
  }
  if (status.kind === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-rose-300">
        <AlertCircle className="h-3 w-3" />
        Error
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-amber-300">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        Unsaved
      </span>
    );
  }
  return null;
}

/* ---------- Shared building blocks ---------- */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/40 pb-3">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {hint ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SubsectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {title}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function HeaderFields({
  eyebrow,
  title,
  description,
  onChange,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onChange: (p: { eyebrow?: string; title?: string; description?: string }) => void;
}) {
  return (
    <>
      <Grid>
        <Field label="Eyebrow">
          <TextInput value={eyebrow} onChange={(v) => onChange({ eyebrow: v })} />
        </Field>
        <Field label="Title">
          <TextInput value={title} onChange={(v) => onChange({ title: v })} />
        </Field>
      </Grid>
      <Field label="Description">
        <TextArea
          value={description}
          onChange={(v) => onChange({ description: v })}
        />
      </Field>
    </>
  );
}

function CTAArrayEditor({
  items,
  onChange,
}: {
  items: CTAButton[];
  onChange: (items: CTAButton[]) => void;
}) {
  return (
    <ArrayEditor<CTAButton>
      items={items}
      onChange={onChange}
      empty={() => ({ label: "", href: "", variant: "outline" })}
      addLabel="Add CTA"
      renderItem={(item, _, upd) => (
        <>
          <Grid>
            <Field label="Label">
              <TextInput
                value={item.label}
                onChange={(v) => upd({ ...item, label: v })}
              />
            </Field>
            <Field label="Href">
              <TextInput
                value={item.href}
                onChange={(v) => upd({ ...item, href: v })}
              />
            </Field>
            <Field label="Icon">
              <IconInput
                value={item.icon ?? ""}
                onChange={(v) => upd({ ...item, icon: v || undefined })}
              />
            </Field>
            <Field label="Variant">
              <Select
                value={item.variant ?? "outline"}
                onChange={(v) => upd({ ...item, variant: v })}
                options={ctaVariantOptions}
              />
            </Field>
          </Grid>
          <CheckboxField
            label="Opens in new tab"
            checked={!!item.external}
            onChange={(v) => upd({ ...item, external: v })}
          />
        </>
      )}
      titleFor={(c) => c.label}
      subtitleFor={(c) => c.href}
    />
  );
}

/* ---------- Generic ArrayEditor ---------- */

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  empty: () => T;
  addLabel: string;
  renderItem: (item: T, index: number, update: (next: T) => void) => React.ReactNode;
  titleFor?: (item: T) => string;
  subtitleFor?: (item: T) => string;
  compact?: boolean;
}

function ArrayEditor<T>({
  items,
  onChange,
  empty,
  addLabel,
  renderItem,
  titleFor,
  subtitleFor,
  compact,
}: ArrayEditorProps<T>) {
  function add() {
    onChange([...items, empty()]);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const next = items.slice();
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }
  function moveDown(i: number) {
    if (i === items.length - 1) return;
    const next = items.slice();
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    onChange(next);
  }
  function updateAt(i: number, value: T) {
    onChange(items.map((it, idx) => (idx === i ? value : it)));
  }

  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {items.map((item, i) => (
        <ArrayItem
          key={i}
          title={titleFor?.(item) ?? ""}
          subtitle={subtitleFor?.(item)}
          index={i}
          total={items.length}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          onRemove={() => remove(i)}
        >
          {renderItem(item, i, (next) => updateAt(i, next))}
        </ArrayItem>
      ))}
      <AddItemButton onClick={add} label={addLabel} />
    </div>
  );
}
