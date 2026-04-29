import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import { Heart } from 'lucide-react-native';
import Typography from '@/components/Typography';
import PropertyCard from '@/components/PropertyCard';
import { colors, spacing } from '@/utils/theme';
import { properties } from '@/data/mockData';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WishlistsScreen() {
  const router = useRouter();
  const [savedProperties, setSavedProperties] = useState<string[]>([
    '1',
    '3',
    '5',
  ]);

  // Use fixed safe area to avoid SafeAreaInsets issues
  const safeTop = 50;

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const savedPropertiesList = properties.filter((property) =>
    savedProperties.includes(property.id)
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Heart size={50} color={colors.primary.default} />
      </View>
      <Typography variant="h3" weight="bold" align="center">
        아직 저장된 장소가 없습니다
      </Typography>
      <Typography
        variant="body1"
        color={colors.neutral[600]}
        align="center"
        style={styles.emptyText}
      >
        마음에 드는 장소를 찾으면 하트 아이콘을 눌러 위시리스트에 저장하세요.
      </Typography>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">
          위시리스트
        </Typography>
      </View>

      {savedPropertiesList.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedPropertiesList}
          keyExtractor={(item) => item.id}
          numColumns={width > 768 ? 2 : 1}
          key={width > 768 ? 'two-columns' : 'one-column'}
          renderItem={({ item }) => (
            <View
              style={[
                styles.propertyCardContainer,
                width > 768 && styles.propertyCardContainerTablet,
              ]}
            >
              <PropertyCard
                property={item}
                isSaved={true}
                onToggleSave={handleToggleSave}
              />
            </View>
          )}
          contentContainerStyle={styles.propertiesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Typography variant="subtitle1" color={colors.neutral[600]}>
                {savedPropertiesList.length}개 저장된 숙소
              </Typography>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  listHeader: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  propertiesList: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 95,
  },
  propertyCardContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  propertyCardContainerTablet: {
    maxWidth: '50%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
