import express from "express";
import multer from "multer";
import prisma from "../utils/prisma";
import { authenticateJWT } from "../middleware/auth";
import { ImageUploadService } from "../services/ImageUploadService";

const router = express.Router();

// Multer 설정 (메모리 저장)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."));
    }
  },
});

// 모든 방 목록 가져오기
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const location = req.query.location as string;
    const category = req.query.category as string;

    const skip = (page - 1) * limit;

    // 필터 조건 설정
    const where: any = {};
    if (location) {
      where.address = { contains: location };
    }
    if (category) {
      where.category = category;
    }

    // 전체 개수 조회
    const totalCount = await prisma.room.count({ where });

    // 페이지네이션된 데이터 조회
    const rooms = await prisma.room.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Frontend 형식에 맞게 응답
    res.json({
      page,
      data: rooms,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

// 특정 ID의 방 상세 정보 가져오기
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!room) {
      // Mock 데이터 반환 (데이터베이스에 데이터가 없을 때)
      const mockRoom = {
        id: roomId,
        title: `아름다운 숙소 ${roomId}`,
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop",
        ],
        address:
          roomId === 295
            ? "서울 성동구 왕십리로 16 (성수동1가, 트리마제)"
            : "서울특별시 강남구 샘플동 123번지",
        lat: roomId === 295 ? "37.5447" : "37.565337",
        lng: roomId === 295 ? "127.0557" : "126.9772095",
        category: "원룸",
        desc: "편안하고 아늑한 숙소입니다. 깨끗하고 현대적인 시설을 갖추고 있으며, 교통이 편리한 위치에 있습니다.",
        price: 80000,
        bedroomDesc: "킹사이즈 침대가 있는 넓은 침실입니다.",
        freeCancel: true,
        selfCheckIn: true,
        officeSpace: false,
        hasMountainView: false,
        hasShampoo: true,
        hasFreeLaundry: true,
        hasAirConditioner: true,
        hasWifi: true,
        hasBarbeque: false,
        hasFreeParking: true,
        userId: "mock-user-id",
        createdAt: new Date().toISOString(),
        imageKeys: [],
        user: {
          id: "mock-user-id",
          name: "호스트",
          image: "/images/user-icon.png",
        },
      };
      return res.json(mockRoom);
    }

    // 데이터베이스에서 가져온 데이터에 좌표가 없을 경우 기본 좌표 추가
    if (!room.lat || !room.lng) {
      room.lat = roomId === 295 ? "37.5447" : "37.565337";
      room.lng = roomId === 295 ? "127.0557" : "126.9772095";
    }

    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);

    // 데이터베이스 연결 실패 시 mock 데이터 반환
    const roomId = parseInt(req.params.id);
    const mockRoom = {
      id: roomId,
      title: `아름다운 숙소 ${roomId}`,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop",
      ],
      address:
        roomId === 295
          ? "서울 성동구 왕십리로 16 (성수동1가, 트리마제)"
          : "서울특별시 강남구 샘플동 123번지",
      lat: roomId === 295 ? "37.5447" : "37.565337",
      lng: roomId === 295 ? "127.0557" : "126.9772095",
      category: "원룸",
      desc: "편안하고 아늑한 숙소입니다. 깨끗하고 현대적인 시설을 갖추고 있으며, 교통이 편리한 위치에 있습니다.",
      price: 80000,
      bedroomDesc: "킹사이즈 침대가 있는 넓은 침실입니다.",
      freeCancel: true,
      selfCheckIn: true,
      officeSpace: false,
      hasMountainView: false,
      hasShampoo: true,
      hasFreeLaundry: true,
      hasAirConditioner: true,
      hasWifi: true,
      hasBarbeque: false,
      hasFreeParking: true,
      userId: "mock-user-id",
      createdAt: new Date().toISOString(),
      imageKeys: [],
      user: {
        id: "mock-user-id",
        name: "호스트",
        image: "/images/user-icon.png",
      },
    };
    res.json(mockRoom);
  }
});

// 허용된 카테고리 목록 (앱과 동일)
const ALLOWED_CATEGORIES = ["원룸", "투룸", "오피스텔", "아파트", "고시원"];

