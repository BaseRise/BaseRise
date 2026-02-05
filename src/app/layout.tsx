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

export const metadata = {
  title: 'BaseRise',
  description: 'Access the Future of Base Ecosystem. The premier Launchpad on Base Chain. Secure guaranteed allocations in the next generation of high-potential projects.',

  metadataBase: new URL('https://baserise.online'),
  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      { url: '/BaseRise.png', type: 'image/png', sizes: '512x512' },
      { url: '/BaseRise.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/BaseRise.png',
    apple: '/BaseRise.png',
  },

  openGraph: {
    title: 'BaseRise | Access the Future of Base Ecosystem',
    description: 'The premier Launchpad on Base Chain. Secure guaranteed allocations in the next generation of high-potential projects.',
    url: 'https://baserise.online',
    siteName: 'BaseRise',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'BaseRise | Access the Future of Base',
    description: 'Premier Launchpad on Base Network. Join waitlist now.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BaseRise",
              "url": "https://baserise.online",
              "description": "The premier Launchpad on Base Chain. Secure guaranteed allocations in high-potential projects.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://baserise.online/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": "BaseRise Navigation",
              "hasPart": [
                {
                  "@type": "WebPage",
                  "name": "Whitepaper",
                  "description": "Read the BaseRise whitepaper - Democratizing Access to the Base Ecosystem",
                  "url": "https://baserise.online/whitepaper"
                },
                {
                  "@type": "WebPage",
                  "name": "Waitlist",
                  "description": "Join the BaseRise waitlist and secure your spot",
                  "url": "https://baserise.online/waitlist"
                },
                {
                  "@type": "WebPage",
                  "name": "Leaderboard",
                  "description": "View the BaseRise community leaderboard and rankings",
                  "url": "https://baserise.online/leaderboard"
                },
                {
                  "@type": "WebPage",
                  "name": "Profile",
                  "description": "Check your BaseRise profile and referral stats",
                  "url": "https://baserise.online/lookup"
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