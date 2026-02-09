import { useState, useEffect } from 'react'

interface GameUIProps {
  coins: number
  showInstructions: boolean
  onStart: () => void
  gameStarted: boolean
}

export function GameUI({ coins, showInstructions, onStart, gameStarted }: GameUIProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (coins > 0) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 300)
      return () => clearTimeout(timer)
    }
  }, [coins])

  return (
    <>
      {/* Title & Start Screen */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-1 rounded-3xl pointer-events-auto shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 max-w-md mx-4">
              {/* Logo */}
              <div className="text-center mb-6">
                <h1 className="font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 tracking-tight mb-2"
                    style={{ fontFamily: "'Bangers', cursive", letterSpacing: '2px' }}>
                  BLOCK DASH
                </h1>
                <div className="flex justify-center gap-2 mt-3">
                  <span className="w-3 h-3 bg-yellow-400 rounded-sm animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-3 h-3 bg-orange-400 rounded-sm animate-bounce" style={{ animationDelay: '100ms' }}></span>
                  <span className="w-3 h-3 bg-red-400 rounded-sm animate-bounce" style={{ animationDelay: '200ms' }}></span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-yellow-300">W</kbd>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-yellow-300">A</kbd>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-yellow-300">S</kbd>
                    <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-yellow-300">D</kbd>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>Move around</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <kbd className="px-3 py-1 bg-slate-700 rounded text-xs font-bold text-cyan-300">SPACE</kbd>
                  <span className="text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>Jump</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="text-2xl">🪙</span>
                  <span className="text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>Collect all the coins!</span>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={onStart}
                className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-slate-900 font-black text-xl rounded-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-green-500/50"
                style={{ fontFamily: "'Bangers', cursive", letterSpacing: '3px' }}
              >
                PLAY NOW
              </button>

              {/* Mobile hint */}
              <p className="text-center text-white/40 text-xs mt-4 md:hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Use a keyboard to play!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* In-Game HUD */}
      {gameStarted && (
        <>
          {/* Coin Counter */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-6 md:py-4 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className={`text-3xl md:text-4xl transition-transform duration-300 ${animate ? 'scale-150' : 'scale-100'}`}>
                  🪙
                </div>
                <span
                  className={`text-3xl md:text-4xl font-black text-yellow-300 transition-all duration-300 ${animate ? 'scale-125 text-yellow-100' : ''}`}
                  style={{ fontFamily: "'Bangers', cursive" }}
                >
                  {coins}
                </span>
              </div>
            </div>
          </div>

          {/* Controls reminder - desktop only */}
          <div className="absolute bottom-16 left-4 md:left-6 z-10 hidden md:block">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <div className="flex gap-2 text-white/60 text-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
                <span>WASD move</span>
                <span>•</span>
                <span>SPACE jump</span>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <MobileControls />
        </>
      )}
    </>
  )
}

function MobileControls() {
  const simulateKey = (key: string, type: 'keydown' | 'keyup') => {
    window.dispatchEvent(new KeyboardEvent(type, { code: key }))
  }

  const handleTouchStart = (key: string) => {
    simulateKey(key, 'keydown')
  }

  const handleTouchEnd = (key: string) => {
    simulateKey(key, 'keyup')
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 z-10 md:hidden flex justify-between px-4">
      {/* D-Pad */}
      <div className="relative w-32 h-32">
        {/* Up */}
        <button
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg active:bg-white/40 flex items-center justify-center"
          onTouchStart={() => handleTouchStart('KeyW')}
          onTouchEnd={() => handleTouchEnd('KeyW')}
        >
          <span className="text-white text-xl">▲</span>
        </button>
        {/* Down */}
        <button
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg active:bg-white/40 flex items-center justify-center"
          onTouchStart={() => handleTouchStart('KeyS')}
          onTouchEnd={() => handleTouchEnd('KeyS')}
        >
          <span className="text-white text-xl">▼</span>
        </button>
        {/* Left */}
        <button
          className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg active:bg-white/40 flex items-center justify-center"
          onTouchStart={() => handleTouchStart('KeyA')}
          onTouchEnd={() => handleTouchEnd('KeyA')}
        >
          <span className="text-white text-xl">◀</span>
        </button>
        {/* Right */}
        <button
          className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg active:bg-white/40 flex items-center justify-center"
          onTouchStart={() => handleTouchStart('KeyD')}
          onTouchEnd={() => handleTouchEnd('KeyD')}
        >
          <span className="text-white text-xl">▶</span>
        </button>
      </div>

      {/* Jump Button */}
      <button
        className="w-20 h-20 bg-cyan-500/30 backdrop-blur-sm rounded-full active:bg-cyan-400/50 border-4 border-cyan-400/50 flex items-center justify-center self-end"
        onTouchStart={() => handleTouchStart('Space')}
        onTouchEnd={() => handleTouchEnd('Space')}
      >
        <span className="text-white font-bold text-sm" style={{ fontFamily: "'Bangers', cursive" }}>JUMP</span>
      </button>
    </div>
  )
}
