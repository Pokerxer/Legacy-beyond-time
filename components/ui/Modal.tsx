"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,15,31,0.85)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-gold)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              {title && (
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-full transition-colors hover:bg-white/10"
                style={{ color: "var(--text-muted)" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
