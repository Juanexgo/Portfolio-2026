"use client";

import * as React from "react";
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconNames } from "@/lib/icons";

const inputBase =
  "h-9 w-full rounded-md border border-border/60 bg-background/40 px-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-[0.65rem] text-muted-foreground/70">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(inputBase, className)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={cn(
        inputBase,
        "min-h-[72px] resize-y py-2 leading-relaxed",
        className
      )}
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(inputBase, "appearance-none pr-8")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function IconInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const id = React.useId();
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={id}
        placeholder="Sparkles"
        className={inputBase}
      />
      <datalist id={id}>
        {iconNames.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border/60 bg-background/40 accent-primary"
      />
      {label}
    </label>
  );
}

export function StringListField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint="One value per line">
      <textarea
        value={values.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trimStart())
              .filter((s, i, arr) => s.length > 0 || i === arr.length - 1)
          )
        }
        rows={Math.max(3, values.length)}
        placeholder={placeholder}
        className={cn(
          inputBase,
          "min-h-[80px] resize-y py-2 font-mono text-xs leading-relaxed"
        )}
      />
    </Field>
  );
}

/**
 * Collapsible item wrapper used inside ArrayEditor. Allows expand/collapse
 * plus remove/reorder controls without dragging libraries.
 */
export function ArrayItem({
  title,
  subtitle,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-background/30">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              open ? "rotate-0" : "-rotate-90"
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">
              {title || `Item ${index + 1}`}
            </div>
            {subtitle ? (
              <div className="truncate text-[0.65rem] text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
        </button>
        <div className="flex items-center gap-1">
          <IconBtn
            label="Move up"
            disabled={index === 0}
            onClick={onMoveUp}
            className="rotate-180"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn
            label="Move down"
            disabled={index === total - 1}
            onClick={onMoveDown}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Remove" onClick={onRemove} tone="danger">
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
      {open ? <div className="space-y-3 p-3">{children}</div> : null}
    </div>
  );
}

export function AddItemButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/20 px-3 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  disabled,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:bg-card/70 disabled:opacity-30 disabled:hover:bg-card/40",
        tone === "danger" && "hover:border-rose-400/40 hover:text-rose-300",
        tone !== "danger" && "hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export { GripVertical }; // re-export for future drag handle if needed
