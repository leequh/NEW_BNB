import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { List, MapPin, X } from 'lucide-react-native';
// Conditional import for web compatibility
let GoogleMapReact: any;
if (Platform.OS === 'web') {
  GoogleMapReact = require('google-map-react').default;
}
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import FilterButton from '@/components/FilterButton';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';
import { properties } from '@/data/mockData';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 160;
const CARD_WIDTH = width * 0.8;

interface MarkerProps {
  text: number;
  active: boolean;
  lat?: number;
  lng?: number;
  onClick?: () => void;
}

const Marker = ({ text, active }: MarkerProps) => (
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      backgroundColor: active
        ? colors.secondary.default
        : colors.primary.default,
      padding: spacing.xs,
      borderRadius: borderRadius.sm,
      minWidth: 46,
      textAlign: 'center',
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 12,
      cursor: 'pointer',
      ...(active && {
        padding: spacing.sm,
        transform: 'translate(-50%, -50%) scale(1.1)',
        zIndex: 1,
      }),
    }}
  >
    ${text}
  </div>
);

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mapView, setMapView] = useState(params.view === 'map');
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  // Use fixed safe area to avoid SafeAreaInsets issues
  const safeTop = 50;

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (activeIndex >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [activeIndex]);

  const handleBackToList = () => {
    setMapView(false);
  };

  const handleShowMap = () => {
    setMapView(true);
  };

  const handleToggleSave = (propertyId: string) => {
    setSavedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleMarkerClick = (index: number) => {
    setActiveIndex(index);
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {Platform.OS === 'web' && GoogleMapReact ? (
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: '' }} // Add your Google Maps API key here
            defaultCenter={{
              lat: properties[0].coordinates.latitude,
              lng: properties[0].coordinates.longitude,
            }}
            defaultZoom={13}
          >
            {properties.map((property, index) => (
              <Marker
                key={property.id}
                lat={property.coordinates.latitude}
                lng={property.coordinates.longitude}
                text={property.price}
                active={activeIndex === index}
                onClick={() => handleMarkerClick(index)}
              />
            ))}
          </GoogleMapReact>
        </div>
      ) : (
        <View style={[styles.mapPlaceholder]}>
          <MapPin size={48} color={colors.primary.default} />
          <Typography
            variant="h4"
            weight="semiBold"
            style={{ marginTop: spacing.md }}
          >
            지도 보기
          </Typography>
          <Typography
            variant="body2"
            color={colors.neutral[600]}
            style={{ textAlign: 'center' }}
          >
            웹 플랫폼에서 지도를 사용할 수 있습니다
          </Typography>
        </View>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={properties}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        contentContainerStyle={styles.mapCardList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20)
          );
          setActiveIndex(index);
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/property/${item.id}`)}
          >
            <Animated.View
              style={[
                styles.mapCard,
                {
                  opacity: scrollX.interpolate({
                    inputRange: [
                      (index - 1) * (CARD_WIDTH + 20),
                      index * (CARD_WIDTH + 20),
                      (index + 1) * (CARD_WIDTH + 20),
                    ],
                    outputRange: [0.7, 1, 0.7],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <View style={styles.mapCardContent}>
                <View style={styles.mapCardImageContainer}>
                  <Animated.Image
                    source={{ uri: item.images[0] }}
                    style={styles.mapCardImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.mapCardDetails}>
                  <Typography variant="subtitle2" numberOfLines={1}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={colors.neutral[600]}
                    numberOfLines={1}
                    style={styles.mapCardLocation}
                  >
                    {item.location}
                  </Typography>
                  <View style={styles.mapCardPriceRow}>
                    <Typography variant="subtitle2" weight="semiBold">
                      ₩{item.price.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color={colors.neutral[600]}>
                      /박
                    </Typography>
                  </View>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.backButton, { top: safeTop + 10 }]}
        onPress={handleBackToList}
      >
        <List size={20} color={colors.neutral[800]} />
      </TouchableOpacity>
    </View>
  );

  const renderListView = () => (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="목적지 검색"
            autoFocus={false}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterButton onPress={() => {}} filtersCount={0} />
        </View>
      </View>

      <FlatList
        data={properties}
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
              isSaved={savedProperties.includes(item.id)}
              onToggleSave={handleToggleSave}
            />
          </View>
        )}
        contentContainerStyle={styles.propertiesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Typography variant="h3" weight="bold">
              숙소
            </Typography>
            <Typography
              variant="body1"
              color={colors.neutral[600]}
              style={styles.resultsCount}
            >
              {properties.length}개 숙소
            </Typography>
          </View>
        }
      />

      <View style={styles.mapButtonContainer}>
        <Button
          variant="primary"
          leftIcon={<MapPin size={18} color={colors.white} />}
          onPress={handleShowMap}
        >
          지도
        </Button>
      </View>
    </View>
  );

  return mapView ? renderMapView() : renderListView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  filterContainer: {
    justifyContent: 'center',
  },
  listHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  resultsCount: {
    marginTop: spacing.xs,
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
  mapButtonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    zIndex: 100,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.xl,
  },
  mapCardList: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 10,
  },
  mapCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  mapCardContent: {
    flexDirection: 'row',
    height: '100%',
  },
  mapCardImageContainer: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
    overflow: 'hidden',
  },
  mapCardImage: {
    width: '100%',
    height: '100%',
  },
  mapCardDetails: {
    width: '60%',
    padding: spacing.md,
    justifyContent: 'center',
  },
  mapCardLocation: {
    marginTop: 2,
  },
  mapCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});
