"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  MessageSquareHeart,
  Heart,
  Image as ImageIcon,
  HandHeart,
  LogOut,
  Menu,
  X,
  CalendarCheck,
  Flame,
} from "lucide-react"
import { SessionProvider } from "next-auth/react"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/tributes",   label: "Tributes",     icon: MessageSquareHeart },
  { href: "/admin/condolence", label: "Condolences",  icon: Heart },
  { href: "/admin/gallery",    label: "Gallery",      icon: ImageIcon },
  { href: "/admin/donations",  label: "Donations",    icon: HandHeart },
  { href: "/admin/rsvp",       label: "RSVP",         icon: CalendarCheck },
  { href: "/admin/candles",    label: "Candles",      icon: Flame },
]

function AdminSidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className={mobile ? "flex flex-col gap-1" : "flex flex-col gap-1 sticky top-6"}>
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: active ? "rgba(201,168,76,0.12)" : "transparent",
              color: active ? "var(--accent-gold)" : "var(--text-muted)",
            }}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [status, router, isLoginPage])

  if (isLoginPage) return <>{children}</>

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Mobile header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 sm:hidden"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-gold)" }}
      >
        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Admin Panel
        </span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "var(--text-primary)" }}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          style={{ background: "rgba(15,15,31,0.95)" }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="pt-16 px-4" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar mobile onClose={() => setMobileMenuOpen(false)} />
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mt-4 w-full"
              style={{ color: "#ff6b6b" }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden sm:flex flex-col w-60 min-h-screen p-6 shrink-0"
        style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border-gold)" }}
      >
        <div className="mb-8">
          <h1 className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Legacy Beyond Time
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {session.user?.email}
          </p>
        </div>

        <AdminSidebar />

        <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--border-gold)" }}>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full hover:opacity-80"
            style={{ color: "#ff6b6b" }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 pt-16 sm:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
