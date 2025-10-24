/**
 * History Service
 *
 * Manages identification history storage including:
 * - Saving photos to app documents directory
 * - Storing identification data with GPS coordinates
 * - Loading and managing history
 * - Free tier limits (10 entries) vs Premium (unlimited)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import {
  IdentificationRecord,
  SaveIdentificationRequest,
  IdentificationStats,
} from '../types/identification';

const HISTORY_KEY = '@n8ture_identification_history';
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

class HistoryService {
  /**
   * Initialize storage directories
   */
  async init(): Promise<void> {
    try {
      // Create photos directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
        console.log('Created photos directory:', PHOTOS_DIR);
      }
    } catch (error) {
      console.error('Error initializing history service:', error);
    }
  }

  /**
   * Save identification to history
   * Copies photo to permanent storage and saves metadata to AsyncStorage
   */
  async saveIdentification(
    request: SaveIdentificationRequest
  ): Promise<IdentificationRecord> {
    await this.init();

    const {
      species,
      imageUri,
      confidence,
      latitude,
      longitude,
      accuracy,
      isPremium,
      notes,
      type = 'camera',
    } = request;

    // Generate unique ID
    const id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    // Copy photo to permanent storage
    const photoExtension = imageUri.split('.').pop() || 'jpg';
    const photoFilename = `${id}.${photoExtension}`;
    const photoPath = `${PHOTOS_DIR}${photoFilename}`;

    try {
      await FileSystem.copyAsync({
        from: imageUri,
        to: photoPath,
      });
      console.log('Photo saved to:', photoPath);
    } catch (error) {
      console.error('Error copying photo:', error);
      throw new Error('Failed to save photo');
    }

    // For now, use same image as thumbnail
    // TODO: Implement thumbnail generation with image resizing
    const thumbnailPath = photoPath;

    // Create record
    const record: IdentificationRecord = {
      id,
      speciesId: species.id,
      commonName: species.commonName,
      scientificName: species.scientificName,
      family: species.family,
      category: species.category,
      safetyLevel: species.safetyLevel,
      imageUri: photoPath,
      thumbnailUri: thumbnailPath,
      confidence,
      latitude,
      longitude,
      accuracy,
      timestamp,
      isPremium,
      notes,
      type,
    };

    // Load existing history
    const history = await this.getHistory();

    // Add to beginning of array (most recent first)
    history.unshift(record);

    // For free users, limit to 10 entries
    if (!isPremium && history.length > 10) {
      // Delete photos for removed records
      const removed = history.slice(10);
      for (const item of removed) {
        await this.deletePhoto(item.imageUri);
        if (item.thumbnailUri && item.thumbnailUri !== item.imageUri) {
          await this.deletePhoto(item.thumbnailUri);
        }
      }
      history.splice(10); // Keep only first 10
      console.log('Trimmed history to 10 entries for free user');
    }

    // Save updated history
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    console.log(`Saved identification:`, record.commonName);

    return record;
  }

  /**
   * Get all identification history
   * Returns array sorted by timestamp (newest first)
   */
  async getHistory(): Promise<IdentificationRecord[]> {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      if (!json) return [];

      const history: IdentificationRecord[] = JSON.parse(json);

      // Sort by timestamp descending (newest first)
      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  /**
   * Get identification by ID
   */
  async getIdentificationById(id: string): Promise<IdentificationRecord | null> {
    const history = await this.getHistory();
    return history.find((item) => item.id === id) || null;
  }

  /**
   * Delete identification by ID
   * Removes from history and deletes photo files
   */
  async deleteIdentification(id: string): Promise<boolean> {
    try {
      const history = await this.getHistory();
      const index = history.findIndex((item) => item.id === id);

      if (index === -1) {
        console.log('Identification not found:', id);
        return false;
      }

      const item = history[index];

      // Delete photo files
      await this.deletePhoto(item.imageUri);
      if (item.thumbnailUri && item.thumbnailUri !== item.imageUri) {
        await this.deletePhoto(item.thumbnailUri);
      }

      // Remove from history
      history.splice(index, 1);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

      console.log('Deleted identification:', item.commonName);
      return true;
    } catch (error) {
      console.error('Error deleting identification:', error);
      return false;
    }
  }

  /**
   * Update notes for an identification
   */
  async updateNotes(id: string, notes: string): Promise<boolean> {
    try {
      const history = await this.getHistory();
      const item = history.find((i) => i.id === id);

      if (!item) return false;

      item.notes = notes;
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

      console.log('Updated notes for:', item.commonName);
      return true;
    } catch (error) {
      console.error('Error updating notes:', error);
      return false;
    }
  }

  /**
   * Get identification statistics
   */
  async getStats(): Promise<IdentificationStats> {
    const history = await this.getHistory();

    const stats: IdentificationStats = {
      total: history.length,
      plants: history.filter((i) => i.category === 'plant').length,
      wildlife: history.filter((i) => i.category === 'wildlife').length,
      fungi: history.filter((i) => i.category === 'fungi').length,
      insects: history.filter((i) => i.category === 'insect').length,
      firstIdentification: history.length > 0 ? history[history.length - 1].timestamp : undefined,
      lastIdentification: history.length > 0 ? history[0].timestamp : undefined,
    };

    // Find most identified species
    const speciesCounts = new Map<string, number>();
    history.forEach((item) => {
      const count = speciesCounts.get(item.commonName) || 0;
      speciesCounts.set(item.commonName, count + 1);
    });

    if (speciesCounts.size > 0) {
      const topSpeciesEntry = Array.from(speciesCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      stats.topSpecies = {
        commonName: topSpeciesEntry[0],
        count: topSpeciesEntry[1],
      };
    }

    return stats;
  }

  /**
   * Search history by query (common name, scientific name, or category)
   */
  async searchHistory(query: string): Promise<IdentificationRecord[]> {
    const history = await this.getHistory();
    const lowerQuery = query.toLowerCase();

    return history.filter(
      (item) =>
        item.commonName.toLowerCase().includes(lowerQuery) ||
        item.scientificName.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.family && item.family.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get history filtered by category
   */
  async getHistoryByCategory(
    category: 'plant' | 'wildlife' | 'fungi' | 'insect'
  ): Promise<IdentificationRecord[]> {
    const history = await this.getHistory();
    return history.filter((item) => item.category === category);
  }

  /**
   * Clear all history (for testing/reset)
   * CAUTION: This deletes all photos and data permanently
   */
  async clearHistory(): Promise<void> {
    try {
      const history = await this.getHistory();

      // Delete all photos
      for (const item of history) {
        await this.deletePhoto(item.imageUri);
        if (item.thumbnailUri && item.thumbnailUri !== item.imageUri) {
          await this.deletePhoto(item.thumbnailUri);
        }
      }

      // Clear AsyncStorage
      await AsyncStorage.removeItem(HISTORY_KEY);

      console.log('Cleared all identification history');
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  /**
   * Delete photo file from storage
   * @private
   */
  private async deletePhoto(uri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
        console.log('Deleted photo:', uri);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Don't throw - continue with other operations
    }
  }

  /**
   * Export history as JSON (for backup/export feature)
   */
  async exportHistory(): Promise<string> {
    const history = await this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<{
    photosCount: number;
    estimatedSizeMB: number;
  }> {
    try {
      const history = await this.getHistory();
      let totalSize = 0;

      // Get size of all photos
      for (const item of history) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(item.imageUri);
          if (fileInfo.exists && 'size' in fileInfo) {
            totalSize += fileInfo.size || 0;
          }
        } catch (error) {
          // Skip files that don't exist
        }
      }

      return {
        photosCount: history.length,
        estimatedSizeMB: totalSize / (1024 * 1024),
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { photosCount: 0, estimatedSizeMB: 0 };
    }
  }
}

// Export singleton instance
export const historyService = new HistoryService();
