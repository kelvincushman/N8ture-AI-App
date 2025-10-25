/**
 * AudioResultsScreen component
 *
 * Displays audio identification results for bird songs, bat calls, and insect sounds
 * Shows confidence, species information, and GPS coordinates
 * Allows saving to history with GPS data and navigating to detailed view
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { historyService } from '../services/historyService';
import { useCheckPremium } from '../hooks/useTrialStatus';
import { SpeciesData } from '../types/identification';

type AudioResultsScreenRouteProp = RouteProp<RootStackParamList, 'AudioResults'>;

export default function AudioResultsScreen() {
  const route = useRoute<AudioResultsScreenRouteProp>();
  const navigation = useNavigation();
  const { audioUri, latitude, longitude, accuracy } = route.params;

  const { isPremium } = useCheckPremium();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // TODO: Replace with actual audio identification API
  // Mock result for demonstration
  const mockResult = {
    commonName: 'European Robin',
    scientificName: 'Erithacus rubecula',
    category: 'wildlife' as const,
    confidence: 89,
    description: 'A small insectivorous bird known for its melodious song and orange-red breast. Common in gardens and woodlands across Europe.',
    habitat: 'Gardens, woodlands, parks, and hedgerows. Prefers areas with dense cover and good ground-level foraging opportunities.',
    conservationStatus: 'Least Concern',
    edibility: 'UNKNOWN' as const,
    edibilityNotes: 'Not applicable - protected species',
  };

  const result = mockResult; // Will be replaced with actual API call

  /**
   * Handle record another
   */
  const handleRecordAnother = () => {
    navigation.navigate('AudioRecording' as never);
  };

  /**
   * Handle save to history
   * Saves audio identification with GPS coordinates
   */
  const handleSaveToHistory = async () => {
    if (!result || !audioUri) {
      Alert.alert('Error', 'Cannot save - missing identification data');
      return;
    }

    if (hasSaved) {
      Alert.alert('Already Saved', 'This identification has already been saved to your history.');
      return;
    }

    setIsSaving(true);

    try {
      // Convert result to SpeciesData format
      const speciesData: SpeciesData = {
        id: `species_${Date.now()}`,
        commonName: result.commonName,
        scientificName: result.scientificName,
        family: '', // TODO: Get from result if available
        category: result.category,
        safetyLevel: result.edibility === 'EDIBLE' ? 'safe' :
                     result.edibility === 'DANGEROUS' ? 'dangerous' :
                     result.edibility === 'CONDITIONAL' ? 'caution' : 'unknown',
        description: result.description,
        imageUrls: [], // No photo for audio identification
        detailedInfo: {
          habitat: result.habitat,
          edibility: result.edibilityNotes,
          conservation: result.conservationStatus,
        },
      };

      // Save to history with GPS coordinates and type='audio'
      const savedRecord = await historyService.saveIdentification({
        species: speciesData,
        imageUri: audioUri, // Store audio file path
        confidence: result.confidence / 100, // Convert percentage to 0-1
        latitude,
        longitude,
        accuracy,
        isPremium,
        type: 'audio', // Important: Mark as audio identification
      });

      setHasSaved(true);

      // Show success message with GPS info
      const gpsInfo = latitude && longitude
        ? `\n\nRecording Location: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
        : '';

      Alert.alert(
        'Saved to History! 🎵',
        `${result.commonName} has been saved to your identification history.${gpsInfo}`,
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('MainTabs' as never, { screen: 'HistoryTab' } as never),
          },
          { text: 'OK', style: 'default' },
        ]
      );
    } catch (error) {
      console.error('Error saving to history:', error);
      Alert.alert('Error', 'Failed to save identification. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle learn more
   * Navigates to Species Detail Screen
   */
  const handleLearnMore = () => {
    if (!result) return;

    navigation.navigate('SpeciesDetail' as never, {
      speciesId: `species_${Date.now()}`,
      speciesName: result.commonName,
      imageUri: undefined, // No photo for audio
      latitude,
      longitude,
      accuracy,
    } as never);
  };

  // Get confidence color
  const getConfidenceColor = (conf: number): string => {
    if (conf >= 80) return theme.colors.status.safe || '#8FAF87';
    if (conf >= 60) return theme.colors.status.caution || '#D4A574';
    return theme.colors.status.danger || '#A85C5C';
  };

  const confidenceColor = getConfidenceColor(result.confidence);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Audio Identification</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Audio Icon/Placeholder */}
        <View style={styles.audioIconContainer}>
          <View style={styles.audioIconCircle}>
            <Ionicons
              name="musical-notes"
              size={80}
              color={theme.colors.primary.main}
            />
          </View>
          <Text style={styles.audioLabel}>Audio Recording</Text>
        </View>

        {/* Species Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBadge}>
              <Ionicons name="musical-notes" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.confidenceBadge} backgroundColor={confidenceColor}>
              <Text style={styles.confidenceText}>{result.confidence}%</Text>
            </View>
          </View>

          <Text style={styles.commonName}>{result.commonName}</Text>
          <Text style={styles.scientificName}>{result.scientificName}</Text>

          <View style={styles.categoryContainer}>
            <Ionicons name="paw" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.categoryText}>Wildlife · Bird</Text>
          </View>

          <Text style={styles.description}>{result.description}</Text>
        </View>

        {/* GPS Coordinates (if available) */}
        {latitude !== undefined && longitude !== undefined && (
          <View style={styles.card}>
            <View style={styles.gpsHeader}>
              <Ionicons
                name="location"
                size={20}
                color={theme.colors.primary.main}
              />
              <Text style={styles.gpsHeaderText}>Recording Location</Text>
            </View>
            <View style={styles.gpsContent}>
              <Text style={styles.gpsText}>
                Latitude: {latitude.toFixed(6)}°{'\n'}
                Longitude: {longitude.toFixed(6)}°
                {accuracy && `\nAccuracy: ±${accuracy.toFixed(1)}m`}
              </Text>
            </View>
          </View>
        )}

        {/* Habitat Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habitat</Text>
          <Text style={styles.sectionText}>{result.habitat}</Text>
        </View>

        {/* Conservation Status */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Conservation Status</Text>
          <View style={styles.conservationBadge}>
            <Text style={styles.conservationText}>{result.conservationStatus}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Save to History Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (isSaving || hasSaved) && styles.primaryButtonDisabled,
            ]}
            onPress={handleSaveToHistory}
            disabled={isSaving || hasSaved}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name={hasSaved ? 'checkmark-circle' : 'save-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.primaryButtonText}>
                  {hasSaved ? 'Saved to History' : 'Save to History'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Learn More Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLearnMore}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.primary.main}
              />
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </View>
          </TouchableOpacity>

          {/* Record Another Button */}
          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={handleRecordAnother}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="mic"
                size={20}
                color={theme.colors.text.secondary}
              />
              <Text style={styles.tertiaryButtonText}>Record Another</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notice about mock data */}
        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={16} color={theme.colors.info} />
          <Text style={styles.noticeText}>
            Note: Audio identification is currently showing mock results. Full audio AI integration coming soon.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
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
  audioIconContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  audioIconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  audioLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },
  commonName: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  scientificName: {
    fontSize: 16,
    fontFamily: theme.fonts.regularItalic || theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  description: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  gpsHeaderText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  gpsContent: {
    paddingLeft: theme.spacing.md,
  },
  gpsText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  conservationBadge: {
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  conservationText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.success,
  },
  actionButtons: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.text.disabled,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary.main,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info + '15',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});
