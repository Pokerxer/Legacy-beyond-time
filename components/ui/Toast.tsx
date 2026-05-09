"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, visible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-gold)",
            fontFamily: "var(--font-lato)",
            color: "var(--text-primary)",
          }}
          role="status"
          aria-live="polite"
        >
          <CheckCircle size={20} style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
