export default function Player (){
  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
    >
      <boxGeometry 
        args={[1, 1, 1]} 
      />
      <meshStandardMaterial 
        color={'orange'} 
      />
    </mesh>  )
}