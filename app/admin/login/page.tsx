"use client"

import { Suspense, useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push(searchParams.get("callbackUrl") || "/admin")
    }
  }, [status, router, searchParams])

  if (status === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1f 100%)" }}
      >
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
      </main>
    )
  }

  if (session) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      setLoading(false)
      return
    }
    if (!password) {
      setError("Password is required")
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push(searchParams.get("callbackUrl") || "/admin")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1f 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-gold)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "rgba(201,168,76,0.12)" }}
          >
            <Lock size={24} style={{ color: "var(--accent-gold)" }} />
          </div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Admin Login
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Sign in to manage the memorial site
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-center mb-4 py-2.5 px-3 rounded-lg"
            style={{ background: "rgba(255,0,0,0.1)", color: "#ff6b6b" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@forever.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
              color: "#1a1a2e",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={12} />
            Back to home
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f0f1f 100%)" }}
        >
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-gold)" }} />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
