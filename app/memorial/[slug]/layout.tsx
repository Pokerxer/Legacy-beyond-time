import type { Metadata } from "next"

const OG_IMAGE = "https://res.cloudinary.com/dpydlvp2h/image/upload/v1778345615/forever-memorials/w2y7vluldqssmn8ksdno.jpg"

export const metadata: Metadata = {
  title: "In Loving Memory of Christiana O. Opara",
  description:
    "Celebrating the life and legacy of Chief Ezinne Christiana Opara JP, Ugochinyere 1 of Obetiti. A quintessential woman with a heart of gold. 12 Dec 1945 – 7 May 2026.",
  openGraph: {
    title: "In Loving Memory of Chief Ezinne Christiana Opara JP",
    description:
      "A quintessential woman with a heart of gold. Share a tribute, condolence, or memory. 12 Dec 1945 – 7 May 2026.",
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Christiana O. Opara" }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Chief Ezinne Christiana Opara JP",
    description: "A quintessential woman with a heart of gold. 12 Dec 1945 – 7 May 2026.",
    images: [OG_IMAGE],
  },
}

export default function MemorialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
