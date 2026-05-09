"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Images, MessageSquareHeart } from "lucide-react";

// --- Candle SVG with flickering flame ---
function CandleSVG() {
  return (
    <svg
      width="80"
      height="160"
      viewBox="0 0 80 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Glow behind flame */}
      <ellipse cx="40" cy="52" rx="22" ry="28" fill="rgba(201,168,76,0.12)" />

      {/* Flame — flickering via CSS animation */}
      <g className="candle-flame">
        {/* Outer flame */}
        <path
          d="M40 15 C32 28 26 38 28 50 C30 60 35 65 40 65 C45 65 50 60 52 50 C54 38 48 28 40 15Z"
          fill="url(#flameGrad)"
        />
        {/* Inner bright core */}
        <path
          d="M40 32 C37 40 36 47 38 53 C39 57 40.5 59 40 59 C41 57 42 53 42 49 C43 43 42 38 40 32Z"
          fill="rgba(255,245,200,0.9)"
        />
      </g>

      {/* Wick */}
      <line x1="40" y1="65" x2="40" y2="72" stroke="#555" strokeWidth="2" strokeLinecap="round" />

      {/* Candle body */}
      <rect x="24" y="72" width="32" height="72" rx="4" fill="url(#candleGrad)" />

      {/* Wax drip */}
      <path d="M24 82 Q20 90 22 100 L24 100Z" fill="rgba(245,240,232,0.4)" />
      <path d="M56 88 Q60 96 58 106 L56 106Z" fill="rgba(245,240,232,0.3)" />

      {/* Candle top rim */}
      <ellipse cx="40" cy="72" rx="16" ry="4" fill="rgba(245,240,232,0.9)" />

      {/* Candle base */}
      <rect x="18" y="141" width="44" height="8" rx="3" fill="url(#baseGrad)" />
      <rect x="14" y="146" width="52" height="6" rx="3" fill="url(#baseGrad2)" />

      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7a1" />
          <stop offset="40%" stopColor="#f9a825" />
          <stop offset="100%" stopColor="#e65100" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="candleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4c5a9" />
          <stop offset="40%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#b8a88a" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="50%" stopColor="#e8c96a" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
        <linearGradient id="baseGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a07830" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- Floating ember particles ---
const PARTICLES = [
  // Core embers rising from flame
  { left: "44%", delay: "0s", duration: "3.2s", drift: "12px", size: 3 },
  { left: "40%", delay: "0.8s", duration: "2.8s", drift: "-18px", size: 2 },
  { left: "48%", delay: "1.5s", duration: "3.6s", drift: "8px", size: 2.5 },
  { left: "42%", delay: "0.4s", duration: "4s", drift: "-10px", size: 1.5 },
  { left: "46%", delay: "2s", duration: "3s", drift: "20px", size: 1.5 },
  { left: "37%", delay: "1.1s", duration: "3.4s", drift: "-6px", size: 2 },
  { left: "51%", delay: "2.4s", duration: "2.6s", drift: "15px", size: 1.5 },
  // Wandering embers that drift further
  { left: "35%", delay: "0.6s", duration: "4.2s", drift: "-28px", size: 1.2 },
  { left: "53%", delay: "1.8s", duration: "3.8s", drift: "32px", size: 1 },
  { left: "39%", delay: "3s", duration: "4.8s", drift: "-22px", size: 1.8 },
  { left: "50%", delay: "0.3s", duration: "3s", drift: "24px", size: 1 },
  { left: "43%", delay: "2.8s", duration: "4.4s", drift: "-14px", size: 1.3 },
  // Tiny scattered sparkles
  { left: "30%", delay: "1.2s", duration: "5s", drift: "-35px", size: 0.8 },
  { left: "56%", delay: "0.9s", duration: "4.6s", drift: "40px", size: 0.8 },
  { left: "47%", delay: "3.5s", duration: "3.5s", drift: "10px", size: 0.7 },
];

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full"
          style={{
            left: p.left,
            bottom: "calc(50% + 40px)",
            width: p.size,
            height: p.size,
            background: "#c9a84c",
            "--delay": p.delay,
            "--duration": p.duration,
            "--drift": p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Helper to build a fade-up motion prop set
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  };
}

function fadeUpInView(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  };
}

// Pre-computed star positions — static values prevent SSR/client hydration mismatch
const STARS = [
  { w: 1.7, h: 2.9, top: "96.6%", left: "75.9%", opacity: 0.25 },
  { w: 1.8, h: 1.9, top: "18.9%", left: "82.9%", opacity: 0.37 },
  { w: 2.3, h: 1.4, top: "80.8%", left: "82.1%", opacity: 0.71 },
  { w: 1.7, h: 2.9, top: "14.6%", left: "73.7%", opacity: 0.47 },
  { w: 1.4, h: 1.9, top: "22.2%", left: "1.5%",  opacity: 0.50 },
  { w: 2.7, h: 2.4, top: "42.0%", left: "6.9%",  opacity: 0.48 },
  { w: 3.0, h: 2.0, top: "94.3%", left: "35.1%", opacity: 0.70 },
  { w: 2.7, h: 1.5, top: "97.4%", left: "95.3%", opacity: 0.74 },
  { w: 2.4, h: 1.8, top: "52.3%", left: "26.8%", opacity: 0.75 },
  { w: 1.8, h: 2.3, top: "53.6%", left: "78.9%", opacity: 0.59 },
  { w: 1.9, h: 2.0, top: "50.9%", left: "99.7%", opacity: 0.65 },
  { w: 2.7, h: 3.0, top: "11.8%", left: "28.6%", opacity: 0.74 },
  { w: 2.1, h: 1.1, top: "88.0%", left: "62.8%", opacity: 0.56 },
  { w: 2.0, h: 2.2, top: "10.2%", left: "37.5%", opacity: 0.69 },
  { w: 2.4, h: 1.0, top: "66.7%", left: "44.3%", opacity: 0.24 },
  { w: 1.3, h: 1.2, top: "42.4%", left: "18.9%", opacity: 0.33 },
  { w: 1.5, h: 2.8, top: "51.2%", left: "51.4%", opacity: 0.31 },
  { w: 2.6, h: 2.2, top: "64.8%", left: "76.9%", opacity: 0.60 },
  { w: 2.6, h: 2.4, top: "38.9%", left: "94.8%", opacity: 0.47 },
  { w: 1.3, h: 1.7, top: "20.9%", left: "68.8%", opacity: 0.72 },
  { w: 2.4, h: 2.0, top: "28.2%", left: "53.4%", opacity: 0.27 },
  { w: 1.0, h: 1.5, top: "40.2%", left: "10.2%", opacity: 0.53 },
  { w: 2.7, h: 1.0, top: "27.8%", left: "31.8%", opacity: 0.30 },
  { w: 2.9, h: 2.0, top: "12.3%", left: "62.9%", opacity: 0.73 },
  { w: 2.8, h: 1.4, top: "33.4%", left: "32.3%", opacity: 0.53 },
  { w: 2.5, h: 1.6, top: "90.3%", left: "87.6%", opacity: 0.50 },
  { w: 2.4, h: 1.6, top: "32.7%", left: "67.5%", opacity: 0.79 },
  { w: 1.0, h: 1.5, top: "13.8%", left: "64.3%", opacity: 0.70 },
  { w: 1.4, h: 1.7, top: "61.3%", left: "83.4%", opacity: 0.79 },
  { w: 1.5, h: 2.6, top: "3.7%",  left: "97.6%", opacity: 0.73 },
  { w: 1.6, h: 2.5, top: "23.4%", left: "69.6%", opacity: 0.37 },
  { w: 2.3, h: 3.0, top: "8.4%",  left: "70.8%", opacity: 0.77 },
  { w: 1.5, h: 1.1, top: "12.4%", left: "27.2%", opacity: 0.56 },
  { w: 2.1, h: 2.1, top: "40.2%", left: "16.6%", opacity: 0.36 },
  { w: 1.0, h: 1.4, top: "86.5%", left: "22.5%", opacity: 0.42 },
  { w: 2.7, h: 1.9, top: "15.9%", left: "49.7%", opacity: 0.50 },
  { w: 1.9, h: 1.6, top: "92.5%", left: "8.5%",  opacity: 0.71 },
  { w: 1.7, h: 1.3, top: "78.2%", left: "47.0%", opacity: 0.70 },
  { w: 2.8, h: 2.8, top: "11.8%", left: "8.9%",  opacity: 0.56 },
  { w: 3.0, h: 2.4, top: "69.6%", left: "92.6%", opacity: 0.75 },
  { w: 2.7, h: 1.5, top: "74.2%", left: "55.9%", opacity: 0.43 },
  { w: 2.2, h: 1.7, top: "19.7%", left: "35.6%", opacity: 0.63 },
  { w: 1.4, h: 3.0, top: "73.3%", left: "0.1%",  opacity: 0.64 },
  { w: 1.3, h: 1.7, top: "57.7%", left: "55.0%", opacity: 0.42 },
  { w: 2.4, h: 1.3, top: "82.3%", left: "55.7%", opacity: 0.78 },
  { w: 1.8, h: 2.8, top: "92.7%", left: "64.9%", opacity: 0.26 },
  { w: 1.4, h: 1.2, top: "85.3%", left: "27.7%", opacity: 0.31 },
  { w: 2.4, h: 1.4, top: "54.2%", left: "52.2%", opacity: 0.69 },
  { w: 2.9, h: 2.4, top: "79.9%", left: "82.9%", opacity: 0.32 },
  { w: 3.0, h: 1.4, top: "23.2%", left: "48.9%", opacity: 0.46 },
  { w: 2.6, h: 1.4, top: "65.9%", left: "67.9%", opacity: 0.50 },
  { w: 2.1, h: 2.8, top: "62.0%", left: "2.2%",  opacity: 0.66 },
  { w: 1.5, h: 1.5, top: "96.2%", left: "31.3%", opacity: 0.58 },
  { w: 2.0, h: 1.4, top: "45.2%", left: "58.3%", opacity: 0.61 },
  { w: 1.7, h: 2.8, top: "48.7%", left: "49.3%", opacity: 0.68 },
  { w: 1.6, h: 1.7, top: "95.4%", left: "36.5%", opacity: 0.74 },
  { w: 2.8, h: 2.9, top: "93.3%", left: "6.5%",  opacity: 0.28 },
  { w: 1.2, h: 1.1, top: "75.2%", left: "12.7%", opacity: 0.62 },
  { w: 1.7, h: 1.8, top: "54.4%", left: "95.4%", opacity: 0.53 },
  { w: 2.4, h: 1.1, top: "96.7%", left: "71.3%", opacity: 0.66 },
  { w: 2.2, h: 1.3, top: "62.0%", left: "67.5%", opacity: 0.60 },
];

const steps = [
  {
    icon: Heart,
    label: "Create Tribute",
    description:
      "Families add the life story, achievements, and funeral details to build a lasting memorial.",
  },
  {
    icon: Images,
    label: "Share Photos",
    description:
      "Upload cherished moments to the gallery — a beautiful masonry of memories.",
  },
  {
    icon: MessageSquareHeart,
    label: "Leave Messages",
    description:
      "Friends and loved ones submit personal tributes sharing how the person touched their lives.",
  },
];

export default function LandingPage() {
  return (
    <main
      className="relative flex flex-col min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1f 100%)" }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
        style={{ background: "var(--accent-gold)", color: "#1a1a2e" }}
      >
        Skip to main content
      </a>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(15,15,31,0.5) 100%)",
        }}
      />

      {/* Subtle star-field background — static positions to avoid hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {STARS.slice(0, 20).map((s, i) => (
          <span
            key={i}
            className="star absolute rounded-full"
            style={{
              width: s.w,
              height: s.h,
              top: s.top,
              left: s.left,
              background: "rgba(245,240,232,0.4)",
              "--star-opacity": s.opacity,
              "--star-delay": `${(i * 0.4) % 3.8}s`,
            } as React.CSSProperties}
          />
        ))}
        <div className="hidden sm:contents">
          {STARS.slice(20).map((s, i) => (
            <span
              key={i + 20}
              className="star absolute rounded-full"
              style={{
                width: s.w,
                height: s.h,
                top: s.top,
                left: s.left,
                background: "rgba(245,240,232,0.4)",
                "--star-opacity": s.opacity,
                "--star-delay": `${((i + 20) * 0.3) % 4.2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        id="main-content"
        className="relative flex flex-col items-center justify-center flex-1 px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center"
      >
        <Particles />

        {/* Candle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="relative mb-6 sm:mb-8 scale-[0.65] sm:scale-100 origin-bottom"
        >
          <CandleSVG />
          {/* Pulsing golden aura */}
          <div
            className="glow-breathe absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
            style={{
              width: 100,
              height: 32,
              background: "radial-gradient(ellipse, rgba(201,168,76,0.35) 0%, transparent 70%)",
            }}
          />
          {/* Outer halo ring */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-xl pointer-events-none"
            style={{
              width: 140,
              height: 40,
              background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 60%)",
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" as const }}
            className="inline-block"
          >
            Forever{" "}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" as const }}
            className="inline-block"
            style={{ color: "var(--accent-gold)" }}
          >
            Remembered
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.24)}
          className="max-w-xl text-lg sm:text-xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
        >
          A place to honor, remember, and celebrate a life well lived.
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeUp(0.36)}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
        >
          <Link
            href="/memorial/christiana-opara"
            className="glow-btn inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
              color: "#1a1a2e",
              fontFamily: "var(--font-lato)",
              focusRingColor: "var(--accent-gold)",
            } as React.CSSProperties}
            aria-label="View the memorial for Christiana Opara"
          >
            <Heart size={18} aria-hidden="true" />
            View Memorial
          </Link>

          <span
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
          >
            — In loving memory of Christiana O. Opara
          </span>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          {...fadeUp(0.48)}
          className="mt-10 sm:mt-14 flex items-center gap-3 w-full max-w-[260px] sm:max-w-xs"
        >
          <div className="flex-1 h-px" style={{ background: "var(--border-gold)" }} />
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span style={{ color: "var(--accent-gold)", fontSize: 6 }}>✦</span>
            <span style={{ color: "var(--accent-gold)", fontSize: 14 }}>✦</span>
            <span style={{ color: "var(--accent-gold)", fontSize: 6 }}>✦</span>
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border-gold)" }} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="scroll-hint mt-6 flex flex-col items-center gap-1"
        >
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
          >
            Scroll
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 2v8M3 7l4 4 4-4"
              stroke="var(--text-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative px-6 py-14 sm:py-20"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            {...fadeUpInView(0)}
            id="how-it-works-heading"
            className="text-center text-2xl sm:text-3xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            A Tribute in Three Steps
          </motion.h2>

          <motion.p
            {...fadeUpInView(0.12)}
            className="text-center text-sm sm:text-base mb-10 sm:mb-14 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            Creating a lasting memorial is simple, meaningful, and free.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.label}
                  {...fadeUpInView(0.12 + i * 0.12)}
                    className="relative rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-gold)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  {/* Step number */}
                  <span
                    className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold"
                    style={{
                      background: "var(--accent-gold)",
                      color: "#1a1a2e",
                      fontFamily: "var(--font-lato)",
                    }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>

                  {/* Icon */}
                  <div
                    className="mb-4 sm:mb-5 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.12)" }}
                  >
                    <Icon size={26} style={{ color: "var(--accent-gold)" }} aria-hidden="true" />
                  </div>

                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                  >
                    {step.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
                  >
                    {step.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="flex flex-col items-center gap-3 py-8 sm:py-10 px-6 text-center"
        style={{ borderTop: "1px solid var(--border-gold)" }}
      >
        <div className="flex items-center gap-3">
          {/* Small inline candle */}
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
            In Loving Memory of Christiana O. Opara
          </span>
        </div>
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
        >
          &copy; {new Date().getFullYear()} Forever Remembered. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
