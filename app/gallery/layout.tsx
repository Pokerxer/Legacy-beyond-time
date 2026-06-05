import type { Metadata } from "next"

const OG_IMAGE = "https://res.cloudinary.com/dpydlvp2h/image/upload/v1778345287/forever-memorials/fsb1muhhmtlxp6lzz8ld.jpg"

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Share and view cherished photos of Chief Ezinne Christiana Opara JP. Every picture is a memory preserved forever.",
  openGraph: {
    title: "Photo Gallery — Christiana O. Opara Memorial",
    description: "Share cherished photos and memories. Every picture preserved forever.",
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Memorial Photo Gallery" }],
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
