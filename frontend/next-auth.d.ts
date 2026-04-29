import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * 기본 NextAuth 타입에 추가 속성 확장
   */
  interface Session {
    accessToken?: string
    user: {
      id: string
      name: string
      email: string
      image?: string
    }
  }

  interface User {
    id: string
    name?: string
    email?: string
    image?: string
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  /** JWT 타입에 추가 속성 확장 */
  interface JWT {
    id: string
    accessToken?: string
  }
}
