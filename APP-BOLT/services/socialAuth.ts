import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Alert } from 'react-native';
import {
  SOCIAL_CONFIG,
  TEST_SOCIAL_CONFIG,
  USE_REAL_SOCIAL_LOGIN,
  hasValidClientIds,
} from '@/constants/SocialConfig';

export interface SocialLoginResult {
  provider: string;
  name: string;
  email: string;
  image?: string;
  accessToken?: string;
}

// 개발 모드용 테스트 소셜 로그인
const simulateSocialLogin = async (
  provider: 'google' | 'kakao' | 'naver'
): Promise<SocialLoginResult | null> => {
  // 실제 소셜 로그인 대신 테스트 데이터 반환
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

  const testConfig = TEST_SOCIAL_CONFIG[provider];
  if (testConfig && testConfig.testUser) {
    return {
      provider: testConfig.testUser.provider,
      name: testConfig.testUser.name,
      email: testConfig.testUser.email,
      image: testConfig.testUser.image,
      accessToken: `test_${provider}_token_${Date.now()}`,
    };
  }

  return null;
};

// Google 로그인
export const signInWithGoogle = async (): Promise<SocialLoginResult | null> => {
  try {
    console.log('[Google Login] Google 로그인 시작');
    console.log('[Google Login] Client ID:', SOCIAL_CONFIG.google.clientId.web);

    const redirectUri = AuthSession.makeRedirectUri();
    console.log('[Google Login] Redirect URI:', redirectUri);
    console.log('[Google Login] 이 URI를 Google Cloud Console에 등록해주세요!');

    const request = new AuthSession.AuthRequest({
      clientId: SOCIAL_CONFIG.google.clientId.web,
      scopes: [...SOCIAL_CONFIG.google.scopes],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
      state: await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        redirectUri + Math.random(),
        { encoding: Crypto.CryptoEncoding.HEX }
      ),
    });

    console.log('[Google Login] Request 설정:', {
      clientId: SOCIAL_CONFIG.google.clientId.web,
      redirectUri,
      scopes: SOCIAL_CONFIG.google.scopes,
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    console.log('[Google Login] 인증 결과:', result);

    if (result.type === 'success') {
      console.log('[Google Login] 인증 성공, 토큰 교환 시작');

      // 인증 코드를 사용해 액세스 토큰 교환
      const tokenParams: any = {
        clientId: SOCIAL_CONFIG.google.clientId.web,
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier || '',
        },
      };

      // Client Secret이 있으면 추가
      if (SOCIAL_CONFIG.google.clientSecret) {
        tokenParams.clientSecret = SOCIAL_CONFIG.google.clientSecret;
      }

      const tokenResponse = await AuthSession.exchangeCodeAsync(tokenParams, {
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      });

      console.log('[Google Login] 토큰 교환 성공');

      // 사용자 정보 가져오기
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      console.log('[Google Login] 사용자 정보 획득 성공');

      return {
        provider: 'google',
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
        accessToken: tokenResponse.accessToken,
      };
    } else if (result.type === 'error') {
      console.error('[Google Login] 인증 오류:', result.error);
      Alert.alert(
        'Google 로그인 오류',
        `오류: ${result.error?.message || result.error}`
      );
    } else {
      console.log('[Google Login] 인증 취소');
    }

    return null;
  } catch (error) {
    console.error('Google 로그인 에러:', error);
    Alert.alert(
      '로그인 실패',
      'Google 로그인에 실패했습니다. 콘솔을 확인해주세요.'
    );
    return null;
  }
};

// Kakao 로그인 (웹뷰 방식)
export const signInWithKakao = async (): Promise<SocialLoginResult | null> => {
  try {
    const redirectUri = AuthSession.makeRedirectUri();

    const request = new AuthSession.AuthRequest({
      clientId: SOCIAL_CONFIG.kakao.clientId,
      scopes: [...SOCIAL_CONFIG.kakao.scopes],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
    });

    if (result.type === 'success') {
      // 토큰 교환
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: SOCIAL_CONFIG.kakao.clientId,
          client_secret: SOCIAL_CONFIG.kakao.clientSecret,
          redirect_uri: redirectUri,
          code: result.params.code,
        }).toString(),
      });

      const tokenData = await tokenResponse.json();

      // 사용자 정보 가져오기
      const userInfoResponse = await fetch(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );
      const userInfo = await userInfoResponse.json();

      return {
        provider: 'kakao',
        name:
          userInfo.properties?.nickname ||
          userInfo.kakao_account?.profile?.nickname,
        email: userInfo.kakao_account?.email,
        image:
          userInfo.properties?.profile_image ||
          userInfo.kakao_account?.profile?.profile_image_url,
        accessToken: tokenData.access_token,
      };
    }

    return null;
  } catch (error) {
    console.error('Kakao 로그인 에러:', error);
    Alert.alert('로그인 실패', 'Kakao 로그인에 실패했습니다.');
    return null;
  }
};

// Naver 로그인
export const signInWithNaver = async (): Promise<SocialLoginResult | null> => {
  try {
    console.log('[Naver Login] 네이버 로그인 시작');
    console.log('[Naver Login] Client ID:', SOCIAL_CONFIG.naver.clientId);

    // Redirect URI를 명시적으로 설정
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'myapp',
    });
    console.log('[Naver Login] Redirect URI:', redirectUri);

    const state = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString(),
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    const request = new AuthSession.AuthRequest({
      clientId: SOCIAL_CONFIG.naver.clientId,
      scopes: [...SOCIAL_CONFIG.naver.scopes],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        state,
      },
    });

    console.log('[Naver Login] Auth Request 생성 완료');

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://nid.naver.com/oauth2.0/authorize',
    });

    console.log('[Naver Login] 인증 결과:', result);

    if (result.type === 'success') {
      console.log('[Naver Login] 인증 성공, 토큰 교환 시작');

      // 토큰 교환
      const tokenResponse = await fetch(
        'https://nid.naver.com/oauth2.0/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: SOCIAL_CONFIG.naver.clientId,
            client_secret: SOCIAL_CONFIG.naver.clientSecret,
            code: result.params.code,
            state: result.params.state,
          }).toString(),
        }
      );

      const tokenData = await tokenResponse.json();
      console.log('[Naver Login] 토큰 응답:', tokenData);

      // 사용자 정보 가져오기
      const userInfoResponse = await fetch(
        'https://openapi.naver.com/v1/nid/me',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );
      const userInfo = await userInfoResponse.json();
      console.log('[Naver Login] 사용자 정보:', userInfo);

      return {
        provider: 'naver',
        name: userInfo.response?.name,
        email: userInfo.response?.email,
        image: userInfo.response?.profile_image,
        accessToken: tokenData.access_token,
      };
    }

    console.log('[Naver Login] 인증 취소 또는 실패');
    return null;
  } catch (error) {
    console.error('Naver 로그인 에러:', error);
    Alert.alert('로그인 실패', 'Naver 로그인에 실패했습니다.');
    return null;
  }
};
