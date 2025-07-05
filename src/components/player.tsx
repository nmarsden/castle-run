import { useEffect, useMemo, useRef } from "react";
import { GlobalState, PlayerAction, useGlobalStore } from "../stores/useGlobalStore";
import { Color, Group, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import PlayerHealth from "./playerHealth";
import { Sounds } from "../utils/sounds";
import vertexShader from '../shaders/portal2/vertex.glsl';
import fragmentShader from '../shaders/portal2/fragment.glsl';
import { useFrame } from "@react-three/fiber";
import Thruster from "./thruster";
import Explosion from "./explosion";

const OFFSET = 1;
const PLAYER_OFFSETS: Map<PlayerAction, Vector3> = new Map([
  ['MOVE_FORWARD', new Vector3(0, 0, -OFFSET)],
  ['MOVE_BACKWARD', new Vector3(0, 0, OFFSET)],
  ['MOVE_LEFT', new Vector3(-OFFSET, 0, 0)],
  ['MOVE_RIGHT', new Vector3(OFFSET, 0, 0)],
  ['NONE', new Vector3(0, 0, 0)],
])

export default function Player (){
  const rook = useGLTF("models/Rook.glb");

  const group = useRef<Group>(null!);
  const player = useRef<Mesh>(null!);

  const playerAction = useGlobalStore((state: GlobalState) => state.playerAction);
  const setPlayerXOffset = useGlobalStore((state: GlobalState) => state.setPlayerXOffset);
  const setPlayerZOffset = useGlobalStore((state: GlobalState) => state.setPlayerZOffset);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playCount = useGlobalStore((state: GlobalState) => state.playCount);  
  const playerHealth = useGlobalStore((state: GlobalState) => state.playerHealth);  
  const threatHitId = useGlobalStore((state: GlobalState) => state.threatHitId);

  const tempPos = useRef<Vector3>(new Vector3());
  const isMoving = useRef(false);
  const originalColor1 = useRef(new Color(colors.player1));
  const originalColor2 = useRef(new Color(colors.player2));
  const flashColor = useRef(new Color(colors.playerFlash));

  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uColor1: new Uniform(originalColor1.current.clone()),
        uColor2: new Uniform(originalColor2.current.clone()),
        uEmissiveIntensity: new Uniform(1),
        uAlpha: new Uniform(1),
        uOffset: new Uniform(0),
        uFrequency: new Uniform(8),
        uSpeedFactor: new Uniform(8),
        uTime: new Uniform(0),
        uBlendSharpness: new Uniform(1)
      }
    });
    return shaderMaterial;
  }, []);
  
  useEffect(() => {
    originalColor1.current = new Color(colors.player1);
    originalColor2.current = new Color(colors.player2);
    flashColor.current = new Color(colors.playerFlash);

    material.uniforms.uColor1.value = originalColor1.current.clone();
    material.uniforms.uColor2.value = originalColor2.current.clone();    
  }, [colors]);

  useEffect(() => {
    // Hover animation
    gsap.to(
      group.current.position,
      {
        y: -0.3,        
        duration: 0.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      }
    );
    gsap.to(
      group.current.rotation,
      {
        keyframes: [
          { x: Math.PI * -0.02 },
          { x: Math.PI * 0.02 }
        ],        
        duration: 5,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      }
    );
    gsap.to(
      group.current.rotation,
      {
        keyframes: [
          { z: Math.PI * -0.005 },
          { z: Math.PI * 0.005 }
        ],        
        duration: 3,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      }
    );

    material.uniforms.uColor1.value = originalColor1.current.clone();
    material.uniforms.uColor2.value = originalColor2.current.clone();    

  }, [playCount]);

  useEffect(() => {
    if (playerHealth === 0) {
      // Die
      Sounds.getInstance().playSoundFX('PLAYER_DIE');
      gsap.to(
        material.uniforms.uColor1.value,
        {
          r: flashColor.current.r,
          g: flashColor.current.g,
          b: flashColor.current.b,
          duration: 0.1,
          ease: "power1.inOut",
          repeat: 5,
          loop: true
        }
      );      
    } else if (threatHitId !== '') {
      // Hit Threat
      gsap.to(
        material.uniforms.uColor1.value, 
        { 
          keyframes: [
            { r: flashColor.current.r,    g: flashColor.current.g,    b: flashColor.current.b },
            { r: originalColor1.current.r, g: originalColor1.current.g, b: originalColor1.current.b }
          ],
          duration: 0.1, 
          ease: "power1.inOut",
          repeat: 5
        }
      );
      gsap.to(
        material.uniforms.uFrequency, 
        { 
          keyframes: [
            { value: 7.25 },
            { value: 8 }
          ],
          duration: 0.1, 
          ease: "power1.inOut",
          repeat: 5
        }
      );      
    }
  }, [playerHealth, threatHitId]);

  useEffect(() => {
    if (isMoving.current || playerAction === 'NONE') return;
    const playerOffset = PLAYER_OFFSETS.get(playerAction) as Vector3;
    tempPos.current.set(player.current.position.x, player.current.position.y, player.current.position.z);
    tempPos.current.add(playerOffset);

    if (tempPos.current.x > 2) return;
    if (tempPos.current.x < -2) return;
    if (tempPos.current.z > 2) return;
    if (tempPos.current.z < -2) return;

    isMoving.current = true;
    Sounds.getInstance().playSoundFX('PLAYER_MOVE');

    setPlayerXOffset(tempPos.current.x);
    setPlayerZOffset(tempPos.current.z);

    const duration = 0.15;
    // animate position
    gsap.to(
      player.current.position, 
      { 
        x: tempPos.current.x, 
        z: tempPos.current.z, 
        duration,
        ease: "power1.inOut",
        onComplete: () => { isMoving.current = false; } 
      }
    )
    // animate rotation
    const angle = Math.PI * 0.075;
    gsap.to(
      player.current.rotation, 
      { 
        keyframes: 
          playerOffset.x === 0 ? [
            { x: angle * playerOffset.z,  duration: duration * 0.5 },
            { x: 0,                       duration: duration * 0.5 }
          ] : [
            { z: angle * -playerOffset.x, duration: duration * 0.5 },
            { z: 0,                       duration: duration * 0.5 }
          ]
      }
    )
  }, [playerAction]);
  
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });
    
  return (
    <group 
      ref={group}
      key={`player-${playCount}`}
      position={[0, -0.4, -1]} 
      rotation-x={Math.PI * 0.02}
      rotation-z={Math.PI * 0.005}
    >
      <mesh
        ref={player}
        castShadow={true}
        receiveShadow={true}
        geometry={(rook.nodes.Rook as Mesh).geometry}
        material={material}
      >
        <Thruster />
        <PlayerHealth />
        <Explosion position={[0, 0, 0]} />
      </mesh>  
    </group>
  )
}

useGLTF.preload('models/Rook.glb')