"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  ChevronLeft,
  Send,
  User,
  Mail,
  Users,
  Sparkles,
  Star,
  Quote,
  Check,
  Loader2,
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { memorial } from "@/data/memorial"
import type { Tribute } from "@/types"

const RELATIONSHIPS = [
  "Family Member",
  "Child",
  "Grandchild",
  "Friend",
  "Colleague",
  "Church Member",
  "CWO Member",
  "Neighbour",
  "Other",
]

const BADGE_COLORS: Record<string, string> = {
  "Family Member": "#c9614c",
  "Child":         "#c9614c",
  "Grandchild":    "#c9614c",
  "Friend":        "#5ba4d4",
  "Colleague":     "#4caf93",
  "Church Member": "#c9a84c",
  "CWO Member":    "#c9a84c",
  "Neighbour":     "#7c5cbf",
  "Other":         "#9e9e9e",
}

// ─── Tribute Card ────────────────────────────────────────────────────────────
function TributeCard({ t, index }: { t: Tribute; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const color = BADGE_COLORS[t.relationship] ?? "#9e9e9e"

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-gold)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {t.authorPhoto ? (
          <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden">
            <Image
              src={t.authorPhoto}
              alt={t.authorName}
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: `${color}22`,
              border: `1.5px solid ${color}55`,
              color,
              fontFamily: "var(--font-playfair)",
            }}
          >
            {t.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              {t.authorName}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${color}22`,
                color,
                fontFamily: "var(--font-lato)",
              }}
            >
              {t.relationship}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
            {new Date(t.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Message */}
      <div>
        <Quote size={14} className="mb-1.5 opacity-40" style={{ color: "var(--accent-gold)" }} />
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}
        >
          {t.message}
        </p>
      </div>

      {/* Expandable extras */}
      {(t.impact || t.whatTheyMiss) && (
        <>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-3"
              >
                {t.impact && (
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}>
                      Impact on my life
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      {t.impact}
                    </p>
                  </div>
                )}
                {t.whatTheyMiss && (
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}>
                      What I&apos;ll miss most
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      {t.whatTheyMiss}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium hover:opacity-80 transition-opacity self-start"
            style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        </>
      )}
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TributesPage() {
  const [tributes, setTributes] = useState<Tribute[]>([])
  const [loading, setLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    relationship: "",
    impact: "",
    whatTheyMiss: "",
    message: "",
  })

  useEffect(() => {
    fetch("/api/tributes?category=tribute")
      .then((r) => r.json())
      .then((data) => setTributes(Array.isArray(data) ? data : []))
      .catch(() => setTributes([]))
      .finally(() => setLoading(false))
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.name,
          authorEmail: form.email,
          relationship: form.relationship,
          message: form.message,
          impact: form.impact,
          whatTheyMiss: form.whatTheyMiss,
          category: "tribute",
        }),
      })

      if (!res.ok) throw new Error("Failed")
      const newTribute: Tribute = await res.json()
      setTributes((prev) => [newTribute, ...prev])
    } catch {
      // Show tribute locally even if API fails
      const newTribute: Tribute = {
        _id: String(Date.now()),
        memorialId: memorial.slug,
        authorName: form.name,
        authorEmail: form.email,
        authorPhoto: "",
        relationship: form.relationship,
        message: form.message,
        impact: form.impact,
        whatTheyMiss: form.whatTheyMiss,
        isApproved: true,
        createdAt: new Date().toISOString(),
      }
      setTributes((prev) => [newTribute, ...prev])
    }

    setForm({ name: "", email: "", relationship: "", impact: "", whatTheyMiss: "", message: "" })
    setSubmitting(false)
    setSubmitted(true)
    setToastVisible(true)
    setTimeout(() => setSubmitted(false), 3000)
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
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f0f1f 100%)" }}
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
        <span
          className="text-sm hidden sm:block"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          {memorial.shortName}
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-6 py-16 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid var(--border-gold)" }}
            >
              <Heart size={30} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Tributes
          </h1>
          <p className="text-sm sm:text-base leading-relaxed mb-2" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
            Share a memory, a story, or how{" "}
            <span style={{ color: "var(--accent-gold)" }}>{memorial.shortName}</span> touched your life.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}>
                {tributes.length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Tributes</div>
            </div>
            <div className="w-px h-8" style={{ background: "var(--border-gold)" }} />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}>
                {new Set(tributes.map((t) => t.relationship)).size}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Relationships</div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Form ── */}
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
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>
                  <Sparkles size={17} style={{ color: "var(--accent-gold)" }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                  Leave a Tribute
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      <User size={11} className="inline mr-1" />Full Name *
                    </label>
                    <input type="text" placeholder="Your full name" required value={form.name} onChange={set("name")} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      <Mail size={11} className="inline mr-1" />Email *
                    </label>
                    <input type="email" placeholder="your@email.com" required value={form.email} onChange={set("email")} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    <Users size={11} className="inline mr-1" />Relationship *
                  </label>
                  <select required value={form.relationship} onChange={set("relationship")} style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}>
                    <option value="" disabled style={{ background: "#1a1a2e" }}>Select relationship</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r} style={{ background: "#1a1a2e" }}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    Your Message *
                  </label>
                  <textarea rows={4} placeholder="Share a memory or words about Mama…" required value={form.message} onChange={set("message")}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    <Star size={11} className="inline mr-1" />How did she impact your life?
                  </label>
                  <textarea rows={2} placeholder="Her impact on my life…" value={form.impact} onChange={set("impact")}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    What will you miss most?
                  </label>
                  <textarea rows={2} placeholder="What I'll miss most…" value={form.whatTheyMiss} onChange={set("whatTheyMiss")}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <Button type="submit" variant="primary" disabled={submitting} className="w-full">
                  {submitted ? (
                    <><Check size={15} /> Tribute Submitted!</>
                  ) : submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                  ) : (
                    <><Send size={15} /> Submit Tribute</>
                  )}
                </Button>

                <p className="text-xs text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                  Your tribute appears immediately above.
                </p>
              </form>
            </div>
          </motion.div>

          {/* ── Tributes Wall ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              {tributes.length} tribute{tributes.length !== 1 ? "s" : ""} shared
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tributes.map((t, i) => (
                  <TributeCard key={t._id} t={t} index={i} />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="flex flex-col items-center gap-2 py-8 px-6 text-center"
        style={{ borderTop: "1px solid var(--border-gold)" }}
      >
        <p className="text-xs" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} Legacy Beyond Time. All rights reserved.
        </p>
        <Link href="/" className="text-xs hover:opacity-80 transition-opacity" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}>
          Return to Memorial →
        </Link>
      </footer>

      <Toast
        message="Your tribute has been shared. Thank you for honouring her memory."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  )
}
