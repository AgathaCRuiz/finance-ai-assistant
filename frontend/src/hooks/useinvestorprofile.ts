// ============================================================
// useInvestorProfile.ts — carrega GET /dados
// ============================================================

import { useState, useEffect } from "react";
import { fetchDados } from "@/services/investorservice";
import type { DadosResponse } from "@/types/api";
import type { AsyncState } from "@/types/api";

export function useInvestorProfile(): AsyncState<DadosResponse> {
  const [state, setState] = useState<AsyncState<DadosResponse>>({
    data: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading", error: null }));

    fetchDados()
      .then((data) => {
        if (!cancelled) setState({ data, status: "success", error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            status: "error",
            error: err instanceof Error ? err.message : "Erro ao carregar dados",
          });
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}