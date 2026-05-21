"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CalendarCheck, CalendarX, Loader2, Trash2, Users, MapPin, Mail, Phone, MessageSquare } from "lucide-react"

interface RSVP {
  _id: string
  name: string
  email: string
  phone?: string
  attendees: number
  attending: boolean
  message?: string
  createdAt: string
}

export default function AdminRSVP() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "attending" | "not-attending">("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchRSVPs = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp")
      if (res.ok) setRsvps(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRSVPs() }, [fetchRSVPs])

  const deleteRSVP = async (id: string) => {
    if (!confirm("Delete this RSVP?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: "DELETE" })
      if (res.ok) setRsvps((prev) => prev.filter((r) => r._id !== id))
    } catch {
      // silent
    } finally {
      setDeleting(null)
    }
  }

  const visible = rsvps.filter((r) =>
    filter === "all" ? true : filter === "attending" ? r.attending : !r.attending
  )

  const attending = rsvps.filter((r) => r.attending)
  const notAttending = rsvps.filter((r) => !r.attending)
  const totalGuests = attending.reduce((sum, r) => sum + r.attendees, 0)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          RSVP Responses
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Track who is attending the funeral service.
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Attending",     value: attending.length,    icon: CalendarCheck, color: "#4caf50" },
          { label: "Not Attending", value: notAttending.length, icon: CalendarX,     color: "#c9614c" },
          { label: "Total Guests",  value: totalGuests,         icon: Users,         color: "#c9a84c" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </span>
                <Icon size={15} style={{ color: s.color }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>
                {loading ? "—" : s.value}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "attending", "not-attending"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === f ? "rgba(201,168,76,0.15)" : "transparent",
              color: filter === f ? "var(--accent-gold)" : "var(--text-muted)",
              border: `1px solid ${filter === f ? "rgba(201,168,76,0.4)" : "var(--border-gold)"}`,
            }}>
            {f === "all" ? `All (${rsvps.length})` : f === "attending" ? `Attending (${attending.length})` : `Not Attending (${notAttending.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CalendarCheck size={40} style={{ color: "var(--border-gold)" }} />
          <p style={{ color: "var(--text-muted)" }}>No RSVPs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl p-5"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {r.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: r.attending ? "rgba(76,175,80,0.12)" : "rgba(201,97,76,0.1)",
                        color: r.attending ? "#4caf50" : "#c9614c",
                      }}>
                      {r.attending ? `✓ Attending · ${r.attendees} guest${r.attendees !== 1 ? "s" : ""}` : "✗ Not Attending"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <Mail size={11} /> {r.email}
                    </span>
                    {r.phone && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Phone size={11} /> {r.phone}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {r.message && (
                    <p className="text-sm mt-2 flex items-start gap-1.5" style={{ color: "var(--text-muted)" }}>
                      <MessageSquare size={12} className="shrink-0 mt-0.5" />
                      {r.message}
                    </p>
                  )}
                </div>
                <button onClick={() => deleteRSVP(r._id)} disabled={deleting === r._id}
                  className="p-1.5 rounded-lg transition-colors hover:opacity-80 shrink-0"
                  style={{ color: "#ff6b6b" }}>
                  {deleting === r._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
