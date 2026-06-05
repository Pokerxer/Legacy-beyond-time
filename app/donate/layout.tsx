import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support the Family",
  description:
    "Support the family of Chief Ezinne Christiana Opara JP during this difficult time. View bank details and record your donation.",
  openGraph: {
    title: "Support the Family — Christiana O. Opara Memorial",
    description: "Your contribution towards the burial and family support is deeply appreciated.",
  },
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
