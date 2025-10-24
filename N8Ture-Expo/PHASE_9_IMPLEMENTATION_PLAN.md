# Phase 9: Core Identification Flow Implementation
## Species Detail Screen + GPS + History Save

Based on user request: *"User takes a photo of the plant or animal and then the app provides details, logs GPS coordinates, saves photo and description in history. Happy with carousel."*

---

## Overview

This phase implements the complete identification workflow:
1. ✅ User takes photo (already works via CameraScreen)
2. ✅ App provides basic details (already works via ResultsScreen)
3. **NEW**: Log GPS coordinates when photo is taken
4. **NEW**: Save photo and description to history with GPS data
5. **NEW**: Species Detail Screen with image carousel
6. **NEW**: Tap history item to view full details

**Estimated Time**: 24-28 hours
**Priority**: CRITICAL - Core MVP functionality

---

## Part 1: GPS Coordinate Capture (8 hours)

### 1.1 Install/Verify Dependencies

**Check if expo-location is installed:**
```bash
# Already in package.json: "expo-location": "^19.0.7"
```

### 1.2 Create Location Hook

**File**: `src/hooks/useLocation.ts` (NEW)

```typescript
/**
 * useLocation Hook
 *
 * Manages location permissions and GPS capture
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface UseLocationReturn {
  location: LocationCoordinates | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setError('Location permission denied');
        return null;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoordinates = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy || undefined,
        timestamp: result.timestamp,
      };

      setLocation(coords);
      return coords;
    } catch (err) {
      setError('Failed to get current location');
      console.error('Location error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
  };
}
```

### 1.3 Update CameraScreen to Capture GPS

**File**: `src/screens/CameraScreen.tsx` (MODIFY)

**Add GPS capture when photo is taken:**

```typescript
import { useLocation } from '../hooks/useLocation';

export default function CameraScreen() {
  const { getCurrentLocation } = useLocation();

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      // Capture GPS coordinates
      const gpsCoords = await getCurrentLocation();

      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      // Navigate to results with photo and GPS
      navigation.navigate('Results', {
        imageUri: photo.uri,
        imageBase64: photo.base64,
        latitude: gpsCoords?.latitude,
        longitude: gpsCoords?.longitude,
      });
    }
  };

  // ... rest of component
}
```

### 1.4 Update Navigation Types

**File**: `src/types/navigation.ts` (MODIFY)

```typescript
export type RootStackParamList = {
  // ... existing routes
  Results: {
    imageUri: string;
    imageBase64?: string;
    identificationId?: string;
    latitude?: number;      // NEW: GPS coordinates
    longitude?: number;     // NEW: GPS coordinates
  };
  SpeciesDetail: {
    speciesId: string;
    speciesName: string;
    imageUri?: string;       // NEW: Original photo
    latitude?: number;       // NEW: GPS from identification
    longitude?: number;      // NEW: GPS from identification
  };
};
```

---

## Part 2: Save to History with Photo (12 hours)

### 2.1 Create Identification Types

**File**: `src/types/identification.ts` (NEW)

```typescript
export interface IdentificationRecord {
  id: string;
  speciesId: string;
  commonName: string;
  scientificName: string;
  family?: string;
  category: 'plant' | 'wildlife' | 'fungi' | 'insect';
  safetyLevel: 'safe' | 'caution' | 'dangerous' | 'unknown';
  imageUri: string;           // Local file path
  thumbnailUri?: string;      // Thumbnail for grid
  confidence: number;         // 0.0 to 1.0
  latitude?: number;
  longitude?: number;
  timestamp: number;
  isPremium: boolean;
  notes?: string;
  type: 'camera' | 'audio';
}

export interface SpeciesData {
  id: string;
  commonName: string;
  scientificName: string;
  family?: string;
  category: 'plant' | 'wildlife' | 'fungi' | 'insect';
  safetyLevel: 'safe' | 'caution' | 'dangerous' | 'unknown';
  description: string;
  imageUrls: string[];        // Multiple images for carousel
  detailedInfo?: {
    habitat?: string;
    season?: string;
    edibility?: string;
    medicinal?: string;
    conservation?: string;
  };
}
```

### 2.2 Create Identification Service

**File**: `src/services/identificationService.ts` (NEW)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { IdentificationRecord, SpeciesData } from '../types/identification';

const HISTORY_KEY = 'identification_history';
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

