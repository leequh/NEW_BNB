# SNS 로그인 설정 가이드

## 개요

앱에 Google, Kakao, Naver 소셜 로그인 기능이 추가되었습니다. 현재는 개발 모드로 설정되어 있어 테스트 계정으로 로그인이 가능합니다.

## 현재 상태

- ✅ SNS 로그인 UI 구현 완료
- ✅ 백엔드 API 연동 완료
- ✅ 개발모드 테스트 로그인 구현
- ⚠️ 실제 SNS API 연동 필요 (Client ID 설정)

## 개발 모드 테스트

현재는 `USE_REAL_SOCIAL_LOGIN = false`로 설정되어 있어 테스트 계정으로 로그인할 수 있습니다.

### 테스트 계정 정보

- **Google**: test.google@example.com
- **Kakao**: test.kakao@example.com
- **Naver**: test.naver@example.com

## 실제 SNS 로그인 설정 방법

### 1. Google 로그인 설정

#### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 메뉴 이동
4. "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
5. 애플리케이션 유형별로 클라이언트 ID 생성:
   - iOS: iOS 앱 번들 ID 입력
   - Android: Android 패키지명과 SHA-1 서명 입력
   - Web: 승인된 리디렉션 URI 입력

#### 설정 파일 업데이트

```typescript
// constants/SocialConfig.ts
export const SOCIAL_CONFIG = {
  google: {
    clientId: {
      ios: 'YOUR_GOOGLE_IOS_CLIENT_ID',
      android: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
      web: 'YOUR_GOOGLE_WEB_CLIENT_ID',
    },
    // ...
  },
  // ...
};
```

### 2. Kakao 로그인 설정

#### Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 플랫폼 설정:
   - iOS: 번들 ID 입력
   - Android: 패키지명과 키 해시 입력
4. 카카오 로그인 활성화
5. 개인정보 수집 항목 설정 (닉네임, 프로필 사진, 이메일)

#### 설정 파일 업데이트

```typescript
// constants/SocialConfig.ts
export const SOCIAL_CONFIG = {
  kakao: {
    clientId: 'YOUR_KAKAO_CLIENT_ID',
    // ...
  },
  // ...
};
```

### 3. Naver 로그인 설정

#### Naver Developers 설정

1. [Naver Developers](https://developers.naver.com/)에 접속
2. Application > 애플리케이션 등록
3. API 설정에서 "네아로(네이버 아이디로 로그인)" 추가
4. 환경 추가:
   - iOS: URL Scheme 설정
   - Android: 패키지명과 키 해시 설정
5. 제공 정보 선택 (이름, 이메일, 프로필 사진)

#### 설정 파일 업데이트

```typescript
// constants/SocialConfig.ts
export const SOCIAL_CONFIG = {
  naver: {
    clientId: 'YOUR_NAVER_CLIENT_ID',
    clientSecret: 'YOUR_NAVER_CLIENT_SECRET',
    // ...
  },
  // ...
};
```

## 실제 로그인 활성화

설정이 완료되면 다음과 같이 변경:

```typescript
// constants/SocialConfig.ts
export const USE_REAL_SOCIAL_LOGIN = true;
```

## 네이티브 앱 설정

### iOS (app.json)

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.bnbapp",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLName": "google",
            "CFBundleURLSchemes": ["YOUR_GOOGLE_IOS_CLIENT_ID"]
          }
        ]
      }
    }
  }
}
```

### Android (app.json)

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.bnbapp",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "myapp.com"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## 보안 고려사항

1. **Client Secret 보호**: 클라이언트 시크릿은 서버에서만 사용
2. **환경변수 사용**: 프로덕션에서는 환경변수로 민감한 정보 관리
3. **HTTPS 필수**: 프로덕션 환경에서는 반드시 HTTPS 사용
4. **토큰 저장**: 액세스 토큰은 안전한 저장소에 보관

## 문제 해결

### 일반적인 오류

1. **Client ID 오류**: 플랫폼별 올바른 Client ID 사용 확인
2. **리디렉션 오류**: 등록된 리디렉션 URI와 앱 설정 일치 확인
3. **권한 오류**: 각 플랫폼에서 필요한 권한 설정 확인

### 로그 확인

개발자 도구에서 로그를 확인하여 오류 디버깅:

```
console.log('[Social Login] Error:', error);
```

## 추가 기능

### 로그아웃

```typescript
// 토큰 삭제
await AsyncStorage.removeItem('authToken');
await AsyncStorage.removeItem('user');
```

### 토큰 갱신

백엔드에서 refresh token을 사용한 토큰 갱신 로직 구현 가능

---

**참고**: 현재는 개발 모드로 테스트 가능하며, 실제 배포 시에는 각 플랫폼의 개발자 콘솔에서 앱 등록과 Client ID 발급이 필요합니다.
