"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  Calendar,
  Check,
  Send,
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
  Loader2,
  CalendarCheck,
  CalendarX,
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useMemorial } from "@/hooks/useMemorial"

const ATTENDEE_OPTIONS = ["1", "2", "3", "4", "5", "6+"]

export default function RSVPPage() {
  const memorial = useMemorial()
  const [attending, setAttending] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    attendees: "1",
    message: "",
  })

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attending === null) return
    setSubmitting(true)

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          attendees: form.attendees === "6+" ? 6 : Number(form.attendees),
          attending,
          message: form.message,
        }),
      })
    } catch {}

    setSubmitting(false)
    setSubmitted(true)
    setToastVisible(true)
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

  const hasFuneralDetails = !!memorial.funeralDetails

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
        <span className="text-sm hidden sm:block" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          {memorial.shortName}
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="relative px-6 py-16 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
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
              <CalendarCheck size={30} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Funeral RSVP
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
            Let the family of{" "}
            <span style={{ color: "var(--accent-gold)" }}>{memorial.shortName}</span>{" "}
            know if you will be attending the funeral service.
          </p>
        </motion.div>
      </section>

      <div className="max-w-xl mx-auto px-4 sm:px-6 pb-20">

        {/* ── Funeral date notice ── */}
        {!hasFuneralDetails && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 rounded-2xl p-5 mb-8"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            <Calendar size={20} style={{ color: "var(--accent-gold)", marginTop: 2 }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>
                Funeral date not yet announced
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Arrangements are being finalised. You can still submit your RSVP and the family will be notified when details are confirmed.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Submitted confirmation ── */}
        <AnimatePresence>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-10 text-center"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: attending ? "rgba(74,175,147,0.15)" : "rgba(201,97,76,0.1)",
                  border: `1px solid ${attending ? "rgba(74,175,147,0.3)" : "rgba(201,97,76,0.2)"}`,
                }}
              >
                {attending
                  ? <CalendarCheck size={28} style={{ color: "#4caf93" }} />
                  : <CalendarX size={28} style={{ color: "#c9614c" }} />
                }
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
              >
                {attending ? "We'll see you there" : "Thank you for letting us know"}
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                {attending
                  ? "Your RSVP has been recorded. The family looks forward to celebrating Mama's life with you."
                  : "Your response has been noted. You are still in our thoughts and prayers."}
              </p>
              <Link
                href="/"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
              >
                Return to Memorial →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", backdropFilter: "blur(12px)" }}
            >
              {/* Attending toggle */}
              <div className="mb-6">
                <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                  Will you be attending? *
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                    style={{
                      border: `1.5px solid ${attending === true ? "#4caf93" : "var(--border-gold)"}`,
                      background: attending === true ? "rgba(74,175,147,0.1)" : "rgba(255,255,255,0.02)",
                      color: attending === true ? "#4caf93" : "var(--text-muted)",
                      fontFamily: "var(--font-lato)",
                      fontSize: "0.875rem",
                      fontWeight: attending === true ? 600 : 400,
                    }}
                  >
                    <CalendarCheck size={16} />
                    Yes, I&apos;ll attend
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                    style={{
                      border: `1.5px solid ${attending === false ? "#c9614c" : "var(--border-gold)"}`,
                      background: attending === false ? "rgba(201,97,76,0.08)" : "rgba(255,255,255,0.02)",
                      color: attending === false ? "#c9614c" : "var(--text-muted)",
                      fontFamily: "var(--font-lato)",
                      fontSize: "0.875rem",
                      fontWeight: attending === false ? 600 : 400,
                    }}
                  >
                    <CalendarX size={16} />
                    Unable to attend
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    <Phone size={11} className="inline mr-1" />Phone (optional)
                  </label>
                  <input type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={set("phone")} style={inputStyle} />
                </div>

                {attending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      <Users size={11} className="inline mr-1" />Number attending
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {ATTENDEE_OPTIONS.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, attendees: n }))}
                          className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                          style={{
                            border: `1.5px solid ${form.attendees === n ? "var(--accent-gold)" : "var(--border-gold)"}`,
                            background: form.attendees === n ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)",
                            color: form.attendees === n ? "var(--accent-gold)" : "var(--text-muted)",
                            fontFamily: "var(--font-lato)",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    <MessageSquare size={11} className="inline mr-1" />Message to the family (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="A word for the family…"
                    value={form.message}
                    onChange={set("message")}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || attending === null}
                  className="w-full"
                >
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={15} /> Submit RSVP</>
                  )}
                </Button>

                {attending === null && (
                  <p className="text-xs text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    Please select whether you will be attending above.
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
        message={attending ? "Your RSVP has been received. The family looks forward to seeing you." : "Your response has been noted. Thank you for letting the family know."}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  )
}
