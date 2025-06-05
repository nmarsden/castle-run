import Enemy from "./enemy";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Enemies (){
  const enemyPositions = useGlobalStore((state: GlobalState) => state.enemyPositions);

  return (
    <>
      {enemyPositions.map((position, index) => <Enemy key={`enemy-${index}`} position={position}/>)}
    </>
  );
}