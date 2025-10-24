/**
 * ResultsScreen component
 *
 * Displays species identification results with detailed information
 * Shows confidence, edibility, habitat, and other species data
 * Allows saving to history with GPS coordinates and navigating to detailed view
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useSpeciesIdentification } from '../hooks/useSpeciesIdentification';
import {
  getConfidenceLevel,
  getEdibilityInfo,
  getCategoryIcon,
} from '../types/species';
import { historyService } from '../services/historyService';
import { useCheckPremium } from '../hooks/useTrialStatus';
import { SpeciesData } from '../types/identification';
import LoadingOverlay from '../components/LoadingOverlay';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation();
  const { imageUri, imageBase64, latitude, longitude, accuracy } = route.params;

  const { loading, error, result, identify, retry, clear } =
    useSpeciesIdentification();

  const { isPremium } = useCheckPremium();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Trigger identification on mount
  useEffect(() => {
    if (imageBase64) {
      identify(imageBase64);
    }

    // Cleanup on unmount
    return () => {
      clear();
    };
  }, [imageBase64]);

  /**
   * Handle retry
   */
  const handleRetry = () => {
    if (imageBase64) {
      retry(imageBase64);
    }
  };

  /**
   * Handle identify another
   */
  const handleIdentifyAnother = () => {
    clear();
    navigation.navigate('Camera' as never);
  };

  /**
   * Handle go to home
   */
  const handleGoHome = () => {
    clear();
    navigation.navigate('Home' as never);
  };

  /**
   * Handle save to history
   * Saves identification with photo and GPS coordinates
   */
  const handleSaveToHistory = async () => {
    if (!result || !imageUri) {
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
        imageUrls: [imageUri],
        detailedInfo: {
          habitat: result.habitat,
          edibility: result.edibilityNotes,
          conservation: result.conservationStatus,
        },
      };

      // Save to history with GPS coordinates
      const savedRecord = await historyService.saveIdentification({
        species: speciesData,
        imageUri,
        confidence: result.confidence / 100, // Convert percentage to 0-1
        latitude,
        longitude,
        accuracy,
        isPremium,
      });

      setHasSaved(true);

      // Show success message with GPS info
      const gpsInfo = latitude && longitude
        ? `\n\nLocation: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
        : '';

      Alert.alert(
        'Saved to History! 🎉',
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
      imageUri,
      latitude,
      longitude,
      accuracy,
    } as never);
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={true} message="Identifying species..." />
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Identification Failed</Text>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Text style={styles.secondaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No result yet
  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No Results</Text>
          <Text style={styles.errorText}>
            No identification data available. Please try again.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleIdentifyAnother}>
            <Text style={styles.primaryButtonText}>Identify Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get helper data
  const confidenceInfo = getConfidenceLevel(result.confidence);
  const edibilityInfo = getEdibilityInfo(result.edibility);
  const categoryIcon = getCategoryIcon(result.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        {/* Species Name */}
        <View style={styles.headerSection}>
          <Text style={styles.categoryIcon}>{categoryIcon}</Text>
          <Text style={styles.commonName}>{result.commonName}</Text>
          <Text style={styles.scientificName}>{result.scientificName}</Text>
        </View>

        {/* Badges */}
        <View style={styles.badgesContainer}>
          {/* Confidence Badge */}
          <View style={[styles.badge, { backgroundColor: confidenceInfo.color }]}>
            <Text style={styles.badgeText}>
              {confidenceInfo.label}: {result.confidence}%
            </Text>
          </View>

          {/* Edibility Badge */}
          <View style={[styles.badge, { backgroundColor: edibilityInfo.color }]}>
            <Text style={styles.badgeText}>
              {edibilityInfo.icon} {edibilityInfo.label}
            </Text>
          </View>
        </View>

        {/* Toxicity Warning */}
        {result.edibility === 'DANGEROUS' && result.toxicityWarning && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>DANGER - TOXIC</Text>
            <Text style={styles.warningText}>{result.toxicityWarning}</Text>
          </View>
        )}

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.cardText}>{result.description}</Text>
        </View>

        {/* Habitat */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Habitat</Text>
          <Text style={styles.cardText}>{result.habitat}</Text>
        </View>

        {/* Edibility Notes */}
        {result.edibilityNotes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Edibility Information</Text>
            <Text style={styles.cardText}>{result.edibilityNotes}</Text>
          </View>
        )}

        {/* Identification Features */}
        {result.identificationFeatures.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Key Identification Features</Text>
            {result.identificationFeatures.map((feature, index) => (
              <Text key={index} style={styles.listItem}>
                • {feature}
              </Text>
            ))}
          </View>
        )}

        {/* Similar Species */}
        {result.similarSpecies.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Similar Species</Text>
            <View style={styles.chipsContainer}>
              {result.similarSpecies.map((species, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{species}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Conservation Status */}
        {result.conservationStatus && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Conservation Status</Text>
            <Text style={styles.cardText}>{result.conservationStatus}</Text>
          </View>
        )}

        {/* Seasonality */}
        {result.seasonality && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Seasonality</Text>
            <Text style={styles.cardText}>{result.seasonality}</Text>
          </View>
        )}

        {/* GPS Coordinates Badge (if available) */}
        {latitude && longitude && (
          <View style={styles.card}>
            <View style={styles.gpsHeader}>
              <Ionicons name="location" size={20} color={theme.colors.primary.main} />
              <Text style={styles.cardTitle}>Location Captured</Text>
            </View>
            <Text style={styles.gpsText}>
              Latitude: {latitude.toFixed(6)}°{'\n'}
              Longitude: {longitude.toFixed(6)}°
              {accuracy && `\nAccuracy: ±${accuracy.toFixed(1)}m`}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Save to History Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (isSaving || hasSaved) && styles.primaryButtonDisabled
            ]}
            onPress={handleSaveToHistory}
            disabled={isSaving || hasSaved}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name={hasSaved ? "checkmark-circle" : "save-outline"}
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
            style={styles.learnMoreButton}
            onPress={handleLearnMore}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary.main} />
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </View>
          </TouchableOpacity>

          {/* Identify Another Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleIdentifyAnother}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="camera-outline" size={20} color={theme.colors.secondary.main} />
              <Text style={styles.secondaryButtonText}>Identify Another</Text>
            </View>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },

  // Image
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },

  // Header
  headerSection: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  commonName: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  scientificName: {
    ...theme.typography.h4,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Badges
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary.contrastText,
    fontWeight: '600',
  },

  // Warning Card
  warningCard: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  warningTitle: {
    ...theme.typography.h4,
    color: theme.colors.primary.contrastText,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  warningText: {
    ...theme.typography.body2,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },

  // Cards
  card: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardTitle: {
    ...theme.typography.h4,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },

  // List Items
  listItem: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.background.default,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  chipText: {
    ...theme.typography.body2,
    color: theme.colors.primary.dark,
  },

  // GPS Card
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  gpsText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },
  learnMoreButton: {
    backgroundColor: theme.colors.primary.light + '30',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  learnMoreButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.main,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondary.main,
    textAlign: 'center',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
});
