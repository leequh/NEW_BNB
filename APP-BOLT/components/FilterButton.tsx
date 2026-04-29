import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import Typography from './Typography';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';

interface FilterButtonProps {
  onPress: () => void;
  filtersCount?: number;
}

export default function FilterButton({
  onPress,
  filtersCount = 0,
}: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <SlidersHorizontal size={16} color={colors.neutral[800]} />
      <Typography variant="body2" style={styles.text}>
        Filters
      </Typography>
      
      {filtersCount > 0 && (
        <View style={styles.badge}>
          <Typography variant="caption" color={colors.white} align="center">
            {filtersCount}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  text: {
    marginLeft: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primary.default,
    borderRadius: borderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
});