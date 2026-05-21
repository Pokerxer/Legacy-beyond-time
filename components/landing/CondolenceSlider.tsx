"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight, MapPin, ArrowRight, Loader2 } from "lucide-react"

interface Letter {
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

const PALETTE = ["#7c5cbf", "#c9a84c", "#4caf93", "#c9614c", "#5ba4d4", "#9c5cbf"]

function fromDB(t: TributeDoc, i: number): Letter {
  return {
    id: t._id,
    name: t.authorName,
    location: t.location || "",
    relationship: t.relationship,
    message: t.message,
    date: new Date(t.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    }),
    initials: t.authorName.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join(""),
    color: PALETTE[i % PALETTE.length],
  }
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export default function CondolenceSlider() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [dir, setDir]     = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    fetch("/api/tributes?category=condolence")
      .then((r) => r.json())
      .then((data: TributeDoc[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setLetters(data.map(fromDB))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const go = useCallback((next: number, direction: number) => {
    setDir(direction)
    setIndex(next)
  }, [])

  const prev = () => letters.length > 0 && go((index - 1 + letters.length) % letters.length, -1)
  const next = () => letters.length > 0 && go((index + 1) % letters.length, 1)

  useEffect(() => {
    if (paused || letters.length === 0) return
    const t = setTimeout(() => go((index + 1) % letters.length, 1), 5000)
    return () => clearTimeout(t)
  }, [index, paused, go, letters.length])

  return (
    <section
      className="relative px-6 py-14 sm:py-20 overflow-hidden"
      aria-labelledby="condolence-slider-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
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
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <Quote size={26} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            id="condolence-slider-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Condolence Letters
          </h2>
          <p
            className="text-sm sm:text-base"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Words of comfort shared by family, friends and community.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && letters.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              No condolence messages yet.{" "}
              <Link href="/condolences" style={{ color: "var(--accent-gold)" }}>Be the first to leave one →</Link>
            </p>
          </div>
        )}

        {/* Slide */}
        {!loading && letters.length > 0 && (() => {
          const letter = letters[index]
          return (
            <>
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  minHeight: 240,
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Gold top bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: "linear-gradient(90deg, #c9a84c, #e8c96a, #c9a84c)" }}
                />

                <AnimatePresence custom={dir} mode="wait">
                  <motion.div
                    key={letter.id}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: "easeInOut" }}
                    className="px-8 sm:px-12 py-8 sm:py-10"
                  >
                    <div
                      className="text-6xl leading-none mb-4 select-none"
                      style={{ color: "rgba(201,168,76,0.18)", fontFamily: "Georgia, serif" }}
                      aria-hidden="true"
                    >
                      &ldquo;
                    </div>

                    <p
                      className="text-base sm:text-lg leading-relaxed mb-8"
                      style={{ fontFamily: "var(--font-lato)", color: "var(--text-primary)" }}
                    >
                      {letter.message}
                    </p>

                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: `${letter.color}22`,
                          border: `1.5px solid ${letter.color}66`,
                          color: letter.color,
                          fontFamily: "var(--font-playfair)",
                        }}
                      >
                        {letter.initials}
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                        >
                          {letter.name}
                        </p>
                        {letter.location && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={11} style={{ color: "var(--text-muted)" }} />
                            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                              {letter.location} · {letter.relationship}
                            </span>
                          </div>
                        )}
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                          {letter.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-50"
                  style={{ background: "rgba(201,168,76,0.12)", border: "1px solid var(--border-gold)" }}
                  aria-label="Previous condolence"
                >
                  <ChevronLeft size={16} style={{ color: "var(--accent-gold)" }} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-50"
                  style={{ background: "rgba(201,168,76,0.12)", border: "1px solid var(--border-gold)" }}
                  aria-label="Next condolence"
                >
                  <ChevronRight size={16} style={{ color: "var(--accent-gold)" }} />
                </button>
              </div>

              {/* Dot navigation */}
              <div className="flex items-center justify-center gap-2 mt-5">
                {letters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i, i > index ? 1 : -1)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:  i === index ? 20 : 6,
                      height: 6,
                      background: i === index ? "var(--accent-gold)" : "rgba(201,168,76,0.25)",
                    }}
                    aria-label={`Go to letter ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )
        })()}

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/condolences"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
          >
            View all condolences & leave a message
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
