import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useMemo, useRef } from "react";
import { Clock, Color, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";
import vertexShader from '../shaders/portal/vertex.glsl';
import fragmentShader from '../shaders/portal/fragment.glsl';

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
  const originalColor1 = useRef(new Color(colors.threat1));
  const originalColor2 = useRef(new Color(colors.threat2));
  const hitColor = useRef(new Color(colors.threatHit));
  
  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor1: new Uniform(originalColor1.current),
        uColor2: new Uniform(originalColor2.current),
        uAlpha: new Uniform(0),
        uOffset: new Uniform(Math.random() * 100),
        uFrequency: new Uniform(2),
        uTime: new Uniform(0),
      }
    });
    return shaderMaterial;
  }, []);

  useEffect(() => {
    originalColor1.current = new Color(colors.threat1);
    originalColor2.current = new Color(colors.threat2);
    hitColor.current = new Color(colors.threatHit);

    material.uniforms.uColor1.value = originalColor1.current;
    material.uniforms.uColor2.value = originalColor2.current;
  }, [colors]);

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
      gsap.to(
        material, 
        { 
          keyframes: [
            { depthWrite: true },
            { depthWrite: false }
          ],
          duration: 0.5
        }
      );      
      gsap.to(
        material.uniforms.uColor1.value, 
        { 
          keyframes: [
            { r: hitColor.current.r,       g: hitColor.current.g,       b: hitColor.current.b },
            { r: originalColor1.current.r, g: originalColor1.current.g, b: originalColor1.current.b }
          ],
          duration: 0.5, 
          // Note: since multiple threats can be in the same position, raise slightly before animating
          onStart:    () => { threat.current.position.y += 0.01; },
          onComplete: () => { threat.current.position.y -= 0.01; }
        }
      );      
      gsap.to(
        material.uniforms.uFrequency, 
        { 
          keyframes: [
            { value: 1.5 },
            { value: 2 }
          ],
          duration: 0.1, 
          ease: "power1.inOut",
          repeat: 5
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
        material.uniforms.uAlpha, 
        { 
          value: 0, 
          duration: 0.5, 
          ease: "power1.inOut",
          onComplete: () => { threat.current.visible = false; } 
        }
      );      
    }
  }, [enemyHitId]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;

    threatOffset.current.setZ(threatClock.current.getDelta() * groundSpeed);
    threat.current.position.add(threatOffset.current);

    if (isDead.current) return;

    const prevVisible = threat.current.visible;

    threat.current.visible = threat.current.position.z < 5 && threat.current.position.z > -14.5;

    if (threat.current.visible && !prevVisible) {
      // Spawn
      gsap.to(material.uniforms.uAlpha, { 
        value: 1, 
        delay: 0.5, // appear after the enemy
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
      material={material}
    >
      <planeGeometry />
    </mesh>  
  )
}
