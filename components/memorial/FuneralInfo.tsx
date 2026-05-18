"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, ExternalLink, Printer, CalendarCheck } from "lucide-react"
import Button from "@/components/ui/Button"
import type { FuneralDetails } from "@/types"

interface FuneralInfoProps {
  details: FuneralDetails | null
}

export default function FuneralInfo({ details }: FuneralInfoProps) {
  if (!details) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            <Calendar size={40} style={{ color: "var(--border-gold)" }} />
            <p className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Funeral arrangements will be announced
            </p>
            <p className="text-sm">Please check back for updates.</p>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              <Link href="/rsvp">
                <Button variant="primary">
                  <CalendarCheck size={15} />
                  RSVP
                </Button>
              </Link>
              <Link href="/program" target="_blank">
                <Button variant="secondary">
                  <Printer size={15} />
                  Print Program
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-3xl font-semibold mb-8 text-center"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Funeral Service
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-xl p-6 sm:p-8 space-y-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
          }}
        >
          <div className="flex items-start gap-4">
            <Calendar size={20} style={{ color: "var(--accent-gold)", marginTop: 2 }} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                Date
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                {formatDate(details.date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock size={20} style={{ color: "var(--accent-gold)", marginTop: 2 }} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                Time
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                {details.time}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin size={20} style={{ color: "var(--accent-gold)", marginTop: 2 }} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                Venue
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                {details.venue}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                {details.address}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            <Link href="/rsvp">
              <Button variant="primary">
                <CalendarCheck size={16} />
                RSVP
              </Button>
            </Link>
            <Link href="/program" target="_blank">
              <Button variant="secondary">
                <Printer size={16} />
                Print Program
              </Button>
            </Link>
            {details.livestreamUrl && (
              <a href={details.livestreamUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">
                  <ExternalLink size={16} />
                  Watch Livestream
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
