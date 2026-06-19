import { motion } from "framer-motion";
import type { Message } from "@/types/chat";
import { MarkdownMessage } from "./MarkdownMessage";
import { ChartRenderer, parseChartFromContent, stripChartBlock } from "./ChartRenderer";

interface MessageBubbleProps { message: Message; }

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Durante o streaming esconde o bloco ```chart``` — só renderiza após finalizar
  const { text, chart } = isUser
    ? { text: message.content, chart: null }
    : message.isStreaming
      ? { text: stripChartBlock(message.content), chart: null }
      : parseChartFromContent(message.content);

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

      <div className={`flex flex-col gap-1 ${isUser ? "items-end max-w-[78%]" : "items-start w-full"}`}
      style={!isUser ? { maxWidth: "min(85%, 680px)" } : undefined}>
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
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-body w-full ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{text}</p>
          ) : (
            <div className="break-words">
              <MarkdownMessage content={text} />
              {/* Gráfico — só renderiza após streaming finalizar */}
              {chart && (
                <ChartRenderer chart={chart} />
              )}
              {/* Cursor piscante durante streaming */}
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