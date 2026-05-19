"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  CircleDot,
  Clock,
  HeartPulse,
  Package,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Wrench,
} from "lucide-react";

/* ---------- MediFlow ---------- */
export function MediFlowPreview() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(199_92%_60%/0.18),transparent_60%)]" />
      <div className="relative grid h-full grid-cols-12 gap-2 p-4">
        {/* sidebar */}
        <div className="col-span-3 flex flex-col gap-1.5 rounded-lg border border-border/50 bg-background/40 p-2">
          <div className="flex items-center gap-1.5 px-1.5 py-1">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/15 text-primary">
              <HeartPulse className="h-3 w-3" />
            </span>
            <span className="text-[0.65rem] font-semibold tracking-tight">MediFlow</span>
          </div>
          {[
            ["Dashboard", true],
            ["Patients", false],
            ["Appointments", false],
            ["Prescriptions", false],
            ["Records", false],
          ].map(([label, active]) => (
            <div
              key={label as string}
              className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-[0.6rem] ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="h-1 w-1 rounded-full bg-current opacity-60" />
              {label}
            </div>
          ))}
        </div>
        {/* main */}
        <div className="col-span-9 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Active Patients", v: "1,284" },
              { l: "Today's Visits", v: "47" },
              { l: "Pending Rx", v: "12" },
            ].map((m) => (
              <div
                key={m.l}
                className="rounded-md border border-border/50 bg-background/40 px-2 py-1.5"
              >
                <div className="text-[0.55rem] uppercase tracking-wider text-muted-foreground">
                  {m.l}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold">{m.v}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-md border border-border/50 bg-background/40 p-2">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Upcoming Appointments
              </span>
              <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
            </div>
            {[
              ["09:00", "M. Hernández", "Cardiology"],
              ["09:30", "J. Pérez", "Follow-up"],
              ["10:15", "A. Ramos", "Pediatrics"],
              ["11:00", "L. Castillo", "Lab review"],
            ].map(([t, n, s]) => (
              <div
                key={n}
                className="flex items-center gap-2 border-t border-border/30 py-1 first:border-t-0"
              >
                <span className="font-mono text-[0.6rem] text-primary">{t}</span>
                <span className="flex-1 truncate text-[0.65rem] text-foreground">{n}</span>
                <span className="text-[0.55rem] text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- CSM ---------- */
export function CSMPreview() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160_84%_45%/0.16),transparent_60%)]" />
      <div className="relative grid h-full grid-cols-12 gap-2 p-4">
        <div className="col-span-7 flex flex-col rounded-lg border border-border/50 bg-background/40">
          <div className="flex items-center justify-between border-b border-border/40 px-2.5 py-1.5">
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold">
              <Wrench className="h-3 w-3 text-primary" /> Service Orders
            </span>
            <span className="font-mono text-[0.55rem] text-emerald-300">● live</span>
          </div>
          {[
            ["#OS-2841", "Toyota · 2021", "diagnosis", "amber"],
            ["#OS-2842", "Nissan · 2019", "parts", "primary"],
            ["#OS-2843", "Mazda · 2022", "labor", "primary"],
            ["#OS-2844", "Honda · 2020", "ready", "emerald"],
            ["#OS-2845", "VW · 2018", "intake", "muted"],
          ].map(([id, car, status, color]) => (
            <div
              key={id as string}
              className="flex items-center justify-between border-t border-border/30 px-2.5 py-1.5 first:border-t-0"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-foreground">{id}</span>
                <span className="text-[0.55rem] text-muted-foreground">{car}</span>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[0.55rem] uppercase ${
                  color === "amber"
                    ? "bg-amber-400/10 text-amber-300"
                    : color === "emerald"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : color === "primary"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="col-span-5 flex flex-col gap-2">
          <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
            <div className="text-[0.55rem] uppercase tracking-wider text-muted-foreground">
              Bay utilization
            </div>
            <div className="mt-1 font-mono text-base font-semibold">86%</div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-sm ${
                    i < 10 ? "bg-primary/70" : "bg-muted/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border/50 bg-background/40 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Parts movement
              </span>
            </div>
            {["Filtro de aceite", "Pastillas freno", "Bujías NGK"].map((p, i) => (
              <div key={p} className="flex items-center justify-between py-1 text-[0.6rem]">
                <span className="text-foreground">{p}</span>
                <span className="font-mono text-emerald-300">−{12 - i * 2}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Enterprise POS ---------- */
export function POSPreview() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(220_80%_60%/0.16),transparent_60%)]" />
      <div className="relative grid h-full grid-cols-12 gap-2 p-4">
        <div className="col-span-8 grid grid-rows-[auto_1fr] gap-2">
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "Revenue", v: "$284k" },
              { l: "Tickets", v: "1,432" },
              { l: "Avg ticket", v: "$198" },
              { l: "Refund rate", v: "0.8%" },
            ].map((m) => (
              <div
                key={m.l}
                className="rounded-md border border-border/50 bg-background/40 px-2 py-1.5"
              >
                <div className="text-[0.55rem] uppercase tracking-wider text-muted-foreground">
                  {m.l}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold">{m.v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-border/50 bg-background/40 p-2.5">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Sales over 24h
              </span>
            </div>
            <Bars />
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <div className="rounded-md border border-border/50 bg-background/40 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Receipt className="h-3 w-3 text-muted-foreground" />
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Recent tickets
              </span>
            </div>
            {[
              ["#48211", "$184.20"],
              ["#48210", "$92.50"],
              ["#48209", "$214.00"],
              ["#48208", "$58.30"],
              ["#48207", "$321.10"],
            ].map(([id, amt]) => (
              <div key={id} className="flex items-center justify-between py-0.5 text-[0.6rem]">
                <span className="font-mono text-foreground">{id}</span>
                <span className="font-mono text-emerald-300">{amt}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-md border border-border/50 bg-background/40 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                Low stock
              </span>
            </div>
            {[
              ["SKU-1041", 3],
              ["SKU-2087", 5],
              ["SKU-3120", 2],
            ].map(([sku, n]) => (
              <div key={sku as string} className="flex items-center justify-between py-0.5 text-[0.6rem]">
                <span className="font-mono">{sku}</span>
                <span className="font-mono text-amber-300">{n} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bars() {
  const heights = [42, 58, 36, 64, 48, 72, 60, 84, 70, 92, 78, 88, 76, 82, 70, 64, 58, 52, 46, 40];
  return (
    <div className="flex h-20 items-end gap-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.015, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: `${h}%`, transformOrigin: "bottom" }}
          className="flex-1 rounded-sm bg-gradient-to-t from-primary/80 to-primary/30"
        />
      ))}
    </div>
  );
}
