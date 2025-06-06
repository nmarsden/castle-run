import Enemy from "./enemy";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Enemies (){
  const wave = useGlobalStore((state: GlobalState) => state.wave);

  return (
    <>
      {wave.enemies.map((enemy, index) => <Enemy key={`enemy-${index}`} position={enemy.position} type={enemy.type} threats={enemy.threats} />)}
    </>
  );
}