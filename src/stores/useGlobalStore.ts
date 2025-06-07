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
  '__1__',
  '_____',
  '_____',
  '_____',
  '_____',
  '_____',
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

export type ThreatInfo = {
  id: string;
  position: [number, number, number];
};

type EnemyInfo = {
  id: number;
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
  const threats: ThreatInfo[] = threatOffsets.map((offset, index) => {
    return {
      id: `${enemy.id}_${index}`,
      position: [enemyX + offset[0], y, enemyY + offset[1]]
    }
  });
  return threats.filter(threat => {
    return (threat.position[0] >= -2 && threat.position[0] <= 2);
  });
};

const populateWave = (waveData: WaveData): Wave => {
  const enemies: EnemyInfo[] = [];
  // Populate position & type
  let z = -1;
  let id = 0;
  for (let i = waveData.length-1; i >= 0; i--) {
    const squares = waveData[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      const x = j - 2;
      const type = getEnemyType(square);
      if (type) {
        const y = getPositionY(type);
        enemies.push({ id, position: [x, y, z], type, threats: [] });
        id++;
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

const getHitThreats = (wave: Wave, groundOffset: number, playerXOffset: number, playerZOffset: number): ThreatInfo[] => {
  // Calculate wave Z position
  const waveZPos = Math.floor((groundOffset * -2) - 0.7 - playerZOffset);

  // Find threats with a Z position matching the wave Z position
  const threats: ThreatInfo[] = [];
  for (let i=0; i<wave.enemies.length; i++) {
    const foundThreats = wave.enemies[i].threats.filter(threat => {
      return threat.position[2] === waveZPos
    });
    threats.push(...foundThreats);
  }

  // Limit threats with an X position matching the playerXOffset
  return threats.filter(threat => threat.position[0] === playerXOffset);
};

export type GlobalState = {
  playing: boolean;
  groundSpeed: number;
  groundOffset: number;
  playerAction: PlayerAction;
  playerXOffset: number;
  playerZOffset: number;
  playerHit: boolean;
  threatHitId: string;
  wave: Wave;
  colors: Colors;

  setGroundSpeed: (groundSpeed: number) => void;
  setPlayerAction: (playerAction: PlayerAction) => void;
  setGroundOffset: (groundOffset: number) => void;
  setPlayerXOffset: (playerXOffset: number) => void;
  setPlayerZOffset: (playerZOffset: number) => void;
  setColors: (colors: Colors) => void;
};

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    playing: false,
    groundSpeed: 1.75,
    groundOffset: 0,
    playerAction: 'NONE',
    playerXOffset: 0,
    playerZOffset: 0,
    playerHit: false,
    threatHitId: '',
    wave: populateWave(WAVE_DATA),
    colors: {
      player: '#ffa500',
      ground: '#ffffff',
      enemy: '#ff4444',
      threat: '#ff4444'
    },

    setGroundSpeed: (groundSpeed: number) => set(() => {
      return { groundSpeed };
    }),

    setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
      // Trigger playing on any player action
      if (!playing && playerAction !== 'NONE') playing = true;

      // Update playing & playerAction state
      return { playing, playerAction };
    }),

    setGroundOffset: (groundOffset: number) => set(({ wave, playerXOffset, playerZOffset, playing, playerHit, threatHitId }) => {
      const hitThreats = getHitThreats(wave, groundOffset, playerXOffset, playerZOffset)
      if (hitThreats.length > 0) {
        threatHitId = hitThreats[0].id;
        playerHit = true;
      }
      return { groundOffset, playing, playerHit, threatHitId };
    }),

    setPlayerXOffset: (playerXOffset: number) => set(() => ({ playerXOffset })),

    setPlayerZOffset: (playerZOffset: number) => set(() => ({ playerZOffset })),

    setColors: (colors: Colors) => set(() => ({ colors }))
  }
});
