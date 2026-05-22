import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "@/types/chat";

export interface ChatSession {
  id: string;           // ID local (frontend)
  serverId: string | null; // ID da sessão no backend
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;

  createSession: () => string;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  setServerId: (localId: string, serverId: string) => void;

  addMessage: (message: Message) => void;
  updateLastMessage: (token: string) => void;
  finalizeStream: () => void;

  setStreaming: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function newSession(): ChatSession {
  return { id: genId(), serverId: null, title: "Nova conversa", messages: [], createdAt: Date.now() };
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isStreaming: false,
      isLoading: false,
      error: null,

      createSession: () => {
        const session = newSession();
        set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: session.id }));
        return session.id;
      },

      switchSession: (id) => set({ activeSessionId: id }),

      deleteSession: (id) =>
        set((s) => {
          const sessions = s.sessions.filter((s) => s.id !== id);
          const activeSessionId = s.activeSessionId === id ? (sessions[0]?.id ?? null) : s.activeSessionId;
          return { sessions, activeSessionId };
        }),

      renameSession: (id, title) =>
        set((s) => ({ sessions: s.sessions.map((sess) => sess.id === id ? { ...sess, title } : sess) })),

      setServerId: (localId, serverId) =>
        set((s) => ({ sessions: s.sessions.map((sess) => sess.id === localId ? { ...sess, serverId } : sess) })),

      addMessage: (message) => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId) return;
        set({ sessions: sessions.map((sess) => sess.id === activeSessionId ? { ...sess, messages: [...sess.messages, message] } : sess) });
      },

      updateLastMessage: (token) => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId) return;
        set({
          sessions: sessions.map((sess) => {
            if (sess.id !== activeSessionId) return sess;
            const messages = [...sess.messages];
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") {
              messages[messages.length - 1] = { ...last, content: last.content + token, isStreaming: true };
            }
            return { ...sess, messages };
          }),
        });
      },

      finalizeStream: () => {
        const { activeSessionId, sessions } = get();
        if (!activeSessionId) return;
        set({
          isStreaming: false,
          sessions: sessions.map((sess) => {
            if (sess.id !== activeSessionId) return sess;
            const messages = [...sess.messages];
            const last = messages[messages.length - 1];
            if (last?.role === "assistant") {
              messages[messages.length - 1] = { ...last, status: "delivered", isStreaming: false };
            }
            return { ...sess, messages };
          }),
        });
      },

      setStreaming: (isStreaming) => set({ isStreaming }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "bia-chat-history",
      partialize: (s) => ({ sessions: s.sessions, activeSessionId: s.activeSessionId }),
    }
  )
);