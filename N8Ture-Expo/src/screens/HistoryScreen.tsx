/**
 * History Screen (AllTrails Style)
 *
 * Displays user's past species identifications in image grid.
 * Features:
 * - 2-column image grid layout
 * - Visual cards with species photos
 * - Real data from historyService
 * - Statistics dashboard with actual counts
 * - Reload on screen focus
 * - Empty state when no history
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { HistoryCard } from '../components/history/HistoryCard';
import { AppHeader } from '../components/navigation/AppHeader';
import { historyService } from '../services/historyService';
import { IdentificationRecord, IdentificationStats } from '../types/identification';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - (theme.spacing.lg * 2) - CARD_GAP) / 2;

export default function HistoryScreen() {
  const navigation = useNavigation();

  // State management
  const [history, setHistory] = useState<IdentificationRecord[]>([]);
  const [stats, setStats] = useState<IdentificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load history and statistics from historyService
   */
  const loadHistory = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        historyService.getHistory(),
        historyService.getStats(),
      ]);

      setHistory(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Reload history when screen comes into focus
   */
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  /**
   * Navigate to species detail screen with GPS data
   */
  const handleCardPress = (item: IdentificationRecord) => {
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
   * Navigate to map view
   */
  const handleMapPress = () => {
    navigation.navigate('MapView' as never);
  };

  /**
   * Format timestamp to relative date string
   */
  const formatDate = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

    return new Date(timestamp).toLocaleDateString();
  };

  const renderHistoryCard = ({ item }: { item: IdentificationRecord }) => (
    <View style={styles.cardWrapper}>
      <HistoryCard
        id={item.id}
        imageUri={item.imageUri}
        commonName={item.commonName}
        scientificName={item.scientificName}
        confidence={item.confidence}
        type={item.type}
        date={formatDate(item.timestamp)}
        latitude={item.latitude}
        longitude={item.longitude}
        accuracy={item.accuracy}
        onPress={() => handleCardPress(item)}
      />
    </View>
  );

  // Show loading spinner while initial data loads
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="History"
          showBackButton={false}
          showSettings={true}
          showProfile={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Header with Settings & Profile */}
      <AppHeader
        title="History"
        showBackButton={false}
        showSettings={true}
        showProfile={true}
      />

      {/* View Toggle Bar */}
      <View style={styles.viewToggleBar}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleMapPress}
        >
          <Ionicons name="map" size={20} color={theme.colors.primary.main} />
          <Text style={styles.mapButtonText}>Map View</Text>
        </TouchableOpacity>
        {/* Show count of GPS-tagged entries */}
        {history.filter(item => item.latitude && item.longitude).length > 0 && (
          <View style={styles.gpsCountBadge}>
            <Ionicons name="location" size={12} color={theme.colors.success} />
            <Text style={styles.gpsCountText}>
              {history.filter(item => item.latitude && item.longitude).length} with GPS
            </Text>
          </View>
        )}
      </View>

      {/* Statistics Dashboard */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.total || 0}</Text>
          <Text style={styles.statLabel}>Total IDs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {(stats?.plants || 0) + (stats?.wildlife || 0) + (stats?.fungi || 0) + (stats?.insects || 0)}
          </Text>
          <Text style={styles.statLabel}>Species</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.plants || 0}</Text>
          <Text style={styles.statLabel}>Plants</Text>
        </View>
      </View>

      {/* Image Grid */}
      <FlatList
        data={history}
        renderItem={renderHistoryCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary.main}
            colors={[theme.colors.primary.main]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="images-outline"
              size={80}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.emptyText}>No identifications yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the capture button to start identifying species
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  // View Toggle Bar
  viewToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.light + '20',
  },
  mapButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary.main,
  },
  gpsCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.success + '15',
  },
  gpsCountText: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.success,
  },
  // Statistics Dashboard
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.primary.light + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary.dark,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  // Grid Layout
  gridContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 120, // Extra space for bottom tab bar + elevated button
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl * 3,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl * 3,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});
