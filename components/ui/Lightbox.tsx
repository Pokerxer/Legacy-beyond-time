"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/types"

interface LightboxProps {
  items: GalleryItem[]
  index: number
  open: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ items, index, open, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, onClose, onPrev, onNext])

  if (!items[index]) return null

  const item = items[index]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full transition-colors hover:bg-white/15"
            style={{ color: "var(--text-primary)", background: "rgba(0,0,0,0.5)" }}
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>

          {/* Nav arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-colors hover:bg-white/15"
                style={{ color: "var(--text-primary)", background: "rgba(0,0,0,0.5)" }}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full transition-colors hover:bg-white/15"
                style={{ color: "var(--text-primary)", background: "rgba(0,0,0,0.5)" }}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image — fills the full viewport with padding */}
          <div
            className="flex-1 w-full flex items-center justify-center p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={index}
              src={item.url}
              alt={item.caption || "Gallery image"}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="max-w-full max-h-full w-auto h-auto object-contain select-none"
              draggable={false}
              style={{ maxHeight: "calc(100vh - 40px)" }}
            />
          </div>

          {/* Caption bar at bottom */}
          <div
            className="w-full flex items-center justify-center gap-4 px-4 py-3 sm:py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {item.caption ? (
              <p
                className="text-xs sm:text-sm text-center truncate max-w-[70%]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
              >
                {item.caption}
              </p>
            ) : (
              <span />
            )}
            <span
              className="text-xs shrink-0"
              style={{ color: "var(--text-muted)" }}
            >{`${index + 1}/${items.length}`}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
