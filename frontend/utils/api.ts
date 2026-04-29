import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// API 클라이언트 기본 설정
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 인증 토큰을 요청에 추가하는 인터셉터
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

// API 함수들
export const api = {
  // 방 관련 API
  rooms: {
    getAll: async () => {
      const response = await apiClient.get('/rooms')
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/rooms/${id}`)
      return response.data
    },
    create: async (roomData: any) => {
      const response = await apiClient.post('/rooms', roomData)
      return response.data
    },
    update: async (id: string, roomData: any) => {
      const response = await apiClient.put(`/rooms/${id}`, roomData)
      return response.data
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/rooms/${id}`)
      return response.data
    },
  },

  // 예약 관련 API
  bookings: {
    getAll: async () => {
      const response = await apiClient.get('/bookings')
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/bookings/${id}`)
      return response.data
    },
    getByUser: async (userId: string) => {
      const response = await apiClient.get(`/bookings/user/${userId}`)
      return response.data
    },
    getByRoom: async (roomId: string) => {
      const response = await apiClient.get(`/bookings/room/${roomId}`)
      return response.data
    },
    create: async (bookingData: any) => {
      const response = await apiClient.post('/bookings', bookingData)
      return response.data
    },
    updateStatus: async (id: string, status: string) => {
      const response = await apiClient.patch(`/bookings/${id}`, { status })
      return response.data
    },
    cancel: async (id: string) => {
      const response = await apiClient.delete(`/bookings/${id}`)
      return response.data
    },
  },

  // 사용자 관련 API
  users: {
    getProfile: async () => {
      const response = await apiClient.get('/api/auth/me')
      return response.data
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/users/${id}`)
      return response.data
    },
    update: async (id: string, userData: any) => {
      const response = await apiClient.put(`/users/${id}`, userData)
      return response.data
    },
  },

  // 인증 관련 API
  auth: {
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      })
      return response.data
    },
    register: async (userData: any) => {
      const response = await apiClient.post('/api/auth/register', userData)
      return response.data
    },
  },
}

export default api
