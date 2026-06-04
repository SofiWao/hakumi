import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storyNodes, StoryChoice } from './storyNodes';

export type Thought = {
  id: string;
  title: string;
  description: string;
};

export type HistoryStep = {
  sceneId: string;
  ansiedad: number;
  esperanza: number;
  thoughts: Thought[];
};

interface GameState {
  currentSceneId: string;
  history: HistoryStep[];
  ansiedad: number;
  esperanza: number;
  thoughts: Thought[];
  visitedNodeIds: string[];
  
  makeChoice: (choice: StoryChoice) => void;
  goBack: () => void;
  resetGame: () => void;
  jumpToNode: (sceneId: string) => void;
}

// Helper to find path and calculate states dynamically using BFS
function findPathAndState(targetSceneId: string): {
  history: HistoryStep[];
  ansiedad: number;
  esperanza: number;
  thoughts: Thought[];
} | null {
  if (targetSceneId === 'start') {
    return {
      history: [],
      ansiedad: 0,
      esperanza: 0,
      thoughts: []
    };
  }

  interface QueueItem {
    sceneId: string;
    history: HistoryStep[];
    ansiedad: number;
    esperanza: number;
    thoughts: Thought[];
  }

  const queue: QueueItem[] = [{
    sceneId: 'start',
    history: [],
    ansiedad: 0,
    esperanza: 0,
    thoughts: []
  }];

  const visited = new Set<string>();
  visited.add('start');

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNode = storyNodes[current.sceneId];
    if (!currentNode) continue;

    for (const choice of currentNode.choices) {
      const nextId = choice.nextSceneId;
      if (visited.has(nextId)) continue;
      visited.add(nextId);

      const nextAnsiedad = current.ansiedad + (choice.stateChanges?.ansiedad || 0);
      const nextEsperanza = current.esperanza + (choice.stateChanges?.esperanza || 0);
      let nextThoughts = [...current.thoughts];
      if (choice.newThought) {
        if (!nextThoughts.some(t => t.id === choice.newThought!.id)) {
          nextThoughts.push(choice.newThought);
        }
      }

      const nextHistoryStep: HistoryStep = {
        sceneId: current.sceneId,
        ansiedad: current.ansiedad,
        esperanza: current.esperanza,
        thoughts: current.thoughts
      };
      const nextHistory = [...current.history, nextHistoryStep];

      const nextItem: QueueItem = {
        sceneId: nextId,
        history: nextHistory,
        ansiedad: nextAnsiedad,
        esperanza: nextEsperanza,
        thoughts: nextThoughts
      };

      if (nextId === targetSceneId) {
        return {
          history: nextItem.history,
          ansiedad: nextItem.ansiedad,
          esperanza: nextItem.esperanza,
          thoughts: nextItem.thoughts
        };
      }

      queue.push(nextItem);
    }
  }

  return null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentSceneId: 'start',
      history: [],
      ansiedad: 0,
      esperanza: 0,
      thoughts: [],
      visitedNodeIds: ['start'],

      makeChoice: (choice: StoryChoice) => {
        set((state) => {
          const prevHistoryStep: HistoryStep = {
            sceneId: state.currentSceneId,
            ansiedad: state.ansiedad,
            esperanza: state.esperanza,
            thoughts: state.thoughts
          };
          const newHistory = [...state.history, prevHistoryStep];
          
          const newAnsiedad = state.ansiedad + (choice.stateChanges?.ansiedad || 0);
          const newEsperanza = state.esperanza + (choice.stateChanges?.esperanza || 0);
          
          let newThoughts = [...state.thoughts];
          if (choice.newThought) {
            const thoughtExists = state.thoughts.find(t => t.id === choice.newThought!.id);
            if (!thoughtExists) {
              newThoughts.push(choice.newThought);
            }
          }

          const newVisitedNodeIds = state.visitedNodeIds.includes(choice.nextSceneId)
            ? state.visitedNodeIds
            : [...state.visitedNodeIds, choice.nextSceneId];

          return {
            currentSceneId: choice.nextSceneId,
            history: newHistory,
            ansiedad: newAnsiedad,
            esperanza: newEsperanza,
            thoughts: newThoughts,
            visitedNodeIds: newVisitedNodeIds,
          };
        });
      },

      goBack: () => {
        set((state) => {
          if (state.history.length === 0) return state;
          const lastStep = state.history[state.history.length - 1];
          const newHistory = state.history.slice(0, -1);
          return {
            currentSceneId: lastStep.sceneId,
            ansiedad: lastStep.ansiedad,
            esperanza: lastStep.esperanza,
            thoughts: lastStep.thoughts,
            history: newHistory,
          };
        });
      },

      resetGame: () => {
        set((state) => ({
          currentSceneId: 'start',
          history: [],
          ansiedad: 0,
          esperanza: 0,
          thoughts: [],
          visitedNodeIds: state.visitedNodeIds.includes('start') ? state.visitedNodeIds : ['start', ...state.visitedNodeIds]
        }));
      },

      jumpToNode: (sceneId: string) => {
        set((state) => {
          if (state.currentSceneId === sceneId) return state;

          // 1. Check if the target scene is in our current history path
          const historyIdx = state.history.findIndex(h => h.sceneId === sceneId);
          if (historyIdx !== -1) {
            const targetStep = state.history[historyIdx];
            const newHistory = state.history.slice(0, historyIdx);
            return {
              currentSceneId: targetStep.sceneId,
              ansiedad: targetStep.ansiedad,
              esperanza: targetStep.esperanza,
              thoughts: targetStep.thoughts,
              history: newHistory,
            };
          }

          // 2. If it's not in the current history, but is in visitedNodeIds (visited ever)
          if (state.visitedNodeIds.includes(sceneId)) {
            const computedPath = findPathAndState(sceneId);
            if (computedPath) {
              return {
                currentSceneId: sceneId,
                history: computedPath.history,
                ansiedad: computedPath.ansiedad,
                esperanza: computedPath.esperanza,
                thoughts: computedPath.thoughts,
              };
            }
          }

          return state;
        });
      }
    }),
    {
      name: 'hakumi-storage',
    }
  )
);

