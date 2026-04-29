import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/prisma";
import { responseHelperMiddleware } from "./middleware/response";

// 환경 변수 설정
dotenv.config();

// Express 앱 설정
const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
      "x-refresh-token",
      "x-user-role",
    ],
  })
);

// JSON 파싱 미들웨어 (큰 이미지 업로드를 위해 limit 증가)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 응답 헬퍼 미들웨어 적용 (모든 라우트에 적용)
app.use(responseHelperMiddleware);

// 기본 라우트 (표준 응답 형식 적용)
app.get("/", (req, res) => {
  res.success(
    {
      service: "NextBNB API",
      status: "running",
      environment: process.env.NODE_ENV || "development",
    },
    "NextBNB API가 정상적으로 실행 중입니다."
  );
});

// Health check 라우트
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API 라우트 등록
// 여기에 API 라우트 설정 (나중에 라우트 파일로 분리 예정)
import roomRoutes from "./routes/rooms";
import userRoutes from "./routes/users";
import bookingRoutes from "./routes/bookings";
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payments";
import commentRoutes from "./routes/comments";
import imageRoutes from "./routes/images";
import exampleRoutes from "./routes/example";
import adminRoutes from "./routes/admin";

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/examples", exampleRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Available routes:`);
  console.log(`   GET    /api/health`);
  console.log(`   POST   /api/auth/*`);
  console.log(`   GET    /api/rooms/*`);
  console.log(`   POST   /api/bookings/*`);
  console.log(`   POST   /api/payments/*`);
  console.log(`   GET    /api/comments/*`);
  console.log(`   GET    /api/users/*`);
  console.log(`   POST   /api/images/*`);
  console.log(`   GET    /api/examples/*`);
  console.log(`   ALL    /api/admin/*`);
});

// 애플리케이션 종료 시 Prisma 연결 닫기
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
