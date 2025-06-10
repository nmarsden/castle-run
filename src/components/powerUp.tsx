import { useFrame } from "@react-three/fiber";
import { GlobalState, PowerUpInfo, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Mesh, MeshStandardMaterial, Vector3 } from "three";
import gsap from "gsap";

export default function PowerUp ({ id, position, type }: PowerUpInfo){
  const powerUp = useRef<Mesh>(null!);
  const material = useRef<MeshStandardMaterial>(null!);

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
      // Die
      isDead.current = true;
      // animate position & scale
      gsap.to(
        powerUp.current.position, 
        { 
          y: 1,
          duration: 0.1,
          ease: "power1.inOut",
        }
      )      
      gsap.to(
        powerUp.current.scale, 
        { 
          x: 0, 
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "power1.inOut",
          onComplete: () => { powerUp.current.visible = false; } 
        }
      )
    }
  }, [powerUpHitId]);

  useFrame(() => {
    if (isDead.current) return;

    powerUpOffset.current.setZ(powerUpClock.current.getDelta() * groundSpeed);
    powerUp.current.position.add(powerUpOffset.current);

    const prevVisible = powerUp.current.visible;

    powerUp.current.visible = powerUp.current.position.z < 4 && powerUp.current.position.z > -14.5;

    if (powerUp.current.visible && !prevVisible) {
      gsap.to(material.current, { opacity: 1, duration: 0.5, ease: "power1.inOut" });
    }
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
        ref={material}
        color={colors.powerUpHealth} 
        opacity={0}
        transparent={true}
      />
    </mesh>  
  )
}
