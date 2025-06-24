import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, Mesh, ShaderMaterial, Uniform } from "three";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";
import vertexShader from '../shaders/portal2/vertex.glsl';
import fragmentShader from '../shaders/portal2/fragment.glsl';
import { useFrame } from "@react-three/fiber";

type HealthBlockProps = {
  healthLevel: number;
  position: [number, number, number];
}

function HealthContainer () {
  const colors = useGlobalStore((state: GlobalState) => state.colors);

  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
      position={[0, 0.7, 0.51]}
      rotation-y={Math.PI * 0.5}
      renderOrder={1000}
    >
      <meshStandardMaterial 
        color={new Color(colors.healthContainer)}
        side={DoubleSide}
        opacity={0.5}
        transparent={true}
      />
      <cylinderGeometry args={[0.2, 0.2, 0.45, 7, 1, true, Math.PI * -0.35, Math.PI * 1.7]}/>
    </mesh>  
  );
}

function HealthBlock ({ healthLevel, position }: HealthBlockProps) {
  const healthBlock = useRef<Mesh>(null!);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playerHealth = useGlobalStore((state: GlobalState) => state.playerHealth);
  const originalColor1 = useRef(new Color(colors.health1));
  const originalColor2 = useRef(new Color(colors.health2));

  const currentlyActive = useRef(false);

  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uColor1: new Uniform(originalColor1.current.clone()),
        uColor2: new Uniform(originalColor2.current.clone()),
        uAlpha: new Uniform(1),
        uOffset: new Uniform(0),
        uFrequency: new Uniform(4),
        uSpeedFactor: new Uniform(8),
        uTime: new Uniform(0),
        uBlendSharpness: new Uniform(1)
      }
    });
    return shaderMaterial;
  }, []);

  useEffect(() => {
    originalColor1.current = new Color(colors.health1);
    originalColor2.current = new Color(colors.health2);

    material.uniforms.uColor1.value = originalColor1.current.clone();
    material.uniforms.uColor2.value = originalColor2.current.clone();
  }, [colors]);

  useEffect(() => {
    const active = (playerHealth >= healthLevel);

    if (!currentlyActive.current && active) {
      // activate
      Sounds.getInstance().playSoundFX('HEALTH_INCREASE');
      gsap.to(
        healthBlock.current.scale, 
        { 
          x: 0.2, 
          y: 0.2,
          z: 0.2,
          duration: 0.5,
          ease: "bounce",
          onComplete: () => { currentlyActive.current = true; } 
        }
      )
    }
    if (currentlyActive.current && !active) {
      // de-activate
      Sounds.getInstance().playSoundFX('HEALTH_DECREASE');
      gsap.to(
        healthBlock.current.scale, 
        { 
          x: 0, 
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "bounce",
          onComplete: () => { currentlyActive.current = false; } 
        }
      )
    }

  }, [playerHealth]);
  
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={healthBlock}
      castShadow={true}
      receiveShadow={true}
      scale={[0, 0, 0]}
      position={position}
      material={material} 
    >
      <cylinderGeometry args={[0.9, 0.9, 0.5, 7, 1, false]}/>
    </mesh>  
  );
}

export default function PlayerHealth (){
  const playerHealthMax = useGlobalStore((state: GlobalState) => state.playerHealthMax);
  const healthBlocks: HealthBlockProps[] = useMemo(() => {
    const hb: HealthBlockProps[] = [];
    for (let i=0; i<playerHealthMax; i++) {
      hb.push({
        healthLevel: i + 1,
        position: [0, (0.5 + (i * 0.12)), 0.5]
      })
    }
    return hb;
  }, []);

  return (
    <>
      <HealthContainer />
      {healthBlocks.map((block, index) => 
        <HealthBlock 
          key={`health-block-${index}`} 
          healthLevel={block.healthLevel} 
          position={block.position}/>
      )}
    </>
  )
}
