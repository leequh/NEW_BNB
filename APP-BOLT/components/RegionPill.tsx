import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from './Typography';
import { colors, spacing, borderRadius } from '@/utils/theme';
import { Region } from '@/types';

interface RegionPillProps {
  region: Region;
  isSelected: boolean;
  onSelect?: (regionId: string) => void;
  navigateToRegion?: boolean;
}

export default function RegionPill({
  region,
  isSelected,
  onSelect,
  navigateToRegion = false,
}: RegionPillProps) {
  const router = useRouter();

  // 지역 이름을 URL 경로로 변환
  const getRegionRoute = (regionName: string) => {
    const regionRouteMap: { [key: string]: string } = {
      서울: 'seoul',
      경기: 'gyeonggi',
      부산: 'busan',
      제주: 'jeju',
    };
    return regionRouteMap[regionName] || regionName.toLowerCase();
  };

  const handlePress = () => {
    if (navigateToRegion && region.name !== '전체') {
      // 지역 페이지로 네비게이션
      const route = getRegionRoute(region.name);
      router.push(`/region/${route}`);
    } else if (onSelect) {
      // 기존 방식 (메인 페이지 내 필터링)
      onSelect(region.id);
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
          {region.icon}
        </Typography>
        <Typography
          variant="caption"
          weight={isSelected ? 'semiBold' : 'regular'}
          color={isSelected ? colors.white : colors.neutral[600]}
          style={styles.text}
          numberOfLines={1}
        >
          {region.name}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    minWidth: 80,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
  selected: {
    backgroundColor: colors.primary.default,
    borderColor: colors.primary.default,
  },
  content: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 13,
  },
});
