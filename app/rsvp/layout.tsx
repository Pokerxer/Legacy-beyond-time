import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Funeral RSVP",
  description:
    "Let the family know if you will be attending the funeral service of Chief Mrs Ezinne Christiana Opara JP.",
  openGraph: {
    title: "Funeral RSVP — Christiana O. Opara Memorial",
    description: "Please let the family know if you will be attending the funeral service.",
  },
}

export default function RSVPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
