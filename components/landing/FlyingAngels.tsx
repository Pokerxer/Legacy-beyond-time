"use client"

// ─── Flight path assignments ───────────────────────────────────────────────
// path    : CSS keyframe name (afp1–afp8)
// dur     : full trip duration in seconds
// offset  : negative animation-delay so angel is already mid-flight on load
// size    : SVG width in px
// opacity : max opacity at peak visibility
// flip    : scaleX(-1) on the SVG (RTL paths look better with angel facing left)
// flap    : wing-beat period in seconds
// fd      : flap animation-delay offset
const ANGELS = [
  // ── Far background — small, very slow, barely visible ─────────────────
  { path:"afp1", dur:58, offset:12, size:20, opacity:0.14, flip:false, flap:2.3, fd:0.0 },
  { path:"afp8", dur:64, offset:30, size:18, opacity:0.12, flip:true,  flap:2.5, fd:0.5 },
  { path:"afp3", dur:60, offset:44, size:22, opacity:0.15, flip:false, flap:2.1, fd:0.9 },
  { path:"afp6", dur:66, offset:8,  size:19, opacity:0.13, flip:true,  flap:2.4, fd:1.2 },

  // ── Mid distance — medium, moderate pace ──────────────────────────────
  { path:"afp2", dur:42, offset:6,  size:34, opacity:0.20, flip:false, flap:1.9, fd:0.1 },
  { path:"afp5", dur:46, offset:20, size:30, opacity:0.19, flip:true,  flap:2.0, fd:0.6 },
  { path:"afp4", dur:44, offset:35, size:32, opacity:0.20, flip:false, flap:1.8, fd:0.3 },
  { path:"afp7", dur:48, offset:52, size:28, opacity:0.18, flip:true,  flap:2.1, fd:0.8 },

  // ── Close foreground — large, faster, clearly visible ─────────────────
  { path:"afp3", dur:26, offset:4,  size:54, opacity:0.27, flip:false, flap:1.4, fd:0.0 },
  { path:"afp6", dur:30, offset:15, size:50, opacity:0.25, flip:true,  flap:1.5, fd:0.4 },
  { path:"afp1", dur:28, offset:22, size:52, opacity:0.26, flip:false, flap:1.3, fd:0.2 },
  { path:"afp7", dur:32, offset:10, size:46, opacity:0.23, flip:true,  flap:1.6, fd:0.7 },
  { path:"afp2", dur:27, offset:18, size:48, opacity:0.24, flip:false, flap:1.4, fd:0.5 },
  { path:"afp5", dur:29, offset:38, size:44, opacity:0.22, flip:true,  flap:1.7, fd:0.9 },
] as const

