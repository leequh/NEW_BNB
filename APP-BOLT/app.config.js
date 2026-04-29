import 'dotenv/config';

export default {
  expo: {
    name: 'bolt-expo-nativewind',
    slug: 'bolt-expo-nativewind',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.bnbapp',
    },
    android: {
      package: 'com.yourcompany.bnbapp',
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-font', 'expo-web-browser'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // 환경변수를 앱에서 사용할 수 있도록 설정
      kakaoClientId: process.env.KAKAO_CLIENT_ID,
      kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET,
      kakaoMapApiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT,
      // Google Client ID와 Secret
      googleClientId:
        process.env.GOOGLE_CLIENT_ID ||
        '191102735161-9krhsgh8ftc99v9mvhtdbng7ur12n9m3.apps.googleusercontent.com',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Naver Client ID
      naverClientId: process.env.NAVER_CLIENT_ID,
      naverClientSecret: process.env.NAVER_CLIENT_SECRET,
    },
  },
};
