"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"

interface TributeModalProps {
  open: boolean
  onClose: () => void
}

const RELATIONSHIPS = [
  "Family Member",
  "Child",
  "Grandchild",
  "Friend",
  "Colleague",
  "Church Member",
  "CWO Member",
  "Neighbor",
  "Other",
]

export default function TributeModal({ open, onClose }: TributeModalProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setToastVisible(true)
    onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,15,31,0.85)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Leave a tribute"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-gold)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            className="text-xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Leave a Tribute
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your Name" required>
                <Input placeholder="e.g. John Doe" />
              </Field>
              <Field label="Your Email" required>
                <Input type="email" placeholder="e.g. john@example.com" />
              </Field>
            </div>

            <Field label="Relationship" required>
              <select
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
                required
              >
                <option value="">Select relationship</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r} style={{ color: "#1a1a2e" }}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="How did they impact your life?">
              <textarea
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 resize-none"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
                placeholder="Their impact on my life..."
              />
            </Field>

            <Field label="What will you miss most?">
              <textarea
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 resize-none"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
                placeholder="What I'll miss..."
              />
            </Field>

            <Field label="Your Message" required>
              <textarea
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2 resize-none"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                }}
                placeholder="Share your memory or message..."
                required
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="animate-spin">&#9696;</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Tribute
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <Toast
        message="Your tribute has been submitted and will be reviewed before appearing."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent-gold)" }}> *</span>}
      </span>
      {children}
    </label>
  )
}

function Input({ type = "text", placeholder, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-gold)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-lato)",
      }}
      {...props}
    />
  )
}
