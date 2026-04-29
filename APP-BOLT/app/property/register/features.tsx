import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CheckCircle,
  DoorOpen,
  Monitor,
  Mountain,
  Bath,
  WashingMachine,
  Wind,
  Wifi,
  Flame,
  Car,
} from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';

const FEATURES = [
  { id: 'freeCancel', title: '무료 취소', icon: CheckCircle },
  { id: 'selfCheckIn', title: '셀프 체크인', icon: DoorOpen },
  { id: 'officeSpace', title: '사무시설', icon: Monitor },
  { id: 'hasMountainView', title: '마운틴 뷰', icon: Mountain },
  { id: 'hasShampoo', title: '샴푸 및 욕실 용품', icon: Bath },
  { id: 'hasFreeLaundry', title: '무료 세탁', icon: WashingMachine },
  { id: 'hasAirConditioner', title: '에어컨', icon: Wind },
  { id: 'hasWifi', title: '무료 와이파이', icon: Wifi },
  { id: 'hasBarbeque', title: '바베큐 시설', icon: Flame },
  { id: 'hasFreeParking', title: '무료 주차', icon: Car },
];

export default function FeaturesScreen() {
  const router = useRouter();
  const [selectedFeatures, setSelectedFeatures] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedFeatures: Record<string, boolean> = {};

      for (const feature of FEATURES) {
        const value = await AsyncStorage.getItem(`roomForm_${feature.id}`);
        savedFeatures[feature.id] = value === 'true';
      }

      setSelectedFeatures(savedFeatures);
    } catch (error) {
      console.error('[PropertyRegister] Error loading saved features:', error);
    }
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // AsyncStorage에 편의시설 정보 저장
      const savePromises = FEATURES.map((feature) =>
        AsyncStorage.setItem(
          `roomForm_${feature.id}`,
          String(selectedFeatures[feature.id] || false)
        )
      );

      await Promise.all(savePromises);

      console.log('[PropertyRegister] Features saved:', selectedFeatures);

      // 다음 단계로 이동
      router.push('/property/register/images');
    } catch (error) {
      console.error('[PropertyRegister] Error saving features:', error);
      Alert.alert('오류', '편의시설 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderFeatureItem = (feature: any) => {
    const IconComponent = feature.icon;
    const isSelected = selectedFeatures[feature.id];

    return (
      <TouchableOpacity
        key={feature.id}
        style={[styles.featureItem, isSelected && styles.featureItemSelected]}
        onPress={() => toggleFeature(feature.id)}
        activeOpacity={0.7}
      >
        <View style={styles.featureContent}>
          <View style={styles.featureIcon}>
            <IconComponent
              size={24}
              color={isSelected ? colors.primary.default : colors.neutral[600]}
            />
          </View>
          <Typography
            variant="body1"
            style={[
              styles.featureTitle,
              isSelected && { color: colors.primary.default },
            ]}
          >
            {feature.title}
          </Typography>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <CheckCircle size={16} color="white" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          편의시설 선택
        </Typography>
        <Typography variant="body2" style={styles.subtitle}>
          숙소의 편의시설 정보를 추가해주세요
        </Typography>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.featuresGrid}>
          {FEATURES.map(renderFeatureItem)}
        </View>

        <View style={styles.infoSection}>
          <Typography variant="body2" style={styles.infoText}>
            선택하신 편의시설은 숙소 상세 페이지에 표시되어 게스트가 예약을
            결정하는 데 도움이 됩니다.
          </Typography>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  featuresGrid: {
    gap: spacing.sm,
  },
  featureItem: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItemSelected: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.light,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    marginRight: spacing.md,
  },
  featureTitle: {
    flex: 1,
    color: colors.neutral[700],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
  },
  infoSection: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  infoText: {
    color: colors.neutral[600],
    textAlign: 'center',
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
