import React, { useMemo, useState } from "react";
import type { AnalysisResponse, SecurityIssue } from "@/types/security";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

function toneForSeverity(sev: SecurityIssue["severity"]) {
  if (sev === "critical") return "critical";
  if (sev === "high") return "high";
  if (sev === "medium") return "medium";
  return "low";
}

function formatCvss(score: number) {
  return Number.isFinite(score) ? score.toFixed(1) : String(score);
}

function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-auto rounded-2xl border border-border bg-[var(--input-bg)] p-3 font-mono text-[12px] leading-5 text-[var(--input-fg)]">
      <code className="whitespace-pre-wrap break-words">{value}</code>
    </pre>
  );
}

function IssueCard({ issue }: { issue: SecurityIssue }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold text-foreground">{issue.title}</div>
            <Badge tone={toneForSeverity(issue.severity)}>{issue.severity.toUpperCase()}</Badge>
            <span className="rounded-full border border-border bg-card-2 px-2.5 py-1 text-xs font-semibold text-foreground">
              CVSS {formatCvss(issue.cvss_score)}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{issue.description}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">Vulnerable code</div>
          <CodeBlock value={issue.code} />
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-muted">Recommended fix</div>
          <CodeBlock value={issue.fix} />
        </div>
      </div>
    </div>
  );
}

export function ResultsPanel({
  status,
  data,
  errorMessage,
  onClear,
}: {
  status: "idle" | "running" | "success" | "error";
  data: AnalysisResponse | null;
  errorMessage: string | null;
  onClear: () => void;
}) {
  const [filter, setFilter] = useState<"all" | SecurityIssue["severity"]>("all");

  const issues = useMemo(() => data?.issues ?? [], [data]);
  const filtered = useMemo(() => {
    if (filter === "all") return issues;
    return issues.filter((i) => i.severity === filter);
  }, [issues, filter]);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Results"
        subtitle={status === "success" ? "Review summary and prioritize fixes." : "Run an analysis to see findings here."}
        right={
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "all" || next === "critical" || next === "high" || next === "medium" || next === "low") {
                  setFilter(next);
                }
              }}
              className="h-9 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              aria-label="Filter by severity"
              disabled={status !== "success"}
            >
              <option value="all">All severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="ghost" size="sm" onClick={onClear} disabled={status === "running"}>
              Clear
            </Button>
          </div>
        }
      />

      <CardBody className="space-y-4">
        {status === "error" ? <Alert tone="danger" title="Couldn’t complete the analysis" description={errorMessage ?? ""} /> : null}

        {status === "running" ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : null}

        {status === "idle" ? (
          <div className="rounded-2xl border border-border bg-card-2 p-6 text-center">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold text-foreground">Ready when you are</div>
              <div className="mt-1 text-sm text-muted">
                Paste Python code (or open a `.py` file), then click <span className="font-semibold">Analyze</span>.
              </div>
            </div>
          </div>
        ) : null}

        {status === "success" && data ? (
          <div className="space-y-4 animate-in">
            <div className="rounded-2xl border border-border bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] p-4">
              <div className="text-xs font-semibold text-muted">Executive summary</div>
              <div className="mt-2 text-sm text-foreground">{data.summary}</div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-foreground">
                Issues{" "}
                <span className="text-muted">
                  ({filtered.length}/{issues.length})
                </span>
              </div>
              <div className="text-xs text-muted">Sorted by CVSS (highest first)</div>
            </div>

            {issues.length === 0 ? (
              <Alert title="No issues reported" description="Semgrep + AI didn’t return any findings for this input." />
            ) : (
              <div className="grid gap-3">
                {filtered.map((issue, idx) => (
                  <IssueCard key={`${issue.title}-${idx}`} issue={issue} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

