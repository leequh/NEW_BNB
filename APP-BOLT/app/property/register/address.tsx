import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin } from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';

export default function AddressScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('roomForm_address');
      if (savedAddress) {
        setAddress(savedAddress);
      }
    } catch (error) {
      console.error('[PropertyRegister] Error loading saved address:', error);
    }
  };

  const validateForm = () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // AsyncStorage에 주소 저장
      await AsyncStorage.multiSet([
        ['roomForm_address', address],
        ['roomForm_lat', '37.5665'], // 기본 좌표 (서울시청)
        ['roomForm_lng', '126.9780'],
      ]);

      console.log('[PropertyRegister] Address saved:', address);

      // 다음 단계로 이동
      router.push('/property/register/features');
    } catch (error) {
      console.error('[PropertyRegister] Error saving address:', error);
      Alert.alert('오류', '주소 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    if (error) {
      setError('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          숙소 위치
        </Typography>
        <Typography variant="body2" style={styles.subtitle}>
          숙소의 위치를 입력해주세요
        </Typography>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inputGroup}>
            <Typography variant="h6" style={styles.label}>
              주소 *
            </Typography>
            <View style={styles.inputContainer}>
              <MapPin
                size={20}
                color={colors.neutral[500]}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={address}
                onChangeText={handleAddressChange}
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            {error && (
              <Typography variant="caption" style={styles.errorText}>
                {error}
              </Typography>
            )}
            <Typography variant="caption" style={styles.helperText}>
              정확한 주소를 입력하면 게스트가 숙소를 쉽게 찾을 수 있습니다.
            </Typography>
          </View>

          {/* 주소 예시 */}
          <View style={styles.exampleSection}>
            <Typography variant="h6" style={styles.exampleTitle}>
              주소 입력 예시
            </Typography>
            <View style={styles.exampleList}>
              <Typography variant="body2" style={styles.exampleItem}>
                • 서울특별시 강남구 테헤란로 123
              </Typography>
              <Typography variant="body2" style={styles.exampleItem}>
                • 부산광역시 해운대구 해운대해변로 264
              </Typography>
              <Typography variant="body2" style={styles.exampleItem}>
                • 제주특별자치도 제주시 첨단로 242
              </Typography>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            onPress={handleNext}
            loading={loading}
            style={styles.nextButton}
          >
            다음
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.neutral[900],
  },
  subtitle: {
    textAlign: 'center',
    color: colors.neutral[600],
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.neutral[900],
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.sm,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.xl + spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.neutral[900],
  },
  inputError: {
    borderColor: colors.error.default,
  },
  errorText: {
    color: colors.error.default,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
  exampleSection: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleTitle: {
    marginBottom: spacing.md,
    color: colors.neutral[900],
  },
  exampleList: {
    gap: spacing.sm,
  },
  exampleItem: {
    color: colors.neutral[600],
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  nextButton: {
    width: '100%',
  },
});
