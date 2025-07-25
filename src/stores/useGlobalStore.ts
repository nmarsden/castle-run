import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEGMENT_DIFFICULT_BAGS_BY_WAVE_NUM, SegmentDifficulty, TOTAL_NUM_WAVES, WAVE_COLORS_BY_WAVE_NUM, WAVE_DATA_SEGMENTS_BY_DIFFICULTY, WaveData } from './waveData';
import { Sounds } from '../utils/sounds';
import { Color } from 'three';

export type EnemyType = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';

export type ThreatInfo = {
  id: string;
  waveNum: number;
  position: [number, number, number];
};

export type EnemyInfo = {
  id: string;
  waveNum: number;
  position: [number, number, number];
  type: EnemyType;
  threats: ThreatInfo[];
}

export type PowerUpType = 'HEALTH';

export type PowerUpInfo = {
  id: string;
  waveNum: number;
  position: [number, number, number];
  type: PowerUpType;
}

type Wave = {
  enemies: EnemyInfo[];
  powerUps: PowerUpInfo[];
  maxGameProgress: number;
};

const NO_POWER_UP_ID = '';
const NO_ENEMY_ID = '';

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
      // [ +4, +4 ],
      [ -1, +1 ],
      [ -2, +2 ],
      [ -3, +3 ],
      // [ -4, +4 ],
      [ +1, -1 ],
      [ +2, -2 ],
      [ +3, -3 ],
      // [ +4, -4 ],
      [ -1, -1 ],
      [ -2, -2 ],
      [ -3, -3 ],
      // [ -4, -4 ],
      [ +0, +1 ],
      [ +0, +2 ],
      [ +0, +3 ],
      // [ +0, +4 ],
      [ +0, -1 ],
      [ +0, -2 ],
      [ +0, -3 ],
      // [ +0, -4 ],
      [ +1, +0 ],
      [ +2, +0 ],
      [ +3, +0 ],
      // [ +4, +0 ],
      [ -1, +0 ],
      [ -2, +0 ],
      [ -3, +0 ],
      // [ -4, +0 ],
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
  if (type === 'QUEEN') return 0.79;
  if (type === 'KING') return 0.93;
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
      waveNum: enemy.waveNum,
      position: [enemyX + offset[0], y, enemyZ + offset[1]]
    }
  });
  return threats.filter(threat => {
    return (threat.position[0] >= -2 && threat.position[0] <= 2);
  });
};

const pickSegmentDifficulties = (waveNum: number): SegmentDifficulty[] => {
  // TODO fix performance problem when more than 25 segments
  const numSegments = 25;
  // const numSegments = 50;
  const difficultyBag = SEGMENT_DIFFICULT_BAGS_BY_WAVE_NUM.get(waveNum) as SegmentDifficulty[];

  // Pick random difficulties from the bag
  const difficulties: SegmentDifficulty[] = [];
  for (let i=0; i<numSegments; i++) {
    const index = Math.floor(Math.random() * difficultyBag.length);
    const difficulty = difficultyBag[index];

    difficulties.push(difficulty);
  }
  return difficulties;
}

const pickRandomWaveDataSegment = (difficulty: SegmentDifficulty): WaveData => {
  const waveDataSegments = WAVE_DATA_SEGMENTS_BY_DIFFICULTY.get(difficulty) as WaveData[];
  const numAvailableSegments = waveDataSegments.length;
  const index = Math.floor(Math.random() * numAvailableSegments);
  return waveDataSegments[index];
};

const generateWaveData = (waveNum: number): WaveData => {
  // DEBUG
  // return [
  //     '_____',
  //     '__p__',
  //     '____h',
  // ];

  const waveData: WaveData = [];

  // Add wave data segments according to the picked segment difficulties for the waveNum
  const difficulties = pickSegmentDifficulties(waveNum); 
  difficulties.forEach(difficulty => {
    const waveDataSegment = pickRandomWaveDataSegment(difficulty);
    waveData.push(...waveDataSegment);
  });
  return waveData;
};

