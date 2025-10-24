/**
 * History Screen (AllTrails Style)
 *
 * Displays user's past species identifications in image grid.
 * Features:
 * - 2-column image grid layout
 * - Visual cards with species photos
 * - Statistics dashboard
 * - Pull to refresh
 * - Filter options
 *
 * TODO: Implement Firebase integration, real images, infinite scroll
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { HistoryCard } from '../components/history/HistoryCard';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - (theme.spacing.lg * 2) - CARD_GAP) / 2;

interface HistoryItem {
  id: string;
  commonName: string;
  scientificName: string;
  date: string;
  type: 'audio' | 'camera';
  confidence: number;
  imageUri?: string;
}

export default function HistoryScreen() {
  // Mock data with more entries for grid demo
  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      commonName: 'Robin',
      scientificName: 'Erithacus rubecula',
      date: '2 hours ago',
      type: 'audio',
      confidence: 0.92,
    },
    {
      id: '2',
      commonName: 'Oak Tree',
      scientificName: 'Quercus robur',
      date: '1 day ago',
      type: 'camera',
      confidence: 0.88,
    },
    {
      id: '3',
      commonName: 'Blue Tit',
      scientificName: 'Cyanistes caeruleus',
      date: '2 days ago',
      type: 'audio',
      confidence: 0.95,
    },
    {
      id: '4',
      commonName: 'Red Fox',
      scientificName: 'Vulpes vulpes',
      date: '3 days ago',
      type: 'camera',
      confidence: 0.91,
    },
    {
      id: '5',
      commonName: 'Blackbird',
      scientificName: 'Turdus merula',
      date: '4 days ago',
      type: 'audio',
      confidence: 0.87,
    },
    {
      id: '6',
      commonName: 'Chaffinch',
      scientificName: 'Fringilla coelebs',
      date: '5 days ago',
      type: 'audio',
      confidence: 0.93,
    },
    {
      id: '7',
      commonName: 'Common Daisy',
      scientificName: 'Bellis perennis',
      date: '1 week ago',
      type: 'camera',
      confidence: 0.89,
    },
    {
      id: '8',
      commonName: 'Great Tit',
      scientificName: 'Parus major',
      date: '1 week ago',
      type: 'audio',
      confidence: 0.94,
    },
  ];

  const handleCardPress = (item: HistoryItem) => {
    // TODO: Navigate to species detail screen
    console.log('Card pressed:', item.commonName);
  };

  const renderHistoryCard = ({ item }: { item: HistoryItem }) => (
    <View style={styles.cardWrapper}>
      <HistoryCard
        id={item.id}
        imageUri={item.imageUri}
        commonName={item.commonName}
        scientificName={item.scientificName}
        confidence={item.confidence}
        type={item.type}
        date={item.date}
        onPress={() => handleCardPress(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        {/* TODO: Implement filter/search */}
      </View>

      {/* Statistics Dashboard */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Total IDs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Species</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Walks</Text>
        </View>
      </View>

      {/* Image Grid */}
      <FlatList
        data={mockHistory}
        renderItem={renderHistoryCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
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
});
