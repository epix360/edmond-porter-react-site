import { Inter, Noto_Serif } from 'next/font/google'
import Script from 'next/script'
import CookieConsent from './components/CookieConsent';
import './globals.css'

// Font optimization with CSS variables for Tailwind integration
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-body'
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-headline'
})

// Material Symbols stylesheet URL — loaded async after hydration so it
// does not block first paint. Subset is restricted via icon_names to keep
// the CSS payload small.
const MATERIAL_SYMBOLS_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_back,arrow_forward,auto_awesome,book_2,calendar_today,check_circle,close,mail,menu,military_tech,open_in_new,rss_feed';

// Next.js Metadata API for global SEO
export const metadata = {
  metadataBase: new URL('https://edmondaporter.com'),
  title: 'Edmond A Porter | Local Utah Author, Writer, Novelist, Poet, Essayist',
  description: 'Contemporary author exploring human experience through compelling narratives and thoughtful prose.',
  keywords: ['Edmond Porter', 'author', 'writer', 'contemporary literature', 'fiction', 'essays', 'poetry', 'novels', 'Turbulent Waters', 'The Seasons That Made Me'],
  authors: [{ name: 'Edmond A Porter' }],
  openGraph: {
    title: 'Edmond A Porter | Local Utah Author, Writer, Novelist, Poet, Essayist',
    description: 'Contemporary author exploring human experience through compelling narratives and thoughtful prose.',
    url: '/',
    siteName: 'Edmond A Porter',
    type: 'website',
    images: [
      {
        url: 'https://edmondaporter.com/images/Edmond_Headshot.webp',
        width: 1200,
        height: 630,
        alt: 'Edmond A Porter - Contemporary Author',
      },
    ],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable}`}>
      <head>
        {/* Warm up the connection for the icon font we'll lazy-load below */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* LCP image preload — must match the URL the <Image> in HomePageTop.js
            actually requests, otherwise the preload is wasted. */}
        <link
          rel="preload"
          as="image"
          href="/images/Turbulent_Waters.webp"
          fetchPriority="high"
        />
      </head>
      <body className={`${inter.className} ${notoSerif.className} bg-background text-on-background font-body leading-relaxed selection:bg-secondary-container`} suppressHydrationWarning={true}>
        {children}
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} />

        {/* Inject the Material Symbols stylesheet after hydration so it
            doesn't block first paint. Using a tiny inline injector instead
            of <link rel="stylesheet"> keeps icon CSS off the critical path. */}
        <Script id="material-symbols-loader" strategy="afterInteractive">
          {`(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(MATERIAL_SYMBOLS_HREF)};document.head.appendChild(l);})();`}
        </Script>
        <noscript>
          <link rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} />
        </noscript>
      </body>
    </html>
  )
}
