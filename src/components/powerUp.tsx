import { useFrame } from "@react-three/fiber";
import { GlobalState, PowerUpInfo, useGlobalStore } from "../stores/useGlobalStore";
import { useEffect, useMemo, useRef } from "react";
import { Clock, Color, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";
import vertexShader from '../shaders/portal2/vertex.glsl';
import fragmentShader from '../shaders/portal2/fragment.glsl';

export default function PowerUp ({ id, position, type }: PowerUpInfo){
  const powerUp = useRef<Mesh>(null!);

  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const powerUpHitId = useGlobalStore((state: GlobalState) => state.powerUpHitId);

  const powerUpOffset = useRef<Vector3>(new Vector3());
  const powerUpClock = useRef(new Clock(false));
  const isDead = useRef(false);
  const bounceTween = useRef<GSAPTween>(null!);
  const rotationTween = useRef<GSAPTween>(null!);

  const originalColor1 = useRef(new Color(colors.health1));
  const originalColor2 = useRef(new Color(colors.health2));

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
        uFrequency: new Uniform(2),
        uSpeedFactor: new Uniform(0),
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
    if (playing) {
      powerUpClock.current.start();
      
      // Start bouncing & rotating
      bounceTween.current = gsap.to(
        powerUp.current.position, 
        { 
          y: 0.25, 
          duration: 0.5, 
          ease: "power1.inOut", 
          repeat: -1, 
          yoyo: true 
        }
      );
      rotationTween.current = gsap.to(
        powerUp.current.rotation, 
        { 
          y: Math.PI * 2, 
          duration: 1, 
          ease: "power1.inOut", 
          repeat: -1
        }
      );
    } else {
      powerUpClock.current.stop();

      // Stop bouncing & rotating
      bounceTween.current.pause();
      rotationTween.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (isDead.current) return;

    if (powerUpHitId === id) {
      if (type === 'HEALTH') {
        Sounds.getInstance().playSoundFX('HEALTH_HIT');
      }
      // Die
      isDead.current = true;
      // Stop bouncing & rotating
      bounceTween.current.pause();
      rotationTween.current.pause();
      // Animate death
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
    if (!playing || isDead.current) return;

    // Adjust Z position
    powerUpOffset.current.setZ(powerUpClock.current.getDelta() * groundSpeed);
    powerUp.current.position.add(powerUpOffset.current);

    // Make visible when Z position is on the ground area
    const prevVisible = powerUp.current.visible;
    powerUp.current.visible = powerUp.current.position.z < 5 && powerUp.current.position.z > -14.5;
    if (powerUp.current.visible && !prevVisible) {
      // Spawn
      Sounds.getInstance().playSoundFX('HEALTH_SPAWN')
      gsap.to(powerUp.current.scale, {           
        x: 0.5, 
        y: 0.5,
        z: 0.5,
        duration: 0.5, 
        ease: "power1.inOut" 
      });
    }
  });

  return (
    <mesh
      ref={powerUp}
      castShadow={true}
      receiveShadow={true}
      position={position}
      visible={false}
      scale={0}
      material={material} 
    >
      <icosahedronGeometry args={[0.9, 0]} />
    </mesh>  
  )
}
