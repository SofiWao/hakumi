'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';

export const INTRO_POEM_STANZAS = [
  "En lo profundo de la oscuridad, nace una radiante luz imparable.",
  "Capaz de dejar sin ver a quienes admiren su belleza, pero incluso quiere matar a quienes opten por ignorarla.",
  "Nadie puede apagarla, nadie puede cazarla.",
  "Esta vez, eso se quiebra.",
  "Un mundo de sueños repleto de pesadillas que nunca terminan.",
  "Pero de repente una sombra aparece para invadir todo lo desconocido; Hakumi.",
  "Su misión es salir de aquel mundo, sin razón apareció en la oscuridad y escapar no es una opción, es una necesidad.",
  "El destino se teje a través de hilos brillantes que forman una historia, que se inspira en las decisiones que se van tomando. Más allá de si sean buenas o malas, todas las acciones tienen reacciones, y sus consecuencias.",
  "El destino… Está en tus manos, elige con sabiduría."
];

interface IntroScreenProps {
  onContinue: () => void;
}

export default function IntroScreen({ onContinue }: IntroScreenProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between items-center py-12 px-6 sm:px-12 relative overflow-y-auto selection:bg-red-900/40">
      {/* Ruido y atmósfera de fondo */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="pointer-events-none fixed inset-0 bg-radial-gradient from-zinc-900/30 via-zinc-950 to-zinc-950 z-0" />
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-cyan-900/10 rounded-full blur-3xl animate-pulse z-0" />

      {/* Cabecera / Distintivo sutil */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-[0.3em] bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800/80 mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Prólogo · El Umbral</span>
      </motion.div>

      {/* Contenedor del Poema */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.18,
              delayChildren: 0.2
            }
          }
        }}
        className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-6 my-auto py-6"
      >
        {INTRO_POEM_STANZAS.map((stanza, index) => {
          const isLast = index === INTRO_POEM_STANZAS.length - 1;
          const isHakumiMention = stanza.includes('Hakumi');

          return (
            <motion.p
              key={index}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: 'easeOut' }
                }
              }}
              className={`font-serif leading-relaxed px-2 transition-all duration-300 ${
                isLast
                  ? 'text-lg sm:text-xl md:text-2xl text-zinc-100 font-medium tracking-wide drop-shadow-[0_2px_14px_rgba(255,255,255,0.2)] pt-4 border-t border-zinc-800/60'
                  : isHakumiMention
                  ? 'text-base sm:text-lg md:text-xl text-zinc-200 font-normal italic drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]'
                  : 'text-sm sm:text-base md:text-lg text-zinc-300/90 font-light italic'
              }`}
            >
              {stanza}
            </motion.p>
          );
        })}
      </motion.div>

      {/* Acción para continuar hacia el Menú Principal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="relative z-10 flex flex-col items-center space-y-3 pt-8 pb-4"
      >
        <button
          type="button"
          onClick={onContinue}
          className="group relative px-8 py-3 text-center border border-zinc-700/80 hover:border-red-400/80 bg-zinc-900/80 hover:bg-zinc-850 backdrop-blur-md transition-all duration-500 rounded cursor-pointer shadow-lg shadow-black/80 flex items-center space-x-2"
        >
          <Compass className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-500" />
          <span className="font-mono text-zinc-300 group-hover:text-white transition-colors duration-500 tracking-[0.25em] uppercase text-xs sm:text-sm">
            Entrar al Menú Principal
          </span>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded" />
        </button>

        <p className="text-[11px] font-mono text-zinc-500 tracking-wider flex items-center space-x-1">
          <span>Presiona</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
            Enter
          </kbd>
          <span>para continuar</span>
        </p>
      </motion.div>
    </div>
  );
}
