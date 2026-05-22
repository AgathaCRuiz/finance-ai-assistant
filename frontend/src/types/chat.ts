// ============================================================
// Tipos relacionados ao chat e mensagens
// ============================================================

/** Quem enviou a mensagem */
export type MessageRole = "user" | "assistant" | "system";

/** Status de envio de uma mensagem */
export type MessageStatus = "sending" | "streaming" | "delivered" | "error";

/** Uma mensagem individual no chat */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  timestamp: Date;
  /** Se a mensagem veio via streaming, indica se ainda está sendo recebida */
  isStreaming?: boolean;
}

/** Uma sessão completa de conversa */
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/** Payload enviado ao backend para criar uma nova mensagem */
export interface SendMessagePayload {
  sessionId?: string;
  content: string;
}

/** Resposta do backend após envio de mensagem */
export interface SendMessageResponse {
  sessionId: string;
  message: Message;
}

/** Item de sugestão exibido na WelcomeScreen */
export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}