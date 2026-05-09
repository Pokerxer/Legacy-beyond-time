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
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { memorial } from "@/data/memorial"

// ─── Static condolences dataset ──────────────────────────────────────────────
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

const INITIAL_CONDOLENCES: Condolence[] = [
  {
    id: "1",
    name: "Rev. Fr. Michael Okafor",
    location: "Mbaise, Imo State",
    relationship: "Parish Priest",
    message:
      "Mama Christiana was a pillar of our parish. Her faith, generosity, and motherly heart touched everyone who knew her. She gave so much of herself to God and to this community without ever asking for anything in return. May her soul rest in perfect peace, and may the Lord grant her family the grace to bear this loss with hope and courage.",
    date: "2026-05-10",
    initials: "MO",
    color: "#7c5cbf",
  },
  {
    id: "2",
    name: "CWO Mbaise Diocese",
    location: "Mbaise, Imo State",
    relationship: "Catholic Women Organisation",
    message:
      "Our beloved mother and leader. You fought the good fight, you kept the faith. Heaven has gained a worthy angel. The legacy you built within our organisation will endure for generations. We will miss your wisdom, your laughter, and the warmth you brought to every gathering. Rest well, Mama.",
    date: "2026-05-11",
    initials: "CW",
    color: "#c9a84c",
  },
  {
    id: "3",
    name: "Dr. & Mrs. Okonkwo",
    location: "Owerri, Imo State",
    relationship: "Family Friends",
    message:
      "Mama's impact on our community is immeasurable. She was a true mother to all. We pray that God grants her eternal rest and grants the family the strength to bear this loss. Her kindness was legendary — she never turned anyone away from her door. We are blessed to have known her.",
    date: "2026-05-12",
    initials: "OK",
    color: "#4caf93",
  },
  {
    id: "4",
    name: "Chief Emeka Nwosu",
    location: "Abuja, FCT",
    relationship: "Community Leader",
    message:
      "The world has lost a great woman and a servant of humanity. Chief Christiana was appointed Justice of the Peace not merely as a title — she lived justice every day. Her fairness, compassion and integrity set a standard we must all aspire to. May her memory be eternal.",
    date: "2026-05-13",
    initials: "EN",
    color: "#c9614c",
  },
  {
    id: "5",
    name: "Adaeze Iro-Obi",
    location: "Lagos, Nigeria",
    relationship: "Former Neighbour",
    message:
      "I remember as a young girl how Mama Christiana would call me in from the street and give me food whenever she noticed I was hungry. She saw children and she saw them fully. I never forgot her kindness. I am heartbroken at this news. Rest in the arms of the Lord, Mama.",
    date: "2026-05-14",
    initials: "AI",
    color: "#5ba4d4",
  },
  {
    id: "6",
    name: "The Eze Family",
    location: "Port Harcourt, Rivers State",
    relationship: "Extended Family",
    message:
      "We mourn alongside the Opara family and the entire Mbaise community. Mama was a unifying force whose love held many together. Though she is gone, the love she poured into this world continues to multiply. We hold her memory dear and we celebrate her extraordinary life.",
    date: "2026-05-15",
    initials: "EZ",
    color: "#9c5cbf",
  },
]

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
  const [condolences, setCondolences] = useState<Condolence[]>(INITIAL_CONDOLENCES)
  const [search, setSearch] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    location: "",
    relationship: "",
    message: "",
  })

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
    await new Promise((r) => setTimeout(r, 900))

    const initials = form.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")

    const colors = ["#c9a84c", "#7c5cbf", "#4caf93", "#c9614c", "#5ba4d4", "#9c5cbf"]
    const color = colors[condolences.length % colors.length]

    const newCondolence: Condolence = {
      id: String(Date.now()),
      name: form.name,
      location: form.location,
      relationship: form.relationship,
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      initials,
      color,
    }

    setCondolences((prev) => [newCondolence, ...prev])
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
        {/* Soft glow */}
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
            <div
              className="w-px h-8"
              style={{ background: "var(--border-gold)" }}
            />
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
            <div
              className="w-px h-8"
              style={{ background: "var(--border-gold)" }}
            />
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
                {/* Name */}
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

                {/* Location */}
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

                {/* Relationship */}
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

                {/* Message */}
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
                    <><span className="animate-spin inline-block">✦</span> Sending…</>
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
