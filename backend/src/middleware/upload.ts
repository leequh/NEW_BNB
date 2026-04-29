import multer from "multer";
import { Request } from "express";

// 메모리 스토리지 사용 (파일을 메모리에 저장)
const storage = multer.memoryStorage();

// 파일 필터링 함수
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // 이미지 파일만 허용
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."));
  }
};

// Multer 설정
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // 최대 10개 파일
  },
});

// 단일 파일 업로드
export const uploadSingle = upload.single("image");

// 다중 파일 업로드
export const uploadMultiple = upload.array("images", 10);
