import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector2, RepeatWrapping, Clock } from "three";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Ground(){
  const groundSpeed = useGlobalStore((state: GlobalState) => state.groundSpeed);
  const setGroundOffset = useGlobalStore((state: GlobalState) => state.setGroundOffset);
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const texture = useTexture("textures/checker_board.png");
  const groundClock = useRef(new Clock(false));
  const width = useRef(5);
  const length = useRef(14);
  const groundOffset = useRef(0);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(width.current * 0.5, length.current * 0.5);
    texture.needsUpdate = true;
  }, []);

  useEffect(() => {
    if (playing) {
      groundClock.current.start();
      groundOffset.current = 0;
      texture.offset.setY(0);
    } else {
      groundClock.current.stop();
    }
  }, [playing]);

  useFrame(() => {
    if (!playing) return;

    // Update groundOffset
    groundOffset.current += (groundClock.current.getDelta() * groundSpeed * 0.5);
    setGroundOffset(groundOffset.current);

    // Update texture offset
    texture.offset.setX(0);
    texture.offset.setY(groundOffset.current % 1);
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
        color={colors.ground} 
        map={texture}
      />
    </mesh>  
  )
}