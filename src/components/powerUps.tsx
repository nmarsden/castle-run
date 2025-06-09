import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import PowerUp from "./powerUp";

export default function PowerUps (){
  const wave = useGlobalStore((state: GlobalState) => state.wave);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);
  const waveNum = useGlobalStore((state: GlobalState) => state.waveNum);

  return (
    <>
      {wave.powerUps.map((powerUp, index) => <PowerUp key={`power-up-${playCount}-${waveNum}-${index}`} {...powerUp} />)}
    </>
  );
}