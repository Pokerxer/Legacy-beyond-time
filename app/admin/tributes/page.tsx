"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Trash2, MessageSquareHeart, Plus, Pencil, X, Loader2 } from "lucide-react"
import type { Tribute } from "@/types"

const RELATIONSHIPS = [
  "Condolence",
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

interface FormData {
  authorName: string
  authorEmail: string
  location: string
  relationship: string
  message: string
  impact: string
  whatTheyMiss: string
  isApproved: boolean
}

const emptyForm: FormData = {
  authorName: "",
  authorEmail: "",
  location: "",
  relationship: "Condolence",
  message: "",
  impact: "",
  whatTheyMiss: "",
  isApproved: true,
}

export default function AdminTributes() {
  const [tributes, setTributes] = useState<Tribute[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchTributes = useCallback(async () => {
    try {
      const res = await fetch("/api/tributes")
      if (res.ok) {
        const data = await res.json()
        setTributes(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTributes()
  }, [fetchTributes])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (t: Tribute) => {
    setEditingId(t._id)
    setForm({
      authorName: t.authorName,
      authorEmail: t.authorEmail,
      location: t.location || "",
      relationship: t.relationship,
      message: t.message,
      impact: t.impact || "",
      whatTheyMiss: t.whatTheyMiss || "",
      isApproved: t.isApproved,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        const res = await fetch(`/api/tributes/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setModalOpen(false)
          fetchTributes()
        }
      } else {
        const res = await fetch("/api/tributes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setModalOpen(false)
          fetchTributes()
        }
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const toggleApproval = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/tributes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !current }),
      })
      if (res.ok) fetchTributes()
    } catch {
      // silent
    }
  }

  const deleteTribute = async (id: string) => {
    if (!confirm("Delete this tribute permanently?")) return
    try {
      const res = await fetch(`/api/tributes/${id}`, { method: "DELETE" })
      if (res.ok) fetchTributes()
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Manage Tributes
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Approve, review, or remove tributes submitted by visitors.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
            color: "#1a1a2e",
          }}
        >
          <Plus size={16} />
          Add Tribute
        </button>
      </motion.div>

      {tributes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <MessageSquareHeart size={40} style={{ color: "var(--border-gold)" }} />
          <p style={{ color: "var(--text-muted)" }}>
            No tributes yet. They will appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tributes.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl p-5"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {t.authorName}
                    </span>
                    {t.location && (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {t.location}
                      </span>
                    )}
                    <span className="text-xs" style={{ opacity: 0.6, color: "var(--text-muted)" }}>
                      {t.relationship}
                    </span>
                    {t.isApproved ? (
                      <span className="text-xs flex items-center gap-1" style={{ color: "#4caf50" }}>
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <span className="text-xs flex items-center gap-1" style={{ color: "#ff9800" }}>
                        <XCircle size={12} /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {t.message}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                    {t.authorEmail && ` · ${t.authorEmail}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.1)", color: "var(--accent-gold)" }}
                    aria-label="Edit tribute"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => toggleApproval(t._id, t.isApproved)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: t.isApproved ? "rgba(76,175,80,0.1)" : "rgba(255,152,0,0.1)",
                      color: t.isApproved ? "#4caf50" : "#ff9800",
                    }}
                    aria-label={t.isApproved ? "Unapprove" : "Approve"}
                  >
                    {t.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  </button>
                  <button
                    onClick={() => deleteTribute(t._id)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: "rgba(255,0,0,0.1)", color: "#ff6b6b" }}
                    aria-label="Delete tribute"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,15,31,0.85)", backdropFilter: "blur(4px)" }}
            onClick={() => setModalOpen(false)}
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
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {editingId ? "Edit Tribute" : "Add Tribute"}
                </h2>
                <button onClick={() => setModalOpen(false)} style={{ color: "var(--text-muted)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" required>
                    <input
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={form.authorEmail}
                      onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Location">
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                    />
                  </Field>
                  <Field label="Relationship">
                    <select
                      value={form.relationship}
                      onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                    >
                      {RELATIONSHIPS.map((r) => (
                        <option key={r} value={r} style={{ color: "#1a1a2e" }}>{r}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Message" required>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                    required
                  />
                </Field>

                <Field label="Impact">
                  <textarea
                    value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                  />
                </Field>

                <Field label="What they'll miss">
                  <textarea
                    value={form.whatTheyMiss}
                    onChange={(e) => setForm({ ...form, whatTheyMiss: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 resize-none"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
                  />
                </Field>

                <label className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={form.isApproved}
                    onChange={(e) => setForm({ ...form, isApproved: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--accent-gold)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    Approved (visible on the site)
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#1a1a2e" }}
                  >
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      editingId ? "Update Tribute" : "Create Tribute"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
        {required && <span style={{ color: "var(--accent-gold)" }}> *</span>}
      </span>
      {children}
    </label>
  )
}
