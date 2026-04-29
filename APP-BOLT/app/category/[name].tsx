import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, SlidersHorizontal } from 'lucide-react-native';

import Typography from '@/components/Typography';
import PropertyCard from '@/components/PropertyCard';
import Button from '@/components/Button';
import { colors, spacing } from '@/utils/theme';
import { apiService, Room } from '@/services/api';
import { categories, properties } from '@/data/mockData';

export default function CategoryScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  // 카테고리 이름 매핑
  const categoryNameMap: { [key: string]: string } = {
    oneroom: '원룸',
    tworoom: '투룸',
    officetel: '오피스텔',
    apartment: '아파트',
    gosiwon: '고시원',
  };

  const currentCategoryName = categoryNameMap[name || ''] || name;

  // 현재 카테고리 정보 찾기
  const currentCategory = categories.find(
    (cat) => cat.name === currentCategoryName
  );

  // Backend Room 데이터를 PropertyCard에서 사용하는 Property 형식으로 변환
  const transformRoomToProperty = (room: Room) => ({
    id: room.id.toString(),
    title: room.title,
    description: room.desc,
    location: room.address,
    price: room.price,
    rating: 4.5, // 기본값 (리뷰 시스템 구현시 변경)
    reviews: Math.floor(Math.random() * 100) + 10, // 임시 랜덤값
    images: room.images || [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: room.user?.id || 'unknown',
      name: room.user?.name || '호스트',
      avatar: room.user?.image || '/images/user-icon.png',
      isSuperhost: false,
    },
    amenities: [
      ...(room.hasWifi ? ['Wifi'] : []),
      ...(room.hasAirConditioner ? ['Air Conditioning'] : []),
      ...(room.hasFreeParking ? ['Parking'] : []),
    ],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: parseFloat(room.lat) || 37.565337,
      longitude: parseFloat(room.lng) || 126.9772095,
    },
    category: room.category,
  });

  const loadCategoryRooms = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      // 백엔드에서 카테고리별 데이터 로드
      const response = await apiService.getRooms({
        page: 1,
        limit: 50,
        category: currentCategoryName,
      });

      if (response.success && response.data) {
        const roomsData = response.data.data || response.data;
        let allRooms = Array.isArray(roomsData) ? roomsData : [];

        // 카테고리별 필터링 (백엔드에서 필터링되지 않은 경우를 위한 추가 필터링)
        if (currentCategoryName) {
          allRooms = allRooms.filter(
            (room) => room.category === currentCategoryName
          );
        }

        // 백엔드 데이터가 없을 경우 mock 데이터 사용
        if (allRooms.length === 0) {
          const mockRooms = properties
            .filter((property) => property.category === currentCategoryName)
            .map((property, index) => ({
              id: parseInt(property.id),
              title: property.title,
              desc: property.description,
              address: property.location,
              price: property.price,
              category: property.category,
              images: property.images,
              lat: property.coordinates.latitude.toString(),
              lng: property.coordinates.longitude.toString(),
              userId: property.host.id,
              user: {
                id: property.host.id,
                name: property.host.name,
                image: property.host.avatar,
              },
              hasWifi: property.amenities.includes('Wifi'),
              hasAirConditioner:
                property.amenities.includes('Air Conditioning'),
              hasFreeParking: property.amenities.includes('Parking'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));
          allRooms = mockRooms;
        }

        setRooms(allRooms);
      } else {
        // 백엔드 실패 시 mock 데이터 사용
        const mockRooms = properties
          .filter((property) => property.category === currentCategoryName)
          .map((property, index) => ({
            id: parseInt(property.id),
            title: property.title,
            desc: property.description,
            address: property.location,
            price: property.price,
            category: property.category,
            images: property.images,
            lat: property.coordinates.latitude.toString(),
            lng: property.coordinates.longitude.toString(),
            userId: property.host.id,
            user: {
              id: property.host.id,
              name: property.host.name,
              image: property.host.avatar,
            },
            hasWifi: property.amenities.includes('Wifi'),
            hasAirConditioner: property.amenities.includes('Air Conditioning'),
            hasFreeParking: property.amenities.includes('Parking'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
        setRooms(mockRooms);
      }
    } catch (error: any) {
      console.error('[CategoryScreen] Error loading rooms:', error);
      // 에러 시에도 mock 데이터 사용
      const mockRooms = properties
        .filter((property) => property.category === currentCategoryName)
        .map((property, index) => ({
          id: parseInt(property.id),
          title: property.title,
          desc: property.description,
          address: property.location,
          price: property.price,
          category: property.category,
          images: property.images,
          lat: property.coordinates.latitude.toString(),
          lng: property.coordinates.longitude.toString(),
          userId: property.host.id,
          user: {
            id: property.host.id,
            name: property.host.name,
            image: property.host.avatar,
          },
          hasWifi: property.amenities.includes('Wifi'),
          hasAirConditioner: property.amenities.includes('Air Conditioning'),
          hasFreeParking: property.amenities.includes('Parking'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      setRooms(mockRooms);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategoryRooms(false);
  }, [currentCategoryName]);

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShowMap = () => {
    router.push({
      pathname: '/map',
      params: { category: currentCategoryName },
    });
  };

  useEffect(() => {
    if (currentCategoryName) {
      loadCategoryRooms();
    }
  }, [currentCategoryName]);

  const renderPropertyCard = ({ item }: { item: Room }) => (
    <View style={styles.propertyCardContainer}>
      <PropertyCard
        property={transformRoomToProperty(item)}
        isSaved={savedProperties.includes(item.id.toString())}
        onToggleSave={handleToggleSave}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.titleSection}>
        <View style={styles.categoryInfo}>
          {currentCategory && (
            <Typography variant="h1" style={styles.categoryIcon}>
              {currentCategory.icon}
            </Typography>
          )}
          <View>
            <Typography variant="h2" weight="bold">
              {currentCategoryName}
            </Typography>
            <Typography variant="body2" color={colors.neutral[600]}>
              {rooms.length}개의 숙소
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={colors.neutral[600]} />
          <Typography variant="body2" color={colors.neutral[600]}>
            필터
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapButton} onPress={handleShowMap}>
          <MapPin size={20} color={colors.white} />
          <Typography variant="body2" color={colors.white} weight="semibold">
            지도
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Typography
        variant="h3"
        color={colors.neutral[400]}
        style={{ textAlign: 'center' }}
      >
        🏠
      </Typography>
      <Typography
        variant="body1"
        color={colors.neutral[600]}
        style={{ textAlign: 'center', marginTop: spacing.sm }}
      >
        {currentCategoryName} 카테고리에
      </Typography>
      <Typography
        variant="body1"
        color={colors.neutral[600]}
        style={{ textAlign: 'center' }}
      >
        등록된 숙소가 없습니다.
      </Typography>
      <Button
        variant="outline"
        style={{ marginTop: spacing.lg }}
        onPress={() => router.back()}
      >
        다른 카테고리 보기
      </Button>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          <Typography variant="h3" weight="semibold">
            {currentCategoryName}
          </Typography>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.default} />
          <Typography variant="body2" style={{ marginTop: spacing.md }}>
            {currentCategoryName} 숙소를 찾고 있어요...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Typography variant="h3" weight="semibold">
          {currentCategoryName}
        </Typography>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={rooms}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.xs,
  },
  placeholder: {
    width: 32,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerContent: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryIcon: {
    fontSize: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.white,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary.default,
  },
  propertyCardContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl * 2,
  },
});
