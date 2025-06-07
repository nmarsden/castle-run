import { useFrame } from "@react-three/fiber";
import { EnemyType, GlobalState, ThreatInfo, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useMemo, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import Threat from "./threat";

export default function Enemy ({ position, type, threats }: { position: [number, number, number], type: EnemyType, threats: ThreatInfo[] }){
  const pawn = useGLTF("models/Pawn.glb");
  const knight = useGLTF("models/Knight.glb");
  const bishop = useGLTF("models/Bishop.glb");
  const queen = useGLTF("models/Queen.glb");
  const king = useGLTF("models/King.glb");

  const enemy = useRef<Mesh>(null!);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const enemyOffset = useRef<Vector3>(new Vector3());
  const enemyClock = useRef(new Clock(false));

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
  
  useFrame(() => {
    enemyOffset.current.setZ(enemyClock.current.getDelta() * groundSpeed);
    enemy.current.position.add(enemyOffset.current);
    enemy.current.visible = enemy.current.position.z < 3 && enemy.current.position.z > -12;
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
          color={colors.enemy} 
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
