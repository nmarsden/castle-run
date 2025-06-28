import { Howl } from 'howler';

export type MusicTrack = 'IDLE' | 'PLAYING';

export type SoundEffect = 'PLAYER_MOVE' | 'PLAYER_DIE' |
                          'HEALTH_INCREASE' | 'HEALTH_DECREASE' |
                          'ENEMY_SPAWN' | 'ENEMY_HIT' | 
                          'THREAT_SPAWN' | 'THREAT_HIT' | 
                          'HEALTH_SPAWN' | 'HEALTH_HIT' | 
                          'WAVE_COMPLETE' | 'GAME_COMPLETE';

const MUSIC_TRACKS: Map<MusicTrack, Howl> = new Map<MusicTrack, Howl>([
  ['IDLE',    new Howl({ src: ['audio/ObservingTheStar.ogg'], format: ['ogg'], loop: true, autoplay: true })],
  ['PLAYING', new Howl({ src: ['audio/DST-TowerDefenseTheme.mp3'], format: ['mp3'], loop: true })],
]);

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
  ['GAME_COMPLETE',   new Howl({ src: ['audio/DM-CGS-26.wav'], format: ['wav'] })],
])
                          
class Sounds {
  static instance: Sounds;

  musicOn: boolean;
  musicTracks: Map<MusicTrack, Howl>;
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

    this.musicOn = false;
    this.musicTracks = MUSIC_TRACKS;
    this.soundFXOn = false;
    this.soundFXs = SOUND_EFFECTS;
  }

  enableMusic(): void {
    this.musicOn = true;
    this.playMusicTrack('IDLE');
  }

  disableMusic(): void {
    this.musicOn = false;
    // Stop all music tracks
    for (const track of this.musicTracks.values()) {
       track.stop();
    }    
  }

  enableSoundFX(): void {
    this.soundFXOn = true;
  }

  disableSoundFX(): void {
    this.soundFXOn = false;
  }

  playMusicTrack(musicTrack: MusicTrack): void {
    if (!this.musicOn) return;
    // console.log('playMusicTrack: ', musicTrack);

    // Stop all music tracks
    for (const track of this.musicTracks.values()) {
       track.stop();
    }

    // Play selected music track
    (this.musicTracks.get(musicTrack) as Howl).play();
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