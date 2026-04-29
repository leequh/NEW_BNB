# NextBNB Backend

이 폴더에는 NextBNB 애플리케이션의 백엔드 코드가 포함되어 있습니다.

## 기술 스택

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT 인증

## 시작하기

### 🚀 GitHub에서 클론 후 개발 환경 설정

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd fastcampus-nextbnb-backend
```

#### 2. 의존성 설치

```bash
# yarn 사용 (권장)
yarn install

# 또는 npm 사용
npm install
```

#### 3. 환경변수 파일 생성

`.env` 파일을 루트 디렉토리에 생성하고 다음 내용을 추가하세요:

```bash
# 서버 설정
PORT=5000
NODE_ENV=development

# 데이터베이스 연결 URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextbnb"
# SQLite 사용시: "file:./dev.db"

# JWT 인증 설정
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="7d"

# CORS 설정
CORS_ORIGIN="http://localhost:3000"

# 파일 업로드 경로 (필요시)
UPLOAD_PATH="./uploads"
```

> ⚠️ **중요**: `JWT_SECRET`은 반드시 안전한 랜덤 문자열로 변경하세요!

#### 4. 데이터베이스 설정

**PostgreSQL 사용시:**

1. PostgreSQL 서버 실행
2. 데이터베이스 생성:

```bash
createdb nextbnb
```

**SQLite 사용시 (개발용 추천):**

- `.env` 파일에서 `DATABASE_URL="file:./dev.db"` 로 설정

#### 5. Prisma 마이그레이션 및 시드 데이터

```bash
# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 생성 (선택사항)
npm run seed
# 또는
yarn seed

# Prisma Studio 실행 (데이터베이스 GUI)
npx prisma studio
```

#### 6. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
# 또는
yarn dev
```

서버가 성공적으로 실행되면 `http://localhost:5000`에서 API에 접근할 수 있습니다.

### 🔧 추가 설정

#### TypeScript 빌드

```bash
# 프로덕션 빌드
npm run build
yarn build

# 빌드된 파일 실행
npm start
yarn start
```

#### 코드 린팅

```bash
# ESLint 실행
npm run lint
yarn lint
```

## API 엔드포인트

### 인증

- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자

- `GET /api/users` - 모든 사용자 목록
- `GET /api/users/:id` - 특정 사용자 상세정보
- `PUT /api/users/:id` - 사용자 정보 업데이트

### 방(Room)

- `GET /api/rooms` - 모든 방 목록
- `GET /api/rooms/:id` - 특정 방 상세정보
- `POST /api/rooms` - 새 방 등록
- `PUT /api/rooms/:id` - 방 정보 업데이트
- `DELETE /api/rooms/:id` - 방 삭제

### 예약(Booking)

- `GET /api/bookings` - 모든 예약 목록
- `GET /api/bookings/:id` - 특정 예약 상세정보
- `GET /api/bookings/user/:userId` - 사용자의 예약 목록
- `GET /api/bookings/room/:roomId` - 방의 예약 목록
- `POST /api/bookings` - 새 예약 생성
- `PATCH /api/bookings/:id` - 예약 상태 업데이트
- `DELETE /api/bookings/:id` - 예약 취소


# ==========================================================================
## 📚 API 문서화

### 인증 API

#### 로그인

