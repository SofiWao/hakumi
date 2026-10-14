'use client';

import { useGameStore } from '@/lib/store';
import { 
  Compass, 
  Sun, 
  Moon, 
  EyeOff, 
  Heart, 
  Clock,
  Sparkles,
  Anchor,
  Ghost,
  ShieldAlert,
  HelpCircle,
  Sparkle,
  Eye,
  CloudFog,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

// Node metadata for rendering
interface FlowNode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number; // percentage
  y: number; // percentage
  color: string; // active color theme
  glowColor: string;
}

const FLOW_NODES: FlowNode[] = [
  // Capítulo I: El Despertar
  {
    id: 'start',
    name: 'El Despertar',
    description: 'Hakumi despierta en un neutro absoluto. Abre los ojos.',
    icon: Compass,
    x: 50,
    y: 6,
    color: 'from-zinc-400 to-zinc-600',
    glowColor: 'rgba(255,255,255,0.2)'
  },
  {
    id: 'escena_resplandor',
    name: 'El Resplandor',
    description: 'Luz cálida y deslumbrante que enmascara las grietas.',
    icon: Sun,
    x: 25,
    y: 18,
    color: 'from-amber-400 to-red-500',
    glowColor: 'rgba(239,68,68,0.4)'
  },
  {
    id: 'escena_penumbra',
    name: 'La Penumbra',
    description: 'Silencio desolado y desorientador en el manto frío.',
    icon: Moon,
    x: 75,
    y: 18,
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(59,130,246,0.4)'
  },
  {
    id: 'resplandor_falso',
    name: 'Velo de Cristal',
    description: 'Evasión ansiosa en la ilusión brillante.',
    icon: ShieldAlert,
    x: 12,
    y: 30,
    color: 'from-rose-500 to-amber-600',
    glowColor: 'rgba(244,63,94,0.4)'
  },
  {
    id: 'grieta_resplandor',
    name: 'Confort Roto',
    description: 'Identificar las imperfecciones en la luz deslumbrante.',
    icon: Sparkle,
    x: 38,
    y: 30,
    color: 'from-amber-300 to-zinc-500',
    glowColor: 'rgba(245,158,11,0.4)'
  },
  {
    id: 'penumbra_rumiacion',
    name: 'Niebla Mental',
    description: 'Pensamientos acelerados al evitar la incomodidad.',
    icon: HelpCircle,
    x: 62,
    y: 30,
    color: 'from-indigo-500 to-purple-800',
    glowColor: 'rgba(99,102,241,0.4)'
  },
  {
    id: 'encuentro_entidad',
    name: 'La Entidad Sombría',
    description: 'Dar un paso hacia la sombra sin juzgarla.',
    icon: Ghost,
    x: 88,
    y: 30,
    color: 'from-cyan-300 to-teal-700',
    glowColor: 'rgba(20,184,166,0.5)'
  },

  // Capítulo II: El Naufragio
  {
    id: 'cap2_el_naufragio',
    name: 'El Naufragio',
    description: 'Hiraeth: El anhelo nostálgico de un lugar inalcanzable.',
    icon: Anchor,
    x: 50,
    y: 44,
    color: 'from-blue-600 to-slate-900',
    glowColor: 'rgba(37,99,235,0.5)'
  },
  {
    id: 'cap2_espejos_rotos',
    name: 'Espejos Agrietados',
    description: 'Aceptar la identidad fragmentada ante tu reflejo.',
    icon: Sparkles,
    x: 28,
    y: 56,
    color: 'from-teal-400 to-emerald-700',
    glowColor: 'rgba(45,212,191,0.5)'
  },
  {
    id: 'cap2_relojes_detenidos',
    name: 'Relojes del Ayer',
    description: 'Aferrarte a recuerdos suspendidos en el agua negra.',
    icon: Clock,
    x: 50,
    y: 56,
    color: 'from-violet-500 to-slate-800',
    glowColor: 'rgba(139,92,246,0.5)'
  },
  {
    id: 'cap2_sombra_lago',
    name: 'El Reflejo Guía',
    description: 'Caminar junto a la sombra con ojos de heterocromía.',
    icon: Moon,
    x: 72,
    y: 56,
    color: 'from-sky-300 to-indigo-600',
    glowColor: 'rgba(56,189,248,0.5)'
  },

  // Capítulo III: Punto Ciego
  {
    id: 'cap3_punto_ciego',
    name: 'Punto Ciego',
    description: 'El trauma como un reflejo vigilante sin romper.',
    icon: Eye,
    x: 50,
    y: 70,
    color: 'from-purple-600 to-rose-900',
    glowColor: 'rgba(147,51,234,0.6)'
  },
  {
    id: 'cap3_mirada_directa',
    name: 'Mirada Directa',
    description: 'Sostener la mirada al espejo del trauma y liberar la culpa.',
    icon: Flame,
    x: 28,
    y: 82,
    color: 'from-rose-500 to-amber-500',
    glowColor: 'rgba(244,63,94,0.6)'
  },
  {
    id: 'cap3_refugio_niebla',
    name: 'Refugio de Niebla',
    description: 'Usar la niebla como un abrazo protector para tomar respiro.',
    icon: CloudFog,
    x: 50,
    y: 82,
    color: 'from-slate-400 to-indigo-700',
    glowColor: 'rgba(148,163,184,0.5)'
  },
  {
    id: 'cap3_sombra_trauma',
    name: 'Tránsito de Sombra',
    description: 'Caminar junto a La Entidad absorbiendo el juicio del trauma.',
    icon: Ghost,
    x: 72,
    y: 82,
    color: 'from-cyan-400 to-purple-800',
    glowColor: 'rgba(34,211,238,0.6)'
  },

  // Capítulo IV: El Descanso
  {
    id: 'cap4_el_descanso',
    name: 'El Descanso',
    description: 'La cima de la psique. ¿O es que la sombra siempre fue el espejo?',
    icon: CheckCircle2,
    x: 50,
    y: 96,
    color: 'from-zinc-200 via-amber-300 to-cyan-500',
    glowColor: 'rgba(255,255,255,0.7)'
  },

  // Finales Principales
  {
    id: 'bad_ending_light',
    name: 'La Fuga Incompleta',
    description: 'Final Malo: Escapar ciego creyendo haber ganado.',
    icon: EyeOff,
    x: 15,
    y: 115,
    color: 'from-red-600 to-rose-950',
    glowColor: 'rgba(220,38,38,0.6)'
  },
  {
    id: 'good_ending_acceptance',
    name: 'El Reflejo Roto',
    description: 'Final Bueno: Atrapada en el sueño eterno del recuerdo.',
    icon: Heart,
    x: 50,
    y: 115,
    color: 'from-emerald-400 to-teal-800',
    glowColor: 'rgba(16,185,129,0.6)'
  },
  {
    id: 'true_ending_equilibrium',
    name: 'La Sombra fue el Faro',
    description: 'Final Verdadero: Integración y equilibrio luz/sombra.',
    icon: Sparkles,
    x: 85,
    y: 115,
    color: 'from-amber-300 via-cyan-400 to-purple-600',
    glowColor: 'rgba(234,179,8,0.7)'
  }
];

