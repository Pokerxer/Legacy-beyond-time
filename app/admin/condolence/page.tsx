"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Trash2, Heart, Plus, Pencil, X, Loader2, Quote, MapPin } from "lucide-react"
import type { Tribute } from "@/types"

const RELATIONSHIP_OPTIONS = [
  "Family Member",
  "Friend",
  "Colleague",
  "Community Member",
  "Parish Member",
  "Neighbour",
  "Former Student",
  "Other",
]

const emptyForm = {
  authorName: "",
  authorEmail: "",
  location: "",
  relationship: "",
  message: "",
  isApproved: true,
}

export default function AdminCondolence() {
  const [items, setItems] = useState<Tribute[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchCondolences = useCallback(async () => {
    try {
      const res = await fetch("/api/tributes?category=condolence")
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
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

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (t: Tribute) => {
    setEditingId(t._id)
    setForm({
      authorName: t.authorName,
      authorEmail: t.authorEmail || "",
      location: t.location || "",
      relationship: t.relationship || "",
      message: t.message,
      isApproved: t.isApproved,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        category: "condolence",
        memorialId: "christiana-opara",
      }
      if (editingId) {
        const res = await fetch(`/api/tributes/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) { setModalOpen(false); fetchCondolences() }
      } else {
        const res = await fetch("/api/tributes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) { setModalOpen(false); fetchCondolences() }
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
      if (res.ok) fetchCondolences()
    } catch { /* silent */ }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this condolence permanently?")) return
    try {
      const res = await fetch(`/api/tributes/${id}`, { method: "DELETE" })
      if (res.ok) fetchCondolences()
    } catch { /* silent */ }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
  const inputStyle = { background: "var(--card-bg)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Condolence Letters
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {items.length} condolence message{items.length !== 1 ? "s" : ""} — approve, edit or remove.
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#1a1a2e" }}>
          <Plus size={16} /> Add Condolence
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Heart size={40} style={{ color: "var(--border-gold)" }} />
          <p style={{ color: "var(--text-muted)" }}>No condolences yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t, i) => (
            <motion.div key={t._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl p-5"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(201,168,76,0.12)" }}>
                      <Quote size={14} style={{ color: "var(--accent-gold)" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {t.authorName}
                    </span>
                    {t.relationship && (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {t.relationship}</span>
                    )}
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
                  {t.location && (
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={11} style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed mt-1 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                    {t.message}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                    {t.authorEmail && ` · ${t.authorEmail}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(t)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: "rgba(201,168,76,0.1)", color: "var(--accent-gold)" }}
                    aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => toggleApproval(t._id, t.isApproved)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: t.isApproved ? "rgba(76,175,80,0.1)" : "rgba(255,152,0,0.1)",
                      color: t.isApproved ? "#4caf50" : "#ff9800",
                    }}
                    aria-label={t.isApproved ? "Unapprove" : "Approve"}>
                    {t.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  </button>
                  <button onClick={() => deleteItem(t._id)}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: "rgba(255,0,0,0.1)", color: "#ff6b6b" }}
                    aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gold)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                  {editingId ? "Edit Condolence" : "Add Condolence"}
                </h2>
                <button onClick={() => setModalOpen(false)} style={{ color: "var(--text-muted)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" required>
                    <input value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className={inputCls} style={inputStyle} required />
                  </Field>
                  <Field label="Location" required>
                    <input value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className={inputCls} style={inputStyle} placeholder="City, State / Country" required />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Relationship to Deceased" required>
                    <select value={form.relationship}
                      onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                      className={inputCls} style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none" }} required>
                      <option value="" disabled style={{ background: "#1a1a2e" }}>Select…</option>
                      {RELATIONSHIP_OPTIONS.map((r) => (
                        <option key={r} value={r} style={{ background: "#1a1a2e", color: "#fff" }}>{r}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.authorEmail}
                      onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>

                <Field label="Message" required>
                  <textarea value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4} className={`${inputCls} resize-none`} style={inputStyle} required />
                </Field>

                <label className="flex items-center gap-2.5">
                  <input type="checkbox" checked={form.isApproved}
                    onChange={(e) => setForm({ ...form, isApproved: e.target.checked })}
                    className="w-4 h-4 rounded" style={{ accentColor: "var(--accent-gold)" }} />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    Approved (visible on the site)
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#1a1a2e" }}>
                    {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : editingId ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}>
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
        {label}{required && <span style={{ color: "var(--accent-gold)" }}> *</span>}
      </span>
      {children}
    </label>
  )
}
