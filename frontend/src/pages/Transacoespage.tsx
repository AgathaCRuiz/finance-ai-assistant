import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/apifetch";

interface Transacao {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "entrada" | "saida";
}

interface ResumoData {
  entradas: number;
  saidas: number;
  saldo: number;
  por_categoria: Record<string, number>;
}

type Periodo = "1m" | "3m" | "6m" | "12m";
type Tipo = "" | "entrada" | "saida";

const CATEGORIAS = [
  "alimentacao", "moradia", "transporte", "saude", "educacao",
  "lazer", "vestuario", "investimento", "receita", "fatura", "servicos", "outros"
];

const CAT_COLORS: Record<string, string> = {
  alimentacao:  "#f59e0b",
  moradia:      "#22d3ee",
  transporte:   "#6366f1",
  saude:        "#34d399",
  educacao:     "#a78bfa",
  lazer:        "#f87171",
  vestuario:    "#fb923c",
  investimento: "#10b981",
  receita:      "#34d399",
  fatura:       "#94a3b8",
  servicos:     "#64748b",
  outros:       "#475569",
};

const CAT_ICONS: Record<string, string> = {
  alimentacao: "🛒", moradia: "🏠", transporte: "🚗",
  saude: "💊", educacao: "📚", lazer: "🎬",
  vestuario: "👔", investimento: "📈", receita: "💰",
  fatura: "💳", servicos: "📱", outros: "📦",
};

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function fmtCompact(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: 0.4 }} />
      <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-1">{label}</p>
      <p style={{ color }} className="font-display text-2xl font-bold tracking-tight">{fmtCompact(value)}</p>
    </div>
  );
}

