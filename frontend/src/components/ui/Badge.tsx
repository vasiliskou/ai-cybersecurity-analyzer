import React from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "critical" | "high" | "medium" | "low";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-card-2 text-muted border-border",
    critical: "bg-[color-mix(in_srgb,var(--danger)_18%,transparent)] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_30%,transparent)]",
    high: "bg-[color-mix(in_srgb,var(--warning)_18%,transparent)] text-[color-mix(in_srgb,var(--warning)_90%,#7c2d12)] border-[color-mix(in_srgb,var(--warning)_30%,transparent)]",
    medium: "bg-[color-mix(in_srgb,var(--warning)_14%,transparent)] text-[color-mix(in_srgb,var(--warning)_80%,#92400e)] border-[color-mix(in_srgb,var(--warning)_22%,transparent)]",
    low: "bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)] border-[color-mix(in_srgb,var(--success)_28%,transparent)]",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

