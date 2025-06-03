import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector2, RepeatWrapping } from "three";

export default function Ground(){
  const texture = useTexture("textures/checker_board.png");
  const speed = 0.5;

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(2.5, 5);
    texture.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    texture.offset.setX(0);
    texture.offset.setY(clock.getElapsedTime() * speed % 1);
  });
  
  return (
    <mesh 
      rotation-x={Math.PI * -0.5} 
      position-y={-0.51} 
      position-z={-4.5}
      scale={[5, 10, 1]}
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