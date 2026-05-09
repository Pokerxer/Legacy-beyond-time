"use client"

import { motion } from "framer-motion"
import { Heart, Copy, Check } from "lucide-react"
import { useState } from "react"
import { fadeUpInView } from "./animations"

const bankDetails = {
  bank: "First Bank of Nigeria PLC",
  accountName: "Chief Christiana O. Opara Memorial",
  accountNumber: "1234567890",
  sortCode: "011",
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
      style={{ color: "var(--accent-gold)" }}
      aria-label={`Copy ${text}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

export default function DonationsSection() {
  return (
    <section
      className="relative px-6 py-14 sm:py-20"
      aria-labelledby="donations-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUpInView(0)} className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <Heart size={26} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h2
            id="donations-heading"
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Support the Legacy
          </h2>
          <p
            className="text-sm sm:text-base max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lato)", color: "var(--text-muted)" }}
          >
            In lieu of flowers, the family kindly requests that donations be made
            to continue Mama&apos;s charitable works in honor of her memory.
          </p>
        </motion.div>

        <motion.div
          {...fadeUpInView(0.12)}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border-gold)" }}>
              <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Bank
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                {bankDetails.bank}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border-gold)" }}>
              <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Account Name
              </span>
              <span className="text-sm font-medium text-right max-w-[60%]" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                {bankDetails.accountName}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border-gold)" }}>
              <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Account Number
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold tracking-wider" style={{ color: "var(--accent-gold)", fontFamily: "var(--font-lato)" }}>
                  {bankDetails.accountNumber}
                </span>
                <CopyButton text={bankDetails.accountNumber} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}>
                Sort Code
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-mono" style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato)" }}>
                  {bankDetails.sortCode}
                </span>
                <CopyButton text={bankDetails.sortCode} />
              </span>
            </div>
          </div>

          <div
            className="mt-6 pt-4 text-center"
            style={{ borderTop: "1px solid var(--border-gold)" }}
          >
            <p
              className="text-xs italic"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
            >
              &ldquo;Whatever you did for one of the least of these brothers and sisters of mine, you did for me.&rdquo; &mdash; Matthew 25:40
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
