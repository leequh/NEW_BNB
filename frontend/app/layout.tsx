import type { Metadata } from 'next'
import { noto_sans } from './fonts'
import './globals.css'
import { NextLayout, NextProvider } from './providers'
import { Nunito } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/auth/AuthContext'
import { AuthProvider as JWTAuthProvider } from '@/contexts/AuthContext'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://fastcampus-nextbnb.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: 'Fastcampus Nextbnb로 여행하기',
  description: 'Fastcampus Nextbnb로 여행을 계획해보세요.',
  keywords: ['Nextbnb', '여행', '숙소', '호텔', '펜션', '최저가'],
  openGraph: {
    title: 'nextbnb로 여행하기',
    description: 'nextbnb로 여행을 계획해보세요',
    url: 'https://fastcampus-nextbnb.vercel.app',
    siteName: 'Fastcampus Nextbnb',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={noto_sans.className}>
        <AuthProvider>
          <JWTAuthProvider>
            <Toaster />
            <NextProvider>
              <NextLayout>{children}</NextLayout>
            </NextProvider>
          </JWTAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