// ─── Detailed realistic angel SVG ─────────────────────────────────────────
function AngelSVG({ size, id }: { size: number; id: string }) {
  // Unique gradient IDs per instance to avoid SVG namespace collisions
  const wG = `wG${id}`, rG = `rG${id}`, sG = `sG${id}`
  const hG = `hG${id}`, gF = `gF${id}`

  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 100 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={wG} x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%"   stopColor="#fffcf0" stopOpacity="0.92" />
          <stop offset="55%"  stopColor="#f5eecf" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.50" />
        </linearGradient>
        <linearGradient id={rG} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#fff9ee" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#e8dfc0" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id={sG} cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#fde8c8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d4a67a" stopOpacity="0.80" />
        </radialGradient>
        <radialGradient id={hG} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff7a0" stopOpacity="0.85" />
          <stop offset="50%"  stopColor="#c9a84c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"    />
        </radialGradient>
        <filter id={gF} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Ambient aura */}
      <ellipse cx="50" cy="72" rx="44" ry="60"
        fill="rgba(201,168,76,0.06)" filter={`url(#${gF})`} />

      {/* ══ LEFT WING ══ */}
      <g className="wing-left">
        <path d="M48 60 C38 50 22 36 10 20 C4 10 6 2 14 5 C22 8 32 22 42 44 C44 50 46 55 48 60Z"
          fill={`url(#${wG})`} />
        <path d="M48 60 C40 54 28 46 18 40 C12 36 10 28 14 26 C20 24 30 32 42 50Z"
          fill="rgba(255,252,240,0.45)" />
        <path d="M48 60 C44 56 38 54 34 56 C30 58 28 54 32 50 C37 44 43 50 48 60Z"
          fill="rgba(255,252,240,0.55)" />
        <path d="M48 60 C38 46 26 30 12 16" stroke="rgba(245,238,210,0.55)" strokeWidth="0.7" fill="none" />
        <path d="M47 63 C36 49 22 34  9 22" stroke="rgba(245,238,210,0.45)" strokeWidth="0.6" fill="none" />
        <path d="M46 66 C36 54 24 42 14 34" stroke="rgba(245,238,210,0.38)" strokeWidth="0.5" fill="none" />
        <path d="M45 68 C37 58 28 50 20 44" stroke="rgba(245,238,210,0.30)" strokeWidth="0.5" fill="none" />
        <path d="M14 5 C18 3 24 6 28 12" stroke="rgba(201,168,76,0.55)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M48 60 C40 52 30 40 20 28 C14 20 10 12 12 8"
          stroke="rgba(255,250,220,0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* ══ RIGHT WING ══ */}
      <g className="wing-right">
        <path d="M52 60 C62 50 78 36 90 20 C96 10 94 2 86 5 C78 8 68 22 58 44 C56 50 54 55 52 60Z"
          fill={`url(#${wG})`} />
        <path d="M52 60 C60 54 72 46 82 40 C88 36 90 28 86 26 C80 24 70 32 58 50Z"
          fill="rgba(255,252,240,0.45)" />
        <path d="M52 60 C56 56 62 54 66 56 C70 58 72 54 68 50 C63 44 57 50 52 60Z"
          fill="rgba(255,252,240,0.55)" />
        <path d="M52 60 C62 46 74 30 88 16" stroke="rgba(245,238,210,0.55)" strokeWidth="0.7" fill="none" />
        <path d="M53 63 C64 49 78 34 91 22" stroke="rgba(245,238,210,0.45)" strokeWidth="0.6" fill="none" />
        <path d="M54 66 C64 54 76 42 86 34" stroke="rgba(245,238,210,0.38)" strokeWidth="0.5" fill="none" />
        <path d="M55 68 C63 58 72 50 80 44" stroke="rgba(245,238,210,0.30)" strokeWidth="0.5" fill="none" />
        <path d="M86 5 C82 3 76 6 72 12" stroke="rgba(201,168,76,0.55)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M52 60 C60 52 70 40 80 28 C86 20 90 12 88 8"
          stroke="rgba(255,250,220,0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* ══ ROBE ══ */}
      <path d="M40 76 C34 90 30 108 33 124 C36 136 50 141 64 136 C72 131 70 114 66 98 C62 84 58 76 58 76Z"
        fill={`url(#${rG})`} />
      <path d="M43 78 C41 93 40 110 42 124" stroke="rgba(215,205,180,0.40)" strokeWidth="0.8" fill="none" />
      <path d="M50 77 C50 93 49 110 50 124" stroke="rgba(215,205,180,0.35)" strokeWidth="0.8" fill="none" />
      <path d="M57 78 C59 93 60 110 58 124" stroke="rgba(215,205,180,0.40)" strokeWidth="0.8" fill="none" />
      <path d="M33 124 C40 138 60 141 67 136" stroke="rgba(201,168,76,0.35)" strokeWidth="1.0" fill="none" strokeLinecap="round" />
      {/* Gold sash */}
      <path d="M37 94 C44 91 56 91 63 94" stroke="rgba(201,168,76,0.60)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M37 94 C44 91 56 91 63 94" stroke="rgba(255,240,160,0.25)" strokeWidth="0.6" fill="none" strokeLinecap="round" />

      {/* ══ ARMS ══ */}
      <path d="M42 78 C35 74 24 72 18 76" stroke={`url(#${sG})`} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <circle cx="18" cy="76" r="3.5" fill="#fde8c8" fillOpacity="0.88" />
      <path d="M16 74 L15 72 M18 73 L18 71 M20 74 L21 72"
        stroke="rgba(180,130,80,0.4)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M58 78 C65 74 76 72 82 76" stroke={`url(#${sG})`} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <circle cx="82" cy="76" r="3.5" fill="#fde8c8" fillOpacity="0.88" />
      <path d="M80 74 L79 72 M82 73 L82 71 M84 74 L85 72"
        stroke="rgba(180,130,80,0.4)" strokeWidth="0.6" strokeLinecap="round" />

      {/* ══ NECK ══ */}
      <path d="M46 64 C46 70 54 70 54 64" fill="#fde8c8" fillOpacity="0.90" />

      {/* ══ HEAD ══ */}
      <circle cx="50" cy="52" r="13" fill={`url(#${sG})`} />

      {/* Hair */}
      <path d="M40 46 C38 38 40 31 46 30 C52 29 58 31 60 36 C62 40 62 45 60 48"
        fill="rgba(160,110,50,0.65)" />
      <path d="M38 50 C34 55 33 62 35 70 C37 76 40 78 42 78" fill="rgba(150,100,45,0.45)" />
      <path d="M43 31 C47 29 53 30 57 34"
        stroke="rgba(220,180,100,0.50)" strokeWidth="1.0" fill="none" strokeLinecap="round" />

      {/* Serene face */}
      <path d="M44 50 C46 48.5 48.5 49 48.5 50" stroke="rgba(90,55,25,0.65)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M51.5 50 C51.5 49 54 48.5 56 50" stroke="rgba(90,55,25,0.65)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M44.5 49.5 L43.5 48.2 M46 48.7 L45.8 47.5 M47.5 48.9 L47.8 47.6"
        stroke="rgba(90,55,25,0.40)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M55.5 49.5 L56.5 48.2 M54 48.7 L54.2 47.5 M52.5 48.9 L52.2 47.6"
        stroke="rgba(90,55,25,0.40)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M49 54 C49.5 56 50.5 56 51 54" stroke="rgba(180,120,80,0.35)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M46 58 C48 60 52 60 54 58" stroke="rgba(180,110,80,0.55)" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ══ HALO ══ */}
      <g className="angel-halo">
        <ellipse cx="50" cy="37" rx="18" ry="5.5" fill={`url(#${hG})`} />
        <ellipse cx="50" cy="37" rx="13" ry="3.8" fill="none" stroke="rgba(201,168,76,0.85)" strokeWidth="1.6" />
        <ellipse cx="50" cy="37" rx="9"  ry="2.4" fill="rgba(255,246,170,0.50)" />
        <path d="M40 36 C44 33 56 33 60 36" stroke="rgba(255,252,200,0.60)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        {([0,45,90,135,180,225,270,315] as const).map((deg, i) => {
          const r = (deg * Math.PI) / 180
          return (
            <line key={i}
              x1={50 + Math.cos(r)*14} y1={37 + Math.sin(r)*4.2}
              x2={50 + Math.cos(r)*20} y2={37 + Math.sin(r)*6.0}
              stroke="rgba(201,168,76,0.45)" strokeWidth="0.9" strokeLinecap="round"
            />
          )
        })}
      </g>
    </svg>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FlyingAngels() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {ANGELS.map((cfg, i) => (
        <div
          key={i}
          className="angel-fly"
          style={{
            animationName: cfg.path,
            animationDuration: `${cfg.dur}s`,
            // Negative delay = angel is already mid-flight when page loads
            animationDelay: `-${cfg.offset}s`,
            "--ao": cfg.opacity,
            "--flap-speed": `${cfg.flap}s`,
            "--flap-delay": `${cfg.fd}s`,
          } as React.CSSProperties}
        >
          {/* Flip SVG horizontally for RTL paths so angel faces direction of travel */}
          <div style={{ transform: cfg.flip ? "scaleX(-1)" : undefined }}>
            <AngelSVG size={cfg.size} id={`a${i}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
