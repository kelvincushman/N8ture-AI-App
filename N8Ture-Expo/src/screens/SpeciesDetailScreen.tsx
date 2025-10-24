/**
 * SpeciesDetailScreen
 *
 * Displays complete species information with:
 * - Swipeable image carousel at top
 * - Species name header
 * - Tabbed content (Overview, Habitat, Safety, Similar)
 * - GPS coordinates where species was found
 *
 * Accessed from:
 * - ResultsScreen "Learn More" button
 * - HistoryScreen card tap
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { AppHeader } from '../components/navigation/AppHeader';
import { ImageCarousel } from '../components/species/ImageCarousel';
import { theme } from '../constants/theme';

type SpeciesDetailScreenRouteProp = RouteProp<RootStackParamList, 'SpeciesDetail'>;
type SpeciesDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SpeciesDetail'
>;

interface Props {
  route: SpeciesDetailScreenRouteProp;
  navigation: SpeciesDetailScreenNavigationProp;
}

type TabType = 'overview' | 'habitat' | 'safety' | 'similar';

export default function SpeciesDetailScreen({ route, navigation }: Props) {
  const { speciesId, speciesName, imageUri, latitude, longitude, accuracy } = route.params;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [speciesData, setSpeciesData] = useState<any>(null);

  useEffect(() => {
    loadSpeciesData();
  }, [speciesId]);

  /**
   * Load species data
   * TODO: Fetch from API or local database
   */
  const loadSpeciesData = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data for now
    setSpeciesData({
      commonName: speciesName,
      scientificName: 'Species scientificName',
      family: 'Plantaceae',
      images: imageUri ? [imageUri] : [],
      category: 'plant',
      safetyLevel: 'safe',
      description:
        'This is a detailed description of the species. It includes information about its appearance, habitat, and other characteristics that help identify it in the wild. This species is commonly found in temperate regions and has distinctive features that make it easy to identify.',
      habitat:
        'Found in forests, woodland edges, and moist shaded areas. Prefers rich, well-drained soil with plenty of organic matter. Often grows near streams or in areas with consistent moisture.',
      season: 'Spring through early fall, with peak growth in summer months.',
      range: 'Native to North America, widespread in eastern United States and Canada.',
      edibility: 'Edible when properly prepared. Young leaves can be cooked and eaten. Remove tough outer layers before cooking.',
      preparation: 'Steam or sauté for 5-10 minutes until tender. Can be used in soups or as a side dish.',
      medicinal: 'Traditionally used for digestive issues and as a mild sedative. Contains compounds with anti-inflammatory properties.',
      conservation: 'Least Concern (LC) - Common and widespread with stable populations.',
      identificationTips: [
        'Look for distinctive leaf shape and arrangement',
        'Check stem color and texture',
        'Note the flowering pattern in spring',
        'Examine root structure if possible',
      ],
      similarSpecies: [
        {
          commonName: 'Similar Species 1',
          scientificName: 'Similar species1',
          differences: 'Has darker leaves and smaller flowers',
        },
        {
          commonName: 'Similar Species 2',
          scientificName: 'Similar species2',
          differences: 'Grows in drier habitats, shorter stature',
        },
      ],
    });
    setIsLoading(false);
  };

  /**
   * Render safety indicator badge
   */
  const renderSafetyBadge = () => {
    const safetyConfig = {
      safe: { icon: 'checkmark-circle', color: '#8FAF87', label: 'Safe' },
      caution: { icon: 'warning', color: '#D4A574', label: 'Caution' },
      dangerous: { icon: 'alert-circle', color: '#A85C5C', label: 'Dangerous' },
      unknown: { icon: 'help-circle', color: '#9E9E9E', label: 'Unknown' },
    };

    const config = safetyConfig[speciesData?.safetyLevel || 'unknown'];

    return (
      <View style={[styles.safetyBadge, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon as any} size={24} color={config.color} />
        <Text style={[styles.safetyText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  /**
   * Render tab content based on active tab
   */
  const renderTabContent = () => {
    if (!speciesData) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.bodyText}>{speciesData.description}</Text>

            <Text style={styles.sectionTitle}>Family</Text>
            <Text style={styles.bodyText}>{speciesData.family}</Text>

            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.bodyText}>
              {speciesData.category.charAt(0).toUpperCase() + speciesData.category.slice(1)}
            </Text>

            <Text style={styles.sectionTitle}>Conservation Status</Text>
            <Text style={styles.bodyText}>{speciesData.conservation}</Text>

            {speciesData.identificationTips && (
              <>
                <Text style={styles.sectionTitle}>Identification Tips</Text>
                {speciesData.identificationTips.map((tip: string, index: number) => (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bodyText}>{tip}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        );

      case 'habitat':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Habitat & Environment</Text>
            <Text style={styles.bodyText}>{speciesData.habitat}</Text>

            <Text style={styles.sectionTitle}>Seasonal Activity</Text>
            <Text style={styles.bodyText}>{speciesData.season}</Text>

            <Text style={styles.sectionTitle}>Geographic Range</Text>
            <Text style={styles.bodyText}>{speciesData.range}</Text>

            {(latitude !== undefined && longitude !== undefined) && (
              <>
                <Text style={styles.sectionTitle}>Location Found</Text>
                <View style={styles.coordsContainer}>
                  <Ionicons name="location" size={20} color={theme.colors.primary.main} />
                  <View style={styles.coordsTextContainer}>
                    <Text style={styles.bodyText}>
                      Latitude: {latitude.toFixed(6)}°
                    </Text>
                    <Text style={styles.bodyText}>
                      Longitude: {longitude.toFixed(6)}°
                    </Text>
                    {accuracy && (
                      <Text style={styles.accuracyText}>
                        Accuracy: ±{accuracy.toFixed(1)}m
                      </Text>
                    )}
                  </View>
                </View>
                {/* TODO: Add map view here */}
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map-outline" size={32} color={theme.colors.text.secondary} />
                  <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
                </View>
              </>
            )}
          </View>
        );

      case 'safety':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Safety & Edibility</Text>
            {renderSafetyBadge()}

            <Text style={styles.sectionTitle}>Edibility Information</Text>
            <Text style={styles.bodyText}>{speciesData.edibility}</Text>

            {speciesData.preparation && (
              <>
                <Text style={styles.sectionTitle}>Preparation Methods</Text>
                <Text style={styles.bodyText}>{speciesData.preparation}</Text>
              </>
            )}

            {speciesData.medicinal && (
              <>
                <Text style={styles.sectionTitle}>Medicinal & Herbal Uses</Text>
                <Text style={styles.bodyText}>{speciesData.medicinal}</Text>
              </>
            )}

            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color={theme.colors.warning} />
              <Text style={styles.warningText}>
                Always consult with an expert before consuming any wild species. Misidentification can be dangerous.
              </Text>
            </View>
          </View>
        );

      case 'similar':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Similar Species</Text>
            <Text style={styles.bodyText}>
              Be careful not to confuse this species with similar-looking ones. Here are some key differences:
            </Text>

            {speciesData.similarSpecies && speciesData.similarSpecies.map((similar: any, index: number) => (
              <View key={index} style={styles.similarCard}>
                <Text style={styles.similarName}>{similar.commonName}</Text>
                <Text style={styles.similarScientific}>{similar.scientificName}</Text>
                <Text style={styles.similarDifferences}>
                  <Text style={styles.boldText}>Key Differences: </Text>
                  {similar.differences}
                </Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading species information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Species Detail"
        showBackButton={true}
        showSettings={false}
        showProfile={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={speciesData?.images || []} />

        {/* Species Name Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.commonName}>{speciesData?.commonName}</Text>
          <Text style={styles.scientificName}>{speciesData?.scientificName}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'habitat' && styles.tabActive]}
            onPress={() => setActiveTab('habitat')}
          >
            <Text style={[styles.tabText, activeTab === 'habitat' && styles.tabTextActive]}>
              Habitat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'safety' && styles.tabActive]}
            onPress={() => setActiveTab('safety')}
          >
            <Text style={[styles.tabText, activeTab === 'safety' && styles.tabTextActive]}>
              Safety
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'similar' && styles.tabActive]}
            onPress={() => setActiveTab('similar')}
          >
            <Text style={[styles.tabText, activeTab === 'similar' && styles.tabTextActive]}>
              Similar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },

  // Header
  headerContainer: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E0E0E0',
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  commonName: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  scientificName: {
    fontSize: 18,
    fontFamily: theme.fonts.italic,
    color: theme.colors.text.secondary,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E0E0E0',
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary.main,
  },
  tabText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary.main,
  },

  // Tab Content
  tabContent: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  boldText: {
    fontFamily: theme.fonts.semiBold,
  },

  // Bullet points
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },
  bulletDot: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },

  // GPS Coordinates
  coordsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary.light + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  coordsTextContainer: {
    flex: 1,
  },
  accuracyText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },

  // Map placeholder
  mapPlaceholder: {
    height: 200,
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
  },

  // Safety Badge
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  safetyText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
  },

  // Warning Box
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.warning + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },

  // Similar Species
  similarCard: {
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary.main,
  },
  similarName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  similarScientific: {
    fontSize: 14,
    fontFamily: theme.fonts.italic,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  similarDifferences: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },

  // Bottom padding
  bottomPadding: {
    height: 40,
  },
});
