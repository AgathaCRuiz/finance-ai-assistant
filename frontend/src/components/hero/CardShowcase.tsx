import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, TrendingUp, Shield, ChevronRight } from "lucide-react";
import CardSwap, { Card } from "./CardSwap";

export function CardShowcase() {
  return (
    <section 
      id="showcase" 
      className="relative px-6 py-24 overflow-hidden border-t border-white/[0.02]"
      style={{ background: "#05070a" }}
    >
      {/* Background soft ambient lights */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-[#00f5d4]/[0.02] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Editorial Presentation */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00f5d4]/5 border border-[#00f5d4]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span className="text-[10px] text-[#00f5d4] font-mono uppercase tracking-wider">
              Painéis Dinâmicos
            </span>
          </div>

          <h2 className="text-white text-3xl sm:text-4xl font-extralight tracking-tight leading-[1.15] font-display">
            Interaja com as suas finanças de forma tátil.
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed font-sans font-light">
            Alterne entre diferentes blocos analíticos passando o cursor do mouse ou tocando neles. Cada cartão revela uma dimensão diferente do seu ecossistema patrimonial em tempo real.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                <TrendingUp className="w-3 h-3 text-[#00f5d4]" />
              </div>
              <p className="text-xs text-zinc-300 font-light">
                <strong>Análise Direcionada:</strong> Visão clara de investimentos, despesas e recomendações automatizadas.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5">
                <Shield className="w-3 h-3 text-blue-400" />
              </div>
              <p className="text-xs text-zinc-300 font-light">
                <strong>Fortaleza de Dados:</strong> Cada visualização consome informações com criptografia de ponta a ponta.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The CardSwap Container */}
        <div className="lg:col-span-7 flex justify-center items-center h-[340px] relative overflow-visible">
          
          <div className="w-full max-w-[480px] h-[260px] relative">
            <CardSwap
              cardDistance={24}
              verticalDistance={24}
              delay={4500}
              pauseOnHover={true}
              width="100%"
              height="100%"
              skewAmount={1.5}
            >
              
              {/* Card 1: Patrimônio & Metas */}
              <Card className="w-full h-full bg-zinc-950/95 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f5d4]/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Evolução Patrimonial</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00f5d4] border border-[#00f5d4]/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                      Ativo
                    </span>
                  </div>

                  <h3 className="text-2xl font-light text-white tracking-tight leading-none mb-1">
                    R$ 142.840,25
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans font-light flex items-center gap-1">
                    <span className="text-emerald-400 font-semibold">+12.4%</span> em relação ao mês anterior
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-mono">
                      <span>Meta: Reserva de Emergência</span>
                      <span className="text-white">82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.02]">
                      <div className="h-full bg-gradient-to-r from-[#00f5d4] to-emerald-500 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/[0.04] pt-2">
                    <span>Edu Finance Premium</span>
                    <span className="flex items-center gap-1">Ver detalhes <ArrowUpRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Card>

              {/* Card 2: Inteligência Artificial (Edu AI) */}
              <Card className="w-full h-full bg-zinc-950/95 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Edu AI • Assistente</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      Online
                    </span>
                  </div>

                  {/* Chat interface layout preview */}
                  <div className="space-y-3">
                    <div className="bg-zinc-900/60 border border-white/[0.03] p-2.5 rounded-xl rounded-tl-none max-w-[85%] text-[11px] text-zinc-300 font-light leading-relaxed">
                      "Edu, qual o impacto se eu economizar 10% adicionais este mês?"
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 p-2.5 rounded-xl rounded-tr-none max-w-[90%] self-end ml-auto text-[11px] text-zinc-300 font-light leading-relaxed">
                      "Seu patrimônio estimado crescerá mais <span className="text-blue-400 font-semibold">R$ 1.200</span> em 12 meses, aproximando sua meta de viagem em 3 meses!"
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/[0.04] pt-2 mt-2">
                  <span>Análise Preditiva</span>
                  <span className="flex items-center gap-1">Abrir chat <ChevronRight className="w-3 h-3" /></span>
                </div>
              </Card>

              {/* Card 3: Alocação & Cripto ativos */}
              <Card className="w-full h-full bg-zinc-950/95 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Distribuição de Ativos</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Balanço Cripto
                    </span>
                  </div>

                  {/* Asset Allocation progress bars */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-300 font-light">Renda Fixa (CDI)</span>
                      <span className="text-zinc-400 font-mono">60%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "60%" }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-zinc-300 font-light">Ações & FIIs</span>
                      <span className="text-zinc-400 font-mono">25%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00E5FF] rounded-full" style={{ width: "25%" }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-zinc-300 font-light">Ativos Alternativos (Cripto)</span>
                      <span className="text-zinc-400 font-mono">15%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/[0.04] pt-2 mt-2">
                  <span>Equilíbrio Perfeito</span>
                  <span>Ver carteira ↗</span>
                </div>
              </Card>

            </CardSwap>
          </div>

        </div>

      </div>
    </section>
  );
}

export default CardShowcase;
