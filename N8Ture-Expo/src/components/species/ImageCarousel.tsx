/**
 * ImageCarousel Component
 *
 * Swipeable image carousel with dots indicator for species photos.
 * Used in SpeciesDetailScreen to display multiple images of identified species.
 *
 * Features:
 * - Horizontal scrolling with paging
 * - Dots indicator showing active image (● ○ ○ ○)
 * - Smooth scroll animations
 * - Placeholder for missing images
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 400;

interface ImageCarouselProps {
  images: string[]; // Array of image URIs
  aspectRatio?: number; // Default: 1 (square), can be 4/5 for portrait
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  aspectRatio = 1
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /**
   * Handle scroll event to update active dot indicator
   */
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  /**
   * Render individual image item
   */
  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={[styles.image, { aspectRatio }]}
        resizeMode="cover"
      />
    </View>
  );

  /**
   * Render dots indicator at bottom
   */
  const renderDots = () => {
    if (images.length <= 1) return null;

    return (
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  // Empty state - no images
  if (!images || images.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.placeholderIcon}>
          <Ionicons name="image-outline" size={64} color={theme.colors.text.secondary} />
        </View>
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `image-${index}`}
        bounces={false}
        decelerationRate="fast"
      />

      {/* Dots indicator */}
      {renderDots()}

      {/* Image counter (top right) */}
      {images.length > 1 && (
        <View style={styles.counterContainer}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
    position: 'relative',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Dots indicator
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },

  // Image counter
  counterContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },

  // Placeholder (no images)
  placeholderContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
  },
  placeholderIcon: {
    marginBottom: theme.spacing.md,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
});
