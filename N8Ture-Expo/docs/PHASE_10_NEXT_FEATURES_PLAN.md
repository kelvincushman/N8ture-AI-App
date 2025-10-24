# Phase 10: Next Features Plan

## Overview

This document outlines the next feature implementations following Phase 9's GPS capture and history integration. These features enhance the GPS functionality and provide additional value to users.

---

## Priority Features

### 🔊 Feature 1: Audio Identification GPS Support
**Priority**: HIGH
**Estimated Time**: 4-6 hours
**Dependencies**: Phase 9 complete

#### Description
Add GPS coordinate capture for audio-based bird identifications, ensuring parity with camera-based identifications.

#### User Story
> As a user recording bird sounds, I want the location captured automatically so I can remember where I heard the species and track migration patterns.

#### Technical Requirements

**Files to Modify**:
1. `src/screens/AudioRecordScreen.tsx`
   - Import `useLocation` hook
   - Capture GPS when recording starts
   - Pass GPS to results via navigation params

2. `src/types/navigation.ts`
   - Add GPS params to AudioResults route

3. `src/screens/AudioResultsScreen.tsx`
   - Display GPS coordinates card (similar to camera results)
   - Pass GPS to save function

4. `src/services/historyService.ts`
   - Already supports GPS (type is 'audio' or 'camera')
   - No changes needed

#### Implementation Steps

**Part 1: GPS Capture During Recording** (1 hour)
```typescript
// src/screens/AudioRecordScreen.tsx

import { useLocation } from '../hooks/useLocation';

const [gpsCoordinates, setGpsCoordinates] = useState<LocationCoordinates | null>(null);
const { getCurrentLocation } = useLocation();

const handleStartRecording = async () => {
  setIsRecording(true);

  // Capture GPS when recording starts
  const gps = await getCurrentLocation();
  setGpsCoordinates(gps);

  if (gps) {
    console.log(`Audio GPS: ${gps.latitude}, ${gps.longitude} (±${gps.accuracy}m)`);
  }

  // Start audio recording
  await recordingRef.current.startAsync();
};
```

**Part 2: Pass GPS Through Navigation** (30 min)
```typescript
// Navigate to AudioResults with GPS
navigation.navigate('AudioResults', {
  audioUri: recording.uri,
  duration: recording.durationMillis,
  latitude: gpsCoordinates?.latitude,
  longitude: gpsCoordinates?.longitude,
  accuracy: gpsCoordinates?.accuracy,
});
```

**Part 3: Display GPS in AudioResultsScreen** (1 hour)
```typescript
// src/screens/AudioResultsScreen.tsx

const { audioUri, duration, latitude, longitude, accuracy } = route.params;

// Add GPS display card (copy from ResultsScreen.tsx)
{latitude && longitude && (
  <View style={styles.card}>
    <View style={styles.gpsHeader}>
      <Ionicons name="location" size={20} />
      <Text>Recording Location</Text>
    </View>
    <Text style={styles.gpsText}>
      Latitude: {latitude.toFixed(6)}°{'\n'}
      Longitude: {longitude.toFixed(6)}°
      {accuracy && `\nAccuracy: ±${accuracy.toFixed(1)}m`}
    </Text>
  </View>
)}
```

**Part 4: Save GPS with Audio History** (30 min)
```typescript
// Already supported - historyService.saveIdentification accepts GPS params
await historyService.saveIdentification({
  species: speciesData,
  imageUri: audioUri, // Store audio file path
  confidence: result.confidence / 100,
  latitude,
  longitude,
  accuracy,
  isPremium,
  type: 'audio', // Differentiates from camera
});
```

#### Testing Checklist
- [ ] GPS captured when audio recording starts
- [ ] GPS displays on AudioResults screen
- [ ] GPS saves with audio history entry
- [ ] Audio history cards show GPS coordinates
- [ ] Navigation to detail shows GPS in Habitat tab
- [ ] Works without GPS (graceful fallback)

#### Success Metrics
- Audio and camera identifications both show GPS
- Consistent UX across both identification types
- No performance degradation

---

### 🗺️ Feature 2: Map View of History Locations
**Priority**: MEDIUM
**Estimated Time**: 8-12 hours
**Dependencies**: Phase 9 complete, react-native-maps installed

