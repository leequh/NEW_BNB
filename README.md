# 한국형 Airbnb 클론 프로젝트

## 프로젝트 구조

```
ALL-BNB/
├── APP-BOLT/          # React Native 모바일 앱
├── frontend/          # Next.js 웹 프론트엔드
├── backend/           # Node.js/Express 백엔드 API
└── admin/            # 관리자 대시보드
```

## 주요 기능

### 통합된 카테고리 시스템
- **원룸**: 1인~2인용 소형 주거공간
- **투룸**: 2인~4인용 중형 주거공간  
- **오피스텔**: 업무와 주거가 가능한 복합공간
- **아파트**: 대형 주거공간
- **고시원**: 1인용 소형 주거공간

### 이미지 업로드 시스템
- **Firebase Storage** 연동
- **멀티파트 업로드** 지원
- **자동 이미지 최적화**
- **안전한 URL 생성**

## 설정 가이드

### 1. Firebase 설정
백엔드에서 Firebase Storage를 사용하여 이미지를 저장합니다.

```bash
# Firebase 설정 가이드 참조
cat backend/FIREBASE_SETUP.md
```

### 2. 백엔드 실행
```bash
cd backend
npm install
# .env 파일 설정 후
npm run dev
```

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

### 4. 모바일 앱 실행
```bash
cd APP-BOLT
npm install
npx expo start
```

## API 엔드포인트

### 숙소 관리
- `GET /api/rooms` - 숙소 목록 조회
- `POST /api/rooms` - 숙소 등록 (이미지 업로드 포함)
- `GET /api/rooms/:id` - 숙소 상세 조회
- `PUT /api/rooms/:id` - 숙소 정보 수정
- `DELETE /api/rooms/:id` - 숙소 삭제

### 지원 카테고리
```json
["원룸", "투룸", "오피스텔", "아파트", "고시원"]
```

## 기술 스택

### 백엔드
- **Node.js** + **Express**
- **PostgreSQL** + **Prisma ORM**
- **Firebase Storage** (이미지 저장)
- **JWT** 인증
- **Multer** (파일 업로드)

### 프론트엔드
- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **React Query**

### 모바일 앱
- **React Native**
- **Expo**
- **TypeScript**

## 개발 상태

### ✅ 완료된 기능
- 카테고리 시스템 통일 (앱 ↔ 프론트엔드 ↔ 백엔드)
- Firebase Storage 이미지 업로드 시스템
- 멀티파트 파일 업로드 API
- 숙소 등록/조회 API
- 반응형 웹 UI
- 모바일 앱 UI

### 🔄 진행 중
- Firebase 환경변수 설정
- 사용자 인증 시스템
- 예약 시스템

### 📋 예정
- 결제 시스템
- 리뷰 시스템
- 실시간 채팅

## 주의사항

1. **Firebase 설정**: `backend/FIREBASE_SETUP.md` 가이드를 따라 환경변수를 설정해야 합니다.
2. **데이터베이스**: PostgreSQL 데이터베이스가 실행 중이어야 합니다.
3. **네트워크**: 모바일 앱은 `192.168.0.41:5000`으로 백엔드에 연결됩니다.

## 문제 해결

### 이미지 업로드 실패
1. Firebase 환경변수 확인
2. 네트워크 연결 상태 확인
3. 파일 크기 제한 (5MB) 확인

### 카테고리 오류
- 허용된 카테고리: `원룸`, `투룸`, `오피스텔`, `아파트`, `고시원`만 사용 가능 

## Firebase Service Account 설정 가이드 [2025년 11월16일]

### 🔥 Service Account JSON 파일 다운로드 상세 가이드

#### 1단계: Firebase Console 접속
1. 브라우저에서 https://console.firebase.google.com 접속
2. Google 계정으로 로그인
3. 프로젝트 목록에서 **my-bnb-8aac5** 클릭

#### 2단계: 프로젝트 설정 열기
1. 화면 왼쪽 상단에 **프로젝트 개요** 옆에 **⚙️ 톱니바퀴 아이콘** 클릭
2. 드롭다운 메뉴에서 **"프로젝트 설정"** 선택

#### 3단계: 서비스 계정 탭 찾기
1. 프로젝트 설정 페이지에서 상단에 여러 탭이 보입니다:
   - 일반
   - 사용자 및 권한
   - 통합
   - **서비스 계정** ← 이것을 클릭!
   - Cloud Messaging
   
