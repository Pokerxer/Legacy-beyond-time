"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react"

const LETTERS = [
  {
    id: "1",
    name: "Rev. Fr. Michael Okafor",
    location: "Mbaise, Imo State",
    relationship: "Parish Priest",
    message:
      "Mama Christiana was a pillar of our parish. Her faith, generosity, and motherly heart touched everyone who knew her. May her soul rest in perfect peace, and may the Lord grant her family the grace to bear this loss with hope and courage.",
    date: "10 May 2026",
    initials: "MO",
    color: "#7c5cbf",
  },
  {
    id: "2",
    name: "CWO Mbaise Diocese",
    location: "Mbaise, Imo State",
    relationship: "Catholic Women Organisation",
    message:
      "Our beloved mother and leader. You fought the good fight, you kept the faith. Heaven has gained a worthy angel. The legacy you built within our organisation will endure for generations. We will miss your wisdom, your laughter, and the warmth you brought to every gathering.",
    date: "11 May 2026",
    initials: "CW",
    color: "#c9a84c",
  },
  {
    id: "3",
    name: "Dr. & Mrs. Okonkwo",
    location: "Owerri, Imo State",
    relationship: "Family Friends",
    message:
      "Mama's impact on our community is immeasurable. She was a true mother to all. Her kindness was legendary — she never turned anyone away from her door. We pray God grants her eternal rest and grants the family the strength to bear this great loss.",
    date: "12 May 2026",
    initials: "OK",
    color: "#4caf93",
  },
  {
    id: "4",
    name: "Chief Emeka Nwosu",
    location: "Abuja, FCT",
    relationship: "Community Leader",
    message:
      "Chief Christiana lived justice every day — her fairness, compassion and integrity set a standard we must all aspire to. The world has lost a great woman and a servant of humanity. May her memory be eternal.",
    date: "13 May 2026",
    initials: "EN",
    color: "#c9614c",
  },
  {
    id: "5",
    name: "Adaeze Iro-Obi",
    location: "Lagos, Nigeria",
    relationship: "Former Neighbour",
    message:
      "I remember as a young girl how Mama Christiana would call me in and give me food whenever she noticed I was hungry. She saw people fully. I never forgot her kindness. I am heartbroken. Rest in the arms of the Lord, Mama.",
    date: "14 May 2026",
    initials: "AI",
    color: "#5ba4d4",
  },
]

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export default function CondolenceSlider() {
  const [index, setIndex] = useState(0)
  const [dir, setDir]     = useState(1)
  const [paused, setPaused] = useState(false)

  const go = useCallback((next: number, direction: number) => {
    setDir(direction)
    setIndex(next)
  }, [])

  const prev = () => go((index - 1 + LETTERS.length) % LETTERS.length, -1)
  const next = () => go((index + 1) % LETTERS.length,  1)

  // Auto-advance every 5 s
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go((index + 1) % LETTERS.length, 1), 5000)
    return () => clearTimeout(t)
  }, [index, paused, go])

  const letter = LETTERS[index]

  return (
    <section
      className="relative px-6 py-14 sm:py-20 overflow-hidden"
      aria-labelledby="condolence-slider-heading"
    >
      {/* Soft radial glow */}
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

        {/* Slide */}
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
              {/* Big quote mark */}
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

              {/* Author */}
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
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      {letter.location} · {letter.relationship}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    {letter.date}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
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
          {LETTERS.map((_, i) => (
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
