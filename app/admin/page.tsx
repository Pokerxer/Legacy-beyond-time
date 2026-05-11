"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquareHeart, Image as ImageIcon, CheckCircle, XCircle, HandHeart } from "lucide-react"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ tributes: 0, approved: 0, pending: 0, donations: 0 })

  useEffect(() => {
    fetch("/api/tributes")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          tributes: data.length,
          approved: data.filter((t: { isApproved: boolean }) => t.isApproved).length,
          pending: data.filter((t: { isApproved: boolean }) => !t.isApproved).length,
          donations: 0,
        })
      })
      .catch(() => {})

    fetch("/api/donations")
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, donations: data.length })))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Manage tributes, donations, gallery, and memorial content.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Tributes", value: stats.tributes, icon: MessageSquareHeart, color: "#c9a84c" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "#4caf50" },
          { label: "Pending", value: stats.pending, icon: XCircle, color: "#ff9800" },
          { label: "Donations", value: stats.donations, icon: HandHeart, color: "#c9a84c" },
          { label: "Gallery", value: "33", icon: ImageIcon, color: "#c9a84c" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-4"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </span>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-6"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)" }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Quick Actions
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Use the sidebar to manage tributes (approve/delete), donations, and gallery uploads.
        </p>
      </motion.div>
    </div>
  )
}
