import { Router } from "express";
import { ImageController } from "../controllers/ImageController";
import { uploadSingle, uploadMultiple } from "../middleware/upload";
import { authenticateJWTNew } from "../middleware/auth";

const router = Router();

/**
 * @route POST /api/images/upload-public
 * @desc 공개 이미지 업로드 (인증 불필요 - APP-BOLT용)
 * @access Public
 */
router.post("/upload-public", uploadMultiple, ImageController.uploadMultiple);

// 모든 이미지 관련 API는 인증 필요
router.use(authenticateJWTNew);

/**
 * @route POST /api/images/upload
 * @desc 단일 이미지 업로드
 * @access Private
 */
router.post("/upload", uploadSingle, ImageController.uploadSingle);

/**
 * @route POST /api/images/upload-multiple
 * @desc 다중 이미지 업로드
 * @access Private
 */
router.post(
  "/upload-multiple",
  uploadMultiple,
  ImageController.uploadMultipleAuth
);

/**
 * @route DELETE /api/images/delete
 * @desc 단일 이미지 삭제
 * @access Private
 */
router.delete("/delete", ImageController.deleteImage);

/**
 * @route DELETE /api/images/delete-multiple
 * @desc 다중 이미지 삭제
 * @access Private
 */
router.delete("/delete-multiple", ImageController.deleteMultiple);

export default router;
