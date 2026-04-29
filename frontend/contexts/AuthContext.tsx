'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  tokenStorage,
  getCurrentUser,
  logout as apiLogout,
} from '@/utils/authApi'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken()
        if (accessToken) {
          // 저장된 사용자 정보 먼저 로드
          const savedUser = tokenStorage.getUser()
          if (savedUser) {
            setUser(savedUser)
          }

          // 서버에서 최신 사용자 정보 가져오기
          const currentUser = await getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          } else {
            // 토큰이 유효하지 않으면 로그아웃
            tokenStorage.clearTokens()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        tokenStorage.clearTokens()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (
    userData: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => {
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken)
    tokenStorage.setUser(userData)
    setUser(userData)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenStorage.clearTokens()
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
