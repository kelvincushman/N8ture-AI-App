/**
 * ResultsScreen component
 *
 * Displays species identification results with detailed information
 * Shows confidence, edibility, habitat, and other species data
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useSpeciesIdentification } from '../hooks/useSpeciesIdentification';
import {
  getConfidenceLevel,
  getEdibilityInfo,
  getCategoryIcon,
} from '../types/species';
import LoadingOverlay from '../components/LoadingOverlay';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation();
  const { imageUri, imageBase64 } = route.params;

  const { loading, error, result, identify, retry, clear } =
    useSpeciesIdentification();

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
   */
  const handleSaveToHistory = () => {
    // TODO: Implement save to history
    Alert.alert('Saved', 'Species identification saved to your history!');
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

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveToHistory}
          >
            <Text style={styles.primaryButtonText}>Save to History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleIdentifyAnother}
          >
            <Text style={styles.secondaryButtonText}>Identify Another</Text>
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

  // Actions
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
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
