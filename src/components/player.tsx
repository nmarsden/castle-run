import { useEffect, useRef } from "react";
import { GlobalState, PlayerAction, useGlobalStore } from "../stores/useGlobalStore";
import { Mesh, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import PlayerHealth from "./playerHealth";

const OFFSET = 1;
const PLAYER_OFFSETS: Map<PlayerAction, Vector3> = new Map([
  ['MOVE_FORWARD', new Vector3(0, OFFSET, 0)],
  ['MOVE_BACKWARD', new Vector3(0, -OFFSET, 0)],
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
  const playerHit = useGlobalStore((state: GlobalState) => state.playerHit);
  const tempPos = useRef<Vector3>(new Vector3());
  const isMoving = useRef(false);

  useEffect(() => {
    if (!playerHit) return;
    
    // TODO react when player hit
    console.log('playerHit')
  }, [playerHit]);

  useEffect(() => {
    if (isMoving.current) return;
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    tempPos.current.set(player.current.position.x, player.current.position.y, player.current.position.z);
    tempPos.current.add(playerOffset);

    if (tempPos.current.x > 2) return;
    if (tempPos.current.x < -2) return;
    if (tempPos.current.y > 2) return;
    if (tempPos.current.y < -2) return;

    setPlayerXOffset(tempPos.current.x);
    setPlayerZOffset(tempPos.current.y);

    isMoving.current = true;
    const duration = 0.15;
    // animate position
    gsap.to(
      player.current.position, 
      { 
        x: tempPos.current.x, 
        y: tempPos.current.y, 
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
            { x: angle * -playerOffset.y, duration: duration * 0.5 },
            { x: 0,                       duration: duration * 0.5 }
          ] : [
            { y: angle * playerOffset.x, duration: duration * 0.5 },
            { y: 0,                      duration: duration * 0.5 }
          ]
      }
    )
  }, [playerAction]);
  
  return (
    <group 
      position={[0, 0, -1]} 
      rotation-x={Math.PI * -0.5}
    >
      <mesh
        ref={player}
        castShadow={true}
        receiveShadow={true}
        geometry={(rook.nodes.Rook as Mesh).geometry}
        scale={25}
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