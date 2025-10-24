/**
 * History Screen
 *
 * Displays user's past species identifications.
 * Shows:
 * - Recent identifications
 * - Saved/favorited species
 * - Walk sessions
 * - Filtering and search
 *
 * TODO: Implement full history with Firestore integration
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function HistoryScreen() {
  // Mock data for now
  const mockHistory = [
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
  ];

  const renderHistoryItem = ({ item }: { item: typeof mockHistory[0] }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.historyIcon}>
        <Ionicons
          name={item.type === 'audio' ? 'musical-notes' : 'camera'}
          size={24}
          color={theme.colors.primary.main}
        />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{item.commonName}</Text>
        <Text style={styles.historyScientific}>{item.scientificName}</Text>
        <Text style={styles.historyMeta}>
          {item.date} • {Math.round(item.confidence * 100)}% confidence
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.secondary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>

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

      <FlatList
        data={mockHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="time-outline"
              size={64}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              Start identifying species to see your history here
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
  filterButton: {
    padding: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
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
  listContainer: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Space for bottom tab bar
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  historyScientific: {
    fontSize: 14,
    fontFamily: theme.fonts.regularItalic || theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
