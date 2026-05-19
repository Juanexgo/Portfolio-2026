/**
 * Centralized type definitions for portfolio content.
 *
 * Every section of the visible portfolio is described here. Editing the shape
 * of the content (adding a field, changing a list, etc.) starts in this file —
 * `src/content/portfolio.ts` then implements it, and components consume it.
 */

/** String key used to look up a Lucide icon at render time. See lib/icons.ts. */
export type IconName = string;

/** A button rendered in a CTA cluster (hero, contact, nav, etc.). */
export interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "outline" | "ghost" | "default";
  icon?: IconName;
  external?: boolean;
}

/** A link in the top navigation. */
export interface NavLink {
  label: string;
  href: string;
}

/** Identity-level information used across the portfolio. */
export interface PersonalInfo {
  /** Full name displayed in the hero and footer. */
  name: string;
  /** Short initials used in the JC logo badge. */
  initials: string;
  /** Job title / role line under the name. */
  role: string;
  /** Short tagline used in metadata and footer. */
  tagline: string;
  /** Free-form location string (e.g. "Remote · LATAM"). */
  location: string;
  /** Public-facing email. */
  email: string;
  /** Public URL to the downloadable resume PDF. */
  resumeUrl: string;
  /** Short availability pill text shown in the hero. */
  availability: string;
}

/** Profile links displayed in the footer + contact section. */
export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
  username?: string;
}

export interface HeroSection {
  eyebrow: string;
  /** Top line of the hero headline (large, primary). */
  title: string;
  /** Second line of the hero headline (medium, secondary). */
  subtitle: string;
  /** Body paragraph beneath the headline. Supports plain text. */
  description: string;
  /** CTA buttons under the description (primary + secondaries). */
  ctas: CTAButton[];
  /** Pills shown below the CTAs (e.g. core stack). */
  stackPills: string[];
}

/** A single card in the "About" focus-area grid. */
export interface FocusArea {
  icon: IconName;
  title: string;
  body: string;
}

export interface AboutSection {
  eyebrow: string;
  title: string;
  description: string;
  focusAreas: FocusArea[];
}

/** A metric chip shown inside an experience card. */
export interface ExperienceMetric {
  label: string;
  value: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  /** Marks the current role with a "Current" badge + pulse. */
  current?: boolean;
  summary: string;
  highlights: string[];
  metrics: ExperienceMetric[];
  stack: string[];
}

export interface ExperienceSection {
  eyebrow: string;
  title: string;
  description: string;
  roles: ExperienceItem[];
}

/** A capability pill displayed on a project card. */
export interface ProjectCapability {
  icon: IconName;
  label: string;
}

/** Tone keys for the project card icon background. */
export type ProjectTone = "rose" | "amber" | "sky" | "primary" | "emerald";

export interface Project {
  /** Stable identifier used to map the project to its hand-built preview. */
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: IconName;
  tone: ProjectTone;
  /** Tailwind classes that control how the card spans the bento grid. */
  span?: string;
  /** Whether to render the expanded "architecture + challenges" sections. */
  featured?: boolean;
  /** Source code repository (GitHub, GitLab, etc.). Rendered as an icon link. */
  repoUrl?: string;
  /** Deployed / live URL. Rendered as an icon link. */
  liveUrl?: string;
  capabilities: ProjectCapability[];
  architecture: string[];
  challenges: string[];
  stack: string[];
}

export interface ProjectsSection {
  eyebrow: string;
  title: string;
  description: string;
  projects: Project[];
}

export interface ArchitectureNode {
  icon: IconName;
  label: string;
}

export interface ArchitectureLayer {
  label: string;
  color: "primary" | "accent" | "muted";
  nodes: ArchitectureNode[];
}

export interface ArchitectureLegendItem {
  /** Tailwind background-color utility class for the legend dot. */
  dotClassName: string;
  label: string;
}

export interface ArchitectureSection {
  eyebrow: string;
  title: string;
  description: string;
  layers: ArchitectureLayer[];
  legend: ArchitectureLegendItem[];
}

export interface Principle {
  icon: IconName;
  title: string;
  body: string;
}

export interface PrinciplesSection {
  eyebrow: string;
  title: string;
  description: string;
  principles: Principle[];
}

export interface TechStackItem {
  name: string;
  note: string;
}

export interface TechStackGroup {
  label: string;
  items: TechStackItem[];
}

export interface TechStackSection {
  eyebrow: string;
  title: string;
  description: string;
  categories: TechStackGroup[];
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  icon: IconName;
}

export interface ContactSection {
  eyebrow: string;
  /** Title fragment shown in the foreground color. */
  titlePrimary: string;
  /** Title fragment shown with the accent gradient. */
  titleAccent: string;
  description: string;
  ctas: CTAButton[];
  channels: ContactChannel[];
}

export interface FooterSection {
  tagline: string;
  /** Right-side small text e.g. "All systems operational". */
  status: string;
  /** Template string. `{year}` is replaced at render time. */
  copyright: string;
  socials: SocialLink[];
}

export interface NavSection {
  brand: string;
  brandSuffix: string;
  initials: string;
  cta: CTAButton;
  items: NavLink[];
}

/** The complete, top-level content shape consumed by the portfolio. */
export interface PortfolioContent {
  personal: PersonalInfo;
  nav: NavSection;
  hero: HeroSection;
  about: AboutSection;
  experience: ExperienceSection;
  projects: ProjectsSection;
  architecture: ArchitectureSection;
  principles: PrinciplesSection;
  techStack: TechStackSection;
  contact: ContactSection;
  footer: FooterSection;
}

export interface ContactInfo {
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}
