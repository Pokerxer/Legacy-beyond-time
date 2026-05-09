"use client"

import { motion } from "framer-motion"

const TABS = ["Overview", "Gallery", "Achievements", "Tributes", "Funeral"] as const
export type TabId = (typeof TABS)[number]

interface NavigationTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav
      className="sticky top-0 z-30 w-full backdrop-blur-md border-b"
      style={{
        background: "rgba(26,26,46,0.85)",
        borderColor: "var(--border-gold)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2 py-3 min-w-max sm:min-w-0 justify-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? "" : "hover:bg-white/5"
                }`}
                style={{
                  color: isActive ? "#1a1a2e" : "var(--text-muted)",
                  fontFamily: "var(--font-lato)",
                }}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--accent-gold)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
