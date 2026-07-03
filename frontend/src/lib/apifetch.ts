import { supabase } from "./supabase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  // Token expirado — tenta refresh uma vez
  if (res.status === 401) {
    const { data: { session: refreshed }, error } = await supabase.auth.refreshSession();

    // Refresh falhou — sessão expirada definitivamente, redireciona para login
    if (error || !refreshed?.access_token) {
      await supabase.auth.signOut();
      window.location.href = "/login?expired=true";
      return res;
    }

    // Retry com novo token
    headers.set("Authorization", `Bearer ${refreshed.access_token}`);
    return fetch(`${BASE_URL}${path}`, { ...init, headers });
  }

  return res;
}

export { BASE_URL };