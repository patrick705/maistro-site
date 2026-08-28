import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  DM_Mono,
  DM_Sans,
  IBM_Plex_Mono,
  Instrument_Serif,
  JetBrains_Mono,
  Manrope,
  Playfair_Display,
  Sora,
  Space_Grotesk,
  Space_Mono,
  Work_Sans,
} from 'next/font/google'
import './globals.css'

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

// Alternate type pairings, offered in Site Settings → Theme → Type pairing.
// next/font only serves the woff2 files a rendered element actually needs, so
// loading all of these costs nothing unless an editor switches away from the
// default Bricolage / Space Grotesk pairing.
const instrumentSerif = Instrument_Serif({ variable: '--font-instrument-serif', subsets: ['latin'], weight: ['400'] })
const workSans = Work_Sans({ variable: '--font-work-sans', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const ibmPlexMono = IBM_Plex_Mono({ variable: '--font-ibm-plex-mono', subsets: ['latin'], weight: ['400', '500'] })
const sora = Sora({ variable: '--font-sora', subsets: ['latin'], weight: ['400', '600', '700', '800'] })
const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'], weight: ['400', '500', '700'] })
const dmMono = DM_Mono({ variable: '--font-dm-mono', subsets: ['latin'], weight: ['400', '500'] })
const playfairDisplay = Playfair_Display({ variable: '--font-playfair-display', subsets: ['latin'], weight: ['600', '700', '800'] })
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const spaceMono = Space_Mono({ variable: '--font-space-mono', subsets: ['latin'], weight: ['400', '700'] })

const fontVariables = [
  bricolageGrotesque,
  spaceGrotesk,
  jetbrainsMono,
  instrumentSerif,
  workSans,
  ibmPlexMono,
  sora,
  dmSans,
  dmMono,
  playfairDisplay,
  manrope,
  spaceMono,
]
  .map((f) => f.variable)
  .join(' ')

export const metadata: Metadata = {
  title: 'Maistro — Run your whole operation with one AI',
  description:
    'Maistro is the agentic AI operating system for hospitality: staff, stock, voice ordering, forecasting and reporting, in one crew of AI assistants. Built inside BossIT.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
