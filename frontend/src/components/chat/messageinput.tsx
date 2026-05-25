import { useState, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        className="flex items-end gap-2 rounded-2xl px-4 py-3 focus-within:border-[var(--border-bright)] transition-colors duration-200"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder="Pergunte sobre suas finanças..."
          rows={1}
          style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
          className="flex-1 resize-none bg-transparent font-body text-sm outline-none leading-relaxed disabled:opacity-40 placeholder:text-[var(--text-muted)]"
          
          
        />
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.9 } : undefined}
          style={canSend ? {
            background: "var(--accent)",
            boxShadow: "0 0 16px var(--accent-glow)",
          } : {
            background: "var(--bg-elevated)",
          }}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke={canSend ? "#000" : "var(--text-muted)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
      <p style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] text-center mt-2 opacity-50">
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  );
}