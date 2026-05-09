"use client"

import { motion } from "framer-motion"
import type { Achievement } from "@/types"

interface AchievementsTimelineProps {
  achievements: Achievement[]
}

export default function AchievementsTimeline({ achievements }: AchievementsTimelineProps) {
  if (achievements.length === 0) return null

  return (
    <section id="achievements" className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-3xl font-semibold mb-12 text-center"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          A Life of Impact
        </motion.h2>

        <div className="relative">
          {/* Vertical gold line */}
          <div
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "var(--border-gold)" }}
            aria-hidden="true"
          />

          <div className="space-y-12">
            {achievements.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Year badge on the line */}
                  <div
                    className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full border-2"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--accent-gold)",
                      color: "var(--accent-gold)",
                      fontFamily: "var(--font-playfair)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {item.year}
                  </div>

                  {/* Spacer for alignment */}
                  <div className="hidden sm:block w-1/2" />

                  {/* Card content */}
                  <div
                    className={`relative ml-14 sm:ml-0 sm:w-1/2 ${
                      isLeft ? "sm:pr-10" : "sm:pl-10"
                    }`}
                  >
                    <div
                      className="rounded-xl p-5 transition-transform hover:-translate-y-0.5"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border-gold)",
                      }}
                    >
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          color: "var(--accent-gold)",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
