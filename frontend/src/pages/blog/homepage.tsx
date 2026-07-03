/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Navbar }           from "@/components/hero/Navbar";
import { HeroSection }      from "@/components/hero/HeroSection";
import { DashboardSection } from "@/components/hero/DashboardSection";
import { Features }         from "@/components/hero/Features";
import { CardShowcase }     from "@/components/hero/CardShowcase";
import { TechLoop }         from "@/components/hero/TechLoop";
import { CTASection }       from "@/components/hero/CtaSection";
import { Footer }           from "@/components/hero/Footer";
import Particles            from "@/components/hero/Particles";

export function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-[#020408] text-zinc-100 font-sans overflow-x-hidden selection:bg-[#00f5d4]/30 selection:text-white">
      {/* Dynamic Background Particles Canvas for Hero */}
      <div className="absolute inset-0 w-full h-[120vh] z-0 pointer-events-none overflow-hidden">
        <Particles
          particleColors={["#00f5d4", "#00E5FF", "#ffffff", "#3b82f6", "#0df2bc"]}
          particleCount={250}
          particleSpread={12}
          speed={0.065}
          particleBaseSize={95}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
          className="opacity-75"
        />
        {/* Shadow and glow layers for high-contrast HUD readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(2,4,8,0.75)_50%,rgba(2,4,8,0.98)_90%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020408] pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <DashboardSection />
        <Features />
        <CardShowcase />
        <TechLoop />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
import { 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Coins, 
  ChevronRight, 
  Star, 
  Sliders, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowUpDown, 
  MousePointerClick, 
  BarChart3, 
  Layers,
  HelpCircle,
  Sparkles,
  Search,
  Lock,
  Globe2
} from 'lucide-react';
import Antigravity from "@/components/hero/Antigravity";
import BorderGlow from "@/components/hero/BorderGlow";

// Types for cryptos
interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  iconColor: string;
  amount: string;
  valueEur: string;
}

export function AppView() {
  // Particle parameters (tuned to the beautiful emerald/mint theme)
  const [count, setCount] = useState<number>(380);
  const [magnetRadius, setMagnetRadius] = useState<number>(10);
  const [ringRadius, setRingRadius] = useState<number>(9);
  const [waveSpeed, setWaveSpeed] = useState<number>(0.5);
  const [waveAmplitude, setWaveAmplitude] = useState<number>(1.2);
  const [particleSize, setParticleSize] = useState<number>(1.5);
  const [lerpSpeed, setLerpSpeed] = useState<number>(0.07);
  const [color, setColor] = useState<string>('#00f5d4'); // Bluish teal/turquoise from image
  const [autoAnimate, setAutoAnimate] = useState<boolean>(true);
  const [particleVariance, setParticleVariance] = useState<number>(1.3);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.1);
  const [depthFactor, setDepthFactor] = useState<number>(1.1);
  const [pulseSpeed, setPulseSpeed] = useState<number>(3.0);
  const [particleShape, setParticleShape] = useState<'capsule' | 'sphere' | 'box' | 'tetrahedron'>('capsule');
  const [fieldStrength, setFieldStrength] = useState<number>(14);

  // SaaS Interactivity States
  const [swapAmount, setSwapAmount] = useState<string>('0.00181682');
  const [swapTarget, setSwapTarget] = useState<string>('193.46');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '7D' | '1M' | '1Y'>('1D');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customizer'>('dashboard');

  // Trigger temporary notification
  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Mock crypto list matching SaaS theme
  const [assets, setAssets] = useState<CryptoAsset[]>([
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: '€61,425.80', change: '+2.4%', isPositive: true, iconColor: 'bg-amber-500/20 text-amber-400', amount: '0.354 BTC', valueEur: '€21,744.73' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: '€3,120.40', change: '+5.1%', isPositive: true, iconColor: 'bg-indigo-500/20 text-indigo-400', amount: '1.20 ETH', valueEur: '€3,744.48' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', price: '€142.15', change: '-1.2%', isPositive: false, iconColor: 'bg-purple-500/20 text-purple-400', amount: '12.5 SOL', valueEur: '€1,776.87' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', price: '€0.92', change: '0.0%', isPositive: true, iconColor: 'bg-emerald-500/20 text-emerald-400', amount: '500 USDT', valueEur: '€460.00' }
  ]);

  // Chart values map for simulation
  const chartData: Record<'1D' | '7D' | '1M' | '1Y', number[]> = {
    '1D': [18200, 19100, 18900, 19800, 20400, 21200, 22193.05],
    '7D': [16500, 17800, 19200, 18400, 20100, 21500, 22193.05],
    '1M': [14000, 16200, 15900, 17500, 19800, 21100, 22193.05],
    '1Y': [9800, 12400, 14200, 13100, 17500, 20200, 22193.05]
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(swapAmount) <= 0 || isNaN(parseFloat(swapAmount))) {
      triggerToast('Insira um valor válido de swap.');
      return;
    }
    
    setIsSwapping(true);
    triggerToast('Iniciando transação criptográfica quântica...');
    
    // Temporarily disrupt physics background during transaction to show interactivity
    const prevFieldStrength = fieldStrength;
    const prevWaveSpeed = waveSpeed;
    const prevColor = color;
    
    setFieldStrength(24); // strong compression
    setWaveSpeed(2.5); // rapid waves
    setColor('#00F5FF'); // shift to cyan during execution

    setTimeout(() => {
      setIsSwapping(false);
      setFieldStrength(prevFieldStrength);
      setWaveSpeed(prevWaveSpeed);
      setColor(prevColor);
      
      // Update balance
      triggerToast('Swap realizado com sucesso! Transação confirmada na blockchain.');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080a0c] text-zinc-100 font-sans overflow-x-hidden selection:bg-[#00f5d4]/30 selection:text-white">
      
      {/* Dynamic Background Particles Canvas */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <Antigravity
          count={count}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          color={color}
          autoAnimate={autoAnimate}
          particleVariance={particleVariance}
          rotationSpeed={rotationSpeed}
          depthFactor={depthFactor}
          pulseSpeed={pulseSpeed}
          particleShape={particleShape}
          fieldStrength={fieldStrength}
        />
        {/* Complex SaaS Lighting/Shadow Layer for maximum readability and matching the original mockup glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_10%,rgba(8,10,12,0.65)_50%,rgba(8,10,12,0.94)_90%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a0c]/60 via-transparent to-[#080a0c] pointer-events-none" />
      </div>



      {/* Professional SaaS Header */}
      <header className="relative z-50 border-b border-zinc-900/80 bg-[#080a0c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brandmark */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5d4] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#00f5d4]/20">
              <span className="font-display font-black text-black text-lg select-none">C</span>
              {/* Dynamic orbit dot */}
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00F5FF] border border-[#080a0c] animate-pulse" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Cryptix
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-[#00f5d4] transition-colors">Why Cryptix?</a>
            <a href="#dashboard-section" className="hover:text-[#00f5d4] transition-colors">Crypto</a>
            <a href="#how-it-works" className="hover:text-[#00f5d4] transition-colors">How it works</a>
            <a href="#faq" className="hover:text-[#00f5d4] transition-colors">FAQ</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => triggerToast('Acesso ao sandbox ativado.')}
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Login
            </button>
            <a
              href="#dashboard-section"
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-black transition-all active:scale-95 duration-300"
              style={{
                background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 100%)",
                boxShadow: "0 0 15px rgba(0, 245, 212, 0.45)"
              }}
            >
              Create account
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-900 bg-[#080a0c] px-6 py-6 space-y-4"
            >
              <nav className="flex flex-col gap-4 text-sm font-medium text-zinc-400">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#00f5d4] transition-colors"
                >
                  Why Cryptix?
                </a>
                <a 
                  href="#dashboard-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#00f5d4] transition-colors"
                >
                  Crypto
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#00f5d4] transition-colors"
                >
                  How it works
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#00f5d4] transition-colors"
                >
                  FAQ
                </a>
              </nav>
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-4">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerToast('Acesso ao login.');
                  }}
                  className="text-sm font-medium text-zinc-300 hover:text-white w-full text-center"
                >
                  Login
                </button>
                <a
                  href="#dashboard-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-black"
                  style={{
                    background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 100%)",
                    boxShadow: "0 0 15px rgba(0, 245, 212, 0.45)"
                  }}
                >
                  Create account
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating System Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-xl border border-[#00f5d4]/30 bg-zinc-950/90 backdrop-blur-md shadow-2xl text-xs font-medium text-teal-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#00f5d4] animate-pulse" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-16">
        
        {/* Dynamic Header Badge */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/40 border border-teal-500/20 text-[#00f5d4] text-xs font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
            <span>Cryptix Engine v2.0 • WebGL Orbiters Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.08] mb-6"
          >
            Take Control of <br />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-[#00f5d4] bg-clip-text text-transparent">
              Your Digital Assets
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mb-8"
          >
            Cryptix offers a seamless, secure experience for managing your digital assets. Instant transactions, optimized fees, and premium design.
          </motion.p>

          {/* Action Button matching the mockup precisely */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <a
              href="#dashboard-section"
              className="px-8 py-3.5 rounded-full text-black font-bold text-sm flex items-center gap-2 group transition-all duration-300 active:scale-[0.98] relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 50%, #2563eb 100%)",
                boxShadow: "0 0 25px rgba(0, 245, 212, 0.5), 0 0 50px rgba(0, 229, 255, 0.2)"
              }}
            >
              {/* Highlight flare overlay on hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <span>Get started</span>
                <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </motion.div>

          {/* "They trust us" rating section from image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center flex-col gap-2"
          >
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">They trust us</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#00f5d4] fill-[#00f5d4]" />
              ))}
              <span className="text-xs font-bold text-zinc-300 ml-2">4.9, G</span>
            </div>
          </motion.div>
        </div>

        {/* INTERACTIVE DEMO SYSTEM & WORKBENCH */}
        <section id="dashboard-section" className="relative z-20 mt-8 mb-24">
          
          {/* Main Dashboard Wrapper */}
          <div className="w-full max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-[#090b0d]/75 backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Top Interactive Tabs inside Dashboard Card */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/40">
              
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`relative py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                    activeTab === 'dashboard' ? 'text-[#00f5d4]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Live Trading Dashboard
                  {activeTab === 'dashboard' && (
                    <motion.div 
                      layoutId="tab-active" 
                      className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[#00f5d4]" 
                      style={{ boxShadow: "0 0 10px #00f5d4, 0 0 3px #00E5FF" }}
                    />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('customizer')}
                  className={`relative py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                    activeTab === 'customizer' ? 'text-[#00f5d4]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Particle Physics Sandbox
                  {activeTab === 'customizer' && (
                    <motion.div 
                      layoutId="tab-active" 
                      className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[#00f5d4]" 
                      style={{ boxShadow: "0 0 10px #00f5d4, 0 0 3px #00E5FF" }}
                    />
                  )}
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping" />
                <span className="hidden sm:inline">Quantum Engine Online</span>
              </div>
            </div>

            {/* TAB 1: TRADING DASHBOARD MOCKUP */}
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  
                  {/* Left Column: Asset Growth & Chart */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Growth statistics card */}
                    <div className="p-6 rounded-2xl bg-[#0d0f12] border border-zinc-800/80 relative overflow-hidden">
                      {/* Subtle green ambient light inside card */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f5d4]/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-zinc-500 font-medium">Balance</span>
                          <h2 className="text-3xl font-display font-light text-white mt-1">
                            €22,193.05
                            <span className="text-sm font-semibold text-[#00f5d4] ml-2 font-mono">
                              +47.3%
                            </span>
                          </h2>
                        </div>
                        
                        {/* Timeframe selector */}
                        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800/60 text-xs font-mono">
                          {(['1D', '7D', '1M', '1Y'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setActiveTimeframe(t);
                                triggerToast(`Exibindo gráfico: período de ${t}.`);
                              }}
                              className={`px-2 py-1 rounded transition-colors ${
                                activeTimeframe === t 
                                  ? 'bg-zinc-800 text-white font-bold' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Dynamic SVG Line Chart mimicking high-end terminal graphics */}
                      <div className="h-44 w-full mt-6 relative flex items-end">
                        
                        {/* Interactive gridlines */}
                        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-25">
                          <div className="border-b border-dashed border-zinc-800 w-full" />
                          <div className="border-b border-dashed border-zinc-800 w-full" />
                          <div className="border-b border-dashed border-zinc-800 w-full" />
                        </div>

                        {/* Chart Line Representation */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Closed polygon for area gradient */}
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                            d={`M 0 120 
                               L 0 ${120 - (chartData[activeTimeframe][0] / 250)} 
                               L 66 ${120 - (chartData[activeTimeframe][1] / 250)} 
                               L 133 ${120 - (chartData[activeTimeframe][2] / 250)} 
                               L 200 ${120 - (chartData[activeTimeframe][3] / 250)} 
                               L 266 ${120 - (chartData[activeTimeframe][4] / 250)} 
                               L 333 ${120 - (chartData[activeTimeframe][5] / 250)} 
                               L 400 ${120 - (chartData[activeTimeframe][6] / 250)} 
                               L 400 120 Z`}
                            fill="url(#chart-glow)"
                          />

                          {/* Outer Line */}
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            d={`M 0 ${120 - (chartData[activeTimeframe][0] / 250)} 
                                L 66 ${120 - (chartData[activeTimeframe][1] / 250)} 
                                L 133 ${120 - (chartData[activeTimeframe][2] / 250)} 
                                L 200 ${120 - (chartData[activeTimeframe][3] / 250)} 
                                L 266 ${120 - (chartData[activeTimeframe][4] / 250)} 
                                L 333 ${120 - (chartData[activeTimeframe][5] / 250)} 
                                L 400 ${120 - (chartData[activeTimeframe][6] / 250)}`}
                            fill="none"
                            stroke="#00f5d4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Pulsing focal point dot */}
                          <circle
                            cx="400"
                            cy={120 - (chartData[activeTimeframe][6] / 250)}
                            r="4"
                            fill="#00f5d4"
                            className="animate-pulse"
                          />
                        </svg>

                        {/* Interactive floating indicator */}
                        <div className="absolute right-0 top-1.5 p-1 px-2 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono text-[#00f5d4] flex items-center gap-1 select-none">
                          <TrendingUp className="w-3 h-3" />
                          <span>MÁXIMO HISTÓRICO ALCANÇADO</span>
                        </div>
                      </div>

                    </div>

                    {/* Cryptix Real-time Assets Table */}
                    <div className="p-6 rounded-2xl bg-[#0d0f12] border border-zinc-800/80">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase font-mono">Portfolio Assets</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Preços em Tempo Real</span>
                      </div>
                      
                      <div className="space-y-3.5">
                        {assets.map((asset) => (
                          <div 
                            key={asset.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${asset.iconColor}`}>
                                {asset.symbol}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white group-hover:text-[#00f5d4] transition-colors">{asset.name}</h4>
                                <span className="text-[10px] text-zinc-500 font-mono">{asset.symbol} • Preço: {asset.price}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-xs font-bold block text-white">{asset.valueEur}</span>
                              <span className={`text-[10px] font-mono ${asset.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {asset.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Quick Swap Interactivity */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Custom Swap Module matching original exactly */}
                    <form onSubmit={handleSwap} className="p-6 rounded-2xl bg-[#0d0f12] border border-zinc-800/80 flex flex-col h-full relative">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-[#00f5d4]" />
                        Quick swap
                      </h3>

                      {/* Sell Input Card */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5 relative">
                        <span className="text-[10px] font-mono text-zinc-500 block">SELL</span>
                        <div className="flex items-center justify-between gap-4">
                          <input
                            type="text"
                            value={swapAmount}
                            onChange={(e) => {
                              setSwapAmount(e.target.value);
                              const parsed = parseFloat(e.target.value);
                              if (!isNaN(parsed)) {
                                setSwapTarget((parsed * 106480).toFixed(2));
                              }
                            }}
                            className="bg-transparent text-white font-mono text-sm focus:outline-none w-full"
                          />
                          <span className="text-xs font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono">BTC</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 block">Balance: 0.01742682 BTC</span>
                      </div>

                      {/* Decorative central exchange trigger icon */}
                      <div className="my-2.5 flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 hover:border-[#00f5d4] transition-colors flex items-center justify-center cursor-pointer shadow-lg active:scale-90">
                          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                      </div>

                      {/* Buy Input Card */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1.5 relative">
                        <span className="text-[10px] font-mono text-zinc-500 block">BUY</span>
                        <div className="flex items-center justify-between gap-4">
                          <input
                            type="text"
                            value={swapTarget}
                            readOnly
                            className="bg-transparent text-zinc-400 font-mono text-sm focus:outline-none w-full"
                          />
                          <span className="text-xs font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono">USDT</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 block">Balance: 500 USDT</span>
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          type="submit"
                          disabled={isSwapping}
                          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 text-black active:scale-[0.98] border border-transparent"
                          style={
                            isSwapping
                              ? {
                                  background: "#27272a",
                                  color: "#71717a",
                                  cursor: "not-allowed"
                                }
                              : {
                                  background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 100%)",
                                  boxShadow: "0 0 20px rgba(0, 245, 212, 0.45)"
                                }
                          }
                        >
                          {isSwapping ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <span className="font-bold">Visualize swap</span>
                              <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3px]" />
                            </>
                          )}
                        </button>
                      </div>

                    </form>

                    {/* SaaS Platform Stats Card */}
                    <div className="p-6 rounded-2xl bg-[#0d0f12] border border-zinc-800/80 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f5d4] to-[#00F5FF]" />
                      <h4 className="text-xs font-bold text-zinc-300 mb-4 font-mono">SYSTEM TELEMETRY</h4>
                      
                      <div className="space-y-4 text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Block Confirmation</span>
                          <span className="text-white font-bold">~ 2.4 sec</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Transaction Fee</span>
                          <span className="text-[#00f5d4] font-bold">€0.04 (Optimized)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Crypto Liquidity</span>
                          <span className="text-white font-bold">Infinite pool</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Security Layer</span>
                          <span className="text-white font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            AES-256
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 2: LIVE PARTICLES CUSTOMIZER PANEL */}
              {activeTab === 'customizer' && (
                <motion.div
                  key="customizer-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  
                  {/* Left Column Controls */}
                  <div className="space-y-5">
                    
                    {/* Geometrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400 font-mono">Geometria</label>
                        <select
                          value={particleShape}
                          onChange={(e) => setParticleShape(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#00f5d4] font-mono"
                        >
                          <option value="capsule">Cápsula (Capsule)</option>
                          <option value="sphere">Esfera (Sphere)</option>
                          <option value="box">Cubo (Box)</option>
                          <option value="tetrahedron">Tetraedro</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400 font-mono">Simulação de Vórtice</label>
                        <button
                          type="button"
                          onClick={() => setAutoAnimate(!autoAnimate)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                            autoAnimate 
                              ? 'bg-teal-950/20 border-[#00f5d4]/40 text-[#00f5d4]' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span>{autoAnimate ? 'Auto-Orbit' : 'Apenas Mouse'}</span>
                          <span className="w-2 h-2 rounded-full bg-[#00f5d4]" />
                        </button>
                      </div>
                    </div>

                    {/* Color Presets */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 font-mono">Cor do Vórtice de Fundo</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { val: '#00f5d4', name: 'Cyber Cyan' },
                          { val: '#00F5FF', name: 'Neon Blue' },
                          { val: '#FF9FFC', name: 'Cosmic Pink' },
                          { val: '#5227FF', name: 'Royal Purple' },
                          { val: '#FFB800', name: 'Amber Glow' }
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => {
                              setColor(c.val);
                              triggerToast(`Cor do campo alterada para: ${c.name}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                              color === c.val 
                                ? 'bg-zinc-900 border-zinc-200 text-white' 
                                : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.val }} />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className="border-zinc-800/60" />

                    {/* Count */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Densidade de Partículas</span>
                        <span className="text-[#00f5d4] font-bold">{count}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="500"
                        step="10"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                    {/* Magnet Radius */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Raio de Influência (Magnet)</span>
                        <span className="text-[#00f5d4] font-bold">{magnetRadius} units</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="20"
                        step="0.5"
                        value={magnetRadius}
                        onChange={(e) => setMagnetRadius(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                  </div>

                  {/* Right Column Controls */}
                  <div className="space-y-5">
                    
                    {/* Ring Radius */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Raio do Limiar de Órbita</span>
                        <span className="text-[#00f5d4] font-bold">{ringRadius} units</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="16"
                        step="0.5"
                        value={ringRadius}
                        onChange={(e) => setRingRadius(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                    {/* Field Strength */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Compressão do Campo Gravitacional</span>
                        <span className="text-[#00f5d4] font-bold">{fieldStrength}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="24"
                        step="1"
                        value={fieldStrength}
                        onChange={(e) => setFieldStrength(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                    {/* Lerp Speed */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Suavidade de Resposta (Lerp)</span>
                        <span className="text-[#00f5d4] font-bold">{(lerpSpeed * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.25"
                        step="0.01"
                        value={lerpSpeed}
                        onChange={(e) => setLerpSpeed(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                    {/* Wave Amplitude */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Ondulação Periódica</span>
                        <span className="text-[#00f5d4] font-bold">{waveAmplitude.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={waveAmplitude}
                        onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#00f5d4]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-[11px] font-sans text-zinc-500 leading-relaxed">
                      Ajustando esses parâmetros, você altera diretamente a simulação de aceleração que rege o fundo 3D. O comportamento imita as ondulações eletromagnéticas de um fluxo atrator.
                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Info Status bar */}
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-ping" />
                DASHBOARD INTEGRADO • WEBGL GPU RENDERER ATIVO
              </span>
              <span>RENDER SCALE: 1.0x</span>
            </div>

          </div>

        </section>

      </main>



      {/* WHY CRYPTIX? / VALUE PROPOSITIONS BENTO GRID */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900/60 bg-[#080a0c]/40 backdrop-blur-sm">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-4">
            A New Standard for Digital Asset Trading
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Nossa plataforma combina visualização interativa em tempo real com segurança de nível militar para proporcionar a melhor governança de ativos digitais do mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Proposition 1 */}
          <div className="p-8 rounded-2xl bg-[#0d0f12]/85 border border-zinc-800 hover:border-[#00f5d4]/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-[#00f5d4]" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#00f5d4] transition-colors">Instant Trading</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Transações executadas de forma paralela via pools de liquidez descentralizada de alta velocidade. Confirmação instantânea na rede sem espera excessiva.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
              <span>LATENCY SCORE</span>
              <span className="text-[#00f5d4] font-bold">~ 1.1ms</span>
            </div>
          </div>

          {/* Proposition 2 */}
          <div className="p-8 rounded-2xl bg-[#0d0f12]/85 border border-zinc-800 hover:border-[#00f5d4]/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyan-400 transition-colors">AES-256 Custody</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Seus fundos protegidos por múltiplas assinaturas de segurança avançada em hardware segregado de custódia. Seus dados privados nunca tocam na rede pública.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
              <span>SECURITY RATING</span>
              <span className="text-cyan-400 font-bold">MIL-GRADE</span>
            </div>
          </div>

          {/* Proposition 3 */}
          <div className="p-8 rounded-2xl bg-[#0d0f12]/85 border border-zinc-800 hover:border-[#00f5d4]/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Globe2 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-purple-400 transition-colors">Quantum Particles UI</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gráficos acelerados por hardware 3D WebGL de última geração que respondem ao comportamento do seu mouse para uma experiência analítica nunca antes vista.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
              <span>ACCELERATION TYPE</span>
              <span className="text-purple-400 font-bold">GPU ACCEL</span>
            </div>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS / TIMELINE */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f5d4]/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono text-[#00f5d4] uppercase tracking-widest font-bold">SIMPLE WORKFLOW</span>
              <h2 className="font-display text-3xl md:text-4xl font-light text-white leading-tight">
                How It Works
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Pronto para entrar na nova era financeira digital? Siga três passos extremamente simples para começar a gerenciar sua carteira criptográfica:
              </p>
              
              <div className="pt-4">
                <a
                  href="#dashboard-section"
                  className="px-5 py-3 rounded-xl border border-zinc-800 hover:border-[#00f5d4]/40 hover:text-white transition-all text-xs font-semibold text-zinc-300 inline-flex items-center gap-2"
                >
                  <span>Verificar Simulador</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00f5d4]" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1 */}
              <div className="flex gap-4 p-5 rounded-xl bg-[#0d0f12]/80 border border-zinc-900">
                <div className="w-10 h-10 rounded-lg bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-mono font-bold flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Crie sua Conta Segura</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Registre-se gratuitamente em menos de dois minutos e ative a autenticação de dois fatores por biometria ou hardware externo.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-5 rounded-xl bg-[#0d0f12]/80 border border-zinc-900">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Conecte sua Carteira ou Deposite</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Importe fundos via transferência bancária instantânea PIX/SEPA, carteira fria integrada (Ledger/Trezor) ou envie criptomoedas diretamente.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-5 rounded-xl bg-[#0d0f12]/80 border border-zinc-900">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono font-bold flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Negocie com Fluidez Gravitacional</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Aproveite taxas dinamicamente reduzidas, swaps imediatos, relatórios fiscais automáticos e visualização de dados em 3D.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-light text-white mb-3">FAQ • Perguntas Frequentes</h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Esclareça suas dúvidas técnicas</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'O que torna o mecanismo gráfico da Cryptix exclusivo?',
              a: 'A nossa interface de usuário utiliza renderização tridimensional nativa de WebGL através do Three.js e React Three Fiber. Isso significa que, ao invés de gráficos estáticos comuns de SaaS, representamos dados e interações financeiras como partículas quânticas interativas carregadas e processadas diretamente pela GPU do seu dispositivo.'
            },
            {
              q: 'As minhas transações criptográficas são realmente seguras?',
              a: 'Sim, absolutamente. A Cryptix implementa custódia segregada em carteiras frias multi-assinadas com criptografia simétrica AES-256 e conformidade regulatória avançada de criptoativos. Suas chaves privadas nunca são expostas ao servidor.'
            },
            {
              q: 'Como posso ajustar os parâmetros de física das partículas?',
              a: 'Criamos um Laboratório de Física (Sandbox) diretamente no nosso painel de controle interativo. Basta clicar na aba "Particle Physics Sandbox" no centro da página para alterar dinamicamente a contagem de geometrias, o raio do magnetismo, a velocidade de flutuação e o tipo de malha 3D.'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="border border-zinc-800 rounded-2xl bg-zinc-950/40 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="w-full px-6 py-5 text-left font-bold text-sm text-white flex items-center justify-between hover:text-[#00f5d4] transition-colors"
              >
                <span>{item.q}</span>
                <span className={`text-zinc-500 transition-transform font-mono text-lg ${faqOpen === index ? 'rotate-45' : 'rotate-0'}`}>
                  +
                </span>
              </button>

              <AnimatePresence>
                {faqOpen === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/40 pt-3"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </section>

      {/* FINAL PRE-FOOTER CALL TO ACTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 mb-16">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#090b0d] to-zinc-950 border border-[#00f5d4]/20 p-8 md:p-16 text-center overflow-hidden">
          {/* Neon green flare */}
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00f5d4]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight">
              Ready to Upgrade your Assets?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Descubra um ambiente financeiro acelerado, altamente dinâmico, confiável e com visual moderno e intuitivo em tempo real.
            </p>
            <div className="pt-4">
              <button
                onClick={() => triggerToast('Obrigado pelo seu interesse! Esta heropage está pronta.')}
                className="px-8 py-4 rounded-full bg-[#00f5d4] hover:bg-[#00d8bd] text-black font-bold text-sm shadow-xl shadow-[#00f5d4]/10 hover:shadow-[#00f5d4]/30 transition-all duration-300"
              >
                Get started free ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM TECH FOOTER */}
      <footer className="relative z-10 border-t border-zinc-900/80 bg-[#080a0c] py-16 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-6">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 rounded-md bg-[#00f5d4] flex items-center justify-center font-bold text-black text-xs">
              C
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-white">Cryptix OS</span>
          </div>

          <p className="text-[11px] text-zinc-500 max-w-md leading-relaxed">
            Mova seu mouse ou toque na tela para guiar o vórtice eletromagnético de partículas quânticas aceleradas por WebGL GPU em tempo real.
          </p>

          <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest mt-2">
            <span>© 2026 Cryptix Inc • React 19 • Tailwind v4 • R3F 9.0</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<AppView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
