import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WAVE_DATA, WaveData } from './waveData';
import { Sounds } from '../utils/sounds';

export type EnemyType = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';

export type ThreatInfo = {
  id: string;
  position: [number, number, number];
};

export type EnemyInfo = {
  id: number;
  position: [number, number, number];
  type: EnemyType;
  threats: ThreatInfo[];
}

export type PowerUpType = 'HEALTH';

export type PowerUpInfo = {
  id: number;
  position: [number, number, number];
  type: PowerUpType;
}

type Wave = {
  enemies: EnemyInfo[];
  powerUps: PowerUpInfo[];
  length: number;
};

const EMPTY_WAVE: Wave = {
  enemies: [],
  powerUps: [],
  length: 0
};

const NO_POWER_UP_ID = -1;
const NO_ENEMY_ID = -1;

const ENEMY_CODE_TO_TYPE = new Map<String, EnemyType>([
  ['p', 'PAWN'],
  ['k', 'KNIGHT'],
  ['b', 'BISHOP'],
  ['q', 'QUEEN'],
  ['K', 'KING'],
]);

const POWER_UP_CODE_TO_TYPE = new Map<String, PowerUpType>([
  ['h', 'HEALTH']
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

const getPowerUpType = (code: string): PowerUpType | undefined => {
  return POWER_UP_CODE_TO_TYPE.get(code);
};

const getPositionY = (type: EnemyType): number => {
  if (type === 'PAWN' || type === 'KNIGHT') return -0.175;
  return 0.5;
};

const calcThreats = (enemy: EnemyInfo): ThreatInfo[] => {
  const y = -0.5099;
  const enemyX = enemy.position[0];
  const enemyZ = enemy.position[2];
  const threatOffsets = THREAT_OFFSETS.get(enemy.type) as [number, number][];
  const threats: ThreatInfo[] = threatOffsets.map((offset, index) => {
    return {
      id: `${enemy.id}_${index}`,
      position: [enemyX + offset[0], y, enemyZ + offset[1]]
    }
  });
  return threats.filter(threat => {
    return (threat.position[0] >= -2 && threat.position[0] <= 2);
  });
};

const populateWave = (waveNum: number, waveProgress: number): Wave => {
  const waveData: WaveData = WAVE_DATA[waveNum - 1];
  const enemies: EnemyInfo[] = [];
  const powerUps: PowerUpInfo[] = [];

  // Populate enemies & powerUps
  let z = waveProgress - 1;
  let id = 0;
  for (let i = waveData.length-1; i >= 0; i--) {
    const squares = waveData[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      const x = j - 2;
      const enemyType = getEnemyType(square);
      if (enemyType) {
        const y = getPositionY(enemyType);
        enemies.push({ id, position: [x, y, z], type: enemyType, threats: [] });
        id++;
      }
      const powerUpType = getPowerUpType(square);
      if (powerUpType) {
        const y = -0.25;
        powerUps.push({ id, position: [x, y, z], type: powerUpType });
        id++;
      }
    }
    z--;
  }
  // Populate enemy threats
  for (let i=0; i<enemies.length; i++) {
    const enemy = enemies[i];
    enemy.threats.push(...calcThreats(enemy));
  }
  // Populate length
  const waveEndBuffer = 7;
  const length = waveData.length + waveEndBuffer;

  return { enemies, powerUps, length };
}

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';

type Colors = {
  background1: string;
  background2: string;
  player: string;
  playerFlash: string;
  ground: string;
  enemy: string;
  threat1: string;
  threat2: string;
  threatHit: string;
  healthOn: string;
  healthOff: string;
  powerUpHealth: string;
};

type Hits = {
  enemyId: number;
  threatId: string;
  powerUpId: number; 
}

const isCloseTo = (a: number, b: number): boolean => {
  return a > (b - 0.05) && a < (b + 0.05);
};

const getHits = (wave: Wave, waveProgress: number, playerXOffset: number, playerZOffset: number, allEnemyHitIds: number[], allPowerUpHitIds: number[]): Hits => {
  // Calculate wave Z position
  const waveZPos = Math.floor((waveProgress * -1) - 0.7 + playerZOffset);

  // Get remaining enemies
  const enemies = wave.enemies.filter(enemy => !allEnemyHitIds.includes(enemy.id));

  // -- Check for threat hits
  const hitThreats: ThreatInfo[] = [];
  for (let i=0; i<enemies.length; i++) {
    const foundThreats = enemies[i].threats.filter(threat => {
      return threat.position[0] === playerXOffset && isCloseTo(threat.position[2], waveZPos)
    });
    hitThreats.push(...foundThreats);
  }

  // -- Check for enemy hits
  const hitEnemies = enemies.filter(enemy => {
    return enemy.position[0] === playerXOffset && isCloseTo(enemy.position[2], waveZPos)
  });

  // Get remaining powerUps
  const powerUps = wave.powerUps.filter(powerUp => !allPowerUpHitIds.includes(powerUp.id));

  // -- Check for powerUp hits
  const hitPowerUps = powerUps.filter(powerUp => {
    return powerUp.position[0] === playerXOffset && isCloseTo(powerUp.position[2], waveZPos)
  });

  return {
    enemyId: hitEnemies.length > 0 ? hitEnemies[0].id : NO_ENEMY_ID,
    threatId: hitThreats.length > 0 ? hitThreats[0].id : '',
    powerUpId: hitPowerUps.length > 0 ? hitPowerUps[0].id : NO_POWER_UP_ID
  }
};

const isThreatHitValid = (threatHitId: string, lastThreatHit: { id: string, time: number }): boolean => {
  // Threat is not valid if empty
  if (threatHitId === '') return false;

  // Threat is not valid if repeated in less than 1 second
  if (threatHitId === lastThreatHit.id) {
    const timeSinceLastThreatHit = new Date().getTime() - lastThreatHit.time;
    if (timeSinceLastThreatHit < 1000) return false;
  }

  return true;
}

const isWaveCompleted = (wave: Wave, waveProgress: number): boolean => {
  return waveProgress > wave.length;
};

export type GlobalState = {
  playing: boolean;
  playCount: number;
  waveNum: number;
  waveProgress: number;
  waveCompleted: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;
  playerXOffset: number;
  playerZOffset: number;
  playerHealth: number;
  powerUpHitId: number;
  threatHitId: string;
  enemyHitId: number;
  allEnemyHitIds: number[];
  allPowerUpHitIds: number[];
  lastThreatHit: { id: string; time: number }
  wave: Wave;
  colors: Colors;
  soundFXOn: boolean;
  musicOn: boolean;
  bloomEffect: boolean;
  emissiveIntensity: number;

  setGroundSpeed: (groundSpeed: number) => void;
  play: () => void;
  playNextWave: () => void;
  toggleMusic: () => void;
  toggleSoundFx: () => void;
  setPlayerAction: (playerAction: PlayerAction) => void;
  setWaveProgressDelta: (waveProgressDelta: number) => void;
  setPlayerXOffset: (playerXOffset: number) => void;
  setPlayerZOffset: (playerZOffset: number) => void;
  setColors: (colors: Colors) => void;
  setBloomEffect: (bloomEffect: boolean) => void;
  setEmissiveIntensity: (emissiveIntensity: number) => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: false,
        playCount: 0,
        waveNum: 0,
        waveProgress: 0,
        waveCompleted: false,
        groundSpeed: 4,
        playerAction: 'NONE',
        playerXOffset: 0,
        playerZOffset: 0,
        playerHealth: 0,
        powerUpHitId: NO_POWER_UP_ID,
        threatHitId: '',
        enemyHitId: NO_ENEMY_ID,
        allEnemyHitIds: [],
        allPowerUpHitIds: [],
        lastThreatHit: { id: '', time: 0 },
        wave: EMPTY_WAVE,
        colors: {
          background1: '#000000',   // #000000
          background2: '#FFFFFF',   // #FFFFFF
          player: '#EBAE13',        // #EBAE13
          playerFlash: '#E25636',   // #E25636
          ground: '#E0E0E0',        // #E0E0E0
          enemy: '#BABABA',         // #BABABA
          threat1: '#FF2929',       // #FF2929
          threat2: '#000000',       // #000000
          threatHit: '#FFA500',     // #FFA500
          healthOn: '#52FF3F',      // #52FF3F
          healthOff: '#000000',     // #000000
          powerUpHealth: '#52FF3F'  // #52FF3F
        },
        soundFXOn: true,
        musicOn: true,
        bloomEffect: false,
        emissiveIntensity: 1.32,

        setGroundSpeed: (groundSpeed: number) => set(() => {
          return { groundSpeed };
        }),

        play: () => set(({ playCount }) => {
          playCount++; 

          return { 
            playing: true, 
            playCount,
            waveNum: 1,
            waveProgress: 0,
            waveCompleted: false,
            wave: populateWave(1, 0),
            playerAction: 'NONE',
            playerXOffset: 0,
            playerZOffset: 0,
            playerHealth: 5,
            powerUpHitId: NO_POWER_UP_ID,
            threatHitId: '',
            enemyHitId: NO_ENEMY_ID,
            allEnemyHitIds: [],
            allPowerUpHitIds: [],
            lastThreatHit: { id: '', time: 0 },        
          };
        }),

        playNextWave: () => set(({ waveNum, waveProgress }) => {
          waveNum++;
          if (waveNum > WAVE_DATA.length) {
            waveNum = 1;
          }

          return { 
            waveNum,
            waveCompleted: false,
            wave: populateWave(waveNum, waveProgress),
            playerAction: 'NONE',
            powerUpHitId: NO_POWER_UP_ID,
            threatHitId: '',
            enemyHitId: NO_ENEMY_ID,
            allEnemyHitIds: [],
            allPowerUpHitIds: [],
            lastThreatHit: { id: '', time: 0 },        
          };
        }),

        toggleMusic: () => set(({ musicOn }) => ({ musicOn: !musicOn })),

        toggleSoundFx: () => set(({ soundFXOn }) => ({ soundFXOn: !soundFXOn })),
        
        setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
          if (!playing) return {};

          // Update playing & playerAction state
          return { playing, playerAction };
        }),

        setWaveProgressDelta: (waveProgressDelta: number) => set(({ wave, playerXOffset, playerZOffset, playing, playerHealth, threatHitId, lastThreatHit, enemyHitId, allEnemyHitIds, powerUpHitId, allPowerUpHitIds, waveProgress, waveCompleted }) => {
          if (!playing) return {};

          waveProgress += waveProgressDelta;

          const hits = getHits(wave, waveProgress, playerXOffset, playerZOffset, allEnemyHitIds, allPowerUpHitIds)
          if (isThreatHitValid(hits.threatId, lastThreatHit)) {
            threatHitId = hits.threatId;
            lastThreatHit = { id: threatHitId, time: new Date().getTime() }
            // DEBUG: comment out next line to be invincible
            playerHealth--;
            if (playerHealth === 0) {
              playing = false;
            }
          } else {
            threatHitId = '';
          }
          if (hits.enemyId !== NO_ENEMY_ID) {
            enemyHitId = hits.enemyId;
            allEnemyHitIds.push(enemyHitId);
          } else {
            enemyHitId = NO_ENEMY_ID;
          }

          if (hits.powerUpId !== NO_POWER_UP_ID) {
            powerUpHitId = hits.powerUpId;
            allPowerUpHitIds.push(powerUpHitId);
            if (playerHealth < 5) {
              playerHealth++;
            }
          } else {
            powerUpHitId = NO_POWER_UP_ID;
          }

          waveCompleted  = isWaveCompleted(wave, waveProgress);
          if (waveCompleted) {
            Sounds.getInstance().playSoundFX('WAVE_COMPLETE');
            // Adjust waveProgress
            waveProgress = waveProgress - wave.length;
          }

          return { playing, playerHealth, threatHitId, lastThreatHit, enemyHitId, allEnemyHitIds, powerUpHitId, allPowerUpHitIds, waveProgress, waveCompleted };
        }),

        setPlayerXOffset: (playerXOffset: number) => set(() => ({ playerXOffset })),

        setPlayerZOffset: (playerZOffset: number) => set(() => ({ playerZOffset })),

        setColors: (colors: Colors) => set(() => ({ colors })),

        setBloomEffect: (bloomEffect: boolean) => set(() => ({ bloomEffect })),

        setEmissiveIntensity: (emissiveIntensity: number) => set(() => ({ emissiveIntensity })),
      }
    },
    {
      name: 'castle-run',
      partialize: (state) => ({ 
        soundFXOn: state.soundFXOn,
        musicOn: state.musicOn,
        bloomEffect: state.bloomEffect,
      }),
    }
  )
);
