import { useEffect, useRef } from "react";
import { GlobalState, PlayerAction, useGlobalStore } from "../stores/useGlobalStore";
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import PlayerHealth from "./playerHealth";
import { Sounds } from "../utils/sounds";

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
  const material = useRef<MeshStandardMaterial>(null!);

  const playerAction = useGlobalStore((state: GlobalState) => state.playerAction);
  const setPlayerXOffset = useGlobalStore((state: GlobalState) => state.setPlayerXOffset);
  const setPlayerZOffset = useGlobalStore((state: GlobalState) => state.setPlayerZOffset);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);  
  const playerHealth = useGlobalStore((state: GlobalState) => state.playerHealth);  
  const waveProgress = useGlobalStore((state: GlobalState) => state.waveProgress);  
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);
  const emissiveIntensity = useGlobalStore((state: GlobalState) => state.emissiveIntensity);

  const tempPos = useRef<Vector3>(new Vector3());
  const isMoving = useRef(false);
  const originalColor = useRef(new Color(colors.player));
  const flashColor = useRef(new Color(colors.playerFlash));

  useEffect(() => {
    originalColor.current = new Color(colors.player);
    flashColor.current = new Color(colors.playerFlash);
  }, [colors]);

  useEffect(() => {
    if (waveProgress < 1) return;

    if (playerHealth === 0) {
      // Die
      Sounds.getInstance().playSoundFX('PLAYER_DIE');
      gsap.to(
        material.current.emissive,
        {
          r: flashColor.current.r,
          g: flashColor.current.g,
          b: flashColor.current.b,
          duration: 0.1,
          ease: "power1.inOut",
          repeat: 5,
          loop: true
        }
      );      
    } else if (threatHitId !== '') {
      // Hit Threat
      gsap.to(
        material.current.emissive, 
        { 
          keyframes: [
            { r: flashColor.current.r,    g: flashColor.current.g,    b: flashColor.current.b },
            { r: originalColor.current.r, g: originalColor.current.g, b: originalColor.current.b }
          ],
          duration: 0.1, 
          ease: "power1.inOut",
          repeat: 5
        }
      );      
    }
  }, [playerHealth, threatHitId]);

  useEffect(() => {
    if (isMoving.current || playerAction === 'NONE') return;
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    tempPos.current.set(player.current.position.x, player.current.position.y, player.current.position.z);
    tempPos.current.add(playerOffset);

    if (tempPos.current.x > 2) return;
    if (tempPos.current.x < -2) return;
    if (tempPos.current.z > 2) return;
    if (tempPos.current.z < -2) return;

    isMoving.current = true;
    Sounds.getInstance().playSoundFX('PLAYER_MOVE');

    setPlayerXOffset(tempPos.current.x);
    setPlayerZOffset(tempPos.current.z);

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
        geometry={(rook.nodes.Rook as Mesh).geometry}
      >
        <meshStandardMaterial 
          ref={material}
          color={colors.player}
          emissive={colors.player}
          emissiveIntensity={emissiveIntensity} 
          opacity={0.9}
          transparent={true}
        />
        <PlayerHealth />
      </mesh>  
    </group>
  )
}

useGLTF.preload('models/Rook.glb')