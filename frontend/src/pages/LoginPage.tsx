import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.73a5.4 5.4 0 0 1 0-3.46V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59A8.96 8.96 0 0 0 9 0 9 9 0 0 0 .96 4.94l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("expired") === "true";
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuthStore();

  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    await signInWithGoogle();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(traduzErro(error));
        setLoading(false);
      } else {
        navigate("/app");
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(traduzErro(error));
        setLoading(false);
      } else {
        setSuccess("Verifique seu e-mail para confirmar o cadastro!");
        setLoading(false);
      }
    }
  }

  function traduzErro(msg: string): string {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos";
    if (msg.includes("already registered")) return "Este e-mail já está cadastrado";
    if (msg.includes("Password should be")) return "A senha precisa ter pelo menos 6 caracteres";
    if (msg.includes("rate limit")) return "Muitas tentativas. Aguarde alguns segundos";
    return msg;
  }

  return (
    <div style={{ background: "#07090d", minHeight: "100vh" }}
      className="flex items-center justify-center relative overflow-hidden px-4">

      {/* Grid de fundo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.03) 1px,transparent 1px)",
        backgroundSize: "50px 50px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)",
      }} />

      {/* Orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, top: "10%", left: "50%", x: "-50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#22d3ee", boxShadow: "0 0 30px rgba(34,211,238,0.4)" }}>
            <span style={{ color: "#000", fontWeight: 700, fontSize: 20 }}>E</span>
          </div>
          <h1 style={{ color: "#f0f4f8", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p style={{ color: "rgba(160,180,200,0.6)", fontSize: 14, marginTop: 4 }}>
            {mode === "login" ? "Entre para acessar suas finanças" : "Comece a organizar suas finanças"}
          </p>
          {sessionExpired && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl w-full"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
              <span style={{ fontSize: 16 }}>⏱</span>
              <p style={{ color: "#fbbf24", fontSize: 13 }}>
                Sua sessão expirou. Faça login novamente.
              </p>
            </motion.div>
          )}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.3),transparent)" }} />

          {/* Google button */}
          <motion.button
            onClick={handleGoogle}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 mb-4 font-medium text-sm transition-all"
            style={{ background: "#fff", color: "#1f2937", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}
          >
            <GoogleIcon />
            Continuar com Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(160,180,200,0.4)", fontSize: 11 }}>ou continue com e-mail</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="email" style={{ color: "rgba(160,180,200,0.6)", fontSize: 11, letterSpacing: "0.05em" }}
                className="uppercase font-mono block mb-1.5">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0f4f8" }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ color: "rgba(160,180,200,0.6)", fontSize: 11, letterSpacing: "0.05em" }}
                className="uppercase font-mono block mb-1.5">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0f4f8" }}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: "#f87171", fontSize: 12 }}>{error}</motion.p>
              )}
              {success && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: "#34d399", fontSize: 12 }}>{success}</motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl py-3 font-semibold text-sm mt-2"
              style={{
                background: "#22d3ee", color: "#000", border: "none",
                cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
                boxShadow: "0 0 20px rgba(34,211,238,0.25)",
              }}
            >
              {loading ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
            </motion.button>
          </form>
        </div>

        {/* Toggle mode */}
        <p className="text-center mt-6" style={{ color: "rgba(160,180,200,0.6)", fontSize: 14 }}>
          {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
            style={{ color: "#22d3ee", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
          >
            {mode === "login" ? "Criar conta" : "Fazer login"}
          </button>
        </p>

        <button onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-center"
          style={{ color: "rgba(160,180,200,0.4)", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>
          ← Voltar para o início
        </button>
      </motion.div>
    </div>
  );
}