#### Description
Display all saved identifications on an interactive map, allowing users to see where they've encountered different species and explore geographic patterns.

#### User Story
> As a user with many saved identifications, I want to see them plotted on a map so I can visualize where I've found different species and plan future nature walks.

#### Technical Requirements

**New Dependencies**:
```bash
npx expo install react-native-maps
```

**New Files to Create**:
1. `src/screens/MapViewScreen.tsx` - Full screen map view
2. `src/components/map/CustomMarker.tsx` - Species marker component
3. `src/components/map/MarkerCluster.tsx` - Cluster markers when zoomed out
4. `src/components/map/SpeciesCallout.tsx` - Popup on marker tap

**Files to Modify**:
1. `src/navigation/RootNavigator.tsx` - Add MapView route
2. `src/screens/HistoryScreen.tsx` - Add map toggle button
3. `src/types/navigation.ts` - Add MapView params

#### UI Design

**Map Features**:
- Google Maps / Apple Maps integration
- Custom markers color-coded by category:
  - 🟢 Green: Plants
  - 🟤 Brown: Wildlife (mammals)
  - 🔵 Blue: Birds
  - 🟠 Orange: Fungi
  - 🟣 Purple: Insects
- Marker clusters when zoomed out (10+ markers nearby)
- Tap marker → Show species callout with photo
- Tap callout → Navigate to SpeciesDetail
- Current location indicator
- Zoom controls

**Toggle Button in History**:
```
┌──────────────────────┐
│ History       🗺️ Map  │  ← Toggle button (top right)
├──────────────────────┤
│ Statistics           │
│ [Grid View]          │
└──────────────────────┘
```

#### Implementation Steps

**Part 1: Install & Configure react-native-maps** (1 hour)
```bash
npx expo install react-native-maps

# Configure API keys
# iOS: Add Google Maps API key to app.json
# Android: Add to AndroidManifest.xml
```

**Part 2: Create MapViewScreen** (3 hours)
```typescript
// src/screens/MapViewScreen.tsx

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { historyService } from '../services/historyService';

export default function MapViewScreen() {
  const [history, setHistory] = useState<IdentificationRecord[]>([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await historyService.getHistory();
    const withGPS = data.filter(item => item.latitude && item.longitude);
    setHistory(withGPS);

    // Center map on first marker or user location
    if (withGPS.length > 0) {
      setRegion({
        latitude: withGPS[0].latitude!,
        longitude: withGPS[0].longitude!,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'plant': return '#8FAF87';      // Green
      case 'wildlife': return '#8B4513';   // Brown
      case 'fungi': return '#FFA500';      // Orange
      case 'insect': return '#9370DB';     // Purple
      default: return '#4A90E2';           // Blue
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {history.map(item => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude!,
              longitude: item.longitude!,
            }}
            pinColor={getMarkerColor(item.category)}
            onPress={() => handleMarkerPress(item)}
          >
            <CustomMarker
              category={item.category}
              imageUri={item.imageUri}
              commonName={item.commonName}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
```

**Part 3: Create Custom Marker Component** (2 hours)
```typescript
// src/components/map/CustomMarker.tsx

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  category,
  imageUri,
  commonName,
}) => {
  return (
    <View style={styles.markerContainer}>
      {/* Circular photo thumbnail */}
      <View style={[styles.markerImage, { borderColor: getCategoryColor(category) }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      </View>
      {/* Category icon badge */}
      <View style={[styles.iconBadge, { backgroundColor: getCategoryColor(category) }]}>
        <Ionicons name={getCategoryIcon(category)} size={12} color="#FFF" />
      </View>
    </View>
  );
};
```

**Part 4: Add Marker Callout** (2 hours)
```typescript
// src/components/map/SpeciesCallout.tsx

<Marker ...>
  <Callout onPress={() => navigation.navigate('SpeciesDetail', { ... })}>
    <View style={styles.callout}>
      <Image source={{ uri: item.imageUri }} style={styles.calloutImage} />
      <View style={styles.calloutInfo}>
        <Text style={styles.calloutTitle}>{item.commonName}</Text>
        <Text style={styles.calloutSubtitle}>{item.scientificName}</Text>
        <Text style={styles.calloutDate}>{formatDate(item.timestamp)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} />
    </View>
  </Callout>
</Marker>
```

