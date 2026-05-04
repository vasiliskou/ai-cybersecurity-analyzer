import React from "react";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-6 text-xs text-muted sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>Built for secure-by-default learning and deployment.</div>
          <div className="opacity-80">Tip: paste code, or drag & drop a `.py` file.</div>
        </div>
      </footer>
    </div>
  );
}

