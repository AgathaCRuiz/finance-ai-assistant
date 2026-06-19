import { apiFetch } from "@/lib/apifetch";
import type { DadosResponse, EvolucaoMensal } from "@/types/api";

export async function fetchDados(periodo = "1m"): Promise<DadosResponse> {
  const res = await apiFetch(`/dados?periodo=${periodo}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<DadosResponse>;
}

export async function fetchEvolucao(): Promise<EvolucaoMensal[]> {
  const res = await apiFetch("/evolucao");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<EvolucaoMensal[]>;
}