import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Sky, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Player } from './Player'
import { Coin } from './Coin'
import { Platform } from './Platform'
import { BlockyTree } from './BlockyTree'

interface GameProps {
  onCollectCoin: () => void
  gameStarted: boolean
}

interface CoinData {
  id: number
  position: [number, number, number]
  collected: boolean
}

export function Game({ onCollectCoin, gameStarted }: GameProps) {
  const playerRef = useRef<THREE.Group>(null)
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 1, 0])
  const [coins, setCoins] = useState<CoinData[]>([])
  const { camera } = useThree()

  // Generate initial coins
  useEffect(() => {
    const newCoins: CoinData[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 4 + Math.random() * 4
      newCoins.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          1.5 + Math.random() * 0.5,
          Math.sin(angle) * radius
        ],
        collected: false
      })
    }
    setCoins(newCoins)
  }, [gameStarted])

  // Camera follow with smooth lerp
  useFrame(() => {
    if (playerRef.current && gameStarted) {
      const targetX = playerRef.current.position.x
      const targetZ = playerRef.current.position.z + 12
      const targetY = 8

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
      camera.lookAt(playerRef.current.position.x, 0, playerRef.current.position.z)

      setPlayerPosition([
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z
      ])
    }
  })

  // Coin collection
  const handleCoinCollect = (id: number) => {
    setCoins(prev => prev.map(coin =>
      coin.id === id ? { ...coin, collected: true } : coin
    ))
    onCollectCoin()
  }

  // Tree positions (decorative)
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.4
      const radius = 12 + Math.random() * 3
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ])
    }
    return positions
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-5, 10, -5]} intensity={0.5} color="#ffd700" />

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Ground Platform */}
      <Platform />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={40}
        blur={2}
        far={10}
      />

      {/* Player */}
      {gameStarted && (
        <Player ref={playerRef} />
      )}

      {/* Coins */}
      {coins.map(coin => !coin.collected && (
        <Coin
          key={coin.id}
          position={coin.position}
          playerPosition={playerPosition}
          onCollect={() => handleCoinCollect(coin.id)}
        />
      ))}

      {/* Decorative Trees */}
      {treePositions.map((pos, i) => (
        <BlockyTree key={i} position={pos} scale={0.8 + Math.random() * 0.4} />
      ))}

      {/* Decorative blocks scattered around */}
      <DecorativeBlocks />

      <Environment preset="park" />
    </>
  )
}

function DecorativeBlocks() {
  const blocks = useMemo(() => {
    const items: { position: [number, number, number]; color: string; scale: number }[] = []
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181']

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 8
      items.push({
        position: [
          Math.cos(angle) * radius,
          0.25 + Math.random() * 0.3,
          Math.sin(angle) * radius
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.3 + Math.random() * 0.4
      })
    }
    return items
  }, [])

  return (
    <>
      {blocks.map((block, i) => (
        <mesh key={i} position={block.position} castShadow receiveShadow>
          <boxGeometry args={[block.scale, block.scale, block.scale]} />
          <meshStandardMaterial color={block.color} />
        </mesh>
      ))}
    </>
  )
}
