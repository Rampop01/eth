"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSound } from "./audio-player"
import { motion } from "framer-motion"

interface Letter {
  id: string
  letter: string
  roomId: number
  position: { x: string; y: string }
  hint: string
}

interface QuestRoomProps {
  questData: {
    word: string
    letters: Letter[]
  }
  questId: string
}

const ROOMS = [
  {
    id: 0,
    name: "The Entrance Hall",
    description: "Crumbling stone archways lead deeper",
    bgGradient: "from-stone-950 via-stone-900 to-stone-800",
    torchColor: "amber",
  },
  {
    id: 1,
    name: "The Ancient Armory",
    description: "Rusted weapons hang on weathered walls",
    bgGradient: "from-stone-900 via-zinc-900 to-stone-800",
    torchColor: "orange",
  },
  {
    id: 2,
    name: "The Crypt Passage",
    description: "Shadows dance across forgotten tombs",
    bgGradient: "from-zinc-950 via-stone-950 to-zinc-900",
    torchColor: "red",
  },
  {
    id: 3,
    name: "The Treasure Vault",
    description: "Ancient relics glow in the darkness",
    bgGradient: "from-amber-950 via-stone-900 to-stone-800",
    torchColor: "yellow",
  },
]

export function QuestRoom({ questData, questId }: QuestRoomProps) {
  const [foundLetters, setFoundLetters] = useState<string[]>([])
  const [currentRoom, setCurrentRoom] = useState(0)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 70 })
  const [isMoving, setIsMoving] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // seconds
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [highlightLetters, setHighlightLetters] = useState<string[]>([])
  const lastFoundRef = useRef<number | null>(null)
  const [triggeredDecoys, setTriggeredDecoys] = useState<string[]>([])
  const [decoys] = useState(() => {
    // create a few decoy positions per room to increase challenge
    return ROOMS.flatMap((room) =>
      new Array(2).fill(0).map((_, i) => ({
        id: `decoy-${room.id}-${i}`,
        roomId: room.id,
        position: { x: `${20 + Math.random() * 60}%`, y: `${25 + Math.random() * 50}%` },
      }))
    )
  })

  const [timeUp, setTimeUp] = useState(false)

  // New gameplay states
  const [lives, setLives] = useState(3)
  const [invulnerable, setInvulnerable] = useState(false)

  // moving obstacles (hazards) per room — create multiple per room with varied behavior
  const [obstacles, setObstacles] = useState(() =>
    ROOMS.flatMap((room, idx) =>
      new Array(3).fill(0).map((_, j) => ({
        id: `obs-${idx}-${j}`,
        roomId: room.id,
        x: 20 + Math.random() * 60,
        y: 30 + Math.random() * 40,
        dir: Math.random() < 0.5 ? -1 : 1,
        yDir: Math.random() < 0.5 ? -1 : 1,
        speed: 0.4 + Math.random() * 1.2,
        vSpeed: 0.2 + Math.random() * 0.6,
        size: Math.random() < 0.5 ? 6 : 8,
      }))
    )
  )

  // pressure-plate puzzle for room 3
  const PLATES = [
    { id: "plate-0", x: 40, y: 50 },
    { id: "plate-1", x: 50, y: 50 },
    { id: "plate-2", x: 60, y: 50 },
  ]
  const requiredSequence = ["plate-0", "plate-1", "plate-2"]
  const [plateSequence, setPlateSequence] = useState<string[]>([])
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [bonusLetters, setBonusLetters] = useState<Letter[]>([])

  // Countdown timer
  useEffect(() => {
    if (timeUp) return
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          setTimeUp(true)
          setTransitioning(true)
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(t)
  }, [timeUp])
  const router = useRouter()
  const { playSound } = useSound()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (transitioning) return

      const step = 2
      let newX = playerPosition.x
      let newY = playerPosition.y

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        newX = Math.max(15, playerPosition.x - step)
        if (playerPosition.x <= 17 && currentRoom > 0) {
          changeRoom(currentRoom - 1, 85, playerPosition.y)
          return
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        newX = Math.min(85, playerPosition.x + step)
        if (playerPosition.x >= 83 && currentRoom < ROOMS.length - 1) {
          changeRoom(currentRoom + 1, 15, playerPosition.y)
          return
        }
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        newY = Math.max(20, playerPosition.y - step)
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        newY = Math.min(75, playerPosition.y + step)
      }

      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        setIsMoving(true)
        setPlayerPosition({ x: newX, y: newY })
        setTimeout(() => setIsMoving(false), 150)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playerPosition, currentRoom, transitioning])

  const changeRoom = (newRoomId: number, newX: number, newY: number) => {
    setTransitioning(true)
    playSound("click")

    setTimeout(() => {
      setCurrentRoom(newRoomId)
      setPlayerPosition({ x: newX, y: newY })
      setTransitioning(false)
    }, 600)
  }

  useEffect(() => {
    const currentRoomLetters = questData.letters.filter((letter) => letter.roomId === currentRoom)

    currentRoomLetters.forEach((letter) => {
      if (foundLetters.includes(letter.id)) return

      const letterX = Number.parseFloat(letter.position.x)
      const letterY = Number.parseFloat(letter.position.y)
      const distance = Math.sqrt(Math.pow(playerPosition.x - letterX, 2) + Math.pow(playerPosition.y - letterY, 2))

      if (distance < 5) {
        handleLetterClick(letter.id)
      }
    })
    // decoy / trap detection
    decoys
      .filter((d) => d.roomId === currentRoom)
      .forEach((d) => {
        if (triggeredDecoys.includes(d.id)) return
        const dx = Number.parseFloat(String(d.position.x))
        const dy = Number.parseFloat(String(d.position.y))
        const distance = Math.sqrt(Math.pow(playerPosition.x - dx, 2) + Math.pow(playerPosition.y - dy, 2))
        if (distance < 5) {
          // trigger trap
          setTriggeredDecoys((t) => [...t, d.id])
          setScore((s) => Math.max(0, s - 30))
          setTimeLeft((t) => Math.max(0, t - 10))
          playSound("trap")
        }
      })
  }, [playerPosition, foundLetters, questData.letters, currentRoom, decoys, triggeredDecoys])

  // Move obstacles periodically and detect collisions
  useEffect(() => {
    const t = setInterval(() => {
      setObstacles((prev) =>
        prev.map((o) => {
          if (o.roomId !== currentRoom) return o
          let nx = o.x + o.dir * o.speed
          let ny = (o as any).y + (o as any).yDir * (o as any).vSpeed
          let ndir = o.dir
          let nydir = (o as any).yDir
          if (nx < 15) {
            nx = 15
            ndir = 1
          } else if (nx > 85) {
            nx = 85
            ndir = -1
          }
          if (ny < 25) {
            ny = 25
            nydir = 1
          } else if (ny > 75) {
            ny = 75
            nydir = -1
          }
          return { ...o, x: nx, y: ny, dir: ndir, yDir: nydir }
        })
      )
    }, 160)

    return () => clearInterval(t)
  }, [currentRoom])

  // obstacle collision detection
  useEffect(() => {
    if (invulnerable) return
    obstacles.forEach((o) => {
      if (o.roomId !== currentRoom) return
      const distance = Math.sqrt(Math.pow(playerPosition.x - o.x, 2) + Math.pow(playerPosition.y - o.y, 2))
      if (distance < 6) {
        // hit obstacle
        setLives((l) => Math.max(0, l - 1))
        setScore((s) => Math.max(0, s - 50))
        setTimeLeft((t) => Math.max(0, t - 15))
        setInvulnerable(true)
        playSound("fail")
        setTimeout(() => setInvulnerable(false), 2000)
      }
    })
  }, [playerPosition, obstacles, invulnerable, currentRoom])

  // pressure plate detection (room 3)
  useEffect(() => {
    if (puzzleSolved || currentRoom !== 3) return
    PLATES.forEach((p) => {
      const distance = Math.sqrt(Math.pow(playerPosition.x - p.x, 2) + Math.pow(playerPosition.y - p.y, 2))
      if (distance < 6) {
        setPlateSequence((seq) => {
          if (seq[seq.length - 1] === p.id) return seq
          const next = [...seq, p.id].slice(-requiredSequence.length)
          for (let i = 0; i < next.length; i++) {
            if (next[i] !== requiredSequence[i]) {
              playSound("fail")
              return []
            }
          }
          playSound("click")
          if (next.length === requiredSequence.length) {
            setPuzzleSolved(true)
            playSound("unlock")
            const bonus: Letter = {
              id: `bonus-${Date.now()}`,
              letter: "★",
              roomId: 3,
              position: { x: "50%", y: "35%" },
              hint: "A hidden relic!",
            }
            setBonusLetters((b) => [...b, bonus])
            setScore((s) => s + 300)
            setTimeLeft((t) => t + 30)
          }
          return next
        })
      }
    })
  }, [playerPosition, puzzleSolved, currentRoom])

  const handleLetterClick = (letterId: string) => {
    if (foundLetters.includes(letterId)) return

    // scoring: base points + time bonus + combo multiplier
    const now = Date.now()
    const last = lastFoundRef.current
    const deltaSec = last ? (now - last) / 1000 : 999
    const base = 100
    const timeBonus = Math.max(0, 50 - Math.floor(deltaSec * 2))
    const combo = deltaSec < 5 ? 1.5 : 1.0
    const points = Math.round((base + timeBonus) * combo)

    setFoundLetters((prev) => {
      const updated = [...prev, letterId]
      // reward points
      setScore((s) => s + points)
      lastFoundRef.current = now

      // check completion
      if (updated.length === questData.letters.length) {
        setDoorOpen(true)
        playSound("unlock")
        // bonus for finishing quickly
        const finishBonus = Math.max(0, Math.floor(timeLeft / 2))
        setScore((s) => s + finishBonus)
      }

      playSound("success")
      return updated
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (transitioning) return

    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    setPlayerPosition({
      x: Math.max(15, Math.min(85, x)),
      y: Math.max(20, Math.min(75, y)),
    })
    setIsMoving(true)
    setTimeout(() => setIsMoving(false), 150)
  }

  const handleProceed = () => {
    playSound("click")
    router.push(`/quiz/${questId}`)
  }

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
  }

  const requestHint = () => {
    if (hintsRemaining > 0) {
      setHintsRemaining((h) => h - 1)
      const ids = questData.letters.filter((l) => l.roomId === currentRoom).map((l) => l.id)
      setHighlightLetters(ids)
      playSound("hint")
      setTimeout(() => setHighlightLetters([]), 6000)
      return
    }

    // pay points for hint if available
    const cost = 50
    if (score >= cost) {
      setScore((s) => s - cost)
      const ids = questData.letters.filter((l) => l.roomId === currentRoom).map((l) => l.id)
      setHighlightLetters(ids)
      playSound("hint")
      setTimeout(() => setHighlightLetters([]), 6000)
    }
  }

  const currentRoomData = ROOMS[currentRoom]
  const currentRoomLetters = [...questData.letters, ...bonusLetters].filter((letter) => letter.roomId === currentRoom)

  return (
    <div className="relative w-full h-screen overflow-hidden touch-none" onTouchMove={handleTouchMove}>
      {transitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="text-amber-400 font-medieval text-xl md:text-3xl animate-pulse">
            Entering {ROOMS[currentRoom]?.name}...
          </div>
        </motion.div>
      )}

      {timeUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-stone-900/95 border border-amber-600 rounded-lg p-6 text-center">
            <h2 className="text-amber-300 text-2xl mb-3 font-medieval">Time's Up</h2>
            <p className="text-stone-400 mb-4">You ran out of time. Try again or proceed to the quiz to claim partial rewards.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  // retry: reset state
                  setTimeLeft(180)
                  setTimeUp(false)
                  setTransitioning(false)
                  setFoundLetters([])
                  setScore(0)
                  setTriggeredDecoys([])
                  lastFoundRef.current = null
                }}
                className="px-4 py-2 bg-cyan-600 text-stone-900 rounded"
              >
                Retry
              </button>
              <button
                onClick={() => router.push(`/quiz/${questId}`)}
                className="px-4 py-2 bg-amber-600 text-stone-900 rounded"
              >
                Proceed to Quiz
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentRoomData.bgGradient} transition-colors duration-1000`}
      >
        {/* Stone wall texture overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0zM40 40h20v20H40zM60 0h40v30H60zM0 60h30v40H0zM30 40h30v20H30zM70 30h30v30H70zM60 70h40v30H60z' fill='%23000' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Wall cracks and details */}
        <div className="absolute top-4 left-4 z-30 flex items-start gap-3 max-w-[calc(100%-3rem)]">
          {/* Room card (compact) */}
          <div className="bg-stone-950/90 backdrop-blur-sm border-2 border-amber-700/60 rounded-md p-2 w-auto flex-shrink-0">
            <h2 className="text-amber-400 font-medieval text-sm md:text-base font-bold text-center">{currentRoomData.name}</h2>
            <p className="text-stone-400 text-[10px] md:text-xs text-center italic">{currentRoomData.description}</p>
          </div>

          {/* Found letters (compact, horizontally scrollable) */}
          <div className="bg-stone-950/90 backdrop-blur-sm border-2 border-cyan-600/60 rounded-md p-2 inline-flex items-center gap-2 overflow-hidden">
            <h3 className="text-cyan-400 font-medieval text-xs md:text-sm mr-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="hidden md:inline">Found</span>
            </h3>
            <div className="flex gap-2 overflow-x-auto pr-2" style={{ maxWidth: 240 }}>
              {questData.word.split("").map((letter, index) => {
                const letterData = questData.letters[index]
                const isFound = letterData && foundLetters.includes(letterData.id)
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border rounded text-sm md:text-lg font-bold font-medieval transition-all duration-300 ${
                      isFound ? "border-amber-500 text-amber-400 bg-amber-500/10" : "border-stone-700 text-stone-600 bg-stone-900/50"
                    }`}
                  >
                    {isFound ? letter : "?"}
                  </div>
                )
              })}
            </div>
            <div className="ml-2 text-stone-400 text-xs">{foundLetters.length}/{questData.letters.length}</div>
          </div>

          {/* Right-side HUD */}
          <div className="ml-auto flex items-center gap-2">
            <div className="bg-stone-950/90 border border-amber-700/50 rounded-md px-3 py-1 text-center">
              <div className="text-amber-400 text-xs">Score</div>
              <div className="text-stone-300 font-bold text-sm">{score}</div>
            </div>
            <div className="bg-stone-950/90 border border-cyan-700/40 rounded-md px-3 py-1 text-center">
              <div className="text-amber-400 text-xs">Time</div>
              <div className="text-stone-300 font-bold text-sm">{formatTime(timeLeft)}</div>
            </div>
            <button onClick={requestHint} className="px-2 py-1 bg-cyan-600/70 hover:bg-cyan-500 text-stone-900 rounded text-sm">
              Hint ({hintsRemaining})
            </button>
            <div className="bg-stone-950/90 border border-red-700/40 rounded-md px-2 py-1 text-center">
              <div className="text-amber-400 text-xs">Lives</div>
              <div className="text-stone-300 font-bold text-sm">{lives}</div>
            </div>
            </div>
          </div>

        {currentRoom === 2 && (
          <>
            {/* Tomb alcoves */}
            <div className="absolute left-[25%] top-[25%] w-20 h-24 bg-black/60 border-2 border-stone-800 rounded-sm" />
            <div className="absolute right-[25%] top-[30%] w-20 h-24 bg-black/60 border-2 border-stone-800 rounded-sm" />
          </>
        )}

        {currentRoom === 3 && (
          <>
            {/* Treasure chest silhouette */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[30%] w-24 h-16 bg-amber-900/40 border-2 border-amber-800 rounded-sm" />
          </>
        )}

        {currentRoom > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => changeRoom(currentRoom - 1, 80, 50)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-20 md:w-28 h-36 md:h-48 bg-black/80 cursor-pointer group"
            style={{ clipPath: "polygon(0 100%, 0 0, 100% 10%, 100% 90%)" }}
          >
            <div className="w-full h-full border-2 border-amber-700/40 flex items-center justify-center">
              <div className="text-amber-400 text-3xl md:text-5xl group-hover:text-amber-300 transition-colors">←</div>
            </div>
          </motion.div>
        )}

        {currentRoom < ROOMS.length - 1 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => changeRoom(currentRoom + 1, 20, 50)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-20 md:w-28 h-36 md:h-48 bg-black/80 cursor-pointer group"
            style={{ clipPath: "polygon(100% 100%, 100% 0, 0 10%, 0 90%)" }}
          >
            <div className="w-full h-full border-2 border-amber-700/40 flex items-center justify-center">
              <div className="text-amber-400 text-3xl md:text-5xl group-hover:text-amber-300 transition-colors">→</div>
            </div>
          </motion.div>
        )}

        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-stone-400/10 rounded-full animate-float blur-sm"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${25 + Math.random() * 50}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Letters with improved visibility */}
      {currentRoomLetters.map((letter) => {
        const isFound = foundLetters.includes(letter.id)
        const isHighlighted = highlightLetters.includes(letter.id)
        const letterX = Number.parseFloat(letter.position.x)
        const letterY = Number.parseFloat(letter.position.y)
        const distance = Math.sqrt(Math.pow(playerPosition.x - letterX, 2) + Math.pow(playerPosition.y - letterY, 2))

        const isNearby = distance < 12
        const isVeryClose = distance < 8

        return (
          <motion.div
            key={letter.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: letter.position.x,
              top: letter.position.y,
              transform: "translate(-50%, -50%)",
            }}
            animate={
              isFound
                ? { scale: 0, opacity: 0 }
                : isHighlighted
                  ? { scale: 1.4, opacity: 1 }
                  : isVeryClose
                    ? { scale: 1.3, opacity: 1 }
                    : isNearby
                      ? { scale: 1, opacity: 0.8 }
                      : { scale: 0.5, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {isNearby && !isFound && <div className="absolute inset-0 bg-cyan-400/30 blur-lg animate-pulse" />}
              {isHighlighted && !isFound && <div className="absolute inset-0 ring-2 ring-cyan-400/70 blur-sm rounded" />}
              <div
                className={`text-3xl md:text-5xl font-medieval font-bold relative ${
                  isFound
                    ? "text-amber-500"
                    : isHighlighted
                      ? "text-amber-300 animate-pulse"
                      : isVeryClose
                        ? "text-cyan-300 animate-bounce"
                        : isNearby
                          ? "text-cyan-400"
                          : "text-transparent"
                }`}
                style={{
                  textShadow: isNearby && !isFound ? "0 0 20px rgba(34, 211, 238, 0.8)" : "none",
                }}
              >
                {letter.letter}
              </div>
              {isVeryClose && !isFound && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="bg-stone-900/95 border border-cyan-400/50 rounded px-2 py-1 text-xs md:text-sm text-cyan-300">
                    {letter.hint}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      })}

      {/* Decoys / traps */}
      {decoys
        .filter((d) => d.roomId === currentRoom)
        .map((d) => {
          const triggered = triggeredDecoys.includes(d.id)
          return (
            <motion.div
              key={d.id}
              className="absolute z-10 pointer-events-none"
              style={{
                left: d.position.x,
                top: d.position.y,
                transform: "translate(-50%, -50%)",
              }}
              animate={triggered ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xl md:text-2xl text-red-400 drop-shadow-lg">✦</div>
            </motion.div>
          )
        })}

      {/* Player character */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          left: `${playerPosition.x}%`,
          top: `${playerPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: isMoving ? [1, 0.98, 1] : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="relative">
          {/* Shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 md:w-10 h-2 bg-black/40 rounded-full blur-sm" />
          {/* Character body */}
          <div className="w-8 h-12 md:w-12 md:h-16 relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
            {/* Head */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full border-2 border-amber-900" />
            {/* Body */}
            <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-b from-purple-700 to-purple-800 rounded-sm border-2 border-purple-950" />
            {/* Legs */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
              <motion.div
                className="w-2 h-3 md:w-2.5 md:h-4 bg-stone-800 border border-stone-900 rounded-sm"
                animate={isMoving ? { rotate: [0, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="w-2 h-3 md:w-2.5 md:h-4 bg-stone-800 border border-stone-900 rounded-sm"
                animate={isMoving ? { rotate: [0, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Obstacles (moving hazards) */}
      {obstacles
        .filter((o) => o.roomId === currentRoom)
        .map((o) => (
          <motion.div
            key={o.id}
            className="absolute z-15 pointer-events-none"
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={invulnerable ? { scale: 0.9, opacity: 0.6 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-red-500 drop-shadow-lg">⚔</div>
          </motion.div>
        ))}

      {/* Pressure plates (room 3) */}
      {currentRoom === 3 && (
        <>
          {PLATES.map((p) => (
            <div
              key={p.id}
              className={`absolute w-8 h-3 rounded-sm bg-stone-800 border-2 border-stone-900/60 ${
                plateSequence.includes(p.id) ? "bg-amber-600" : "bg-stone-800"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </>
      )}

      {/* UI - Top section */}
      <div className="absolute top-4 left-4 right-4 z-30">
        {/* Room name */}
        <div className="bg-stone-950/90 backdrop-blur-sm border-2 border-amber-700/60 rounded-lg p-2 md:p-3 mb-3">
          <h2 className="text-amber-400 font-medieval text-lg md:text-2xl font-bold text-center">
            {currentRoomData.name}
          </h2>
          <p className="text-stone-400 text-xs md:text-sm text-center italic">{currentRoomData.description}</p>
        </div>

        {/* Found letters */}
        <div className="bg-stone-950/90 backdrop-blur-sm border-2 border-cyan-600/60 rounded-lg p-3 md:p-4">
          <h3 className="text-cyan-400 font-medieval text-sm md:text-lg mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Found Letters
          </h3>
          <div className="flex gap-2 flex-wrap">
            {questData.word.split("").map((letter, index) => {
              const letterData = questData.letters[index]
              const isFound = letterData && foundLetters.includes(letterData.id)
              return (
                <div
                  key={index}
                  className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center border-2 rounded text-lg md:text-2xl font-bold font-medieval transition-all duration-300 ${
                    isFound
                      ? "border-amber-500 text-amber-400 bg-amber-500/10"
                      : "border-stone-700 text-stone-600 bg-stone-900/50"
                  }`}
                >
                  {isFound ? letter : "?"}
                </div>
              )
            })}
          </div>
          <p className="text-stone-400 text-xs md:text-sm mt-2">
            <span className="text-cyan-400 font-bold">{foundLetters.length}</span> /{" "}
            <span className="text-amber-400 font-bold">{questData.letters.length}</span> collected
          </p>
        </div>

        {/* Controls hint + HUD */}
        <div className="mt-3 bg-stone-950/80 border border-cyan-500/50 rounded-lg p-2 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-cyan-400 text-xs text-center font-medieval md:hidden">Drag to move • Tap doors</p>
            <p className="text-cyan-400 text-xs text-center font-medieval hidden md:block">WASD / Arrows to move • Explore all rooms</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-amber-400 font-bold">Score</div>
              <div className="text-stone-400">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-amber-400 font-bold">Time</div>
              <div className="text-stone-400">{formatTime(timeLeft)}</div>
            </div>
            <button
              onClick={requestHint}
              className="ml-2 px-3 py-1 bg-cyan-600/70 hover:bg-cyan-500 text-stone-900 rounded font-medieval text-sm"
            >
              Hint ({hintsRemaining})
            </button>
          </div>
        </div>
      </div>

      {/* Portal when complete */}
      {doorOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
        >
          <div className="relative">
            <div className="w-40 h-56 md:w-56 md:h-72 bg-gradient-to-b from-cyan-500/40 via-purple-500/40 to-amber-500/40 rounded-2xl animate-pulse backdrop-blur-sm border-2 border-amber-500/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-300/20 to-purple-300/20 blur-2xl animate-pulse" />
            <button
              onClick={handleProceed}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medieval font-bold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all"
            >
              Enter Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
