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
  const tempPos = useRef<Vector3>(new Vector3());

  useEffect(() => {
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    tempPos.current.set(player.current.position.x, player.current.position.y, player.current.position.z);
    tempPos.current.add(playerOffset);

    if (tempPos.current.x > 2) return;
    if (tempPos.current.x < -2) return;
    if (tempPos.current.z > 1) return;
    if (tempPos.current.z < -3) return;

    player.current.position.set(tempPos.current.x, tempPos.current.y, tempPos.current.z);
  }, [playerAction]);
  
  return (
    <mesh
      ref={player}
      castShadow={true}
      receiveShadow={true}
      position={[0, 0, -1]}
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