#### 4단계: 비공개 키 생성
1. 서비스 계정 탭에서 아래로 스크롤하면:
   - "Firebase Admin SDK" 섹션이 보입니다
   - "Node.js", "Python", "Java", "Go" 등의 언어 탭이 있습니다
   - **"Node.js"** 탭 선택 (기본으로 선택되어 있을 수 있음)
   
2. 화면 중간쯤에 **"새 비공개 키 생성"** 버튼이 있습니다
   - 이 버튼은 회색 또는 파란색으로 보입니다
   - 클릭!

3. 확인 팝업이 나타납니다:
   ```
   새 비공개 키 생성
   
   이 키는 Firebase 서비스에 대한 관리자 액세스를 제공합니다.
   키를 안전하게 보관하고 공개 저장소에 커밋하지 마세요.
   
   [취소]  [키 생성]
   ```
   
4. **"키 생성"** 버튼 클릭

5. 즉시 JSON 파일이 자동으로 다운로드됩니다!
   - 파일명: `my-bnb-8aac5-xxxxxxxxxxxxx.json` 형태
   - 다운로드 폴더에 저장됨

#### 5단계: JSON 파일 열어서 값 복사하기

다운로드된 JSON 파일을 메모장이나 VSCode로 열면 다음과 같은 내용:

```json
{
  "type": "service_account",
  "project_id": "my-bnb-8aac5",
  "private_key_id": "a1b2c3d4e5f6789...",  ← 이것을 복사!
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",  ← 이것을 복사!
  "client_email": "firebase-adminsdk-abc@my-bnb-8aac5.iam.gserviceaccount.com",  ← 이것을 복사!
  "client_id": "123456789012345678901",  ← 이것을 복사!
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/..."
}
```

#### 6단계: backend/.env 파일에 붙여넣기

```env
# Firebase Service Account (JSON 파일에서 복사!)
FIREBASE_PROJECT_ID=my-bnb-8aac5
FIREBASE_PRIVATE_KEY_ID=여기에_위의_private_key_id_값을_붙여넣기
FIREBASE_PRIVATE_KEY="여기에_위의_private_key_전체를_큰따옴표_포함해서_붙여넣기"
FIREBASE_CLIENT_EMAIL=여기에_위의_client_email_값을_붙여넣기
FIREBASE_CLIENT_ID=여기에_위의_client_id_값을_붙여넣기
```

### ⚠️ 중요한 팁!
- **Service Account 키**는 서버(백엔드)에서 Firebase에 접근하기 위한 관리자 권한 키입니다
- 이전에 다운로드한 "Firebase 구성 객체"와는 **다릅니다**
- Firebase 구성 객체: 프론트엔드용 (apiKey, authDomain 등)
- Service Account 키: 백엔드용 (private_key, client_email 등)

### 📍 헷갈리는 부분 정리
| 항목 | 용도 | 어디서? |
|------|------|--------|
| Firebase 구성 (apiKey 등) | 프론트엔드/앱 | 프로젝트 설정 > 일반 탭 |
| Service Account 키 | 백엔드 서버 | 프로젝트 설정 > 서비스 계정 탭 |

---

## ❓ Service Account 키가 꼭 필요한가요?

### 🎯 간단한 답변   
**필수는 아니지만, 백엔드에서는 강력 권장됩니다!**

### 📊 두 가지 방식 비교

#### 방법 1: Service Account 키 사용 (백엔드 권장 ✅)
```
백엔드 서버 → Firebase Admin SDK → Firebase Storage
                (Service Account 키)
```

**장점:**
- ✅ 서버에서 **관리자 권한**으로 완전한 제어
- ✅ Firebase Storage 보안 규칙 우회 가능
- ✅ 파일을 공개(public)로 설정 가능
- ✅ 더 안전하고 안정적
- ✅ 서버 간 통신에 최적화

**필요한 설정:**
- Service Account 키 (private_key, client_email 등)

---

#### 방법 2: Client SDK 사용 (프론트엔드용 🔄)
```
백엔드 서버 → Firebase Client SDK → Firebase Storage
                (API Key)
```

**단점:**
- ⚠️ Firebase Storage **보안 규칙**을 따라야 함
- ⚠️ 보안 규칙이 엄격하면 업로드 실패 가능
- ⚠️ 제한된 권한
- ⚠️ 프론트엔드용 SDK를 백엔드에서 사용하는 것은 비권장

