/**
 * Walk Screen
 *
 * Main screen for walk tracking functionality.
 * Features:
 * - "Start New Walk" hero section
 * - Past walks list
 * - Walk statistics
 *
 * TODO: Implement full walk tracking system with GPS and automatic detection
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { WalkIcon } from '../components/icons/WalkIcon';
import { AppHeader } from '../components/navigation/AppHeader';

export default function WalkScreen() {
  const handleStartWalk = () => {
    // TODO: Implement walk tracking
    console.log('Start Walk pressed - Coming soon!');
  };

  // Mock past walks data
  const pastWalks = [
    {
      id: '1',
      name: 'Morning Walk at Richmond Park',
      species: 5,
      distance: '2.3 km',
      duration: '45 min',
      date: '2 hours ago',
    },
    {
      id: '2',
      name: 'Evening Walk at Hyde Park',
      species: 8,
      distance: '3.1 km',
      duration: '1 hr 10 min',
      date: 'Yesterday',
    },
    {
      id: '3',
      name: 'Weekend Walk at Hampstead Heath',
      species: 12,
      distance: '5.2 km',
      duration: '2 hrs',
      date: '2 days ago',
    },
  ];

  return (
    <View style={styles.container}>
      {/* App Header with Settings & Profile */}
      <AppHeader
        title="Walks"
        showBackButton={false}
        showSettings={true}
        showProfile={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Start New Walk */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <WalkIcon size={48} color={theme.colors.primary.main} />
          </View>
          <Text style={styles.heroTitle}>Start a New Walk</Text>
          <Text style={styles.heroSubtitle}>
            Track species along your path with automatic audio detection
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWalk}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Walk</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Total Walks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>87 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
        </View>

        {/* Past Walks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Walks</Text>
          {pastWalks.map((walk) => (
            <TouchableOpacity key={walk.id} style={styles.walkCard}>
              <View style={styles.walkIcon}>
                <Ionicons name="footsteps" size={24} color={theme.colors.primary.main} />
              </View>
              <View style={styles.walkInfo}>
                <Text style={styles.walkName}>{walk.name}</Text>
                <Text style={styles.walkStats}>
                  {walk.species} species • {walk.distance} • {walk.duration}
                </Text>
                <Text style={styles.walkDate}>{walk.date}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Space for bottom tab bar
  },
  // Hero Card
  heroCard: {
    backgroundColor: theme.colors.primary.light + '15',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  // Statistics
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
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
  // Past Walks Section
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  walkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
  },
  walkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  walkInfo: {
    flex: 1,
  },
  walkName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  walkStats: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  walkDate: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
});
