'use client';

import { motion } from 'framer-motion';
import { StoryChoice } from '@/lib/storyNodes';
import { useGameStore } from '@/lib/store';

export default function ActionPanel({ choices }: { choices: StoryChoice[] }) {
  const makeChoice = useGameStore((state) => state.makeChoice);

  return (
    <motion.div 
      className="mt-16 flex flex-col items-center space-y-4 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1.5 }} // Aparece después del texto
    >
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => makeChoice(choice)}
          className="group relative w-full p-4 border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/80 transition-all duration-500 rounded text-center overflow-hidden"
        >
          {/* Efecto de resplandor sutil en hover */}
          <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="relative z-10 font-mono text-sm md:text-base text-zinc-400 group-hover:text-red-300 transition-colors duration-500 tracking-widest uppercase">
            &gt; {choice.text}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
