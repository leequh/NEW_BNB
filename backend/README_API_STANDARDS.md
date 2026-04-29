# API 응답 형식 표준화 가이드

## 개요

NextBNB 프로젝트는 웹과 모바일 앱이 동일한 백엔드 API를 사용할 수 있도록 표준화된 응답 형식을 구현했습니다. 이 문서는 API 응답 표준과 사용법을 설명합니다.

## 표준 응답 구조

### 성공 응답

```json
{
  "success": true,
  "data": {
    // 실제 응답 데이터
  },
  "message": "작업이 성공적으로 완료되었습니다.",
  "meta": {
    "requestId": "uuid-v4",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "pagination": {
      // 페이지네이션이 있는 경우만
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 에러 응답

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "입력 데이터가 유효하지 않습니다.",
  "details": {
    // 상세 에러 정보 (선택적)
  },
  "meta": {
    "requestId": "uuid-v4",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## HTTP 상태 코드

| 코드 | 의미                  | 사용 시점                     |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | 일반적인 성공 응답            |
| 201  | Created               | 리소스 생성 성공              |
| 204  | No Content            | 성공했지만 반환할 데이터 없음 |
| 400  | Bad Request           | 유효성 검사 실패              |
| 401  | Unauthorized          | 인증 실패                     |
| 403  | Forbidden             | 권한 없음                     |
| 404  | Not Found             | 리소스 없음                   |
| 409  | Conflict              | 리소스 충돌                   |
| 422  | Unprocessable Entity  | 처리할 수 없는 엔티티         |
| 500  | Internal Server Error | 서버 내부 오류                |

## 에러 코드

| 코드                   | 의미             | HTTP 상태 |
| ---------------------- | ---------------- | --------- |
| VALIDATION_ERROR       | 유효성 검사 오류 | 400       |
| AUTHENTICATION_ERROR   | 인증 오류        | 401       |
| AUTHORIZATION_ERROR    | 권한 오류        | 403       |
| NOT_FOUND_ERROR        | 리소스 없음      | 404       |
| CONFLICT_ERROR         | 충돌 오류        | 409       |
| INTERNAL_ERROR         | 내부 서버 오류   | 500       |
| EXTERNAL_SERVICE_ERROR | 외부 서비스 오류 | 500       |
| RATE_LIMIT_ERROR       | 요청 제한 초과   | 429       |

## 백엔드 사용법

### 1. 컨트롤러에서 응답 헬퍼 사용

```typescript
import { Request, Response } from "express";

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.findById(req.params.id);

      if (!user) {
        return res.notFoundError("사용자를 찾을 수 없습니다.");
      }

      res.success(user, "사용자 정보를 성공적으로 조회했습니다.");
    } catch (error) {
      res.internalError("사용자 조회 중 오류가 발생했습니다.");
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.validationError("이름과 이메일이 필요합니다.");
      }

      const user = await UserService.create({ name, email });
      res.created(user, "사용자가 성공적으로 생성되었습니다.");
    } catch (error) {
      res.internalError("사용자 생성 중 오류가 발생했습니다.");
    }
  }
}
```

### 2. 페이지네이션 응답

```typescript
import { calculatePagination } from "../utils/response";

export class PostController {
  static async getPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { posts, total } = await PostService.findMany(page, limit);
      const pagination = calculatePagination(page, limit, total);

      res.successWithPagination(
        posts,
        pagination,
        "게시글 목록을 조회했습니다."
      );
    } catch (error) {
      res.internalError("게시글 조회 중 오류가 발생했습니다.");
    }
  }
}
```

### 3. 사용 가능한 응답 메서드

```typescript
// 성공 응답
res.success(data, message?, statusCode?, pagination?)
res.created(data, message?)
res.successWithPagination(data, pagination, message?)

