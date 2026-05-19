"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CircleDot,
  Database,
  Globe,
  Layers,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sparkline = [12, 18, 14, 22, 26, 21, 30, 28, 34, 32, 40, 38, 44, 41, 48];

function Sparkline({ data, color = "hsl(var(--primary))" }: { data: number[]; color?: string }) {
  const w = 120;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-grad)" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const activityFeed = [
  { id: 1, label: "RBAC role updated", ctx: "user:auth", tone: "primary" as const, time: "2s" },
  { id: 2, label: "Order #4821 confirmed", ctx: "pos:cancun-01", tone: "success" as const, time: "8s" },
  { id: 3, label: "Patient record synced", ctx: "ehr:mediflow", tone: "default" as const, time: "14s" },
  { id: 4, label: "Inventory threshold hit", ctx: "warehouse:wh-3", tone: "warning" as const, time: "22s" },
  { id: 5, label: "Service ticket opened", ctx: "csm:mtto-2841", tone: "default" as const, time: "31s" },
  { id: 6, label: "Audit log archived", ctx: "compliance:logs", tone: "default" as const, time: "44s" },
  { id: 7, label: "WebSocket session opened", ctx: "realtime:ws-eu", tone: "primary" as const, time: "58s" },
];

const toneStyles: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/30",
  success: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  warning: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  default: "bg-secondary/60 text-muted-foreground border-border/60",
};

