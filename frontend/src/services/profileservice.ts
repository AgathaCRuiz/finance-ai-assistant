import type { PerfilCompleto, PerfilUpdatePayload, MetaCompleta } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL não está definida no ambiente");
}

export async function fetchPerfil(): Promise<PerfilCompleto> {
  const res = await fetch(`${BASE_URL}/perfil`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updatePerfil(payload: PerfilUpdatePayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/perfil`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function createMeta(
  meta: Omit<MetaCompleta, "id" | "status">
): Promise<number> {
  const res = await fetch(`${BASE_URL}/perfil/metas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meta),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as { id: number };
  return data.id;
}

export async function updateMeta(
  id: number,
  payload: Partial<MetaCompleta>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/perfil/metas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteMeta(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/perfil/metas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}