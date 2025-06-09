import { useEffect, useMemo, useRef } from "react";
import { GlobalState, PlayerAction, useGlobalStore } from "../stores/useGlobalStore";
import { Mesh, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import PlayerHealth from "./playerHealth";

const OFFSET = 1;
const PLAYER_OFFSETS: Map<PlayerAction, Vector3> = new Map([
  ['MOVE_FORWARD', new Vector3(0, 0, -OFFSET)],
  ['MOVE_BACKWARD', new Vector3(0, 0, OFFSET)],
  ['MOVE_LEFT', new Vector3(-OFFSET, 0, 0)],
  ['MOVE_RIGHT', new Vector3(OFFSET, 0, 0)],
  ['NONE', new Vector3(0, 0, 0)],
])

export default function Player (){
  const rook = useGLTF("models/Rook.glb");

  const player = useRef<Mesh>(null!);
  const playerAction = useGlobalStore((state: GlobalState) => state.playerAction);
  const setPlayerXOffset = useGlobalStore((state: GlobalState) => state.setPlayerXOffset);
  const setPlayerZOffset = useGlobalStore((state: GlobalState) => state.setPlayerZOffset);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);  
  const tempPos = useRef<Vector3>(new Vector3());
  const isMoving = useRef(false);

  const geometry = useMemo(() => {
    // TODO update model file in blender so that geometry changes are not required
    const geometry = (rook.nodes.Rook as Mesh).geometry;
    geometry.rotateX(Math.PI * -0.25);
    geometry.scale(5, 5, 5);

    return geometry;
  }, []);

  useEffect(() => {
    if (isMoving.current) return;
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    tempPos.current.set(player.current.position.x, player.current.position.y, player.current.position.z);
    tempPos.current.add(playerOffset);

    if (tempPos.current.x > 2) return;
    if (tempPos.current.x < -2) return;
    if (tempPos.current.z > 2) return;
    if (tempPos.current.z < -2) return;

    setPlayerXOffset(tempPos.current.x);
    setPlayerZOffset(tempPos.current.z);

    isMoving.current = true;
    const duration = 0.15;
    // animate position
    gsap.to(
      player.current.position, 
      { 
        x: tempPos.current.x, 
        z: tempPos.current.z, 
        duration,
        ease: "power1.inOut",
        onComplete: () => { isMoving.current = false; } 
      }
    )
    // animate rotation
    const angle = Math.PI * 0.075;
    gsap.to(
      player.current.rotation, 
      { 
        keyframes: 
          playerOffset.x === 0 ? [
            { x: angle * playerOffset.z,  duration: duration * 0.5 },
            { x: 0,                       duration: duration * 0.5 }
          ] : [
            { z: angle * -playerOffset.x, duration: duration * 0.5 },
            { z: 0,                       duration: duration * 0.5 }
          ]
      }
    )
  }, [playerAction]);
  
  return (
    <group 
      key={`player-${playCount}`}
      position={[0, 0, -1]} 
    >
      <mesh
        ref={player}
        castShadow={true}
        receiveShadow={true}
        geometry={geometry}
      >
        <meshStandardMaterial 
          color={colors.player}
        />
        <PlayerHealth />
      </mesh>  
    </group>
  )
}

useGLTF.preload('models/Rook.glb')