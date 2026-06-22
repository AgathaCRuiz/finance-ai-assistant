import { supabase } from "./supabase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Debug — remova após confirmar que funciona
  console.log("[apiFetch] path:", path);
  console.log("[apiFetch] token:", token ? token.substring(0, 40) + "..." : "NENHUM TOKEN");

  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.warn("[apiFetch] Sem token! Sessão:", session);
  }

  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (res.status === 401 && token) {
    console.warn("[apiFetch] 401 recebido, tentando refresh do token...");
    const { data: { session: refreshed } } = await supabase.auth.refreshSession();
    if (refreshed?.access_token) {
      console.log("[apiFetch] Token refreshed, repetindo requisição...");
      headers.set("Authorization", `Bearer ${refreshed.access_token}`);
      return fetch(`${BASE_URL}${path}`, { ...init, headers });
    }
  }

  return res;
}

export { BASE_URL };