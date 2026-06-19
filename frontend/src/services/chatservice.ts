import { apiFetch, BASE_URL } from "@/lib/apifetch";
import { supabase } from "@/lib/supabase";
import type { StreamToken } from "@/types/api";

export async function sendMessageStream(
  mensagem: string,
  sessionId: string | null,
  onToken: (token: string) => void,
  onSessionId: (id: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const params = new URLSearchParams({ mensagem });
    if (sessionId) params.set("session_id", sessionId);

    const res = await fetch(`${BASE_URL}/chat/stream?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      for (const line of text.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.replace("data: ", "").trim();
        try {
          const parsed = JSON.parse(raw) as StreamToken & { session_id?: string };
          if (parsed.session_id) onSessionId(parsed.session_id);
          if (parsed.done) { onDone(); return; }
          if (parsed.token) onToken(parsed.token);
        } catch { /* fragmento incompleto */ }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function deleteSessionOnServer(sessionId: string): Promise<void> {
  await apiFetch(`/chat/session/${sessionId}`, { method: "DELETE" });
}