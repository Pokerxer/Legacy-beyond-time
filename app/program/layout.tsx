import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order of Service",
  description:
    "Funeral program and order of service for Chief Mrs Ezinne Christiana Opara JP. Printable memorial document.",
}

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
