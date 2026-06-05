import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Condolence Messages",
  description:
    "Send a condolence message to the family of Chief Ezinne Christiana Opara JP. Share a prayer, a memory, or words of comfort.",
  openGraph: {
    title: "Condolence Messages — Christiana O. Opara Memorial",
    description: "Share a word of comfort or a prayer for the Opara family.",
  },
}

export default function CondolencesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
