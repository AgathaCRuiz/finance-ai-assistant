import { apiFetch } from "@/lib/apifetch";
import type { PerfilCompleto, PerfilUpdatePayload, MetaCompleta } from "@/types/api";

export async function fetchPerfil(): Promise<PerfilCompleto> {
  const res = await apiFetch("/me");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updatePerfil(payload: PerfilUpdatePayload): Promise<void> {
  const res = await apiFetch("/perfil", { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function createMeta(meta: Omit<MetaCompleta, "id" | "status">): Promise<number> {
  const res = await apiFetch("/perfil/metas", { method: "POST", body: JSON.stringify(meta) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as { id: number };
  return data.id;
}

export async function updateMeta(id: number, payload: Partial<MetaCompleta>): Promise<void> {
  const res = await apiFetch(`/perfil/metas/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteMeta(id: number): Promise<void> {
  const res = await apiFetch(`/perfil/metas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function uploadCsv(file: File): Promise<{ banco: string; total: number; entradas: number; saidas: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch("/upload/csv", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}