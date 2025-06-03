import { create } from 'zustand'

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';
export type GlobalState = {
  playerAction: PlayerAction,

  setPlayerAction: (playerAction: PlayerAction) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playerAction: 'NONE',

    setPlayerAction: (playerAction: PlayerAction) => set(() => {
      return { playerAction };
    }),
  }
});
