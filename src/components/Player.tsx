import { forwardRef, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlayerProps {}

export const Player = forwardRef<THREE.Group, PlayerProps>((_, ref) => {
  const innerRef = useRef<THREE.Group>(null)
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  })
  const velocity = useRef(new THREE.Vector3())
  const isJumping = useRef(false)
  const bobPhase = useRef(0)

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys(k => ({ ...k, forward: true }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setKeys(k => ({ ...k, backward: true }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setKeys(k => ({ ...k, left: true }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setKeys(k => ({ ...k, right: true }))
          break
        case 'Space':
          setKeys(k => ({ ...k, jump: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys(k => ({ ...k, forward: false }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setKeys(k => ({ ...k, backward: false }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setKeys(k => ({ ...k, left: false }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setKeys(k => ({ ...k, right: false }))
          break
        case 'Space':
          setKeys(k => ({ ...k, jump: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    const group = ref && 'current' in ref ? ref.current : innerRef.current
    if (!group) return

    const speed = 8
    const jumpForce = 8
    const gravity = 20

    // Movement
    const direction = new THREE.Vector3()
    if (keys.forward) direction.z -= 1
    if (keys.backward) direction.z += 1
    if (keys.left) direction.x -= 1
    if (keys.right) direction.x += 1

    if (direction.length() > 0) {
      direction.normalize()
      velocity.current.x = direction.x * speed
      velocity.current.z = direction.z * speed

      // Rotate player to face movement direction
      const targetRotation = Math.atan2(direction.x, direction.z)
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation, 0.2)

      // Walking bob
      bobPhase.current += delta * 15
    } else {
      velocity.current.x *= 0.85
      velocity.current.z *= 0.85
    }

    // Jump
    if (keys.jump && !isJumping.current && group.position.y <= 1.01) {
      velocity.current.y = jumpForce
      isJumping.current = true
    }

    // Gravity
    velocity.current.y -= gravity * delta

    // Apply velocity
    group.position.x += velocity.current.x * delta
    group.position.y += velocity.current.y * delta
    group.position.z += velocity.current.z * delta

    // Ground collision
    if (group.position.y < 1) {
      group.position.y = 1
      velocity.current.y = 0
      isJumping.current = false
    }

    // Boundary
    const boundary = 15
    group.position.x = THREE.MathUtils.clamp(group.position.x, -boundary, boundary)
    group.position.z = THREE.MathUtils.clamp(group.position.z, -boundary, boundary)
  })

  const actualRef = ref || innerRef

  return (
    <group ref={actualRef as React.RefObject<THREE.Group>} position={[0, 1, 0]}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.9, 0.5]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#f5d5c8" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1.2, 0.36]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.15, 1.2, 0.36]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.0, 0.36]}>
        <boxGeometry args={[0.25, 0.08, 0.02]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.55, 0.35, 0]} castShadow>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#f5d5c8" />
      </mesh>
      <mesh position={[0.55, 0.35, 0]} castShadow>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#f5d5c8" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>
      <mesh position={[0.2, -0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>
    </group>
  )
})

Player.displayName = 'Player'
