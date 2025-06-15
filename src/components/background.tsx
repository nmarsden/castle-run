import vertexShader from '../shaders/portal/vertex.glsl';
import fragmentShader from '../shaders/portal/fragment.glsl';
import { Uniform, ShaderMaterial, Color } from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { GlobalState, useGlobalStore } from '../stores/useGlobalStore';

export default function Background(){
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);

  useEffect(() => {
    material.uniforms.uColor1.value = new Color(colors.background1);
    material.uniforms.uColor2.value = new Color(colors.background2);
  }, [colors]);

  useEffect(() => {
    material.uniforms.uSpeedFactor.value = groundSpeed * 0.25;
  }, [groundSpeed]);
  
  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor1: new Uniform(new Color(colors.background1)),
        uColor2: new Uniform(new Color(colors.background2)),
        uAlpha: new Uniform(1),
        uOffset: new Uniform(0),
        uFrequency: new Uniform(10),
        uSpeedFactor: new Uniform(groundSpeed * 0.25),
        uTime: new Uniform(0),
      }
    });
    return shaderMaterial;
  }, []);
  
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });
  
  return (
    <group>
      <mesh 
        rotation-x={Math.PI * -0.35}
        position-y={-55}
        scale={1000}
        material={material}
      >
        <planeGeometry args={[1, 1, 1]} />
      </mesh>
    </group>
  )
}