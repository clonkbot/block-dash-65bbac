import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoinProps {
  position: [number, number, number]
  playerPosition: [number, number, number]
  onCollect: () => void
}

export function Coin({ position, playerPosition, onCollect }: CoinProps) {
  const ref = useRef<THREE.Group>(null)
  const [collected, setCollected] = useState(false)
  const collectAnimation = useRef(0)

  useFrame((state, delta) => {
    if (!ref.current) return

    // Spinning animation
    ref.current.rotation.y += delta * 2

    // Floating animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15

    // Check distance to player for collection
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[1] - position[1], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    )

    if (distance < 1.5 && !collected) {
      setCollected(true)
      onCollect()
    }

    // Collection animation
    if (collected) {
      collectAnimation.current += delta * 5
      ref.current.scale.setScalar(Math.max(0, 1 - collectAnimation.current))
      ref.current.position.y += delta * 3
    }
  })

  if (collected && collectAnimation.current > 1) return null

  return (
    <group ref={ref} position={position}>
      {/* Main coin body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffa500"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner ring detail */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 16]} />
        <meshStandardMaterial
          color="#ffec8b"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Star shape in center */}
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#ff8c00"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Sparkle effect */}
      <pointLight
        color="#ffd700"
        intensity={0.5}
        distance={3}
      />
    </group>
  )
}
