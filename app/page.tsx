'use client';

import { useEffect, useState } from 'react';
import SceneViewer from '@/components/SceneViewer';
import ActionPanel from '@/components/ActionPanel';
import Sidebar from '@/components/Sidebar';
import { useGameStore } from '@/lib/store';
import { storyNodes } from '@/lib/storyNodes';
import { motion, AnimatePresence } from 'framer-motion';

export default function HakumiGame() {
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const resetGame = useGameStore((state) => state.resetGame);
  const history = useGameStore((state) => state.history);
  const currentNode = storyNodes[currentSceneId];
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<'menu' | 'playing' | 'exited'>('menu');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono">Cargando mente...</div>;
  }

  const handleNewGame = () => {
    resetGame();
    setAppState('playing');
  };

  const handleContinue = () => {
    setAppState('playing');
  };

  const handleExit = () => {
    setAppState('exited');
  };

  if (appState === 'exited') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-700 font-serif">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
          La oscuridad te abraza. Hasta la próxima.
        </motion.p>
      </div>
    );
  }

  const hasSaveData = currentSceneId !== 'start' || history.length > 0;

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col selection:bg-red-900/40 bg-zinc-950">
      {/* Ruido visual de fondo estático muy sutil */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <AnimatePresence mode="wait">
        {appState === 'menu' ? (
          <motion.div 
            key="main-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-serif text-white tracking-[0.2em] uppercase mb-4 animate-glitch">Hakumi</h1>
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Abyssal Light</p>
            </div>

            <div className="flex flex-col space-y-6 w-full max-w-xs">
              <button 
                onClick={handleNewGame}
                className="group relative py-3 text-center border border-transparent hover:border-zinc-800 transition-all duration-500"
              >
                <span className="font-mono text-zinc-400 group-hover:text-red-300 transition-colors duration-500 tracking-widest uppercase">
                  Nueva Partida
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </button>

              <button 
                onClick={handleContinue}
                disabled={!hasSaveData}
                className={`group relative py-3 text-center border border-transparent transition-all duration-500 ${hasSaveData ? 'hover:border-zinc-800 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
              >
                <span className={`font-mono transition-colors duration-500 tracking-widest uppercase ${hasSaveData ? 'text-zinc-400 group-hover:text-red-300' : 'text-zinc-600'}`}>
                  Continuar
                </span>
                {hasSaveData && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />}
              </button>

              <button 
                onClick={handleExit}
                className="group relative py-3 text-center border border-transparent hover:border-zinc-800 transition-all duration-500"
              >
                <span className="font-mono text-zinc-400 group-hover:text-red-300 transition-colors duration-500 tracking-widest uppercase">
                  Salir
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex-1 w-full flex flex-col pt-12 pb-24 px-6 sm:px-12 z-10 relative"
          >
            <Sidebar />
            
            <div className="flex-1 w-full flex flex-col items-center justify-center max-w-4xl mx-auto">
              {currentNode ? (
                <>
                  <SceneViewer node={currentNode} />
                  <ActionPanel choices={currentNode.choices} />
                </>
              ) : (
                <div className="text-red-500 font-mono">Error: Escena no encontrada en el tejido de la realidad.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
