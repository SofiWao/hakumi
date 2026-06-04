import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storyNodes, StoryChoice } from './storyNodes';

export type Thought = {
  id: string;
  title: string;
  description: string;
};

interface GameState {
  currentSceneId: string;
  history: string[];
  ansiedad: number;
  esperanza: number;
  thoughts: Thought[];
  
  makeChoice: (choice: StoryChoice) => void;
  goBack: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentSceneId: 'start',
      history: [],
      ansiedad: 0,
      esperanza: 0,
      thoughts: [],

      makeChoice: (choice: StoryChoice) => {
        set((state) => {
          const newHistory = [...state.history, state.currentSceneId];
          
          const newAnsiedad = state.ansiedad + (choice.stateChanges?.ansiedad || 0);
          const newEsperanza = state.esperanza + (choice.stateChanges?.esperanza || 0);
          
          let newThoughts = [...state.thoughts];
          if (choice.newThought) {
            const thoughtExists = state.thoughts.find(t => t.id === choice.newThought!.id);
            if (!thoughtExists) {
              newThoughts.push(choice.newThought);
            }
          }

          return {
            currentSceneId: choice.nextSceneId,
            history: newHistory,
            ansiedad: newAnsiedad,
            esperanza: newEsperanza,
            thoughts: newThoughts,
          };
        });
      },

      goBack: () => {
        set((state) => {
          if (state.history.length === 0) return state;
          const previousSceneId = state.history[state.history.length - 1];
          const newHistory = state.history.slice(0, -1);
          return {
            currentSceneId: previousSceneId,
            history: newHistory,
          };
        });
      },

      resetGame: () => {
        set({
          currentSceneId: 'start',
          history: [],
          ansiedad: 0,
          esperanza: 0,
          thoughts: [],
        });
      }
    }),
    {
      name: 'hakumi-storage',
    }
  )
);
