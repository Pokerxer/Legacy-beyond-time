"use client"

import { forwardRef } from "react"

type Variant = "primary" | "secondary" | "ghost"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
    color: "#1a1a2e",
    border: "none",
  },
  secondary: {
    background: "transparent",
    color: "var(--accent-gold)",
    border: "1px solid var(--border-gold)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "none",
  },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", style, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
        style={{
          fontFamily: "var(--font-lato)",
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
export default Button
