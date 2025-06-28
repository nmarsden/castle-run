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
  const gameCompleted = useGlobalStore((state: GlobalState) => state.gameCompleted);  
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);
  const waveNum = useGlobalStore((state: GlobalState) => state.waveNum);
  const musicOn = useGlobalStore((state: GlobalState) => state.musicOn);
  const soundFXOn = useGlobalStore((state: GlobalState) => state.soundFXOn);
  const bloomEffect = useGlobalStore((state: GlobalState) => state.bloomEffect);
  const waveNumCompleted = useGlobalStore((state: GlobalState) => state.waveNumCompleted);
  const waveNumCompletedBest = useGlobalStore((state: GlobalState) => state.waveNumCompletedBest);

  const [showNewWaveMsg, setShowNewWaveMsg] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleBloom = useCallback(() => {
    setBloomEffect(!bloomEffect);
  }, [bloomEffect]);

  const toggleShowControls = useCallback(() => {
    setShowControls(!showControls);
  }, [showControls]);

  const toggleShowInfo = useCallback(() => {
    setShowInfo(!showInfo);
  }, [showInfo]);

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

      <div className={`overlay ${(playing || showControls || showInfo) ? 'hide' : 'show'}`}>
          {playCount === 0 ? (
            <div className="overlayHeading">
              <div className="fa-solid fa-chess-rook"></div>
              <div>CASTLE</div>
              <div>RUN</div>
            </div>
          ) : (
            <>
              <div className="overlayHeading">{gameCompleted? 'ALL CLEARED!' : 'GAME OVER'}</div>
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
            <div className="button-light button-toggle" onClick={() => toggleShowControls()}>CONTROLS</div>
            <div className="button-light button-toggle" onClick={() => toggleShowInfo()}>INFO</div>
          </div>
      </div>
      <div className={`overlay ${showControls ? 'show' : 'hide'}`}>
        <div className="overlayHeading">Controls</div>
        <div className="controlsSection">
          <div className="controlsGroup">
            <div className="fa-solid fa-keyboard"></div>
            <div className="controlsInfo">
              <div className="key"><i className="fa-solid fa-arrow-up"></i></div>
              <div className="controlsText">
                <div className="key"><i className="fa-solid fa-arrow-left"></i></div>
                <div className="key"><i className="fa-solid fa-arrow-down"></i></div>
                <div className="key"><i className="fa-solid fa-arrow-right"></i></div>
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
      <div className={`overlay ${showInfo ? 'show' : 'hide'}`}>
        <div className="overlayHeading">
          <div className="fa-solid fa-chess-rook"></div>
          <div>CASTLE</div>
          <div>RUN</div>
        </div>
        <div className="infoSubHeading">built by</div>
        <div className="infoBuiltBy">
          Neil Marsden |
          <a href="https://github.com/nmarsden/castle-run" target="_blank">github</a>|
          <a href="https://nmarsden.com" target="_blank">projects</a>
        </div>
        <div className="infoSubHeading">credits</div>
        <div className="infoCredits">
          <div className="infoCredit">
            <div className="infoCreditLabel">Models:</div>
            <a href="https://lowpolyassets.itch.io/low-poly-chess-set" target="_blank">Low Poly Chess Set</a>
          </div>
          <div className="infoCredit">
            <div className="infoCreditLabel">Music:</div>
            <a href="https://opengameart.org/content/another-space-background-track" target="_blank">Observing the star - yd</a>
          </div>
          <div className="infoCredit">
            <div className="infoCreditLabel"></div>
            <a href="https://opengameart.org/content/tower-defense-theme" target="_blank">Tower defense theme - DST</a>
          </div>
          <div className="infoCredit">
            <div className="infoCreditLabel">SFX:</div>
            <a href="https://dustyroom.com/free-casual-game-sounds" target="_blank">Casual Game Sounds</a>
          </div>
          <div className="infoCredit">
            <div className="infoCreditLabel">Icons:</div>
            <a href="https://fontawesome.com/" target="_blank">Font Awesome</a>
          </div>
          <div className="infoCredit">
            <div className="infoCreditLabel">Font:</div>
            <a href="https://fonts.google.com/specimen/Orbitron" target="_blank">Orbitron - Google Fonts</a>
          </div>
        </div>
        <div className="buttonGroup">
          <div className="button-light" onClick={() => toggleShowInfo()}>CLOSE</div>
        </div>
      </div>
    </>
  )
}