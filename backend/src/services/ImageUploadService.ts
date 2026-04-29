import { bucket, clientFirebaseStorage } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UploadResult {
  url: string;
  fileName: string;
  filePath: string;
}

export class ImageUploadService {
  private static readonly ALLOWED_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * 이미지 파일 유효성 검사
   */
  static validateImage(file: Express.Multer.File): void {
    // 파일 크기 검사
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
    }

    // 파일 확장자 검사
    const ext = file.originalname
      .substring(file.originalname.lastIndexOf("."))
      .toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(
        "지원하지 않는 파일 형식입니다. (jpg, jpeg, png, webp만 허용)"
      );
    }

    // MIME 타입 검사
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드 가능합니다.");
    }
  }

  /**
   * 단일 이미지 업로드
   */
  static async uploadSingle(
    file: Express.Multer.File,
    userId: string,
    folder: string = "rooms"
  ): Promise<UploadResult> {
    // 파일 검증
    this.validateImage(file);

    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".")
    );
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = `${folder}/${userId}/${fileName}`;

    // Firebase 환경변수 확인
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !storageBucket || !apiKey) {
      throw new Error(
        "Firebase 환경변수가 설정되지 않았습니다. FIREBASE_SETUP.md를 참조하여 Firebase를 설정해주세요."
      );
    }

    // Firebase Admin SDK가 없으면 Client SDK로 대체 시도
    if (!bucket) {
      console.warn("⚠️ Firebase Admin SDK 사용 불가능");
      console.warn("   Client SDK로 업로드를 시도합니다...");

      try {
        return await this.uploadViaClientSDK(file, fileName, filePath);
      } catch (clientError) {
        console.error("❌ Client SDK 업로드도 실패:", clientError);
        console.warn("   Firebase Storage 보안 규칙을 확인해주세요.");
        throw new Error(
          "Firebase 업로드에 실패했습니다. Storage 보안 규칙을 확인해주세요."
        );
      }
    }

    const fileUpload = bucket.file(filePath);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        console.error("❌ Firebase Admin SDK 업로드 실패:", error);
        reject(new Error(`Firebase 업로드 실패: ${error.message}`));
      });

      stream.on("finish", async () => {
        try {
          // 파일을 공개적으로 읽을 수 있도록 설정
          await fileUpload.makePublic();

          // 공개 URL 생성
          const publicUrl = `https://storage.googleapis.com/${
            bucket!.name
          }/${filePath}`;

          console.log("✅ Firebase Admin SDK 업로드 성공:", publicUrl);
          resolve({
            url: publicUrl,
            fileName,
            filePath,
          });
        } catch (error) {
          console.error("❌ Firebase URL 생성 실패:", error);
          reject(new Error(`Firebase URL 생성 실패: ${error}`));
        }
      });

      stream.end(file.buffer);
    });
  }

  /**
   * Firebase Client SDK를 통한 업로드
   */
  static async uploadViaClientSDK(
    file: Express.Multer.File,
    fileName: string,
    filePath: string
  ): Promise<UploadResult> {
    if (!clientFirebaseStorage) {
      throw new Error(
        "Firebase Client Storage가 초기화되지 않았습니다. Firebase 설정을 확인해주세요."
      );
    }

    try {
      // Firebase Client SDK를 사용하여 업로드
      const storageRef = ref(clientFirebaseStorage, filePath);

      const uploadResult = await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });

      // 다운로드 URL 생성
      const downloadURL = await getDownloadURL(uploadResult.ref);

      console.log("✅ Firebase Client SDK 업로드 성공:", downloadURL);

      return {
        url: downloadURL,
        fileName,
        filePath,
      };
    } catch (error) {
      console.error("❌ Firebase Client SDK 업로드 실패:", error);
      throw new Error(
        `Firebase Client SDK 업로드 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  }

  /**
   * Firebase Storage REST API를 통한 업로드
   */
  static async uploadViaRestAPI(
    file: Express.Multer.File,
    fileName: string,
    filePath: string,
    storageBucket: string,
    apiKey: string
  ): Promise<UploadResult> {
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?uploadType=media&name=${encodeURIComponent(
      filePath
    )}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.mimetype,
          Authorization: `Bearer ${apiKey}`, // API Key 방식
        },
        body: file.buffer,
      });

      if (!response.ok) {
        // API Key 방식이 실패하면 공개 업로드 시도
        const publicUploadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?uploadType=media&name=${encodeURIComponent(
          filePath
        )}&key=${apiKey}`;

        const publicResponse = await fetch(publicUploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.mimetype,
          },
          body: file.buffer,
        });

        if (!publicResponse.ok) {
          const errorText = await publicResponse.text();
          throw new Error(
            `Firebase REST API 업로드 실패: ${publicResponse.status} - ${errorText}`
          );
        }
      }

      // 공개 URL 생성
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(
        filePath
      )}?alt=media`;

      console.log("✅ Firebase REST API 업로드 성공:", publicUrl);

      return {
        url: publicUrl,
        fileName,
        filePath,
      };
    } catch (error) {
      console.error("❌ Firebase REST API 업로드 실패:", error);
      throw new Error(
        `Firebase REST API 업로드 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  }

  /**
   * 다중 이미지 업로드
   */
  static async uploadMultiple(
    files: Express.Multer.File[],
    userId: string,
    folder: string = "rooms"
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new Error("업로드할 파일이 없습니다.");
    }

    if (files.length > 10) {
      throw new Error("한 번에 최대 10개의 파일만 업로드 가능합니다.");
    }

    const uploadPromises = files.map((file) =>
      this.uploadSingle(file, userId, folder)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * 이미지 삭제
   */
  static async deleteImage(filePath: string): Promise<void> {
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!storageBucket || !apiKey) {
      throw new Error("Firebase 환경변수가 설정되지 않았습니다.");
    }

    try {
      // Firebase Storage REST API를 사용한 삭제
      const deleteUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(
        filePath
      )}?key=${apiKey}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`삭제 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(
        `파일 삭제 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  }

  /**
   * 다중 이미지 삭제
   */
  static async deleteMultiple(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map((filePath) =>
      this.deleteImage(filePath)
    );

    await Promise.all(deletePromises);
  }

  /**
   * URL에서 파일 경로 추출
   */
  static extractFilePathFromUrl(url: string): string {
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!storageBucket) {
      throw new Error("Firebase Storage Bucket이 설정되지 않았습니다.");
    }

    // Firebase Storage URL 패턴 처리
    const firebaseStoragePattern = new RegExp(
      `https://firebasestorage\\.googleapis\\.com/v0/b/${storageBucket}/o/([^?]+)`
    );
    const googleStoragePattern = new RegExp(
      `https://storage\\.googleapis\\.com/${storageBucket}/(.+)`
    );

    let match = url.match(firebaseStoragePattern);
    if (match) {
      return decodeURIComponent(match[1]);
    }

    match = url.match(googleStoragePattern);
    if (match) {
      return match[1];
    }

    throw new Error("유효하지 않은 Firebase Storage URL입니다.");
  }
}
