"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play, Expand, Loader2 } from "lucide-react"
import { fadeUpInView } from "./animations"
import Lightbox from "@/components/ui/Lightbox"
import type { GalleryItem } from "@/types"

interface GalleryDoc {
  _id: string
  url: string
  caption: string
  type?: string
}

export default function RemembranceSlideshow() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data: GalleryDoc[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setGallery(
            data.map((d) => ({
              url: d.url,
              caption: d.caption || "",
              type: (d.type as "photo" | "video") ?? "photo",
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      if (gallery.length === 0) return
      setCurrent(((index % gallery.length) + gallery.length) % gallery.length)
    },
    [gallery.length]
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused || gallery.length === 0) return
    intervalRef.current = setInterval(next, 10000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next, paused, gallery.length])

  const item = gallery[current]

  return (
    <section
      className="relative px-6 py-14 sm:py-20"
      aria-labelledby="remembrance-heading"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUpInView(0)} className="text-center mb-8 sm:mb-10">
          <h2
            id="remembrance-heading"
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            A Life Remembered
          </h2>
          <p
            className="text-sm sm:text-base mt-2 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Cherished moments from a life beautifully lived
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
          </div>
        )}

        {/* Slideshow */}
        {!loading && gallery.length > 0 && item && (
          <>
            <motion.div
              {...fadeUpInView(0.1)}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-gold)",
                aspectRatio: "16/10",
              }}
            >
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute inset-0 z-10 w-full h-full cursor-pointer"
                aria-label="View full size"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.caption || `Photo ${current + 1}`}
                        fill
                        className="object-contain pointer-events-none"
                        sizes="(max-width: 768px) 100vw, 1024px"
                        priority={current === 0}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(transparent, rgba(15,15,31,0.85))" }}
              />

              {/* Caption */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cap-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                >
                  {item.caption && (
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        color: "var(--text-primary)",
                        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                      }}
                    >
                      {item.caption}
                    </p>
                  )}
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
                  >
                    {current + 1} / {gallery.length}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{
                  background: "rgba(15,15,31,0.6)",
                  color: "var(--text-primary)",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                style={{
                  background: "rgba(15,15,31,0.6)",
                  color: "var(--text-primary)",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setPaused(!paused)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20"
                style={{
                  background: "rgba(15,15,31,0.5)",
                  color: "var(--text-muted)",
                  backdropFilter: "blur(4px)",
                }}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>

              {/* Expand */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-14 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 hover:scale-110"
                style={{
                  background: "rgba(15,15,31,0.5)",
                  color: "var(--text-muted)",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="View full size"
              >
                <Expand size={14} />
              </button>
            </motion.div>

            <Lightbox
              items={gallery}
              index={current}
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              onPrev={prev}
              onNext={next}
            />

            {/* Thumbnail strip */}
            <div className="flex justify-start sm:justify-center gap-2 mt-6 overflow-x-auto pb-1 px-1 snap-x snap-mandatory">
              {gallery.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => goTo(i)}
                  className={`snap-start shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                    i === current ? "ring-2 scale-105" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    border: i === current ? "2px solid var(--accent-gold)" : "2px solid transparent",
                  }}
                  aria-label={`Go to photo ${i + 1}`}
                >
                  {img.type === "video" ? (
                    <video
                      src={img.url}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={img.url}
                      alt={img.caption || `Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