**필요한 설정:**
- 기본 Firebase 구성 (apiKey, authDomain 등)
- Storage 보안 규칙 수정 필요

---

### 🔍 현재 프로젝트 상황

현재 백엔드 코드는 **두 가지 방식을 모두 지원**합니다:

1. **Service Account 키가 있으면** → Admin SDK 사용 (권장)
2. **Service Account 키가 없으면** → Client SDK로 자동 대체 (차선책)

```typescript
// backend/src/services/ImageUploadService.ts 동작 방식:
if (Service Account 키 있음) {
  ✅ Admin SDK로 업로드 (관리자 권한)
} else {
  ⚠️ Client SDK로 업로드 (제한된 권한)
  // Storage 보안 규칙이 허용해야 업로드 가능!
}
```

---

### 💡 어떤 방식을 선택해야 할까요?

#### ✅ Service Account 키 설정을 권장하는 경우:
- 백엔드 서버에서 이미지 업로드/삭제를 처리할 때
- 완전한 제어와 관리자 권한이 필요할 때
- 프로덕션 환경에서 안정적으로 운영할 때
- **← 현재 이 프로젝트가 여기에 해당!**

#### 🔄 Client SDK만 사용해도 되는 경우:
- 프론트엔드/앱에서 직접 업로드할 때
- 테스트/개발 환경에서만 임시로 사용할 때
- Storage 보안 규칙을 공개로 설정해도 괜찮을 때 (위험!)

---

### 🛠️ Service Account 키 없이 시도하려면?

Firebase Storage 보안 규칙을 **개발용으로 열어야** 합니다:

```javascript
// Firebase Console → Storage → Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // ⚠️ 모든 접근 허용 (개발용!)
    }
  }
}
```

**주의**: 이 설정은 **누구나 업로드/삭제 가능**하므로 위험합니다!

---

### 📌 결론 및 권장사항

**지금 상황에서는 Service Account 키를 설정하는 것을 강력 권장합니다:**

1. ✅ **안전성**: 서버만 업로드 권한 보유
2. ✅ **안정성**: Firebase Admin SDK는 서버용으로 최적화
3. ✅ **제어**: 파일 공개/비공개 설정 자유
4. ✅ **프로덕션**: 운영 환경에 적합

**Service Account 키 설정은 5-10분이면 완료됩니다!** 위의 가이드를 따라서 한번 설정해보세요. 😊

---

## 🚀 프로토타입용 빠른 시작 가이드

### "일단 빨리 만들고 나중에 업그레이드!"

프로토타입 단계에서는 **빠른 구현**이 우선입니다! Service Account 키 없이 시작하는 방법:

### ⚡ 1단계: Firebase Storage 활성화 및 보안 규칙 열기 (2분)

#### A. Storage가 처음이거나 Rules가 안 보이는 경우:

1. Firebase Console (https://console.firebase.google.com) 접속
2. **my-bnb-8aac5** 프로젝트 선택
3. 좌측 메뉴에서 **Storage** 클릭

4. **두 가지 경우 중 하나:**

   **경우 1: "시작하기" 버튼이 보이는 경우**
   ```
   Firebase Storage를 시작하려면
   [시작하기] 버튼 클릭!
   ```
   - **"시작하기"** 버튼 클릭
   - 보안 규칙 모드 선택 화면이 나옴:
     * **테스트 모드에서 시작** ← 이것 선택! (프로토타입용)
     * ~~프로덕션 모드에서 시작~~ (나중에)
   - **다음** 클릭
   - 저장소 위치 선택:
     * **asia-northeast3 (서울)** ← 권장!
     * 또는 asia-northeast1 (도쿄)
   - **완료** 클릭
   - Storage가 생성됩니다! (30초 정도 소요)

   **경우 2: 파일들이 보이고 상단에 탭이 있는 경우**
   - 이미 Storage가 활성화된 상태
   - 바로 아래 B 단계로 이동

#### B. Rules 설정:

1. 상단 탭에서 **Rules** 클릭
2. 에디터에 기본 규칙이 보일 것입니다

**⚠️ 중요: 테스트 모드 만료 문제**
만약 예전에 "테스트 모드"로 설정했다면, **30일 후 자동 만료**됩니다!
다음과 같은 규칙이 보인다면 만료된 것입니다:

```javascript
// ❌ 만료된 테스트 모드 (날짜가 지남)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2024, 10, 20);  // 만료됨!
    }
  }
}
```

3. 다음 코드로 **전체 교체** (만료 없는 버전):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // 프로토타입용 - 모든 접근 허용
    }
  }
}
```

6. **게시** 버튼 클릭

### ⚡ 2단계: 기본 Firebase 환경변수만 설정 (2분)

`backend/.env` 파일에 **기본 설정만** 입력:

```env
# Database
DATABASE_URL="your_database_url_here"