export function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo]         = useState<ResumoData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [periodo, setPeriodo]       = useState<Periodo>("1m");
  const [tipo, setTipo]             = useState<Tipo>("");
  const [categoria, setCategoria]   = useState("");
  const [busca, setBusca]           = useState("");
  const [pagina, setPagina]         = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [editCat, setEditCat]       = useState("");

  const fetchTransacoes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        periodo, page: String(pagina), limit: "30",
        ...(tipo && { tipo }),
        ...(categoria && { categoria }),
        ...(busca && { busca }),
      });
      const res  = await apiFetch(`/transacoes?${params}`);
      const data = await res.json();
      setTransacoes(data.transacoes ?? []);
      setResumo(data.resumo ?? null);
      setTotalPaginas(data.paginas ?? 1);
    } catch {
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  }, [periodo, tipo, categoria, busca, pagina]);

  useEffect(() => { void fetchTransacoes(); }, [fetchTransacoes]);

  // Reset página ao mudar filtros
  useEffect(() => { setPagina(1); }, [periodo, tipo, categoria, busca]);

  async function handleUpdateCategoria(id: number, cat: string) {
    await apiFetch(`/transacoes/${id}/categoria`, {
      method: "PATCH",
      body: JSON.stringify({ categoria: cat }),
    });
    setTransacoes(ts => ts.map(t => t.id === id ? { ...t, categoria: cat } : t));
    setEditingId(null);
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100%" }} className="overflow-y-auto scrollbar-thin">

      {/* Fundo */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.02) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 p-6 max-w-6xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 style={{ color: "var(--text-primary)" }} className="font-display text-xl font-semibold tracking-tight">
              Extrato
            </h1>
            <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs mt-0.5">
              Todas as suas movimentações
            </p>
          </div>

          {/* Filtro de período */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            {(["1m","3m","6m","12m"] as Periodo[]).map(p => (
              <motion.button key={p} onClick={() => setPeriodo(p)} whileTap={{ scale: 0.95 }}
                className="relative px-3 py-1.5 rounded-lg font-mono text-[10px] transition-colors"
                style={{ color: periodo === p ? "var(--text-primary)" : "var(--text-muted)" }}>
                {periodo === p && (
                  <motion.div layoutId="periodo-trans" className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }} />
                )}
                <span className="relative z-10">{p}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* KPIs */}
        {resumo && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-4">
            <KpiCard label="Entradas" value={resumo.entradas} color="#34d399" />
            <KpiCard label="Saídas"   value={resumo.saidas}   color="#f87171" />
            <KpiCard label="Saldo"    value={resumo.saldo}    color={resumo.saldo >= 0 ? "#22d3ee" : "#f87171"} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

          {/* Sidebar de filtros + categorias */}
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-col gap-4">

            {/* Busca */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-4">
              <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-2">Buscar</p>
              <input value={busca} onChange={e => setBusca(e.target.value)}
                placeholder="Supermercado, Uber..."
                className="w-full rounded-xl px-3 py-2 font-body text-sm outline-none"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>

            {/* Tipo */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-4">
              <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-3">Tipo</p>
              <div className="flex flex-col gap-1.5">
                {[["", "Todos"], ["entrada", "Entradas"], ["saida", "Saídas"]].map(([v, l]) => (
                  <button key={v} onClick={() => setTipo(v as Tipo)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors font-body text-sm"
                    style={{
                      background: tipo === v ? "var(--accent-glow)" : "transparent",
                      border: `1px solid ${tipo === v ? "var(--accent-dim)" : "transparent"}`,
                      color: tipo === v ? "var(--accent)" : "var(--text-muted)",
                    }}>
                    <span className="w-2 h-2 rounded-full" style={{
                      background: v === "entrada" ? "#34d399" : v === "saida" ? "#f87171" : "var(--text-muted)"
                    }} />
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorias */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-4">
              <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-3">Categoria</p>
              <div className="flex flex-col gap-1">
                <button onClick={() => setCategoria("")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-left font-body text-sm transition-colors"
                  style={{
                    background: categoria === "" ? "var(--accent-glow)" : "transparent",
                    color: categoria === "" ? "var(--accent)" : "var(--text-muted)",
                  }}>
                  Todas
                </button>
                {CATEGORIAS.map(cat => (
                  <button key={cat} onClick={() => setCategoria(cat === categoria ? "" : cat)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-left font-body text-xs transition-colors"
                    style={{
                      background: categoria === cat ? `${CAT_COLORS[cat]}15` : "transparent",
                      color: categoria === cat ? CAT_COLORS[cat] : "var(--text-muted)",
                      border: `1px solid ${categoria === cat ? CAT_COLORS[cat] + "40" : "transparent"}`,
                    }}>
                    <span>{CAT_ICONS[cat]}</span>
                    <span className="capitalize">{cat}</span>
                    {resumo?.por_categoria[cat] && (
                      <span className="ml-auto font-mono text-[9px]">{fmtCompact(resumo.por_categoria[cat])}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lista de transações */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-3 flex flex-col gap-3">

            {loading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                    className="h-16 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : transacoes.length === 0 ? (
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                className="rounded-2xl p-12 text-center">
                <p style={{ color: "var(--text-muted)" }} className="font-body text-sm">
                  Nenhuma transação encontrada
                </p>
                <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs mt-1">
                  Faça upload do seu extrato na aba de importação
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence initial={false}>
                  {transacoes.map((t, i) => {
                    const color = CAT_COLORS[t.categoria] ?? "#475569";
                    const icon  = CAT_ICONS[t.categoria]  ?? "📦";
                    const isEditing = editingId === t.id;

                    return (
                      <motion.div key={t.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                        className="rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[var(--border-bright)] transition-colors group"
                      >
                        {/* Ícone categoria */}
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                          {icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium truncate">
                            {t.descricao}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">
                              {new Date(t.data).toLocaleDateString("pt-BR")}
                            </span>
                            {/* Tag de categoria editável */}
                            {isEditing ? (
                              <select
                                value={editCat}
                                onChange={e => setEditCat(e.target.value)}
                                onBlur={() => setEditingId(null)}
                                autoFocus
                                className="font-mono text-[9px] rounded px-1.5 py-0.5 outline-none"
                                style={{ background: "var(--bg-elevated)", border: `1px solid ${color}`, color }}
                              >
                                {CATEGORIAS.map(c => (
                                  <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>
                                ))}
                                <option value="" disabled>cancelar</option>
                              </select>
                            ) : (
                              <button
                                onClick={() => { setEditingId(t.id); setEditCat(t.categoria); }}
                                className="font-mono text-[9px] rounded px-1.5 py-0.5 transition-colors"
                                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                                title="Clique para editar categoria"
                              >
                                {CAT_ICONS[t.categoria]} {t.categoria}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Valor + ações */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing && (
                            <button onClick={() => handleUpdateCategoria(t.id, editCat)}
                              className="font-mono text-[9px] px-2 py-1 rounded-lg transition-colors"
                              style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>
                              ✓
                            </button>
                          )}
                          <p style={{ color: t.tipo === "entrada" ? "#34d399" : "#f87171" }}
                            className="font-display text-sm font-bold">
                            {t.tipo === "entrada" ? "+" : "-"}{fmt(t.valor)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                      className="px-3 py-1.5 rounded-lg font-mono text-[10px] transition-colors disabled:opacity-30"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                      ← Anterior
                    </button>
                    <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px]">
                      {pagina} / {totalPaginas}
                    </span>
                    <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                      className="px-3 py-1.5 rounded-lg font-mono text-[10px] transition-colors disabled:opacity-30"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                      Próxima →
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}