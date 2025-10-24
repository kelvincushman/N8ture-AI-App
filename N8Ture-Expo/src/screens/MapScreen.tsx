/**
 * Map Screen
 *
 * Shows user's species discoveries on a map.
 * Features:
 * - Interactive map with species markers
 * - Clustering for dense areas
 * - Filter by species type
 * - Walk trails visualization
 *
 * TODO: Implement full map with expo-location and react-native-maps
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="layers-outline" size={20} color={theme.colors.primary.main} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="options-outline" size={20} color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Placeholder Map View */}
      <View style={styles.mapPlaceholder}>
        <Ionicons
          name="map-outline"
          size={80}
          color={theme.colors.text.secondary}
        />
        <Text style={styles.placeholderTitle}>Map Coming Soon</Text>
        <Text style={styles.placeholderText}>
          View your species discoveries and walk trails on an interactive map
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons name="pin" size={20} color={theme.colors.primary.main} />
            <Text style={styles.featureText}>Species locations</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="trail-sign" size={20} color={theme.colors.primary.main} />
            <Text style={styles.featureText}>Walk trails</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="images" size={20} color={theme.colors.primary.main} />
            <Text style={styles.featureText}>Photo markers</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="musical-notes" size={20} color={theme.colors.primary.main} />
            <Text style={styles.featureText}>Audio recordings</Text>
          </View>
        </View>
      </View>

      {/* Location Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Discoveries</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8.4 km</Text>
            <Text style={styles.statLabel}>Walked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Areas</Text>
          </View>
        </View>
      </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  placeholderTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  featureList: {
    gap: theme.spacing.md,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary.light + '10',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  featureText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
  },
  statsContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#E0E0E0',
    paddingBottom: 100, // Space for bottom tab bar
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.primary.main + '15',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary.dark,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
