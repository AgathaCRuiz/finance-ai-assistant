import { motion } from "framer-motion";
import type { Message } from "@/types/chat";
import { MarkdownMessage } from "./markdownmessage";

interface MessageBubbleProps { message: Message; }

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 px-4 py-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <span style={{ color: "var(--accent)" }} className="font-mono text-xs font-bold">E</span>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          style={isUser ? {
            background: "var(--user-bubble)",
            border: "1px solid var(--user-border)",
            color: "var(--user-text)",
          } : {
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-body ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="break-words">
              <MarkdownMessage content={message.content} />
              {message.isStreaming && (
                <motion.span
                  style={{ background: "var(--accent)" }}
                  className="inline-block w-0.5 h-3.5 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </div>
          )}
        </div>
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] px-1">
          {formatTime(new Date(message.timestamp))}
        </span>
      </div>
    </motion.div>
  );
}