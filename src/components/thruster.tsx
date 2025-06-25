import { useEffect, useMemo } from "react";
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, Uniform } from "three";
import vertexShader from '../shaders/thruster/vertex.glsl';
import fragmentShader from '../shaders/thruster/fragment.glsl';
import { useFrame } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Thruster (){
  const colors = useGlobalStore((state: GlobalState) => state.colors);

  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uColor: new Uniform(new Color(colors.thruster)),
        uPower: new Uniform(5),
        uTime: new Uniform(0),
      }
    });
    return shaderMaterial;
  }, []);
  
  useEffect(() => {
    material.uniforms.uColor.value = new Color(colors.thruster);
  }, [colors]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      rotation-y={Math.PI}
      position={[0, 0.07, 0]}
      material={material}
    >
      <cylinderGeometry args={[0.26, 0.26, 0.6, 7, 1, true]}/>
    </mesh>  
  )
}
