import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from './Typography';
import { colors, spacing, borderRadius } from '@/utils/theme';
import { Category } from '@/types';

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onSelect?: (categoryId: string) => void;
  navigateToCategory?: boolean;
}

export default function CategoryPill({
  category,
  isSelected,
  onSelect,
  navigateToCategory = false,
}: CategoryPillProps) {
  const router = useRouter();

  // 카테고리 이름을 URL 경로로 변환
  const getCategoryRoute = (categoryName: string) => {
    const categoryRouteMap: { [key: string]: string } = {
      원룸: 'oneroom',
      투룸: 'tworoom',
      오피스텔: 'officetel',
      아파트: 'apartment',
      고시원: 'gosiwon',
    };
    return categoryRouteMap[categoryName] || categoryName.toLowerCase();
  };

  const handlePress = () => {
    if (navigateToCategory && category.name !== '전체') {
      // 카테고리 페이지로 네비게이션
      const route = getCategoryRoute(category.name);
      router.push(`/category/${route}`);
    } else if (onSelect) {
      // 기존 방식 (메인 페이지 내 필터링)
      onSelect(category.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Typography variant="h4" style={styles.icon}>
          {category.icon}
        </Typography>
        <Typography
          variant="caption"
          weight={isSelected ? 'semiBold' : 'regular'}
          color={isSelected ? colors.neutral[800] : colors.neutral[600]}
          style={styles.text}
          numberOfLines={1}
        >
          {category.name}
        </Typography>
      </View>
      {isSelected && <View style={styles.underline} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    minWidth: 70,
    alignItems: 'center',
    position: 'relative',
  },
  selected: {
    // Selected state styling handled by underline
  },
  content: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: 24,
    lineHeight: 28,
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: spacing.sm,
    right: spacing.sm,
    height: 2,
    backgroundColor: colors.neutral[800],
    borderRadius: 1,
  },
});