# JWT
JWT_SECRET="your-jwt-secret"

# Firebase 기본 구성 (프로젝트 설정 > 일반 탭에서 복사)
NEXT_PUBLIC_FIREBASE_API_KEY=여기에_apiKey_붙여넣기
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-bnb-8aac5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-bnb-8aac5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-bnb-8aac5.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_붙여넣기
NEXT_PUBLIC_FIREBASE_APP_ID=여기에_appId_붙여넣기

# Server
PORT=5000
```

### 📍 Firebase 기본 구성 찾는 방법:

1. Firebase Console → **프로젝트 설정** (⚙️)
2. **일반** 탭 (첫 번째 탭)
3. 아래로 스크롤 → **내 앱** 섹션
4. **웹 앱** 또는 **SDK 설정 및 구성** 찾기
5. 구성 객체 복사:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "my-bnb-8aac5.firebaseapp.com",  // ← NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "my-bnb-8aac5",     // ← NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "my-bnb-8aac5.appspot.com",   // ← NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123" // ← NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### ⚡ 3단계: 바로 시작! (0분)

```bash
cd backend
npm run dev
```

**이제 이미지 업로드가 작동합니다!** 🎉

### 📝 프로토타입 → 프로덕션 업그레이드 체크리스트

나중에 프로덕션으로 전환할 때 해야 할 일:

- [ ] **1단계**: Service Account 키 설정 (위의 상세 가이드 참조)
- [ ] **2단계**: Storage 보안 규칙 강화:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // 읽기는 공개
    }
    match /rooms/{userId}/{fileName} {
      allow write: if request.auth != null  // 인증된 사용자만 업로드
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```
- [ ] **3단계**: 환경변수에 Service Account 정보 추가
- [ ] **4단계**: 서버 재시작 및 테스트

### ⚠️ 프로토타입 모드 주의사항

**현재 설정 (allow read, write: if true)에서는:**
- ❌ 누구나 Firebase Storage에 파일 업로드 가능
- ❌ 누구나 파일 삭제 가능
- ❌ 스팸, 악성 파일 업로드 위험
- ✅ 데모/테스트용으로만 사용
- ✅ **절대 실제 서비스에 배포하지 마세요!**

### 🎯 권장 일정

```
📅 지금 (프로토타입 단계)
   ✅ 기본 Firebase 구성만 사용
   ✅ Storage 보안 규칙 개방
   ✅ 빠르게 기능 구현 및 테스트

📅 베타 테스트 전 (2-3주 후)
   🔒 Service Account 키 설정
   🔒 보안 규칙 강화
   🔒 사용자 인증 연동

📅 정식 출시 전
   🔐 프로덕션 환경 설정
   🔐 모니터링 설정
   🔐 백업 계획 수립
```

### 💡 결론

**지금은 프로토타입이니까:**
- ⚡ Service Account 건너뛰기 → 3분 만에 시작
- ⚡ 기본 Firebase 구성만 사용
- ⚡ Storage 규칙 개방

**나중에 업그레이드:**
- 🔒 Service Account 키 추가 (10분)
- 🔒 보안 규칙 강화 (5분)
- 🔒 완전한 프로덕션 환경 (30분)

이 방식이 훨씬 현실적입니다! 지금은 빠르게 만들어서 검증하고, 나중에 보안을 강화하세요! 🚀

---

## 🔧 예전 이미지 URL 접속 불가 문제 해결

### 예전에 업로드한 이미지 URL 예시:
```
https://firebasestorage.googleapis.com/v0/b/my-bnb-8aac5.firebasestorage.app/o/images%2F2025-04-26%2022%2053%2006.png?alt=media&token=...
```

### 🧪 문제 확인 방법:

위 URL을 브라우저 주소창에 붙여넣고 Enter를 눌렀을 때:

