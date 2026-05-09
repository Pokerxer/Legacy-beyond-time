"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareHeart, Send, ChevronDown, Quote } from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { fadeUpInView } from "./animations"
interface Condolence {
  id: string
  name: string
  location: string
  message: string
  date: string
}

const condolences: Condolence[] = [
  {
    id: "1",
    name: "Rev. Fr. Michael Okafor",
    location: "Mbaise, Imo State",
    message:
      "Mama Christiana was a pillar of our parish. Her faith, generosity, and motherly heart touched everyone who knew her. May her soul rest in perfect peace.",
    date: "2026-05-10",
  },
  {
    id: "2",
    name: "CWO Mbaise Diocese",
    location: "Mbaise, Imo State",
    message:
      "Our beloved mother and leader. You fought the good fight, you kept the faith. Heaven has gained a worthy angel. We will miss you dearly.",
    date: "2026-05-11",
  },
  {
    id: "3",
    name: "Dr. & Mrs. Okonkwo",
    location: "Owerri, Imo State",
    message:
      "Mama's impact on our community is immeasurable. She was a true mother to all. We pray that God grants her eternal rest and grants the family the strength to bear this loss.",
    date: "2026-05-12",
  },
]

export default function CondolenceSection() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [allVisible, setAllVisible] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const displayed = allVisible ? condolences : condolences.slice(0, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setToastVisible(true)
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <section
      className="relative px-6 py-14 sm:py-20"
      aria-labelledby="condolence-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUpInView(0)} className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <MessageSquareHeart size={26} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            id="condolence-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Condolence Letters
          </h2>
          <p
            className="text-sm sm:text-base max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Share your sympathies and memories with the family.
          </p>
        </motion.div>

        {/* Condolence Form */}
        <motion.div
          {...fadeUpInView(0.1)}
          className="rounded-2xl p-6 sm:p-8 mb-10"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-5"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Leave a Condolence Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
              />
              <input
                type="text"
                placeholder="Your Location"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
              />
            </div>
            <textarea
              rows={4}
              placeholder="Write your condolence message..."
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 resize-none"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-lato)",
              }}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <><span className="animate-spin">&#9696;</span> Sending...</>
                ) : (
                  <><Send size={16} /> Send Condolence</>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Condolence Messages */}
        <div className="space-y-4">
          <AnimatePresence>
            {displayed.map((c) => (
              <motion.article
                key={c.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                }}
              >
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="w-full flex items-start gap-4 p-5 text-left"
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.12)" }}
                  >
                    <Quote size={16} style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span
                          className="text-sm font-semibold"
                          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                        >
                          {c.name}
                        </span>
                        <span
                          className="text-xs ml-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {c.location}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className="shrink-0 transition-transform duration-300"
                        style={{
                          color: "var(--text-muted)",
                          transform: expanded === c.id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.date}
                    </p>
                    <AnimatePresence>
                      {expanded === c.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="text-sm leading-relaxed mt-3"
                            style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}
                          >
                            {c.message}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.article>
            ))}
          </AnimatePresence>

          {condolences.length > 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-2"
            >
              <button
                onClick={() => setAllVisible(!allVisible)}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
              >
                {allVisible ? "Show Less" : `View All ${condolences.length} Condolences`}
                <ChevronDown
                  size={14}
                  style={{
                    transform: allVisible ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Toast
        message="Your condolence message has been sent. Thank you."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </section>
  )
}
