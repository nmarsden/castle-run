import { create } from 'zustand'

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';
export type GlobalState = {
  playing: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;

  setPlayerAction: (playerAction: PlayerAction) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playing: false,
    groundSpeed: 1.75,
    playerAction: 'NONE',

    setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
      // Trigger playing on any player action
      if (!playing && playerAction !== 'NONE') playing = true;

      // Update playing & playerAction state
      return { playing, playerAction };
    }),
  }
});
