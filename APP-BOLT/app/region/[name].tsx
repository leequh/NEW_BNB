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
import { regions, properties } from '@/data/mockData';

export default function RegionScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 지역 이름 매핑
  const regionNameMap: { [key: string]: string } = {
    seoul: '서울',
    gyeonggi: '경기',
    busan: '부산',
    jeju: '제주',
  };

  const currentRegionName = regionNameMap[name || ''] || name;

  // 현재 지역 정보 찾기
  const currentRegion = regions.find(
    (region) => region.name === currentRegionName
  );

  // Backend Room 데이터를 PropertyCard에서 사용하는 Property 형식으로 변환
  const transformRoomToProperty = (room: Room) => ({
    id: room.id.toString(),
    title: room.title,
    description: room.desc,
    location: room.address,
    price: room.price,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10,
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
  });

  const loadRegionRooms = async (pageNum = 1, showLoading = true) => {
    if (showLoading && pageNum === 1) {
      setLoading(true);
    } else if (pageNum > 1) {
      setLoadingMore(true);
    }
    setError(null);

    try {
      // 백엔드에서 지역별 데이터 로드
      const response = await apiService.getRooms({
        page: pageNum,
        limit: 10,
      });

      if (response.success && response.data) {
        const roomsData = response.data.data || response.data;
        let allRooms = Array.isArray(roomsData) ? roomsData : [];

        // 지역별 필터링
        if (currentRegionName) {
          allRooms = allRooms.filter((room) =>
            room.address.includes(currentRegionName)
          );
        }

        // 백엔드 데이터가 없을 경우 mock 데이터 사용
        if (allRooms.length === 0) {
          const mockRooms = properties
            .filter((property) => property.location.includes(currentRegionName))
            .slice((pageNum - 1) * 10, pageNum * 10)
            .map((property) => ({
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

        if (pageNum === 1) {
          setRooms(allRooms);
        } else {
          setRooms((prevRooms) => [...prevRooms, ...allRooms]);
        }

        // 더 이상 데이터가 없는지 확인
        setHasMoreData(allRooms.length === 10);
      } else {
        // 백엔드 실패 시 mock 데이터 사용
        const mockRooms = properties
          .filter((property) => property.location.includes(currentRegionName))
          .slice((pageNum - 1) * 10, pageNum * 10)
          .map((property) => ({
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

        if (pageNum === 1) {
          setRooms(mockRooms);
        } else {
          setRooms((prevRooms) => [...prevRooms, ...mockRooms]);
        }

        setHasMoreData(mockRooms.length === 10);
      }
    } catch (error: any) {
      console.error('[RegionScreen] Error loading rooms:', error);
      // 에러 시에도 mock 데이터 사용
      const mockRooms = properties
        .filter((property) => property.location.includes(currentRegionName))
        .slice((pageNum - 1) * 10, pageNum * 10)
        .map((property) => ({
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

      if (pageNum === 1) {
        setRooms(mockRooms);
      } else {
        setRooms((prevRooms) => [...prevRooms, ...mockRooms]);
      }

      setHasMoreData(mockRooms.length === 10);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    loadRegionRooms(1, false);
  }, [currentRegionName]);

  const loadMoreData = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadRegionRooms(nextPage, false);
    }
  }, [page, loadingMore, hasMoreData]);

  useEffect(() => {
    if (currentRegionName) {
      loadRegionRooms(1);
    }
  }, [currentRegionName]);

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShowMap = () => {
    router.push('/map');
  };

  const renderPropertyCard = ({ item }: { item: Room }) => (
    <View style={styles.propertyCardContainer}>
      <PropertyCard
        property={transformRoomToProperty(item)}
        onToggleSave={handleToggleSave}
        isSaved={savedProperties.includes(item.id.toString())}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Typography variant="h2" weight="bold" style={styles.headerTitle}>
            {currentRegion?.icon} {currentRegionName}
          </Typography>
          <Typography variant="body2" color={colors.neutral[600]}>
            {rooms.length}개의 숙소
          </Typography>
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={handleShowMap}>
          <MapPin size={20} color={colors.neutral[800]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary.default} />
        <Typography
          variant="caption"
          color={colors.neutral[500]}
          style={{ marginTop: spacing.sm }}
        >
          더 많은 숙소를 불러오는 중...
        </Typography>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Typography
        variant="h3"
        weight="bold"
        style={{ marginBottom: spacing.sm }}
      >
        😔 검색 결과가 없습니다
      </Typography>
      <Typography
        variant="body1"
        color={colors.neutral[600]}
        style={{ textAlign: 'center' }}
      >
        {currentRegionName}에 등록된 숙소가 없습니다.{'\n'}다른 지역을
        확인해보세요.
      </Typography>
      <Button
        variant="outline"
        onPress={() => router.back()}
        style={{ marginTop: spacing.lg }}
      >
        다른 지역 보기
      </Button>
    </View>
  );

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.default} />
          <Typography variant="body2" style={{ marginTop: spacing.md }}>
            {currentRegionName} 숙소를 찾고 있어요...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={rooms}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => `region-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
          />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? renderEmpty : null}
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
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.neutral[50],
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  mapButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.neutral[50],
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  propertyCardContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl * 2,
  },
});
