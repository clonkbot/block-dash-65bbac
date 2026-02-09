import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Game } from './components/Game'
import { GameUI } from './components/GameUI'

export default function App() {
  const [coins, setCoins] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const collectCoin = useCallback(() => {
    setCoins(prev => prev + 1)
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setShowInstructions(false)
    setCoins(0)
  }, [])

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 overflow-hidden relative">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 50 }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <Game
            onCollectCoin={collectCoin}
            gameStarted={gameStarted}
          />
        </Suspense>
      </Canvas>

      {/* Game UI Overlay */}
      <GameUI
        coins={coins}
        showInstructions={showInstructions}
        onStart={startGame}
        gameStarted={gameStarted}
      />

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-[10px] md:text-xs text-slate-600/60 font-medium tracking-wide">
          Requested by @CryptoCosm91341 · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}
