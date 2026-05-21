"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Heart,
  Copy,
  Check,
  Send,
  User,
  Mail,
  DollarSign,
  Loader2,
  HandHeart,
  EyeOff,
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useMemorial } from "@/hooks/useMemorial"
import type { DonationInfo } from "@/types"

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
      style={{
        background: copied ? "rgba(74,175,147,0.15)" : "rgba(201,168,76,0.12)",
        color: copied ? "#4caf93" : "var(--accent-gold)",
        border: `1px solid ${copied ? "rgba(74,175,147,0.3)" : "rgba(201,168,76,0.3)"}`,
        fontFamily: "var(--font-lato)",
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

// ─── Bank card ────────────────────────────────────────────────────────────────
function BankCard({
  label,
  bankName,
  accountName,
  accountNumber,
  sortCode,
}: {
  label: string
  bankName: string
  accountName: string
  accountNumber: string
  sortCode?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--accent-gold)" }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
        >
          {label}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Bank</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
            {bankName}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Account Name</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
            {accountName}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Account Number</p>
            <CopyButton value={accountNumber} />
          </div>
          <p
            className="text-lg font-bold tracking-widest"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          >
            {accountNumber}
          </p>
        </div>
        {sortCode && (
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Sort Code</p>
            <p className="text-sm" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>{sortCode}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DonatePage() {
  const memorial = useMemorial()
  const [info, setInfo] = useState<DonationInfo | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    currency: "NGN",
    message: "",
    anonymous: false,
  })

  useEffect(() => {
    fetch("/api/donation-info")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => {})
  }, [])

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: form.anonymous ? "Anonymous" : form.name,
          donorEmail: form.email,
          amount: form.amount,
          currency: form.currency,
          message: form.message,
          isAnonymous: form.anonymous,
        }),
      })
    } catch {}
    setSubmitting(false)
    setSubmitted(true)
    setToastVisible(true)
    setForm({ name: "", email: "", amount: "", currency: "NGN", message: "", anonymous: false })
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
              <HandHeart size={30} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Support the Family
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
            If you wish to support the family of{" "}
            <span style={{ color: "var(--accent-gold)" }}>{memorial.fullName}</span>{" "}
            during this difficult time, your contribution is deeply appreciated.
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Bank Details ── */}
          <div className="space-y-5">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              Bank Transfer Details
            </motion.h2>

            {info ? (
              <>
                <BankCard
                  label="Nigerian Naira (NGN)"
                  bankName={info.bankName}
                  accountName={info.accountName}
                  accountNumber={info.accountNumber}
                  sortCode={info.sortCode}
                />
                {info.bankName2 && info.accountNumber2 && info.accountName2 && (
                  <BankCard
                    label="Second Account"
                    bankName={info.bankName2}
                    accountName={info.accountName2}
                    accountNumber={info.accountNumber2}
                    sortCode={info.sortCode2}
                  />
                )}
                {info.usdInstructions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-6"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-gold)" }} />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}>
                        International / USD
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)", lineHeight: 1.8 }}>
                      {info.usdInstructions}
                    </p>
                  </motion.div>
                )}
                {info.additionalInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      {info.additionalInfo}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
              </div>
            )}
          </div>

          {/* ── Pledge Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-8 text-center"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(74,175,147,0.15)", border: "1px solid rgba(74,175,147,0.3)" }}
                >
                  <Check size={28} style={{ color: "#4caf93" }} />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  Thank You
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                  Your support has been recorded. The family is deeply grateful for your kindness and generosity during this time.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}
                >
                  Record another donation →
                </button>
              </motion.div>
            ) : (
              <div
                className="rounded-2xl p-6 sm:p-7"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>
                    <Heart size={17} style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                      Let Us Know You Gave
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      After transferring, fill this form so the family knows.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      <User size={11} className="inline mr-1" />Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={set("name")}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      <Mail size={11} className="inline mr-1" />Email (optional)
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={set("email")}
                      style={inputStyle}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                        <DollarSign size={11} className="inline mr-1" />Amount
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 50,000"
                        value={form.amount}
                        onChange={set("amount")}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                        Currency
                      </label>
                      <select
                        value={form.currency}
                        onChange={set("currency")}
                        style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
                      >
                        <option value="NGN" style={{ background: "#1a1a2e" }}>NGN ₦</option>
                        <option value="USD" style={{ background: "#1a1a2e" }}>USD $</option>
                        <option value="GBP" style={{ background: "#1a1a2e" }}>GBP £</option>
                        <option value="EUR" style={{ background: "#1a1a2e" }}>EUR €</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="A word of support for the family…"
                      value={form.message}
                      onChange={set("message")}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  <label
                    className="flex items-center gap-3 cursor-pointer select-none"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        background: form.anonymous ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${form.anonymous ? "var(--accent-gold)" : "var(--border-gold)"}`,
                      }}
                      onClick={() => setForm((f) => ({ ...f, anonymous: !f.anonymous }))}
                    >
                      {form.anonymous && <Check size={12} style={{ color: "var(--accent-gold)" }} />}
                    </div>
                    <span className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                      <EyeOff size={13} />
                      Give anonymously
                    </span>
                  </label>

                  <Button type="submit" variant="primary" disabled={submitting} className="w-full">
                    {submitting ? (
                      <><Loader2 size={15} className="animate-spin" /> Recording…</>
                    ) : (
                      <><Send size={15} /> Record My Donation</>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
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
        message="Your donation has been recorded. The family thanks you from the bottom of their hearts."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  )
}
