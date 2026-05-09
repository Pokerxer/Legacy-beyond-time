"use client"

import { motion } from "framer-motion"

interface LegacyBannerProps {
  quote: string
}

export default function LegacyBanner({ quote }: LegacyBannerProps) {
  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)",
            border: "1px solid var(--border-gold)",
          }}
        >
          {/* Decorative corner accents */}
          <span
            className="absolute top-3 left-3 text-lg"
            style={{ color: "var(--accent-gold)" }}
            aria-hidden="true"
          >
            ❝
          </span>
          <span
            className="absolute bottom-3 right-3 text-lg rotate-180"
            style={{ color: "var(--accent-gold)" }}
            aria-hidden="true"
          >
            ❝
          </span>

          <p
            className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--accent-gold)",
              fontStyle: "italic",
            }}
          >
            {quote}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span style={{ color: "var(--border-gold)", fontSize: 8 }}>✦</span>
            <span style={{ color: "var(--border-gold)", fontSize: 12 }}>✦</span>
            <span style={{ color: "var(--border-gold)", fontSize: 8 }}>✦</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
