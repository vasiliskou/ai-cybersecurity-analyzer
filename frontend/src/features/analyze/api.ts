import type { AnalysisResponse } from "@/types/security";

export type AnalyzeError =
  | { type: "network"; message: string }
  | { type: "http"; status: number; message: string }
  | { type: "unknown"; message: string };

function getApiBaseUrl(): string {
  // Prefer explicit env, otherwise:
  // - dev on localhost -> talk to backend at :8000
  // - prod (static served by FastAPI) -> relative
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    if (window.location?.hostname === "localhost") return "http://localhost:8000";
  }

  return "";
}

export async function analyzeCode(code: string, signal?: AbortSignal): Promise<AnalysisResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    signal,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { detail?: string };
      if (data?.detail) message = data.detail;
    } catch {
      // ignore
    }
    throw { type: "http", status: res.status, message } satisfies AnalyzeError;
  }

  return (await res.json()) as AnalysisResponse;
}

