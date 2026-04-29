import { Response } from "express";
import {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  HttpStatus,
  ErrorCode,
  PaginationMeta,
} from "../types/api";

const API_VERSION = "1.0.0";

/**
 * 응답 헬퍼 클래스
 */
export class ResponseHelper {
  private res: Response;
  private requestId: string;

  constructor(res: Response, requestId: string) {
    this.res = res;
    this.requestId = requestId;
  }

  /**
   * 성공 응답 생성
   */
  success<T>(
    data: T,
    message?: string,
    statusCode: HttpStatus = HttpStatus.OK,
    pagination?: PaginationMeta
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      message,
      meta: {
        requestId: this.requestId,
        timestamp: new Date().toISOString(),
        version: API_VERSION,
        ...(pagination && { pagination }),
      },
    };

    return this.res.status(statusCode).json(response);
  }

  /**
   * 생성 성공 응답
   */
  created<T>(data: T, message?: string): Response {
    return this.success(data, message, HttpStatus.CREATED);
  }

  /**
   * 에러 응답 생성
   */
  error(
    error: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message?: string,
    details?: any
  ): Response {
    const response: ErrorResponse = {
      success: false,
      error,
      message,
      details,
      meta: {
        requestId: this.requestId,
        timestamp: new Date().toISOString(),
        version: API_VERSION,
      },
    };

    return this.res.status(statusCode).json(response);
  }

  /**
   * 유효성 검사 에러
   */
  validationError(message: string, details?: any): Response {
    return this.error(
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      message,
      details
    );
  }

  /**
   * 인증 에러
   */
  authenticationError(message: string = "인증이 필요합니다."): Response {
    return this.error(
      ErrorCode.AUTHENTICATION_ERROR,
      HttpStatus.UNAUTHORIZED,
      message
    );
  }

  /**
   * 권한 에러
   */
  authorizationError(message: string = "권한이 없습니다."): Response {
    return this.error(
      ErrorCode.AUTHORIZATION_ERROR,
      HttpStatus.FORBIDDEN,
      message
    );
  }

  /**
   * 리소스 없음 에러
   */
  notFoundError(
    message: string = "요청한 리소스를 찾을 수 없습니다."
  ): Response {
    return this.error(ErrorCode.NOT_FOUND_ERROR, HttpStatus.NOT_FOUND, message);
  }

  /**
   * 충돌 에러
   */
  conflictError(message: string): Response {
    return this.error(ErrorCode.CONFLICT_ERROR, HttpStatus.CONFLICT, message);
  }

  /**
   * 내부 서버 에러
   */
  internalError(message: string = "서버 내부 오류가 발생했습니다."): Response {
    return this.error(
      ErrorCode.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      message
    );
  }

  /**
   * 페이지네이션과 함께 성공 응답
   */
  successWithPagination<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string
  ): Response {
    return this.success(data, message, HttpStatus.OK, pagination);
  }
}

/**
 * Express Response 객체에 헬퍼 메서드 추가
 */
export function attachResponseHelpers(res: Response, requestId: string): void {
  const helper = new ResponseHelper(res, requestId);

  res.success = helper.success.bind(helper);
  res.created = helper.created.bind(helper);
  res.error = helper.error.bind(helper);
  res.validationError = helper.validationError.bind(helper);
  res.authenticationError = helper.authenticationError.bind(helper);
  res.authorizationError = helper.authorizationError.bind(helper);
  res.notFoundError = helper.notFoundError.bind(helper);
  res.conflictError = helper.conflictError.bind(helper);
  res.internalError = helper.internalError.bind(helper);
  res.successWithPagination = helper.successWithPagination.bind(helper);
}

/**
 * 페이지네이션 계산 헬퍼
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// Express Response 타입 확장
declare global {
  namespace Express {
    interface Response {
      success: <T>(
        data: T,
        message?: string,
        statusCode?: HttpStatus,
        pagination?: PaginationMeta
      ) => Response;
      created: <T>(data: T, message?: string) => Response;
      error: (
        error: string,
        statusCode?: HttpStatus,
        message?: string,
        details?: any
      ) => Response;
      validationError: (message: string, details?: any) => Response;
      authenticationError: (message?: string) => Response;
      authorizationError: (message?: string) => Response;
      notFoundError: (message?: string) => Response;
      conflictError: (message: string) => Response;
      internalError: (message?: string) => Response;
      successWithPagination: <T>(
        data: T[],
        pagination: PaginationMeta,
        message?: string
      ) => Response;
    }
  }
}
