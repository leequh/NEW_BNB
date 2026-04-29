import express from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import {
  generateToken,
  verifyToken,
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/jwt";
import { authenticateJWT, authenticateJWTNew } from "../middleware/auth";

const router = express.Router();

// 테스트용 사용자 생성
router.post("/create-test-user", async (req, res) => {
  try {
    const testEmail = "test@example.com";

    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (existingUser) {
      return res.json({
        message: "Test user already exists",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    // 테스트 사용자 생성
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        provider: "local",
      },
    });

    res.json({
      message: "Test user created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Test user creation error:", error);
    res.status(500).json({ message: "Failed to create test user" });
  }
});

// 기존 로그인 API (하위 호환성 유지)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일로 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 실제 구현에서는 비밀번호 비교 로직 추가
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: 'Invalid password' });
    // }

    // 토큰 생성
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

// 새로운 버전의 로그인 API (향후 확장용)
router.post("/v2/login", async (req, res) => {
  try {
    const { email, password, deviceInfo } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // JWT 토큰 페어 생성 (새로운 기능)
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.email || "");

    // 하위 호환성을 위해 기존 구조 + 새로운 필드
    res.json({
      // 기존 구조 유지
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      // 새로운 기능 추가
      accessToken,
      refreshToken,
      expiresIn: 3600,
      version: "v2",
    });
  } catch (error) {
    console.error("Login v2 error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

// 소셜 로그인 (Google, Naver, Kakao) - 표준 응답 형식
router.post("/social-login", async (req, res) => {
  try {
    const { name, email, image, provider } = req.body;

    if (!email) {
      return res.validationError("이메일이 필요합니다.");
    }

    // 기존 사용자 확인
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          image: image || null,
        },
      });
    }
    // 사용자가 있지만 이미지가 없거나 다른 경우 업데이트
    else if (image && user.image !== image) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { image },
      });
    }

    // 토큰 생성
    const token = generateToken(user.id);

    res.success(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
      "소셜 로그인이 성공적으로 완료되었습니다."
    );
  } catch (error) {
    console.error("Social login error:", error);
    res.internalError("소셜 로그인 처리 중 오류가 발생했습니다.");
  }
});

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 비밀번호 해싱 (실제 구현 시 사용)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        // 실제 구현에서는 해싱된 비밀번호 저장
        // password: hashedPassword,
        image,
      },
    });

    // 토큰 생성
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 토큰 검증 및 사용자 정보 반환 (표준 응답 형식)
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    // 인증 미들웨어를 통해 req.user에 사용자 정보가 이미 있음
    res.success(
      {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          image: req.user.image,
        },
      },
      "사용자 정보를 성공적으로 조회했습니다."
    );
  } catch (error) {
    console.error("Authentication error:", error);
    res.authenticationError("유효하지 않거나 만료된 토큰입니다.");
  }
});

// 토큰 생성 API (인증된 사용자용)
router.post("/generate-token", async (req, res) => {
  try {
    const { userId, email } = req.body;

    console.log("Token generation request received:", { userId, email });

    if (!userId && !email) {
      console.log("Missing both userId and email");
      return res.status(400).json({ message: "User ID or email is required" });
    }

    // 사용자 존재 확인 (userId 또는 email로)
    let user;
    if (userId) {
      console.log("Searching user by userId:", userId);
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
      console.log("User found by userId:", user ? "YES" : "NO");
    }

    // userId로 찾지 못했거나 userId가 없으면 email로 찾기
    if (!user && email) {
      console.log("Searching user by email:", email);
      user = await prisma.user.findUnique({
        where: { email },
      });
      console.log("User found by email:", user ? "YES" : "NO");
      if (user) {
        console.log("Found user:", {
          id: user.id,
          email: user.email,
          name: user.name,
        });
      }
    }

    if (!user) {
      console.log("User not found with userId:", userId, "or email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // 토큰 생성
    const token = generateToken(user.id);
    console.log("Token generated successfully for user:", user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ message: "Failed to generate token" });
  }
});

// 디버깅용: 모든 사용자 목록 조회
router.get("/debug-users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
      },
    });

    console.log("All users in database:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ===== 새로운 JWT 기반 인증 API =====

// 새로운 로그인 (Access + Refresh Token)
router.post("/v2/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "이메일이 필요합니다.",
      });
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "사용자를 찾을 수 없습니다.",
      });
    }

    // 실제 구현에서는 비밀번호 검증
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ success: false, error: '비밀번호가 올바르지 않습니다.' });
    // }

    // Token Pair 생성
    const tokens = generateTokenPair(user.id, user.email!);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        ...tokens,
      },
      message: "로그인이 완료되었습니다.",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "로그인 처리 중 오류가 발생했습니다.",
    });
  }
});

// 새로운 소셜 로그인 (Access + Refresh Token)
router.post("/v2/social-login", async (req, res) => {
  try {
    const { name, email, image, provider } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "이메일이 필요합니다.",
      });
    }

    // 기존 사용자 확인 또는 생성
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          image: image || null,
          provider: provider || "social",
        },
      });
    } else if (image && user.image !== image) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { image },
      });
    }

    // Token Pair 생성
    const tokens = generateTokenPair(user.id, user.email!);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        ...tokens,
      },
      message: "소셜 로그인이 완료되었습니다.",
    });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(500).json({
      success: false,
      error: "소셜 로그인 처리 중 오류가 발생했습니다.",
    });
  }
});

// 새로운 회원가입 (Access + Refresh Token)
router.post("/v2/register", async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: "이름과 이메일이 필요합니다.",
      });
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "이미 사용 중인 이메일입니다.",
      });
    }

    // 실제 구현에서는 비밀번호 해싱
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        // password: hashedPassword,
        image: image || null,
        provider: "local",
      },
    });

    // Token Pair 생성
    const tokens = generateTokenPair(user.id, user.email!);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        ...tokens,
      },
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "회원가입 처리 중 오류가 발생했습니다.",
    });
  }
});

// Token 갱신
router.post("/v2/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token이 필요합니다.",
      });
    }

    // Refresh Token 검증
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "사용자를 찾을 수 없습니다.",
      });
    }

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken(user.id, user.email!);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
      message: "Access token이 갱신되었습니다.",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      error: "Refresh token이 유효하지 않습니다.",
    });
  }
});

// 새로운 사용자 정보 조회 (표준 응답 형식)
router.get("/v2/me", authenticateJWTNew, async (req, res) => {
  try {
    res.success(
      {
        user: {
          id: req.user!.id,
          name: req.user!.name,
          email: req.user!.email,
          image: req.user!.image,
        },
      },
      "사용자 정보를 성공적으로 조회했습니다."
    );
  } catch (error) {
    console.error("User info error:", error);
    res.internalError("사용자 정보 조회 중 오류가 발생했습니다.");
  }
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post("/v2/logout", authenticateJWTNew, async (req, res) => {
  try {
    // 실제 구현에서는 Refresh Token을 블랙리스트에 추가하거나 DB에서 삭제
    res.json({
      success: true,
      message: "로그아웃이 완료되었습니다.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "로그아웃 처리 중 오류가 발생했습니다.",
    });
  }
});

export default router;
