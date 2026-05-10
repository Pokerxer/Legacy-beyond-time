"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquareQuote, Heart, Loader2 } from "lucide-react"
import type { Tribute } from "@/types"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"

interface TributesWallProps {
  tributes: Tribute[]
  onOpenModal: () => void
}

export default function TributesWall({ tributes, onOpenModal }: TributesWallProps) {
  const [visibleTributes, setVisibleTributes] = useState(6)
  const [visibleCondolences, setVisibleCondolences] = useState(6)

  const approved = tributes.filter((t) => t.isApproved)
  const tributeItems = approved.filter((t) => t.relationship !== "Condolence")
  const condolenceItems = approved.filter((t) => t.relationship === "Condolence")

  const shownTributes = tributeItems.slice(0, visibleTributes)
  const shownCondolences = condolenceItems.slice(0, visibleCondolences)
  const hasMoreTributes = visibleTributes < tributeItems.length
  const hasMoreCondolences = visibleCondolences < condolenceItems.length

  return (
    <section id="tributes" className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <h2
              className="text-2xl sm:text-3xl font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              What She Meant to Us
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
            >
              {approved.length} {approved.length === 1 ? "message" : "messages"}
            </p>
          </div>
          <Button variant="primary" onClick={onOpenModal}>
            Leave a Tribute
          </Button>
        </motion.div>

        {approved.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            <MessageSquareQuote size={40} style={{ color: "var(--border-gold)" }} />
            <p className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              No tributes yet
            </p>
            <p className="text-sm">Be the first to leave one.</p>
          </motion.div>
        ) : (
          <>
            {/* Tributes */}
            {tributeItems.length > 0 && (
              <>
                <h3
                  className="text-lg font-semibold mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  <MessageSquareQuote size={18} style={{ color: "var(--accent-gold)" }} />
                  Tributes ({tributeItems.length})
                </h3>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 mb-12">
                  {shownTributes.map((tribute, i) => (
                    <motion.article
                      key={tribute._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="relative rounded-xl p-6 break-inside-avoid"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border-gold)",
                      }}
                    >
                      <MessageSquareQuote
                        size={24}
                        className="absolute top-3 right-3 opacity-20"
                        style={{ color: "var(--accent-gold)" }}
                        aria-hidden="true"
                      />
                      <div className="flex items-center gap-3 mb-4">
                        {tribute.authorPhoto ? (
                          <img
                            src={tribute.authorPhoto || "/placeholder.svg"}
                            alt={tribute.authorName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              background: "rgba(201,168,76,0.15)",
                              color: "var(--accent-gold)",
                            }}
                          >
                            {tribute.authorName[0]}
                          </div>
                        )}
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                          >
                            {tribute.authorName}
                          </p>
                          <Badge>{tribute.relationship}</Badge>
                        </div>
                      </div>
                      {tribute.impact && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-gold)" }}>
                            Impact
                          </p>
                          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-lato)", color: "var(--text-primary)" }}>
                            {tribute.impact}
                          </p>
                        </div>
                      )}
                      {tribute.whatTheyMiss && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-gold)" }}>
                            What I&rsquo;ll Miss
                          </p>
                          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}>
                            {tribute.whatTheyMiss}
                          </p>
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
                {hasMoreTributes && (
                  <div className="flex justify-center mb-12">
                    <Button variant="secondary" onClick={() => setVisibleTributes((v) => v + 6)}>
                      <Loader2 size={16} />
                      Load More Tributes
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Condolence Letters */}
            {condolenceItems.length > 0 && (
              <>
                <h3
                  className="text-lg font-semibold mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  <Heart size={18} style={{ color: "var(--accent-gold)" }} />
                  Condolence Letters ({condolenceItems.length})
                </h3>
                <div className="space-y-4">
                  {shownCondolences.map((item, i) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                      className="rounded-xl p-5"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border-gold)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "rgba(201,168,76,0.12)" }}
                        >
                          <Heart size={14} style={{ color: "var(--accent-gold)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                              {item.authorName}
                            </span>
                            {item.location && (
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {item.location}
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed mt-1.5" style={{ fontFamily: "var(--font-lato)", color: "var(--text-primary)" }}>
                            {item.message}
                          </p>
                          <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {hasMoreCondolences && (
                  <div className="flex justify-center mt-6">
                    <Button variant="secondary" onClick={() => setVisibleCondolences((v) => v + 6)}>
                      <Loader2 size={16} />
                      Load More Condolences
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}
