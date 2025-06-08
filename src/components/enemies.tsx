import Enemy from "./enemy";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Enemies (){
  const wave = useGlobalStore((state: GlobalState) => state.wave);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);

  return (
    <>
      {wave.enemies.map((enemy, index) => <Enemy key={`enemy-${playCount}-${index}`} {...enemy} />)}
    </>
  );
}