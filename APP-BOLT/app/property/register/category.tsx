import React, { useState } from 'react';
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
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';

const CATEGORIES = [
  { id: '1', title: '원룸' },
  { id: '2', title: '투룸' },
  { id: '3', title: '오피스텔' },
  { id: '4', title: '아파트' },
  { id: '5', title: '고시원' },
];

export default function CategorySelectionScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategorySelect = async (categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
      // 카테고리 ID로 실제 카테고리 이름 찾기
      const selectedCategoryData = CATEGORIES.find(
        (cat) => cat.id === categoryId
      );
      const categoryName = selectedCategoryData?.title || '';
      await AsyncStorage.setItem('roomForm_category', categoryName);
    } catch (error) {
      console.error('[PropertyRegister] Error saving category:', error);
      Alert.alert('오류', '카테고리 저장 중 문제가 발생했습니다.');
    }
  };

  const handleNext = () => {
    if (!selectedCategory) {
      Alert.alert('알림', '카테고리를 선택해주세요.');
      return;
    }
    router.push('/property/register/info');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          숙소 카테고리 선택
        </Typography>
        <Typography variant="body2" style={styles.subtitle}>
          숙소의 유형을 선택해주세요
        </Typography>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(({ id, title }) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.categoryItem,
                selectedCategory === id && styles.categoryItemSelected,
              ]}
              onPress={() => handleCategorySelect(id)}
            >
              <Typography
                variant="h5"
                weight="medium"
                style={[
                  styles.categoryTitle,
                  selectedCategory === id && styles.categoryTitleSelected,
                ]}
              >
                {title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleNext}
          disabled={!selectedCategory}
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItemSelected: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.light,
  },
  categoryTitle: {
    textAlign: 'center',
    color: colors.neutral[700],
  },
  categoryTitleSelected: {
    color: colors.primary.default,
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
