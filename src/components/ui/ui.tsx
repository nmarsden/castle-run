import { GlobalState, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';

export default function Ui() {
  const play = useGlobalStore((state: GlobalState) => state.play);  
  const playing = useGlobalStore((state: GlobalState) => state.playing);  
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);  

  return (
    <>
      <div className={`overlay ${playing ? 'hide' : 'show'}`}>
          {playCount === 0 ? (
            <div className="overlayHeading">CASTLE RUN</div>
          ) : (
            <div className="overlayHeading">GAME OVER</div>
          )}
          <div className="button-light button-pulse" onClick={() => play()}>PLAY</div>
      </div>
    </>
  )
}