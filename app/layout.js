import { Inter, Noto_Serif } from 'next/font/google'
import './globals.css'

// Font optimization
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

const notoSerif = Noto_Serif({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

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
    url: 'https://edmondaporter.com',
    siteName: 'Edmond A Porter',
    images: [
      {
        url: 'https://edmondaporter.com/images/Edmond_Headshot.webp',
        width: 1200,
        height: 630,
        alt: 'Edmond A Porter - Contemporary Author',
      },
    ],
  },
  twitter: null,
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
        {/* Preconnect for font optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        
        {/* Material Symbols font for icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_forward,auto_awesome,book_2,calendar_today,check_circle,close,mail,menu,military_tech,open_in_new,rss_feed" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.className} ${notoSerif.className} bg-background text-on-background font-body leading-relaxed selection:bg-secondary-container`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
