"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HandHeart, Pencil, X, Check, Loader2, Banknote, Eye, EyeOff } from "lucide-react"
import type { DonationInfo } from "@/types"

export default function AdminDonations() {
  const [info, setInfo] = useState<DonationInfo | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    bankName2: "",
    accountName2: "",
    accountNumber2: "",
    sortCode2: "",
    usdInstructions: "",
    additionalInfo: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/donation-info")
      .then((r) => r.json())
      .then((data) => {
        setInfo(data)
        setForm({
          bankName: data.bankName || "",
          accountName: data.accountName || "",
          accountNumber: data.accountNumber || "",
          sortCode: data.sortCode || "",
          bankName2: data.bankName2 || "",
          accountName2: data.accountName2 || "",
          accountNumber2: data.accountNumber2 || "",
          sortCode2: data.sortCode2 || "",
          usdInstructions: data.usdInstructions || "",
          additionalInfo: data.additionalInfo || "",
        })
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/donation-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setInfo(data)
        setEditing(false)
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Donations
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Manage bank details and view donation records.
          </p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{
            background: editing ? "rgba(255,0,0,0.1)" : "rgba(201,168,76,0.15)",
            color: editing ? "#ff6b6b" : "var(--accent-gold)",
          }}
        >
          {editing ? <X size={16} /> : <Pencil size={16} />}
          {editing ? "Cancel" : "Edit Details"}
        </button>
      </motion.div>

      {/* Bank Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
      >
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          <Banknote size={18} style={{ color: "var(--accent-gold)" }} />
          Bank Details
        </h2>

        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
            className="space-y-4"
          >
            <Field label="Bank Name">
              <input
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                required
              />
            </Field>
            <Field label="Account Name">
              <input
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Account Number">
                <input
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                  required
                />
              </Field>
              <Field label="Sort Code">
                <input
                  value={form.sortCode}
                  onChange={(e) => setForm({ ...form, sortCode: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                />
              </Field>
            </div>

            <div className="pt-2" style={{ borderTop: "1px solid var(--border-gold)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Secondary Bank (Optional)
              </p>
              <Field label="Bank Name">
                <input
                  value={form.bankName2}
                  onChange={(e) => setForm({ ...form, bankName2: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                />
              </Field>
              <Field label="Account Name">
                <input
                  value={form.accountName2}
                  onChange={(e) => setForm({ ...form, accountName2: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Account Number">
                  <input
                    value={form.accountNumber2}
                    onChange={(e) => setForm({ ...form, accountNumber2: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                  />
                </Field>
                <Field label="Sort Code">
                  <input
                    value={form.sortCode2}
                    onChange={(e) => setForm({ ...form, sortCode2: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                  />
                </Field>
              </div>
            </div>

            <Field label="USD / Foreign Transfer Instructions">
              <textarea
                value={form.usdInstructions}
                onChange={(e) => setForm({ ...form, usdInstructions: e.target.value })}
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
              />
            </Field>

            <Field label="Additional Info">
              <textarea
                value={form.additionalInfo}
                onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
              />
            </Field>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#1a1a2e" }}
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Save Changes</>}
            </button>
          </form>
        ) : info ? (
          <div className="space-y-3">
            <Row label="Bank" value={info.bankName} />
            <Row label="Account Name" value={info.accountName} />
            <Row label="Account Number" value={info.accountNumber} mono />
            <Row label="Sort Code" value={info.sortCode} mono />
            {info.bankName2 && <Row label="Bank (2)" value={info.bankName2} />}
            {info.accountName2 && <Row label="Account Name (2)" value={info.accountName2} />}
            {info.accountNumber2 && <Row label="Account Number (2)" value={info.accountNumber2} mono />}
            {info.usdInstructions && (
              <div className="pt-2">
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                  USD / Foreign Transfer Instructions
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{info.usdInstructions}</p>
              </div>
            )}
            {info.additionalInfo && (
              <div className="pt-2">
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                  Additional Info
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{info.additionalInfo}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        )}
      </motion.div>

      {/* Note about the donation form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
      >
        <h2
          className="text-lg font-semibold mb-2 flex items-center gap-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          <HandHeart size={18} style={{ color: "var(--accent-gold)" }} />
          Donation Form
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Visitors can submit donation records through the memorial site. Donation records are stored here.
        </p>
      </motion.div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono tracking-wider" : ""}`} style={{ color: mono ? "var(--accent-gold)" : "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</span>
      {children}
    </label>
  )
}
