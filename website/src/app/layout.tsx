import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PromptSnippets",
  description: "speed up the input with variable snippets",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RCWDT5TD5S"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RCWDT5TD5S');`,
          }}
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
      <Script src="/playground-cc70ed46.js"></Script>
    </html>
  )
}
