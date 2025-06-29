import { useFrame } from "@react-three/fiber";
import { EnemyInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useMemo, useRef } from "react";
import { Clock, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import Threat from "./threat";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";

export default function Enemy ({ id, waveNum, position, type, threats }: EnemyInfo){
  const pawn = useGLTF("models/Pawn.glb");
  const knight = useGLTF("models/Knight.glb");
  const bishop = useGLTF("models/Bishop.glb");
  const queen = useGLTF("models/Queen.glb");
  const king = useGLTF("models/King.glb");

  const enemy = useRef<Mesh>(null!);
  const material = useRef<MeshStandardMaterial>(null!);
  
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const enemyHitId = useGlobalStore((state: GlobalState) => state.enemyHitId);
  const emissiveIntensity = useGlobalStore((state: GlobalState) => state.emissiveIntensity);
  const gameWaveNum = useGlobalStore((state: GlobalState) => state.waveNum);
  const waveColor = useGlobalStore((state: GlobalState) => state.waveColor);  

  const enemyOffset = useRef<Vector3>(new Vector3());
  const enemyClock = useRef(new Clock(false));
  const isDead = useRef(false);
  const isSleeping = useRef(waveNum !== gameWaveNum);

  const geometry = useMemo(() => {
    if (type === 'PAWN') return (pawn.nodes.Pawn as Mesh).geometry;
    if (type === 'KNIGHT') return (knight.nodes.Knight as Mesh).geometry;
    if (type === 'BISHOP') return (bishop.nodes.Bishop as Mesh).geometry;
    if (type === 'QUEEN') return (queen.nodes.Queen as Mesh).geometry;
    if (type === 'KING') return (king.nodes.King as Mesh).geometry;
  }, [type]);

  useEffect(() => {
    if (playing) {
      enemyClock.current.start();
    } else {
      enemyClock.current.stop();
    }
  }, [playing]);

  useEffect(() => {
    isSleeping.current = waveNum !== gameWaveNum;
  }, [gameWaveNum]);

  useEffect(() => {
    gsap.to(
      material.current.emissive,
      {
        r: waveColor.r,
        g: waveColor.g,
        b: waveColor.b,
        duration: 5,
        ease: "linear",
      }
    );  
    gsap.to(
      material.current.color,
      {
        r: waveColor.r,
        g: waveColor.g,
        b: waveColor.b,
        duration: 5,
        ease: "linear",
      }
    );  
  }, [waveColor]);

  useEffect(() => {
    if (isDead.current) return;
    if (isSleeping.current) return;

    if (enemyHitId === id) {
      // Die
      Sounds.getInstance().playSoundFX('ENEMY_HIT');
      isDead.current = true;
      gsap.to(
        enemy.current.position, 
        { 
          y: 1,
          duration: 0.25, 
          ease: "power1.inOut",
        }
      );      
      gsap.to(enemy.current.scale, {           
        x: 0, 
        y: 0,
        z: 0,
        delay: 0.25,
        duration: 0.25, 
        ease: "power1.inOut" 
      });
    }
  }, [enemyHitId]);

  useFrame(() => {
    if (isDead.current) return;

    enemyOffset.current.setZ(enemyClock.current.getDelta() * groundSpeed);
    enemy.current.position.add(enemyOffset.current);

    if (isSleeping.current) return;

    const prevVisible = enemy.current.visible;

    enemy.current.visible = enemy.current.position.z < 7 && enemy.current.position.z > -14.5;

    if (enemy.current.visible && !prevVisible) {
      // Spawn
      Sounds.getInstance().playSoundFX('ENEMY_SPAWN');
      gsap.to(enemy.current.scale, {           
        x: 25, 
        y: 25,
        z: 25,
        duration: 0.5, 
        ease: "power1.inOut" 
      });
    }
  });

  return (
    <>
      <mesh
        ref={enemy}
        castShadow={true}
        receiveShadow={true}
        position={position}
        geometry={geometry}
        scale={0}
        rotation-x={Math.PI * -0.5}
        visible={false}
      >
        <meshStandardMaterial 
          ref={material}
          color={colors.enemy} 
          emissive={colors.enemy}
          emissiveIntensity={emissiveIntensity} 
          opacity={0.9}
          transparent={true}
        />
      </mesh>
      <>
        {threats.map(threat => <Threat key={`threat-${threat.id}`} {...threat} />)}
      </>
    </>
  )
}

useGLTF.preload('models/Pawn.glb');
useGLTF.preload('models/Knight.glb');
useGLTF.preload('models/Bishop.glb');
useGLTF.preload('models/Queen.glb');
useGLTF.preload('models/King.glb');
