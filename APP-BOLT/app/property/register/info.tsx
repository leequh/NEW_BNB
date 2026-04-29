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
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';

export default function InfoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    bedroomDesc: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedTitle = await AsyncStorage.getItem('roomForm_title');
      const savedDesc = await AsyncStorage.getItem('roomForm_desc');
      const savedPrice = await AsyncStorage.getItem('roomForm_price');
      const savedBedroomDesc = await AsyncStorage.getItem(
        'roomForm_bedroomDesc'
      );

      setFormData({
        title: savedTitle || '',
        desc: savedDesc || '',
        price: savedPrice || '',
        bedroomDesc: savedBedroomDesc || '',
      });
    } catch (error) {
      console.error('[PropertyRegister] Error loading saved data:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '숙소 이름을 입력해주세요.';
    } else if (formData.title.length > 30) {
      newErrors.title = '숙소 이름은 30자 이내로 입력해주세요.';
    }

    if (!formData.desc.trim()) {
      newErrors.desc = '숙소 설명을 입력해주세요.';
    }

    if (!formData.price.trim()) {
      newErrors.price = '숙소 가격을 입력해주세요.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    }

    if (!formData.bedroomDesc.trim()) {
      newErrors.bedroomDesc = '침실 설명을 입력해주세요.';
    } else if (formData.bedroomDesc.length > 100) {
      newErrors.bedroomDesc = '침실 설명은 100자 이내로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // AsyncStorage에 데이터 저장
      await AsyncStorage.multiSet([
        ['roomForm_title', formData.title],
        ['roomForm_desc', formData.desc],
        ['roomForm_price', formData.price],
        ['roomForm_bedroomDesc', formData.bedroomDesc],
      ]);

      console.log('[PropertyRegister] Info saved:', formData);

      // 다음 단계로 이동
      router.push('/property/register/address');
    } catch (error) {
      console.error('[PropertyRegister] Error saving info:', error);
      Alert.alert('오류', '정보 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 입력 시 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          숙소 기본 정보
        </Typography>
        <Typography variant="body2" style={styles.subtitle}>
          숙소의 기본 정보를 입력해주세요
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
          {/* 숙소 이름 */}
          <View style={styles.inputGroup}>
            <Typography variant="h6" style={styles.label}>
              숙소 이름 *
            </Typography>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              placeholder="숙소 이름을 입력하세요"
              maxLength={30}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {errors.title && (
              <Typography variant="caption" style={styles.errorText}>
                {errors.title}
              </Typography>
            )}
          </View>

          {/* 숙소 설명 */}
          <View style={styles.inputGroup}>
            <Typography variant="h6" style={styles.label}>
              숙소 설명 *
            </Typography>
            <TextInput
              style={[styles.textArea, errors.desc && styles.inputError]}
              value={formData.desc}
              onChangeText={(text) => updateFormData('desc', text)}
              placeholder="숙소에 대한 상세한 설명을 입력하세요"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {errors.desc && (
              <Typography variant="caption" style={styles.errorText}>
                {errors.desc}
              </Typography>
            )}
          </View>

          {/* 숙소 가격 */}
          <View style={styles.inputGroup}>
            <Typography variant="h6" style={styles.label}>
              숙소 가격 (1박 기준) *
            </Typography>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={(text) => updateFormData('price', text)}
              placeholder="100000"
              keyboardType="numeric"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {errors.price && (
              <Typography variant="caption" style={styles.errorText}>
                {errors.price}
              </Typography>
            )}
          </View>

          {/* 침실 설명 */}
          <View style={styles.inputGroup}>
            <Typography variant="h6" style={styles.label}>
              침실 설명 *
            </Typography>
            <TextInput
              style={[styles.textArea, errors.bedroomDesc && styles.inputError]}
              value={formData.bedroomDesc}
              onChangeText={(text) => updateFormData('bedroomDesc', text)}
              placeholder="침실에 대한 설명을 입력하세요 (예: 킹사이즈 침대가 있는 넓은 침실)"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={100}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {errors.bedroomDesc && (
              <Typography variant="caption" style={styles.errorText}>
                {errors.bedroomDesc}
              </Typography>
            )}
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
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.neutral[900],
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.neutral[900],
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.neutral[900],
    minHeight: 100,
  },
  inputError: {
    borderColor: colors.error.default,
  },
  errorText: {
    color: colors.error.default,
    marginTop: spacing.xs,
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
