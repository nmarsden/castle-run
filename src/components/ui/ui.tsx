import { useEffect, useState, useCallback } from 'react';
import { GlobalState, useGlobalStore } from '../../stores/useGlobalStore';
import { Sounds } from '../../utils/sounds';
import './ui.css';

export default function Ui() {
  const play = useGlobalStore((state: GlobalState) => state.play);  
  const toggleMusic = useGlobalStore((state: GlobalState) => state.toggleMusic);
  const toggleSoundFx = useGlobalStore((state: GlobalState) => state.toggleSoundFx);
  const setBloomEffect = useGlobalStore((state: GlobalState) => state.setBloomEffect);

  const playing = useGlobalStore((state: GlobalState) => state.playing);  
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);
  const waveNum = useGlobalStore((state: GlobalState) => state.waveNum);
  const musicOn = useGlobalStore((state: GlobalState) => state.musicOn);
  const soundFXOn = useGlobalStore((state: GlobalState) => state.soundFXOn);
  const bloomEffect = useGlobalStore((state: GlobalState) => state.bloomEffect);
  const waveNumCompleted = useGlobalStore((state: GlobalState) => state.waveNumCompleted);
  const waveNumCompletedBest = useGlobalStore((state: GlobalState) => state.waveNumCompletedBest);

  const [showNewWaveMsg, setShowNewWaveMsg] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const toggleBloom = useCallback(() => {
    setBloomEffect(!bloomEffect);
  }, [bloomEffect]);

  const toggleShowControls = useCallback(() => {
    setShowControls(!showControls);
  }, [showControls]);

  useEffect(() => {
    Sounds.getInstance().playMusicTrack('IDLE');
  }, []);

  useEffect(() => {
    if (playing) {
      Sounds.getInstance().playMusicTrack('PLAYING');
    } else {
      Sounds.getInstance().playMusicTrack('IDLE');
    }
  }, [playing]);

  useEffect(() => {
    if (waveNum !== 0) {
      setShowNewWaveMsg(true);
      setTimeout(() => setShowNewWaveMsg(false), 2000);
    }
  }, [waveNum]);

  useEffect(() => {
    if (musicOn) {
      Sounds.getInstance().enableMusic();
    } else {
      Sounds.getInstance().disableMusic();
    }
  }, [musicOn]);

  useEffect(() => {
    if (soundFXOn) {
      Sounds.getInstance().enableSoundFX();
    } else {
      Sounds.getInstance().disableSoundFX();
    }
  }, [soundFXOn]);

  return (
    <>
      <div className={`messageContainer ${showNewWaveMsg ? 'show' : 'hide'}`}>
        <div className="message">WAVE #{waveNum}</div>
      </div>

      <div className={`overlay ${(playing || showControls) ? 'hide' : 'show'}`}>
          {playCount === 0 ? (
            <div className="overlayHeading">
              <div className="fa-solid fa-chess-rook"></div>
              <div>CASTLE</div>
              <div>RUN</div>
            </div>
          ) : (
            <>
              <div className="overlayHeading">GAME OVER</div>
              <div className="resultsContainer">
                <div>
                  <div className="resultLabel">COMPLETED</div>
                  <div>{waveNumCompleted} {waveNumCompleted === 1 ? 'WAVE' : 'WAVES'}</div>
                </div>
                <div>
                  <div className="resultLabel">BEST</div>
                  <div>{waveNumCompletedBest} {waveNumCompletedBest === 1 ? 'WAVE' : 'WAVES'}</div>
                </div>
              </div>
            </>
          )}
          <div className="button-light button-pulse" onClick={() => play()}>PLAY</div>
          <div className="buttonGroup">
            <div className="button-light button-toggle" onClick={() => toggleMusic()}>
              <span>MUSIC</span>
              <span>{musicOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="button-light button-toggle" onClick={() => toggleSoundFx()}>
              <span>SFX</span>
              <span>{soundFXOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="button-light button-toggle" onClick={() => toggleBloom()}>
              <span>BLOOM</span>
              <span>{bloomEffect ? 'ON' : 'OFF'}</span>
            </div>
          </div>
          <div className="buttonGroup">
            <div className="button-light" onClick={() => toggleShowControls()}>CONTROLS</div>
          </div>
      </div>
      <div className={`overlay ${showControls ? 'show' : 'hide'}`}>
        <div className="overlayHeading">Controls</div>
        <div className="controlsSection">
          <div className="controlsGroup">
            <div className="fa-solid fa-keyboard"></div>
            <div className="controlsInfo">
              <div className="key">W</div>
              <div className="controlsText">
                <div className="key">A</div>
                <div className="key">S</div>
                <div className="key">D</div>
              </div>
            </div>
          </div>
          <div className="controlsGroup">
            <div className="fa-solid fa-mobile-screen"></div>
            <div className="controlsInfo mobile">
              <span className="swipe-arrow"><i className="fa-solid fa-greater-than fa-rotate-270"></i></span>
              <div className="controlsText">
                <span className="swipe-arrow"><i className="fa-solid fa-greater-than fa-rotate-180"></i></span>
                <span className="swipe-text">SWIPE</span>
                <span className="swipe-arrow"><i className="fa-solid fa-greater-than"></i></span>
              </div>
              <span className="swipe-arrow"><i className="fa-solid fa-greater-than fa-rotate-90"></i></span>
            </div>
          </div>
        </div>
        <div className="buttonGroup">
          <div className="button-light" onClick={() => toggleShowControls()}>CLOSE</div>
        </div>
      </div>
    </>
  )
}