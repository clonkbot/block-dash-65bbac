interface BlockyTreeProps {
  position: [number, number, number]
  scale?: number
}

export function BlockyTree({ position, scale = 1 }: BlockyTreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Foliage layers */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[2, 1.2, 2]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#2E8B57" />
      </mesh>

      <mesh position={[0, 4.1, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 0.9]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  )
}