const setupNextWave = (waveNum: number, waveNumCompleted: number, waveNumCompletedBest: number) => {
  waveNum++;
  waveNumCompleted++;
  if (waveNumCompleted > waveNumCompletedBest) {
    waveNumCompletedBest++;
  }

  if (waveNum > TOTAL_NUM_WAVES) {
    Sounds.getInstance().playSoundFX('GAME_COMPLETE');

    return {
      playing: false,
      gameCompleted: true,
      waveNumCompleted,
      waveNumCompletedBest
    }
  };

  Sounds.getInstance().playSoundFX('WAVE_COMPLETE');

  return { 
    waveNum,
    waveNumCompleted,
    waveNumCompletedBest,
    waveCompleted: false,
    playerAction: 'NONE',
    powerUpHitId: NO_POWER_UP_ID,
    threatHitId: '',
    enemyHitId: NO_ENEMY_ID,
    allEnemyHitIds: [],
    allPowerUpHitIds: [],
    lastThreatHit: { id: '', time: 0 },
    waveColor: getWaveColor(waveNum)
  };
};

const generateWaves = (): Map<number, Wave> => {
  const waves = new Map<number, Wave>();
  let gameProgress = 0;
  for (let waveNum=1; waveNum <= TOTAL_NUM_WAVES; waveNum++) {
    const wave = generateWave(waveNum, gameProgress);
    waves.set(waveNum, wave);
    gameProgress = wave.maxGameProgress;
  }
  return waves;
};

