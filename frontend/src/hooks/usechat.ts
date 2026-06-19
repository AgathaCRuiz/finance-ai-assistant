import { useCallback, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { sendMessageStream, deleteSessionOnServer } from "@/services/chatService";
import type { Message } from "@/types/chat";

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat() {
  const {
    sessions, activeSessionId,
    isLoading, isStreaming, error,
    createSession, switchSession, deleteSession,
    addMessage, updateLastMessage, finalizeStream,
    setLoading, setStreaming, setError,
    renameSession, setServerId,
  } = useChatStore();

  useEffect(() => {
    if (sessions.length === 0) createSession();
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return;

    let localId = activeSessionId;
    if (!localId) localId = createSession();

    setError(null);
    setStreaming(true);

    const userMsg: Message = {
      id: genId(), role: "user", content,
      status: "delivered", timestamp: new Date(),
    };
    addMessage(userMsg);

    // Auto-título com a primeira mensagem
    if (messages.length === 0) {
      renameSession(localId, content.slice(0, 40) + (content.length > 40 ? "..." : ""));
    }

    addMessage({
      id: genId(), role: "assistant", content: "",
      status: "streaming", timestamp: new Date(), isStreaming: true,
    });

    // Pega o serverId já existente (se sessão já foi iniciada)
    const currentServerId = sessions.find((s) => s.id === localId)?.serverId ?? null;

    await sendMessageStream(
      content,
      currentServerId,
      (token) => updateLastMessage(token),
      (serverId) => setServerId(localId!, serverId),
      () => finalizeStream(),
      (err) => { setError(err.message); finalizeStream(); }
    );

    setLoading(false);
  }, [activeSessionId, isLoading, isStreaming, messages.length, sessions]);

  const newChat = useCallback(() => createSession(), []);

  const handleDeleteSession = useCallback(async (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session?.serverId) {
      await deleteSessionOnServer(session.serverId).catch(() => {});
    }
    deleteSession(id);
  }, [sessions]);

  return {
    sessions,
    activeSession,
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    newChat,
    switchSession,
    deleteSession: handleDeleteSession,
  };
}