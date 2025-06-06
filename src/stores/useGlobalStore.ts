import { create } from 'zustand'

type WaveData = string[];

const WAVE_DATA: WaveData = [
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
  '4_5_1',
  '_____',
  '_____',
  '_2_3_',
  '_____',
  '_____',
  '__1__'
];

export type EnemyType = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';

type EnemyInfo = {
  position: [number, number, number];
  type: EnemyType;
}
type Wave = {
  enemies: EnemyInfo[];
};

const ENEMY_CODE_TO_TYPE = new Map<String, EnemyType>([
  ['1', 'PAWN'],
  ['2', 'KNIGHT'],
  ['3', 'BISHOP'],
  ['4', 'QUEEN'],
  ['5', 'KING'],
]);

const getEnemyType = (code: string): EnemyType | undefined => {
  return ENEMY_CODE_TO_TYPE.get(code);
};

const getPositionY = (type: EnemyType): number => {
  if (type === 'PAWN' || type === 'KNIGHT') return -0.175;
  return 0.5;
};

const populateWave = (waveData: WaveData): Wave => {
  const enemies: EnemyInfo[] = [];
  let z = -7;
  for (let i = waveData.length-1; i >= 0; i--) {
    const squares = waveData[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      const x = j - 2;
      const type = getEnemyType(square);
      if (type) {
        const y = getPositionY(type);
        enemies.push({ position: [x, y, z], type });
      }
    }
    z--;
  }
  return { enemies };
}

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';

export type GlobalState = {
  playing: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;
  wave: Wave;

  setPlayerAction: (playerAction: PlayerAction) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playing: false,
    groundSpeed: 1.75,
    playerAction: 'NONE',
    wave: populateWave(WAVE_DATA),

    setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
      // Trigger playing on any player action
      if (!playing && playerAction !== 'NONE') playing = true;

      // Update playing & playerAction state
      return { playing, playerAction };
    }),
  }
});
