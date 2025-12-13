"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  }, [playerPosition, foundLetters, questData.letters, currentRoom])

  const handleLetterClick = (letterId: string) => {
    if (!foundLetters.includes(letterId)) {
      setFoundLetters([...foundLetters, letterId])
      playSound("success")

      if (foundLetters.length + 1 === questData.letters.length) {
        setDoorOpen(true)
        playSound("unlock")
      }
    }
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

  const currentRoomData = ROOMS[currentRoom]
  const currentRoomLetters = questData.letters.filter((letter) => letter.roomId === currentRoom)

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
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[20%] w-32 h-1 bg-black/30 blur-sm rotate-12" />
          <div className="absolute top-[25%] right-[25%] w-24 h-1 bg-black/30 blur-sm -rotate-6" />
          <div className="absolute bottom-[30%] left-[30%] w-40 h-1 bg-black/30 blur-sm rotate-3" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 via-stone-950/40 to-transparent">
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/70 via-stone-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/70 via-stone-950/50 to-transparent pointer-events-none" />

        <div className="absolute left-[18%] top-[15%] bottom-[35%] w-16 md:w-24 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-l-2 border-r-2 border-stone-900/50">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 11px)",
            }}
          />
        </div>
        <div className="absolute right-[18%] top-[15%] bottom-[35%] w-16 md:w-24 bg-gradient-to-l from-stone-800 via-stone-700 to-stone-800 border-l-2 border-r-2 border-stone-900/50">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 11px)",
            }}
          />
        </div>

        <div className="absolute left-[20%] top-[20%]">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div
              className={`absolute inset-0 bg-${currentRoomData.torchColor}-500/30 rounded-full blur-xl animate-pulse`}
            />
            <div className={`absolute inset-2 bg-${currentRoomData.torchColor}-400/60 rounded-full animate-flicker`} />
            <div className={`absolute inset-4 bg-${currentRoomData.torchColor}-300 rounded-full`} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3 h-8 bg-stone-700 rounded-sm" />
          </div>
        </div>
        <div className="absolute right-[20%] top-[20%]">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div
              className={`absolute inset-0 bg-${currentRoomData.torchColor}-500/30 rounded-full blur-xl animate-pulse`}
            />
            <div className={`absolute inset-2 bg-${currentRoomData.torchColor}-400/60 rounded-full animate-flicker`} />
            <div className={`absolute inset-4 bg-${currentRoomData.torchColor}-300 rounded-full`} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3 h-8 bg-stone-700 rounded-sm" />
          </div>
        </div>

        {/* Room-specific decorations */}
        {currentRoom === 1 && (
          <>
            {/* Weapons on walls */}
            <div className="absolute left-[28%] top-[18%] w-2 h-20 bg-stone-600 rotate-15" />
            <div className="absolute left-[30%] top-[16%] w-16 h-2 bg-stone-500 rotate-15" />
            <div className="absolute right-[28%] top-[22%] w-2 h-20 bg-stone-600 -rotate-20" />
          </>
        )}

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
              <div
                className={`text-3xl md:text-5xl font-medieval font-bold relative ${
                  isFound
                    ? "text-amber-500"
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

        {/* Controls hint */}
        <div className="mt-3 bg-stone-950/80 border border-cyan-500/50 rounded-lg p-2">
          <p className="text-cyan-400 text-xs text-center font-medieval md:hidden">Drag to move • Tap doors</p>
          <p className="text-cyan-400 text-xs text-center font-medieval hidden md:block">
            WASD / Arrows to move • Explore all rooms
          </p>
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
