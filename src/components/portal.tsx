import vertexShader from '../shaders/portal/vertex.glsl';
import fragmentShader from '../shaders/portal/fragment.glsl';
import { Uniform, ShaderMaterial } from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Portal(){
  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
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