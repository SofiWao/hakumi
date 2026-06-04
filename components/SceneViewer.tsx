'use client';

import { motion } from 'framer-motion';
import { StoryNode } from '@/lib/storyNodes';

export default function SceneViewer({ node }: { node: StoryNode }) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`w-full max-w-3xl mx-auto flex flex-col items-center ${node.isGlitchy ? 'animate-glitch' : ''}`}
    >
      {node.imagePath && (
        <div className="relative w-full max-w-md aspect-square mb-8 rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <img 
            src={node.imagePath} 
            alt="Escena actual" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Overlay oscuro para integrar la imagen con el fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="space-y-6 text-center px-4 w-full">
        {node.description.map((paragraph, index) => (
          <motion.p 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.8 + 0.5, duration: 1.5 }}
            className="text-lg md:text-xl leading-relaxed text-zinc-300 font-serif tracking-wide"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
