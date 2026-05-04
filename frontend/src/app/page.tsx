"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { CodeWorkspace, type CodeWorkspaceValue } from "@/features/analyze/CodeWorkspace";
import { ResultsPanel } from "@/features/analyze/ResultsPanel";
import { useAnalyzer } from "@/features/analyze/useAnalyzer";

export default function Home() {
  const [workspace, setWorkspace] = useState<CodeWorkspaceValue>({ code: "", sourceLabel: null });
  const analyzer = useAnalyzer();

  const results = useMemo(() => (analyzer.state.status === "success" ? analyzer.state.data : null), [analyzer.state]);

  const onRun = useCallback(() => {
    const code = workspace.code.trim();
    if (!code) return;
    analyzer.run(code);
  }, [analyzer, workspace.code]);

  const onReset = useCallback(() => {
    setWorkspace({ code: "", sourceLabel: null });
  }, []);

  const onClearResults = useCallback(() => {
    analyzer.cancel();
  }, [analyzer]);

  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CodeWorkspace
            value={workspace}
            onChange={setWorkspace}
            onRun={onRun}
            onReset={onReset}
            isRunning={analyzer.isRunning}
            errorMessage={analyzer.errorMessage}
          />
        </div>

        <div className="lg:col-span-3">
          <ResultsPanel
            status={analyzer.state.status}
            data={results}
            errorMessage={analyzer.errorMessage}
            onClear={onClearResults}
          />
        </div>
      </div>
    </AppShell>
  );
}