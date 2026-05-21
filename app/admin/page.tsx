"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  MessageSquareHeart,
  Heart,
  Image as ImageIcon,
  HandHeart,
  CalendarCheck,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

interface StatCard {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
  href: string
  loading?: boolean
}

interface RecentItem {
  id: string
  name: string
  type: "tribute" | "condolence" | "donation" | "rsvp" | "candle"
  detail: string
  time: string
  approved?: boolean
}

const TYPE_META: Record<RecentItem["type"], { label: string; color: string; href: string }> = {
  tribute:    { label: "Tribute",    color: "#c9a84c", href: "/admin/tributes" },
  condolence: { label: "Condolence", color: "#7c5cbf", href: "/admin/condolence" },
  donation:   { label: "Donation",   color: "#4caf93", href: "/admin/donations" },
  rsvp:       { label: "RSVP",       color: "#5ba4d4", href: "/admin/rsvp" },
  candle:     { label: "Candle",     color: "#f9a825", href: "/admin/candles" },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function AdminDashboard() {
  const { data: session } = useSession()

  const [stats, setStats] = useState({
    tributes: 0, condolences: 0, pending: 0,
    gallery: 0, donations: 0, rsvps: 0,
    rsvpAttending: 0, candles: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    const fetches = [
      fetch("/api/tributes?category=tribute").then(r => r.json()).catch(() => []),
      fetch("/api/tributes?category=condolence").then(r => r.json()).catch(() => []),
      fetch("/api/gallery").then(r => r.json()).catch(() => []),
      fetch("/api/donations").then(r => r.json()).catch(() => []),
      fetch("/api/rsvp").then(r => r.json()).catch(() => []),
      fetch("/api/candles").then(r => r.json()).catch(() => []),
    ]

    Promise.all(fetches).then(([tributes, condolences, gallery, donations, rsvps, candles]) => {
      const tArr = Array.isArray(tributes) ? tributes : []
      const cArr = Array.isArray(condolences) ? condolences : []
      const gArr = Array.isArray(gallery) ? gallery : []
      const dArr = Array.isArray(donations) ? donations : []
      const rArr = Array.isArray(rsvps) ? rsvps : []
      const kArr = Array.isArray(candles) ? candles : []

      setStats({
        tributes:      tArr.length,
        condolences:   cArr.length,
        pending:       [...tArr, ...cArr].filter((t: { isApproved: boolean }) => !t.isApproved).length,
        gallery:       gArr.length,
        donations:     dArr.length,
        rsvps:         rArr.length,
        rsvpAttending: rArr.filter((r: { attending: boolean }) => r.attending).length,
        candles:       kArr.length,
      })

      // Build recent activity from all sources (latest 8)
      const items: RecentItem[] = [
        ...tArr.slice(0, 5).map((t: { _id: string; authorName: string; relationship: string; isApproved: boolean; createdAt: string }) => ({
          id: t._id, name: t.authorName, type: "tribute" as const,
          detail: t.relationship, time: t.createdAt, approved: t.isApproved,
        })),
        ...cArr.slice(0, 5).map((t: { _id: string; authorName: string; location: string; isApproved: boolean; createdAt: string }) => ({
          id: t._id, name: t.authorName, type: "condolence" as const,
          detail: t.location || "", time: t.createdAt, approved: t.isApproved,
        })),
        ...dArr.slice(0, 3).map((d: { _id: string; donorName: string; amount: string; currency: string; isAnonymous: boolean; createdAt: string }) => ({
          id: d._id, name: d.isAnonymous ? "Anonymous" : d.donorName, type: "donation" as const,
          detail: d.amount ? `${d.amount} ${d.currency}` : "No amount specified",
          time: d.createdAt,
        })),
        ...rArr.slice(0, 3).map((r: { _id: string; name: string; attending: boolean; attendees: number; createdAt: string }) => ({
          id: r._id, name: r.name, type: "rsvp" as const,
          detail: r.attending ? `Attending · ${r.attendees} person${r.attendees !== 1 ? "s" : ""}` : "Not attending",
          time: r.createdAt,
        })),
        ...kArr.slice(0, 3).map((c: { _id: string; name: string; message: string; createdAt: string }) => ({
          id: c._id, name: c.name, type: "candle" as const,
          detail: c.message || "No message",
          time: c.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 8)

      setRecent(items)
      setStatsLoading(false)
      setRecentLoading(false)
    })
  }, [])

  const statCards: StatCard[] = [
    { label: "Tributes",    value: stats.tributes,    icon: MessageSquareHeart, color: "#c9a84c", href: "/admin/tributes" },
    { label: "Condolences", value: stats.condolences, icon: Heart,              color: "#7c5cbf", href: "/admin/condolence" },
    { label: "Pending",     value: stats.pending,     icon: XCircle,            color: "#ff9800", href: "/admin/tributes" },
    { label: "Gallery",     value: stats.gallery,     icon: ImageIcon,          color: "#5ba4d4", href: "/admin/gallery" },
    { label: "Donations",   value: stats.donations,   icon: HandHeart,          color: "#4caf93", href: "/admin/donations" },
    { label: "RSVPs",       value: `${stats.rsvpAttending} / ${stats.rsvps}`, icon: CalendarCheck, color: "#5ba4d4", href: "/admin/rsvp" },
    { label: "Candles Lit", value: stats.candles,     icon: Flame,              color: "#f9a825", href: "/admin/candles" },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Here&apos;s an overview of the memorial activity.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={s.href}
                className="block rounded-2xl p-5 transition-all hover:opacity-90 group"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `${s.color}18` }}
                  >
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                </div>
                {statsLoading ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-muted)" }} />
                ) : (
                  <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                  >
                    {s.value}
                  </span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-base font-semibold flex items-center gap-2"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              <Clock size={16} style={{ color: "var(--accent-gold)" }} />
              Recent Activity
            </h2>
          </div>

          {recentLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={22} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>
              No activity yet. Share the memorial link to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => {
                const meta = TYPE_META[item.type]
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={meta.href}
                    className="flex items-start gap-3 rounded-xl p-3 transition-all hover:opacity-80"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${meta.color}18` }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: meta.color }}>
                        {meta.label[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {item.name}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${meta.color}18`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {item.approved === false && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(255,152,0,0.12)", color: "#ff9800" }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                          {item.detail}
                        </p>
                      )}
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                      {timeAgo(item.time)}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
        >
          <h2
            className="text-base font-semibold mb-5"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Quick Links
          </h2>
          <div className="space-y-2">
            {[
              { label: "Manage Tributes",    href: "/admin/tributes",   icon: MessageSquareHeart, color: "#c9a84c" },
              { label: "Manage Condolences", href: "/admin/condolence", icon: Heart,              color: "#7c5cbf" },
              { label: "Gallery Uploads",    href: "/admin/gallery",    icon: ImageIcon,          color: "#5ba4d4" },
              { label: "Donation Records",   href: "/admin/donations",  icon: HandHeart,          color: "#4caf93" },
              { label: "RSVP Responses",     href: "/admin/rsvp",       icon: CalendarCheck,      color: "#5ba4d4" },
              { label: "Candle Wall",        href: "/admin/candles",    icon: Flame,              color: "#f9a825" },
              { label: "View Memorial →",    href: "/memorial/christiana-opara", icon: ArrowRight, color: "var(--accent-gold)" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:opacity-80 group"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <Icon size={15} style={{ color: item.color }} />
                  <span style={{ color: "var(--text-primary)" }}>{item.label}</span>
                  <ArrowRight size={13} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "var(--text-muted)" }} />
                </Link>
              )
            })}
          </div>

          {/* Pending alert */}
          {!statsLoading && stats.pending > 0 && (
            <div
              className="mt-4 rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(255,152,0,0.08)", border: "1px solid rgba(255,152,0,0.25)" }}
            >
              <XCircle size={16} style={{ color: "#ff9800" }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#ff9800" }}>
                  {stats.pending} pending approval
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Review in Tributes or Condolences
                </p>
              </div>
            </div>
          )}

          {!statsLoading && stats.pending === 0 && (
            <div
              className="mt-4 rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)" }}
            >
              <CheckCircle size={16} style={{ color: "#4caf50" }} />
              <p className="text-xs font-medium" style={{ color: "#4caf50" }}>
                All submissions approved
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
