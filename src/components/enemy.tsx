import { useFrame } from "@react-three/fiber";
import { EnemyInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useMemo, useRef } from "react";
import { Clock, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import Threat from "./threat";
import gsap from "gsap";

export default function Enemy ({ id, position, type, threats }: EnemyInfo){
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
  const enemyOffset = useRef<Vector3>(new Vector3());
  const enemyClock = useRef(new Clock(false));
  const isDead = useRef(false);

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
    if (isDead.current) return;

    if (enemyHitId === id) {
      // console.log('Enemy Hit: id=', id);
      // Die
      isDead.current = true;
      enemy.current.visible = false;
    }
  }, [enemyHitId]);

  useFrame(() => {
    if (isDead.current) return;

    enemyOffset.current.setZ(enemyClock.current.getDelta() * groundSpeed);
    enemy.current.position.add(enemyOffset.current);

    const prevVisible = enemy.current.visible;

    enemy.current.visible = enemy.current.position.z < 5 && enemy.current.position.z > -14.5;

    if (enemy.current.visible && !prevVisible) {
      gsap.to(material.current, { opacity: 1, duration: 0.5, ease: "power1.inOut" });
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
        scale={25}
        rotation-x={Math.PI * -0.5}
        visible={false}
      >
        <meshStandardMaterial 
          ref={material}
          color={colors.enemy} 
          opacity={0}
          transparent={true}
        />
      </mesh>
      <>
        {threats.map((threat, index) => <Threat key={`threat-${index}`} position={threat.position} id={threat.id} />)}
      </>
    </>
  )
}

useGLTF.preload('models/Pawn.glb');
useGLTF.preload('models/Knight.glb');
useGLTF.preload('models/Bishop.glb');
useGLTF.preload('models/Queen.glb');
useGLTF.preload('models/King.glb');
