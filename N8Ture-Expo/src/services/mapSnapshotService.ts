/**
 * Map Snapshot Service
 *
 * Captures MapView screenshots with numbered pins for PDF export
 * Uses react-native-view-shot to capture rendered map component
 */

import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { IdentificationRecord } from '../types/identification';

export interface MapSnapshotConfig {
  identifications: IdentificationRecord[];
  width?: number;
  height?: number;
}

class MapSnapshotService {
  /**
   * Capture map view and save to file
   *
   * @param viewRef - Reference to the MapSnapshotComponent
   * @param config - Snapshot configuration
   * @returns Local file URI of the captured map image
   */
  async captureMapView(
    viewRef: any,
    config: MapSnapshotConfig
  ): Promise<string | null> {
    try {
      const { identifications } = config;

      // Filter for GPS-tagged entries only
      const withGPS = identifications.filter(
        item => item.latitude !== undefined && item.longitude !== undefined
      );

      if (withGPS.length === 0) {
        console.log('No GPS-tagged identifications for map snapshot');
        return null;
      }

      console.log(`Capturing map snapshot with ${withGPS.length} numbered markers`);

      // Wait a moment for map to render properly
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Capture the view
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      console.log('Map snapshot captured:', uri);

      // Copy to a permanent location
      const filename = `map-snapshot-${Date.now()}.png`;
      const permanentUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: uri,
        to: permanentUri,
      });

      console.log('Map snapshot saved:', permanentUri);

      return permanentUri;
    } catch (error) {
      console.error('Failed to capture map snapshot:', error);
      return null;
    }
  }

  /**
   * Delete temporary map snapshot
   */
  async deleteSnapshot(uri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        console.log('Map snapshot deleted:', uri);
      }
    } catch (error) {
      console.error('Failed to delete map snapshot:', error);
    }
  }

  /**
   * Clean up old map snapshots (older than 1 hour)
   */
  async cleanupOldSnapshots(): Promise<void> {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return;

      const files = await FileSystem.readDirectoryAsync(cacheDir);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      for (const file of files) {
        if (file.startsWith('map-snapshot-')) {
          const filePath = `${cacheDir}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);

          if (fileInfo.exists && fileInfo.modificationTime) {
            const age = now - fileInfo.modificationTime * 1000;
            if (age > oneHour) {
              await FileSystem.deleteAsync(filePath, { idempotent: true });
              console.log('Cleaned up old map snapshot:', file);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old snapshots:', error);
    }
  }
}

export const mapSnapshotService = new MapSnapshotService();
