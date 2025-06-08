import { useFrame } from "@react-three/fiber";
import { GlobalState, PowerUpInfo, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";

export default function PowerUp ({ id, position, type }: PowerUpInfo){
  const powerUp = useRef<Mesh>(null!);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const powerUpHitId = useGlobalStore((state: GlobalState) => state.powerUpHitId);
  const powerUpOffset = useRef<Vector3>(new Vector3());
  const powerUpClock = useRef(new Clock(false));
  const isDead = useRef(false);

  useEffect(() => {
    if (playing) {
      powerUpClock.current.start();
    } else {
      powerUpClock.current.stop();
    }
  }, [playing]);

  useEffect(() => {
    if (isDead.current) return;

    if (powerUpHitId === id) {
      console.log('PowerUp Hit: id=', id);
      // Die
      isDead.current = true;
      powerUp.current.visible = false;
    }
  }, [powerUpHitId]);

  useFrame(() => {
    if (isDead.current) return;

    powerUpOffset.current.setZ(powerUpClock.current.getDelta() * groundSpeed);
    powerUp.current.position.add(powerUpOffset.current);
    powerUp.current.visible = powerUp.current.position.z < 3 && powerUp.current.position.z > -12;
  });

  return (
    <mesh
      ref={powerUp}
      castShadow={true}
      receiveShadow={true}
      position={position}
      visible={false}
      scale={0.5}
    >
      <boxGeometry/>
      <meshStandardMaterial 
        color={colors.powerUpHealth} 
      />
    </mesh>  
  )
}
