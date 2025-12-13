"use client"

import { useEffect, useRef } from "react"

interface AudioPlayerProps {
  src: string
  loop?: boolean
  volume?: number
  autoplay?: boolean
}

export function AudioPlayer({ src, loop = false, volume = 0.3, autoplay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      if (autoplay) {
        audioRef.current.play().catch(() => {
          // Autoplay was prevented
        })
      }
    }
  }, [volume, autoplay])

  return <audio ref={audioRef} src={src} loop={loop} className="hidden" />
}

export function useSound() {
  const playSound = (
    soundType:
      | "click"
      | "success"
      | "fail"
      | "unlock"
      | "collect"
      | "hint"
      | "trap"
      | string
  ) => {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different frequencies for different sounds
    const soundMap = {
      click: { freq: 400, duration: 0.1, gain: 0.1 },
      success: { freq: 800, duration: 0.3, gain: 0.2 },
      fail: { freq: 200, duration: 0.4, gain: 0.15 },
      unlock: { freq: 600, duration: 0.5, gain: 0.2 },
      collect: { freq: 1000, duration: 0.2, gain: 0.15 },
    }

    const sound = soundMap[soundType as keyof typeof soundMap]

    // Guard: if a caller requests an unknown sound, silently return
    if (!sound) {
      // fallback: short click
      const fallback = soundMap.click
      oscillator.frequency.setValueAtTime(fallback.freq, audioContext.currentTime)
      gainNode.gain.setValueAtTime(fallback.gain, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + fallback.duration)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + fallback.duration)
      return
    }

    oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime)
    gainNode.gain.setValueAtTime(sound.gain, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + sound.duration)
  }

  return { playSound }
}
