import { Howl } from 'howler';

export type SoundEffect = 'PLAYER_MOVE' | 'PLAYER_DIE' |
                          'HEALTH_INCREASE' | 'HEALTH_DECREASE' |
                          'ENEMY_SPAWN' | 'ENEMY_HIT' | 
                          'THREAT_SPAWN' | 'THREAT_HIT' | 
                          'HEALTH_SPAWN' | 'HEALTH_HIT' | 
                          'WAVE_COMPLETE';

const SOUND_EFFECTS: Map<SoundEffect, Howl> = new Map<SoundEffect, Howl>([
  ['PLAYER_MOVE',     new Howl({ src: ['audio/DM-CGS-40.wav'], format: ['wav'] })],
  ['PLAYER_DIE',      new Howl({ src: ['audio/DM-CGS-08.wav'], format: ['wav'] })],

  ['HEALTH_INCREASE', new Howl({ src: ['audio/DM-CGS-28.wav'], format: ['wav'] })],
  ['HEALTH_DECREASE', new Howl({ src: ['audio/DM-CGS-25.wav'], format: ['wav'] })],

  ['ENEMY_SPAWN',     new Howl({ src: ['audio/DM-CGS-22.wav'], format: ['wav'] })],
  ['ENEMY_HIT',       new Howl({ src: ['audio/DM-CGS-31.wav'], format: ['wav'] })],

  ['THREAT_SPAWN',    new Howl({ src: ['audio/DM-CGS-14.wav'], format: ['wav'] })],
  ['THREAT_HIT',      new Howl({ src: ['audio/DM-CGS-29.wav'], format: ['wav'] })],

  ['HEALTH_SPAWN',    new Howl({ src: ['audio/DM-CGS-22.wav'], format: ['wav'] })],
  ['HEALTH_HIT',      new Howl({ src: ['audio/DM-CGS-15.wav'], format: ['wav'] })],

  ['WAVE_COMPLETE',   new Howl({ src: ['audio/DM-CGS-23.wav'], format: ['wav'] })],
])
                          
class Sounds {
  static instance: Sounds;

  soundFXOn: boolean;
  soundFXs: Map<SoundEffect, Howl>;

  static getInstance(): Sounds {
    if (typeof Sounds.instance === 'undefined') {
      Sounds.instance = new Sounds();
    }
    return Sounds.instance;
  }

  private constructor() {
    Howler.autoUnlock = false;

    this.soundFXOn = false;
    this.soundFXs = SOUND_EFFECTS;
  }

  enableSoundFX(): void {
    this.soundFXOn = true;
  }

  disableSoundFX(): void {
    this.soundFXOn = false;
  }

  playSoundFX(soundEffect: SoundEffect): void {
    if (!this.soundFXOn) return;
    // console.log('playSoundFx: ', soundEffect);

    // For testing!!!
    // if (soundEffect !== 'HEALTH_SPAWN') return;

    (this.soundFXs.get(soundEffect) as Howl).play();
  }
}

export { Sounds };