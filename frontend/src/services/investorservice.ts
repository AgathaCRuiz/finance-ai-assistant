// ============================================================
// investorService.ts — GET /dados
// ============================================================

import type { DadosResponse } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function fetchDados(): Promise<DadosResponse> {
  const res = await fetch(`${BASE_URL}/dados`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<DadosResponse>;
}