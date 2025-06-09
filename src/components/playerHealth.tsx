import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

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

  useEffect(() => {
    healthBlock.current.visible = (playerHealth >= healthLevel);
  }, [playerHealth]);
  
  return (
    <mesh
      ref={healthBlock}
      castShadow={true}
      receiveShadow={true}
      scale={[0.2, 0.2, 0.1]}
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
