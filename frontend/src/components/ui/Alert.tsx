import React from "react";

export function Alert({
  title,
  description,
  tone = "info",
  action,
}: {
  title: string;
  description?: string;
  tone?: "info" | "danger";
  action?: React.ReactNode;
}) {
  const styles =
    tone === "danger"
      ? "border-[color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[color-mix(in_srgb,var(--danger)_95%,#111827)]"
      : "border-[color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground";

  return (
    <div className={["rounded-2xl border px-4 py-3", styles, "animate-in"].join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          {description ? <div className="mt-1 text-sm text-muted">{description}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

