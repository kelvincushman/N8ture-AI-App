/**
 * ExportPreviewScreen
 *
 * Allows users to configure and preview PDF export
 * Features:
 * - Select identifications to include
 * - Configure export options
 * - Add route data (optional)
 * - Generate and share PDF
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { historyService } from '../services/historyService';
import { pdfExportService, ExportOptions, RouteData } from '../services/pdfExportService';
import { mapSnapshotService } from '../services/mapSnapshotService';
import { IdentificationRecord } from '../types/identification';
import MapSnapshotComponent from '../components/MapSnapshotComponent';

type ExportPreviewScreenRouteProp = RouteProp<RootStackParamList, 'ExportPreview'>;

export default function ExportPreviewScreen() {
  const route = useRoute<ExportPreviewScreenRouteProp>();
  const navigation = useNavigation();

  // Refs
  const mapSnapshotRef = useRef<View>(null);

  // State
  const [history, setHistory] = useState<IdentificationRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Export options
  const [title, setTitle] = useState('My Nature Discoveries');
  const [includeMap, setIncludeMap] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeCoordinates, setIncludeCoordinates] = useState(true);
  const [includeRouteData, setIncludeRouteData] = useState(false);

  // Route data
  const [distance, setDistance] = useState('');
  const [elevationGain, setElevationGain] = useState('');
  const [elevationLoss, setElevationLoss] = useState('');
  const [duration, setDuration] = useState('');

  /**
   * Load history on mount
   */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory();
      setHistory(data);

      // Select all by default
      setSelectedIds(new Set(data.map(item => item.id)));
    } catch (error) {
      console.error('Failed to load history:', error);
      Alert.alert('Error', 'Failed to load identification history');
    }
  };

  /**
   * Toggle selection for an item
   */
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  /**
   * Select/deselect all
   */
  const toggleSelectAll = () => {
    if (selectedIds.size === history.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(history.map(item => item.id)));
    }
  };

  /**
   * Generate and share PDF
   */
  const handleGeneratePDF = async () => {
    if (selectedIds.size === 0) {
      Alert.alert('No Selection', 'Please select at least one identification to export');
      return;
    }

    setIsGenerating(true);

    try {
      // Prepare export options
      const options: ExportOptions = {
        title,
        includeMap,
        includePhotos,
        includeCoordinates,
        includeRouteData,
        selectedIds: Array.from(selectedIds),
      };

      // Prepare route data if enabled
      let routeData: RouteData | undefined;
      if (includeRouteData) {
        const distanceNum = parseFloat(distance);
        const elevGainNum = parseFloat(elevationGain);
        const elevLossNum = parseFloat(elevationLoss);
        const durationNum = parseFloat(duration);

        if (isNaN(distanceNum) || isNaN(durationNum)) {
          Alert.alert('Invalid Input', 'Please enter valid distance and duration values');
          setIsGenerating(false);
          return;
        }

        routeData = {
          totalDistance: distanceNum * 1000, // Convert km to meters
          totalElevationGain: elevGainNum || 0,
          totalElevationLoss: elevLossNum || 0,
          totalTime: durationNum * 60 * 1000, // Convert minutes to milliseconds
          averageSpeed: distanceNum / (durationNum / 60), // km/h
        };
      }

      // Capture map snapshot if includeMap is true
      let mapImageUri: string | undefined;
      if (includeMap && mapSnapshotRef.current) {
        console.log('Capturing map snapshot for PDF...');

        // Filter to selected identifications
        const selectedHistory = history.filter(item =>
          selectedIds.has(item.id)
        );

        mapImageUri = await mapSnapshotService.captureMapView(
          mapSnapshotRef.current,
          {
            identifications: selectedHistory,
            width: 800,
            height: 600,
          }
        ) || undefined;

        if (mapImageUri) {
          console.log('Map snapshot captured successfully:', mapImageUri);
        } else {
          console.log('Map snapshot not available (no GPS-tagged entries)');
        }
      }

      // Generate and share PDF
      await pdfExportService.generateAndSharePDF(
        history,
        options,
        mapImageUri,
        routeData
      );

      // Clean up map snapshot after PDF is generated
      if (mapImageUri) {
        await mapSnapshotService.deleteSnapshot(mapImageUri);
      }

      Alert.alert(
        'PDF Generated! 📄',
        'Your nature discovery report has been created and is ready to share.',
        [
          { text: 'Done', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      Alert.alert('Export Failed', 'Could not generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export to PDF</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Report Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter report title"
            placeholderTextColor={theme.colors.text.disabled}
          />
        </View>

        {/* Selection List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Select Identifications ({selectedIds.size}/{history.length})
            </Text>
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={styles.selectAllButton}>
                {selectedIds.size === history.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>

          {history.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => toggleSelection(item.id)}
            >
              <View style={styles.checkbox}>
                {selectedIds.has(item.id) && (
                  <Ionicons name="checkmark" size={18} color={theme.colors.primary.main} />
                )}
              </View>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.commonName}</Text>
                <Text style={styles.itemSubtitle}>
                  {item.scientificName} • {formatDate(item.timestamp)}
                </Text>
              </View>
              <Ionicons
                name={item.type === 'audio' ? 'musical-notes' : 'camera'}
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Options</Text>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Ionicons name="map" size={20} color={theme.colors.text.primary} />
              <Text style={styles.optionText}>Include Map</Text>
            </View>
            <Switch
              value={includeMap}
              onValueChange={setIncludeMap}
              trackColor={{ false: '#ccc', true: theme.colors.primary.light }}
              thumbColor={includeMap ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Ionicons name="image" size={20} color={theme.colors.text.primary} />
              <Text style={styles.optionText}>Include Photos</Text>
            </View>
            <Switch
              value={includePhotos}
              onValueChange={setIncludePhotos}
              trackColor={{ false: '#ccc', true: theme.colors.primary.light }}
              thumbColor={includePhotos ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Ionicons name="location" size={20} color={theme.colors.text.primary} />
              <Text style={styles.optionText}>Include GPS Coordinates</Text>
            </View>
            <Switch
              value={includeCoordinates}
              onValueChange={setIncludeCoordinates}
              trackColor={{ false: '#ccc', true: theme.colors.primary.light }}
              thumbColor={includeCoordinates ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Ionicons name="stats-chart" size={20} color={theme.colors.text.primary} />
              <Text style={styles.optionText}>Include Route Data</Text>
            </View>
            <Switch
              value={includeRouteData}
              onValueChange={setIncludeRouteData}
              trackColor={{ false: '#ccc', true: theme.colors.primary.light }}
              thumbColor={includeRouteData ? theme.colors.primary.main : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Route Data Input */}
        {includeRouteData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Journey Metrics</Text>
            <Text style={styles.sectionSubtitle}>
              Add details about your nature walk
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Distance (km)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={distance}
                  onChangeText={setDistance}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.colors.text.disabled}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (min)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={theme.colors.text.disabled}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Elevation Gain (m)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={elevationGain}
                  onChangeText={setElevationGain}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={theme.colors.text.disabled}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Elevation Loss (m)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={elevationLoss}
                  onChangeText={setElevationLoss}
                  placeholder="0"
                  keyboardType="number-pad"
                  placeholderTextColor={theme.colors.text.disabled}
                />
              </View>
            </View>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={theme.colors.info} />
          <Text style={styles.infoText}>
            The PDF will include {selectedIds.size} identification{selectedIds.size !== 1 ? 's' : ''}
            {includeMap ? ' with a map' : ''}
            {includePhotos ? ', photos' : ''}
            {includeCoordinates ? ', and GPS coordinates' : ''}.
          </Text>
        </View>
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGeneratePDF}
          disabled={isGenerating || selectedIds.size === 0}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>Generate PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Hidden Map Snapshot Component for PDF capture */}
      {includeMap && (
        <View
          ref={mapSnapshotRef}
          style={{
            position: 'absolute',
            top: -10000, // Render off-screen
            left: -10000,
            width: 800,
            height: 600,
          }}
        >
          <MapSnapshotComponent
            identifications={history.filter(item => selectedIds.has(item.id))}
            width={800}
            height={600}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
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
  headerButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  selectAllButton: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary.main,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  itemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary.light + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  itemNumberText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary.main,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
  },
  itemSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  optionText: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  numberInput: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '15',
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  generateButtonDisabled: {
    backgroundColor: theme.colors.text.disabled,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
});
