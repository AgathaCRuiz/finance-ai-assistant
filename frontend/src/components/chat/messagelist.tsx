import { useEffect, useRef } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "./messagebubble";
import { TypingIndicator } from "./typingindicator";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col gap-1 py-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#00ff9d22] scrollbar-track-transparent">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isStreaming && !messages.at(-1)?.isStreaming && (
        <TypingIndicator />
      )}

      <div ref={bottomRef} />
    </div>
  );
}