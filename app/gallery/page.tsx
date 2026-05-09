"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  Images,
  Upload,
  X,
  ZoomIn,
  Check,
  ImagePlus,
  Loader2,
} from "lucide-react"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { memorial } from "@/data/memorial"
import type { GalleryItem } from "@/types"

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,20,0.95)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <Image src={item.url} alt={item.caption || "Gallery photo"} fill className="object-contain" />
        </div>
        {item.caption && (
          <div
            className="absolute bottom-0 left-0 right-0 px-6 py-4 text-center"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
          >
            <p className="text-sm" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
              {item.caption}
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ background: "rgba(0,0,0,0.6)" }}
          aria-label="Close"
        >
          <X size={18} color="white" />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Gallery card ─────────────────────────────────────────────────────────────
function GalleryCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, delay: (index % 12) * 0.04 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "1", border: "1px solid var(--border-gold)" }}
      onClick={onClick}
    >
      <Image
        src={item.url}
        alt={item.caption || "Memorial photo"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn
          size={24}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
        />
      </div>
      {item.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}
        >
          <p className="text-xs truncate text-white" style={{ fontFamily: "var(--font-lato)" }}>
            {item.caption}
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Upload zone ──────────────────────────────────────────────────────────────
interface PendingFile {
  id: string
  file: File
  preview: string
  caption: string
  status: "pending" | "uploading" | "done" | "error"
  uploadedUrl?: string
}

function UploadZone({ onUploaded }: { onUploaded: (item: GalleryItem) => void }) {
  const [pending, setPending] = useState<PendingFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [eventCaption, setEventCaption] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | null, currentEventCaption: string) => {
    if (!files) return
    const next: PendingFile[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        preview: URL.createObjectURL(f),
        caption: currentEventCaption,
        status: "pending" as const,
      }))
    setPending((p) => [...p, ...next])
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files, eventCaption)
  }

  const uploadOne = async (pf: PendingFile) => {
    setPending((prev) => prev.map((p) => p.id === pf.id ? { ...p, status: "uploading" } : p))
    try {
      const fd = new FormData()
      fd.append("file", pf.file)

      const res = await fetch("/api/gallery/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()

      const item: GalleryItem = {
        url: data.url,
        caption: pf.caption || pf.file.name.replace(/\.[^.]+$/, ""),
        type: "photo",
      }

      setPending((prev) => prev.map((p) => p.id === pf.id ? { ...p, status: "done", uploadedUrl: data.url } : p))
      onUploaded(item)
    } catch {
      setPending((prev) => prev.map((p) => p.id === pf.id ? { ...p, status: "error" } : p))
    }
  }

  const uploadAll = () => {
    pending.filter((p) => p.status === "pending").forEach(uploadOne)
  }

  const remove = (id: string) =>
    setPending((prev) => prev.filter((p) => p.id !== id))

  const setCaption = (id: string, caption: string) =>
    setPending((prev) => prev.map((p) => p.id === id ? { ...p, caption } : p))

  const hasPending = pending.some((p) => p.status === "pending")

  return (
    <div className="space-y-4">
      {/* Event caption */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
        >
          Event / Caption
        </label>
        <input
          type="text"
          placeholder="e.g. Christmas 2019, Burial Mass, Family Reunion…"
          value={eventCaption}
          onChange={(e) => setEventCaption(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-gold)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-lato)",
            fontSize: "0.875rem",
            padding: "0.65rem 1rem",
            borderRadius: "0.75rem",
            outline: "none",
            width: "100%",
          }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
          This caption will be applied to all photos you upload.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="relative rounded-2xl flex flex-col items-center justify-center gap-3 py-10 px-6 cursor-pointer transition-colors"
        style={{
          border: `2px dashed ${dragging ? "var(--accent-gold)" : "var(--border-gold)"}`,
          background: dragging ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
        }}
      >
        <ImagePlus size={32} style={{ color: dragging ? "var(--accent-gold)" : "var(--text-muted)", opacity: 0.7 }} />
        <p className="text-sm text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
          <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>Click to choose photos</span>
          {" "}or drag & drop them here
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
          JPG, PNG, WEBP — up to 10 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files, eventCaption)}
        />
      </div>

      {/* Preview list */}
      <AnimatePresence>
        {pending.map((pf) => (
          <motion.div
            key={pf.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
          >
            {/* Thumb */}
            <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
              <Image src={pf.preview} alt="preview" fill className="object-cover" />
              {pf.status === "done" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Check size={20} color="#c9a84c" />
                </div>
              )}
              {pf.status === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={20} color="white" className="animate-spin" />
                </div>
              )}
            </div>

            {/* Caption input */}
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-1.5 truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                {pf.file.name}
              </p>
              <input
                type="text"
                placeholder="Override caption for this photo (optional)"
                value={pf.caption}
                onChange={(e) => setCaption(pf.id, e.target.value)}
                disabled={pf.status !== "pending"}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-lato)",
                  fontSize: "0.8rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.5rem",
                  outline: "none",
                  width: "100%",
                  opacity: pf.status !== "pending" ? 0.5 : 1,
                }}
              />
              {pf.status === "error" && (
                <p className="text-xs mt-1" style={{ color: "#c9614c" }}>Upload failed — please try again.</p>
              )}
            </div>

            {/* Remove */}
            {pf.status === "pending" && (
              <button
                onClick={() => remove(pf.id)}
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ background: "rgba(201,97,76,0.15)" }}
              >
                <X size={14} style={{ color: "#c9614c" }} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {hasPending && (
        <Button variant="primary" className="w-full" onClick={uploadAll}>
          <Upload size={15} />
          Upload {pending.filter((p) => p.status === "pending").length} Photo{pending.filter((p) => p.status === "pending").length !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(memorial.gallery)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const onUploaded = (item: GalleryItem) => {
    setGallery((prev) => [item, ...prev])
    setToastVisible(true)
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
              <Images size={30} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Photo Gallery
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
            Share your cherished photos of{" "}
            <span style={{ color: "var(--accent-gold)" }}>{memorial.shortName}</span>.
            Every picture is a memory preserved forever.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}>
                {gallery.length}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>Photos</div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* ── Upload panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 lg:sticky lg:top-24"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>
                  <Upload size={17} style={{ color: "var(--accent-gold)" }} />
                </div>
                <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                  Share a Photo
                </h2>
              </div>
              <UploadZone onUploaded={onUploaded} />
            </div>
          </motion.div>

          {/* ── Gallery grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
              {gallery.length} photo{gallery.length !== 1 ? "s" : ""} in the gallery
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {gallery.map((item, i) => (
                  <GalleryCard
                    key={item.url}
                    item={item}
                    index={i}
                    onClick={() => setLightbox(item)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      <Toast
        message="Photo uploaded successfully and added to the gallery."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  )
}
