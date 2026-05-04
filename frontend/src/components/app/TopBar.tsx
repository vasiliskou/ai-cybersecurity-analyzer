import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl border border-border bg-card shadow-sm">
              <span className="text-sm font-black tracking-tight text-primary">C</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">Cybersecurity Analyzer</div>
              <div className="truncate text-xs text-muted">AI + Semgrep assisted Python security review</div>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

