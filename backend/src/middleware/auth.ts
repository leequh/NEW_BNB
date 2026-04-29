import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/jwt";

const prisma = new PrismaClient();

// JWT 인증 미들웨어
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    console.log("Token:", token);
    console.log("Secret key:", secretKey);

    try {
      const decoded = jwt.verify(token, secretKey) as { userId: string };
      console.log("Decoded token:", decoded);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 인증된 사용자 정보를 요청 객체에 추가
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);

      // JWT 검증 실패 시 토큰을 사용자 ID로 간주하여 시도
      console.log("JWT 검증 실패, 토큰을 사용자 ID로 시도:", token);

      // 토큰이 숫자로만 구성되어 있거나 UUID 형태인지 확인
      if (
        /^\d+$/.test(token) ||
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          token
        )
      ) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token },
          });

          if (user) {
            console.log("사용자 ID로 사용자 찾음:", user.id);
            req.user = user;
            next();
            return;
          } else {
            console.log("해당 ID의 사용자를 찾을 수 없음:", token);
          }
        } catch (fallbackError) {
          console.error("Fallback user lookup error:", fallbackError);
        }
      } else {
        console.log("토큰이 사용자 ID 형태가 아님:", token);
      }

      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 새로운 JWT 인증 미들웨어 (Access Token + Refresh Token)
export const authenticateJWTNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access token이 필요합니다.",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      // Access Token 검증
      const decoded = verifyAccessToken(accessToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "사용자를 찾을 수 없습니다.",
        });
      }

      req.user = user;
      next();
    } catch (accessTokenError) {
      // Access Token이 만료된 경우 Refresh Token으로 재발급 시도
      if (refreshToken) {
        try {
          const refreshDecoded = verifyRefreshToken(refreshToken);

          const user = await prisma.user.findUnique({
            where: { id: refreshDecoded.userId },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          });

          if (!user) {
            return res.status(404).json({
              success: false,
              error: "사용자를 찾을 수 없습니다.",
            });
          }

          // 새로운 Access Token 발급
          const newAccessToken = generateAccessToken(user.id, user.email!);

          // 응답 헤더에 새 토큰 추가
          res.setHeader("x-new-access-token", newAccessToken);

          req.user = user;
          next();
        } catch (refreshTokenError) {
          return res.status(401).json({
            success: false,
            error: "Refresh token이 유효하지 않습니다. 다시 로그인해주세요.",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          error: "Access token이 만료되었습니다. Refresh token이 필요합니다.",
        });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      error: "인증 처리 중 오류가 발생했습니다.",
    });
  }
};

// 이미지 업로드용 간단한 인증 미들웨어 (기존 authenticateJWT와 동일한 로직)
export const authenticateToken = authenticateJWT;

// Express의 Request 타입에 사용자 정보 추가
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
