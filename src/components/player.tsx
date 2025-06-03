import { useEffect, useRef } from "react";
import { GlobalState, PlayerAction, useGlobalStore } from "../stores/useGlobalStore";
import { Mesh, Vector3 } from "three";

const OFFSET = 1;
const PLAYER_OFFSETS: Map<PlayerAction, Vector3> = new Map([
  ['MOVE_FORWARD', new Vector3(0, 0, -OFFSET)],
  ['MOVE_BACKWARD', new Vector3(0, 0, OFFSET)],
  ['MOVE_LEFT', new Vector3(-OFFSET, 0, 0)],
  ['MOVE_RIGHT', new Vector3(OFFSET, 0, 0)],
  ['NONE', new Vector3(0, 0, 0)],
])

export default function Player (){
  const player = useRef<Mesh>(null!);
  const playerAction = useGlobalStore((state: GlobalState) => state.playerAction);

  useEffect(() => {
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    player.current.position.add(playerOffset);
    
  }, [playerAction]);
  
  return (
    <mesh
      ref={player}
      castShadow={true}
      receiveShadow={true}
    >
      <boxGeometry 
        args={[1, 1, 1]} 
      />
      <meshStandardMaterial 
        color={'orange'} 
      />
    </mesh>  
  )
}