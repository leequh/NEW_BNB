import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import KakaoMapView from '@/components/KakaoMapView';
import Typography from '@/components/Typography';
import { colors, spacing } from '@/utils/theme';
import { apiService, Room } from '@/services/api';

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoomsForMap();
  }, []);

  const loadRoomsForMap = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms({
        page: 1,
        limit: 50, // 지도에서는 더 많은 숙소를 보여줌
      });

      if (response.success && response.data) {
        const roomsData = response.data.data || response.data;
        const allRooms = Array.isArray(roomsData) ? roomsData : [];
        setRooms(allRooms);
      }
    } catch (error) {
      console.error('지도용 숙소 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (markerId: string) => {
    const room = rooms.find((room) => room.id.toString() === markerId);
    if (room) {
      router.push(`/property/${room.id}`);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // 숙소 데이터를 지도 마커로 변환
  const markers = rooms
    .filter((room) => room.lat && room.lng) // 좌표가 있는 숙소만
    .map((room) => ({
      id: room.id.toString(),
      latitude: parseFloat(room.lat),
      longitude: parseFloat(room.lng),
      title: room.title,
      description: room.desc,
    }));

  // 서울 시청 기본 좌표
  const defaultLatitude = 37.565337;
  const defaultLongitude = 126.9772095;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>

        <Typography variant="h3" weight="semiBold" style={styles.headerTitle}>
          지도에서 찾기
        </Typography>

        <View style={styles.headerRight}>
          <Typography variant="caption" color={colors.neutral[600]}>
            {markers.length}개 숙소
          </Typography>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <KakaoMapView
          latitude={defaultLatitude}
          longitude={defaultLongitude}
          markers={markers}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Typography variant="body2" color={colors.neutral[600]}>
            숙소를 불러오는 중...
          </Typography>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  mapContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