class IdentificationService {

  /**
   * Initialize storage directories
   */
  async init() {
    // Create photos directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
  }

  /**
   * Save identification to history
   */
  async saveIdentification(data: {
    species: SpeciesData;
    imageUri: string;
    confidence: number;
    latitude?: number;
    longitude?: number;
    isPremium: boolean;
  }): Promise<IdentificationRecord> {

    await this.init();

    // Generate unique ID
    const id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    // Copy photo to permanent storage
    const photoExtension = data.imageUri.split('.').pop() || 'jpg';
    const photoFilename = `${id}.${photoExtension}`;
    const photoPath = `${PHOTOS_DIR}${photoFilename}`;

    await FileSystem.copyAsync({
      from: data.imageUri,
      to: photoPath,
    });

    // Create thumbnail (TODO: implement image resizing)
    const thumbnailPath = photoPath; // For now, use same image

    // Create record
    const record: IdentificationRecord = {
      id,
      speciesId: data.species.id,
      commonName: data.species.commonName,
      scientificName: data.species.scientificName,
      family: data.species.family,
      category: data.species.category,
      safetyLevel: data.species.safetyLevel,
      imageUri: photoPath,
      thumbnailUri: thumbnailPath,
      confidence: data.confidence,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp,
      isPremium: data.isPremium,
      type: 'camera',
    };

    // Load existing history
    const history = await this.getHistory();

    // Add to beginning of array
    history.unshift(record);

    // For free users, limit to 10
    if (!data.isPremium && history.length > 10) {
      // Delete photos for removed records
      const removed = history.slice(10);
      for (const item of removed) {
        await this.deletePhoto(item.imageUri);
      }
      history.splice(10);
    }

    // Save updated history
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    return record;
  }

  /**
   * Get all identification history
   */
  async getHistory(): Promise<IdentificationRecord[]> {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  }

  /**
   * Get identification by ID
   */
  async getIdentificationById(id: string): Promise<IdentificationRecord | null> {
    const history = await this.getHistory();
    return history.find(item => item.id === id) || null;
  }

  /**
   * Delete identification
   */
  async deleteIdentification(id: string): Promise<boolean> {
    const history = await this.getHistory();
    const index = history.findIndex(item => item.id === id);

    if (index === -1) return false;

    // Delete photo file
    await this.deletePhoto(history[index].imageUri);

    // Remove from history
    history.splice(index, 1);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    return true;
  }

  /**
   * Delete photo file
   */
  private async deletePhoto(uri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }

  /**
   * Clear all history (for testing/reset)
   */
  async clearHistory(): Promise<void> {
    const history = await this.getHistory();

    // Delete all photos
    for (const item of history) {
      await this.deletePhoto(item.imageUri);
    }

    await AsyncStorage.removeItem(HISTORY_KEY);
  }
}

export const identificationService = new IdentificationService();
```

### 2.3 Update ResultsScreen to Save

**File**: `src/screens/ResultsScreen.tsx` (MODIFY)

**Add Save functionality:**

```typescript
import { identificationService } from '../services/identificationService';
import { useCheckPremium } from '../hooks/useTrialStatus';

