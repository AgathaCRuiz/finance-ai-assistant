import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Calendar as CalendarIcon,
  Users,
  Clock,
  BarChart2,
  Settings,
  Search,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Layers,
  Activity,
  Plus
} from "lucide-react";

export default function AestheticDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-visible"
    >
      {/* GLOWS PRECISOS DO CARD (Igual à imagem - verde-menta à esquerda, rosa/roxo à direita) */}
      <div 
        className="absolute pointer-events-none opacity-40 mix-blend-screen"
        style={{
          inset: "-60px",
          borderRadius: "40px",
          background: "radial-gradient(circle at 10% 30%, rgba(0, 245, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 90% 40%, rgba(244, 63, 94, 0.35) 0%, transparent 50%)",
          filter: "blur(60px)",
          zIndex: 0
        }} 
      />

      {/* BORDA ELEGANTE DE NEON/GRADIENTE (Igual à imagem) */}
      <div 
        className="absolute pointer-events-none mix-blend-screen opacity-80"
        style={{
          inset: "-1.5px",
          borderRadius: "17px",
          background: "linear-gradient(135deg, rgba(0, 245, 212, 0.6) 0%, rgba(0, 229, 255, 0.1) 30%, rgba(244, 63, 94, 0.1) 70%, rgba(244, 63, 94, 0.5) 100%)",
          zIndex: 0
        }} 
      />

      {/* DASHBOARD CARD CONTAINER */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-[#06080d]/95 text-zinc-300 flex flex-col z-10"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 30px 70px rgba(0,0,0,0.8)"
        }}
      >
        {/* TOP SIMULATED WINDOW HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#090c13]/80">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 bg-black/40 border border-white/[0.05] px-4 py-1 rounded-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
            app.aurix.ai/dashboard
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        </div>

        {/* MAIN BODY LAYOUT */}
        <div className="flex flex-1 overflow-hidden h-[460px]">
          
          {/* 1. LEFT SIDEBAR */}
          <div className="w-48 bg-[#04060a]/90 border-r border-white/[0.04] p-4 flex flex-col justify-between hidden md:flex">
            <div className="space-y-6">
              {/* App Identity */}
              <div className="flex items-center gap-2.5 px-2 py-1">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-black font-black text-xs"
                  style={{
                    background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 100%)",
                    boxShadow: "0 0 15px rgba(0, 245, 212, 0.7)"
                  }}
                >
                  A
                </div>
                <span className="text-white font-semibold text-sm tracking-wide font-display">Aurix</span>
              </div>

              {/* Menu Navigation */}
              <div className="space-y-0.5">
                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest px-2 mb-2">Platform</div>
                
                <SidebarItem icon={<LayoutDashboard className="w-3.5 h-3.5 text-[#00f5d4]" />} label="Dashboard" active />
                <SidebarItem icon={<Briefcase className="w-3.5 h-3.5" />} label="Projects" />
                <SidebarItem icon={<CheckSquare className="w-3.5 h-3.5" />} label="Tasks" />
                <SidebarItem icon={<CalendarIcon className="w-3.5 h-3.5" />} label="Calendar" />
                <SidebarItem icon={<Users className="w-3.5 h-3.5" />} label="Team" />
                <SidebarItem icon={<Clock className="w-3.5 h-3.5" />} label="Time Tracking" />
                <SidebarItem icon={<BarChart2 className="w-3.5 h-3.5" />} label="Reports" />
                <SidebarItem icon={<Settings className="w-3.5 h-3.5" />} label="Settings" />
              </div>
            </div>

            {/* Profile widget at bottom of sidebar */}
            <div className="flex items-center gap-2.5 border-t border-white/[0.04] pt-3 mt-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Jane Cooper"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00f5d4] border border-[#06080d]" />
              </div>
              <div className="truncate flex-1">
                <p className="text-[11px] font-medium text-white truncate">Jane Cooper</p>
                <p className="text-[9px] text-zinc-500 truncate">jane@example.com</p>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE AREA (MAIN DASHBOARD CONTENT) */}
          <div className="flex-1 p-5 md:p-6 overflow-hidden space-y-6">
            
            {/* Header / Overview Title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-white tracking-tight font-display">Overview</h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Updated just now</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] font-light text-zinc-400 cursor-pointer hover:bg-white/[0.04] transition-colors">
                <span>This Week</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard title="Total Projects" value="24" change="+12%" label="from last week" positive />
              <MetricCard title="Tasks Completed" value="78%" change="+8%" label="from last week" positive />
              <MetricCard title="Team Performance" value="92%" change="+5%" label="from last week" positive />
              <MetricCard title="Hours Tracked" value="120h" change="+15%" label="from last week" positive />
            </div>

            {/* Active Projects Table & Progress */}
            <div className="bg-[#090c13]/40 border border-white/[0.04] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-white uppercase tracking-wider block">Active Projects</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.03] text-zinc-500 font-normal">
                      <th className="pb-2 font-normal">Project</th>
                      <th className="pb-2 font-normal">Deadline</th>
                      <th className="pb-2 font-normal">Team</th>
                      <th className="pb-2 font-normal text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.01]">
                    <ProjectRow
                      name="Aurix SaaS Redesign"
                      date="Jun 28, 2024"
                      progress={75}
                      color="bg-[#00f5d4]"
                      team={["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=30&h=30&q=80"]}
                    />
                    <ProjectRow
                      name="Mobile App Development"
                      date="Jul 5, 2024"
                      progress={60}
                      color="bg-cyan-400"
                      team={["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=30&h=30&q=80"]}
                    />
                    <ProjectRow
                      name="Marketing Campaign"
                      date="Jul 12, 2024"
                      progress={45}
                      color="bg-zinc-400"
                      team={["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=30&h=30&q=80"]}
                    />
                    <ProjectRow
                      name="AI Integration Project"
                      date="Aug 1, 2024"
                      progress={30}
                      color="bg-zinc-400"
                      team={["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=30&h=30&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=30&h=30&q=80"]}
                    />
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-1">
                <a href="#projects" className="text-[10px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1 font-mono">
                  View all projects <span className="text-[#00f5d4]">&gt;</span>
                </a>
              </div>
            </div>

            {/* Project Activity Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <ActivityCard title="Design System Update" author="By Jane Cooper" time="2h ago" />
              <ActivityCard title="API Integration" author="By Dev Team" time="5h ago" />
              <ActivityCard title="User Research" author="By Robert Fox" time="1d ago" />
              <ActivityCard title="Testing & QA" author="By QA Team" time="1d ago" />
            </div>

            {/* Revenue & Transactions row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Revenue Line Chart */}
              <div className="lg:col-span-7 bg-[#090c13]/40 border border-white/[0.04] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Revenue Overview</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#00f5d4]" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-light text-white font-display">$632,483.26</span>
                    <span className="text-[9px] text-[#00f5d4] font-mono font-semibold bg-[#00f5d4]/10 px-1.5 py-0.5 rounded-full">+18.2%</span>
                  </div>
                </div>

                {/* Highly High-Fidelity Custom SVG Area Chart */}
                <div className="relative h-28 w-full mt-2 flex flex-col justify-end">
                  <svg className="w-full h-full text-[#00f5d4]" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 90 Q 15 80 30 75 T 45 60 T 60 40 T 75 55 T 90 25 T 100 20 L 100 100 L 0 100 Z" fill="url(#revGrad)" stroke="none" />
                    <path d="M 0 90 Q 15 80 30 75 T 45 60 T 60 40 T 75 55 T 90 25 T 100 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Glowing dots */}
                    <circle cx="90" cy="25" r="2.5" fill="#fff" stroke="#00f5d4" strokeWidth="1" />
                    <circle cx="60" cy="40" r="2" fill="#fff" stroke="#00f5d4" strokeWidth="1" />
                  </svg>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-600 border-t border-white/[0.02] pt-1">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-5 bg-[#090c13]/40 border border-white/[0.04] rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">Recent Transactions</span>
                
                <div className="space-y-2">
                  <TransactionRow name="Subscription Plan" value="+$480.00" positive />
                  <TransactionRow name="Team Upgrade" value="-$120.00" />
                  <TransactionRow name="Add-on Services" value="+$75.00" positive />
                  <TransactionRow name="API Access" value="+$200.00" positive />
                </div>
              </div>

            </div>

          </div>

          {/* 3. RIGHT SIDEBAR (MESSAGES PANEL) */}
          <div className="w-56 bg-[#04060a]/40 border-l border-white/[0.04] p-4 flex flex-col justify-between hidden lg:flex">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white tracking-wide font-display">Messages</span>
                <span className="text-[9px] font-mono text-[#00f5d4] font-semibold bg-[#00f5d4]/10 px-1.5 py-0.5 rounded-full">New</span>
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  disabled
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-md pl-7 pr-3 py-1 text-[10px] text-zinc-400 placeholder-zinc-600"
                />
              </div>

              {/* Message Feed */}
              <div className="space-y-3">
                <MessageItem
                  name="Sarah Mitchell"
                  msg="Looks great! Let's move this"
                  time="2m ago"
                  unread
                  avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=30&h=30&q=80"
                />
                <MessageItem
                  name="Dev Team"
                  msg="Project update: API integration..."
                  time="10m ago"
                  avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=30&h=30&q=80"
                />
                <MessageItem
                  name="Jane Cooper"
                  msg="Can we sync up later today?"
                  time="1h ago"
                  avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=30&h=30&q=80"
                />
                <MessageItem
                  name="Robert Fox"
                  msg="Shared a file with you."
                  time="2h ago"
                  avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=30&h=30&q=80"
                />
                <MessageItem
                  name="Marketing Team"
                  msg="New campaign brief is ready."
                  time="3h ago"
                  avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=30&h=30&q=80"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.04] text-center">
              <a href="#messages" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-mono">
                View all messages &gt;
              </a>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}

