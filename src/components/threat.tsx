import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";

const getEnemyId = (threatId: string): number => {
  const threatIdParts: string[] = threatId.split('_');
  return parseInt(threatIdParts[0]);
};

export default function Threat ({ position, id }: { position: [number, number, number], id: string }){
  const threat = useRef<Mesh>(null!);
  const enemyId = useRef<number>(getEnemyId(id));
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);
  const enemyHitId = useGlobalStore((state: GlobalState) => state.enemyHitId);
  const threatOffset = useRef<Vector3>(new Vector3());
  const threatClock = useRef(new Clock(false));
  const isDead = useRef(false);

  useEffect(() => {
    if (playing) {
      threatClock.current.start();
    } else {
      threatClock.current.stop();
    }
  }, [playing]);
  
  useEffect(() => {
    if (isDead.current) return;

    if (id == threatHitId) {
      console.log('Threat Hit: id=', id);
    }
  }, [threatHitId]);

  useEffect(() => {
    if (isDead.current) return;

    if (enemyId.current === enemyHitId) {
      // Die
      // console.log('Threat Enemy Hit: id=', id);
      isDead.current = true;
      threat.current.visible = false;
    }
  }, [enemyHitId]);

  useFrame(() => {
    if (isDead.current) return;

    threatOffset.current.setZ(threatClock.current.getDelta() * groundSpeed);
    threat.current.position.add(threatOffset.current);
    threat.current.visible = threat.current.position.z < 3 && threat.current.position.z > -12;
  });

  return (
    <mesh
      ref={threat}
      castShadow={true}
      receiveShadow={true}
      position={position}
      rotation-x={Math.PI * -0.5}
      visible={false}
    >
      <planeGeometry />
      <meshStandardMaterial 
        color={colors.threat} 
      />
    </mesh>  
  )
}