**Part 5: Add Toggle in History Screen** (1 hour)
```typescript
// src/screens/HistoryScreen.tsx

const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

return (
  <View style={styles.container}>
    <AppHeader
      title="History"
      rightButton={
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
          <Ionicons
            name={viewMode === 'grid' ? 'map' : 'grid'}
            size={24}
            color={theme.colors.primary.main}
          />
        </TouchableOpacity>
      }
    />

    {viewMode === 'grid' ? (
      <FlatList ... />
    ) : (
      <MapViewScreen />
    )}
  </View>
);
```

**Part 6: Implement Marker Clustering** (2 hours)
```bash
npm install react-native-map-clustering
```

```typescript
import MapView from 'react-native-map-clustering';

<MapView
  clusterColor={theme.colors.primary.main}
  clusterTextColor="#FFFFFF"
  radius={50}
  extent={512}
  ...
/>
```

#### Testing Checklist
- [ ] Map displays with all GPS-tagged identifications
- [ ] Markers color-coded by category
- [ ] Tap marker shows callout with species info
- [ ] Tap callout navigates to SpeciesDetail
- [ ] Marker clustering works when zoomed out
- [ ] User location displays (blue dot)
- [ ] Toggle between grid and map view works
- [ ] Map centers on identifications or user location
- [ ] Performance good with 50+ markers

#### Success Metrics
- Users can visualize identification locations
- Map renders smoothly with 100+ markers
- Callouts provide enough info to be useful
- Toggle is intuitive and fast

---

### 📤 Feature 3: Export History with GPS Data
**Priority**: MEDIUM
**Estimated Time**: 6-8 hours
**Dependencies**: Phase 9 complete, expo-sharing installed

#### Description
Allow users to export their identification history to various formats (CSV, GPX, KML, JSON) with GPS coordinates, enabling data analysis, backup, and sharing with other apps.

#### User Story
> As a user with valuable identification data, I want to export my history with GPS coordinates so I can back up my data, analyze patterns, and import into other mapping/tracking applications.

#### Technical Requirements

**New Dependencies**:
```bash
npx expo install expo-sharing expo-file-system
```

**New Files to Create**:
1. `src/services/exportService.ts` - Export logic for all formats
2. `src/components/modals/ExportModal.tsx` - Export options modal
3. `src/utils/formatters/csvFormatter.ts` - CSV export
4. `src/utils/formatters/gpxFormatter.ts` - GPX export (for GPS apps)
5. `src/utils/formatters/kmlFormatter.ts` - KML export (for Google Earth)
6. `src/utils/formatters/jsonFormatter.ts` - JSON export (for backup)

**Files to Modify**:
1. `src/screens/HistoryScreen.tsx` - Add export button
2. `src/screens/SettingsScreen.tsx` - Add export option in settings

#### Export Formats

**1. CSV (Comma-Separated Values)**
```csv
ID,Date,Common Name,Scientific Name,Category,Confidence,Latitude,Longitude,Accuracy,Edibility,Type
id_123,2024-01-15 14:30:00,Oak Tree,Quercus robur,plant,0.94,51.507400,-0.127800,15.0,Unknown,camera
id_124,2024-01-15 15:45:00,Robin,Erithacus rubecula,wildlife,0.92,51.508200,-0.128100,12.5,Unknown,audio
```

**Use Case**: Import into Excel, Google Sheets, data analysis tools

**2. GPX (GPS Exchange Format)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <wpt lat="51.507400" lon="-0.127800">
    <name>Oak Tree</name>
    <desc>Quercus robur (94% confidence)</desc>
    <time>2024-01-15T14:30:00Z</time>
    <sym>Flag, Green</sym>
  </wpt>
</gpx>
```

**Use Case**: Import into AllTrails, Gaia GPS, hiking apps, GPS devices

**3. KML (Keyhole Markup Language)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Placemark>
      <name>Oak Tree</name>
      <description>Quercus robur - Confidence: 94%</description>
      <Point>
        <coordinates>-0.127800,51.507400,0</coordinates>
      </Point>
      <Style>
        <IconStyle>
          <color>ff87af8f</color>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>
        </IconStyle>
      </Style>
    </Placemark>
  </Document>
</kml>
```

