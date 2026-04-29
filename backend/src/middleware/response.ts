import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { attachResponseHelpers } from "../utils/response";

/**
 * 응답 헬퍼 미들웨어
 * 모든 요청에 표준 응답 메서드를 추가합니다.
 */
export function responseHelperMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 요청 ID 생성 (추적 및 디버깅용)
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();

  // 요청 객체에 requestId 추가
  req.requestId = requestId;

  // 응답 헤더에 requestId 추가
  res.setHeader("X-Request-ID", requestId);

  // 응답 헬퍼 메서드 추가
  attachResponseHelpers(res, requestId);

  next();
}

// Express Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
