import express from "express";
import prisma from "../utils/prisma";
import { authenticateJWT } from "../middleware/auth";
import { BookingStatus } from "@prisma/client";

const router = express.Router();

// 모든 예약 목록 가져오기 (페이지네이션 지원)
router.get("/", async (req, res) => {
  try {
    const { userId, page = 1, limit = 5 } = req.query;
    console.log('예약 목록 요청:', { userId, page, limit });
    
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // userId가 제공되지 않으면 첫 번째 사용자 사용 (개발용)
    let targetUserId = userId as string;
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst();
      targetUserId = firstUser?.id || '';
      console.log('첫 번째 사용자 ID 사용:', targetUserId);
    }

    const bookings = await prisma.booking.findMany({
      where: targetUserId ? { userId: targetUserId } : {},
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      skip: skip,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`예약 ${bookings.length}개 조회됨`);

    res.json({
      data: bookings,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// 특정 ID의 예약 상세 정보 가져오기
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 자신의 예약이거나 방 소유자만 예약 정보 확인 가능
    if (booking.userId !== req.user.id && booking.room.userId !== req.user.id) {
      return res.status(403).json({
        message:
          "Forbidden: You can only view your own bookings or bookings for your rooms",
      });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

// 내 예약 목록 가져오기
router.get("/user/me", async (req, res) => {
  try {
    // 로그인하지 않은 경우 첫 번째 사용자의 예약 내역 조회 (개발용)
    const firstUser = await prisma.user.findFirst();
    const userId = firstUser?.id;
    
    if (!userId) {
      return res.status(404).json({ message: "No user found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
});

// 특정 사용자의 예약 목록 가져오기 (관리자용)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
});

// 내 방에 대한 예약 목록 가져오기
router.get("/my-rooms/bookings", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // 먼저 사용자의 방을 찾음
    const rooms = await prisma.room.findMany({
      where: { userId },
      select: { id: true },
    });

    const roomIds = rooms.map((room) => room.id);

    // 해당 방들의 예약을 조회
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: { in: roomIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        room: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    res.status(500).json({ message: "Failed to fetch room bookings" });
  }
});

// 방의 예약 목록 가져오기
router.get("/room/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { roomId: parseInt(roomId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    res.status(500).json({ message: "Failed to fetch room bookings" });
  }
});

// 새 예약 생성하기 (인증 필요)
router.post("/", async (req, res) => {
  try {
    const bookingData = req.body;
    console.log("받은 예약 데이터:", bookingData);

    // userId가 없으면 첫 번째 사용자의 ID를 사용 (개발용)
    if (!bookingData.userId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        bookingData.userId = firstUser.id;
      }
    }

    // 필수 필드 유효성 검사
    if (!bookingData.roomId || !bookingData.checkIn || !bookingData.checkOut) {
      return res.status(400).json({
        error: "필수 필드가 누락되었습니다. (roomId, checkIn, checkOut)",
      });
    }

    // 날짜 유효성 검사
    const checkInDate = new Date(bookingData.checkIn as string);
    const checkOutDate = new Date(bookingData.checkOut as string);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        error: "유효하지 않은 날짜 형식입니다.",
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        error: "체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.",
      });
    }

    // 데이터 타입 변환
    const processedData = {
      roomId: parseInt(bookingData.roomId as string),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount: parseInt(bookingData.guestCount as string) || 1,
      totalAmount: parseInt(bookingData.totalAmount as string) || 0,
      totalDays: parseInt(bookingData.totalDays as string) || 1,
      status: BookingStatus.PENDING,
      userId: bookingData.userId as string,
    };

    console.log("처리된 예약 데이터:", processedData);

    const booking = await prisma.booking.create({
      data: processedData,
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// 예약 상태 업데이트하기 (인증 필요)
router.patch("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 예약 정보 조회
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 예약 사용자 또는 방 소유자만 상태 변경 가능
    const isBookingUser = booking.userId === req.user.id;
    const isRoomOwner = booking.room.userId === req.user.id;

    if (!isBookingUser && !isRoomOwner) {
      return res.status(403).json({
        message:
          "Forbidden: You can only update bookings you made or for rooms you own",
      });
    }

    // 사용자는 취소만 가능, 방 소유자는 모든 상태 변경 가능
    if (isBookingUser && status !== "canceled") {
      return res
        .status(403)
        .json({ message: "Forbidden: Users can only cancel their bookings" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

// 예약 취소하기 (인증 필요)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    // 예약 정보 조회
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 예약 사용자 또는 방 소유자만 취소 가능
    if (booking.userId !== req.user.id && booking.room.userId !== req.user.id) {
      return res.status(403).json({
        message:
          "Forbidden: You can only cancel your own bookings or bookings for your rooms",
      });
    }

    await prisma.booking.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

export default router;
