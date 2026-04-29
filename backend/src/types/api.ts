/**
 * 표준 API 응답 인터페이스
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

/**
 * 성공 응답 인터페이스
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

/**
 * HTTP 상태 코드 열거형
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * 에러 코드 열거형
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
}
