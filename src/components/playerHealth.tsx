import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";

type HealthBlockProps = {
  healthLevel: number;
  position: [number, number, number];
}

const NUM_HEALTH_BLOCKS = 5;
const HEALTH_BLOCKS: HealthBlockProps[] = [];
for (let i=0; i<NUM_HEALTH_BLOCKS; i++) {
  HEALTH_BLOCKS.push({
    healthLevel: i + 1,
    position: [0, (i * 0.25), 0.5]
  })
}

function HealthBlock ({ healthLevel, position }: HealthBlockProps) {
  const healthBlock = useRef<Mesh>(null!);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const playerHealth = useGlobalStore((state: GlobalState) => state.playerHealth);

  const currentlyActive = useRef(false);

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
  
  return (
    <mesh
      ref={healthBlock}
      castShadow={true}
      receiveShadow={true}
      scale={[0, 0, 0]}
      position={position} 
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={colors.healthOn}
      />
    </mesh>  
  );
}

export default function PlayerHealth (){
  return (
    <>
      {HEALTH_BLOCKS.map((block, index) => 
        <HealthBlock 
          key={`health-block-${index}`} 
          healthLevel={block.healthLevel} 
          position={block.position}/>
      )}
    </>
  )
}
