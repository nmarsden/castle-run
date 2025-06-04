import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector2, RepeatWrapping, Clock } from "three";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Ground(){
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const texture = useTexture("textures/checker_board.png");
  const groundClock = useRef(new Clock(false));
  const width = useRef(5);
  const length = useRef(14);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(width.current * 0.5, length.current * 0.5);
    texture.needsUpdate = true;
  }, []);

  useEffect(() => {
    if (playing) {
      groundClock.current.start();
    }
  }, [playing]);

  useFrame(() => {
    texture.offset.setX(0);
    const yOffset = (texture.offset.y + (groundClock.current.getDelta() * groundSpeed * 0.5)) % 1;
    texture.offset.setY(yOffset);
  });
  
  return (
    <mesh 
      rotation-x={Math.PI * -0.5} 
      position-y={-0.51} 
      position-z={-4.5}
      scale={[width.current, length.current, 1]}
      castShadow={true}
      receiveShadow={true}      
    >
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={'#b7afaf'} 
        map={texture}
      />
    </mesh>  
  )
}