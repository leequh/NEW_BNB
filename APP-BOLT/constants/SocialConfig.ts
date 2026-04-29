import Constants from 'expo-constants';

// SNS 로그인 설정
// 실제 앱 배포 시에는 이 값들을 환경변수나 보안이 강화된 설정 파일로 관리해야 합니다.

const extra = Constants.expoConfig?.extra || {};

// 디버깅: 환경변수 로딩 상태 확인
console.log('[SocialConfig] 환경변수 로딩 상태:', {
  googleClientId: extra.googleClientId ? '설정됨' : '기본값 사용',
  googleClientSecret: extra.googleClientSecret ? '설정됨' : '없음',
  kakaoClientId: extra.kakaoClientId ? '설정됨' : '없음',
  kakaoClientSecret: extra.kakaoClientSecret ? '설정됨' : '없음',
  naverClientId: extra.naverClientId ? '설정됨' : '없음',
  naverClientSecret: extra.naverClientSecret ? '설정됨' : '없음',
});

export const SOCIAL_CONFIG = {
  google: {
    clientId: {
      // 환경변수에서 Google Client ID 읽기
      ios:
        extra.googleClientId ||
        '191102735161-9krhsgh8ftc99v9mvhtdbng7ur12n9m3.apps.googleusercontent.com',
      android:
        extra.googleClientId ||
        '191102735161-9krhsgh8ftc99v9mvhtdbng7ur12n9m3.apps.googleusercontent.com',
      web:
        extra.googleClientId ||
        '191102735161-9krhsgh8ftc99v9mvhtdbng7ur12n9m3.apps.googleusercontent.com',
    },
    clientSecret: extra.googleClientSecret,
    scopes: ['openid', 'profile', 'email'],
  },
  kakao: {
    // 환경변수에서 Kakao Client ID 읽기
    clientId: extra.kakaoClientId || 'YOUR_KAKAO_CLIENT_ID',
    clientSecret: extra.kakaoClientSecret || 'YOUR_KAKAO_CLIENT_SECRET',
    scopes: ['profile_nickname', 'profile_image', 'account_email'],
  },
  naver: {
    // 환경변수에서 Naver Client ID 읽기
    clientId: extra.naverClientId || 'YOUR_NAVER_CLIENT_ID',
    clientSecret: extra.naverClientSecret || 'YOUR_NAVER_CLIENT_SECRET',
    scopes: ['name', 'email'],
  },
} as const;

// 개발 모드에서 사용할 테스트 계정 설정
export const TEST_SOCIAL_CONFIG = {
  google: {
    // 테스트용 - 실제로는 Google OAuth 과정을 거쳐야 함
    enabled: false,
    testUser: {
      name: 'Google 테스트 사용자',
      email: 'test.google@example.com',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      provider: 'google',
    },
  },
  kakao: {
    enabled: false,
    testUser: {
      name: 'Kakao 테스트 사용자',
      email: 'test.kakao@example.com',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      provider: 'kakao',
    },
  },
  naver: {
    enabled: false,
    testUser: {
      name: 'Naver 테스트 사용자',
      email: 'test.naver@example.com',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      provider: 'naver',
    },
  },
} as const;

// 개발 모드 체크
export const isDevelopment = __DEV__;

// 실제 소셜 로그인 사용 여부
export const USE_REAL_SOCIAL_LOGIN = true; // 실제 SNS 로그인 활성화

// Client ID가 실제로 설정되었는지 확인
export const hasValidClientIds = () => {
  const googleValid =
    !SOCIAL_CONFIG.google.clientId.web.startsWith('YOUR_') &&
    SOCIAL_CONFIG.google.clientId.web !== '' &&
    SOCIAL_CONFIG.google.clientId.web !== undefined;

  const kakaoValid =
    !SOCIAL_CONFIG.kakao.clientId.startsWith('YOUR_') &&
    SOCIAL_CONFIG.kakao.clientId !== '' &&
    SOCIAL_CONFIG.kakao.clientId !== undefined;

  const naverValid =
    !SOCIAL_CONFIG.naver.clientId.startsWith('YOUR_') &&
    SOCIAL_CONFIG.naver.clientId !== '' &&
    SOCIAL_CONFIG.naver.clientId !== undefined;

  return {
    google: googleValid,
    kakao: kakaoValid,
    naver: naverValid,
    any: googleValid || kakaoValid || naverValid,
  };
};
