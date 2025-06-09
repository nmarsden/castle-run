import {useEffect} from "react";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

const Waves = () => {
  const waveCompleted = useGlobalStore((state: GlobalState) => state.waveCompleted);
  const playNextWave = useGlobalStore((state: GlobalState) => state.playNextWave);  

  useEffect(() => {
    if (waveCompleted) {
      playNextWave();
    }
  }, [waveCompleted]);

  return <></>;
}

export default Waves;