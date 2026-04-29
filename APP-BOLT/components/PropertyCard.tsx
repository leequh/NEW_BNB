import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, MapPin } from 'lucide-react-native';
import Typography from './Typography';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  horizontal?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.md * 2;
const IMAGE_HEIGHT = 240;

export default function PropertyCard({
  property,
  isSaved = false,
  onToggleSave,
  horizontal = false,
}: PropertyCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const handleSave = () => {
    if (onToggleSave) {
      onToggleSave(property.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, horizontal ? styles.horizontalContainer : null]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Premium Badge */}
        {property.host?.isSuperhost && (
          <View style={styles.premiumBadge}>
            <Star
              size={12}
              color={colors.warning.default}
              fill={colors.warning.default}
            />
            <Typography
              variant="caption"
              color={colors.white}
              weight="semibold"
            >
              슈퍼호스트
            </Typography>
          </View>
        )}

        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Heart
            size={20}
            color={isSaved ? colors.error.default : colors.white}
            fill={isSaved ? colors.error.default : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Bottom Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)']}
          style={styles.bottomGradient}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Typography
            variant="h4"
            weight="bold"
            numberOfLines={1}
            style={styles.title}
          >
            {property.title}
          </Typography>
          <View style={styles.ratingContainer}>
            <Star
              size={14}
              color={colors.warning.default}
              fill={colors.warning.default}
            />
            <Typography variant="body2" weight="semibold" style={styles.rating}>
              {property.rating}
            </Typography>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.neutral[500]} />
          <Typography
            variant="body2"
            color={colors.neutral[600]}
            numberOfLines={1}
            style={styles.location}
          >
            {property.location}
          </Typography>
        </View>

        <View style={styles.amenitiesContainer}>
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Typography variant="caption" color={colors.neutral[600]}>
                {amenity}
              </Typography>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Typography variant="h4" weight="bold" color={colors.neutral[900]}>
              ₩{property.price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color={colors.neutral[600]}>
              /박
            </Typography>
          </View>

          <Typography variant="caption" color={colors.neutral[500]}>
            {property.reviews}개 후기
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  horizontalContainer: {
    marginRight: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    height: IMAGE_HEIGHT,
    backgroundColor: colors.neutral[100],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: spacing.sm,
    backdropFilter: 'blur(10px)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  rating: {
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 4,
  },
  location: {
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  amenityTag: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
});
