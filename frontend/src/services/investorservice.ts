import type { DadosResponse, EvolucaoMensal } from "@/types/api";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://finance-ai-assistant-production-bcea.up.railway.app";

export async function fetchDados(): Promise<DadosResponse> {
  const res = await fetch(`${BASE_URL}/dados`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<DadosResponse>;
}

export async function fetchEvolucao(): Promise<EvolucaoMensal[]> {
  const res = await fetch(`${BASE_URL}/evolucao`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<EvolucaoMensal[]>;
}