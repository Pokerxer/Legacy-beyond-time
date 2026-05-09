"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Expand, ImageIcon } from "lucide-react"
import type { GalleryItem } from "@/types"
import Lightbox from "@/components/ui/Lightbox"

interface GalleryGridProps {
  items: GalleryItem[]
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % items.length), [items.length])

  if (items.length === 0) {
    return (
      <section id="gallery" className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-16 gap-4"
            style={{ color: "var(--text-muted)" }}
          >
            <ImageIcon size={48} style={{ color: "var(--border-gold)" }} />
            <p className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Moments of a Beautiful Life
            </p>
            <p className="text-sm">Gallery photos will appear here once added.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="gallery" className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-semibold mb-2 text-center"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Moments of a Beautiful Life
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-sm mb-8"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
          >
            {current + 1} / {items.length}
          </motion.p>

          {/* Slide viewer */}
          <div className="relative group">
            <div
              className="relative w-full min-h-[50vh] sm:min-h-[65vh] rounded-xl overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={items[current].url || "/placeholder.svg"}
                  alt={items[current].caption || "Gallery image"}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </AnimatePresence>

              {/* Caption overlay at bottom */}
              <AnimatePresence mode="wait">
                {items[current].caption && (
                  <motion.div
                    key={current + "cap"}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                    }}
                  >
                    <p
                      className="text-sm sm:text-base leading-relaxed max-w-2xl"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-lato)",
                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      {items[current].caption}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gradient overlays for arrows */}
              <div
                className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Nav arrows */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                  style={{ background: "rgba(26,26,46,0.8)", color: "var(--text-primary)" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                  style={{ background: "rgba(26,26,46,0.8)", color: "var(--text-primary)" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Expand button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              style={{ background: "rgba(26,26,46,0.8)", color: "var(--text-primary)" }}
              aria-label="View fullscreen"
            >
              <Expand size={16} />
            </button>
          </div>

          {/* Thumbnail strip */}
          {items.length > 1 && (
            <div className="flex justify-start sm:justify-center gap-2 mt-6 overflow-x-auto pb-1 px-1 snap-x snap-mandatory scrollbar-thin">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`snap-start shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                    i === current
                      ? "ring-2 scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    border: i === current ? "2px solid var(--accent-gold)" : "2px solid transparent",
                  }}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.caption || `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        items={items}
        index={current}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={prev}
        onNext={next}
      />
    </>
  )
}
