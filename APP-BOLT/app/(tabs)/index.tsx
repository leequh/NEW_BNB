import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from 'react-native';

import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import Typography from '@/components/Typography';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import CategoryPill from '@/components/CategoryPill';
import RegionPill from '@/components/RegionPill';
import FilterButton from '@/components/FilterButton';
import Button from '@/components/Button';
import {
  MapPin,
  Star,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

import { colors, spacing } from '@/utils/theme';
import { categories, regions } from '@/data/mockData';
import { apiService, Room } from '@/services/api';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;
const WEB_HEADER_HEIGHT = 80;

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Room[]>([]);

  // Use fixed header height to avoid SafeAreaInsets issues
  const headerHeight = Platform.OS === 'web' ? WEB_HEADER_HEIGHT : 50;

  // 디버깅용 API URL 표시
  const getApiUrl = () => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  };

  const loadRooms = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await apiService.getRooms({
        page: 1,
        limit: 20,
      });

      if (response.success && response.data) {
        const roomsData = response.data.data || response.data;
        const allRooms = Array.isArray(roomsData) ? roomsData : [];
        setRooms(allRooms);
        setFilteredProperties(allRooms);
        setFeaturedRooms(allRooms.slice(0, 3));
      } else {
        setError(response.error || '숙소 정보를 불러올 수 없습니다.');
        setRooms([]);
        setFilteredProperties([]);
        setFeaturedRooms([]);
      }
    } catch (error: any) {
      setError('네트워크 오류가 발생했습니다.');
      setRooms([]);
      setFilteredProperties([]);
      setFeaturedRooms([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const testConnection = async () => {
    console.log('[Home] Testing server connection...');
    setError(null);
    setLoading(true);

    try {
      const response = await apiService.testConnection();
      if (response.success) {
        console.log('[Home] Connection test successful');
        await loadRooms(false);
      } else {
        setError(response.error || '서버 연결에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('[Home] Connection test failed:', error);
      setError('서버 연결 테스트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRooms(false);
  }, []);

  // 초기 로딩
  useEffect(() => {
    loadRooms();
  }, []);

  // rooms 변경시 필터 재적용
  useEffect(() => {
    if (rooms.length > 0) {
      applyFilters(selectedCategory, selectedRegion);
    }
  }, [rooms, selectedCategory, selectedRegion, applyFilters]);

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
  });

  const handleSearch = () => {
    router.push('/search');
  };

  const applyFilters = useCallback(
    (categoryId: string, regionId: string) => {
      let filtered = [...rooms];

      // 카테고리 필터링
      if (categoryId !== '') {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          filtered = filtered.filter((room) => {
            const property = transformRoomToProperty(room);
            return property.category === category.name;
          });
        }
      }

      // 지역 필터링
      if (regionId !== '') {
        const region = regions.find((reg) => reg.id === regionId);
        if (region) {
          filtered = filtered.filter((room) => {
            return room.address.includes(region.name);
          });
        }
      }

      setFilteredProperties(filtered);
    },
    [rooms]
  );

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      applyFilters(categoryId, selectedRegion);
    },
    [selectedRegion, applyFilters]
  );

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      setSelectedRegion(regionId);
      applyFilters(selectedCategory, regionId);
    },
    [selectedCategory, applyFilters]
  );

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleShowMap = () => {
    // Navigate to map view
    router.push('/map');
  };

  const QuickActionCard = ({
    icon,
    title,
    subtitle,
    onPress,
    color = colors.primary.default,
  }: any) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.quickActionContent}>
        {icon}
        <View style={styles.quickActionText}>
          <Typography
            variant="body2"
            weight="semibold"
            color={colors.neutral[900]}
          >
            {title}
          </Typography>
          <Typography variant="caption" color={colors.neutral[600]}>
            {subtitle}
          </Typography>
        </View>
      </View>
      <ChevronRight size={16} color={colors.neutral[400]} />
    </TouchableOpacity>
  );

  const FeaturedCard = ({ room, index }: { room: Room; index: number }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => router.push(`/property/${room.id}`)}
    >
      <ImageBackground
        source={{
          uri:
            room.images?.[0] ||
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        }}
        style={styles.featuredImage}
        imageStyle={styles.featuredImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredBadge}>
            <Award size={12} color={colors.warning.default} />
            <Typography
              variant="caption"
              color={colors.white}
              weight="semibold"
            >
              추천
            </Typography>
          </View>
          <View style={styles.featuredInfo}>
            <Typography
              variant="body2"
              color={colors.white}
              weight="semibold"
              numberOfLines={1}
            >
              {room.title}
            </Typography>
            <Typography
              variant="caption"
              color={colors.white}
              numberOfLines={1}
            >
              {room.address}
            </Typography>
            <Typography variant="body2" color={colors.white} weight="bold">
              ₩{room.price.toLocaleString()}/박
            </Typography>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Typography variant="h2" weight="bold" color={colors.primary.default}>
            LUXLAS
          </Typography>
        </View>
        <View style={styles.enhancedSearchBar}>
          <View style={styles.searchContent}>
            <View style={styles.searchItem}>
              <Typography variant="caption" color={colors.neutral[500]}>
                어디로
              </Typography>
              <Typography variant="body2" weight="semibold">
                목적지 검색
              </Typography>
            </View>
            <View style={styles.searchDivider} />
            <View style={styles.searchItem}>
              <Typography variant="caption" color={colors.neutral[500]}>
                언제
              </Typography>
              <Typography variant="body2" weight="semibold">
                날짜 선택
              </Typography>
            </View>
            <View style={styles.searchDivider} />
            <View style={styles.searchItem}>
              <Typography variant="caption" color={colors.neutral[500]}>
                누구와
              </Typography>
              <Typography variant="body2" weight="semibold">
                게스트 추가
              </Typography>
            </View>
          </View>
          <View style={styles.searchButton}>
            <MapPin size={20} color={colors.white} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
          />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Typography variant="h1" weight="bold" color={colors.neutral[900]}>
            특별한 숙소에서{'\n'}새로운 경험을
          </Typography>
          <Typography
            variant="body1"
            color={colors.neutral[600]}
            style={{ marginTop: spacing.sm }}
          >
            전 세계 어디든, 완벽한 숙소를 찾아보세요
          </Typography>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Typography
            variant="h3"
            weight="bold"
            style={{ marginLeft: spacing.md, marginBottom: spacing.md }}
          >
            카테고리별 탐색
          </Typography>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            <CategoryPill
              category={{ id: '', name: '전체', icon: '🏠' }}
              isSelected={selectedCategory === ''}
              onSelect={handleCategorySelect}
              navigateToCategory={false}
            />
            {categories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={handleCategorySelect}
                navigateToCategory={true}
              />
            ))}
          </ScrollView>
        </View>

        {/* Regions */}
        <View style={styles.regionsSection}>
          <Typography
            variant="h3"
            weight="bold"
            style={{ marginLeft: spacing.md, marginBottom: spacing.md }}
          >
            지역별 탐색
          </Typography>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionsScrollContent}
          >
            <RegionPill
              region={{ id: '', name: '전체', icon: '🌍' }}
              isSelected={selectedRegion === ''}
              onSelect={handleRegionSelect}
              navigateToRegion={false}
            />
            {regions.map((region) => (
              <RegionPill
                key={region.id}
                region={region}
                isSelected={selectedRegion === region.id}
                onSelect={handleRegionSelect}
                navigateToRegion={true}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Typography
            variant="h3"
            weight="bold"
            style={{ marginBottom: spacing.md }}
          >
            빠른 액션
          </Typography>

          <QuickActionCard
            icon={<Star size={20} color={colors.warning.default} />}
            title="인기 숙소"
            subtitle="지금 가장 많이 예약되는 숙소"
            onPress={() => setSelectedCategory('1')}
            color={colors.warning.default}
          />

          <QuickActionCard
            icon={<TrendingUp size={20} color={colors.success.default} />}
            title="할인 중인 숙소"
            subtitle="특가로 만나는 프리미엄 숙소"
            onPress={() => setSelectedCategory('2')}
            color={colors.success.default}
          />

          <QuickActionCard
            icon={<Heart size={20} color={colors.error.default} />}
            title="내 찜 목록"
            subtitle="저장한 숙소 다시 보기"
            onPress={() => router.push('/wishlists')}
            color={colors.error.default}
          />
        </View>

        {/* Featured Section */}
        {featuredRooms.length > 0 && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <Sparkles size={20} color={colors.primary.default} />
                  <Typography variant="h3" weight="bold">
                    추천 숙소
                  </Typography>
                </View>
                <Typography variant="body2" color={colors.neutral[600]}>
                  당신을 위한 특별한 선택
                </Typography>
              </View>
              <TouchableOpacity onPress={() => router.push('/search')}>
                <Typography
                  variant="body2"
                  color={colors.primary.default}
                  weight="semibold"
                >
                  전체보기
                </Typography>
              </TouchableOpacity>
            </View>

            <FlatList
              data={featuredRooms}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `featured-${item.id}`}
              renderItem={({ item, index }) => (
                <FeaturedCard room={item} index={index} />
              )}
              contentContainerStyle={styles.featuredList}
              snapToInterval={(width - spacing.md * 3) / 2.25 + spacing.md}
              decelerationRate="fast"
              snapToAlignment="start"
            />
          </View>
        )}

        {/* Properties Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.default} />
            <Typography variant="body2" style={{ marginTop: spacing.md }}>
              완벽한 숙소를 찾고 있어요...
            </Typography>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Typography
              variant="body1"
              color={colors.error.default}
              style={{ textAlign: 'center', marginBottom: spacing.md }}
            >
              {error}
            </Typography>
            <Button variant="outline" onPress={() => loadRooms(false)}>
              다시 시도
            </Button>
          </View>
        ) : (
          <View style={styles.propertiesSection}>
            <View style={styles.sectionHeader}>
              <Typography variant="h3" weight="bold">
                {selectedCategory === '' && selectedRegion === ''
                  ? '모든 숙소'
                  : `${
                      selectedCategory === ''
                        ? ''
                        : categories.find((c) => c.id === selectedCategory)
                            ?.name + ' '
                    }${
                      selectedRegion === ''
                        ? ''
                        : regions.find((r) => r.id === selectedRegion)?.name +
                          ' '
                    }숙소`}{' '}
                ({filteredProperties.length})
              </Typography>
            </View>

            {filteredProperties.map((item) => (
              <View key={item.id} style={styles.propertyCardContainer}>
                <PropertyCard
                  property={transformRoomToProperty(item)}
                  isSaved={savedProperties.includes(item.id.toString())}
                  onToggleSave={handleToggleSave}
                />
              </View>
            ))}

            {filteredProperties.length === 0 && (
              <View style={styles.emptyContainer}>
                <Typography variant="body1" color={colors.neutral[600]}>
                  선택한 카테고리에 숙소가 없습니다.
                </Typography>
              </View>
            )}
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Map Button */}
      <View style={styles.mapButtonContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={handleShowMap}>
          <MapPin size={18} color={colors.white} />
          <Typography variant="body2" color={colors.white} weight="semibold">
            지도
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  enhancedSearchBar: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  searchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  searchDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral[200],
  },
  searchButton: {
    backgroundColor: colors.primary.default,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Quick Actions
  quickActionsSection: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },

  quickActionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },

  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  quickActionText: {
    marginLeft: spacing.md,
    flex: 1,
  },

  // Featured Section
  featuredSection: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.lg,
  },

  featuredList: {
    paddingHorizontal: spacing.md,
  },

  featuredCard: {
    width: (width - spacing.md * 3) / 2.25, // 2.25장의 카드가 보이도록 설정
    height: 200,
    marginRight: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  featuredImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  featuredImageStyle: {
    borderRadius: 16,
  },

  featuredGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.md,
  },

  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  featuredInfo: {
    gap: 2,
  },

  // Categories
  categoriesSection: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.lg,
  },

  categoriesScrollContent: {
    paddingHorizontal: spacing.md,
  },

  // Regions
  regionsSection: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.lg,
  },

  regionsScrollContent: {
    paddingHorizontal: spacing.md,
  },

  // Properties
  propertiesSection: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  propertyCardContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  propertyCardContainerTablet: {
    maxWidth: '50%',
  },

  propertiesList: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 95,
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.xl * 2,
  },

  errorContainer: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },

  emptyContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  // Floating Map Button
  mapButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 85,
    alignSelf: 'center',
    zIndex: 1000,
  },

  mapButton: {
    backgroundColor: colors.neutral[900],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
});
