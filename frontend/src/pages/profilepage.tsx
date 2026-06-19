import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPerfil, updatePerfil, createMeta, updateMeta, deleteMeta } from "@/services/profileService";
import type { PerfilCompleto, MetaCompleta } from "@/types/api";

// ── helpers ──────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

const RISK_OPTIONS = [
  { value: "conservador", label: "Conservador",  color: "#22d3ee", desc: "Prefere segurança e liquidez" },
  { value: "moderado",    label: "Moderado",     color: "#a78bfa", desc: "Equilíbrio entre risco e retorno" },
  { value: "arrojado",    label: "Arrojado",     color: "#f59e0b", desc: "Aceita mais risco por maior retorno" },
  { value: "agressivo",   label: "Agressivo",    color: "#f87171", desc: "Maximiza retorno, tolera volatilidade" },
];

// ── Componente de campo ──────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-2.5 font-body text-sm outline-none transition-all duration-200"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        caretColor: "var(--accent)",
      }}
      onFocus={e => (e.target.style.borderColor = "var(--accent-dim)")}
      onBlur={e => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

// ── Card de seção ────────────────────────────────────────────
function Section({ title, accent = "#22d3ee", children }: {
  title: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: 0.4 }} />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${type === "success" ? "#34d39940" : "#f8717140"}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: type === "success" ? "#34d399" : "#f87171" }} className="text-sm">
        {type === "success" ? "✓" : "✕"}
      </span>
      <span style={{ color: "var(--text-primary)" }} className="font-body text-sm">{msg}</span>
    </motion.div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function ProfilePage() {
  const [perfil, setPerfil]         = useState<PerfilCompleto | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingMeta, setEditingMeta] = useState<MetaCompleta | null>(null);
  const [newMeta, setNewMeta]       = useState(false);
  const [metaForm, setMetaForm]     = useState({ titulo: "", valor_necessario: "", valor_atual: "", prazo: "" });

  useEffect(() => {
    fetchPerfil()
      .then(setPerfil)
      .catch(() => showToast("Erro ao carregar perfil", "error"))
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSavePerfil() {
    if (!perfil) return;
    setSaving(true);
    try {
      await updatePerfil({
        nome:               perfil.nome,
        email:              perfil.email,
        idade:              perfil.idade,
        perfil_investidor:  perfil.perfil_investidor,
        objetivo_principal: perfil.objetivo_principal,
        renda_mensal:       perfil.renda_mensal,
        patrimonio_total:   perfil.patrimonio_total,
        reserva_emergencia: perfil.reserva_emergencia,
        reserva_necessaria: perfil.reserva_necessaria,
      });
      showToast("Perfil salvo com sucesso!", "success");
    } catch {
      showToast("Erro ao salvar perfil", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveMeta() {
    if (!perfil) return;
    try {
      if (editingMeta) {
        await updateMeta(editingMeta.id, metaForm as never);
        setPerfil(p => p ? {
          ...p,
          metas: p.metas.map(m => m.id === editingMeta.id ? { ...m, ...metaForm,
            valor_necessario: Number(metaForm.valor_necessario),
            valor_atual: Number(metaForm.valor_atual),
          } : m),
        } : p);
        showToast("Meta atualizada!", "success");
      } else {
        const id = await createMeta({
          titulo:           metaForm.titulo,
          valor_necessario: Number(metaForm.valor_necessario),
          valor_atual:      Number(metaForm.valor_atual),
          prazo:            metaForm.prazo,
        });
        setPerfil(p => p ? {
          ...p,
          metas: [...p.metas, { id, ...metaForm,
            valor_necessario: Number(metaForm.valor_necessario),
            valor_atual: Number(metaForm.valor_atual),
            status: "em_andamento",
          }],
        } : p);
        showToast("Meta criada!", "success");
      }
      setEditingMeta(null);
      setNewMeta(false);
      setMetaForm({ titulo: "", valor_necessario: "", valor_atual: "", prazo: "" });
    } catch {
      showToast("Erro ao salvar meta", "error");
    }
  }

  async function handleDeleteMeta(id: number) {
    try {
      await deleteMeta(id);
      setPerfil(p => p ? { ...p, metas: p.metas.filter(m => m.id !== id) } : p);
      showToast("Meta removida!", "success");
    } catch {
      showToast("Erro ao remover meta", "error");
    }
  }

  function openEditMeta(meta: MetaCompleta) {
    setEditingMeta(meta);
    setNewMeta(false);
    setMetaForm({
      titulo:           meta.titulo,
      valor_necessario: String(meta.valor_necessario),
      valor_atual:      String(meta.valor_atual),
      prazo:            meta.prazo,
    });
  }

  function openNewMeta() {
    setNewMeta(true);
    setEditingMeta(null);
    setMetaForm({ titulo: "", valor_necessario: "", valor_atual: "", prazo: "" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100%" }}
      className="overflow-y-auto scrollbar-thin">

      {/* Grid de fundo */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.02) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 p-6 max-w-4xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <h1 style={{ color: "var(--text-primary)" }} className="font-display text-xl font-semibold tracking-tight">
              Perfil & Configurações
            </h1>
            <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs mt-0.5">
              Edite suas informações pessoais e metas financeiras
            </p>
          </div>
          <motion.button
            onClick={handleSavePerfil}
            disabled={saving}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-all"
            style={{
              background: saving ? "var(--bg-elevated)" : "var(--accent)",
              color: saving ? "var(--text-muted)" : "#000",
              boxShadow: saving ? "none" : "0 0 20px var(--accent-glow)",
            }}
          >
            {saving ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                ◌
              </motion.span>
            ) : "✓"}
            {saving ? "Salvando..." : "Salvar alterações"}
          </motion.button>
        </motion.div>

        {/* Avatar + nome */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Section title="Identidade" accent="#22d3ee">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", boxShadow: "0 0 20px var(--accent-glow)" }}>
                <span style={{ color: "var(--accent)" }} className="font-display text-2xl font-bold">
                  {perfil.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <p style={{ color: "var(--text-primary)" }} className="font-display text-lg font-semibold">{perfil.nome}</p>
                <p style={{ color: "var(--text-muted)" }} className="font-body text-sm">{perfil.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome completo">
                <Input value={perfil.nome} onChange={v => setPerfil(p => p ? { ...p, nome: v } : p)} />
              </Field>
              <Field label="E-mail">
                <Input value={perfil.email} onChange={v => setPerfil(p => p ? { ...p, email: v } : p)} type="email" />
              </Field>
              <Field label="Idade">
                <Input value={perfil.idade} onChange={v => setPerfil(p => p ? { ...p, idade: Number(v) } : p)} type="number" />
              </Field>
              <Field label="Objetivo principal">
                <Input value={perfil.objetivo_principal}
                  onChange={v => setPerfil(p => p ? { ...p, objetivo_principal: v } : p)}
                  placeholder="Ex: Construir reserva de emergência" />
              </Field>
            </div>
          </Section>
        </motion.div>

        {/* Perfil de risco */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Section title="Perfil de investidor" accent="#a78bfa">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RISK_OPTIONS.map(opt => {
                const isActive = perfil.perfil_investidor === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => setPerfil(p => p ? { ...p, perfil_investidor: opt.value } : p)}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: isActive ? `${opt.color}15` : "var(--bg-elevated)",
                      border: `1px solid ${isActive ? opt.color + "50" : "var(--border)"}`,
                      boxShadow: isActive ? `0 0 16px ${opt.color}20` : "none",
                    }}
                  >
                    <span style={{ color: isActive ? opt.color : "var(--text-primary)" }}
                      className="font-display text-sm font-semibold">
                      {opt.label}
                    </span>
                    <span style={{ color: "var(--text-muted)" }} className="font-body text-[10px] leading-relaxed">
                      {opt.desc}
                    </span>
                    {isActive && (
                      <span style={{ color: opt.color }} className="font-mono text-[9px]">● ATIVO</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Section>
        </motion.div>

        {/* Finanças */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section title="Informações financeiras" accent="#34d399">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Renda mensal (R$)",       key: "renda_mensal" },
                { label: "Patrimônio total (R$)",    key: "patrimonio_total" },
                { label: "Reserva atual (R$)",       key: "reserva_emergencia" },
                { label: "Reserva necessária (R$)",  key: "reserva_necessaria" },
              ].map(f => (
                <Field key={f.key} label={f.label}>
                  <Input
                    type="number"
                    value={(perfil as never)[f.key] as number}
                    onChange={v => setPerfil(p => p ? { ...p, [f.key]: Number(v) } : p)}
                  />
                </Field>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Renda",     value: perfil.renda_mensal,      color: "#34d399" },
                { label: "Patrimônio",value: perfil.patrimonio_total,   color: "#22d3ee" },
                { label: "Reserva",   value: perfil.reserva_emergencia, color: "#a78bfa" },
                { label: "Meta",      value: perfil.reserva_necessaria, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  className="rounded-xl p-3">
                  <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-1">{s.label}</p>
                  <p style={{ color: s.color }} className="font-display text-base font-bold tracking-tight">{fmt(s.value)}</p>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* Metas */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section title="Metas financeiras" accent="#f59e0b">
            <div className="flex flex-col gap-3 mb-4">
              {perfil.metas.map((meta, i) => {
                const pct = Math.min((meta.valor_atual / meta.valor_necessario) * 100, 100);
                const colors = ["#22d3ee","#a78bfa","#34d399","#f59e0b"];
                const color  = colors[i % colors.length];
                return (
                  <div key={meta.id}
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                    className="rounded-xl p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium truncate">
                          {meta.titulo}
                        </p>
                        <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] mt-0.5">
                          Prazo: {meta.prazo} · {fmt(meta.valor_atual)} / {fmt(meta.valor_necessario)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span style={{ color }} className="font-mono text-xs font-bold">{pct.toFixed(0)}%</span>
                        <button onClick={() => openEditMeta(meta)}
                          style={{ color: "var(--text-muted)", background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-[var(--border-bright)] transition-colors">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M7 1L9 3L4 8H2V6L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteMeta(meta.id)}
                          style={{ color: "var(--text-muted)", background: "var(--bg-hover)", border: "1px solid var(--border)" }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-red-500/40 hover:text-red-400 transition-colors">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={{ background: "var(--bg-base)" }} className="h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form de meta */}
            <AnimatePresence>
              {(newMeta || editingMeta) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--accent-dim)" }}
                  className="rounded-xl p-4 mb-3"
                >
                  <p style={{ color: "var(--accent)" }} className="font-mono text-[10px] uppercase tracking-widest mb-3">
                    {editingMeta ? "Editar meta" : "Nova meta"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Título">
                      <Input value={metaForm.titulo} onChange={v => setMetaForm(f => ({ ...f, titulo: v }))} placeholder="Ex: Viagem Europa" />
                    </Field>
                    <Field label="Prazo (AAAA-MM)">
                      <Input value={metaForm.prazo} onChange={v => setMetaForm(f => ({ ...f, prazo: v }))} placeholder="2026-12" />
                    </Field>
                    <Field label="Valor necessário (R$)">
                      <Input value={metaForm.valor_necessario} type="number" onChange={v => setMetaForm(f => ({ ...f, valor_necessario: v }))} />
                    </Field>
                    <Field label="Valor atual (R$)">
                      <Input value={metaForm.valor_atual} type="number" onChange={v => setMetaForm(f => ({ ...f, valor_atual: v }))} />
                    </Field>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleSaveMeta}
                      className="px-4 py-2 rounded-lg font-body text-sm font-medium transition-all"
                      style={{ background: "var(--accent)", color: "#000" }}>
                      Salvar
                    </button>
                    <button onClick={() => { setNewMeta(false); setEditingMeta(null); }}
                      className="px-4 py-2 rounded-lg font-body text-sm transition-all"
                      style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={openNewMeta}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm transition-all w-full justify-center"
              style={{ background: "var(--bg-elevated)", border: "1px dashed var(--border)", color: "var(--text-muted)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Adicionar meta
            </button>
          </Section>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}