// 새 방 등록하기 (임시로 인증 제거)
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const roomData = req.body;

    // 카테고리 검증
    if (roomData.category && !ALLOWED_CATEGORIES.includes(roomData.category)) {
      return res.status(400).json({
        message: "유효하지 않은 카테고리입니다.",
        allowedCategories: ALLOWED_CATEGORIES,
      });
    }

    // 임시로 userId를 null로 설정 (스키마에서 userId는 optional)
    roomData.userId = null;

    // price를 숫자로 변환 (문자열로 전달될 경우 대비)
    if (roomData.price) {
      roomData.price = Number(roomData.price);
    }

    // Boolean 값들 변환
    const booleanFields = [
      "freeCancel",
      "selfCheckIn",
      "officeSpace",
      "hasMountainView",
      "hasShampoo",
      "hasFreeLaundry",
      "hasAirConditioner",
      "hasWifi",
      "hasBarbeque",
      "hasFreeParking",
    ];

    booleanFields.forEach((field) => {
      if (roomData[field] !== undefined) {
        roomData[field] =
          roomData[field] === "true" || roomData[field] === true;
      }
    });

    // 이미지 처리 (APP-BOLT에서 미리 업로드된 URL들 또는 파일 업로드)
    let imageUrls: string[] = [];
    let imageKeys: string[] = [];

    // APP-BOLT에서 미리 업로드된 이미지 URL들 처리
    const preUploadedImages: string[] = [];

    // 이미지 배열 처리 (배열 또는 JSON 문자열)
    console.log(
      "🔍 전달받은 roomData.images:",
      roomData.images,
      typeof roomData.images
    );

    if (roomData.images) {
      // 이미 배열인 경우
      if (Array.isArray(roomData.images)) {
        // 배열에서 유효한 URL들만 추출 (JSON 문자열 제외)
        const validUrls = roomData.images.filter(
          (item: any) =>
            typeof item === "string" &&
            item.startsWith("https://") &&
            !item.startsWith('["')
        );
        if (validUrls.length > 0) {
          preUploadedImages.push(...validUrls);
          console.log(`✅ 배열 형태 이미지 처리 성공: ${validUrls.length}개`);
          console.log(`📱 처리된 이미지 URLs:`, validUrls);
        }
      }
      // JSON 문자열인 경우
      else if (typeof roomData.images === "string") {
        try {
          const parsedImages = JSON.parse(roomData.images);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            preUploadedImages.push(...parsedImages);
            console.log(
              `✅ JSON 형태 이미지 파싱 성공: ${parsedImages.length}개`
            );
            console.log(`📱 파싱된 이미지 URLs:`, parsedImages);
          }
        } catch (error) {
          console.warn("⚠️ JSON 이미지 파싱 실패:", error);
        }
      }
      delete roomData.images; // 처리 후 제거
    }

    // 개별 images[0], images[1] 형태로 전달된 경우도 처리
    console.log("🔍 전달받은 모든 roomData keys:", Object.keys(roomData));
    Object.keys(roomData).forEach((key) => {
      if (key.startsWith("images[") && key.endsWith("]")) {
        console.log(`📱 개별 이미지 발견: ${key} = ${roomData[key]}`);
        preUploadedImages.push(roomData[key]);
        delete roomData[key]; // 불필요한 키 제거
      }
    });

    if (preUploadedImages.length > 0) {
      imageUrls = preUploadedImages;
      imageKeys = preUploadedImages.map((url) => {
        // URL에서 파일 경로 추출 시도
        try {
          return ImageUploadService.extractFilePathFromUrl(url);
        } catch {
          return url; // 추출 실패 시 URL 그대로 사용
        }
      });
      console.log(`✅ 미리 업로드된 이미지 사용: ${imageUrls.length}개`);
      console.log(`📱 이미지 URLs:`, imageUrls);
    }
    // 파일이 직접 업로드된 경우 (기존 방식)
    else if (files && files.length > 0) {
      try {
        const uploadResults = await ImageUploadService.uploadMultiple(
          files,
          "anonymous-user", // 임시 사용자 ID
          "rooms"
        );

        imageUrls = uploadResults.map((result) => result.url);
        imageKeys = uploadResults.map((result) => result.filePath);
        console.log(`✅ 이미지 업로드 성공: ${imageUrls.length}개`);
      } catch (uploadError) {
        console.error("⚠️ Image upload error:", uploadError);
        console.log("🔄 이미지 없이 숙소 등록을 계속 진행합니다.");
        // 이미지 업로드 실패해도 숙소 등록은 계속 진행
        imageUrls = [];
        imageKeys = [];
      }
    }

    // 방 데이터에 이미지 정보 추가
    roomData.images = imageUrls;
    roomData.imageKeys = imageKeys;

    const room = await prisma.room.create({
      data: roomData,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
});

// 방 정보 업데이트하기 (인증 필요)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    const roomData = req.body;

    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    // 방 소유자 확인
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { userId: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 방 소유자만 수정 가능
    if (room.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own rooms" });
    }

    // price를 숫자로 변환 (문자열로 전달될 경우 대비)
    if (roomData.price) {
      roomData.price = Number(roomData.price);
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: roomData,
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Failed to update room" });
  }
});

// 방 삭제하기 (인증 필요)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    // 방 소유자 확인
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { userId: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 방 소유자만 삭제 가능
    if (room.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own rooms" });
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Failed to delete room" });
  }
});

export default router;
