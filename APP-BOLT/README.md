# 🏠 Korean Airbnb Clone App (FT-BOLT)

한국 숙박 예약 플랫폼 - React Native & Expo로 제작된 에어비앤비 클론 앱

## ✨ 주요 기능

### 🇰🇷 **완전한 한국어 현지화**

- 모든 UI 텍스트 한국어 번역
- 한국 원화(₩) 표시
- 한국 지역 기반 숙소 데이터

### 🏘️ **한국 숙소 브라우징**

- **8개 주요 지역**: 제주도, 서울, 부산, 강릉, 경주, 여수, 설악산, 전주
- **16개 카테고리**: 전망좋은 🌅, 자연 🌲, 한옥 🏠, 해변 🏖️, 산 ⛰️ 등
- 가격대: ₩75,000 - ₩120,000/박

### 📱 **핵심 기능**

- ✅ 숙소 검색 및 필터링
- ✅ 위시리스트 저장/해제
- ✅ 여행 관리 (예정/지난 여행)
- ✅ 숙소 상세 정보 (이미지, 편의시설, 리뷰)
- ✅ 지도 보기 (웹/모바일)
- ✅ 프로필 관리
- ✅ 로그인/회원가입 UI

## 🛠️ 기술 스택

- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **UI Components**: Custom components with TypeScript
- **Icons**: Lucide React Native
- **Maps**: React Native Maps
- **Styling**: StyleSheet with custom theme system

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 앱 실행

```bash
npx expo start
```

### 3. 플랫폼별 실행

- **iOS**: Expo Go 앱에서 QR 코드 스캔
- **Android**: Expo Go 앱에서 QR 코드 스캔
- **Web**: `w` 키 누르거나 `http://localhost:8081` 접속

## 📁 프로젝트 구조

```
FT-BOLT/
├── app/                    # Expo Router 기반 라우팅
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── index.tsx      # 홈 화면
│   │   ├── search.tsx     # 검색 화면
│   │   ├── wishlists.tsx  # 위시리스트
│   │   ├── trips.tsx      # 여행 관리
│   │   └── profile.tsx    # 프로필
│   ├── (auth)/            # 인증 화면
│   │   ├── login.tsx      # 로그인
│   │   └── register.tsx   # 회원가입
│   ├── property/          # 숙소 상세
│   │   └── [id].tsx       # 동적 라우팅
│   └── _layout.tsx        # 루트 레이아웃
├── components/            # 재사용 컴포넌트
├── data/                  # 목업 데이터
├── utils/                 # 유틸리티 함수
└── assets/               # 이미지, 폰트 등
```

## 🎨 주요 화면

### 🏠 홈 화면

- 카테고리별 숙소 브라우징
- 검색 기능
- 지도 보기 버튼

### 🔍 검색 화면

- 리스트/지도 뷰 전환
- 필터링 옵션
- 실시간 검색

### ❤️ 위시리스트

- 저장된 숙소 관리
- 하트 아이콘으로 저장/해제

### 🧳 여행 관리

- 예정된 여행
- 지난 여행 기록

### 👤 프로필

- 계정 관리
- 로그인/로그아웃
- 설정 메뉴

## 🌟 특별한 점

### 🇰🇷 **한국 특화 기능**

- 한국 전통 숙소 (한옥) 카테고리
- 한국 관광지 기반 위치 데이터
- 한국어 UI/UX 최적화

### 📱 **반응형 디자인**

- 모바일 우선 설계
- 태블릿 지원 (2열 레이아웃)
- 웹 호환성

### 🎯 **사용자 경험**

- 부드러운 애니메이션
- 직관적인 네비게이션
- 빠른 로딩 성능

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Korean Airbnb Clone App - FT-BOLT 버전

---

**🚀 한국의 아름다운 숙소를 찾아보세요!**