const FLOW_EDGES = [
  // Capítulo I
  { from: 'start', to: 'escena_resplandor', side: 'left' },
  { from: 'start', to: 'escena_penumbra', side: 'right' },
  { from: 'escena_resplandor', to: 'resplandor_falso', side: 'left' },
  { from: 'escena_resplandor', to: 'grieta_resplandor', side: 'right' },
  { from: 'escena_penumbra', to: 'penumbra_rumiacion', side: 'left' },
  { from: 'escena_penumbra', to: 'encuentro_entidad', side: 'right' },

  // Transición a Capítulo II
  { from: 'resplandor_falso', to: 'bad_ending_light', side: 'left' },
  { from: 'resplandor_falso', to: 'cap2_el_naufragio', side: 'right' },
  { from: 'grieta_resplandor', to: 'cap2_el_naufragio', side: 'left' },
  { from: 'penumbra_rumiacion', to: 'cap2_el_naufragio', side: 'right' },
  { from: 'penumbra_rumiacion', to: 'good_ending_acceptance', side: 'left' },
  { from: 'encuentro_entidad', to: 'cap2_el_naufragio', side: 'right' },

  // Capítulo II -> Capítulo III
  { from: 'cap2_el_naufragio', to: 'cap2_espejos_rotos', side: 'left' },
  { from: 'cap2_el_naufragio', to: 'cap2_relojes_detenidos', side: 'left' },
  { from: 'cap2_el_naufragio', to: 'cap2_sombra_lago', side: 'right' },
  { from: 'cap2_espejos_rotos', to: 'cap3_punto_ciego', side: 'right' },
  { from: 'cap2_relojes_detenidos', to: 'cap3_punto_ciego', side: 'center' },
  { from: 'cap2_relojes_detenidos', to: 'good_ending_acceptance', side: 'left' },
  { from: 'cap2_sombra_lago', to: 'cap3_punto_ciego', side: 'right' },

  // Capítulo III -> Capítulo IV
  { from: 'cap3_punto_ciego', to: 'cap3_mirada_directa', side: 'left' },
  { from: 'cap3_punto_ciego', to: 'cap3_refugio_niebla', side: 'center' },
  { from: 'cap3_punto_ciego', to: 'cap3_sombra_trauma', side: 'right' },
  { from: 'cap3_mirada_directa', to: 'cap4_el_descanso', side: 'left' },
  { from: 'cap3_refugio_niebla', to: 'cap4_el_descanso', side: 'center' },
  { from: 'cap3_sombra_trauma', to: 'cap4_el_descanso', side: 'right' },

  // Capítulo IV -> Finales
  { from: 'cap4_el_descanso', to: 'bad_ending_light', side: 'left' },
  { from: 'cap4_el_descanso', to: 'good_ending_acceptance', side: 'center' },
  { from: 'cap4_el_descanso', to: 'true_ending_equilibrium', side: 'right' }
];

