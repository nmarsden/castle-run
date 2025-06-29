import vertexShader from '../shaders/portal/vertex.glsl';
import fragmentShader from '../shaders/portal/fragment.glsl';
import { Uniform, ShaderMaterial, Color, LinearSRGBColorSpace } from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GlobalState, useGlobalStore } from '../stores/useGlobalStore';
import gsap from "gsap";

export default function Background() {
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const waveColor = useGlobalStore((state: GlobalState) => state.waveColor);
  const gameCompleted = useGlobalStore((state: GlobalState) => state.gameCompleted);

  const gameCompletedColorProps = useRef({ hue: 0 });
  const gameCompletedTween = useRef<GSAPTween>(null!);

  useEffect(() => {
    material.uniforms.uColor1.value = new Color(colors.background1);
    material.uniforms.uColor2.value = new Color(colors.background2);
  }, [colors]);

  useEffect(() => {
    // Pause game completed tween (if playing)
    gameCompletedTween.current?.pause();

    // Set color according to waveColor
    gsap.to(
      material.uniforms.uColor2.value,
      {
        r: waveColor.r,
        g: waveColor.g,
        b: waveColor.b,
        duration: 2,
        ease: "linear",
      }
    );
  }, [waveColor]);

  useEffect(() => {
    if (gameCompleted) {
      gameCompletedTween.current.play();
    } else {
      gameCompletedTween.current?.pause();
    }
  }, [gameCompleted]);

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

  useEffect(() => {
    // Setup game completed animation
    gameCompletedTween.current = gsap.to(gameCompletedColorProps.current, {
        hue: 1,
        duration: 4,
        ease: "none",
        repeat: -1,
        paused: true,
        yoyo: true,
        onUpdate: () => {
          // Update material uColor2 with animated hue
          const hsl = material.uniforms.uColor2.value.getHSL({});
          material.uniforms.uColor2.value.setHSL(gameCompletedColorProps.current.hue, hsl.s, hsl.l, LinearSRGBColorSpace);
        }
    });
  }, [material]);

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