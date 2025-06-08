import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import PowerUp from "./powerUp";

export default function PowerUps (){
  const wave = useGlobalStore((state: GlobalState) => state.wave);

  return (
    <>
      {wave.powerUps.map((powerUp, index) => <PowerUp key={`power-up-${index}`} {...powerUp} />)}
    </>
  );
}