export default function StoryFlowchart() {
  const { currentSceneId, history, visitedNodeIds, jumpToNode } = useGameStore();
  const [hoveredNode, setHoveredNode] = useState<FlowNode | null>(null);

  // Reconstruct current run path list
  const currentPathIds = [...history.map((h) => h.sceneId), currentSceneId];

  // Check if an edge is active in the current timeline
  const isEdgeActive = (from: string, to: string) => {
    return currentPathIds.includes(from) && currentPathIds.includes(to) && 
           currentPathIds.indexOf(to) === currentPathIds.indexOf(from) + 1;
  };

  // Check if an edge was visited at all (historically)
  const isEdgeVisited = (from: string, to: string) => {
    return visitedNodeIds.includes(from) && visitedNodeIds.includes(to);
  };

  const handleNodeClick = (nodeId: string, isVisited: boolean) => {
    if (isVisited && nodeId !== currentSceneId) {
      jumpToNode(nodeId);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-900 pb-2">
        <Clock className="w-4 h-4 text-zinc-600 animate-pulse" />
        <span>Tejido del Destino</span>
      </div>

      <div className="relative w-full aspect-[100/135] bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-4 overflow-hidden backdrop-blur-md">
        {/* Glow effect under active nodes */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-zinc-950 to-transparent opacity-60" />

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 135" fill="none">
          <defs>
            <linearGradient id="edge-active-left" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edge-active-right" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow-luz" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {FLOW_EDGES.map((edge, idx) => {
            const fromNode = FLOW_NODES.find((n) => n.id === edge.from);
            const toNode = FLOW_NODES.find((n) => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;

            const active = isEdgeActive(edge.from, edge.to);
            const visited = isEdgeVisited(edge.from, edge.to);

            // S-curve coordinates
            const startX = fromNode.x;
            const startY = fromNode.y;
            const endX = toNode.x;
            const endY = toNode.y;
            const controlY = startY + (endY - startY) * 0.55;

            const pathD = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;

            let strokeColor = '#18181b'; // zinc-900 (unvisited)
            let strokeWidth = 1.5;
            let strokeDasharray = undefined;

            if (active) {
              strokeColor = edge.side === 'left' ? '#f43f5e' : '#3b82f6';
              strokeWidth = 2.5;
            } else if (visited) {
              strokeColor = '#52525b'; // zinc-600 (visited but inactive)
              strokeWidth = 1.8;
            } else {
              strokeColor = '#27272a'; // zinc-800
              strokeDasharray = '3 3';
            }

            return (
              <g key={idx}>
                {/* Background glow for active path */}
                {active && (
                  <path
                    d={pathD}
                    stroke={edge.side === 'left' ? '#ef4444' : '#3b82f6'}
                    strokeWidth={5}
                    strokeOpacity={0.2}
                    filter="url(#glow-luz)"
                  />
                )}
                {/* Main stroke */}
                <path
                  d={pathD}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Interactive Nodes */}
        {FLOW_NODES.map((node) => {
          const isVisited = visitedNodeIds.includes(node.id);
          const isActive = currentSceneId === node.id;
          const NodeIcon = node.icon;

          // Determine node classes
          let nodeStyles = '';
          let iconColor = 'text-zinc-600';

          if (isActive) {
            nodeStyles = 'bg-zinc-900 border-zinc-200 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-110';
            iconColor = 'text-zinc-100';
          } else if (isVisited) {
            nodeStyles = 'bg-zinc-950 border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white cursor-pointer hover:scale-105';
            iconColor = 'text-zinc-400 group-hover:text-zinc-200';
          } else {
            nodeStyles = 'bg-zinc-950/80 border-zinc-900 text-zinc-800 border-dashed cursor-not-allowed';
            iconColor = 'text-zinc-800';
          }

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id, isVisited)}
            >
              <div
                className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${nodeStyles}`}
              >
                {/* Pulse animation for active node */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                )}
                
                <NodeIcon className={`w-4 h-4 ${iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip / Info Box for Hovered Node */}
      <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg min-h-[75px] flex flex-col justify-center">
        {hoveredNode ? (
          <>
            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span>{hoveredNode.name}</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
              {hoveredNode.description}
            </p>
          </>
        ) : (
          <p className="text-[11px] text-zinc-500 italic text-center">
            Pasa el cursor sobre los nodos desbloqueados para inspeccionar el mapa del destino.
          </p>
        )}
      </div>
    </div>
  );
}
