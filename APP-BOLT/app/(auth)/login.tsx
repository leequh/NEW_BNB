import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { X, Eye, EyeOff } from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { SimpleSocialLoginButton } from '@/components/SocialLoginButton';
import { colors, spacing, borderRadius } from '@/utils/theme';
import { apiService } from '@/services/api';
import {
  signInWithGoogle,
  signInWithKakao,
  signInWithNaver,
  SocialLoginResult,
} from '@/services/socialAuth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 주소를 입력해주세요');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Backend API를 사용한 실제 로그인
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);

      try {
        console.log('[Login] Attempting login with:', { email });

        const response = await apiService.login(email, password);

        console.log('[Login] Login successful:', response);

        if (response.success && response.data) {
          // 토큰을 AsyncStorage에 저장
          await AsyncStorage.setItem('authToken', response.data.token);
          await AsyncStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
          );

          Alert.alert(
            '로그인 성공',
            `환영합니다, ${response.data.user.name}님!`,
            [
              {
                text: '확인',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        } else {
          throw new Error(response.error || '로그인에 실패했습니다.');
        }
      } catch (error) {
        console.error('[Login] Login failed:', error);

        let errorMessage = '로그인에 실패했습니다.';

        if (error instanceof Error) {
          if (error.message.includes('404') || error.message.includes('User not found')) {
            errorMessage = '등록되지 않은 이메일입니다.\n회원가입을 먼저 진행해주세요.';
          } else if (error.message.includes('401') || error.message.includes('Invalid password')) {
            errorMessage = '비밀번호가 올바르지 않습니다.\n다시 확인해주세요.';
          } else if (error.message.includes('Network request failed') || error.message.includes('서버에 연결할 수 없습니다')) {
            errorMessage = '서버에 연결할 수 없습니다.\n잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = error.message;
          }
        }

        Alert.alert('로그인 실패', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 테스트 계정 로그인
  const handleTestLogin = async () => {
    setIsLoading(true);

    try {
      console.log('[Login] Attempting test login...');

      const response = await apiService.createTestUser();

      console.log('[Login] Test login response:', response);

      if (response.success && response.data) {
        // 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        Alert.alert(
          '로그인 성공',
          `환영합니다, ${response.data.user.name}님!`,
          [
            {
              text: '확인',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        throw new Error(response.error || '테스트 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('[Login] Test login failed:', error);

      let errorMessage = '테스트 로그인에 실패했습니다.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // SNS 로그인 처리
  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    setSocialLoading(provider);

    try {
      let socialResult: SocialLoginResult | null = null;

      switch (provider) {
        case 'google':
          socialResult = await signInWithGoogle();
          break;
        case 'kakao':
          socialResult = await signInWithKakao();
          break;
        case 'naver':
          socialResult = await signInWithNaver();
          break;
      }

      if (socialResult) {
        console.log(`[Login] ${provider} 로그인 성공:`, socialResult);

        // 백엔드에 소셜 로그인 정보 전송
        const response = await apiService.socialLogin({
          name: socialResult.name,
          email: socialResult.email,
          image: socialResult.image,
          provider: socialResult.provider,
        });

        console.log(`[Login] 백엔드 응답:`, response);

        if (response.success && response.data) {
          // 응답 구조 확인
          console.log(`[Login] 응답 데이터 구조:`, response.data);

          const token = response.data.token || response.data.data?.token;
          const user = response.data.user || response.data.data?.user;

          if (token && user) {
            // 토큰 저장
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            Alert.alert(
              '로그인 성공',
              `${provider.toUpperCase()} 로그인이 완료되었습니다!`,
              [
                {
                  text: '확인',
                  onPress: () => router.replace('/(tabs)'),
                },
              ]
            );
          } else {
            console.error(`[Login] 토큰 또는 사용자 정보가 없음:`, {
              token,
              user,
            });
            throw new Error('서버에서 올바른 인증 정보를 받지 못했습니다.');
          }
        } else {
          console.error(`[Login] 백엔드 응답 실패:`, response);
          throw new Error(response.error || '소셜 로그인에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error(`[Login] ${provider} 로그인 에러:`, error);

      let errorMessage = `${provider.toUpperCase()} 로그인에 실패했습니다.`;
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.neutral[700]} />
          </TouchableOpacity>
          <Typography variant="h3" weight="bold" align="center">
            로그인
          </Typography>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <Typography variant="h4" weight="semiBold" style={styles.welcomeText}>
            다시 오신 것을 환영합니다
          </Typography>

          <View style={styles.inputContainer}>
            <Typography
              variant="body2"
              weight="medium"
              style={styles.inputLabel}
            >
              이메일
            </Typography>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={() => validateEmail(email)}
            />
            {emailError ? (
              <Typography
                variant="caption"
                color={colors.error.default}
                style={styles.errorText}
              >
                {emailError}
              </Typography>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Typography
              variant="body2"
              weight="medium"
              style={styles.inputLabel}
            >
              비밀번호
            </Typography>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  passwordError ? styles.inputError : null,
                ]}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => validatePassword(password)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.neutral[500]} />
                ) : (
                  <Eye size={20} color={colors.neutral[500]} />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Typography
                variant="caption"
                color={colors.error.default}
                style={styles.errorText}
              >
                {passwordError}
              </Typography>
            ) : null}
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Typography
              variant="body2"
              weight="medium"
              color={colors.primary.default}
            >
              비밀번호를 잊으셨나요?
            </Typography>
          </TouchableOpacity>

          <Button
            variant="primary"
            onPress={handleLogin}
            fullWidth
            loading={isLoading}
            style={styles.loginButton}
          >
            로그인
          </Button>

          <Button
            variant="secondary"
            onPress={handleTestLogin}
            fullWidth
            loading={isLoading}
            style={styles.testLoginButton}
          >
            테스트 계정으로 로그인
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Typography
              variant="body2"
              color={colors.neutral[500]}
              style={styles.dividerText}
            >
              또는
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <Button
            variant="outline"
            onPress={() => router.push('/(auth)/register')}
            fullWidth
            style={styles.registerButton}
          >
            회원가입
          </Button>

          <View style={styles.socialLoginContainer}>
            <Typography
              variant="body2"
              color={colors.neutral[500]}
              style={styles.socialLoginTitle}
            >
              간편 로그인
            </Typography>

            <SimpleSocialLoginButton
              provider="google"
              onPress={() => handleSocialLogin('google')}
              loading={socialLoading === 'google'}
            />

            <SimpleSocialLoginButton
              provider="kakao"
              onPress={() => handleSocialLogin('kakao')}
              loading={socialLoading === 'kakao'}
            />

            <SimpleSocialLoginButton
              provider="naver"
              onPress={() => handleSocialLogin('naver')}
              loading={socialLoading === 'naver'}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    padding: spacing.xs,
  },
  formContainer: {
    padding: spacing.xl,
  },
  welcomeText: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    fontSize: 16,
    color: colors.neutral[800],
  },
  inputError: {
    borderColor: colors.error.default,
  },
  errorText: {
    marginTop: spacing.xs,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  testLoginButton: {
    marginBottom: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[300],
  },
  dividerText: {
    marginHorizontal: spacing.md,
  },
  registerButton: {
    marginBottom: spacing.xl,
  },
  socialLoginContainer: {
    marginTop: spacing.lg,
  },
  socialLoginTitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
