import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useRef } from "react";
import { Clock, Color, Mesh, MeshStandardMaterial, Vector3 } from "three";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";

const getEnemyId = (threatId: string): number => {
  const threatIdParts: string[] = threatId.split('_');
  return parseInt(threatIdParts[0]);
};

export default function Threat ({ position, id }: { position: [number, number, number], id: string }){
  const threat = useRef<Mesh>(null!);
  const material = useRef<MeshStandardMaterial>(null!);
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
      // Hit
      Sounds.getInstance().playSoundFX('THREAT_HIT');
  
      const originalColor = material.current.color.clone();
      const flashColor = new Color("orange");
      gsap.to(
        material.current.color, 
        { 
          keyframes: [
            { r: flashColor.r,    g: flashColor.g,    b: flashColor.b },
            { r: originalColor.r, g: originalColor.g, b: originalColor.b }
          ],
          duration: 0.1, 
          ease: "power1.inOut",
          repeat: 5,
          // Note: since multiple threats can be in the same position, raise slightly before animating
          onStart:    () => { threat.current.position.y += 0.01; },
          onComplete: () => { threat.current.position.y -= 0.01; }
        }
      );      
    }
  }, [threatHitId]);

  useEffect(() => {
    if (isDead.current) return;

    if (enemyId.current === enemyHitId) {
      // Die
      isDead.current = true;
      // Animate fade-out
      gsap.to(
        material.current, 
        { 
          opacity: 0, 
          duration: 0.5, 
          ease: "power1.inOut",
          onComplete: () => { threat.current.visible = false; } 
        }
      );      
    }
  }, [enemyHitId]);

  useFrame(() => {
    threatOffset.current.setZ(threatClock.current.getDelta() * groundSpeed);
    threat.current.position.add(threatOffset.current);

    if (isDead.current) return;

    const prevVisible = threat.current.visible;

    threat.current.visible = threat.current.position.z < 5 && threat.current.position.z > -14.5;

    if (threat.current.visible && !prevVisible) {
      // Spawn
      gsap.to(material.current, { 
        delay: 0.5, // appear after the enemy
        opacity: 1, 
        duration: 0.5, 
        ease: "power1.inOut",
        onStart: () => Sounds.getInstance().playSoundFX('THREAT_SPAWN') 
      });
    }
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
        ref={material}
        color={colors.threat}
        opacity={0}
        transparent={true}
        depthWrite={false}
      />
    </mesh>  
  )
}
