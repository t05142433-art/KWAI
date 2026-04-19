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
      ...prev.slice(0, 6)
    ]);
  };

  useEffect(() => {
    addLog('KW-PRO ENGINE V3.4 ONLINE', 'success');
    addLog('MOBILE OPTIMIZATION: SAMSUNG A15 5G ENABLED', 'info');
    addLog('SECURE CLOUD BYPASS READY', 'info');
  }, []);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`INIT SCAN: ${input.substring(0, 15)}...`, 'info');

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'GATEWAY TIMEOUT / INVALID LINK');
      }

      setResult(data);
      addLog('DECRYPT COMPLETE: Video Stream Found', 'success');
      addLog(`META: ${data.metadata?.size || 'N/A'} detected`, 'info');
    } catch (err: any) {
      setError(err.message);
      addLog(`ERR: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (videoUrl: string) => {
    addLog('GENERATING SECURE TOKEN...', 'info');
    addLog('STREAMING BINARY DATA...', 'success');
    window.location.href = `/api/download?url=${encodeURIComponent(videoUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#050507] text-text-main font-sans p-4 md:p-8 flex flex-col items-center selection:bg-accent selection:text-white perspective-[1000px] overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full flex flex-col h-full relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 md:mb-14 px-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
             <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center rotate-6 shadow-[8px_8px_20px_rgba(255,80,0,0.3)] border border-white/20">
                <Sparkles className="text-white" size={24} />
             </div>
             <div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter italic leading-none">KW<span className="text-accent">.DL</span></div>
                <div className="text-[9px] font-bold text-accent tracking-[0.3em] uppercase mt-1">Industrial Grade</div>
             </div>
          </motion.div>
          <div className="hidden sm:flex text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] flex-col items-end">
            <span className="flex items-center gap-2 bg-[#121216] px-3 py-1 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-success-green shadow-[0_0_10px_#22c55e] animate-pulse"></span>
              A15-PRO OPTIMIZED
            </span>
          </div>
        </header>

        {/* Input Bar - Deep 3D Shadow */}
        <section className="mb-10 md:mb-16 w-full px-1">
          <motion.form 
            onSubmit={handleExtract} 
            className="relative flex flex-col md:flex-row items-stretch md:items-center bg-[#0d0d12] border border-white/10 rounded-[32px] p-2.5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]"
            whileHover={{ y: -4, scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="hidden md:flex pl-5 text-accent">
              <LinkIcon size={28} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Insira o link do vídeo aqui..."
              className="flex-1 bg-transparent border-none py-5 px-6 text-white placeholder:text-text-muted focus:outline-none text-lg md:text-2xl font-bold tracking-tight"
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileTap={{ scale: 0.96 }}
              className="bg-accent text-white px-10 py-5 md:py-3.5 rounded-[22px] font-black uppercase text-base md:text-lg tracking-tighter hover:brightness-125 transition-all disabled:opacity-50 flex items-center justify-center gap-3 m-1 shadow-[0_8px_25px_rgba(255,80,0,0.4)] border-t border-white/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Play size={22} fill="currentColor" />
                  EXTRAIR
                </>
              )}
            </motion.button>
          </motion.form>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 flex items-center gap-3 text-red-500 font-black px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-[24px] uppercase text-xs tracking-widest shadow-xl"
              >
                <AlertCircle size={20} />
                <span>CRITICAL ERROR: {error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Bento Grid - 3D Perspective Stacking */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 md:gap-8 flex-1">
          
          {/* Card 1: Preview (Tall) */}
          <motion.div 
            className="md:col-span-4 md:row-span-6 bg-[#0d0d12] border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-[25px_25px_60px_rgba(0,0,0,0.6)] relative group transform-gpu"
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            whileHover={{ y: -8, rotateY: 2 }}
          >
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.video
                    key={result.videoUrl}
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={result.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6 opacity-5">
                    <Play size={100} className="group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                    <span className="text-sm font-black uppercase tracking-[0.8em]">IDLE</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="p-10 z-20 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/95 to-transparent">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-accent text-[11px] font-black uppercase tracking-[0.3em] px-3 py-1.5 bg-accent/10 rounded-lg border border-accent/20">Stream Monitor</span>
                 <Hash className="text-white/20" size={16} />
              </div>
              <div className="font-bold text-2xl md:text-3xl text-white line-clamp-2 leading-[1.1] tracking-tight mb-6">
                {result ? result.title : 'Aguarda comando...'}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                 <div className="bg-[#16161e] rounded-2xl p-4 border border-white/5 shadow-inner">
                    <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Payload</div>
                    <div className="text-base font-black text-white">{result?.metadata?.size || '-- MB'}</div>
                 </div>
                 <div className="bg-[#16161e] rounded-2xl p-4 border border-white/5 shadow-inner">
                    <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Duration</div>
                    <div className="text-base font-black text-white">{result?.metadata?.duration || '--s'}</div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Metadata (Wide) */}
          <motion.div 
            className="md:col-span-8 md:row-span-3 bg-[#0d0d12] border border-white/10 rounded-[40px] p-10 flex flex-col justify-center gap-6 shadow-[30px_30px_70px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
             <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-colors" />
             <span className="text-accent text-xs font-black uppercase tracking-[0.4em] block">Data Pack Extraction</span>
             {result ? (
               <>
                 <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.85]">{result.title}</h2>
                 <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] font-black uppercase tracking-widest mt-4">
                    <div className="flex items-center gap-3 bg-[#16161e] px-5 py-3 rounded-2xl border border-white/5 shadow-lg">
                       <Users size={16} className="text-accent" />
                       <span className="text-white">STREAMING_OWNER</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#16161e] px-5 py-3 rounded-2xl border border-white/5 shadow-lg">
                       <Eye size={16} className="text-accent" />
                       <span className="text-white">DECRYPTED_LINK</span>
                    </div>
                 </div>
               </>
             ) : (
               <div className="text-text-muted italic opacity-20 text-xl font-medium">Capture stream packet to view detailed heuristics...</div>
             )}
          </motion.div>

          {/* Card 3: Download Options */}
          <motion.div 
            className="md:col-span-4 md:row-span-3 bg-[#0d0d12] border border-white/10 rounded-[40px] p-10 flex flex-col shadow-[20px_20px_50px_rgba(0,0,0,0.5)] relative transform-gpu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, rotateX: -2 }}
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.4em] block mb-8 underline decoration-2 underline-offset-8">Output Control</span>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              {result ? (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.04, brightness: 1.2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleDownload(result.videoUrl)}
                    className="flex justify-between items-center w-full p-6 bg-accent rounded-[28px] transition-all shadow-[0_15px_40px_rgba(255,80,0,0.4)] border-t border-white/30"
                  >
                    <div className="flex items-center gap-4">
                       <Download size={24} className="text-white" />
                       <span className="text-lg font-black text-white uppercase italic tracking-tighter">DOWNLOAD NOW</span>
                    </div>
                  </motion.button>
                  
                  <button 
                    onClick={() => window.open(result.videoUrl)}
                    className="w-full flex justify-between items-center p-6 bg-[#16161e] border border-white/10 hover:border-accent rounded-[28px] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <Play size={24} className="text-text-muted group-hover:text-accent" />
                       <span className="text-base font-black text-white uppercase tracking-tight">Open Native Player</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-5 opacity-5">
                  <Download size={60} strokeWidth={1} />
                  <span className="text-xs font-black tracking-widest">NO OUTPUT</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 4: Terminal */}
          <motion.div 
            className="md:col-span-4 md:row-span-3 bg-[#050507] border border-white/10 rounded-[40px] p-10 flex flex-col overflow-hidden shadow-[20px_20px_50px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between items-center mb-8">
               <span className="text-accent text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2">
                 <Terminal size={14} />
                 Heuristic Core
               </span>
               <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
               </div>
            </div>
            <div className="flex-1 font-mono text-[11px] leading-relaxed overflow-y-auto custom-scrollbar space-y-3">
              {logs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 items-start"
                >
                  <span className="text-white/20 shrink-0 text-[10px] bg-white/5 px-1.5 rounded">{log.timestamp}</span>
                  <div className="flex-1">
                    <span className={
                      log.type === 'success' ? 'text-success-green font-bold' : 
                      log.type === 'error' ? 'text-red-500 font-bold' : 
                      log.type === 'warn' ? 'text-yellow-500 font-bold' : 'text-blue-500 font-bold'
                    }>
                      {log.type === 'success' ? '✔' : log.type === 'error' ? '✘' : '◈'}
                    </span>
                    <span className="ml-3 text-white/60 tracking-tight">{log.message}</span>
                  </div>
                </motion.div>
              ))}
              {loading && (
                 <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                       <div className="w-1.5 h-4 bg-accent animate-bounce" />
                       <div className="w-1.5 h-4 bg-accent animate-bounce [animation-delay:0.2s]" />
                       <div className="w-1.5 h-4 bg-accent animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-accent font-black text-xs animate-pulse tracking-widest">ANALYSE_STREAMING...</span>
                 </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-20 text-center pb-12">
          <div className="text-[10px] text-text-muted uppercase tracking-[1em] font-black opacity-40">
            PRO.KWAI.ENCRYPTED.SYSTEM // BUILD.S24-A15
          </div>
          <div className="mt-4 flex justify-center gap-4 opacity-20">
             <div className="w-8 h-1 bg-white/10 rounded-full" />
             <div className="w-8 h-1 bg-accent/30 rounded-full" />
             <div className="w-8 h-1 bg-white/10 rounded-full" />
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 80, 0, 0.1);
          border-radius: 10px;
        }
        body {
          background-attachment: fixed;
          scroll-behavior: smooth;
        }
        @media (max-width: 768px) {
          .grid-cols-1 {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}
