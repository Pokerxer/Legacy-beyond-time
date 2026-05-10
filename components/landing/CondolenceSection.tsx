"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquareHeart, Send, ChevronDown, Quote, Loader2 } from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { fadeUpInView } from "./animations"

interface Condolence {
  _id: string
  name: string
  location: string
  message: string
  date: string
}

export default function CondolenceSection() {
  const [condolences, setCondolences] = useState<Condolence[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [allVisible, setAllVisible] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchCondolences = useCallback(async () => {
    try {
      const res = await fetch("/api/tributes")
      if (res.ok) {
        const data = await res.json()
        const approved = data
          .filter((t: { isApproved: boolean }) => t.isApproved)
          .map((t: { _id: string; authorName: string; authorEmail?: string; location?: string; message: string; createdAt: string }) => ({
            _id: t._id,
            name: t.authorName,
            location: t.location || "",
            message: t.message,
            date: new Date(t.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          }))
        setCondolences(approved)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCondolences()
  }, [fetchCondolences])

  const displayed = allVisible ? condolences : condolences.slice(0, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: formData.get("name"),
          location: formData.get("location"),
          message: formData.get("message"),
          relationship: "Condolence",
          memorialId: "christiana-opara",
        }),
      })

      if (res.ok) {
        setToastVisible(true)
        form.reset()
        fetchCondolences()
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
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
                name="name"
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
                name="location"
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
              name="message"
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
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Condolence</>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Condolence Messages */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
          </div>
        ) : condolences.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: "var(--text-muted)" }}>
            No condolences yet. Be the first to leave one.
          </p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {displayed.map((c) => (
                <motion.article
                  key={c._id}
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
                    onClick={() => setExpanded(expanded === c._id ? null : c._id)}
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
                          {c.location && (
                            <span
                              className="text-xs ml-2"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {c.location}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          size={16}
                          className="shrink-0 transition-transform duration-300"
                          style={{
                            color: "var(--text-muted)",
                            transform: expanded === c._id ? "rotate(180deg)" : "rotate(0deg)",
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
                        {expanded === c._id && (
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
        )}
      </div>

      <Toast
        message="Your condolence message has been sent. Thank you."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </section>
  )
}
