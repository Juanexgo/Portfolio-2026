/**
 * Icon registry — maps string icon names (used in `src/content/portfolio.ts`)
 * to Lucide React components.
 *
 * The content layer must stay JSON-serializable so it can flow through the
 * admin editor (import/export) and through future content sources (CMS, DB).
 * Components aren't serializable; strings are.
 *
 * Render via `<Icon name="..." />` — this uses `createElement` under the hood,
 * which satisfies React 19's `react-hooks/static-components` rule (the
 * `const X = getIcon(...)` + `<X />` pattern is forbidden because the JSX
 * compiler can't memoize the component identity).
 */
import * as React from "react";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Calendar,
  CircleDot,
  ClipboardList,
  Clock,
  Code2,
  Compass,
  Cpu,
  Database,
  Download,
  Gauge,
  Github,
  Globe,
  HeartPulse,
  KeyRound,
  Layers,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  Network,
  Package,
  Radio,
  Receipt,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Workflow,
  Wrench,
  X,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const icons = {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Calendar,
  CircleDot,
  ClipboardList,
  Clock,
  Code2,
  Compass,
  Cpu,
  Database,
  Download,
  Gauge,
  Github,
  Globe,
  HeartPulse,
  KeyRound,
  Layers,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  Network,
  Package,
  Radio,
  Receipt,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Workflow,
  Wrench,
  X,
  Zap,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

/** Resolve an icon component by name. Falls back to Sparkles. */
export function getIcon(name?: string): LucideIcon {
  if (!name) return Sparkles;
  return (icons as Record<string, LucideIcon>)[name] ?? Sparkles;
}

/** All registered icon names — used by the admin editor for autocomplete. */
export const iconNames: readonly string[] = Object.keys(icons);

interface IconProps extends LucideProps {
  /** Icon name registered in `icons`. Falls back to Sparkles if unknown. */
  name?: string;
}

/**
 * Render an icon dynamically by name.
 *
 * Uses `createElement` instead of assigning the component to a local variable,
 * which complies with React 19's static-components hook rule.
 */
export function Icon({ name, ...props }: IconProps) {
  return React.createElement(getIcon(name), props);
}
