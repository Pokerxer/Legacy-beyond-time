"use client"

import { motion } from "framer-motion"

interface BiographySectionProps {
  biography: string
}

export default function BiographySection({ biography }: BiographySectionProps) {
  return (
    <section id="overview" className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            className="text-2xl sm:text-3xl font-semibold mb-8"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Her Life Story
          </h2>

          <div
            className="biography-content"
            style={{
              borderLeft: "3px solid var(--accent-gold)",
              paddingLeft: "1.5rem",
              fontFamily: "var(--font-lato)",
              color: "var(--text-primary)",
              lineHeight: 1.8,
              fontSize: "0.95rem",
            }}
            dangerouslySetInnerHTML={{ __html: biography }}
          />
        </motion.div>
      </div>
    </section>
  )
}
