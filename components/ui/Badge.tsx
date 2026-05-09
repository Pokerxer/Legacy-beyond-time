interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        background: "rgba(201,168,76,0.15)",
        color: "var(--accent-gold)",
        border: "1px solid var(--border-gold)",
        fontFamily: "var(--font-lato)",
      }}
    >
      {children}
    </span>
  )
}
