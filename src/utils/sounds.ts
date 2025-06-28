import { Howl } from 'howler';

export type MusicTrack = 'IDLE' | 'PLAYING';

export type SoundEffect = 'PLAYER_MOVE' | 'PLAYER_DIE' |
                          'HEALTH_INCREASE' | 'HEALTH_DECREASE' |
                          'ENEMY_SPAWN' | 'ENEMY_HIT' | 
                          'THREAT_SPAWN' | 'THREAT_HIT' | 
                          'HEALTH_SPAWN' | 'HEALTH_HIT' | 
                          'WAVE_COMPLETE' | 'GAME_COMPLETE';

const MUSIC_TRACKS: Map<MusicTrack, Howl> = new Map<MusicTrack, Howl>([
  ['IDLE',    new Howl({ src: ['audio/ObservingTheStar.mp3', 'audio/ObservingTheStar.webm'], format: ['mp3', 'webm'], loop: true, autoplay: true })],
  ['PLAYING', new Howl({ src: ['audio/DST-TowerDefenseTheme.mp3', 'audio/DST-TowerDefenseTheme.webm'], format: ['mp3', 'webm'], loop: true })],
]);

const SOUND_EFFECTS: Map<SoundEffect, Howl> = new Map<SoundEffect, Howl>([
  ['PLAYER_MOVE',     new Howl({ src: ['audio/DM-CGS-40.mp3', 'audio/DM-CGS-40.webm'], format: ['mp3', 'webm'] })],
  ['PLAYER_DIE',      new Howl({ src: ['audio/DM-CGS-08.mp3', 'audio/DM-CGS-08.webm'], format: ['mp3', 'webm'] })],

  ['HEALTH_INCREASE', new Howl({ src: ['audio/DM-CGS-28.mp3', 'audio/DM-CGS-28.webm'], format: ['mp3', 'webm'] })],
  ['HEALTH_DECREASE', new Howl({ src: ['audio/DM-CGS-25.mp3', 'audio/DM-CGS-25.webm'], format: ['mp3', 'webm'] })],

  ['ENEMY_SPAWN',     new Howl({ src: ['audio/DM-CGS-22.mp3', 'audio/DM-CGS-22.webm'], format: ['mp3', 'webm'] })],
  ['ENEMY_HIT',       new Howl({ src: ['audio/DM-CGS-31.mp3', 'audio/DM-CGS-31.webm'], format: ['mp3', 'webm'] })],

  ['THREAT_SPAWN',    new Howl({ src: ['audio/DM-CGS-14.mp3', 'audio/DM-CGS-14.webm'], format: ['mp3', 'webm'] })],
  ['THREAT_HIT',      new Howl({ src: ['audio/DM-CGS-29.mp3', 'audio/DM-CGS-29.webm'], format: ['mp3', 'webm'] })],

  ['HEALTH_SPAWN',    new Howl({ src: ['audio/DM-CGS-22.mp3', 'audio/DM-CGS-22.webm'], format: ['mp3', 'webm'] })],
  ['HEALTH_HIT',      new Howl({ src: ['audio/DM-CGS-15.mp3', 'audio/DM-CGS-15.webm'], format: ['mp3', 'webm'] })],

  ['WAVE_COMPLETE',   new Howl({ src: ['audio/DM-CGS-23.mp3', 'audio/DM-CGS-23.webm'], format: ['mp3', 'webm'] })],
  ['GAME_COMPLETE',   new Howl({ src: ['audio/DM-CGS-26.mp3', 'audio/DM-CGS-26.webm'], format: ['mp3', 'webm'] })],
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