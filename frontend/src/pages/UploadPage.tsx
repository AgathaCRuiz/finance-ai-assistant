import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { uploadCsv } from "@/services/profileService";

type Status = "idle" | "dragging" | "uploading" | "success" | "error";

export function UploadPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ banco: string; total: number; entradas: number; saidas: number } | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Apenas arquivos .csv são aceitos");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setError(null);
    try {
      const res = await uploadCsv(file);
      setResult(res);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo");
      setStatus("error");
    }
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setStatus("idle");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100%" }}
      className="flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-thin">

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.02) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg flex flex-col items-center">

        <h1 style={{ color: "var(--text-primary)" }} className="font-display text-2xl font-semibold mb-2 text-center">
          Importe seu extrato bancário
        </h1>
        <p style={{ color: "var(--text-muted)" }} className="font-body text-sm mb-8 text-center">
          Suportamos Inter, Nubank, Banco do Brasil e outros bancos. Suas transações serão categorizadas automaticamente.
        </p>

        <AnimatePresence mode="wait">
          {status !== "success" && (
            <motion.div
              key="dropzone"
              exit={{ opacity: 0, scale: 0.95 }}
              onDragOver={e => { e.preventDefault(); setStatus("dragging"); }}
              onDragLeave={() => setStatus("idle")}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200"
              style={{
                background: status === "dragging" ? "var(--accent-glow)" : "var(--bg-surface)",
                border: `2px dashed ${status === "dragging" ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              <input ref={inputRef} type="file" accept=".csv" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {status === "uploading" ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                  <p style={{ color: "var(--text-secondary)" }} className="font-body text-sm">Processando arquivo...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M11 3v12M11 3l-4 4M11 3l4 4M4 17h14" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium">
                      Arraste seu CSV aqui
                    </p>
                    <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs mt-1">
                      ou clique para selecionar
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Erro */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full mt-4 rounded-xl p-4"
              style={{ background: "#f871711a", border: "1px solid #f8717140" }}>
              <p style={{ color: "#f87171" }} className="font-body text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sucesso */}
        <AnimatePresence>
          {status === "success" && result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-2xl p-6"
              style={{ background: "var(--bg-surface)", border: "1px solid #34d39940" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#34d39920", color: "#34d399" }}>✓</div>
                <div>
                  <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium">
                    Importação concluída!
                  </p>
                  <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs">
                    Banco detectado: {result.banco}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Total", value: result.total, color: "var(--accent)" },
                  { label: "Entradas", value: result.entradas, color: "#34d399" },
                  { label: "Saídas", value: result.saidas, color: "#f87171" },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--bg-elevated)" }} className="rounded-lg p-3 text-center">
                    <p style={{ color: s.color }} className="font-display text-lg font-bold">{s.value}</p>
                    <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/app/dashboard")}
                className="w-full rounded-xl py-3 font-body text-sm font-medium"
                style={{ background: "var(--accent)", color: "#000" }}>
                Ver no dashboard →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => navigate("/app")}
          className="mt-6 font-mono text-xs"
          style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          Pular por enquanto →
        </button>
      </motion.div>
    </div>
  );
}