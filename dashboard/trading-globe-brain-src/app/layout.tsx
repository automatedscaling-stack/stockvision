import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trading Globe Brain | StockVision Standalone UI",
  description: "Immersive 3D trading intelligence interface connected to the StockVision Flask API",
  generator: "v0.app + OpenClaw integration",
  icons: {
    icon: [
      {
        url: "/trading-globe/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/trading-globe/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/trading-globe/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/trading-globe/apple-icon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
      </body>
    </html>
  )
}