const generateWave = (waveNum: number, gameProgress: number): Wave => {
  const waveData: WaveData = generateWaveData(waveNum);
  const enemies: EnemyInfo[] = [];
  const powerUps: PowerUpInfo[] = [];

  // Populate enemies & powerUps
  const waveStartBuffer = 20;
  let z = -gameProgress - waveStartBuffer;
  let id = 0;
  for (let i = waveData.length-1; i >= 0; i--) {
    const squares = waveData[i].split('');
    for (let j = 0; j<squares.length; j++) {
      const square = squares[j];
      const x = j - 2;
      const enemyType = getEnemyType(square);
      if (enemyType) {
        const y = getPositionY(enemyType);
        enemies.push({ id: `${waveNum}-${id}`, waveNum, position: [x, y, z], type: enemyType, threats: [] });
        id++;
      }
      const powerUpType = getPowerUpType(square);
      if (powerUpType) {
        const y = -0.25;
        powerUps.push({ id: `${waveNum}-${id}`, waveNum, position: [x, y, z], type: powerUpType });
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
  // TODO Populate powerUps
  // TODO Calculate how many health powerUps to add
  // TODO Calculate available positions for powerUps
  // TODO Place powerUps

  // Populate length
  const waveEndBuffer = 7;
  const maxGameProgress = gameProgress + waveStartBuffer + waveData.length + waveEndBuffer;

  return { enemies, powerUps, maxGameProgress };
}

export type PlayerAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'NONE';

type Colors = {
  background1: string;
  background2: string;
  player1: string;
  player2: string;
  playerFlash: string;
  thruster: string;
  ground: string;
  enemy: string;
  threat1: string;
  threat2: string;
  threatHit: string;
  health1: string;
  health2: string;
  healthContainer: string;
  powerUpHealth: string;
};

type Hits = {
  enemyId: string;
  threatId: string;
  threatPosition: [number, number, number];
  powerUpId: string; 
}

const isCloseTo = (a: number, b: number): boolean => {
  return a > (b - 0.05) && a < (b + 0.05);
};

const getHits = (wave: Wave, gameProgress: number, playerXOffset: number, playerZOffset: number, allEnemyHitIds: string[], allPowerUpHitIds: string[]): Hits => {
  // const getHitsTimeStart = performance.now();  

  // Calculate wave Z position
  const waveZPos = Math.floor((gameProgress * -1) - 0.7 + playerZOffset);

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

  const enemyId = hitEnemies.length > 0 ? hitEnemies[0].id : NO_ENEMY_ID;
  const threatId = hitThreats.length > 0 ? hitThreats[0].id : '';
  const threatPosition = (hitThreats.length > 0 ? [playerXOffset, 0, playerZOffset] : [0, 0, 0]) as [number, number, number];
  const powerUpId = hitPowerUps.length > 0 ? hitPowerUps[0].id : NO_POWER_UP_ID;

  // performance.measure("getHits() Complete", {
  //   start: getHitsTimeStart,
  //   detail: {
  //     devtools: {
  //       dataType: "track-entry",
  //       track: "getHits() Tasks",
  //       trackGroup: "Castle Run Tracks", // Group related tracks together
  //       color: "tertiary-dark",
  //       // properties: [
  //       //   ["Filter Type", "Gaussian Blur"],
  //       //   ["Resize Dimensions", "500x300"]
  //       // ],
  //       // tooltipText: "Image processed successfully"
  //     }
  //   }
  // });

  return {
    enemyId,
    threatId,
    threatPosition,
    powerUpId
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

const isWaveCompleted = (wave: Wave, gameProgress: number): boolean => {
  return gameProgress > wave.maxGameProgress;
};

const getWaveColor = (waveNum: number): Color => {
  return WAVE_COLORS_BY_WAVE_NUM.get(waveNum) as Color;
};

export type GlobalState = {
  playing: boolean;
  gameCompleted: boolean;
  playCount: number;
  waveNum: number;
  waveNumCompleted: number;
  waveNumCompletedBest: number;
  gameProgress: number;
  waveCompleted: boolean;
  groundSpeed: number;
  playerAction: PlayerAction;
  playerXOffset: number;
  playerZOffset: number;
  playerHealthMax: number;
  playerHealth: number;
  powerUpHitId: string;
  threatHitId: string;
  threatHitPosition: [number, number, number];
  enemyHitId: string;
  allEnemyHitIds: string[];
  allPowerUpHitIds: string[];
  lastThreatHit: { id: string; time: number }
  colors: Colors;
  soundFXOn: boolean;
  musicOn: boolean;
  bloomEffect: boolean;
  emissiveIntensity: number;
  generatedWaves: Map<number, Wave>;
  waveColor: Color;

  setGroundSpeed: (groundSpeed: number) => void;
  play: () => void;
  toggleMusic: () => void;
  toggleSoundFx: () => void;
  setPlayerAction: (playerAction: PlayerAction) => void;
  setGameProgressDelta: (gameProgressDelta: number) => void;
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
        gameCompleted: false,
        playCount: 0,
        waveNum: 0,
        waveNumCompleted: 0,
        waveNumCompletedBest: 0,
        gameProgress: 0,
        waveCompleted: false,
        groundSpeed: 4,
        playerAction: 'NONE',
        playerXOffset: 0,
        playerZOffset: 0,
        playerHealthMax: 4,
        playerHealth: -1,
        powerUpHitId: NO_POWER_UP_ID,
        threatHitId: '',
        threatHitPosition: [0, 0, 0],
        enemyHitId: NO_ENEMY_ID,
        allEnemyHitIds: [],
        allPowerUpHitIds: [],
        lastThreatHit: { id: '', time: 0 },
        colors: {
          background1: '#000000',     // #000000
          background2: '#FFFFFF',     // #FFFFFF
          player1: '#ebe013',         // #EBAE13 #ebe013
          player2: '#f2cc6c',         // #9b7411 #efbe44 #f2cc6c
          playerFlash: '#ebd013',     // #eb2913 #e25636 #ebd013
          thruster: '#004e69',        // #33ccff #00769d #004e69
          ground: '#1a1a1a',          // #1a1a1a #E0E0E0 
          enemy: '#BABABA',           // #BABABA
          threat1: '#ff0c0c',         // #ff0c0c #FF2929
          threat2: '#000000',         // #000000
          threatHit: '#FFA500',       // #FFA500
          health1: '#1aff00',         // #52FF3F #94ff88 #15d100 #1aff00
          health2: '#46ff00',         // #01440a #0aad20 #ffffff #7dfff8 #46ff00
          healthContainer: '#a3a3a3', // #ebe013 #623d3d #a3a3a3
          powerUpHealth: '#52FF3F'    // #52FF3F
        },
        soundFXOn: true,
        musicOn: true,
        bloomEffect: true,
        emissiveIntensity: 30,
        generatedWaves: new Map(),
        waveColor: new Color("#FFFFFF"),

        setGroundSpeed: (groundSpeed: number) => set(() => {
          return { groundSpeed };
        }),

        play: () => set(({ playCount, playerHealthMax }) => {
          playCount++; 
          const generatedWaves = generateWaves();

          // console.log('generatedWave=', generatedWaves);

          return { 
            playing: true, 
            gameCompleted: false,
            playCount,
            waveNum: 1,
            waveNumCompleted: 0,
            gameProgress: 0,
            waveCompleted: false,
            playerAction: 'NONE',
            playerXOffset: 0,
            playerZOffset: 0,
            playerHealth: playerHealthMax,
            powerUpHitId: NO_POWER_UP_ID,
            threatHitId: '',
            enemyHitId: NO_ENEMY_ID,
            allEnemyHitIds: [],
            allPowerUpHitIds: [],
            lastThreatHit: { id: '', time: 0 },
            generatedWaves,
            waveColor: getWaveColor(1)
          };
        }),

        toggleMusic: () => set(({ musicOn }) => ({ musicOn: !musicOn })),

        toggleSoundFx: () => set(({ soundFXOn }) => ({ soundFXOn: !soundFXOn })),
        
        setPlayerAction: (playerAction: PlayerAction) => set(({ playing }) => {
          if (!playing) return {};

          // Update playing & playerAction state
          return { playing, playerAction };
        }),

        setGameProgressDelta: (gameProgressDelta: number) => set(({ 
          playerXOffset, playerZOffset, playing, playerHealthMax, playerHealth, threatHitId, threatHitPosition, lastThreatHit, enemyHitId, allEnemyHitIds, 
          powerUpHitId, allPowerUpHitIds, gameProgress, waveCompleted, waveNum, waveNumCompleted, waveNumCompletedBest, generatedWaves 
        }) => {
          if (!playing) return {};

          // const setGameProgressDeltaTimeStart = performance.now();  

          gameProgress += gameProgressDelta;

          const wave = generatedWaves.get(waveNum) as Wave;

          const hits = getHits(wave, gameProgress, playerXOffset, playerZOffset, allEnemyHitIds, allPowerUpHitIds)
          if (isThreatHitValid(hits.threatId, lastThreatHit)) {
            threatHitId = hits.threatId;
            threatHitPosition = hits.threatPosition;
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
            if (playerHealth < playerHealthMax) {
              playerHealth++;
            }
          } else {
            powerUpHitId = NO_POWER_UP_ID;
          }

          waveCompleted  = isWaveCompleted(wave, gameProgress);
          let nextWave = {};
          if (waveCompleted) {
            nextWave = setupNextWave(waveNum, waveNumCompleted, waveNumCompletedBest);
          }

          // performance.measure("setGameProgressDelta() Complete", {
          //   start: setGameProgressDeltaTimeStart,
          //   detail: {
          //     devtools: {
          //       dataType: "track-entry",
          //       track: "setGameProgressDelta() Tasks",
          //       trackGroup: "Castle Run Tracks",
          //       color: "tertiary-dark",
          //     }
          //   }
          // });

          return { 
            playing, playerHealth, threatHitId, threatHitPosition, lastThreatHit, enemyHitId, allEnemyHitIds, 
            powerUpHitId, allPowerUpHitIds, gameProgress, waveCompleted, ...nextWave };
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
        waveNumCompletedBest: state.waveNumCompletedBest,
      }),
    }
  )
);
