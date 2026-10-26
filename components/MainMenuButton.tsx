'use client';

import { motion } from 'framer-motion';

interface MainMenuButtonProps {
  onReturnToMenu: () => void;
}

export default function MainMenuButton({ onReturnToMenu }: MainMenuButtonProps) {
  return (
    <div className="fixed top-6 left-6 z-30 flex items-center">
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onReturnToMenu}
        title="Volver al Menú Principal"
        aria-label="Volver al Menú Principal"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-zinc-700/80 hover:border-cyan-400/90 bg-zinc-950/80 hover:bg-zinc-900/90 backdrop-blur-md shadow-lg shadow-black/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all duration-300 flex items-center justify-center p-1 cursor-pointer overflow-visible"
      >
        {/* Contenedor circular recortado con el logo */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black/60">
          <img
            src="/hakumi-logo-round.png"
            alt="Hakumi - Volver al Menú Principal"
            onError={(e) => {
              // Fallback directo a la imagen completa si fuera necesario
              (e.target as HTMLImageElement).src = '/hakumi-logo.jpg';
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none pointer-events-none"
            draggable={false}
          />
          {/* Halo reactivo suave en hover */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Tooltip sutil flotante hacia la derecha */}
        <div className="pointer-events-none absolute left-full ml-3 hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
          <div className="px-3 py-1 rounded bg-zinc-950/90 border border-zinc-800 text-[11px] font-mono tracking-widest uppercase text-zinc-300 shadow-xl backdrop-blur-sm whitespace-nowrap">
            Menú Principal
          </div>
        </div>
      </motion.button>
    </div>
  );
}