- **엔드포인트**: `POST /api/auth/login`
- **설명**: 사용자 로그인
- **요청 데이터**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "사용자 이름",
      "email": "user@example.com"
    }
  }
  ```

#### 회원가입

- **엔드포인트**: `POST /api/auth/register`
- **설명**: 새로운 사용자 등록
- **요청 데이터**:
  ```json
  {
    "name": "사용자 이름",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "user-id",
    "name": "사용자 이름",
    "email": "user@example.com"
  }
  ```

### 숙소 API

#### 숙소 등록

- **엔드포인트**: `POST /api/rooms`
- **설명**: 새로운 숙소 등록 (인증 필요)
- **요청 데이터**:
  ```json
  {
    "title": "아름다운 바다뷰 아파트",
    "address": "서울시 강남구",
    "price": 100000,
    "description": "바다가 보이는 아름다운 아파트입니다",
    "images": ["image-url-1", "image-url-2"],
    "category": "아파트",
    "bedroomDesc": "킹사이즈 침대 2개",
    "freeCancel": true,
    "selfCheckIn": true
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "room-id",
    "title": "아름다운 바다뷰 아파트",
    "address": "서울시 강남구",
    "price": 100000,
    "createdAt": "2024-03-20T12:00:00Z"
  }
  ```

#### 숙소 목록 조회

- **엔드포인트**: `GET /api/rooms`
- **설명**: 숙소 목록 조회 (페이지네이션 지원)
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `location`: 위치 검색
  - `category`: 카테고리 필터
- **응답 데이터**:
  ```json
  {
    "page": 1,
    "data": [
      {
        "id": "room-id",
        "title": "아름다운 바다뷰 아파트",
        "address": "서울시 강남구",
        "price": 100000,
        "images": ["image-url-1", "image-url-2"]
      }
    ],
    "totalCount": 100,
    "totalPage": 10
  }
  ```

### 예약 API

#### 예약 생성

- **엔드포인트**: `POST /api/bookings`
- **설명**: 새로운 예약 생성 (인증 필요)
- **요청 데이터**:
  ```json
  {
    "roomId": "room-id",
    "checkIn": "2024-04-01",
    "checkOut": "2024-04-03",
    "guestCount": 2,
    "totalAmount": 200000,
    "totalDays": 2
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "booking-id",
    "roomId": "room-id",
    "userId": "user-id",
    "checkIn": "2024-04-01",
    "checkOut": "2024-04-03",
    "status": "PENDING",
    "totalAmount": 200000
  }
  ```

### 결제 API

#### 결제 요청

- **엔드포인트**: `POST /api/payments`
- **설명**: 결제 요청 생성 (인증 필요)
- **요청 데이터**:
  ```json
  {
    "bookingId": "booking-id",
    "amount": 200000,
    "orderId": "order-123",
    "orderName": "숙소 예약",
    "successUrl": "https://example.com/success",
    "failUrl": "https://example.com/fail"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "success": true,
    "payment": {
      "id": "payment-id",
      "amount": 200000,
      "status": "READY"
    },
    "checkoutUrl": "https://api.tosspayments.com/v1/payments/widget"
  }
  ```

### 에러 응답 형식

모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "error": "에러 메시지",
  "details": "상세 에러 정보 (선택사항)"
}
```

### 인증 헤더

인증이 필요한 API는 다음과 같은 형식의 헤더를 포함해야 합니다:

```
Authorization: Bearer <jwt-token>
```

## 📋 환경변수 템플릿

새로운 환경에서 개발할 때 다음 환경변수들을 `.env` 파일에 설정하세요:

```bash
# 필수 설정
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"

# 선택적 설정
UPLOAD_PATH="./uploads"

# 외부 API (필요시)
# GOOGLE_API_KEY="your-google-api-key"
# KAKAO_API_KEY="your-kakao-api-key"
# NAVER_API_KEY="your-naver-api-key"

# 이메일 서비스 (필요시)
# EMAIL_HOST="smtp.gmail.com"
# EMAIL_PORT=587
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASS="your-app-password"
```

## 🚨 주의사항

1. **환경변수 보안**: `.env` 파일은 절대 GitHub에 커밋하지 마세요!
2. **JWT_SECRET**: 프로덕션에서는 반드시 강력한 비밀키를 사용하세요.
3. **데이터베이스**: 개발용으로는 SQLite를, 프로덕션용으로는 PostgreSQL을 권장합니다.
4. **포트 충돌**: 다른 서비스가 포트 5000을 사용 중이라면 다른 포트로 변경하세요.
