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
import { colors, spacing, borderRadius } from '@/utils/theme';
import { apiService } from '@/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('이름을 입력해주세요');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('이름은 2자 이상이어야 합니다');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Backend API를 사용한 실제 회원가입
  const handleRegister = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      setIsLoading(true);

      try {
        console.log('[Register] Attempting registration with:', {
          name: name.trim(),
          email,
        });

        const response = await apiService.register({
          name: name.trim(),
          email,
          password,
        });

        console.log('[Register] Registration response:', response);

        // 성공적인 응답인지 확인
        if (
          response.success &&
          response.data &&
          response.data.token &&
          response.data.user
        ) {
          console.log('[Register] Registration successful, saving tokens...');

          // 토큰을 AsyncStorage에 저장
          await AsyncStorage.setItem('authToken', response.data.token);
          await AsyncStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
          );

          console.log('[Register] Tokens saved successfully');

          Alert.alert(
            '회원가입 성공',
            `환영합니다, ${response.data.user.name}님! 계정이 성공적으로 생성되었습니다.`,
            [
              {
                text: '확인',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        } else {
          // 실패 응답 처리
          console.log('[Register] Registration failed:', response);
          const errorMessage =
            response.error || response.message || '회원가입에 실패했습니다.';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('[Register] Registration failed:', error);

        let errorMessage = '회원가입에 실패했습니다.';

        if (error instanceof Error) {
          if (
            error.message.includes('409') ||
            error.message.includes('Email already in use')
          ) {
            errorMessage =
              '이미 사용 중인 이메일입니다.\n다른 이메일 주소를 사용해주세요.';
          } else if (error.message.includes('400')) {
            errorMessage = '입력 정보가 올바르지 않습니다.\n다시 확인해주세요.';
          } else if (
            error.message.includes('Network request failed') ||
            error.message.includes('서버에 연결할 수 없습니다')
          ) {
            errorMessage =
              '서버에 연결할 수 없습니다.\n잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = error.message;
          }
        }

        Alert.alert('회원가입 실패', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  // 테스트용 랜덤 이메일 생성
  const generateTestData = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const testEmail = `testuser${randomId}@example.com`;
    const testName = `테스트유저${randomId}`;

    setName(testName);
    setEmail(testEmail);
    setPassword('password123');
    setConfirmPassword('password123');

    // 에러 상태 초기화
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
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
            회원가입
          </Typography>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <Typography variant="h4" weight="semiBold" style={styles.welcomeText}>
            회원가입하고 시작해보세요
          </Typography>

          {/* 이름 입력 */}
          <View style={styles.inputContainer}>
            <Typography
              variant="body2"
              weight="medium"
              style={styles.inputLabel}
            >
              이름
            </Typography>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={() => validateName(name)}
            />
            {nameError ? (
              <Typography
                variant="caption"
                color={colors.error.default}
                style={styles.errorText}
              >
                {nameError}
              </Typography>
            ) : null}
          </View>

          {/* 이메일 입력 */}
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

          {/* 비밀번호 입력 */}
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
                placeholder="비밀번호를 입력하세요 (6자 이상)"
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

          {/* 비밀번호 확인 */}
          <View style={styles.inputContainer}>
            <Typography
              variant="body2"
              weight="medium"
              style={styles.inputLabel}
            >
              비밀번호 확인
            </Typography>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => validateConfirmPassword(confirmPassword)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.neutral[500]} />
                ) : (
                  <Eye size={20} color={colors.neutral[500]} />
                )}
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Typography
                variant="caption"
                color={colors.error.default}
                style={styles.errorText}
              >
                {confirmPasswordError}
              </Typography>
            ) : null}
          </View>

          <Button
            variant="primary"
            onPress={handleRegister}
            fullWidth
            loading={isLoading}
            style={styles.registerButton}
          >
            회원가입
          </Button>

          <Button
            variant="secondary"
            onPress={generateTestData}
            fullWidth
            style={styles.testButton}
          >
            🎲 랜덤 테스트 데이터 생성
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Typography
              variant="body2"
              color={colors.neutral[500]}
              style={styles.dividerText}
            >
              이미 계정이 있으신가요?
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <Button
            variant="outline"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
            style={styles.loginButton}
          >
            로그인하기
          </Button>
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
  registerButton: {
    marginBottom: spacing.xl,
  },
  testButton: {
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
  loginButton: {},
});
