"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Heart,
  ChevronLeft,
  Quote,
  Search,
  User,
  MapPin,
  Users,
  MessageSquareHeart,
  Flame,
  Loader2,
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useMemorial } from "@/hooks/useMemorial"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Condolence {
  id: string
  name: string
  location: string
  relationship: string
  message: string
  date: string
  initials: string
  color: string
}

interface TributeDoc {
  _id: string
  authorName: string
  location?: string
  relationship: string
  message: string
  createdAt: string
}

const PALETTE = ["#c9a84c", "#7c5cbf", "#4caf93", "#c9614c", "#5ba4d4", "#9c5cbf"]

function toCondolence(t: TributeDoc, i: number): Condolence {
  return {
    id: t._id,
    name: t.authorName,
    location: t.location || "",
    relationship: t.relationship,
    message: t.message,
    date: new Date(t.createdAt).toISOString().split("T")[0],
    initials: t.authorName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join(""),
    color: PALETTE[i % PALETTE.length],
  }
}

const RELATIONSHIP_OPTIONS = [
  "Family Member",
  "Friend",
  "Colleague",
  "Community Member",
  "Parish Member",
  "Neighbour",
  "Former Student",
  "Other",
]

// ─── Candle accent ────────────────────────────────────────────────────────────
function SmallCandle() {
  return (
    <svg width="28" height="56" viewBox="0 0 28 56" fill="none" aria-hidden="true">
      <g className="candle-flame" style={{ transformOrigin: "14px 10px" }}>
        <path
          d="M14 3 C10 10 8 15 9 21 C10 25 12 27 14 27 C16 27 18 25 19 21 C20 15 18 10 14 3Z"
          fill="url(#sc-flame)"
        />
        <path d="M14 12 C13 16 12.5 19 13 22 C13.5 24 14 25 14 25 C14.5 23 15 20 15 18 C15.5 15 15 12 14 12Z"
          fill="rgba(255,245,200,0.85)" />
      </g>
      <line x1="14" y1="27" x2="14" y2="30" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="30" width="12" height="22" rx="2" fill="url(#sc-body)" />
      <rect x="6" y="51" width="16" height="4" rx="2" fill="url(#sc-base)" />
      <defs>
        <radialGradient id="sc-flame" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7a1" />
          <stop offset="50%" stopColor="#f9a825" />
          <stop offset="100%" stopColor="#e65100" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="sc-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4c5a9" />
          <stop offset="50%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#b8a88a" />
        </linearGradient>
        <linearGradient id="sc-base" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#e8c96a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
      style={{
        background: `${color}22`,
        border: `1.5px solid ${color}55`,
        color,
        fontFamily: "var(--font-playfair)",
      }}
    >
      {initials}
    </div>
  )
}

