import type { Metadata, Viewport } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import { AppKitContextProvider } from "./contexts/AppKitContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";
import { PaymentContextProvider } from "./contexts/PaymentContext";
import { baseContainerStyleCss } from "./constants";
import { SocketProvider } from './contexts/SocketContext';
import CookiesBanner from './components/CookiesBanner';
import { RootProvider } from 'fumadocs-ui/provider/next';

const oxanium = Oxanium({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-oxanium'
});

export const metadata: Metadata = {
  title: 'Lunark AI - Making Blockchain Human-Friendly',
  description: 'Making blockchain human-friendly with Lunark Agent. Interact with the blockchain using natural language. Check balances, transfer funds, or analyze market trends. Powered by Astreus AI framework.',
  keywords: [
    'blockchain',
    'AI',
    'web3',
    'crypto',
    'natural language',
    'AI agent',
    'blockchain agent',
    'DeFi',
    'wallet',
    'smart contracts',
  ],
  authors: [{ name: 'Lunark AI' }],
  creator: 'Lunark AI',
  publisher: 'Lunark AI',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'Lunark AI',
    title: 'Lunark AI - Making Blockchain Human-Friendly',
    description: 'Making blockchain human-friendly with Lunark Agent. Interact with the blockchain using natural language. Check balances, transfer funds, or analyze market trends.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lunark AI - Making Blockchain Human-Friendly',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lunark AI - Making Blockchain Human-Friendly',
    description: 'Making blockchain human-friendly with Lunark Agent. Interact with the blockchain using natural language.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'http://localhost:3000',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={oxanium.className}>
        <RootProvider theme={{ defaultTheme: 'dark', forcedTheme: 'dark' }}>
          <GlobalContextProvider>
            <UserContextProvider>
              <AppKitContextProvider>
                <PaymentContextProvider>
                  <SocketProvider>
                    {children}
                    <CookiesBanner />
                    <Toaster
                      position="top-center"
                      toastOptions={{
                        style: {
                          padding: "6px 6px 6px 14px",
                          borderRadius: "0.75rem",
                          position: "relative",
                          ...baseContainerStyleCss
                        }
                      }}
                    />
                  </SocketProvider>
                </PaymentContextProvider>
              </AppKitContextProvider>
            </UserContextProvider>
          </GlobalContextProvider>
        </RootProvider>
      </body>
    </html>
  );
}
