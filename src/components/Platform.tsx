import { useMemo } from 'react'

export function Platform() {
  // Checkerboard grass tiles
  const tiles = useMemo(() => {
    const items: { position: [number, number, number]; color: string }[] = []
    const size = 16
    const tileSize = 2

    for (let x = -size; x <= size; x += tileSize) {
      for (let z = -size; z <= size; z += tileSize) {
        const isLight = (Math.floor(x / tileSize) + Math.floor(z / tileSize)) % 2 === 0
        items.push({
          position: [x, 0, z],
          color: isLight ? '#7cfc00' : '#32cd32'
        })
      }
    }
    return items
  }, [])

  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[40, 1, 40]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>

      {/* Grass tiles */}
      {tiles.map((tile, i) => (
        <mesh key={i} position={tile.position} receiveShadow>
          <boxGeometry args={[1.95, 0.15, 1.95]} />
          <meshStandardMaterial color={tile.color} />
        </mesh>
      ))}

      {/* Edge decoration */}
      <EdgeBorder />
    </group>
  )
}

function EdgeBorder() {
  const positions = useMemo(() => {
    const items: [number, number, number][] = []
    const size = 16
    const spacing = 2

    // Four edges
    for (let i = -size; i <= size; i += spacing) {
      items.push([i, 0.3, -size - 1])
      items.push([i, 0.3, size + 1])
      items.push([-size - 1, 0.3, i])
      items.push([size + 1, 0.3, i])
    }

    return items
  }, [])

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[1.8, 0.8, 1.8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
    </>
  )
}
