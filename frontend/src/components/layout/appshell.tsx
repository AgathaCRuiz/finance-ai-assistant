import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ChatWindow } from "@/components/chat/chatwindow";
import { DashboardPage } from "@/pages/dashboardpage";
import { useInvestorProfile } from "@/hooks/useinvestorprofile";
import { useChatStore } from "@/store/chatStore";

export function AppShell() {
  const { data } = useInvestorProfile();
  const isStreaming = useChatStore((s) => s.isStreaming);
  const navigate = useNavigate();
  const location = useLocation();
  const isDash = location.pathname === "/dashboard";

  return (
    <div style={{ background: "var(--bg-base)" }} className="flex h-screen w-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar onDashboard={() => navigate(isDash ? "/" : "/dashboard")} isDashboard={isDash} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          investorName={data?.perfil.nome}
          isStreaming={isStreaming}
          isDashboard={isDash}
          onToggleDashboard={() => navigate(isDash ? "/" : "/dashboard")}
        />
        {/* main: chat = overflow hidden (scroll interno), dashboard = overflow-y auto */}
        <main className={`flex-1 min-h-0 ${isDash ? "overflow-y-auto scrollbar-thin" : "overflow-hidden"}`}>
          <Routes>
            <Route path="/" element={<ChatWindow investorName={data?.perfil.nome} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}