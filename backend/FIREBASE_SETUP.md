# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `korean-airbnb-clone`)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. Firebase Storage 설정

1. Firebase Console에서 프로젝트 선택
2. 좌측 메뉴에서 "Storage" 클릭
3. "시작하기" 클릭
4. 보안 규칙 설정:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true; // 개발용 (운영시 수정 필요)
       }
     }
   }
   ```
5. 저장소 위치 선택 (asia-northeast3 권장)

## 3. 서비스 계정 키 생성

1. Firebase Console에서 "프로젝트 설정" (톱니바퀴 아이콘) 클릭
2. "서비스 계정" 탭 선택
3. "새 비공개 키 생성" 클릭
4. JSON 파일 다운로드 및 안전한 곳에 보관

## 4. 환경변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 입력:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/airbnb_db"

# JWT Secret
JWT_SECRET="your-jwt-secret-key-here"

# Firebase Configuration (다운로드한 JSON 파일에서 복사)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
FIREBASE_STORAGE_BUCKET="your-firebase-project-id.appspot.com"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL="http://localhost:3000"
APP_URL="http://192.168.0.41:5000"

# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Service Account 설정 (Admin SDK용)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_TYPE=service_account

# JWT 설정
JWT_SECRET=your_jwt_secret_key
```

## 5. 환경변수 값 찾기

다운로드한 JSON 파일에서 다음 값들을 복사:

- `FIREBASE_PROJECT_ID`: `project_id` 값
- `FIREBASE_CLIENT_EMAIL`: `client_email` 값
- `FIREBASE_PRIVATE_KEY`: `private_key` 값 (개행문자 `\n` 유지)
- `FIREBASE_STORAGE_BUCKET`: `project_id.appspot.com` 형태

## 6. 테스트

환경변수 설정 후 백엔드 서버를 재시작하고 이미지 업로드를 테스트해보세요.

```bash
cd backend
npm run dev
```

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `private_key`의 개행문자(`\n`)를 정확히 유지해야 합니다
- 운영 환경에서는 Firebase 보안 규칙을 더 엄격하게 설정하세요

## Service Account 키 설정 방법

### 1. Firebase Console에서 Service Account 키 생성

1. **Firebase Console** (https://console.firebase.google.com) 접속
2. 프로젝트 선택
3. **프로젝트 설정** (톱니바퀴 아이콘) 클릭
4. **서비스 계정** 탭 선택
5. **새 비공개 키 생성** 클릭
6. JSON 파일 다운로드

### 2. Service Account JSON에서 환경 변수 추출

다운로드된 JSON 파일에서 다음 값들을 추출하여 `.env` 파일에 설정:

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "YOUR_SERVICE_ACCOUNT@YOUR_PROJECT.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### 3. Storage 권한 설정

Service Account가 Storage에 접근할 수 있도록 권한을 부여해야 합니다:

1. **Google Cloud Console** (https://console.cloud.google.com) 접속
2. 동일한 프로젝트 선택
3. **IAM 및 관리자** → **IAM** 메뉴
4. Service Account 찾기 (YOUR_SERVICE_ACCOUNT@YOUR_PROJECT.iam.gserviceaccount.com)
5. **편집** 버튼 클릭
6. **역할 추가** → **Storage Admin** 또는 **Storage Object Admin** 역할 추가
7. **저장** 클릭

### 4. Firebase Storage Security Rules

Firebase Console에서 Storage → Rules 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 모든 사용자에게 읽기 허용
    match /{allPaths=**} {
      allow read: if true;
    }

    // 인증된 사용자만 업로드 허용
    match /rooms/{userId}/{fileName} {
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Admin SDK를 통한 서버 업로드 허용 (개발 단계)
    match /rooms/anonymous-user/{fileName} {
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 주의사항

- Service Account 키는 절대 버전 관리 시스템에 커밋하지 마세요
- `.env` 파일을 `.gitignore`에 추가하세요
- 프로덕션 환경에서는 환경 변수로 안전하게 관리하세요

## 문제 해결

### "Service Account 키를 확인해주세요" 오류

- Service Account JSON 파일의 모든 필드가 올바르게 환경 변수에 설정되었는지 확인
- `FIREBASE_PRIVATE_KEY`에 개행 문자(`\n`)가 포함되어 있는지 확인
- 큰따옴표로 전체 키를 감싸야 합니다

### 권한 오류

- Google Cloud Console에서 Service Account에 Storage Admin 권한이 있는지 확인
- Firebase Storage 보안 규칙이 올바르게 설정되었는지 확인

### 네트워크 오류

- Firebase project ID가 올바른지 확인
- 인터넷 연결 상태 확인