#### ❌ **증상 A: 403 오류 (Permission denied)**
```json
{
  "error": {
    "code": 403,
    "message": "Permission denied. Could not perform this operation"
  }
}
```

**원인**: 테스트 모드 보안 규칙이 **30일 후 자동 만료**됨  
**해결 방법**:
1. Firebase Console → Storage → **Rules** 탭
2. 기존 규칙 확인:
```javascript
// ❌ 날짜가 지나서 만료됨
allow read, write: if request.time < timestamp.date(2024, 10, 20);
```
3. 다음으로 교체:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // 만료 없음 (프로토타입용)
    }
  }
}
```
4. **게시** 버튼 클릭
5. ✅ 이제 예전 이미지들도 다시 보입니다!

---

#### ❌ **증상 B: 412 오류 (Service Account 권한 문제)** ⭐ 자주 발생!
```json
{
  "error": {
    "code": 412,
    "message": "A required service account is missing necessary permissions..."
  }
}
```

**원인**: Firebase Storage와 Google Cloud Storage 간의 연결이 끊어짐 (오랜만에 접속 시 자주 발생)

**🔧 해결 방법 (2분 소요):**

##### 방법 1: Firebase Console에서 재연결 (가장 쉬움!)

1. **Firebase Console** 접속: https://console.firebase.google.com
2. **my-bnb-8aac5** 프로젝트 선택
3. 좌측 메뉴 **Storage** 클릭
4. 화면 상단에 **노란색 경고 배너**가 보일 수 있음:
   ```
   ⚠️ Storage 버킷을 다시 연결해야 합니다
   [다시 연결] 버튼 클릭
   ```
5. 버튼이 안 보이면 → **톱니바퀴(설정)** 아이콘 찾기
6. **"버킷 설정"** 또는 **"다시 링크"** 클릭
7. 확인 팝업에서 **확인** 클릭
8. 30초 정도 기다리면 재연결 완료! ✅

##### 방법 2: Google Cloud Console에서 권한 부여

1. **Google Cloud Console** 접속: https://console.cloud.google.com
2. 프로젝트 선택: **my-bnb-8aac5**
3. 좌측 메뉴 → **IAM 및 관리자** → **IAM**
4. 다음 Service Account 찾기:
   ```
   my-bnb-8aac5@appspot.gserviceaccount.com
   또는
   firebase-adminsdk-xxxxx@my-bnb-8aac5.iam.gserviceaccount.com
   ```
5. **편집** 버튼 (연필 아이콘) 클릭
6. **역할 추가** 클릭
7. 다음 역할 추가:
   - **Storage Admin** (저장소 관리자)
   - 또는 **Storage Object Admin** (저장소 객체 관리자)
8. **저장** 클릭
9. 5분 정도 기다린 후 다시 시도

##### 방법 3: Storage 규칙을 완전 개방 (임시 해결책)

1. Firebase Console → Storage → **Rules** 탭
2. 다음 규칙으로 교체:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
3. **게시** 클릭
4. 여전히 412 오류면 → 위의 방법 1 또는 2 시도

---

#### ❌ **증상 C: 404 오류 (Not Found)**
```json
{
  "error": {
    "code": 404,
    "message": "Not Found."
  }
}
```

**원인**: 파일이 삭제되었거나 잘못된 URL  
**확인 방법**:
1. Firebase Console → Storage → **Files** 탭
2. `images/` 폴더에 파일이 있는지 확인
3. 파일이 없으면 다시 업로드 필요

---

#### ✅ **증상 C: 이미지가 정상적으로 보임**

**상태**: 문제 없음! Storage가 정상 작동 중  
**다음 단계**: 
- Storage Rules는 이미 정상
- 바로 환경변수 설정으로 이동 (위의 2단계)

---

### 💡 테스트 모드 만료 방지

Firebase는 보안상 이유로 테스트 모드를 **30일 후 자동 차단**합니다.  
프로토타입 개발 중에는 만료 없는 규칙을 사용하세요:

```javascript
// ✅ 만료 없는 프로토타입용 규칙
allow read, write: if true;

// ❌ 자동 만료되는 테스트 모드
allow read, write: if request.time < timestamp.date(2025, 1, 15);
```

⚠️ **주의**: 프로덕션 배포 전에는 반드시 보안 규칙을 강화하세요!


===================================================
  배포  backend는 render // https://dashboard.render.com/ ( 테스트단계에서)
