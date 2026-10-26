'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

export const REFLECTIVE_QUOTES = [
  {
    category: "Susurro del Abismo",
    text: "¿Y si la salida no es realmente una salida, sino solo una habitación más grande con la luz encendida?"
  },
  {
    category: "Reflexión Emocional",
    text: "Algunas heridas no buscan cicatrizar. Solo aprenden a caminar a tu lado sin hacer tanto ruido."
  },
  {
    category: "Advertencia Poética",
    text: "No todas las luces guían; algunas simplemente encandilan para que olvides que tus grietas siguen ahí."
  },
  {
    category: "Evasión Ansiosa",
    text: "Refugiarse en lo bonito es una anestesia confortable... hasta que el efecto pasa y el silencio regresa."
  },
  {
    category: "Pregunta Retórica",
    text: "¿Cuentas los pasos hacia la salida o buscas excusas para volver a lo que te dolía?"
  },
  {
    category: "La Penumbra",
    text: "La oscuridad no quiere devorarte. Solo está cansada de que la culpes de lo que traías guardado en el pecho."
  },
  {
    category: "Sarcasmo Filosófico",
    text: "¿De verdad crees que estás eligiendo libremente, o solo estás reaccionando a lo que más te asusta?"
  },
  {
    category: "Verdad Incómoda",
    text: "Huir también es una decisión... aunque tu sombra corra exactamente a la misma velocidad que tú."
  },
  {
    category: "El Silencio",
    text: "Hay ecos que solo se escuchan cuando te atreves a apagar el ruido con el que intentas distraerte."
  },
  {
    category: "Identidad Fragmentada",
    text: "El espejo no se rompió para asustarte, sino para obligarte a mirarte desde más de una perspectiva."
  },
  {
    category: "Comprensión vs Huida",
    text: "Comprender no siempre significa sanar, pero huir garantiza seguir sangrando en silencio."
  },
  {
    category: "Dilema Emocional",
    text: "¿Prefieres una mentira cálida que te abrace o una verdad helada que te ponga de pie?"
  },
  {
    category: "Mirada Interior",
    text: "Si la luz de adelante te quema los ojos, tal vez deberías mirar lo que pisas debajo de tus pies."
  },
  {
    category: "Sarcasmo del Destino",
    text: "Ah, qué reconfortante es culpar al destino mientras sostienes las agujas con las que lo tejes."
  },
  {
    category: "Hiraeth",
    text: "Extrañar un lugar que nunca existió es la forma en que el alma intenta construir su propio hogar."
  },
  {
    category: "Ritmo de Ansiedad",
    text: "Tranquilo, la ansiedad no te va a matar... pero le encanta hacerte creer que tiene la razón absoluta."
  },
  {
    category: "La Entidad",
    text: "La sombra no te persigue. Simplemente camina al ritmo exacto de tu propia respiración."
  },
  {
    category: "Las Grietas",
    text: "Las grietas en tu cuerpo blanco no son defectos. Son los únicos canales por donde la luz y la sombra conversan."
  },
  {
    category: "Hakumei (Crepúsculo)",
    text: "El crepúsculo no es el fin del día. Es el único instante donde el sol y las estrellas se perdonan."
  },
  {
    category: "Paradigma del Espejo",
    text: "¿O es que la sombra que creías enemiga siempre fue tu propio reflejo esperándote?"
  }
];

interface LoadingScreenProps {
  customQuote?: string;
  subtext?: string;
  durationMs?: number;
  onContinue?: () => void;
}

export default function LoadingScreen({ customQuote, subtext, durationMs = 5000, onContinue }: LoadingScreenProps) {
  const [selectedQuote, setSelectedQuote] = useState<{ category: string; text: string } | null>(null);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * REFLECTIVE_QUOTES.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedQuote(REFLECTIVE_QUOTES[randomIdx]);
  }, []);

  useEffect(() => {
    if (!onContinue) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const quoteToDisplay = customQuote || selectedQuote?.text || "Adentrándote en la penumbra de tu mente...";
  const categoryToDisplay = selectedQuote?.category || "Susurro del Abismo";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-xl flex flex-col items-center space-y-6"
      >
        {/* Decorative Top Icon */}
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800/80">
          <Moon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{categoryToDisplay}</span>
        </div>

        {/* Poetic / Philosophical Main Quote */}
        <motion.blockquote 
          key={quoteToDisplay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-lg md:text-2xl font-serif text-zinc-200 leading-relaxed italic px-4 drop-shadow-md"
        >
          &ldquo;{quoteToDisplay}&rdquo;
        </motion.blockquote>

        {/* Action Button, Subtitle & Progress Bar */}
        <div className="pt-8 flex flex-col items-center space-y-4 w-full max-w-xs">
          {onContinue && (
            <motion.button 
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="px-8 py-2.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-red-400 text-zinc-200 hover:text-white font-mono text-xs uppercase tracking-[0.25em] rounded transition-all duration-300 shadow-lg shadow-black/60 cursor-pointer"
            >
              Continuar
            </motion.button>
          )}

          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest text-center">
            {subtext || "Construyendo el entramado de la psyque"}
          </p>

          {/* Minimal 5-second loading progress bar */}
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: durationMs / 1000, ease: "linear" }}
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
