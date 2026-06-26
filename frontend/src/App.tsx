import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/appshell";
import { HomePage } from "@/pages/blog/homepage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// Se usuário já está logado e cai na home/login, manda pro app
function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();
  if (loading) return null;
  if (session) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export function App() {
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<RedirectIfAuthed><HomePage /></RedirectIfAuthed>} />
        <Route path="/login"  element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
        <Route path="/app/*"  element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}