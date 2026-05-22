import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

interface MarkdownMessageProps { content: string; }
interface NodeProps { children?: ReactNode; }
interface CodeProps extends NodeProps { className?: string; inline?: boolean; }
interface AnchorProps extends NodeProps { href?: string; }

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm as never]}
      components={{
        p: ({ children }: NodeProps) => <p style={{ marginBottom: "0.5rem", lineHeight: 1.7 }} className="last:mb-0">{children}</p>,
        h1: ({ children }: NodeProps) => <h1 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 600, margin: "0.75rem 0 0.5rem" }}>{children}</h1>,
        h2: ({ children }: NodeProps) => <h2 style={{ color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 600, margin: "0.75rem 0 0.5rem" }}>{children}</h2>,
        h3: ({ children }: NodeProps) => <h3 style={{ color: "var(--accent)", fontSize: "0.8rem", fontWeight: 500, margin: "0.5rem 0 0.25rem" }}>{children}</h3>,
        ul: ({ children }: NodeProps) => <ul style={{ marginBottom: "0.5rem" }} className="space-y-1 pl-1">{children}</ul>,
        ol: ({ children }: NodeProps) => <ol style={{ marginBottom: "0.5rem" }} className="space-y-1 pl-4 list-decimal">{children}</ol>,
        li: ({ children }: NodeProps) => (
          <li className="flex items-start gap-2 text-sm">
            <span style={{ color: "var(--accent)" }} className="flex-shrink-0 mt-0.5 text-xs">▸</span>
            <span>{children}</span>
          </li>
        ),
        code: ({ children, inline }: CodeProps) => inline
          ? <code style={{ color: "var(--accent)", background: "var(--bg-base)", border: "1px solid var(--border)" }} className="font-mono text-xs rounded px-1.5 py-0.5">{children}</code>
          : <code style={{ color: "var(--accent)", background: "var(--bg-base)", border: "1px solid var(--border)" }} className="block font-mono text-xs rounded-lg p-3 my-2 overflow-x-auto whitespace-pre">{children}</code>,
        pre: ({ children }: NodeProps) => <pre className="my-2 overflow-x-auto">{children}</pre>,
        strong: ({ children }: NodeProps) => <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>,
        em: ({ children }: NodeProps) => <em style={{ color: "var(--text-secondary)" }} className="italic">{children}</em>,
        blockquote: ({ children }: NodeProps) => <blockquote style={{ borderLeft: "2px solid var(--border-bright)", color: "var(--text-muted)" }} className="pl-3 my-2 italic text-sm">{children}</blockquote>,
        table: ({ children }: NodeProps) => <div className="overflow-x-auto my-2"><table className="w-full text-xs border-collapse">{children}</table></div>,
        th: ({ children }: NodeProps) => <th style={{ color: "var(--accent)", borderBottom: "1px solid var(--border)" }} className="text-left px-3 py-1.5 font-medium">{children}</th>,
        td: ({ children }: NodeProps) => <td style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }} className="px-3 py-1.5">{children}</td>,
        hr: () => <hr style={{ borderColor: "var(--border)" }} className="my-3" />,
        a: ({ href, children }: AnchorProps) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }} className="underline underline-offset-2 hover:opacity-80 transition-opacity">{children}</a>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}