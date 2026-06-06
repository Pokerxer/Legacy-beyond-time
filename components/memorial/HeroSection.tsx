"use client"

import { motion } from "framer-motion"

interface HeroSectionProps {
  fullName: string
  shortName: string
  dateOfBirth: string
  dateOfDeath: string
  tagline: string
  coverPhoto: string
  profilePhoto: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function HeroSection({
  fullName,
  shortName,
  dateOfBirth,
  dateOfDeath,
  tagline,
  coverPhoto,
  profilePhoto,
}: HeroSectionProps) {
  const initials = (shortName ?? "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

  return (
    <section className="relative w-full">
      {/* Cover photo */}
      <div
        className="relative w-full h-[50vh] sm:h-[55vh] lg:h-[60vh]"
        style={{
          background: coverPhoto
            ? `url(${coverPhoto}) center/cover no-repeat`
            : "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f1f 100%)",
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,26,46,1) 0%, rgba(26,26,46,0.6) 40%, rgba(26,26,46,0.2) 70%, rgba(26,26,46,0.4) 100%)",
          }}
        />
      </div>

      {/* Profile photo + name — positioned to overlap cover */}
      <div className="relative px-6 -mt-24 sm:-mt-28 pb-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center sm:items-start sm:flex-row sm:gap-8">
          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 -mt-6 sm:mt-0"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={shortName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4"
                style={{
                  borderColor: "var(--accent-gold)",
                  boxShadow: "0 0 30px rgba(201,168,76,0.2)",
                }}
              />
            ) : (
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold border-4"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--accent-gold)",
                  color: "var(--accent-gold)",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                {initials}
              </div>
            )}
          </motion.div>

          {/* Name + details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-center sm:text-left mt-4 sm:mt-8"
          >
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              {shortName}
            </h1>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
            >
              Born {formatDate(dateOfBirth)} &nbsp;✦&nbsp; Died {formatDate(dateOfDeath)}
            </p>
            {tagline && (
              <p
                className="mt-2 italic text-sm sm:text-base max-w-lg"
                style={{ color: "var(--accent-gold)", fontFamily: "var(--font-playfair)" }}
              >
                &ldquo;{tagline}&rdquo;
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
