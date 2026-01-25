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
  description: 'The premier Launchpad on Base Network. Secure access to high-potential projects.',
  
  metadataBase: new URL('https://baserise.online'),
  alternates: {
    canonical: '/',
  },

  icons: {
    // Hum browser ko force kar rahe hain ke sirf SVG use kare
    icon: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%232563eb%22/><text x=%2250%22 y=%2255%22 font-size=%2265%22 font-weight=%22800%22 fill=%22white%22 font-family=%22sans-serif%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>B</text></svg>`,
        type: 'image/svg+xml',
      },
    ],
    // Shortcut bhi same SVG hai taake Globe ka chance hi na bache
    shortcut: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%232563eb%22/><text x=%2250%22 y=%2255%22 font-size=%2265%22 font-weight=%22800%22 fill=%22white%22 font-family=%22sans-serif%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>B</text></svg>`,
        type: 'image/svg+xml',
      }
    ]
  },

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BaseRise",
              "url": "https://baserise.online",
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
                  "url": "https://baserise.online/whitepaper"
                },
                {
                  "@type": "WebPage",
                  "@id": "https://baserise.online/waitlist",
                  "name": "Join Waitlist",
                  "url": "https://baserise.online/waitlist"
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