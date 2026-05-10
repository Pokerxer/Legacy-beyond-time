"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, Trash2, Check, X, Pencil, Loader2 } from "lucide-react"
import type { GalleryImageDocument } from "@/types"

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImageDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [saving, setSaving] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery")
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        setMessage("Uploaded successfully!")
        e.currentTarget.reset()
        fetchImages()
      } else {
        const err = await res.json()
        setMessage(err.error || "Upload failed.")
      }
    } catch {
      setMessage("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const startEdit = (img: GalleryImageDocument) => {
    setEditingId(img._id)
    setEditCaption(img.caption)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditCaption("")
  }

  const saveCaption = async (id: string) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editCaption }),
      })
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img._id === id ? { ...img, caption: editCaption } : img
          )
        )
        setEditingId(null)
      }
    } catch {
      // silent
    } finally {
      setSaving(null)
    }
  }

  const confirmDelete = async (id: string) => {
    if (!window.confirm("Delete this image permanently?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img._id !== id))
      }
    } catch {
      // silent
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Gallery Management
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Upload images, edit captions, and manage the gallery.
        </p>
      </motion.div>

      {/* Upload form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 mb-8"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-gold)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          <Upload size={18} style={{ color: "var(--accent-gold)" }} />
          Upload Image
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Image File
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full text-sm"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Caption
            </label>
            <input
              type="text"
              name="caption"
              placeholder="e.g. Mama at her 70th birthday celebration"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
              color: "#1a1a2e",
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload to Cloudinary
              </>
            )}
          </button>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
              style={{ color: message.includes("failed") ? "#ff6b6b" : "var(--accent-gold)" }}
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>

      {/* Current gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-6"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-gold)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          <ImageIcon size={18} style={{ color: "var(--accent-gold)" }} />
          Gallery ({images.length} images)
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
          </div>
        ) : images.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: "var(--text-muted)" }}>
            No images yet. Upload your first image above.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((img) => (
                <motion.div
                  key={img._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-xl overflow-hidden group"
                  style={{ border: "1px solid var(--border-gold)" }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={img.url}
                      alt={img.caption || `Gallery image`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.4)" }}
                    >
                      <button
                        onClick={() => confirmDelete(img._id)}
                        disabled={deleting === img._id}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20"
                        style={{ color: "#ff6b6b" }}
                        aria-label="Delete image"
                      >
                        {deleting === img._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5">
                    {editingId === img._id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          autoFocus
                          className="flex-1 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-1"
                          style={{
                            background: "var(--bg-primary)",
                            border: "1px solid var(--accent-gold)",
                            color: "var(--text-primary)",
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCaption(img._id)
                            if (e.key === "Escape") cancelEdit()
                          }}
                        />
                        <button
                          onClick={() => saveCaption(img._id)}
                          disabled={saving === img._id}
                          className="p-1 rounded transition-colors hover:opacity-80"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {saving === img._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 rounded transition-colors hover:opacity-80"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(img)}
                        className="flex items-center gap-1.5 group/caption w-full text-left"
                      >
                        <span
                          className="text-xs flex-1 line-clamp-2"
                          style={{ color: img.caption ? "var(--text-primary)" : "var(--text-muted)" }}
                        >
                          {img.caption || "Add caption..."}
                        </span>
                        <Pencil
                          size={10}
                          className="opacity-0 group-hover/caption:opacity-100 transition-opacity shrink-0"
                          style={{ color: "var(--accent-gold)" }}
                        />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
