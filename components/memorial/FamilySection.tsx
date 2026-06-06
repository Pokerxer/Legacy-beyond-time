"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Users } from "lucide-react"
import type { FamilyMember } from "@/types"

interface FamilySectionProps {
  family: FamilyMember[]
  grandchildren: string[]
}

const SPOUSE_RELATIONS = ["Son-in-Law", "Daughter-in-Law"]

type FamilyGroup = { child: FamilyMember; spouse?: FamilyMember }

function buildGroups(family: FamilyMember[]): FamilyGroup[] {
  const groups: FamilyGroup[] = []
  let i = 0
  while (i < family.length) {
    const member = family[i]
    if (SPOUSE_RELATIONS.includes(member.relation)) { i++; continue }
    const next = family[i + 1]
    const spouse = next && SPOUSE_RELATIONS.includes(next.relation) ? next : undefined
    groups.push({ child: member, spouse })
    i += spouse ? 2 : 1
  }
  return groups
}

export default function FamilySection({ family, grandchildren }: FamilySectionProps) {
  const [showGrandchildren, setShowGrandchildren] = useState(false)
  const groups = buildGroups(family)

  if (family.length === 0) return null

  return (
    <section id="family" className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-3xl font-semibold mb-4 text-center"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Survived By
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-sm mb-10"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
        >
          A loving family she built, nurtured and cherished
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(({ child, spouse }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl p-5 transition-transform hover:-translate-y-0.5"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
              }}
            >
              {/* Child */}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1"
                style={{
                  background: "rgba(201,168,76,0.15)",
                  color: "var(--accent-gold)",
                  fontFamily: "var(--font-lato)",
                }}
              >
                {child.relation}
              </span>
              <p
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
              >
                {child.name}
              </p>

              {/* Spouse */}
              {spouse && (
                <>
                  <div
                    className="my-3"
                    style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}
                  />
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1"
                    style={{
                      background: "rgba(201,168,76,0.07)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-lato)",
                    }}
                  >
                    {spouse.relation}
                  </span>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                  >
                    {spouse.name}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Grandchildren */}
        {grandchildren.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={() => setShowGrandchildren(!showGrandchildren)}
              className="w-full rounded-xl p-5 flex items-center justify-between transition-colors hover:bg-white/[0.02]"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
              }}
              aria-expanded={showGrandchildren}
              aria-controls="grandchildren-list"
            >
              <div className="flex items-center gap-3">
                <Users size={18} style={{ color: "var(--accent-gold)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Grandchildren ({grandchildren.length})
                </span>
              </div>
              <motion.span
                animate={{ rotate: showGrandchildren ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} style={{ color: "var(--accent-gold)" }} />
              </motion.span>
            </button>

            <AnimatePresence>
              {showGrandchildren && (
                <motion.div
                  id="grandchildren-list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                    {grandchildren.map((name, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.02 }}
                        className="rounded-lg px-3 py-2 text-center"
                        style={{
                          background: "rgba(201,168,76,0.05)",
                          border: "1px solid rgba(201,168,76,0.15)",
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{
                            fontFamily: "var(--font-lato)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
