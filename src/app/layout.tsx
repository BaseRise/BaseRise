import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// src/app/layout.tsx mein metadata update karein

export const metadata = {
  title: 'BaseRise', // Title thora lamba rakha hai SEO ke liye
  description: 'The premier Launchpad on Base Network. Secure guaranteed allocations in the next generation of high-potential projects.',
  
  // Metadata for Google Search Appearance
  metadataBase: new URL('https://baserise.online'),
  alternates: {
    canonical: '/',
  },

  icons: {
    // 1. Primary Favicon (SVG for high quality in modern browsers)
    icon: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%232563eb%22/><text x=%2250%22 y=%2255%22 font-size=%2265%22 font-weight=%22800%22 fill=%22white%22 font-family=%22sans-serif%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>B</text></svg>`,
        type: 'image/svg+xml',
      },
      // 2. Fallback PNG Icon (Google Crawler aksar absolute PNGs ko zyada pasand karta hai)
      {
        url: '/icon.png', 
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    // 3. Apple Touch Icon (For iOS bookmarks)
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Social Media Previews (Jab link share karenge toh achi image nazar aayegi)
  openGraph: {
    title: 'BaseRise | Access the Future of Base',
    description: 'Premier Launchpad on Base Network.',
    url: 'https://baserise.online',
    siteName: 'BaseRise',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Schema for Google Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BaseRise",
              "url": "https://baserise.online",
              "description": "The premier Launchpad on Base Network.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://baserise.online/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "hasPart": [
                {
                  "@type": "WebPage",
                  "@id": "https://baserise.online/whitepaper",
                  "name": "Whitepaper",
                  "url": "https://baserise.online/whitepaper",
                  "description": "Interactive technical document for BaseRise Protocol."
                },
                {
                  "@type": "WebPage",
                  "@id": "https://baserise.online/waitlist",
                  "name": "Join Waitlist",
                  "url": "https://baserise.online/waitlist",
                  "description": "Join the BaseRise ecosystem early access."
                }
              ]
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}