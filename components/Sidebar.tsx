'use client';

import { useState } from 'react';
import { Brain, X, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import StoryFlowchart from './StoryFlowchart';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mente' | 'destino'>('mente');
  const { ansiedad, esperanza, thoughts, isAudioMuted, toggleAudioMuted } = useGameStore();

  return (
    <>
      {/* Barra de controles superior derecha: Música y Árbol de Decisiones */}
      <div 
        className={`fixed top-6 right-6 z-40 flex items-center space-x-3 transition-opacity duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {/* Botón para encender o apagar la música */}
        <button
          type="button"
          onClick={toggleAudioMuted}
          title={isAudioMuted ? "Encender música" : "Silenciar música"}
          aria-label={isAudioMuted ? "Encender música" : "Silenciar música"}
          className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
        >
          {isAudioMuted ? (
            <VolumeX className="w-6 h-6 text-zinc-500" />
          ) : (
            <Volume2 className="w-6 h-6 text-cyan-400" />
          )}
        </button>

        {/* Botón flotante para abrir la mente y el árbol de decisiones */}
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          title="Abrir Árbol de Decisiones y Estado Mental"
          aria-label="Abrir Árbol de Decisiones"
          className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
        >
          <Brain className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel lateral */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto p-6 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif tracking-widest text-zinc-200">
                  {activeTab === 'mente' ? 'MI MENTE' : 'MI DESTINO'}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleAudioMuted}
                    title={isAudioMuted ? "Encender música" : "Silenciar música"}
                    aria-label={isAudioMuted ? "Encender música" : "Silenciar música"}
                    className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    {isAudioMuted ? (
                      <VolumeX className="w-5 h-5 text-zinc-500" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-cyan-400" />
                    )}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    aria-label="Cerrar panel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-zinc-900 mb-8">
                <button 
                  onClick={() => setActiveTab('mente')}
                  className={`flex-1 pb-3 text-xs font-mono tracking-widest transition-colors duration-300 relative ${
                    activeTab === 'mente' ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  ESTADO
                  {activeTab === 'mente' && (
                    <motion.div 
                      layoutId="sidebar-tab-indicator" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-400"
                    />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('destino')}
                  className={`flex-1 pb-3 text-xs font-mono tracking-widest transition-colors duration-300 relative ${
                    activeTab === 'destino' ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  TEJIDO
                  {activeTab === 'destino' && (
                    <motion.div 
                      layoutId="sidebar-tab-indicator" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-400"
                    />
                  )}
                </button>
              </div>

              {/* Content Panel */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {activeTab === 'mente' ? (
                    <motion.div
                      key="mente-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* Estados Mentales */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm font-mono text-zinc-400 mb-2">
                            <span>Ansiedad</span>
                            <span>{ansiedad}%</span>
                          </div>
                          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-red-900/50"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(0, ansiedad))}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm font-mono text-zinc-400 mb-2">
                            <span>Esperanza</span>
                            <span>{esperanza}%</span>
                          </div>
                          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-900/50"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(0, esperanza))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pensamientos / Inventario */}
                      <div>
                        <h3 className="text-sm font-mono text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-900 pb-2">
                          Pensamientos Fragmentados
                        </h3>
                        
                        {thoughts.length === 0 ? (
                          <p className="text-zinc-600 font-serif italic text-sm">Tu mente está vacía... por ahora.</p>
                        ) : (
                          <ul className="space-y-4">
                            {thoughts.map((thought) => (
                              <li key={thought.id} className="bg-zinc-900/50 p-4 rounded border border-zinc-900/50">
                                <h4 className="flex items-center text-zinc-300 font-serif mb-2">
                                  <ChevronRight className="w-4 h-4 mr-1 text-zinc-600" />
                                  {thought.title}
                                </h4>
                                <p className="text-xs font-mono text-zinc-500 leading-relaxed pl-5">
                                  {thought.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="destino-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <StoryFlowchart />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
