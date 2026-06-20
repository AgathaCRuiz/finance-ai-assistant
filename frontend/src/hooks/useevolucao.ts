import { useState, useEffect } from "react";
import { fetchEvolucao } from "@/services/investorservice";
import type { EvolucaoMensal, AsyncState } from "@/types/api";

export function useEvolucao(): AsyncState<EvolucaoMensal[]> {
  const [state, setState] = useState<AsyncState<EvolucaoMensal[]>>({
    data: null, status: "idle", error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, status: "loading", error: null }));
    fetchEvolucao()
      .then(data => { if (!cancelled) setState({ data, status: "success", error: null }); })
      .catch((err: unknown) => {
        if (!cancelled) setState({
          data: null, status: "error",
          error: err instanceof Error ? err.message : "Erro ao carregar evolução",
        });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}