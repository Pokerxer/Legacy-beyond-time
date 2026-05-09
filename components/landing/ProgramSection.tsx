"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Church } from "lucide-react"
import { fadeUpInView } from "./animations"

const events = [
  {
    icon: Church,
    label: "Wake Keeping",
    date: "Thursday, June 4, 2026",
    time: "5:00 PM — 9:00 PM",
    venue: "Family Compound, Umuokirika Mbaise",
    description: "Night of tributes, hymns, and fellowship celebrating Mama's life.",
  },
  {
    icon: Church,
    label: "Funeral Mass",
    date: "Friday, June 5, 2026",
    time: "10:00 AM",
    venue: "St. Joseph's Catholic Church, Umuokirika Mbaise",
    description: "Requiem Mass presided over by the Bishop of Mbaise Diocese.",
  },
  {
    icon: MapPin,
    label: "Burial",
    date: "Friday, June 5, 2026",
    time: "1:00 PM",
    venue: "Family Cemetery, Umuokirika Mbaise",
    description: "Interment followed by reception at the family compound.",
  },
]

export default function ProgramSection() {
  return (
    <section
      className="relative px-6 py-14 sm:py-20"
      aria-labelledby="program-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUpInView(0)} className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <Calendar size={26} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            id="program-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Program of Events
          </h2>
          <p
            className="text-sm sm:text-base max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Funeral arrangements for Chief Christiana O. Opara, JP
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px hidden sm:block"
            style={{ background: "var(--border-gold)" }}
          />

          <div className="space-y-6 sm:space-y-8">
            {events.map((event, i) => {
              const Icon = event.icon
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={event.label}
                  {...fadeUpInView(0.1 + i * 0.12)}
                  className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--accent-gold)",
                      top: "1.5rem",
                    }}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className={`flex-1 sm:w-1/2 ${isLeft ? "sm:text-right sm:pr-10" : "sm:text-left sm:pl-10"}`}>
                    <div
                      className="rounded-2xl p-5 sm:p-6"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border-gold)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "sm:flex-row-reverse sm:justify-end" : ""}`}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "rgba(201,168,76,0.12)" }}
                        >
                          <Icon size={18} style={{ color: "var(--accent-gold)" }} />
                        </div>
                        <h3
                          className="text-lg font-semibold"
                          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                        >
                          {event.label}
                        </h3>
                      </div>

                      <div className={`space-y-2 ${isLeft ? "sm:text-right" : ""}`}>
                        <div className={`flex items-center gap-2 text-sm ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                          <Calendar size={14} style={{ color: "var(--accent-gold)" }} />
                          <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                            {event.date}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                          <Clock size={14} style={{ color: "var(--accent-gold)" }} />
                          <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                            {event.time}
                          </span>
                        </div>
                        <div className={`flex items-start gap-2 text-sm ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                          <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent-gold)" }} />
                          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                            {event.venue}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-3 italic"
                          style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden sm:block flex-1 sm:w-1/2" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
