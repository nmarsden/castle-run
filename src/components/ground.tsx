import { useTexture } from "@react-three/drei"
import { useEffect } from "react";
import { Vector2, RepeatWrapping } from "three";

export default function Ground(){
  const texture = useTexture("textures/checker_board.png");

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(2.5, 5);
    texture.needsUpdate = true;
  }, []);

  return (
    <mesh 
      rotation-x={Math.PI * -0.5} 
      position-y={-0.51} 
      position-z={-4.5}
      scale={[5, 10, 5]}
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