export default function ResultsScreen({ route, navigation }) {
  const { imageUri, imageBase64, latitude, longitude } = route.params;
  const { isPremium } = useCheckPremium();
  const [isSaving, setIsSaving] = useState(false);

  // ... existing state for identification results

  const handleSave = async () => {
    if (!identificationData) return;

    setIsSaving(true);

    try {
      const record = await identificationService.saveIdentification({
        species: identificationData.species,
        imageUri,
        confidence: identificationData.confidence,
        latitude,
        longitude,
        isPremium,
      });

      Alert.alert('Success', 'Saved to history!', [
        {
          text: 'View History',
          onPress: () => navigation.navigate('MainTabs', { screen: 'HistoryTab' }),
        },
        { text: 'OK', style: 'default' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save identification');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      {/* ... existing UI ... */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save to History</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

### 2.4 Update HistoryScreen to Load Real Data

**File**: `src/screens/HistoryScreen.tsx` (MODIFY)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { identificationService } from '../services/identificationService';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState<IdentificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reload history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await identificationService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (item: IdentificationRecord) => {
    navigation.navigate('SpeciesDetail', {
      speciesId: item.speciesId,
      speciesName: item.commonName,
      imageUri: item.imageUri,
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (history.length === 0) {
    return <EmptyHistoryScreen />;
  }

  return (
    <View style={styles.container}>
      <AppHeader title="History" showBackButton={false} />

      <FlatList
        data={history}
        renderItem={({ item }) => (
          <HistoryCard
            imageUri={item.thumbnailUri || item.imageUri}
            commonName={item.commonName}
            scientificName={item.scientificName}
            confidence={item.confidence}
            type={item.type}
            date={new Date(item.timestamp).toLocaleDateString()}
            latitude={item.latitude}
            longitude={item.longitude}
            onPress={() => handleCardPress(item)}
          />
        )}
        numColumns={2}
        // ... rest of FlatList props
      />
    </View>
  );
}
```

---

## Part 3: Species Detail Screen with Carousel (16 hours)

### 3.1 Create Image Carousel Component

**File**: `src/components/species/ImageCarousel.tsx` (NEW)

```typescript
import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { theme } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 400;

interface ImageCarouselProps {
  images: string[];  // Array of image URIs
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderImage = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activeIndex === index && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );

  if (images.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="image-outline" size={64} color={theme.colors.text.secondary} />
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `image-${index}`}
      />

      {images.length > 1 && renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    backgroundColor: theme.colors.background.secondary,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  placeholderContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  placeholderText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
});
```

### 3.2 Create Species Detail Screen

**File**: `src/screens/SpeciesDetailScreen.tsx` (NEW)

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AppHeader } from '../components/navigation/AppHeader';
import { ImageCarousel } from '../components/species/ImageCarousel';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type SpeciesDetailScreenRouteProp = RouteProp<RootStackParamList, 'SpeciesDetail'>;
type SpeciesDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SpeciesDetail'
>;

interface Props {
  route: SpeciesDetailScreenRouteProp;
  navigation: SpeciesDetailScreenNavigationProp;
}

export default function SpeciesDetailScreen({ route, navigation }: Props) {
  const { speciesId, speciesName, imageUri, latitude, longitude } = route.params;

  const [activeTab, setActiveTab] = useState<'overview' | 'habitat' | 'safety' | 'similar'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [speciesData, setSpeciesData] = useState<any>(null);

  useEffect(() => {
    loadSpeciesData();
  }, [speciesId]);

  const loadSpeciesData = async () => {
    // TODO: Load from API or local cache
    // For now, use mock data
    setSpeciesData({
      commonName: speciesName,
      scientificName: 'Species scientificName',
      family: 'Plantaceae',
      images: imageUri ? [imageUri] : [],
      safetyLevel: 'safe',
      description: 'Detailed description of the species...',
      habitat: 'Forest, woodland edges, moist areas',
      edibility: 'Edible when cooked. Remove outer leaves.',
      conservation: 'Least Concern (LC)',
    });
    setIsLoading(false);
  };

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

            <Text style={styles.sectionTitle}>Conservation Status</Text>
            <Text style={styles.bodyText}>{speciesData.conservation}</Text>
          </View>
        );

      case 'habitat':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Habitat & Range</Text>
            <Text style={styles.bodyText}>{speciesData.habitat}</Text>

            {latitude && longitude && (
              <>
                <Text style={styles.sectionTitle}>Found At</Text>
                <View style={styles.coordsContainer}>
                  <Ionicons name="location" size={20} color={theme.colors.primary.main} />
                  <Text style={styles.bodyText}>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </Text>
                </View>
                {/* TODO: Add map view */}
              </>
            )}
          </View>
        );

      case 'safety':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Safety & Edibility</Text>
            <Text style={styles.bodyText}>{speciesData.edibility}</Text>

            <View style={styles.safetyBadge}>
              <Ionicons name="shield-checkmark" size={24} color="#8FAF87" />
              <Text style={styles.safetyText}>Safe to Consume</Text>
            </View>
          </View>
        );

      case 'similar':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Similar Species</Text>
            <Text style={styles.bodyText}>
              Be careful not to confuse with look-alike species...
            </Text>
          </View>
        );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
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

      <ScrollView style={styles.scrollView}>
        {/* Image Carousel */}
        <ImageCarousel images={speciesData?.images || []} />

        {/* Species Name */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E0E0E0',
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
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
  tabContent: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  coordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8FAF87' + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  safetyText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#8FAF87',
  },
});
```

### 3.3 Add Species Detail to Navigation

**File**: `src/navigation/RootNavigator.tsx` (MODIFY)

```typescript
import SpeciesDetailScreen from '../screens/SpeciesDetailScreen';

// Add to Stack.Navigator
<Stack.Screen
  name="SpeciesDetail"
  component={SpeciesDetailScreen}
  options={{
    headerShown: false,
  }}
/>
```

---

## Part 4: Update HistoryCard Component (2 hours)

**File**: `src/components/history/HistoryCard.tsx` (MODIFY)

**Add GPS coordinates display:**

```typescript
interface HistoryCardProps {
  // ... existing props
  latitude?: number;
  longitude?: number;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  // ... existing props
  latitude,
  longitude,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* ... existing image and badges ... */}

      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                      style={styles.gradientOverlay}>
        <Text style={styles.commonName}>{commonName}</Text>
        <Text style={styles.scientificName}>{scientificName}</Text>

        {/* GPS Coordinates */}
        {latitude && longitude && (
          <View style={styles.coordsRow}>
            <Ionicons name="location" size={12} color="#FFFFFF" />
            <Text style={styles.coordsText}>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <Text style={styles.date}>{date}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Add to styles
coordsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  marginTop: 2,
},
coordsText: {
  fontSize: 10,
  fontFamily: theme.fonts.regular,
  color: 'rgba(255, 255, 255, 0.8)',
},
```

---

## Testing Checklist

### Part 1: GPS Capture
- [ ] Request location permission on first use
- [ ] Capture GPS coordinates when photo is taken
- [ ] Handle permission denied gracefully
- [ ] Handle GPS unavailable (show null/undefined)
- [ ] Test accuracy values

### Part 2: Save to History
- [ ] Save photo to app documents directory
- [ ] Save identification data with GPS
- [ ] Load history on HistoryScreen
- [ ] Display empty state when no history
- [ ] Limit free users to 10 entries
- [ ] Premium users have unlimited history
- [ ] Delete functionality works
- [ ] Photos are deleted when history item removed

### Part 3: Species Detail Screen
- [ ] Image carousel swipes smoothly
- [ ] Dots indicator shows active image
- [ ] Tabs switch content correctly
- [ ] GPS coordinates display in Habitat tab
- [ ] Back button returns to previous screen
- [ ] Handle missing images gracefully

### Part 4: HistoryCard
- [ ] GPS coordinates display (if available)
- [ ] Tap card navigates to Species Detail
- [ ] Images load correctly
- [ ] Badges show correct colors

---

## Dependencies Needed

```bash
npm install --legacy-peer-deps @react-native-async-storage/async-storage
# expo-location already installed (^19.0.7)
# expo-file-system already installed (^17.0.1)
```

---

## Files Summary

### NEW Files (7):
1. `src/hooks/useLocation.ts` - Location permission and GPS capture
2. `src/types/identification.ts` - Type definitions
3. `src/services/identificationService.ts` - History CRUD operations
4. `src/screens/SpeciesDetailScreen.tsx` - Detail screen with carousel
5. `src/components/species/ImageCarousel.tsx` - Swipeable image carousel

### MODIFIED Files (5):
1. `src/types/navigation.ts` - Add GPS params to routes
2. `src/screens/CameraScreen.tsx` - Capture GPS on photo
3. `src/screens/ResultsScreen.tsx` - Add Save button
4. `src/screens/HistoryScreen.tsx` - Load real data
5. `src/components/history/HistoryCard.tsx` - Show GPS coords
6. `src/navigation/RootNavigator.tsx` - Add SpeciesDetail screen

---

## Implementation Order

**Day 1-2 (8 hours):** GPS Coordinate Capture
- Create useLocation hook
- Update CameraScreen
- Update navigation types
- Test GPS capture

**Day 3-4 (12 hours):** Save to History
- Create identificationService
- Update ResultsScreen with Save button
- Update HistoryScreen to load real data
- Test save/load flow

**Day 5-6 (16 hours):** Species Detail Screen
- Create ImageCarousel component
- Create SpeciesDetailScreen
- Add tabs functionality
- Update navigation
- Test complete flow

**Day 7 (4 hours):** Polish & Testing
- Update HistoryCard with GPS
- Handle edge cases
- Test all flows end-to-end
- Fix bugs

---

**Total Estimated Time**: 24-28 hours
**Priority**: CRITICAL for MVP
**Status**: Ready to implement
