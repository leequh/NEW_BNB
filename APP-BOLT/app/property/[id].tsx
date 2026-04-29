import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Import react-native-maps (will be blocked on web by metro config)
import MapView, { Marker } from 'react-native-maps';
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Calendar,
  User,
  Wifi,
  Chrome as Home,
  UtensilsCrossed,
  Car,
  Tv,
  Wind,
  MessageCircle,
} from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';
import { apiService, Room } from '@/services/api';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

export default function PropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  // API 상태 관리
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Backend API에서 숙소 데이터 가져오기
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getRoom(id);
        if (response.success && response.data) {
          setRoom(response.data);
        } else {
          setError(response.error || '숙소 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch room:', err);
        setError('숙소 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // 로딩 상태
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Typography variant="body1">숙소 정보를 불러오는 중...</Typography>
      </View>
    );
  }

  // 에러 상태
  if (error || !room) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Typography variant="body1" color={colors.error.default}>
          {error || '숙소 정보를 찾을 수 없습니다.'}
        </Typography>
        <Button
          variant="outline"
          onPress={() => router.back()}
          style={{ marginTop: spacing.md }}
        >
          돌아가기
        </Button>
      </View>
    );
  }

  // Backend 데이터를 현재 UI에 맞게 변환
  const property = {
    id: room.id.toString(),
    title: room.title,
    description: room.desc,
    location: room.address,
    price: room.price,
    rating: 4.5, // 기본값 (리뷰 시스템 구현시 변경)
    reviews: 20, // 기본값 (리뷰 시스템 구현시 변경)
    images: room.images, // Backend에서 제공하는 이미지 URL 배열 직접 사용
    host: {
      id: room.user?.id || 'unknown',
      name: room.user?.name || '호스트',
      avatar: room.user?.image || '/images/user-icon.png',
      isSuperhost: false, // 기본값
    },
    amenities: [
      ...(room.hasWifi ? ['Wifi'] : []),
      ...(room.hasAirConditioner ? ['Air Conditioning'] : []),
      ...(room.hasFreeParking ? ['Parking'] : []),
      ...(room.hasFreeLaundry ? ['Laundry'] : []),
      ...(room.hasShampoo ? ['Toiletries'] : []),
      ...(room.hasBarbeque ? ['BBQ'] : []),
    ],
    bedrooms: 1, // 기본값 (bedroomDesc에서 파싱 가능)
    beds: 1, // 기본값
    baths: 1, // 기본값
    maxGuests: 2, // 기본값
    coordinates: {
      latitude: parseFloat(room.lat) || 37.565337,
      longitude: parseFloat(room.lng) || 126.9772095,
    },
  };

  // Use fixed safe area to avoid SafeAreaInsets issues
  const safeTop = 50;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderImagePagination = () => {
    return (
      <View style={styles.pagination}>
        {property.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeImageIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const onImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  const amenityIcons = {
    Wifi: <Wifi size={24} color={colors.neutral[700]} />,
    Kitchen: <UtensilsCrossed size={24} color={colors.neutral[700]} />,
    Parking: <Car size={24} color={colors.neutral[700]} />,
    TV: <Tv size={24} color={colors.neutral[700]} />,
    'Air Conditioning': <Wind size={24} color={colors.neutral[700]} />,
    Pool: <Home size={24} color={colors.neutral[700]} />,
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    // Share functionality would go here
  };

  const handleBook = () => {
    // Booking functionality would go here
  };

  const handleContact = () => {
    // Contact host functionality would go here
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[styles.header, { opacity: headerOpacity, paddingTop: safeTop }]}
      >
        <Typography variant="subtitle1" weight="semiBold" numberOfLines={1}>
          {property.title}
        </Typography>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Property Images - Backend API의 이미지 사용 */}
        <View style={styles.imageContainer}>
          {property.images && property.images.length > 0 ? (
            <FlatList
              data={property.images}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onImageScroll}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  onError={(error) => {
                    console.warn(
                      'Image loading error:',
                      error.nativeEvent.error
                    );
                  }}
                />
              )}
            />
          ) : (
            <View
              style={[
                styles.image,
                {
                  backgroundColor: colors.neutral[200],
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Typography variant="body2" color={colors.neutral[600]}>
                이미지가 없습니다
              </Typography>
            </View>
          )}
          {property.images &&
            property.images.length > 1 &&
            renderImagePagination()}
          <TouchableOpacity
            style={[styles.backButtonAbsolute, { top: safeTop + 10 }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={[styles.actionButtons, { top: safeTop + 10 }]}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Heart
                size={20}
                color={colors.white}
                fill={saved ? colors.primary.default : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title and Location */}
          <View style={styles.titleContainer}>
            <Typography variant="h3" weight="bold">
              {property.title}
            </Typography>
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.neutral[600]} />
              <Typography
                variant="body2"
                color={colors.neutral[600]}
                style={styles.locationText}
              >
                {property.location}
              </Typography>
            </View>
          </View>

          {/* Host */}
          <View style={styles.hostContainer}>
            <View style={styles.hostInfo}>
              <Image
                source={{ uri: property.host.avatar }}
                style={styles.hostImage}
              />
              <View>
                <Typography variant="subtitle2" weight="semiBold">
                  호스트: {property.host.name}
                </Typography>
                {property.host.isSuperhost && (
                  <Typography
                    variant="caption"
                    color={colors.success.default}
                    weight="medium"
                  >
                    슈퍼호스트
                  </Typography>
                )}
              </View>
            </View>
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <MessageCircle size={16} color={colors.primary.default} />
              }
              onPress={handleContact}
            >
              연락하기
            </Button>
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Typography variant="h4" weight="semiBold">
                {property.bedrooms}
              </Typography>
              <Typography variant="body2" color={colors.neutral[600]}>
                {property.bedrooms === 1 ? '침실' : '침실'}
              </Typography>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Typography variant="h4" weight="semiBold">
                {property.beds}
              </Typography>
              <Typography variant="body2" color={colors.neutral[600]}>
                {property.beds === 1 ? '침대' : '침대'}
              </Typography>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Typography variant="h4" weight="semiBold">
                {property.baths}
              </Typography>
              <Typography variant="body2" color={colors.neutral[600]}>
                {property.baths === 1 ? '욕실' : '욕실'}
              </Typography>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Typography variant="h4" weight="semiBold">
                {property.maxGuests}
              </Typography>
              <Typography variant="body2" color={colors.neutral[600]}>
                {property.maxGuests === 1 ? '게스트' : '게스트'}
              </Typography>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Typography
              variant="subtitle1"
              weight="semiBold"
              style={styles.sectionTitle}
            >
              숙소 소개
            </Typography>
            <Typography variant="body1" color={colors.neutral[700]}>
              {property.description}
            </Typography>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            <Typography
              variant="subtitle1"
              weight="semiBold"
              style={styles.sectionTitle}
            >
              숙소 편의시설
            </Typography>
            <View style={styles.amenitiesList}>
              {property.amenities.slice(0, 6).map((amenity) => (
                <View key={amenity} style={styles.amenityItem}>
                  {amenityIcons[amenity] || (
                    <Home size={24} color={colors.neutral[700]} />
                  )}
                  <Typography variant="body2" style={styles.amenityText}>
                    {amenity}
                  </Typography>
                </View>
              ))}
            </View>
            {property.amenities.length > 6 && (
              <Button variant="outline" style={styles.showAllButton}>
                편의시설 {property.amenities.length}개 모두 보기
              </Button>
            )}
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Typography
              variant="subtitle1"
              weight="semiBold"
              style={styles.sectionTitle}
            >
              위치
            </Typography>
            <View style={styles.mapContainer}>
              {Platform.OS !== 'web' ? (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: property.coordinates.latitude,
                    longitude: property.coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: property.coordinates.latitude,
                      longitude: property.coordinates.longitude,
                    }}
                  />
                </MapView>
              ) : (
                <View style={[styles.map, styles.webMapPlaceholder]}>
                  <View style={styles.mapPlaceholderContent}>
                    <MapPin size={32} color={colors.primary.default} />
                    <Typography
                      variant="subtitle2"
                      weight="semiBold"
                      style={{ marginTop: spacing.sm }}
                    >
                      {property.location}
                    </Typography>
                    <Typography variant="body2" color={colors.neutral[600]}>
                      모바일에서 지도를 볼 수 있습니다
                    </Typography>
                  </View>
                </View>
              )}
            </View>
            <Typography variant="body2" style={styles.locationDescription}>
              {property.location}
            </Typography>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Typography variant="subtitle1" weight="semiBold">
                <Star size={16} color={colors.neutral[800]} /> {property.rating}{' '}
                · {property.reviews}개 후기
              </Typography>
            </View>

            {/* Reviews would be fetched and displayed here */}
          </View>

          {/* Spacing for the fixed bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Fixed bottom bar for booking */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Typography variant="h4" weight="bold">
            ₩{property.price.toLocaleString()}
          </Typography>
          <Typography variant="body2" color={colors.neutral[600]}>
            /박
          </Typography>
        </View>
        <Button
          variant="primary"
          size="lg"
          onPress={handleBook}
          style={styles.bookButton}
        >
          예약 가능 여부 확인
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    zIndex: 10,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.white,
  },
  backButtonAbsolute: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  content: {
    padding: spacing.lg,
  },
  titleContainer: {
    marginBottom: spacing.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  locationText: {
    marginLeft: 4,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.lg,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    backgroundColor: colors.neutral[300],
  },
  descriptionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  amenitiesContainer: {
    marginBottom: spacing.xl,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: spacing.md,
  },
  amenityText: {
    marginLeft: spacing.sm,
  },
  showAllButton: {
    marginTop: spacing.sm,
  },
  locationContainer: {
    marginBottom: spacing.xl,
  },
  mapContainer: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    backgroundColor: colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  mapPlaceholderContent: {
    alignItems: 'center',
  },
  locationDescription: {
    marginTop: spacing.xs,
  },
  reviewsContainer: {
    marginBottom: spacing.xl,
  },
  reviewsHeader: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...Platform.select({
      ios: {
        paddingBottom: Math.max(spacing.md, 20),
      },
    }),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bookButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
