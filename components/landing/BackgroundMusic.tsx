"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Music, Music2, VolumeX } from "lucide-react"

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        // autoplay blocked — show toast or just silently fail
      })
      setPlaying(true)
    }
  }, [playing])

  if (!mounted) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/memorial-music.mp3"
        loop
        preload="auto"
        onEnded={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />

      {/* Floating music toggle button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          background: playing
            ? "linear-gradient(135deg, #c9a84c, #e8c96a)"
            : "rgba(255,255,255,0.08)",
          border: "1px solid rgba(201,168,76,0.4)",
          boxShadow: playing ? "0 0 20px rgba(201,168,76,0.3)" : "none",
          color: playing ? "#1a1a2e" : "var(--text-muted)",
        }}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Music2 size={18} /> : <Music size={18} />}
      </button>
    </>
  )
}
