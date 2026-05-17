"use client"

import { useState, useEffect, useRef } from "react"
import { use } from "react"
import { motion } from "framer-motion"
import { memorial } from "@/data/memorial"
import type { Tribute } from "@/types"
import HeroSection from "@/components/memorial/HeroSection"
import NavigationTabs from "@/components/memorial/NavigationTabs"
import BiographySection from "@/components/memorial/BiographySection"
import LegacyBanner from "@/components/memorial/LegacyBanner"
import RemembranceSlideshow from "@/components/landing/RemembranceSlideshow"
import BackgroundMusic from "@/components/landing/BackgroundMusic"
import AchievementsTimeline from "@/components/memorial/AchievementsTimeline"
import FamilySection from "@/components/memorial/FamilySection"
import TributesWall from "@/components/memorial/TributesWall"
import TributeModal from "@/components/memorial/TributeModal"
import FuneralInfo from "@/components/memorial/FuneralInfo"
import CandleWall from "@/components/memorial/CandleWall"
import type { TabId } from "@/components/memorial/NavigationTabs"

const SECTION_IDS = ["overview", "gallery", "achievements", "tributes", "funeral"] as const

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-2" aria-hidden="true">
      <span style={{ color: "var(--border-gold)", fontSize: 6 }}>✦</span>
      <span style={{ color: "var(--border-gold)", fontSize: 10 }}>✦</span>
      <span style={{ color: "var(--border-gold)", fontSize: 6 }}>✦</span>
    </div>
  )
}

export default function MemorialPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [activeTab, setActiveTab] = useState<TabId>("Overview")
  const [tributeModalOpen, setTributeModalOpen] = useState(false)
  const [tributes, setTributes] = useState<Tribute[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  const data = memorial

  const fetchTributes = () => {
    fetch("/api/tributes?category=tribute")
      .then((res) => res.json())
      .then((data) => setTributes(data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchTributes()
  }, [])

  // IntersectionObserver to auto-highlight active tab on scroll
  useEffect(() => {
    const sectionMap: Record<string, TabId> = {
      overview: "Overview",
      gallery: "Gallery",
      achievements: "Achievements",
      tributes: "Tributes",
      funeral: "Funeral",
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (sectionMap[id]) {
              setActiveTab(sectionMap[id])
            }
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    )

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    for (const el of elements) {
      if (el) observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollToSection = (tab: TabId) => {
    const id = tab.toLowerCase()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen"
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1f 100%)",
      }}
    >
      <HeroSection
        fullName={data.fullName}
        shortName={data.shortName}
        dateOfBirth={data.dateOfBirth}
        dateOfDeath={data.dateOfDeath}
        tagline={data.tagline}
        coverPhoto={data.coverPhoto}
        profilePhoto={data.profilePhoto}
      />

      <NavigationTabs activeTab={activeTab} onTabChange={scrollToSection} />

      <BiographySection biography={data.biography} />

      <SectionDivider />

      <LegacyBanner quote={data.legacyQuote} />

      <SectionDivider />

      <section id="gallery">
        <RemembranceSlideshow />
      </section>

      <AchievementsTimeline achievements={data.achievements} />

      <SectionDivider />

      <FamilySection family={data.family} grandchildren={data.grandchildren} />

      <TributesWall tributes={tributes} onOpenModal={() => setTributeModalOpen(true)} />

      <SectionDivider />

      <CandleWall />

      <SectionDivider />

      <section id="funeral">
        <FuneralInfo details={data.funeralDetails} />
      </section>

      <TributeModal open={tributeModalOpen} onClose={() => setTributeModalOpen(false)} onSuccess={fetchTributes} />

      <BackgroundMusic />

      {/* Footer */}
      <footer
        className="flex flex-col items-center gap-3 py-10 px-6 text-center"
        style={{ borderTop: "1px solid var(--border-gold)" }}
      >
        <div className="flex items-center gap-3">
          <svg width="18" height="36" viewBox="0 0 18 36" fill="none" aria-hidden="true">
            <g className="candle-flame" style={{ transformOrigin: "9px 10px" }}>
              <path
                d="M9 2 C6 7 4 11 5 15 C6 18 7.5 19 9 19 C10.5 19 12 18 13 15 C14 11 12 7 9 2Z"
                fill="url(#fFlame)"
              />
            </g>
            <rect x="5" y="19" width="8" height="14" rx="1.5" fill="url(#fCandle)" />
            <rect x="3" y="32" width="12" height="3" rx="1.5" fill="#c9a84c" />
            <defs>
              <radialGradient id="fFlame" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#fff7a1" />
                <stop offset="50%" stopColor="#f9a825" />
                <stop offset="100%" stopColor="#e65100" stopOpacity="0.5" />
              </radialGradient>
              <linearGradient id="fCandle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d4c5a9" />
                <stop offset="50%" stopColor="#f5f0e8" />
                <stop offset="100%" stopColor="#b8a88a" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            In Loving Memory of {data.shortName}
          </span>
        </div>
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
        >
          &copy; {new Date().getFullYear()} Legacy Beyond Time. All rights reserved.
        </p>
      </footer>
    </motion.main>
  )
}
