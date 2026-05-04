"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="inline-flex size-4 items-center justify-center">
      {children}
    </span>
  );
}

export function ThemeToggle() {
  const { mode, resolvedTheme, setMode, toggle } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Icon>
            <svg viewBox="0 0 24 24" fill="none" className="size-4">
              <path
                d="M21 14.2A8.2 8.2 0 0 1 9.8 3a7.2 7.2 0 1 0 11.2 11.2Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </Icon>
        ) : (
          <Icon>
            <svg viewBox="0 0 24 24" fill="none" className="size-4">
              <path
                d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </Icon>
        )}
        <span className="hidden sm:inline">Theme</span>
      </button>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as "light" | "dark" | "system")}
        className="hidden md:inline-flex rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        aria-label="Theme mode"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}

