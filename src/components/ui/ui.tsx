import { useEffect, useState } from 'react';
import { GlobalState, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';
import { Sounds } from '../../utils/sounds';

export default function Ui() {
  const play = useGlobalStore((state: GlobalState) => state.play);  
  const toggleSoundFx = useGlobalStore((state: GlobalState) => state.toggleSoundFx);
  const playing = useGlobalStore((state: GlobalState) => state.playing);  
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);
  const waveNum = useGlobalStore((state: GlobalState) => state.waveNum);
  const soundFXOn = useGlobalStore((state: GlobalState) => state.soundFXOn);

  const [showNewWaveMsg, setShowNewWaveMsg] = useState(false);

  useEffect(() => {
    if (waveNum !== 0) {
      setShowNewWaveMsg(true);
      setTimeout(() => setShowNewWaveMsg(false), 2000);
    }
  }, [waveNum]);

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

      <div className={`overlay ${playing ? 'hide' : 'show'}`}>
          {playCount === 0 ? (
            <div className="overlayHeading">CASTLE RUN</div>
          ) : (
            <div className="overlayHeading">GAME OVER</div>
          )}
          <div className="button-light button-pulse" onClick={() => play()}>PLAY</div>
          <div className="optionsContainer">
            <div className="button-light" onClick={() => toggleSoundFx()}>SFX: {soundFXOn ? 'ON' : 'OFF'}</div>
          </div>
      </div>
    </>
  )
}