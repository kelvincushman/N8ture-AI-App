/**
 * History Card Component
 *
 * Visual card for displaying species identification in image grid.
 * AllTrails-inspired design with image-first layout and overlays.
 *
 * Features:
 * - Prominent species image
 * - Type icon (camera/audio) - top left
 * - Confidence badge - top right
 * - Species name overlay - bottom
 * - Date overlay - bottom
 * - GPS coordinates - bottom (if available)
 * - 4:5 aspect ratio (portrait)
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface HistoryCardProps {
  id: string;
  imageUri?: string;
  commonName: string;
  scientificName: string;
  confidence: number; // 0.0 - 1.0
  type: 'camera' | 'audio';
  date: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  onPress?: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  imageUri,
  commonName,
  scientificName,
  confidence,
  type,
  date,
  latitude,
  longitude,
  accuracy,
  onPress,
}) => {
  // Get confidence color
  const getConfidenceColor = (conf: number): string => {
    if (conf >= 0.9) return theme.colors.status.safe || '#8FAF87';
    if (conf >= 0.7) return theme.colors.status.caution || '#D4A574';
    return theme.colors.status.danger || '#A85C5C';
  };

  const confidencePercent = Math.round(confidence * 100);
  const confidenceColor = getConfidenceColor(confidence);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Species Image or Placeholder */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name={type === 'audio' ? 'musical-notes' : 'leaf'}
              size={48}
              color={theme.colors.primary.light}
            />
          </View>
        )}

        {/* Type Icon (top left) */}
        <View style={[styles.badge, styles.typeBadge]}>
          <Ionicons
            name={type === 'audio' ? 'musical-notes' : 'camera'}
            size={16}
            color="#FFFFFF"
          />
        </View>

        {/* Confidence Badge (top right) */}
        <View
          style={[
            styles.badge,
            styles.confidenceBadge,
            { backgroundColor: confidenceColor },
          ]}
        >
          <Text style={styles.confidenceText}>{confidencePercent}%</Text>
        </View>

        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.gradientOverlay}
        >
          {/* Species Name */}
          <Text style={styles.commonName} numberOfLines={1}>
            {commonName}
          </Text>
          <Text style={styles.scientificName} numberOfLines={1}>
            {scientificName}
          </Text>
          {/* Date */}
          <Text style={styles.date}>{date}</Text>

          {/* GPS Coordinates (if available) */}
          {latitude !== undefined && longitude !== undefined && (
            <View style={styles.gpsContainer}>
              <Ionicons
                name="location"
                size={10}
                color="rgba(255, 255, 255, 0.8)"
                style={styles.gpsIcon}
              />
              <Text style={styles.gpsText} numberOfLines={1}>
                {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                {accuracy && ` (±${accuracy.toFixed(0)}m)`}
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5, // Portrait orientation (like AllTrails)
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary.light + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  typeBadge: {
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  confidenceBadge: {
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  commonName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  scientificName: {
    fontSize: 12,
    fontFamily: theme.fonts.regularItalic || theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  gpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  gpsIcon: {
    marginRight: 2,
  },
  gpsText: {
    fontSize: 10,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
