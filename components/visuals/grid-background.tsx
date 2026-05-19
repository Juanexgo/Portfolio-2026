import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  fade?: "radial" | "bottom" | "top" | "y" | "none";
}

export function GridBackground({ className, fade = "radial" }: GridBackgroundProps) {
  const fadeClass = {
    radial: "mask-radial",
    bottom: "mask-fade-bottom",
    top: "mask-fade-top",
    y: "mask-fade-y",
    none: "",
  }[fade];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 grid-bg",
        fadeClass,
        className
      )}
    />
  );
}
