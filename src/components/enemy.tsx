import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";

export default function Enemy ({ position }: { position: [number, number, number] }){
  const enemy = useRef<Mesh>(null!);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const enemyOffset = useRef<Vector3>(new Vector3());
  const enemyClock = useRef(new Clock(false));

  useEffect(() => {
    if (playing) {
      enemyClock.current.start();
    }
  }, [playing]);

  
  useFrame(() => {
    enemyOffset.current.setZ(enemyClock.current.getDelta() * groundSpeed);
    enemy.current.position.add(enemyOffset.current);
  });

  return (
    <mesh
      ref={enemy}
      castShadow={true}
      receiveShadow={true}
      position={position}
    >
      <boxGeometry 
        args={[1, 1, 1]} 
      />
      <meshStandardMaterial 
        color={'red'} 
      />
    </mesh>  )
}