// ─── Condolence Card ──────────────────────────────────────────────────────────
function CondolenceCard({ c, index }: { c: Condolence; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = c.message.length > 160
  const preview = isLong && !expanded ? c.message.slice(0, 160) + "…" : c.message

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl p-5 flex gap-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-gold)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Avatar initials={c.initials} color={c.color} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            {c.name}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            · {c.relationship}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <MapPin size={11} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {c.location}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {new Date(c.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <Quote
          size={14}
          className="mb-1 opacity-40"
          style={{ color: "var(--accent-gold)" }}
        />
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}
        >
          {preview}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs mt-2 font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CondolencesPage() {
  const memorial = useMemorial()
  const [condolences, setCondolences] = useState<Condolence[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    location: "",
    relationship: "",
    message: "",
  })

  useEffect(() => {
    fetch("/api/tributes?category=condolence")
      .then((r) => r.json())
      .then((data: TributeDoc[]) => {
        if (Array.isArray(data)) {
          setCondolences(data.map(toCondolence))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = condolences.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      c.relationship.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.relationship || !form.message) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.name,
          location: form.location,
          relationship: form.relationship,
          message: form.message,
          category: "condolence",
        }),
      })

      if (!res.ok) throw new Error("Failed")
      const saved: TributeDoc = await res.json()
      setCondolences((prev) => [toCondolence(saved, prev.length), ...prev])
    } catch {
      // Show locally on API failure
      const initials = form.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("")
      const color = PALETTE[condolences.length % PALETTE.length]
      setCondolences((prev) => [
        {
          id: String(Date.now()),
          name: form.name,
          location: form.location,
          relationship: form.relationship,
          message: form.message,
          date: new Date().toISOString().split("T")[0],
          initials,
          color,
        },
        ...prev,
      ])
    }

    setForm({ name: "", location: "", relationship: "", message: "" })
    setSubmitting(false)
    setToastVisible(true)
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-gold)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-lato)",
    outline: "none",
    width: "100%",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    transition: "border-color 0.2s",
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f0f1f 100%)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4"
        style={{
          background: "rgba(26,26,46,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-gold)",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
        >
          <ChevronLeft size={16} />
          Back to Memorial
        </Link>

        <div className="flex items-center gap-2">
          <SmallCandle />
          <span
            className="text-sm hidden sm:block"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            {memorial.shortName}
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-6 py-16 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid var(--border-gold)" }}
            >
              <MessageSquareHeart size={30} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Condolence Messages
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed mb-3"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Share a word of comfort, a cherished memory, or a prayer for the family of
          </p>
          <p
            className="text-base sm:text-lg font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}
          >
            {memorial.fullName}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}
              >
                {condolences.length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Messages
              </div>
            </div>
            <div className="w-px h-8" style={{ background: "var(--border-gold)" }} />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}
              >
                {new Set(condolences.map((c) => c.location.split(",").pop()?.trim())).size}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Locations
              </div>
            </div>
            <div className="w-px h-8" style={{ background: "var(--border-gold)" }} />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}
              >
                {new Set(condolences.map((c) => c.relationship)).size}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Relationships
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <div
              className="rounded-2xl p-6 sm:p-7"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,168,76,0.12)" }}
                >
                  <Heart size={17} style={{ color: "var(--accent-gold)" }} />
                </div>
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  Leave a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                  >
                    <User size={11} className="inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                  >
                    <MapPin size={11} className="inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="City, State / Country"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                  >
                    <Users size={11} className="inline mr-1" />
                    Relationship to Deceased *
                  </label>
                  <select
                    required
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      WebkitAppearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled style={{ background: "#1a1a2e" }}>
                      Select relationship
                    </option>
                    {RELATIONSHIP_OPTIONS.map((r) => (
                      <option key={r} value={r} style={{ background: "#1a1a2e" }}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                  >
                    <MessageSquareHeart size={11} className="inline mr-1" />
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Share a memory, a prayer, or words of comfort for the family…"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                  <div
                    className="text-right text-xs mt-1"
                    style={{ color: form.message.length > 600 ? "#c9614c" : "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                  >
                    {form.message.length} / 600
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || form.message.length > 600}
                  className="w-full"
                >
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={15} /> Send Condolence</>
                  )}
                </Button>

                <p
                  className="text-xs text-center"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                >
                  Your message will appear immediately above.
                </p>
              </form>
            </div>
          </motion.div>

          {/* ── Right: Messages ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* Search */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <Search size={16} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search condolences…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                  fontSize: "0.875rem",
                  flex: 1,
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
              >
                {search
                  ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                  : `${condolences.length} condolence message${condolences.length !== 1 ? "s" : ""}`}
              </p>
              <Flame size={13} style={{ color: "var(--accent-gold)", opacity: 0.6 }} />
            </div>

            {/* Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.length > 0 ? (
                    filtered.map((c, i) => (
                      <CondolenceCard key={c.id} c={c} index={i} />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <Search size={32} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                      >
                        No condolences match your search.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="flex flex-col items-center gap-2 py-8 px-6 text-center"
        style={{ borderTop: "1px solid var(--border-gold)" }}
      >
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
        >
          &copy; {new Date().getFullYear()} Legacy Beyond Time. All rights reserved.
        </p>
        <Link
          href="/"
          className="text-xs hover:opacity-80 transition-opacity"
          style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
        >
          Return to Memorial →
        </Link>
      </footer>

      <Toast
        message="Your condolence message has been shared. Thank you for your kindness."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  )
}
