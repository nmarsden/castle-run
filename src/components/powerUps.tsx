import { useMemo } from "react";
import { GlobalState, PowerUpInfo, useGlobalStore } from "../stores/useGlobalStore";
import PowerUp from "./powerUp";

export default function PowerUps (){
  const generatedWaves = useGlobalStore((state: GlobalState) => state.generatedWaves);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);

  const powerUps: PowerUpInfo[] = useMemo(() => {
    const powerUps = [...generatedWaves.values()].flatMap(wave => wave.powerUps);
    
    // console.log('# powerUps = ', powerUps.length);

    return powerUps;
    
  }, [generatedWaves]);
  
  return (
    <>
      {powerUps.map((powerUp, index) => <PowerUp key={`power-up-${playCount}-${index}`} {...powerUp} />)}
    </>
  );
}