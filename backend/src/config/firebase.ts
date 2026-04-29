import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { initializeApp } from "firebase/app";
import { getStorage as getClientStorage } from "firebase/storage";

// Firebase Admin 초기화 (환경변수에서 설정 읽기)
if (!admin.apps.length) {
  // 모든 Firebase 환경변수 확인
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID;
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  // Service Account 방식 환경변수
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // 필수 환경변수 체크
  const requiredEnvs = [
    projectId,
    storageBucket,
    apiKey,
    authDomain,
    messagingSenderId,
    appId,
  ];
  const missingEnvs = [];

  if (!projectId) missingEnvs.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!storageBucket) missingEnvs.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!apiKey) missingEnvs.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!authDomain) missingEnvs.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!messagingSenderId)
    missingEnvs.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!appId) missingEnvs.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  if (missingEnvs.length > 0) {
    console.warn(
      "Firebase 환경변수가 설정되지 않았습니다. Firebase 기능이 비활성화됩니다."
    );
    console.warn(`필요한 환경변수: ${missingEnvs.join(", ")}`);
  } else {
    try {
      // Service Account 키가 있으면 Service Account 방식 사용 (권장)
      if (clientEmail && privateKey) {
        const serviceAccount = {
          type: "service_account",
          project_id: projectId,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: privateKey.replace(/\\n/g, "\n"),
          client_email: clientEmail,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri:
            process.env.FIREBASE_AUTH_URI ||
            "https://accounts.google.com/o/oauth2/auth",
          token_uri:
            process.env.FIREBASE_TOKEN_URI ||
            "https://oauth2.googleapis.com/token",
        };

        admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
          ),
          storageBucket,
        });
        console.log("✅ Firebase Admin SDK 초기화 완료 (Service Account 방식)");
        console.log(`📁 프로젝트: ${projectId}`);
        console.log(`💾 스토리지: ${storageBucket}`);
        console.log(`📧 Service Account: ${clientEmail}`);
      } else {
        console.warn("⚠️ Service Account 키가 설정되지 않았습니다.");
        console.warn(
          "   FIREBASE_SETUP.md를 참조하여 Service Account를 설정하세요."
        );
        console.warn("   누락된 환경 변수:");
        if (!clientEmail) console.warn("   - FIREBASE_CLIENT_EMAIL");
        if (!privateKey) console.warn("   - FIREBASE_PRIVATE_KEY");
        // Client SDK로 초기화
        const firebaseConfig = {
          apiKey,
          authDomain,
          projectId,
          storageBucket,
          messagingSenderId,
          appId,
        };

        const clientApp = initializeApp(firebaseConfig);
        console.log("Firebase Client SDK 초기화 완료");
        console.log(`프로젝트: ${projectId}`);
        console.log(`Auth Domain: ${authDomain}`);
        console.log(`스토리지: ${storageBucket}`);
        console.log(`App ID: ${appId}`);
        console.log(`Messaging Sender ID: ${messagingSenderId}`);
      }
    } catch (error) {
      console.error("Firebase Admin SDK 초기화 실패:", error);
    }
  }
}

// Storage 인스턴스 내보내기 (안전하게)
export const storage = admin.apps.length > 0 ? getStorage() : null;
export const bucket = storage ? storage.bucket() : null;

// Client SDK Storage 인스턴스 (Admin SDK가 없을 때만 사용)
let clientStorage: any = null;
try {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.apiKey
  ) {
    // 고유한 앱 이름으로 Client SDK 초기화
    const clientApp = initializeApp(firebaseConfig, `client-app-${Date.now()}`);
    clientStorage = getClientStorage(clientApp);
    console.log("Firebase Client SDK Storage 초기화 완료");
  }
} catch (error) {
  console.warn("Client SDK 초기화 실패:", error);
}

export const clientFirebaseStorage = clientStorage;
export default admin;
