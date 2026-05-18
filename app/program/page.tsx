"use client"

import Image from "next/image"
import Link from "next/link"
import { Printer, ChevronLeft, Flame } from "lucide-react"
import { memorial } from "@/data/memorial"

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function fmtFuneral(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

export default function ProgramPage() {
  const fd = memorial.funeralDetails

  return (
    <>
      {/* ── Screen-only nav bar ── */}
      <nav
        className="no-print sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3"
        style={{
          background: "rgba(26,26,46,0.95)",
          backdropFilter: "blur(16px)",
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

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#c9a84c,#e8c96a)", color: "#1a1a2e" }}
        >
          <Printer size={15} />
          Print Program
        </button>
      </nav>

      {/* ── Program document ── */}
      <div
        id="program"
        className="program-page min-h-screen py-12 px-6"
        style={{ background: "#f9f6ef" }}
      >
        <div className="max-w-2xl mx-auto">

          {/* ── Header ── */}
          <header className="text-center mb-10 pb-8 border-b-2 border-[#c9a84c]">
            <div className="flex justify-center gap-6 mb-6 text-[#c9a84c]">
              <Flame size={22} className="opacity-70" />
              <Flame size={28} />
              <Flame size={22} className="opacity-70" />
            </div>

            <div
              className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-6 border-4"
              style={{ borderColor: "#c9a84c" }}
            >
              <Image
                src={memorial.profilePhoto}
                alt={memorial.shortName}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>

            <p
              className="text-xs uppercase tracking-[3px] mb-3"
              style={{ color: "#9a7a3a", fontFamily: "Georgia, serif" }}
            >
              In Loving Memory of
            </p>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}
            >
              {memorial.fullName}
            </h1>
            <p
              className="text-base"
              style={{ color: "#555", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              {fmt(memorial.dateOfBirth)} — {fmt(memorial.dateOfDeath)}
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: "#9a7a3a", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              &ldquo;{memorial.tagline}&rdquo;
            </p>
          </header>

          {/* ── Funeral details ── */}
          <section className="mb-10">
            <SectionHeading>Funeral Service</SectionHeading>
            {fd ? (
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: "#fff8ee", border: "1px solid #e8c96a" }}
              >
                <p className="text-lg font-semibold mb-1" style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}>
                  {fmtFuneral(fd.date)}
                </p>
                <p className="text-base mb-1" style={{ color: "#555" }}>{fd.time}</p>
                <p className="text-base font-medium mb-0.5" style={{ color: "#1a1a2e" }}>{fd.venue}</p>
                <p className="text-sm" style={{ color: "#777" }}>{fd.address}</p>
                {fd.livestreamUrl && (
                  <p className="text-sm mt-3" style={{ color: "#9a7a3a" }}>
                    Livestream available at: <span style={{ fontFamily: "monospace" }}>{fd.livestreamUrl}</span>
                  </p>
                )}
              </div>
            ) : (
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: "#fff8ee", border: "1px solid #e8c96a" }}
              >
                <p className="text-base italic" style={{ color: "#777", fontFamily: "Georgia, serif" }}>
                  Funeral arrangements will be announced. Please check the memorial website for updates.
                </p>
              </div>
            )}
          </section>

          {/* ── Biography ── */}
          <section className="mb-10">
            <SectionHeading>Biography</SectionHeading>
            <div
              className="prose-program text-sm leading-relaxed space-y-3"
              style={{ color: "#333", fontFamily: "Georgia, serif" }}
              dangerouslySetInnerHTML={{ __html: memorial.biography }}
            />
          </section>

          {/* ── Survived by ── */}
          <section className="mb-10">
            <SectionHeading>Survived By</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {memorial.family.map((m) => (
                <div key={m.name} className="flex items-start gap-3 py-2">
                  <span
                    className="text-xs uppercase tracking-wide mt-0.5 shrink-0 w-24"
                    style={{ color: "#9a7a3a", fontFamily: "Arial, sans-serif" }}
                  >
                    {m.relation}
                  </span>
                  <span className="text-sm" style={{ color: "#1a1a2e", fontFamily: "Georgia, serif" }}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>

            {memorial.grandchildren.length > 0 && (
              <div className="mt-5">
                <p
                  className="text-xs uppercase tracking-wide mb-2"
                  style={{ color: "#9a7a3a", fontFamily: "Arial, sans-serif" }}
                >
                  Grandchildren
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#333", fontFamily: "Georgia, serif" }}>
                  {memorial.grandchildren.join(" · ")}
                </p>
              </div>
            )}
          </section>

          {/* ── Achievements ── */}
          <section className="mb-10">
            <SectionHeading>Life Milestones</SectionHeading>
            <div className="space-y-4">
              {memorial.achievements.map((a) => (
                <div key={a.title} className="flex gap-4">
                  <div className="shrink-0 text-right w-12">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#9a7a3a", fontFamily: "Arial, sans-serif" }}
                    >
                      {a.year}
                    </span>
                  </div>
                  <div style={{ borderLeft: "2px solid #e8c96a", paddingLeft: 16 }}>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#1a1a2e", fontFamily: "Georgia, serif" }}>
                      {a.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Legacy quote ── */}
          <section
            className="text-center py-8 px-6 rounded-2xl mb-10"
            style={{ background: "#1a1a2e", color: "#c9a84c" }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              &ldquo;{memorial.legacyQuote}&rdquo;
            </p>
          </section>

          {/* ── Footer ── */}
          <footer className="text-center pt-6 border-t border-[#c9a84c]">
            <div className="flex justify-center gap-6 mb-4 text-[#c9a84c]">
              <Flame size={16} className="opacity-60" />
              <Flame size={20} />
              <Flame size={16} className="opacity-60" />
            </div>
            <p className="text-xs" style={{ color: "#999", fontFamily: "Arial, sans-serif" }}>
              &copy; {new Date().getFullYear()} Legacy Beyond Time. All rights reserved.
            </p>
            <p className="text-xs mt-1" style={{ color: "#bbb", fontFamily: "Arial, sans-serif" }}>
              Memorial website: {typeof window !== "undefined" ? window.location.origin : ""}
            </p>
          </footer>
        </div>
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .program-page { background: white !important; padding: 0 !important; }
          body { background: white !important; }
          @page { margin: 15mm; size: A4; }
        }
        .prose-program p { margin-bottom: 0.75rem; }
      `}</style>
    </>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2
        className="text-sm font-bold uppercase tracking-[2px]"
        style={{ color: "#9a7a3a", fontFamily: "Arial, sans-serif" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: "#e8c96a" }} />
    </div>
  )
}
