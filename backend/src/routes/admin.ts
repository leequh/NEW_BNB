import { Router } from "express";
import prisma from "../utils/prisma";

const router = Router();

// 기본 API 테스트
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin API is working",
    timestamp: new Date().toISOString(),
  });
});

// 전체 숙소 목록 조회
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    res.json({
      success: true,
      data: rooms,
      message: "숙소 목록을 성공적으로 조회했습니다.",
      count: rooms.length,
    });
  } catch (error) {
    console.error("숙소 목록 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "숙소 목록 조회에 실패했습니다.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 특정 숙소 상세 조회
router.get("/rooms/:id", async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);

    if (isNaN(roomId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 숙소 ID입니다.",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "숙소를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      data: room,
      message: "숙소 상세 정보를 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("숙소 상세 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "숙소 상세 조회에 실패했습니다.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 대시보드 통계
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalRooms = await prisma.room.count();
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();

    res.json({
      success: true,
      data: {
        totalRooms,
        totalUsers,
        totalBookings,
        timestamp: new Date().toISOString(),
      },
      message: "대시보드 통계를 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("대시보드 통계 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "대시보드 통계 조회에 실패했습니다.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
