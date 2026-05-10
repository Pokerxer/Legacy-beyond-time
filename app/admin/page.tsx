"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { MessageSquareHeart, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Manage tributes, gallery, and memorial content.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tributes", value: "—", icon: MessageSquareHeart, color: "#c9a84c" },
          { label: "Approved", value: "—", icon: CheckCircle, color: "#4caf50" },
          { label: "Pending", value: "—", icon: XCircle, color: "#ff9800" },
          { label: "Gallery Images", value: "33", icon: ImageIcon, color: "#c9a84c" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
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
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-gold)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Quick Actions
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Use the sidebar to manage tributes (approve/delete) and gallery uploads.
          MongoDB must be connected for live data — stats will populate once the database URI is configured.
        </p>
      </motion.div>
    </div>
  )
}
