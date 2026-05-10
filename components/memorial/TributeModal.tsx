"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"

interface TributeModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
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

export default function TributeModal({ open, onClose, onSuccess }: TributeModalProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const form = formRef.current!
    const data = {
      authorName: (form.elements.namedItem("name") as HTMLInputElement).value,
      authorEmail: (form.elements.namedItem("email") as HTMLInputElement).value,
      relationship: (form.elements.namedItem("relationship") as HTMLSelectElement).value,
      impact: (form.elements.namedItem("impact") as HTMLTextAreaElement).value,
      whatTheyMiss: (form.elements.namedItem("miss") as HTMLTextAreaElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setToastMessage("Your tribute has been submitted and will be reviewed before appearing.")
        form.reset()
        onClose()
        onSuccess?.()
      } else {
        setToastMessage("Something went wrong. Please try again.")
      }
    } catch {
      setToastMessage("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
      setToastVisible(true)
    }
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

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your Name" required>
                <Input name="name" placeholder="e.g. John Doe" required />
              </Field>
              <Field label="Your Email" required>
                <Input name="email" type="email" placeholder="e.g. john@example.com" required />
              </Field>
            </div>

            <Field label="Relationship" required>
              <select
                name="relationship"
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
                name="impact"
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
                name="miss"
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
                name="message"
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
        message={toastMessage}
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
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