/* ───────────────────── SUB-COMPONENTS ───────────────────── */

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-light tracking-wide cursor-pointer transition-colors ${
        active 
          ? "bg-white/[0.04] text-white font-medium" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <span 
          className="w-1.5 h-1.5 rounded-full ml-auto" 
          style={{ 
            background: "#00f5d4", 
            boxShadow: "0 0 8px #00f5d4" 
          }} 
        />
      )}
    </div>
  );
}

function MetricCard({ title, value, change, label, positive = true }: { title: string; value: string; change: string; label: string; positive?: boolean }) {
  return (
    <div className="bg-[#090c13]/40 border border-white/[0.04] rounded-xl p-3.5 space-y-1 hover:border-white/[0.08] transition-colors">
      <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider block">{title}</span>
      <h4 className="text-base font-light text-white font-display">{value}</h4>
      <div className="flex items-center gap-1 text-[9px]">
        <span className={positive ? "text-[#00f5d4] font-semibold" : "text-zinc-500 font-semibold"}>{change}</span>
        <span className="text-zinc-600 font-light">{label}</span>
      </div>
    </div>
  );
}

function ProjectRow({ name, date, progress, color, team }: { name: string; date: string; progress: number; color: string; team: string[] }) {
  // Map standard Tailwind colors to premium neon tube gradients and rich glowing shadows
  const isCyan = color.includes('#00f5d4') || color.includes('cyan');
  const barStyle = isCyan 
    ? {
        background: "linear-gradient(90deg, #00f5d4 0%, #00E5FF 100%)",
        boxShadow: "0 0 10px rgba(0, 245, 212, 0.9), 0 0 4px rgba(255, 255, 255, 0.9)"
      }
    : {
        background: "linear-gradient(90deg, #818cf8 0%, #c084fc 100%)",
        boxShadow: "0 0 8px rgba(129, 140, 248, 0.6), 0 0 3px rgba(255, 255, 255, 0.8)"
      };

  return (
    <tr className="hover:bg-white/[0.01] transition-colors">
      <td className="py-2.5 font-light text-white text-xs">{name}</td>
      <td className="py-2.5 text-zinc-500 font-mono text-[10px]">{date}</td>
      <td className="py-2.5">
        <div className="flex -space-x-1.5">
          {team.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="team"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full border border-[#06080d] object-cover"
            />
          ))}
        </div>
      </td>
      <td className="py-2.5">
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-1.5 bg-white/[0.03] rounded-full relative overflow-visible">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${progress}%`,
                ...barStyle
              }} 
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 w-6 text-right">{progress}%</span>
        </div>
      </td>
    </tr>
  );
}

