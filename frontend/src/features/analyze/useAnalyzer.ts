"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { AnalysisResponse } from "@/types/security";
import { analyzeCode, type AnalyzeError } from "./api";

export type AnalyzerState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "success"; data: AnalysisResponse }
  | { status: "error"; error: AnalyzeError };

export function useAnalyzer() {
  const [state, setState] = useState<AnalyzerState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (code: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: "running" });

    try {
      const data = await analyzeCode(code, controller.signal);
      setState({ status: "success", data });
      return data;
    } catch (err) {
      if (controller.signal.aborted) return;

      const normalized: AnalyzeError =
        typeof err === "object" && err && "type" in err
          ? (err as AnalyzeError)
          : { type: "unknown", message: "Something went wrong while analyzing the code." };

      setState({ status: "error", error: normalized });
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ status: "idle" });
  }, []);

  const isRunning = state.status === "running";

  const errorMessage = useMemo(() => {
    if (state.status !== "error") return null;
    const e = state.error;
    if (e.type === "http") return e.message;
    return e.message;
  }, [state]);

  return { state, run, cancel, isRunning, errorMessage };
}

