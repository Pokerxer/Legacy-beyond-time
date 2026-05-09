import Link from "next/link"
import { Heart } from "lucide-react"

export default function NotFound() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1f 100%)",
      }}
    >
      <h1
        className="text-6xl sm:text-7xl font-bold mb-4"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--accent-gold)" }}
      >
        404
      </h1>
      <p
        className="text-xl sm:text-2xl mb-2"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
      >
        Memorial Not Found
      </p>
      <p
        className="text-sm mb-8 max-w-md"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-lato)" }}
      >
        The tribute page you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
          color: "#1a1a2e",
          fontFamily: "var(--font-lato)",
        }}
      >
        <Heart size={18} />
        Return Home
      </Link>
    </main>
  )
}
