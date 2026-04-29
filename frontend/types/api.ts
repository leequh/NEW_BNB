/**
 * 표준 API 응답 인터페이스 (프론트엔드용)
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    requestId: string
    timestamp: string
    version: string
    pagination?: PaginationMeta
  }
}

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse {
  success: false
  error: string
  message?: string
  details?: any
  meta: {
    requestId: string
    timestamp: string
    version: string
  }
}

/**
 * 성공 응답 인터페이스
 */
export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  meta: {
    requestId: string
    timestamp: string
    version: string
    pagination?: PaginationMeta
  }
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: any
  public readonly requestId?: string

  constructor(
    message: string,
    status: number = 500,
    code: string = 'UNKNOWN_ERROR',
    details?: any,
    requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.requestId = requestId
  }
}

/**
 * API 요청 옵션
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
}
