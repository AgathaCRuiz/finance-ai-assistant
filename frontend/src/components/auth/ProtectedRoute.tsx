import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{ background: "#07090d" }} className="flex flex-col items-center justify-center h-screen gap-6">
        {/* Logo animado */}
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "#22d3ee", boxShadow: "0 0 40px rgba(34,211,238,0.4)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span style={{ color: "#000", fontWeight: 700, fontSize: 22 }}>E</span>
        </motion.div>

        {/* Dots de loading */}
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22d3ee" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>

        <p style={{ color: "rgba(160,180,200,0.4)" }} className="font-mono text-xs">
          Carregando...
        </p>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

// Error Boundary simples para evitar tela branca
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: "var(--bg-base)" }}
          className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)" }}>
            <span style={{ fontSize: 20 }}>⚠</span>
          </div>
          <div>
            <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium mb-1">
              Algo deu errado
            </p>
            <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs max-w-xs">
              {this.state.message || "Erro inesperado. Tente recarregar a página."}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl font-body text-sm transition-all"
            style={{ background: "var(--accent)", color: "#000" }}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}