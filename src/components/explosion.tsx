import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferGeometry, DoubleSide, Float32BufferAttribute, Points, ShaderMaterial, Uniform } from "three";
import vertexShader from '../shaders/explosion/vertex.glsl';
import fragmentShader from '../shaders/explosion/fragment.glsl';
import gsap from "gsap";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Explosion ({ position = [0, 0, 0] }: { position: [number, number, number] }) {
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);
  const pointsRef = useRef<Points>(null!);

  const DURATION_SECS = 0.5;
  const NUM_PARTICLES = 1000;
  const RADIUS = 3;

  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uProgress: new Uniform(0),
        uRadius: new Uniform(RADIUS),
      }
    });
    return shaderMaterial;
  }, []);
  
  useEffect(() => {

    if (threatHitId !== '') {
      // Explode
      pointsRef.current.visible = true;
      material.uniforms.uProgress.value = 0;

      gsap.to(material.uniforms.uProgress, { 
        value: 1, 
        duration: DURATION_SECS, 
        ease: 'linear',
        onComplete: () => { pointsRef.current.visible = false; } 
      });
    }

  }, [threatHitId]);

  const geometry: BufferGeometry = useMemo(() => {
    // Generate particle data
    const tempPositions = new Float32Array(NUM_PARTICLES * 3);
    const tempVelocities = new Float32Array(NUM_PARTICLES * 3);
    const tempColors = new Float32Array(NUM_PARTICLES * 3);
    const tempSizes = new Float32Array(NUM_PARTICLES);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3;

      // Position at the explosion origin
      tempPositions[i3 + 0] = position[0];
      tempPositions[i3 + 1] = position[1];
      tempPositions[i3 + 2] = position[2];

      // Random velocity for explosion outward
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = Math.random() * 0.5 + 0.1; // Adjust speed
      tempVelocities[i3 + 0] = Math.sin(theta) * Math.cos(phi) * speed;
      tempVelocities[i3 + 1] = Math.sin(theta) * Math.sin(phi) * speed;
      tempVelocities[i3 + 2] = Math.cos(theta) * speed;

      // Random colors for a fiery effect
      const r = Math.random() * 0.5 + 0.5; // Reddish
      const g = Math.random() * 0.02;      // Greenish (less)
      const b = Math.random() * 0.01;      // Bluish (even less)
      tempColors[i3 + 0] = r;
      tempColors[i3 + 1] = g;
      tempColors[i3 + 2] = b;

      // Sizes
      tempSizes[i] = 200;
    }

    const bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute('position', new Float32BufferAttribute(tempPositions, 3));
    bufferGeometry.setAttribute('velocity', new Float32BufferAttribute(tempVelocities, 3));
    bufferGeometry.setAttribute('color', new Float32BufferAttribute(tempColors, 3));
    bufferGeometry.setAttribute('size', new Float32BufferAttribute(tempSizes, 1));

    return bufferGeometry;
  }, []);

  return (
    <points 
      ref={pointsRef} 
      visible={false}
      material={material} 
      geometry={geometry}
    />
  );  
}
