/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, AlertCircle, Loader2, Play, Hash, Terminal, Users, Eye, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExtractionResult {
  videoUrl: string;
  title: string;
  originalUrl: string;
  metadata?: {
    duration: string;
    size: string;
  };
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
  timestamp: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [
      { message, type, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4)
    ]);
  };

  useEffect(() => {
    addLog('KW-Downloader Pro Engine Boot...', 'info');
    addLog('Mobile Optimization: ACTIVE (Samsung A15 detected)', 'success');
  }, []);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`Scanning input stream...`, 'info');

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro inesperado');
      }

      setResult(data);
      addLog('Extraction complete!', 'success');
      addLog(`Metadata found: ${data.metadata?.size}`, 'info');
    } catch (err: any) {
      setError(err.message);
      addLog(`Critical: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (videoUrl: string) => {
    addLog('Initiating secure binary stream...', 'info');
    // Using the proxy endpoint to force download
    window.location.href = `/api/download?url=${encodeURIComponent(videoUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-text-main font-sans p-4 md:p-10 flex flex-col items-center selection:bg-accent selection:text-white">
      <div className="max-w-6xl w-full flex flex-col h-full">
        
        {/* Header - Fixed aspect for mobile */}
        <header className="flex justify-between items-center mb-6 md:mb-10">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <Sparkles className="text-white" size={20} />
             </div>
             <div className="text-2xl md:text-3xl font-black text-white tracking-widest italic">KW<span className="text-accent">.DL</span></div>
          </div>
          <div className="hidden sm:flex text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] flex-col items-end">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success-green shadow-[0_0_10px_#22c55e]"></span>
              V3.0 ENGINE READY
            </span>
            <span>SECURE.PRO.BIO</span>
          </div>
        </header>

        {/* Input Bar - 3D Effect */}
        <section className="mb-8 md:mb-12 w-full">
          <motion.form 
            onSubmit={handleExtract} 
            className="relative flex flex-col md:flex-row items-stretch md:items-center bg-[#121216] border-2 border-[#2b2b35] rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            whileHover={{ y: -2 }}
          >
            <div className="hidden md:flex pl-4 text-accent">
              <LinkIcon size={24} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Cole o link do Kwai aqui..."
              className="flex-1 bg-transparent border-none py-4 px-6 text-white placeholder:text-text-muted focus:outline-none text-base md:text-xl font-medium"
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-white px-8 py-4 md:py-2 rounded-2xl font-black uppercase text-sm md:text-base tracking-tighter hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 m-1 shadow-[0_4px_15px_rgba(255,80,0,0.4)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  ANALISAR
                </>
              )}
            </motion.button>
          </motion.form>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-3 text-red-400 font-bold px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl"
              >
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Bento Grid - Mobile Stacking Fix */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 flex-1 h-full min-h-[600px]">
          
          {/* Card 1: Preview (Tall) - Takes 4 cols on desktop */}
          <motion.div 
            className="md:col-span-4 md:row-span-2 bg-[#121216] border border-[#2b2b35] rounded-[32px] overflow-hidden flex flex-col shadow-[15px_15px_30px_rgba(0,0,0,0.5)] relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.video
                    key={result.videoUrl}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={result.videoUrl}
                    controls
                    className="w-full h-full object-cover md:object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <Play size={80} className="group-hover:scale-110 transition-transform" strokeWidth={1} />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">STANDBY</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="p-8 z-20">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-accent text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-accent/10 rounded-md">Preview Live</span>
                 <span className="text-[10px] font-mono text-text-muted">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
              <div className="font-bold text-xl md:text-2xl text-white line-clamp-2 leading-tight">
                {result ? result.title : 'No connection established'}
              </div>
              <div className="flex gap-4 mt-4">
                 <div className="bg-[#212128] rounded-xl p-2 px-3">
                    <div className="text-[9px] text-text-muted font-bold uppercase mb-0.5">Size</div>
                    <div className="text-xs font-black text-white">{result?.metadata?.size || '-- MB'}</div>
                 </div>
                 <div className="bg-[#212128] rounded-xl p-2 px-3">
                    <div className="text-[9px] text-text-muted font-bold uppercase mb-0.5">Length</div>
                    <div className="text-xs font-black text-white">{result?.metadata?.duration || '--s'}</div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Metadata (Wide) - 8 cols */}
          <motion.div 
            className="md:col-span-8 bg-[#121216] border border-[#2b2b35] rounded-[32px] p-8 md:p-10 flex flex-col justify-center gap-4 shadow-[15px_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
             <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Metadata Stream</span>
             {result ? (
               <>
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[0.9]">{result.title}</h2>
                 <div className="flex flex-wrap gap-4 md:gap-8 text-xs text-text-muted mt-2 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2 bg-[#212128] px-3 py-1.5 rounded-full">
                       <Users size={14} className="text-accent" />
                       <span>@Kwai_Creator</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#212128] px-3 py-1.5 rounded-full">
                       <Eye size={14} className="text-accent" />
                       <span>Optimized Link</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#212128] px-3 py-1.5 rounded-full">
                       <Calendar size={14} className="text-accent" />
                       <span>{new Date().toLocaleDateString()}</span>
                    </div>
                 </div>
               </>
             ) : (
               <div className="text-text-muted italic opacity-30 text-lg">Input a valid stream source to analyze biometric data...</div>
             )}
          </motion.div>

          {/* Card 3: Download Options - 4 cols */}
          <motion.div 
            className="md:col-span-4 bg-[#121216] border border-[#2b2b35] rounded-[32px] p-8 flex flex-col shadow-[15px_15px_40px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] block mb-6">Output Controls</span>
            <div className="space-y-4 flex-1">
              {result ? (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(result.videoUrl)}
                    className="flex justify-between items-center w-full p-4 bg-accent rounded-2xl transition-all group shadow-[0_10px_30px_rgba(255,80,0,0.3)]"
                  >
                    <div className="flex items-center gap-3">
                       <Download size={20} className="text-white" />
                       <span className="text-sm font-black text-white uppercase italic">FULL HD PRO</span>
                    </div>
                    <span className="text-[10px] bg-white text-accent font-black px-2 py-1 rounded">MP4</span>
                  </motion.button>
                  
                  <button 
                    onClick={() => window.open(result.videoUrl)}
                    className="w-full flex justify-between items-center p-4 bg-[#212128] border border-white/5 hover:border-accent/40 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                       <Sparkles size={20} className="text-text-muted group-hover:text-accent" />
                       <span className="text-sm font-bold text-text-main uppercase">Abrir Direto</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-5">
                  <Download size={48} />
                  <span className="text-[10px] font-black">NO DATA</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 4: Terminal - 4 cols */}
          <motion.div 
            className="md:col-span-4 bg-[#0c0c0e] border border-[#2b2b35] rounded-[32px] p-8 flex flex-col overflow-hidden shadow-[15px_15px_40px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
               <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] block">System Core</span>
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/30" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                  <div className="w-2 h-2 rounded-full bg-green-500/30" />
               </div>
            </div>
            <div className="flex-1 font-mono text-[10px] md:text-[11px] leading-relaxed overflow-y-auto custom-scrollbar space-y-2">
              {logs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <span className="text-text-muted shrink-0 text-[9px]">{log.timestamp}</span>
                  <div className="flex-1">
                    <span className={
                      log.type === 'success' ? 'text-success-green' : 
                      log.type === 'error' ? 'text-red-500 font-bold' : 
                      log.type === 'warn' ? 'text-yellow-500' : 'text-blue-500'
                    }>
                      {log.type === 'success' ? '✓' : log.type === 'error' ? '✗' : '›'}
                    </span>
                    <span className="ml-2 text-white/70">{log.message}</span>
                  </div>
                </motion.div>
              ))}
              {loading && (
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-accent animate-pulse" />
                    <span className="text-accent animate-pulse font-bold">BYPASSING GATEWAYS...</span>
                 </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-[9px] text-text-muted uppercase tracking-[0.5em] font-black opacity-30 pb-10">
          SECURE PROTOCOL BY CREATIVE CHAOS // S.A15-V3
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        body {
          background-image: radial-gradient(circle at 50% 10%, rgba(255, 80, 2, 0.05) 0%, transparent 50%);
        }
      `}</style>
    </div>
  );
}
