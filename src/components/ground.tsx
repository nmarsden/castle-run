export default function Ground(){
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
      <meshStandardMaterial color={'#b7afaf'} />
    </mesh>  
  )
}