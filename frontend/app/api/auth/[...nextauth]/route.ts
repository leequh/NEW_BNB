import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import NaverProvider from 'next-auth/providers/naver'
import KakaoProvider from 'next-auth/providers/kakao'

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 2,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Backend API로 로그인 요청
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const response = await res.json()

          if (res.ok && response.user) {
            return {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
              image: response.user.image,
              accessToken: response.token,
            }
          }
          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/users/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // 소셜 로그인 시 백엔드에 사용자 정보 전송
        if (account.provider !== 'credentials') {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social-login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  provider: account.provider,
                }),
              },
            )

            const response = await res.json()

            if (res.ok && response.user) {
              token.sub = response.user.id
              token.accessToken = response.token
              token.userId = response.user.id
            }
          } catch (error) {
            console.error('Social login error:', error)
          }
        } else {
          // Credentials login
          token.sub = user.id
          token.accessToken = (user as any).accessToken
          token.userId = user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        // Add accessToken to session for API calls
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
