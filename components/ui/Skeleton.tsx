interface SkeletonProps {
  className?: string
  aspectRatio?: string
}

export default function Skeleton({ className = "", aspectRatio }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{
        background: "var(--card-bg)",
        aspectRatio,
      }}
      aria-hidden="true"
    />
  )
}