export function DashboardPreview() {
  return (
    <div className="relative w-full">
      {/* Soft outer glow */}
      <div className="absolute -inset-x-16 -top-16 -bottom-16 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-card/70 backdrop-blur-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 hsl(0 0% 100% / 0.06), 0 1px 2px 0 hsl(0 0% 0% / 0.4), 0 24px 64px -24px hsl(199 92% 60% / 0.18), 0 8px 32px -8px hsl(220 50% 2% / 0.6)",
        }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-border/50 bg-background/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <span className="font-mono text-[0.7rem] text-muted-foreground">
              ops.juancanul.dev
            </span>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Pill icon={<Globe className="h-3 w-3" />} label="us-east-1" />
            <Pill icon={<ShieldCheck className="h-3 w-3" />} label="SOC2" tone="primary" />
            <Pill icon={<CircleDot className="h-3 w-3 animate-pulse-glow" />} label="LIVE" tone="success" />
          </div>
        </div>

        {/* dashboard body */}
        <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-12 md:grid-rows-[auto_auto]">
          {/* metric cards */}
          <MetricCard
            className="md:col-span-4"
            label="Requests / min"
            value="184,302"
            delta="+12.4%"
            up
            sparkline={sparkline}
          />
          <MetricCard
            className="md:col-span-4"
            label="p95 latency"
            value="84 ms"
            delta="-6.1%"
            up
            sparkline={[40, 36, 38, 32, 34, 28, 30, 26, 28, 24, 26, 22, 24, 22, 20]}
          />
          <MetricCard
            className="md:col-span-4"
            label="Active sessions"
            value="12,847"
            delta="+3.8%"
            up
            sparkline={[8, 10, 12, 11, 14, 16, 18, 17, 20, 22, 24, 23, 26, 28, 30]}
          />

          {/* main chart */}
          <div className="rounded-xl border border-border/50 bg-background/30 p-4 md:col-span-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Throughput
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-xl font-semibold tracking-tight text-foreground">
                    2.4M
                  </span>
                  <span className="text-xs text-muted-foreground">events / 24h</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> API
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Realtime
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70" /> Jobs
                </span>
              </div>
            </div>
            <AreaChart />
          </div>

          {/* activity feed */}
          <div className="rounded-xl border border-border/50 bg-background/30 md:col-span-4">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Realtime activity
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-400">
                ● streaming
              </span>
            </div>
            <div className="relative h-[218px] overflow-hidden mask-fade-y">
              <div className="animate-ticker">
                {[...activityFeed, ...activityFeed].map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="flex items-start gap-2.5 border-b border-border/30 px-4 py-2.5 last:border-b-0"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-1.5 w-1.5 flex-none rounded-full",
                        item.tone === "success" && "bg-emerald-400",
                        item.tone === "warning" && "bg-amber-400",
                        item.tone === "primary" && "bg-primary",
                        item.tone === "default" && "bg-muted-foreground/60"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs text-foreground">
                        {item.label}
                      </div>
                      <div className="font-mono text-[0.65rem] text-muted-foreground">
                        {item.ctx}
                      </div>
                    </div>
                    <span className="font-mono text-[0.65rem] text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* footer service bar */}
          <div className="grid grid-cols-2 gap-2 md:col-span-12 md:grid-cols-4">
            <ServicePill icon={<Layers className="h-3.5 w-3.5" />} name="API Gateway" status="healthy" />
            <ServicePill icon={<Database className="h-3.5 w-3.5" />} name="Postgres" status="healthy" />
            <ServicePill icon={<Radio className="h-3.5 w-3.5" />} name="WebSocket" status="healthy" />
            <ServicePill icon={<ShieldCheck className="h-3.5 w-3.5" />} name="Auth" status="healthy" />
          </div>
        </div>

        {/* scanline shimmer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -inset-y-1 left-0 w-1/3 animate-scan bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

function Pill({
  icon,
  label,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "default" | "primary" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
        tone === "default" && "border-border/60 bg-secondary/40 text-muted-foreground",
        tone === "primary" && "border-primary/30 bg-primary/10 text-primary",
        tone === "success" && "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      )}
    >
      {icon}
      {label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  delta,
  up,
  sparkline,
  className,
}: {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  sparkline: number[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-background/30 p-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[0.65rem]",
            up
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-rose-400/10 text-rose-300"
          )}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {delta}
        </span>
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-2">
        <Sparkline data={sparkline} />
      </div>
    </div>
  );
}

function ServicePill({
  icon,
  name,
  status,
}: {
  icon: React.ReactNode;
  name: string;
  status: "healthy" | "degraded";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-foreground">{name}</span>
      </div>
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-emerald-300">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {status}
      </span>
    </div>
  );
}

function AreaChart() {
  const w = 600;
  const h = 160;
  // synthesize a smooth multi-series area
  const seed = (base: number, amp: number, phase: number) =>
    Array.from({ length: 40 }, (_, i) =>
      Math.max(
        4,
        base +
          Math.sin(i / 3 + phase) * amp +
          Math.sin(i / 7 + phase * 1.7) * (amp * 0.5)
      )
    );
  const a = seed(70, 28, 0);
  const b = seed(48, 18, 1.2);
  const c = seed(28, 10, 2.4);

  const toPath = (data: number[]) => {
    const step = w / (data.length - 1);
    return data.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - v}`).join(" ");
  };
  const toArea = (data: number[]) => {
    const step = w / (data.length - 1);
    const top = data.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - v}`).join(" ");
    return `${top} L ${w} ${h} L 0 ${h} Z`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="a-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(199 92% 60%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(199 92% 60%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="b-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(160 84% 45%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(160 84% 45%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="c-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(205 84% 70%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(205 84% 70%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1="0"
          x2={w}
          y1={h * t}
          y2={h * t}
          stroke="hsl(var(--border) / 0.5)"
          strokeDasharray="2 4"
        />
      ))}
      <path d={toArea(a)} fill="url(#a-grad)" />
      <path d={toArea(b)} fill="url(#b-grad)" />
      <path d={toArea(c)} fill="url(#c-grad)" />
      <path d={toPath(a)} fill="none" stroke="hsl(199 92% 60%)" strokeWidth="1.5" />
      <path d={toPath(b)} fill="none" stroke="hsl(160 84% 55%)" strokeWidth="1.5" />
      <path d={toPath(c)} fill="none" stroke="hsl(205 84% 75%)" strokeWidth="1.25" strokeOpacity="0.7" />
    </svg>
  );
}
