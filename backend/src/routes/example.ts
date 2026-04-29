import { Router } from "express";
import { calculatePagination } from "../utils/response";

const router = Router();

/**
 * 표준화된 API 응답 형식 예시
 */

// 1. 기본 성공 응답
router.get("/success", (req, res) => {
  res.success({ message: "Hello World!" }, "API 호출이 성공했습니다.");
});

// 2. 생성 성공 응답
router.post("/create", (req, res) => {
  const newItem = {
    id: 1,
    name: req.body.name || "Test Item",
    createdAt: new Date().toISOString(),
  };

  res.created(newItem, "아이템이 성공적으로 생성되었습니다.");
});

// 3. 페이지네이션 응답
router.get("/pagination", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const total = 100; // 예시 총 개수

  // 예시 데이터
  const items = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: `Item ${(page - 1) * limit + i + 1}`,
    description: `This is item number ${(page - 1) * limit + i + 1}`,
  }));

  const pagination = calculatePagination(page, limit, total);

  res.successWithPagination(
    items,
    pagination,
    "아이템 목록을 성공적으로 조회했습니다."
  );
});

// 4. 유효성 검사 에러
router.post("/validation-error", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.validationError("이름과 이메일이 필요합니다.", {
      missingFields: {
        name: !name ? "이름을 입력해주세요." : null,
        email: !email ? "이메일을 입력해주세요." : null,
      },
    });
  }

  res.success({ name, email }, "유효성 검사를 통과했습니다.");
});

// 5. 인증 에러
router.get("/auth-error", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.authenticationError("유효한 인증 토큰이 필요합니다.");
  }

  res.success({ user: "authenticated" }, "인증이 확인되었습니다.");
});

// 6. 권한 에러
router.get("/permission-error", (req, res) => {
  const userRole = req.headers["x-user-role"] as string;

  if (userRole !== "admin") {
    return res.authorizationError("관리자 권한이 필요합니다.");
  }

  res.success({ message: "Admin content" }, "관리자 콘텐츠에 접근했습니다.");
});

// 7. 리소스 없음 에러
router.get("/not-found/:id", (req, res) => {
  const id = req.params.id;

  if (parseInt(id) > 100) {
    return res.notFoundError(`ID ${id}에 해당하는 리소스를 찾을 수 없습니다.`);
  }

  res.success({ id, name: `Item ${id}` }, "리소스를 찾았습니다.");
});

// 8. 충돌 에러
router.post("/conflict", (req, res) => {
  const { email } = req.body;

  // 예시: 이메일 중복 검사
  if (email === "test@example.com") {
    return res.conflictError("이미 존재하는 이메일입니다.");
  }

  res.success({ email }, "이메일이 사용 가능합니다.");
});

// 9. 내부 서버 에러 시뮬레이션
router.get("/server-error", (req, res) => {
  try {
    // 의도적으로 에러 발생
    throw new Error("데이터베이스 연결 실패");
  } catch (error) {
    console.error("서버 에러:", error);
    res.internalError("서버에서 예상치 못한 오류가 발생했습니다.");
  }
});

// 10. 커스텀 에러 응답
router.get("/custom-error", (req, res) => {
  res.error("CUSTOM_ERROR", 422, "커스텀 에러가 발생했습니다.", {
    customField: "customValue",
    additionalInfo: "This is additional error information",
  });
});

export default router;
