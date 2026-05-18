import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://legacy-beyond-time.vercel.app"
const OG_IMAGE = "https://res.cloudinary.com/dpydlvp2h/image/upload/v1778345615/forever-memorials/w2y7vluldqssmn8ksdno.jpg"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "In Loving Memory of Christiana O. Opara — Legacy Beyond Time",
    template: "%s — Legacy Beyond Time",
  },
  description:
    "A dignified memorial tribute for Chief Mrs Ezinne Christiana Opara JP. Share memories, tributes, condolences and photos.",
  openGraph: {
    type: "website",
    siteName: "Legacy Beyond Time",
    title: "In Loving Memory of Christiana O. Opara",
    description: "A quintessential woman with a heart of gold. 12 Dec 1949 – 7 May 2026.",
    images: [
      {
        url: OG_IMAGE,
        width: 800,
        height: 800,
        alt: "Chief Mrs Ezinne Christiana Opara JP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Christiana O. Opara",
    description: "A quintessential woman with a heart of gold. 12 Dec 1949 – 7 May 2026.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
