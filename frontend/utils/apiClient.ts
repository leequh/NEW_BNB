import {
  ApiResponse,
  ApiError,
  ApiRequestOptions,
  SuccessResponse,
  ErrorResponse,
} from '../types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

/**
 * 표준화된 API 클라이언트
 */
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * 기본 헤더 설정
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * 인증 토큰 설정
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  /**
   * 리프레시 토큰 설정
   */
  setRefreshToken(token: string): void {
    this.defaultHeaders['x-refresh-token'] = token
  }

  /**
   * 인증 토큰 제거
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization']
    delete this.defaultHeaders['x-refresh-token']
  }

  /**
   * HTTP 요청 실행
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 10000,
      retries = 0,
    } = options

    const url = `${this.baseURL}${endpoint}`
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    // Request ID 생성 (추적용)
    const requestId = crypto.randomUUID()
    requestHeaders['X-Request-ID'] = requestId

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) }),
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (!response.ok) {
        const errorResponse = responseData as ErrorResponse
        throw new ApiError(
          errorResponse.message || errorResponse.error || 'API 요청 실패',
          response.status,
          errorResponse.error || 'UNKNOWN_ERROR',
          errorResponse.details,
          errorResponse.meta?.requestId,
        )
      }

      return responseData as ApiResponse<T>
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(
            '요청 시간이 초과되었습니다.',
            408,
            'TIMEOUT_ERROR',
          )
        }

        // 네트워크 오류 등의 경우 재시도
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return this.request<T>(endpoint, { ...options, retries: retries - 1 })
        }

        throw new ApiError(
          '네트워크 오류가 발생했습니다.',
          0,
          'NETWORK_ERROR',
          error.message,
        )
      }

      throw new ApiError('알 수 없는 오류가 발생했습니다.')
    }
  }

  /**
   * GET 요청
   */
  async get<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST 요청
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  /**
   * PUT 요청
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  /**
   * DELETE 요청
   */
  async delete<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * PATCH 요청
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  /**
   * 파일 업로드 요청
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append(fieldName, file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const headers = { ...this.defaultHeaders }
    delete headers['Content-Type'] // FormData는 자동으로 Content-Type 설정

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    })
  }

  /**
   * 다중 파일 업로드 요청
   */
  async uploadFiles<T>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files',
    additionalData?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append(fieldName, file)
    })

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const headers = { ...this.defaultHeaders }
    delete headers['Content-Type']

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    })
  }
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new ApiClient()

/**
 * 응답에서 데이터 추출 헬퍼
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (!response.success || !response.data) {
    throw new ApiError(
      response.error || '응답 데이터가 없습니다.',
      500,
      'NO_DATA_ERROR',
    )
  }
  return response.data
}

/**
 * 에러 핸들링 헬퍼
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'UNKNOWN_ERROR')
  }

  return new ApiError('알 수 없는 오류가 발생했습니다.', 500, 'UNKNOWN_ERROR')
}
