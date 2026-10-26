'use client';

import { useEffect, useRef, useState } from 'react';
import SceneViewer from '@/components/SceneViewer';
import ActionPanel from '@/components/ActionPanel';
import Sidebar from '@/components/Sidebar';
import LoadingScreen from '@/components/LoadingScreen';
import IntroScreen from '@/components/IntroScreen';
import MainMenuButton from '@/components/MainMenuButton';
import { useGameStore } from '@/lib/store';
import { storyNodes } from '@/lib/storyNodes';
import { audioManager } from '@/lib/audioManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function HakumiGame() {
  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const resetGame = useGameStore((state) => state.resetGame);
  const history = useGameStore((state) => state.history);
  const isAudioMuted = useGameStore((state) => state.isAudioMuted);
  const currentNode = storyNodes[currentSceneId];
  const [mounted, setMounted] = useState(false);
  const [isSceneLoading, setIsSceneLoading] = useState(false);
  const [appState, setAppState] = useState<'intro' | 'menu' | 'playing' | 'exited'>('intro');
  const [isMenuMuted, setIsMenuMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Sincronizar el estado global de silencio con el gestor de audio
    audioManager.setMuted(useGameStore.getState().isAudioMuted);
  }, []);

  // Mantener la reproducción continua de música del Capítulo 1 durante el gameplay
  useEffect(() => {
    if (appState === 'playing') {
      // Si la escena pertenece al Capítulo 1 (o mientras no haya pistas de otros capítulos)
      if (
        !currentSceneId.startsWith('cap2_') &&
        !currentSceneId.startsWith('cap3_') &&
        !currentSceneId.startsWith('cap4_')
      ) {
        audioManager.playBGM('chapter1');
      }
    }
  }, [appState, currentSceneId]);

  const handleNewGame = () => {
    // Detener por completo cualquier sonido del menú antes de la carga
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    audioManager.stopBGM();
    resetGame();
    setIsSceneLoading(true);
  };

  const handleContinue = () => {
    // Detener por completo cualquier sonido del menú antes de la carga
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    audioManager.stopBGM();
    setIsSceneLoading(true);
  };

  const handleStartPlaying = () => {
    // Detener de forma absoluta la música anterior (del menú) para evitar solapamientos
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    audioManager.stopBGM();

    setIsSceneLoading(false);
    setAppState('playing');

    // La música del Capítulo 1 comienza exactamente en el instante en que finaliza la pantalla de carga
    audioManager.playBGM('chapter1');
  };

  const handleExit = () => {
    audioManager.stopAll();
    setAppState('exited');
  };

  const handleReturnToMenu = () => {
    // Detener por completo la música y estados de sonido del gameplay
    audioManager.stopAll();
    // Regresar de inmediato al Menú Principal
    setAppState('menu');
  };

  const toggleMenuSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMenuMuted(videoRef.current.muted);
    } else {
      setIsMenuMuted((prev) => !prev);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  if (isSceneLoading) {
    return (
      <LoadingScreen
        subtext="Construyendo el entramado de la psyque"
        onContinue={handleStartPlaying}
      />
    );
  }

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
        {appState === 'intro' ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full flex-1 z-20 relative flex flex-col"
          >
            <IntroScreen onContinue={() => setAppState('menu')} />
          </motion.div>
        ) : appState === 'menu' ? (
          <motion.div 
            key="main-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col justify-between items-center py-10 md:py-14 px-6 z-20"
          >
            {/* Background Video (menu.mp4) con reproducción fluida en reversa ping-pong sin cortes */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <video
                ref={videoRef}
                src="/menu.mp4"
                poster="/menu-preview.png"
                autoPlay
                loop
                muted={isMenuMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Overlay atmosférico y viñeta para integrar el video al estilo Dreamcore y asegurar legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/70" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80" />
            </div>

            {/* Botón sutil de audio en la esquina superior derecha del menú */}
            <div className="absolute top-6 right-6 z-30">
              <button
                type="button"
                onClick={toggleMenuSound}
                title={isMenuMuted ? "Activar sonido ambiental" : "Silenciar sonido ambiental"}
                aria-label={isMenuMuted ? "Activar sonido ambiental" : "Silenciar sonido ambiental"}
                className="p-2.5 rounded-full bg-zinc-950/60 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-md"
              >
                {isMenuMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>

            {/* Cabecera del Menú */}
            <div className="text-center relative z-10 pt-2 px-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-serif text-white tracking-[0.25em] uppercase mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] animate-glitch">
                Hakumi
              </h1>
              <p className="text-zinc-300 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] sm:tracking-[0.28em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-relaxed">
                Abyssal Light of a Mind Lost in Darkness
              </p>
            </div>

            {/* Botones del Menú Principal */}
            <div className="flex flex-col space-y-4 w-full max-w-xs relative z-10 pb-4">
              <button 
                type="button"
                onClick={handleNewGame}
                className="group relative py-3 text-center border border-zinc-700/60 hover:border-red-400/80 bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md transition-all duration-500 rounded cursor-pointer shadow-lg shadow-black/60"
              >
                <span className="font-mono text-zinc-300 group-hover:text-white transition-colors duration-500 tracking-widest uppercase text-sm">
                  Nueva Partida
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded" />
              </button>

              <button 
                type="button"
                onClick={handleContinue}
                disabled={!hasSaveData}
                className={`group relative py-3 text-center border transition-all duration-500 rounded shadow-lg shadow-black/60 ${
                  hasSaveData 
                    ? 'border-zinc-700/60 hover:border-red-400/80 bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md cursor-pointer' 
                    : 'border-zinc-800/40 bg-zinc-950/40 opacity-30 cursor-not-allowed'
                }`}
              >
                <span className={`font-mono transition-colors duration-500 tracking-widest uppercase text-sm ${
                  hasSaveData ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-600'
                }`}>
                  Continuar
                </span>
                {hasSaveData && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded" />}
              </button>

              <button 
                type="button"
                onClick={handleExit}
                className="group relative py-3 text-center border border-zinc-700/60 hover:border-red-400/80 bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md transition-all duration-500 rounded cursor-pointer shadow-lg shadow-black/60"
              >
                <span className="font-mono text-zinc-300 group-hover:text-white transition-colors duration-500 tracking-widest uppercase text-sm">
                  Salir
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded" />
              </button>

              <button 
                type="button"
                onClick={() => {
                  audioManager.stopAll();
                  setAppState('intro');
                }}
                className="py-1 text-center text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-pointer"
              >
                <span className="font-mono tracking-widest uppercase text-[11px]">
                  Leer Prólogo
                </span>
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
            {/* Botón circular de acceso rápido al Menú Principal */}
            <MainMenuButton onReturnToMenu={handleReturnToMenu} />

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
