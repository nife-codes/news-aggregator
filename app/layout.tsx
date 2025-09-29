import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI News Aggregator',
  description: 'Stay informed with AI-powered news summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}