function ActivityCard({ title, author, time }: { title: string; author: string; time: string }) {
  return (
    <div className="bg-white/[0.01] border border-white/[0.03] rounded-lg p-2.5 space-y-1">
      <h5 className="text-[10px] text-zinc-300 font-light truncate leading-tight">{title}</h5>
      <div className="flex justify-between items-center text-[9px] text-zinc-600">
        <span>{author}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

function TransactionRow({ name, value, positive = false }: { name: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/[0.02]">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${positive ? "bg-[#00f5d4]" : "bg-red-500/70"}`} />
        <span className="text-[10px] font-light text-zinc-300">{name}</span>
      </div>
      <span className={`text-[10px] font-mono ${positive ? "text-[#00f5d4]" : "text-rose-500/80"}`}>{value}</span>
    </div>
  );
}

function MessageItem({ name, msg, time, unread = false, avatar }: { name: string; msg: string; time: string; unread?: boolean; avatar: string }) {
  return (
    <div className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <div className="relative shrink-0">
        <img
          src={avatar}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-6 h-6 rounded-full object-cover border border-white/5"
        />
        {unread && (
          <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#00f5d4] border border-[#06080d]" />
        )}
      </div>
      <div className="truncate flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-white truncate">{name}</span>
          <span className="text-[8px] text-zinc-600 font-mono shrink-0">{time}</span>
        </div>
        <p className="text-[9px] text-zinc-500 truncate group-hover:text-zinc-400 transition-colors mt-0.5">{msg}</p>
      </div>
    </div>
  );
}
