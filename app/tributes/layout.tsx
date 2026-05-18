import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tributes",
  description:
    "Share a memory, a story, or how Chief Mrs Ezinne Christiana Opara JP touched your life. Leave a lasting tribute.",
  openGraph: {
    title: "Leave a Tribute — Christiana O. Opara Memorial",
    description: "Share a memory or story about Mama. Every tribute preserves her legacy.",
  },
}

export default function TributesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
