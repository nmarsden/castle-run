export default function Enemy ({ position }: { position: [number, number, number] }){
  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
      position={position}
    >
      <boxGeometry 
        args={[1, 1, 1]} 
      />
      <meshStandardMaterial 
        color={'red'} 
      />
    </mesh>  )
}