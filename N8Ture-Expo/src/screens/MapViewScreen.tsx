/**
 * MapViewScreen
 *
 * Displays all GPS-tagged identifications on an interactive map
 * Features:
 * - Custom markers color-coded by category
 * - Marker callouts with species info
 * - Navigation to SpeciesDetail on callout tap
 * - Auto-centering on markers or user location
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { historyService } from '../services/historyService';
import { IdentificationRecord } from '../types/identification';

export default function MapViewScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState<IdentificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<Region>({
    latitude: 51.5074, // London default
    longitude: -0.1278,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  /**
   * Load history and filter for GPS-tagged entries
   */
  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await historyService.getHistory();

      // Filter for entries with GPS coordinates
      const withGPS = data.filter(
        item => item.latitude !== undefined && item.longitude !== undefined
      );

      setHistory(withGPS);

      // Center map on first marker if available
      if (withGPS.length > 0) {
        const firstItem = withGPS[0];
        setRegion({
          latitude: firstItem.latitude!,
          longitude: firstItem.longitude!,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.error('Failed to load history for map:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reload when screen comes into focus
   */
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  /**
   * Get marker color based on category
   */
  const getMarkerColor = (category: string): string => {
    switch (category) {
      case 'plant':
        return '#8FAF87';  // Green
      case 'wildlife':
        return '#8B4513';  // Brown
      case 'fungi':
        return '#FFA500';  // Orange
      case 'insect':
        return '#9370DB';  // Purple
      default:
        return '#4A90E2';  // Blue (default)
    }
  };

  /**
   * Get category icon name
   */
  const getCategoryIcon = (category: string): any => {
    switch (category) {
      case 'plant':
        return 'leaf';
      case 'wildlife':
        return 'paw';
      case 'fungi':
        return 'nutrition';
      case 'insect':
        return 'bug';
      default:
        return 'location';
    }
  };

  /**
   * Handle marker callout press - navigate to species detail
   */
  const handleMarkerPress = (item: IdentificationRecord) => {
    navigation.navigate('SpeciesDetail' as never, {
      speciesId: item.speciesId,
      speciesName: item.commonName,
      imageUri: item.imageUri,
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: item.accuracy,
    } as never);
  };

  /**
   * Format timestamp to short date
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map View</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map View</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="map-outline"
            size={80}
            color={theme.colors.text.disabled}
          />
          <Text style={styles.emptyTitle}>No Locations Yet</Text>
          <Text style={styles.emptyText}>
            Identifications with GPS coordinates will appear on the map
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map View</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{history.length}</Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
      >
        {history.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude!,
              longitude: item.longitude!,
            }}
            pinColor={getMarkerColor(item.category)}
            title={item.commonName}
            description={item.scientificName}
          >
            {/* Custom Marker View */}
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.markerCircle,
                  { backgroundColor: getMarkerColor(item.category) },
                ]}
              >
                <Ionicons
                  name={getCategoryIcon(item.category)}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              {/* Marker pointer */}
              <View
                style={[
                  styles.markerPointer,
                  { borderTopColor: getMarkerColor(item.category) },
                ]}
              />
            </View>

            {/* Callout (info popup on marker tap) */}
            <Callout onPress={() => handleMarkerPress(item)}>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutHeader}>
                  <Ionicons
                    name={item.type === 'audio' ? 'musical-notes' : 'camera'}
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <View style={styles.calloutHeaderText}>
                    <Text style={styles.calloutTitle}>{item.commonName}</Text>
                    <Text style={styles.calloutSubtitle}>{item.scientificName}</Text>
                  </View>
                </View>
                <View style={styles.calloutDetails}>
                  <View style={styles.calloutDetail}>
                    <Ionicons name="calendar" size={12} color={theme.colors.text.secondary} />
                    <Text style={styles.calloutDetailText}>{formatDate(item.timestamp)}</Text>
                  </View>
                  <View style={styles.calloutDetail}>
                    <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
                    <Text style={styles.calloutDetailText}>
                      {Math.round(item.confidence * 100)}%
                    </Text>
                  </View>
                </View>
                <View style={styles.calloutFooter}>
                  <Text style={styles.calloutFooterText}>Tap to view details</Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.colors.primary.main} />
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8FAF87' }]} />
          <Text style={styles.legendText}>Plants</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8B4513' }]} />
          <Text style={styles.legendText}>Wildlife</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.legendText}>Fungi</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#9370DB' }]} />
          <Text style={styles.legendText}>Insects</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    zIndex: 10,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  counterBadge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  map: {
    flex: 1,
  },
  // Custom marker styles
  markerContainer: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  // Callout styles
  calloutContainer: {
    width: 200,
    padding: theme.spacing.sm,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  calloutHeaderText: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  calloutTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
  },
  calloutSubtitle: {
    fontSize: 11,
    fontFamily: theme.fonts.regularItalic || theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  calloutDetails: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  calloutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calloutDetailText: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  calloutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  calloutFooterText: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary.main,
  },
  // Legend styles
  legendContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
  },
});
