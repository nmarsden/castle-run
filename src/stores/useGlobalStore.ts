import { create } from 'zustand'

type Wave = string[];

const WAVE: Wave = [
  '_1_1_',
  '_____',
  '_____',
  '1_1_1',
  '_____',
  '_____',
  '_1_1_',
  '_____',
  '_____',
  '_1_1_',
  '_____',
  '_____',
  '1_1_1',
  '_____',
  '_____',
  '_1_1_',
  '_____',
  '_____',
  '_1_1_',
  '_____',
  '_____',
  '1_1_1',
  '_____',
  '_____',
  '_1_1_',
  '_____',
  '_____',
  '__1__'
];

const initialEnemyPositions = (wave: Wave): [number, number, number][] => {
  const enemyPositions: [number, number, number][] = [];
  let z = -7;
  for (let i = wave.length-1; i >= 0; i--) {
    const squares = wave[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      if (square === '1') {
        enemyPositions.push([-2 + j, 0, z]);
      }
    }
    z--;
  }
  return enemyPositions;
};

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';
export type GlobalState = {
  playing: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;
  enemyPositions: [number, number, number][];

  setPlayerAction: (playerAction: PlayerAction) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playing: false,
    groundSpeed: 1.75,
    playerAction: 'NONE',
    enemyPositions: initialEnemyPositions(WAVE),

    setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
      // Trigger playing on any player action
      if (!playing && playerAction !== 'NONE') playing = true;

      // Update playing & playerAction state
      return { playing, playerAction };
    }),
  }
});
