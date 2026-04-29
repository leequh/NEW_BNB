import jwt, { SignOptions } from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Access Token 생성 (15분)
export const generateAccessToken = (userId: string, email: string): string => {
  const secretKey = process.env.JWT_SECRET || "default_secret_key";
  return jwt.sign({ userId, email, type: "access" }, secretKey, {
    expiresIn: "15m",
  });
};

// Refresh Token 생성 (7일)
export const generateRefreshToken = (userId: string, email: string): string => {
  const secretKey =
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    "default_refresh_secret";
  return jwt.sign({ userId, email, type: "refresh" }, secretKey, {
    expiresIn: "7d",
  });
};

// Token Pair 생성
export const generateTokenPair = (userId: string, email: string): TokenPair => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
};

// Access Token 검증
export const verifyAccessToken = (token: string): JWTPayload => {
  const secretKey = process.env.JWT_SECRET || "default_secret_key";
  return jwt.verify(token, secretKey) as JWTPayload;
};

// Refresh Token 검증
export const verifyRefreshToken = (token: string): JWTPayload => {
  const secretKey =
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    "default_refresh_secret";
  return jwt.verify(token, secretKey) as JWTPayload;
};

// 기존 호환성을 위한 함수 (deprecated)
export const generateToken = (userId: string): string => {
  const secretKey = process.env.JWT_SECRET || "default_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId }, secretKey, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): { userId: string } => {
  const secretKey = process.env.JWT_SECRET || "default_secret_key";
  return jwt.verify(token, secretKey) as { userId: string };
};