// 에러 응답
res.error(errorCode, statusCode?, message?, details?)
res.validationError(message, details?)
res.authenticationError(message?)
res.authorizationError(message?)
res.notFoundError(message?)
res.conflictError(message)
res.internalError(message?)
```

## 프론트엔드 사용법

### 1. API 클라이언트 사용

```typescript
import { apiClient, extractData, handleApiError } from "../utils/apiClient";

// GET 요청
try {
  const response = await apiClient.get<User>("/api/users/123");
  const user = extractData(response);
  console.log(user);
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message);
}

// POST 요청
try {
  const response = await apiClient.post<User>("/api/users", {
    name: "John Doe",
    email: "john@example.com",
  });
  const user = extractData(response);
  console.log("사용자 생성됨:", user);
} catch (error) {
  const apiError = handleApiError(error);
  console.error("생성 실패:", apiError.message);
}
```

### 2. 파일 업로드

```typescript
// 단일 파일 업로드
const file = document.querySelector('input[type="file"]').files[0];
try {
  const response = await apiClient.uploadFile<UploadResult>(
    "/api/images/upload",
    file,
    "image"
  );
  const result = extractData(response);
  console.log("업로드 완료:", result.url);
} catch (error) {
  console.error("업로드 실패:", handleApiError(error).message);
}

// 다중 파일 업로드
const files = Array.from(document.querySelector('input[type="file"]').files);
try {
  const response = await apiClient.uploadFiles<UploadResult[]>(
    "/api/images/upload-multiple",
    files,
    "images"
  );
  const results = extractData(response);
  console.log(
    "업로드 완료:",
    results.map((r) => r.url)
  );
} catch (error) {
  console.error("업로드 실패:", handleApiError(error).message);
}
```

### 3. 인증 토큰 설정

```typescript
import { apiClient } from "../utils/apiClient";

// 토큰 설정
apiClient.setAuthToken("your-access-token");
apiClient.setRefreshToken("your-refresh-token");

// 토큰 제거
apiClient.removeAuthToken();
```

## 요청 추적

모든 API 요청에는 고유한 Request ID가 자동으로 생성되어 응답에 포함됩니다. 이를 통해 로그 추적과 디버깅이 가능합니다.

```typescript
// 클라이언트에서 Request ID 지정
const response = await apiClient.get("/api/users", {
  headers: {
    "X-Request-ID": "custom-request-id",
  },
});

console.log("Request ID:", response.meta?.requestId);
```

## 에러 처리 모범 사례

### 백엔드

```typescript
try {
  // 비즈니스 로직
  const result = await someOperation();
  res.success(result, "작업이 완료되었습니다.");
} catch (error) {
  if (error instanceof ValidationError) {
    res.validationError(error.message, error.details);
  } else if (error instanceof NotFoundError) {
    res.notFoundError(error.message);
  } else {
    console.error("Unexpected error:", error);
    res.internalError("예상치 못한 오류가 발생했습니다.");
  }
}
```

### 프론트엔드

```typescript
try {
  const response = await apiClient.post("/api/users", userData);
  const user = extractData(response);
  // 성공 처리
} catch (error) {
  const apiError = handleApiError(error);

  switch (apiError.code) {
    case "VALIDATION_ERROR":
      // 유효성 검사 오류 처리
      showValidationErrors(apiError.details);
      break;
    case "AUTHENTICATION_ERROR":
      // 인증 오류 처리
      redirectToLogin();
      break;
    default:
      // 일반 오류 처리
      showErrorMessage(apiError.message);
  }
}
```

## 마이그레이션 가이드

기존 API를 표준 형식으로 마이그레이션하는 방법:

1. **백엔드**: 기존 `res.json()` 호출을 `res.success()` 또는 적절한 에러 메서드로 교체
2. **프론트엔드**: 기존 fetch 호출을 `apiClient` 사용으로 교체
3. **점진적 적용**: 새로운 API부터 표준 형식 적용, 기존 API는 필요에 따라 순차적으로 업데이트

이 표준화를 통해 웹과 모바일 앱이 동일한 API를 사용하면서도 일관된 사용자 경험을 제공할 수 있습니다.
