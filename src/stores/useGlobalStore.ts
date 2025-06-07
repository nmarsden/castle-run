import { create } from 'zustand'

type WaveData = string[];

const WAVE_DATA: WaveData = [
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_1___',
  '__1__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '__5__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '__4__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '__3__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '__2__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
  '__1__'
];
// const WAVE_DATA: WaveData = [
//   '_1_1_',
//   '_____',
//   '_____',
//   '1_1_1',
//   '_____',
//   '_____',
//   '_1_1_',
//   '_____',
//   '_____',
//   '_1_1_',
//   '_____',
//   '_____',
//   '1_1_1',
//   '_____',
//   '_____',
//   '_1_1_',
//   '_____',
//   '_____',
//   '_1_1_',
//   '_____',
//   '_____',
//   '4_5_1',
//   '_____',
//   '_____',
//   '_2_3_',
//   '_____',
//   '_____',
//   '__1__'
// ];

export type EnemyType = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';

type ThreatInfo = [number, number, number];

type EnemyInfo = {
  position: [number, number, number];
  type: EnemyType;
  threats: ThreatInfo[];
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

const THREAT_OFFSETS = new Map<EnemyType, [number, number][]>([
  ['PAWN', [
      [ -1, +1 ],
      [ +1, +1 ]
    ]
  ],
  ['KNIGHT', [
      [ -2, +1 ],
      [ -2, -1 ],
      [ +2, +1 ],
      [ +2, -1 ],
      [ +1, -2 ],
      [ -1, -2 ],
      [ +1, +2 ],
      [ -1, +2 ],
    ]
  ],
  ['BISHOP', [
      [ +1, +1 ],
      [ +2, +2 ],
      [ +3, +3 ],
      [ +4, +4 ],
      [ -1, +1 ],
      [ -2, +2 ],
      [ -3, +3 ],
      [ -4, +4 ],
      [ +1, -1 ],
      [ +2, -2 ],
      [ +3, -3 ],
      [ +4, -4 ],
      [ -1, -1 ],
      [ -2, -2 ],
      [ -3, -3 ],
      [ -4, -4 ],
    ]
  ],
  ['QUEEN', [
      [ +1, +1 ],
      [ +2, +2 ],
      [ +3, +3 ],
      [ +4, +4 ],
      [ -1, +1 ],
      [ -2, +2 ],
      [ -3, +3 ],
      [ -4, +4 ],
      [ +1, -1 ],
      [ +2, -2 ],
      [ +3, -3 ],
      [ +4, -4 ],
      [ -1, -1 ],
      [ -2, -2 ],
      [ -3, -3 ],
      [ -4, -4 ],
      [ +0, +1 ],
      [ +0, +2 ],
      [ +0, +3 ],
      [ +0, +4 ],
      [ +0, -1 ],
      [ +0, -2 ],
      [ +0, -3 ],
      [ +0, -4 ],
      [ +1, +0 ],
      [ +2, +0 ],
      [ +3, +0 ],
      [ +4, +0 ],
      [ -1, +0 ],
      [ -2, +0 ],
      [ -3, +0 ],
      [ -4, +0 ],
  ]],
  ['KING', [
      [ +1, -1 ],
      [ +1, +0 ],
      [ +1, +1 ],
      [ +0, -1 ],
      [ +0, +1 ],
      [ -1, -1 ],
      [ -1, +0 ],
      [ -1, +1 ],
  ]],
]);

const getEnemyType = (code: string): EnemyType | undefined => {
  return ENEMY_CODE_TO_TYPE.get(code);
};

const getPositionY = (type: EnemyType): number => {
  if (type === 'PAWN' || type === 'KNIGHT') return -0.175;
  return 0.5;
};

const calcThreats = (enemy: EnemyInfo): ThreatInfo[] => {
  const y = -0.5099;
  const enemyX = enemy.position[0];
  const enemyY = enemy.position[2];
  const threatOffsets = THREAT_OFFSETS.get(enemy.type) as [number, number][];
  const threats: ThreatInfo[] = threatOffsets.map(offset => [enemyX + offset[0], y, enemyY + offset[1]]);
  return threats.filter(threat => {
    return (threat[0] >= -2 && threat[0] <= 2);
  });
};

const populateWave = (waveData: WaveData): Wave => {
  const enemies: EnemyInfo[] = [];
  // Populate position & type
  let z = -7;
  for (let i = waveData.length-1; i >= 0; i--) {
    const squares = waveData[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      const x = j - 2;
      const type = getEnemyType(square);
      if (type) {
        const y = getPositionY(type);
        enemies.push({ position: [x, y, z], type, threats: [] });
      }
    }
    z--;
  }
  // Populate threats
  for (let i=0; i<enemies.length; i++) {
    const enemy = enemies[i];
    enemy.threats.push(...calcThreats(enemy));
  }

  return { enemies };
}

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';

type Colors = {
  player: string;
  ground: string;
  enemy: string;
  threat: string;
};

export type GlobalState = {
  playing: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;
  playerZOffset: number;
  wave: Wave;
  colors: Colors;

  setPlayerAction: (playerAction: PlayerAction) => void;
  setPlayerZOffset: (playerZOffset: number) => void;
  setColors: (colors: Colors) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playing: false,
    groundSpeed: 1.75,
    playerAction: 'NONE',
    playerZOffset: 0,
    wave: populateWave(WAVE_DATA),
    colors: {
      player: '#ffa500',
      ground: '#ffffff',
      enemy: '#ff4444',
      threat: '#ff4444'
    },

    setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
      // Trigger playing on any player action
      if (!playing && playerAction !== 'NONE') playing = true;

      // Update playing & playerAction state
      return { playing, playerAction };
    }),

    setPlayerZOffset: (playerZOffset: number) => set(() => {
      return { playerZOffset };
    }),

    setColors: (colors: Colors) => set(() => {
      return { colors };
    })
  }
});
