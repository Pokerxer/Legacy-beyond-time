"use client"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import { fadeUpInView } from "./animations"

export default function ProgramSection() {
  return (
    <section
      className="relative px-6 py-14 sm:py-20"
      aria-labelledby="program-heading"
    >
      <div className="max-w-3xl mx-auto">
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

        <motion.div
          {...fadeUpInView(0.1)}
          className="rounded-2xl p-10 sm:p-14 text-center"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(201,168,76,0.1)" }}
          >
            <Clock size={30} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h3
            className="text-xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Coming Soon
          </h3>
          <p
            className="text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            The program of events is being finalized. Details will be shared here once confirmed. Please check back later.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
