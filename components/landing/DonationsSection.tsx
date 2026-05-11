"use client"

import { motion } from "framer-motion"
import { Heart, Copy, Check, Banknote, Landmark, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { fadeUpInView } from "./animations"
import type { DonationInfo } from "@/types"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs transition-all hover:opacity-80"
      style={{ color: "var(--accent-gold)" }}
      aria-label={`Copy ${text}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

export default function DonationsSection() {
  const [info, setInfo] = useState<DonationInfo | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", amount: "", message: "", anonymous: false })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch("/api/donation-info")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: formData.anonymous ? "Anonymous" : formData.name,
          donorEmail: formData.email,
          amount: formData.amount,
          message: formData.message,
          isAnonymous: formData.anonymous,
        }),
      })
      setSubmitted(true)
      setFormData({ name: "", email: "", amount: "", message: "", anonymous: false })
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative px-6 py-14 sm:py-20" aria-labelledby="donations-heading">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUpInView(0)} className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <Heart size={26} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            id="donations-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Support the Legacy
          </h2>
          <p
            className="text-sm sm:text-base max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            In lieu of flowers, the family kindly requests that donations be made to continue Mama&apos;s charitable works in honor of her memory.
          </p>
        </motion.div>

        <motion.div
          {...fadeUpInView(0.12)}
          className="rounded-2xl p-6 sm:p-8 mb-8"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Banknote size={20} style={{ color: "var(--accent-gold)" }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Bank Transfer (NGN)
            </h3>
          </div>

          {info ? (
            <div className="space-y-4">
              <DetailRow label="Bank" value={info.bankName} />
              <DetailRow label="Account Name" value={info.accountName} />
              <DetailRow label="Account Number" value={info.accountNumber} mono copyable />
              <DetailRow label="Sort Code" value={info.sortCode} mono copyable />

              {info.bankName2 && (
                <>
                  <div className="pt-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Landmark size={16} style={{ color: "var(--accent-gold)" }} />
                      <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                        Alternative Account
                      </h4>
                    </div>
                    <DetailRow label="Bank" value={info.bankName2} />
                    <DetailRow label="Account Name" value={info.accountName2 || ""} />
                    {info.accountNumber2 && <DetailRow label="Account Number" value={info.accountNumber2} mono copyable />}
                    {info.sortCode2 && <DetailRow label="Sort Code" value={info.sortCode2} mono copyable />}
                  </div>
                </>
              )}

              {info.usdInstructions && (
                <div className="pt-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                    USD / Foreign Transfer
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                    {info.usdInstructions}
                  </p>
                </div>
              )}

              {info.additionalInfo && (
                <div className="pt-4" style={{ borderTop: "1px solid var(--border-gold)" }}>
                  <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                    {info.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 rounded" style={{ background: "var(--bg-primary)" }} />
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 text-center" style={{ borderTop: "1px solid var(--border-gold)" }}>
            <p className="text-xs italic" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              &ldquo;Whatever you did for one of the least of these brothers and sisters of mine, you did for me.&rdquo; &mdash; Matthew 25:40
            </p>
          </div>
        </motion.div>

        {/* Donation Form */}
        <motion.div
          {...fadeUpInView(0.16)}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Send size={18} style={{ color: "var(--accent-gold)" }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Record Your Donation
            </h3>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Heart size={32} className="mx-auto mb-3" style={{ color: "var(--accent-gold)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Thank you for your generosity!
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Your donation record has been submitted.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs underline transition-colors hover:opacity-80"
                style={{ color: "var(--accent-gold)" }}
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={formData.anonymous}
                  required={!formData.anonymous}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-40"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-gold)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-lato)",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-gold)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-lato)",
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Amount (e.g. 10,000 NGN or $50)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
              />
              <textarea
                rows={3}
                placeholder="Message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 resize-none"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
              />
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--accent-gold)" }}
                />
                <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                  Keep anonymous
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                  color: "#1a1a2e",
                }}
              >
                {submitting ? (
                  <><span className="animate-spin">&#9696;</span> Submitting...</>
                ) : (
                  <><Heart size={16} /> Record Donation</>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function DetailRow({ label, value, mono, copyable }: { label: string; value: string; mono?: boolean; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
      <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
        {label}
      </span>
      <span className="flex items-center gap-2 text-right">
        <span
          className={`text-sm font-medium ${mono ? "font-mono tracking-wider" : ""}`}
          style={{ color: mono ? "var(--accent-gold)" : "var(--text-primary)", fontFamily: "var(--font-lato)" }}
        >
          {value}
        </span>
        {copyable && <CopyButton text={value} />}
      </span>
    </div>
  )
}
