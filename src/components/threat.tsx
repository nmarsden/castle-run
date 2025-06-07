import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";

export default function Threat ({ position, id }: { position: [number, number, number], id: string }){
  const threat = useRef<Mesh>(null!);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);
  const threatOffset = useRef<Vector3>(new Vector3());
  const threatClock = useRef(new Clock(false));

  useEffect(() => {
    if (playing) {
      threatClock.current.start();
    } else {
      threatClock.current.stop();
    }
  }, [playing]);
  
  useEffect(() => {
    if (id == threatHitId) {
      // TODO react to threat being hit
      console.log('Threat Hit: id=', id);
    }
  }, [threatHitId]);

  useFrame(() => {
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
    </mesh>  )
}
