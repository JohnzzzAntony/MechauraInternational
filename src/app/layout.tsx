import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://mechaurainternational.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Mechaura International FZE LLC — Industrial Equipment, Tools & Specialized Brushes Supplier in UAE",
    template: "%s | Mechaura International",
  },
  description:
    "Mechaura International FZE LLC is a UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC. Reliable supply, competitive pricing, on-time delivery.",
  keywords: [
    "industrial equipment supplier UAE",
    "industrial tools Ajman",
    "specialized brushes UAE",
    "abrasive brushes",
    "bearings supplier",
    "hydraulic hose UAE",
    "cutting tools distributor",
    "elevator accessories",
    "bandsaw blades",
    "industrial supplier Ajman Free Zone",
    "Mechaura International",
    "B2B industrial supply UAE",
  ],
  authors: [{ name: "Mechaura International FZE LLC" }],
  creator: "Mechaura International FZE LLC",
  publisher: "Mechaura International FZE LLC",
  applicationName: "Mechaura International",
  category: "Industrial Equipment & Supplies",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mechaura International",
    title:
      "Mechaura International — Your Industrial Partner for Quality, Speed & Support",
    description:
      "Distributing high-quality industrial equipment, tools, and specialized brushes across the UAE. Reliable supply, competitive pricing, and on-time delivery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mechaura International — Industrial Equipment Supplier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mechaura International — Industrial Equipment Supplier in UAE",
    description:
      "Distributing high-quality industrial equipment, tools, and specialized brushes across the UAE.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo-mark.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Mechaura International FZE LLC",
              legalName: "Mechaura International FZE LLC",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
              description:
                "UAE-based industrial supplier delivering high-quality industrial equipment, tools, and specialized brushes across the GCC region.",
              email: "info@mechaurainternational.com",
              telephone: "+971566202517",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Ajman Free Zone",
                addressLocality: "Ajman",
                addressRegion: "Ajman",
                addressCountry: "AE",
              },
              areaServed: ["AE", "SA", "QA", "OM", "KW", "BH"],
              knowsAbout: [
                "Industrial Equipment",
                "Industrial Tools",
                "Specialized Brushes",
                "Bearings",
                "Hydraulic Hoses",
                "Cutting Tools",
                "Elevator Accessories",
                "Bandsaw Blades",
              ],
            }),
          }}
        />
        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#localbusiness`,
              name: "Mechaura International FZE LLC",
              image: `${SITE_URL}/og-image.png`,
              url: SITE_URL,
              telephone: "+971566202517",
              email: "info@mechaurainternational.com",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Ajman Free Zone",
                addressLocality: "Ajman",
                addressRegion: "Ajman",
                addressCountry: "AE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 25.4052,
                longitude: 55.5136,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
                  opens: "08:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
