"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

async function readTextFile(file: File): Promise<string> {
  return await file.text();
}

export type CodeWorkspaceValue = {
  code: string;
  sourceLabel: string | null;
};

export function CodeWorkspace({
  value,
  onChange,
  onRun,
  onReset,
  isRunning,
  errorMessage,
}: {
  value: CodeWorkspaceValue;
  onChange: (next: CodeWorkspaceValue) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  errorMessage: string | null;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const hasCode = value.code.trim().length > 0;

  const canRun = hasCode && !isRunning;

  const onPickFile = useCallback(() => inputRef.current?.click(), []);

  const onFileSelected = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      const isPython = file.name.toLowerCase().endsWith(".py");
      if (!isPython) {
        onChange({ code: value.code, sourceLabel: value.sourceLabel });
        return;
      }
      const text = await readTextFile(file);
      onChange({ code: text, sourceLabel: file.name });
    },
    [onChange, value.code, value.sourceLabel]
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      await onFileSelected(file);
    },
    [onFileSelected]
  );

  const onPasteExample = useCallback(() => {
    void (async () => {
      try {
        const res = await fetch("/samples/support_desk.py");
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        onChange({ code: text, sourceLabel: "support_desk.py" });
      } catch {
        onChange({
          code:
            "# Could not load the sample file.\n# From the repo, open examples/support_desk.py and paste it here.",
          sourceLabel: null,
        });
      }
    })();
  }, [onChange]);

  const dropHint = useMemo(() => {
    if (dragOver) return "Drop your Python file to load it";
    return value.sourceLabel ? `Loaded: ${value.sourceLabel}` : "Drag & drop a .py file, paste code, or open a file";
  }, [dragOver, value.sourceLabel]);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Workspace"
        subtitle="Provide Python code for analysis."
        right={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onPickFile} disabled={isRunning}>
              Open file
            </Button>
            <Button variant="ghost" size="sm" onClick={onPasteExample} disabled={isRunning}>
              Example
            </Button>
            <Button variant="primary" size="sm" onClick={onRun} disabled={!canRun}>
              {isRunning ? "Analyzing…" : "Analyze"}
            </Button>
          </div>
        }
      />

      <CardBody className="space-y-3">
        {errorMessage ? <Alert tone="danger" title="Analysis failed" description={errorMessage} /> : null}

        <div
          className={[
            "rounded-2xl border border-border bg-card-2 p-3 text-xs text-muted",
            dragOver ? "ring-2 ring-[var(--ring)]" : "",
            "transition",
          ].join(" ")}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {dropHint}
        </div>

        <div className="grid gap-3">
          <textarea
            value={value.code}
            onChange={(e) => onChange({ code: e.target.value, sourceLabel: value.sourceLabel })}
            placeholder="Paste Python code here…"
            spellCheck={false}
            className={[
              "h-[38vh] w-full resize-none rounded-2xl border border-border bg-[var(--input-bg)] px-4 py-3",
              "font-mono text-[13px] leading-5 text-[var(--input-fg)]",
              "shadow-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]",
            ].join(" ")}
          />

          <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
            <div className="text-xs text-muted">
              {hasCode ? (
                <span>
                  {value.code.length.toLocaleString()} characters • {value.code.split("\n").length.toLocaleString()} lines
                </span>
              ) : (
                <span>Nothing to analyze yet.</span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <input
                ref={inputRef}
                type="file"
                accept=".py"
                className="hidden"
                onChange={(e) => onFileSelected(e.target.files?.[0])}
              />

              <Button variant="ghost" size="sm" onClick={onReset} disabled={isRunning && !hasCode}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

