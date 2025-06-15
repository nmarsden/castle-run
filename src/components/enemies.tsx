import Enemy from "./enemy";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Enemies (){
  const wave = useGlobalStore((state: GlobalState) => state.wave);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);
  const waveNum = useGlobalStore((state: GlobalState) => state.waveNum);

  return (
    <>
      {wave.enemies.map((enemy, index) => (
        <group key={`enemy-${playCount}-${waveNum}-${index}`} renderOrder={index}>
          <Enemy {...enemy} />
        </group>
      ))}
    </>
  );
}