**Use Case**: Import into Google Earth, Google Maps, ArcGIS

**4. JSON (JavaScript Object Notation)**
```json
{
  "export_date": "2024-01-15T16:00:00Z",
  "total_count": 42,
  "identifications": [
    {
      "id": "id_123",
      "timestamp": 1705329000000,
      "commonName": "Oak Tree",
      "scientificName": "Quercus robur",
      "category": "plant",
      "confidence": 0.94,
      "location": {
        "latitude": 51.507400,
        "longitude": -0.127800,
        "accuracy": 15.0
      },
      "edibility": "unknown",
      "type": "camera",
      "imageUri": "photos/id_123.jpg"
    }
  ]
}
```

**Use Case**: Full data backup, re-import to app, custom analysis

#### Implementation Steps

**Part 1: Create Export Service** (3 hours)
```typescript
// src/services/exportService.ts

class ExportService {
  /**
   * Export history to CSV format
   */
  async exportToCSV(history: IdentificationRecord[]): Promise<string> {
    const headers = [
      'ID',
      'Date',
      'Common Name',
      'Scientific Name',
      'Category',
      'Confidence',
      'Latitude',
      'Longitude',
      'Accuracy',
      'Safety Level',
      'Type',
    ].join(',');

    const rows = history.map(item => [
      item.id,
      new Date(item.timestamp).toISOString(),
      `"${item.commonName}"`,
      `"${item.scientificName}"`,
      item.category,
      item.confidence,
      item.latitude || '',
      item.longitude || '',
      item.accuracy || '',
      item.safetyLevel,
      item.type,
    ].join(','));

    return [headers, ...rows].join('\n');
  }

  /**
   * Export history to GPX format (for GPS apps)
   */
  async exportToGPX(history: IdentificationRecord[]): Promise<string> {
    const waypoints = history
      .filter(item => item.latitude && item.longitude)
      .map(item => `
        <wpt lat="${item.latitude}" lon="${item.longitude}">
          <name>${escapeXml(item.commonName)}</name>
          <desc>${escapeXml(item.scientificName)} (${Math.round(item.confidence * 100)}% confidence)</desc>
          <time>${new Date(item.timestamp).toISOString()}</time>
          <sym>${this.getCategorySymbol(item.category)}</sym>
        </wpt>
      `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="N8ture AI App">
  <metadata>
    <name>N8ture Identifications</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  ${waypoints}
</gpx>`;
  }

  /**
   * Export history to KML format (for Google Earth)
   */
  async exportToKML(history: IdentificationRecord[]): Promise<string> {
    const placemarks = history
      .filter(item => item.latitude && item.longitude)
      .map(item => `
        <Placemark>
          <name>${escapeXml(item.commonName)}</name>
          <description>
            <![CDATA[
              <b>${item.scientificName}</b><br/>
              Category: ${item.category}<br/>
              Confidence: ${Math.round(item.confidence * 100)}%<br/>
              Date: ${new Date(item.timestamp).toLocaleDateString()}<br/>
              Type: ${item.type}
            ]]>
          </description>
          <Point>
            <coordinates>${item.longitude},${item.latitude},0</coordinates>
          </Point>
          <Style>
            <IconStyle>
              <color>${this.getCategoryColor(item.category)}</color>
              <Icon>
                <href>http://maps.google.com/mapfiles/kml/paddle/${this.getCategoryIcon(item.category)}.png</href>
              </Icon>
            </IconStyle>
          </Style>
        </Placemark>
      `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>N8ture AI Identifications</name>
    ${placemarks}
  </Document>
</kml>`;
  }

  /**
   * Export history to JSON format (full backup)
   */
  async exportToJSON(history: IdentificationRecord[]): Promise<string> {
    const exportData = {
      export_date: new Date().toISOString(),
      app_version: '1.0.0',
      total_count: history.length,
      identifications: history,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Save export to file and share
   */
  async saveAndShare(content: string, filename: string): Promise<void> {
    const fileUri = FileSystem.documentDirectory + filename;

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, content);

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: this.getMimeType(filename),
        dialogTitle: 'Export History',
      });
    }
  }

  private getMimeType(filename: string): string {
    if (filename.endsWith('.csv')) return 'text/csv';
    if (filename.endsWith('.gpx')) return 'application/gpx+xml';
    if (filename.endsWith('.kml')) return 'application/vnd.google-earth.kml+xml';
    if (filename.endsWith('.json')) return 'application/json';
    return 'text/plain';
  }
}

export const exportService = new ExportService();
```

**Part 2: Create Export Modal** (2 hours)
```typescript
// src/components/modals/ExportModal.tsx

export const ExportModal: React.FC<ExportModalProps> = ({ visible, onClose }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'gpx' | 'kml' | 'json') => {
    setExporting(true);

    try {
      const history = await historyService.getHistory();

      if (history.length === 0) {
        Alert.alert('No Data', 'You have no identifications to export.');
        return;
      }

      let content: string;
      let filename: string;

      switch (format) {
        case 'csv':
          content = await exportService.exportToCSV(history);
          filename = `n8ture_history_${Date.now()}.csv`;
          break;
        case 'gpx':
          content = await exportService.exportToGPX(history);
          filename = `n8ture_waypoints_${Date.now()}.gpx`;
          break;
        case 'kml':
          content = await exportService.exportToKML(history);
          filename = `n8ture_locations_${Date.now()}.kml`;
          break;
        case 'json':
          content = await exportService.exportToJSON(history);
          filename = `n8ture_backup_${Date.now()}.json`;
          break;
      }

      await exportService.saveAndShare(content, filename);

      Alert.alert('Success', `Exported ${history.length} identifications!`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to export history.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Export History</Text>
          <Text style={styles.subtitle}>Choose export format</Text>

          {/* CSV Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExport('csv')}
            disabled={exporting}
          >
            <Ionicons name="document-text" size={24} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>CSV (Excel)</Text>
              <Text style={styles.optionDesc}>Spreadsheet format for data analysis</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          {/* GPX Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExport('gpx')}
            disabled={exporting}
          >
            <Ionicons name="navigate" size={24} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>GPX (GPS)</Text>
              <Text style={styles.optionDesc}>Import to AllTrails, Gaia, GPS devices</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          {/* KML Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExport('kml')}
            disabled={exporting}
          >
            <Ionicons name="globe" size={24} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>KML (Google Earth)</Text>
              <Text style={styles.optionDesc}>View in Google Earth or Maps</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          {/* JSON Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleExport('json')}
            disabled={exporting}
          >
            <Ionicons name="code" size={24} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>JSON (Full Backup)</Text>
              <Text style={styles.optionDesc}>Complete data backup with all details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
```

**Part 3: Add Export Button to History** (1 hour)
```typescript
// src/screens/HistoryScreen.tsx

const [showExportModal, setShowExportModal] = useState(false);

return (
  <View style={styles.container}>
    <AppHeader
      title="History"
      rightButton={
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowExportModal(true)}>
            <Ionicons name="share-outline" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('map')}>
            <Ionicons name="map" size={24} />
          </TouchableOpacity>
        </View>
      }
    />

    <ExportModal
      visible={showExportModal}
      onClose={() => setShowExportModal(false)}
    />

    {/* Rest of screen ... */}
  </View>
);
```

#### Testing Checklist
- [ ] CSV export contains all data fields
- [ ] GPX export imports correctly into AllTrails/GPS apps
- [ ] KML export displays correctly in Google Earth
- [ ] JSON export includes all identification data
- [ ] Sharing modal appears after export
- [ ] Export works with 0 identifications (shows error)
- [ ] Export works with 100+ identifications
- [ ] File names are unique and timestamped
- [ ] Special characters escaped properly in XML formats
- [ ] Missing GPS data handled gracefully

#### Success Metrics
- Users can export in multiple formats
- Exports import successfully into target apps
- All data preserved in export
- Fast export for 100+ entries (<5 seconds)

---

## Additional Feature Ideas (Future Phases)

### 📱 Feature 4: Share Individual Identification
- Share single species to social media with photo + GPS
- Generate shareable image with map embed
- Copy GPS coordinates to clipboard

### 🔍 Feature 5: Search & Filter History
- Search by species name
- Filter by category (plants, wildlife, fungi)
- Filter by date range
- Filter by location (within X miles)
- Sort by date, confidence, name

### 🗑️ Feature 6: Delete & Edit History
- Swipe to delete individual entries
- Edit species name corrections
- Delete photo file with entry
- Bulk delete options

### 📊 Feature 7: Statistics Dashboard
- Species diversity chart
- Identification timeline
- Top species encountered
- Category breakdown pie chart
- GPS heatmap of activity

### 🌐 Feature 8: Offline Maps
- Download map tiles for offline use
- View history map without internet
- Cache species photos for offline

### 🔔 Feature 9: Location-Based Reminders
- "You're near a previous sighting!"
- Geofencing for favorite locations
- Seasonal reminders for migrations

### 🎯 Feature 10: Accuracy Tracking
- Track identification accuracy over time
- Allow users to mark identifications as correct/incorrect
- Improve AI model based on feedback

---

## Implementation Priority

### Phase 10A (Immediate - 4-6 hours)
1. ✅ Audio identification GPS support
   - High value, low effort
   - Achieves feature parity

### Phase 10B (Near-term - 8-12 hours)
2. ✅ Map view of history locations
   - High user value
   - Moderate effort
   - Visual appeal

### Phase 10C (Near-term - 6-8 hours)
3. ✅ Export history with GPS data
   - Important for data ownership
   - Moderate effort
   - Enables backup/migration

### Phase 11+ (Future)
- Share individual identification
- Search & filter history
- Delete & edit history
- Statistics dashboard
- Offline maps
- Location-based reminders

---

## Dependencies & Prerequisites

### Required Libraries
```json
{
  "dependencies": {
    "expo-location": "^17.0.1",         // Already installed (Phase 9)
    "expo-file-system": "^18.0.3",      // Already installed (Phase 9)
    "@react-native-async-storage/async-storage": "^2.1.0",  // Already installed
    "react-native-maps": "^1.19.0",     // NEW - Phase 10B
    "react-native-map-clustering": "^3.4.2",  // NEW - Phase 10B
    "expo-sharing": "^13.0.0"           // NEW - Phase 10C
  }
}
```

### Platform-Specific Setup

**iOS**:
- Add Google Maps API key to `app.json`:
```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "YOUR_IOS_MAPS_KEY"
    }
  }
}
```

**Android**:
- Add Google Maps API key to `app.json`:
```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_ANDROID_MAPS_KEY"
      }
    }
  }
}
```

---

## Estimated Timeline

| Phase | Feature | Hours | Sprint |
|-------|---------|-------|--------|
| 10A | Audio GPS | 4-6 | Sprint 1 (Week 1) |
| 10B | Map View | 8-12 | Sprint 2-3 (Week 2-3) |
| 10C | Export | 6-8 | Sprint 3 (Week 3) |
| **Total** | **Phase 10** | **18-26** | **3 weeks** |

---

## Success Criteria

Phase 10 is complete when:

- ✅ Audio identifications capture GPS (parity with camera)
- ✅ Map view displays all GPS-tagged identifications
- ✅ Map markers color-coded by category
- ✅ Export works in all 4 formats (CSV, GPX, KML, JSON)
- ✅ Exports import successfully into target apps
- ✅ All testing checklists pass
- ✅ No performance degradation
- ✅ Documentation updated

---

## Questions for Product Owner

Before starting Phase 10, clarify:

1. **Map Provider**: Google Maps or Apple Maps (or both platform-specific)?
2. **Export Limits**: Any restrictions on export for free tier?
3. **Photo Export**: Include photos in exports or just metadata?
4. **Map Clustering**: At what zoom level should markers cluster?
5. **Audio GPS**: Capture at start or end of recording?
6. **Priority**: Which feature should we build first?

---

## Related Documentation

- `PHASE_9_IMPLEMENTATION_PLAN.md` - GPS capture implementation
- `PHASE_9_TESTING_GUIDE.md` - Testing procedures
- `COMPLETE_APP_WORKFLOW.md` - Full user journey
- `docs/WildID_MVP_PRD.md` - Product requirements

---

**Last Updated**: 2024-01-15
**Status**: Planning Phase
**Next Action**: Review with team, prioritize features, begin Phase 10A
