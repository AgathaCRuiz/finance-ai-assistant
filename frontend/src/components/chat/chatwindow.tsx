import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatWindowProps { investorName?: string; }

export function ChatWindow({ investorName }: ChatWindowProps) {
  const { messages, isLoading, isStreaming, sendMessage } = useChat();

  return (
    <div style={{ background: "var(--bg-base)" }} className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={sendMessage} investorName={investorName} />
        ) : (
          <MessageList messages={messages} isStreaming={isStreaming} />
        )}
      </div>
      <MessageInput onSend={sendMessage} disabled={isLoading || isStreaming} />
    </div>
  );
}