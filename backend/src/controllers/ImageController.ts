import { Request, Response } from "express";
import { ImageUploadService } from "../services/ImageUploadService";

export class ImageController {
  /**
   * 공개 다중 이미지 업로드 (APP-BOLT용 - 인증 불필요)
   */
  static async uploadMultiple(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "업로드할 파일이 없습니다.",
        });
      }

      // 인증이 없는 경우 anonymous-user 사용
      const userId = req.user?.id || "anonymous-user";

      try {
        const results = await ImageUploadService.uploadMultiple(files, userId);

        res.status(200).json({
          success: true,
          urls: results.map((result) => result.url),
          data: results,
        });
      } catch (uploadError) {
        console.warn("이미지 업로드 실패, 빈 배열 반환:", uploadError);

        // 업로드 실패해도 성공으로 응답하되 빈 배열 반환
        res.status(200).json({
          success: true,
          urls: [],
          data: [],
          warning: "이미지 업로드에 실패했지만 숙소 등록은 계속 진행됩니다.",
        });
      }
    } catch (error) {
      console.error("다중 이미지 업로드 오류:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "이미지 업로드에 실패했습니다.",
      });
    }
  }

  /**
   * 단일 이미지 업로드
   */
  static async uploadSingle(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.validationError("업로드할 파일이 없습니다.");
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.authenticationError("인증이 필요합니다.");
      }

      const result = await ImageUploadService.uploadSingle(req.file, userId);

      res.success(result, "이미지 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      res.internalError(
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다."
      );
    }
  }

  /**
   * 다중 이미지 업로드 (인증 필요)
   */
  static async uploadMultipleAuth(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.validationError("업로드할 파일이 없습니다.");
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.authenticationError("인증이 필요합니다.");
      }

      const results = await ImageUploadService.uploadMultiple(files, userId);

      res.success(
        results,
        `${results.length}개의 이미지 업로드가 완료되었습니다.`
      );
    } catch (error) {
      console.error("다중 이미지 업로드 오류:", error);
      res.internalError(
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다."
      );
    }
  }

  /**
   * 이미지 삭제
   */
  static async deleteImage(req: Request, res: Response) {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.validationError("삭제할 이미지 URL이 필요합니다.");
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.authenticationError("인증이 필요합니다.");
      }

      // URL에서 파일 경로 추출
      const filePath = ImageUploadService.extractFilePathFromUrl(imageUrl);

      // 사용자 권한 확인 (자신이 업로드한 파일만 삭제 가능)
      if (!filePath.includes(`/${userId}/`)) {
        return res.authorizationError("삭제 권한이 없습니다.");
      }

      await ImageUploadService.deleteImage(filePath);

      res.success(null, "이미지가 삭제되었습니다.");
    } catch (error) {
      console.error("이미지 삭제 오류:", error);
      res.internalError(
        error instanceof Error ? error.message : "이미지 삭제에 실패했습니다."
      );
    }
  }

  /**
   * 다중 이미지 삭제
   */
  static async deleteMultiple(req: Request, res: Response) {
    try {
      const { imageUrls } = req.body;

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return res.validationError("삭제할 이미지 URL 배열이 필요합니다.");
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.authenticationError("인증이 필요합니다.");
      }

      // URL에서 파일 경로 추출 및 권한 확인
      const filePaths = imageUrls.map((url) => {
        const filePath = ImageUploadService.extractFilePathFromUrl(url);

        if (!filePath.includes(`/${userId}/`)) {
          throw new Error("삭제 권한이 없는 파일이 포함되어 있습니다.");
        }

        return filePath;
      });

      await ImageUploadService.deleteMultiple(filePaths);

      res.success(
        { deletedCount: filePaths.length },
        `${filePaths.length}개의 이미지가 삭제되었습니다.`
      );
    } catch (error) {
      console.error("다중 이미지 삭제 오류:", error);
      res.internalError(
        error instanceof Error ? error.message : "이미지 삭제에 실패했습니다."
      );
    }
  }
}
