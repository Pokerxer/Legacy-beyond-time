"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Flame, Loader2, Trash2, MessageSquare } from "lucide-react"

interface Candle {
  _id: string
  name: string
  message?: string
  createdAt: string
}

export default function AdminCandles() {
  const [candles, setCandles] = useState<Candle[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCandles = useCallback(async () => {
    try {
      const res = await fetch("/api/candles")
      if (res.ok) setCandles(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCandles() }, [fetchCandles])

  const deleteCandle = async (id: string) => {
    if (!confirm("Remove this candle?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/candles/${id}`, { method: "DELETE" })
      if (res.ok) setCandles((prev) => prev.filter((c) => c._id !== id))
    } catch {
      // silent
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Candle Wall
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {candles.length} candle{candles.length !== 1 ? "s" : ""} lit in her memory.
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-2xl p-5 mb-6"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(249,168,37,0.12)" }}>
          <Flame size={22} style={{ color: "#f9a825" }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            {loading ? "—" : candles.length}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>candles lit in her memory</p>
        </div>
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
        </div>
      ) : candles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Flame size={40} style={{ color: "var(--border-gold)" }} />
          <p style={{ color: "var(--text-muted)" }}>No candles lit yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {candles.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(249,168,37,0.12)" }}>
                <Flame size={14} style={{ color: "#f9a825" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.name}
                </p>
                {c.message && (
                  <p className="text-xs mt-1 flex items-start gap-1" style={{ color: "var(--text-muted)" }}>
                    <MessageSquare size={10} className="shrink-0 mt-0.5" />
                    <span className="italic">&ldquo;{c.message}&rdquo;</span>
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <button onClick={() => deleteCandle(c._id)} disabled={deleting === c._id}
                className="p-1.5 rounded-lg transition-colors hover:opacity-80 shrink-0"
                style={{ color: "#ff6b6b" }}>
                {deleting === c._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
