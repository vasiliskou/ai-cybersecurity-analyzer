import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-[color-mix(in_srgb,var(--card)_70%,transparent)]",
        "animate-soft-pulse",
        className,
      ].join(" ")}
    />
  );
}

