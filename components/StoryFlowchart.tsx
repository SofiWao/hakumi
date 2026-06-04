'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { 
  Compass, 
  Sun, 
  Moon, 
  EyeOff, 
  Heart, 
  HelpCircle,
  Clock
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
  {
    id: 'start',
    name: 'El Despertar',
    description: 'Hakumi despierta sin recuerdos en el umbral del abismo.',
    icon: Compass,
    x: 50,
    y: 15,
    color: 'from-zinc-400 to-zinc-600',
    glowColor: 'rgba(255,255,255,0.2)'
  },
  {
    id: 'escena_luz',
    name: 'Camino de Luz',
    description: 'Un resplandor cegador que exige brillar y ocultar el dolor.',
    icon: Sun,
    x: 20,
    y: 50,
    color: 'from-amber-400 to-red-500',
    glowColor: 'rgba(239,68,68,0.4)'
  },
  {
    id: 'escena_oscuridad',
    name: 'Camino de Sombras',
    description: 'Un frío manto negro que trae paz y revela formas ocultas.',
    icon: Moon,
    x: 80,
    y: 50,
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(59,130,246,0.4)'
  },
  {
    id: 'bad_ending_light',
    name: 'La Ceguera',
    description: 'Consumida por el resplandor vacío, Hakumi se desvanece.',
    icon: EyeOff,
    x: 20,
    y: 85,
    color: 'from-red-600 to-rose-950',
    glowColor: 'rgba(220,38,38,0.5)'
  },
  {
    id: 'good_ending_acceptance',
    name: 'La Aceptación',
    description: 'Abrazando las sombras y los recuerdos fragmentados para sanar.',
    icon: Heart,
    x: 80,
    y: 85,
    color: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16,185,129,0.5)'
  }
];

const FLOW_EDGES = [
  { from: 'start', to: 'escena_luz', side: 'left' },
  { from: 'start', to: 'escena_oscuridad', side: 'right' },
  { from: 'escena_luz', to: 'bad_ending_light', side: 'left' },
  { from: 'escena_oscuridad', to: 'good_ending_acceptance', side: 'right' }
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

      <div className="relative w-full aspect-[100/115] bg-zinc-950/20 border border-zinc-900/60 rounded-xl p-4 overflow-hidden backdrop-blur-md">
        {/* Glow effect under active nodes */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-zinc-950 to-transparent opacity-60" />

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 115" fill="none">
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
            const fromNode = FLOW_NODES.find((n) => n.id === edge.from)!;
            const toNode = FLOW_NODES.find((n) => n.id === edge.to)!;
            
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
            let filter = undefined;
            let strokeDasharray = undefined;

            if (active) {
              strokeColor = edge.side === 'left' ? '#f43f5e' : '#3b82f6';
              strokeWidth = 2.5;
              filter = 'url(#glow-luz)';
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
          let borderGlow = 'none';

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
              className="absolute group transition-all duration-300"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 20 : 10,
              }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id, isVisited)}
            >
              {/* Pulsing ring for active node */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-40" 
                  style={{
                    border: '1px solid rgba(255,255,255,0.6)',
                  }}
                />
              )}

              {/* Node Circle */}
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${nodeStyles}`}>
                <NodeIcon className={`w-5 h-5 ${iconColor} transition-colors duration-300`} />
              </div>

              {/* Node Title (Horizontal Label) */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[10px] font-mono tracking-wider transition-colors duration-300 ${
                  isActive 
                    ? 'text-zinc-100 font-bold' 
                    : isVisited 
                      ? 'text-zinc-400 group-hover:text-zinc-200' 
                      : 'text-zinc-700'
                }`}
              >
                {node.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip / Info Box */}
      <div className="mt-8 min-h-[90px] bg-zinc-950/40 border border-zinc-900/80 rounded-lg p-4 transition-all duration-300 flex flex-col justify-center">
        {hoveredNode ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-serif font-bold text-zinc-300 tracking-wider">
                {hoveredNode.name}
              </h4>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                currentSceneId === hoveredNode.id
                  ? 'border-white/20 text-white bg-white/5'
                  : visitedNodeIds.includes(hoveredNode.id)
                    ? 'border-zinc-800 text-zinc-400'
                    : 'border-zinc-950 text-zinc-800 bg-zinc-950/20'
              }`}>
                {currentSceneId === hoveredNode.id 
                  ? 'Estás aquí' 
                  : visitedNodeIds.includes(hoveredNode.id)
                    ? 'Explorado (Saltar)' 
                    : 'No explorado'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed mb-1">
              {hoveredNode.description}
            </p>
            {visitedNodeIds.includes(hoveredNode.id) && currentSceneId !== hoveredNode.id && (
              <p className="text-[9px] font-mono text-amber-500/80 flex items-center">
                &gt; Haz clic en el nodo para viajar a esta escena.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs font-serif italic text-zinc-600">
              Pasa el cursor sobre un nodo para ver detalles del camino...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
