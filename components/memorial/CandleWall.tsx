"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Send, User, MessageSquare, Loader2, X } from "lucide-react"
import Button from "@/components/ui/Button"

interface CandleEntry {
  _id: string
  name: string
  message?: string
  createdAt: string
}

// ─── Single animated candle ───────────────────────────────────────────────────
function CandleSVG({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      width="32"
      height="60"
      viewBox="0 0 32 60"
      fill="none"
      aria-hidden="true"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Flame */}
      <motion.g
        animate={{ scaleY: [1, 1.08, 0.96, 1.05, 1], scaleX: [1, 0.96, 1.04, 0.97, 1], rotate: [0, 2, -2, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ transformOrigin: "16px 13px" }}
      >
        <path
          d="M16 4 C12 10 10 15 11 20 C12 24 14 26 16 26 C18 26 20 24 21 20 C22 15 20 10 16 4Z"
          fill="url(#cFlame)"
        />
        <path
          d="M16 14 C15.2 17.5 14.8 20 15.2 22.5 C15.6 24 16 25 16 25 C16.4 23.5 16.8 21 16.8 19 C17 16.5 16.5 14 16 14Z"
          fill="rgba(255,247,200,0.9)"
        />
      </motion.g>
      {/* Wick */}
      <line x1="16" y1="26" x2="16" y2="29" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body */}
      <rect x="9" y="29" width="14" height="26" rx="2.5" fill="url(#cBody)" />
      {/* Base */}
      <rect x="6" y="54" width="20" height="5" rx="2.5" fill="#c9a84c" />
      <defs>
        <radialGradient id="cFlame" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7a1" />
          <stop offset="45%" stopColor="#f9a825" />
          <stop offset="100%" stopColor="#e65100" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="cBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbbba0" />
          <stop offset="45%" stopColor="#f0ece4" />
          <stop offset="100%" stopColor="#b8a88a" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}

// ─── Unlit placeholder ────────────────────────────────────────────────────────
function UnlitCandle() {
  return (
    <svg width="32" height="60" viewBox="0 0 32 60" fill="none" aria-hidden="true" style={{ opacity: 0.25 }}>
      <line x1="16" y1="26" x2="16" y2="29" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="9" y="29" width="14" height="26" rx="2.5" fill="url(#uBody)" />
      <rect x="6" y="54" width="20" height="5" rx="2.5" fill="#555" />
      <defs>
        <linearGradient id="uBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#444" />
          <stop offset="50%" stopColor="#666" />
          <stop offset="100%" stopColor="#444" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Light candle modal ───────────────────────────────────────────────────────
function LightModal({ onClose, onLit }: { onClose: () => void; onLit: (c: CandleEntry) => void }) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/candles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      if (res.ok) {
        const candle: CandleEntry = await res.json()
        onLit(candle)
      } else {
        onLit({ _id: String(Date.now()), name: name.trim(), message: message.trim(), createdAt: new Date().toISOString() })
      }
    } catch {
      onLit({ _id: String(Date.now()), name: name.trim(), message: message.trim(), createdAt: new Date().toISOString() })
    }

    setSubmitting(false)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-gold)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-lato)",
    outline: "none",
    width: "100%",
    borderRadius: "0.75rem",
    padding: "0.7rem 1rem",
    fontSize: "0.875rem",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,20,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
        className="w-full max-w-sm rounded-2xl p-7"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <CandleSVG />
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Light a Candle
            </h3>
          </div>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X size={18} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              <User size={11} className="inline mr-1" />Your Name *
            </label>
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              <MessageSquare size={11} className="inline mr-1" />A brief prayer or message (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Rest in peace, Mama…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <Button type="submit" variant="primary" disabled={submitting} className="w-full">
            {submitting ? (
              <><Loader2 size={14} className="animate-spin" /> Lighting…</>
            ) : (
              <><Flame size={14} /> Light Candle</>
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CandleWall() {
  const [candles, setCandles] = useState<CandleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch("/api/candles")
      .then((r) => r.json())
      .then((data) => setCandles(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const onLit = (c: CandleEntry) => setCandles((prev) => [c, ...prev])

  const PLACEHOLDER_COUNT = Math.max(0, 8 - candles.length)

  return (
    <section
      id="candles"
      className="relative px-6 py-16 sm:py-20 overflow-hidden"
      aria-labelledby="candle-wall-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(249,168,37,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(249,168,37,0.1)", border: "1px solid rgba(249,168,37,0.25)" }}
          >
            <Flame size={26} style={{ color: "#f9a825" }} />
          </div>
          <h2
            id="candle-wall-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Wall of Candles
          </h2>
          <p className="text-sm sm:text-base" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
            {candles.length > 0
              ? `${candles.length} candle${candles.length !== 1 ? "s" : ""} lit in her memory`
              : "Be the first to light a candle in her memory"}
          </p>
        </motion.div>

        {/* Candles grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 mb-10"
          >
            <AnimatePresence>
              {candles.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="relative">
                    <CandleSVG delay={i * 0.15} />
                    {/* Tooltip on hover */}
                    {c.message && (
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-xl px-3 py-2 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                        style={{
                          background: "var(--card-bg)",
                          border: "1px solid var(--border-gold)",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-lato)",
                          lineHeight: 1.5,
                        }}
                      >
                        &ldquo;{c.message}&rdquo;
                      </div>
                    )}
                  </div>
                  <p
                    className="text-xs text-center leading-tight max-w-[52px] truncate"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                    title={c.name}
                  >
                    {c.name}
                  </p>
                </motion.div>
              ))}

              {/* Placeholder unlit candles */}
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div key={`ph-${i}`} className="flex flex-col items-center gap-2">
                  <UnlitCandle />
                  <p className="text-xs" style={{ color: "transparent" }}>—</p>
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Flame size={15} />
            Light a Candle
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <LightModal onClose={() => setModalOpen(false)} onLit={onLit} />
        )}
      </AnimatePresence>
    </section>
  )
}
