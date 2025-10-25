/**
 * MapSnapshotComponent
 *
 * Renders a MapView with numbered pins for capture
 * Used to generate static map images for PDF export
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { IdentificationRecord } from '../types/identification';

export interface MapSnapshotRef {
  getMapView: () => MapView | null;
}

interface MapSnapshotComponentProps {
  identifications: IdentificationRecord[];
  width?: number;
  height?: number;
}

const MapSnapshotComponent = forwardRef<MapSnapshotRef, MapSnapshotComponentProps>(
  ({ identifications, width = 800, height = 600 }, ref) => {
    const mapRef = useRef<MapView>(null);

    // Expose map ref to parent
    useImperativeHandle(ref, () => ({
      getMapView: () => mapRef.current,
    }));

    // Filter GPS-tagged entries and prepare markers
    const markersData = identifications
      .filter(item => item.latitude !== undefined && item.longitude !== undefined)
      .map((item, index) => ({
        id: item.id,
        latitude: item.latitude!,
        longitude: item.longitude!,
        category: item.category,
        number: index + 1,
        commonName: item.commonName,
      }));

    // Calculate region to fit all markers
    const calculateRegion = () => {
      if (markersData.length === 0) {
        return {
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      }

      if (markersData.length === 1) {
        return {
          latitude: markersData[0].latitude,
          longitude: markersData[0].longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
      }

      let minLat = markersData[0].latitude;
      let maxLat = markersData[0].latitude;
      let minLon = markersData[0].longitude;
      let maxLon = markersData[0].longitude;

      markersData.forEach(marker => {
        minLat = Math.min(minLat, marker.latitude);
        maxLat = Math.max(maxLat, marker.latitude);
        minLon = Math.min(minLon, marker.longitude);
        maxLon = Math.max(maxLon, marker.longitude);
      });

      const centerLat = (minLat + maxLat) / 2;
      const centerLon = (minLon + maxLon) / 2;
      const latDelta = (maxLat - minLat) * 1.4; // 40% padding
      const lonDelta = (maxLon - minLon) * 1.4;

      return {
        latitude: centerLat,
        longitude: centerLon,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lonDelta, 0.01),
      };
    };

    const getMarkerColor = (category: string): string => {
      switch (category) {
        case 'plant':
          return '#8FAF87';
        case 'wildlife':
          return '#8B4513';
        case 'fungi':
          return '#FFA500';
        case 'insect':
          return '#9370DB';
        default:
          return '#4A90E2';
      }
    };

    const region = calculateRegion();

    return (
      <View style={[styles.container, { width, height }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          toolbarEnabled={false}
        >
          {markersData.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerBubble,
                    { backgroundColor: getMarkerColor(marker.category) },
                  ]}
                >
                  <Text style={styles.markerNumber}>{marker.number}</Text>
                </View>
                <View
                  style={[
                    styles.markerArrow,
                    { borderTopColor: getMarkerColor(marker.category) },
                  ]}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
);

MapSnapshotComponent.displayName = 'MapSnapshotComponent';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E8F5E9',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});

export default MapSnapshotComponent;
