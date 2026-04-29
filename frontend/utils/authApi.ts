const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    accessToken: string
    refreshToken: string
  }
  error?: string
  message?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 토큰 저장/조회/삭제
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  },
}

// API 요청 헬퍼 (자동 토큰 갱신 포함)
async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const accessToken = tokenStorage.getAccessToken()
  const refreshToken = tokenStorage.getRefreshToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    // 새로운 Access Token이 있으면 저장
    const newAccessToken = response.headers.get('x-new-access-token')
    if (newAccessToken && refreshToken) {
      tokenStorage.setTokens(newAccessToken, refreshToken)
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    }
  }
}

/**
 * 로그인
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse['data']>(
    '/api/auth/v2/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  )

  if (response.success && response.data) {
    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
    )
    tokenStorage.setUser(response.data.user)
  }

  return response as AuthResponse
}

/**
 * 소셜 로그인
 */
export async function socialLogin(
  name: string,
  email: string,
  image?: string,
  provider?: string,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse['data']>(
    '/api/auth/v2/social-login',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, image, provider }),
    },
  )

  if (response.success && response.data) {
    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
    )
    tokenStorage.setUser(response.data.user)
  }

  return response as AuthResponse
}

/**
 * 회원가입
 */
export async function register(
  name: string,
  email: string,
  password: string,
  image?: string,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse['data']>(
    '/api/auth/v2/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password, image }),
    },
  )

  if (response.success && response.data) {
    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
    )
    tokenStorage.setUser(response.data.user)
  }

  return response as AuthResponse
}

/**
 * 토큰 갱신
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    return false
  }

  const response = await apiRequest<{ accessToken: string }>(
    '/api/auth/v2/refresh',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    },
  )

  if (response.success && response.data) {
    tokenStorage.setTokens(response.data.accessToken, refreshToken)
    return true
  }

  // Refresh Token도 만료된 경우 로그아웃
  tokenStorage.clearTokens()
  return false
}

/**
 * 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User | null> {
  const response = await apiRequest<{ user: User }>('/api/auth/v2/me')

  if (response.success && response.data) {
    tokenStorage.setUser(response.data.user)
    return response.data.user
  }

  return null
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await apiRequest('/api/auth/v2/logout', {
    method: 'POST',
  })

  tokenStorage.clearTokens()
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  return !!tokenStorage.getAccessToken()
}

/**
 * 인증된 API 요청 (다른 API에서 사용)
 */
export async function authenticatedRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, options)
}
