import type { StreamToken } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// --- GET /chat/stream?mensagem=...&session_id=... ---
export async function sendMessageStream(
  mensagem: string,
  sessionId: string | null,
  onToken: (token: string) => void,
  onSessionId: (id: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const params = new URLSearchParams({ mensagem });
    if (sessionId) params.set("session_id", sessionId);

    const res = await fetch(`${BASE_URL}/chat/stream?${params.toString()}`);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
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

// --- DELETE /chat/session/:id ---
export async function deleteSessionOnServer(sessionId: string): Promise<void> {
  await fetch(`${BASE_URL}/chat/session/${sessionId}`, { method: "DELETE" });
}