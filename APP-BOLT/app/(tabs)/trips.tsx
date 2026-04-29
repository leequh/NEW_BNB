import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import { format } from 'date-fns';
import { ChevronRight, Luggage } from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';
import { bookings, properties } from '@/data/mockData';

type Tab = 'upcoming' | 'past';

export default function TripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [trips, setTrips] = useState(bookings);

  // Use fixed safe area to avoid SafeAreaInsets issues
  const safeTop = 50;

  // Get property details for each booking
  const bookingsWithDetails = bookings.map((booking) => {
    const property = properties.find((p) => p.id === booking.propertyId);
    return {
      ...booking,
      property,
    };
  });

  const filteredBookings = bookingsWithDetails.filter((booking) => {
    if (activeTab === 'upcoming') {
      return booking.status === 'upcoming';
    } else {
      return booking.status === 'completed';
    }
  });

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Luggage size={50} color={colors.primary.default} />
      </View>
      <Typography variant="h3" weight="bold" align="center">
        {activeTab === 'upcoming' ? '예정된' : '지난'} 여행이 없습니다
      </Typography>
      <Typography
        variant="body1"
        color={colors.neutral[600]}
        align="center"
        style={styles.emptyText}
      >
        {activeTab === 'upcoming'
          ? '숙소를 예약하면 여기에 표시됩니다.'
          : '완료된 여행이 여기에 표시됩니다.'}
      </Typography>
      <Button
        variant="primary"
        onPress={() => router.push('/')}
        style={styles.exploreButton}
      >
        숙소 둘러보기
      </Button>
    </View>
  );

  const renderBookingItem = ({ item }: { item: any }) => {
    if (!item.property) return null;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        activeOpacity={0.7}
        onPress={() => router.push(`/property/${item.propertyId}`)}
      >
        <Image
          source={{ uri: item.property.images[0] }}
          style={styles.bookingImage}
          resizeMode="cover"
        />
        <View style={styles.bookingContent}>
          <Typography variant="subtitle1" weight="semiBold" numberOfLines={1}>
            {item.property.title}
          </Typography>

          <Typography
            variant="body2"
            color={colors.neutral[600]}
            style={styles.bookingLocation}
            numberOfLines={1}
          >
            {item.property.location}
          </Typography>

          <View style={styles.bookingDates}>
            <Typography variant="body2" weight="medium">
              {format(new Date(item.checkIn), 'MMM d')} -{' '}
              {format(new Date(item.checkOut), 'MMM d, yyyy')}
            </Typography>
          </View>

          <View style={styles.bookingStatus}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item.status === 'upcoming'
                      ? colors.success.default
                      : colors.neutral[400],
                },
              ]}
            />
            <Typography
              variant="caption"
              color={
                item.status === 'upcoming'
                  ? colors.success.default
                  : colors.neutral[600]
              }
            >
              {item.status === 'upcoming' ? '예정됨' : '완료됨'}
            </Typography>
          </View>
        </View>
        <ChevronRight size={20} color={colors.neutral[400]} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">
          여행
        </Typography>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Typography
            variant="subtitle2"
            weight={activeTab === 'upcoming' ? 'semiBold' : 'regular'}
            color={
              activeTab === 'upcoming'
                ? colors.neutral[800]
                : colors.neutral[500]
            }
          >
            예정된 여행
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Typography
            variant="subtitle2"
            weight={activeTab === 'past' ? 'semiBold' : 'regular'}
            color={
              activeTab === 'past' ? colors.neutral[800] : colors.neutral[500]
            }
          >
            지난 여행
          </Typography>
        </TouchableOpacity>
      </View>

      {filteredBookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  tab: {
    paddingVertical: spacing.md,
    marginRight: spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.neutral[800],
  },
  bookingsList: {
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 95,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
  },
  bookingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  bookingLocation: {
    marginTop: 2,
  },
  bookingDates: {
    marginTop: spacing.xs,
  },
  bookingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
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
  exploreButton: {
    minWidth: 150,
  },
});
