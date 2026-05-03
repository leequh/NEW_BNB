# LUXLAS Frontend

LUXLAS 프로젝트의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Maps**: Kakao Map API
- **UI Components**: React Hot Toast

## 주요 기능

- 🏠 숙소 목록 및 상세 조회
- 🗺️ 카카오맵 연동 위치 표시
- 👤 소셜 로그인 (Google, Naver, Kakao)
- 📅 예약 시스템
- 💳 토스페이먼츠 결제 연동
- 📱 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# 소셜 로그인
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# 카카오맵
NEXT_PUBLIC_KAKAO_MAP_CLIENT=your-kakao-map-api-key

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key
```

### 3. 개발 서버 실행

```bash
yarn dev
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router
│   ├── (home)/            # 홈 레이아웃 그룹
│   ├── api/               # API 라우트
│   ├── rooms/             # 숙소 관련 페이지
│   └── users/             # 사용자 관련 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── Booking/          # 예약 관련 컴포넌트
│   ├── Map/              # 지도 관련 컴포넌트
│   └── ...
├── types/                # TypeScript 타입 정의
└── public/               # 정적 파일
```

## 주요 컴포넌트

### 인증

- NextAuth.js를 사용한 소셜 로그인
- JWT 토큰 기반 인증

### 지도

- 카카오맵 API 연동
- 숙소 위치 표시
- 반응형 지도 컴포넌트

### 예약 시스템

- 날짜 선택 및 게스트 수 설정
- 실시간 가격 계산
- 토스페이먼츠 결제 연동

## 백엔드 연동

이 프론트엔드는 별도의 백엔드 API 서버와 연동됩니다:

- Backend Repository: [BNB-BACKEND](https://github.com/omphalos-1/BNB-BACKEND)
- API Base URL: `http://localhost:5000`

## 배포

### Vercel 배포

```bash
yarn build
```

### 환경 변수

배포 시 모든 환경 변수를 설정해야 합니다.

## 라이센스

MIT License
