/**
 * Audio Service
 *
 * Handles audio file operations, Firebase Storage uploads,
 * and metadata management for N8ture AI app
 */

import * as FileSystem from 'expo-file-system';
import {
  AudioMetadata,
  AudioInfo,
  ProcessedAudio,
  AudioUploadProgress,
  AudioIdentificationResult,
} from '../types/audio';

/**
 * AudioService class
 */
export class AudioService {
  private static instance: AudioService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Get audio file information
   */
  async getAudioInfo(uri: string): Promise<AudioInfo> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        return {
          exists: false,
          uri,
          size: 0,
          duration: 0,
          format: '',
        };
      }

      // Extract format from URI
      const format = uri.split('.').pop() || 'unknown';

      return {
        exists: true,
        uri,
        size: fileInfo.size || 0,
        duration: 0, // Duration will be calculated during upload
        format,
        modificationTime: fileInfo.modificationTime,
      };
    } catch (error) {
      console.error('Error getting audio info:', error);
      throw new Error('Failed to get audio file information');
    }
  }

  /**
   * Prepare audio for analysis
   * Reads file and optionally converts to base64
   */
  async prepareForAnalysis(uri: string): Promise<ProcessedAudio> {
    try {
      const info = await this.getAudioInfo(uri);

      if (!info.exists) {
        throw new Error('Audio file does not exist');
      }

      // Read file as base64 for API transmission
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        uri,
        base64,
        format: info.format,
        duration: info.duration,
        size: info.size,
        compressed: false,
      };
    } catch (error) {
      console.error('Error preparing audio for analysis:', error);
      throw new Error('Failed to prepare audio file for analysis');
    }
  }

  /**
   * Compress audio file
   * Note: This is a placeholder - actual compression would require native modules
   */
  async compressAudio(uri: string): Promise<string> {
    // TODO: Implement audio compression
    // For now, return original URI
    console.log('Audio compression not yet implemented');
    return uri;
  }

  /**
   * Upload audio to Firebase Storage
   * Note: This is a placeholder - requires Firebase Storage SDK
   */
  async uploadAudio(
    uri: string,
    metadata: AudioMetadata,
    onProgress?: (progress: AudioUploadProgress) => void
  ): Promise<string> {
    try {
      console.log('Uploading audio to Firebase Storage...');

      // Get file info
      const info = await this.getAudioInfo(uri);

      if (!info.exists) {
        throw new Error('Audio file does not exist');
      }

      // TODO: Implement Firebase Storage upload
      // This requires Firebase Storage SDK to be properly configured
      // For now, return a mock URL

      // Simulate upload progress
      if (onProgress) {
        const totalBytes = info.size;
        let bytesTransferred = 0;

        const interval = setInterval(() => {
          bytesTransferred += totalBytes / 10;
          const progress = Math.min((bytesTransferred / totalBytes) * 100, 100);

          onProgress({
            bytesTransferred: Math.min(bytesTransferred, totalBytes),
            totalBytes,
            progress,
            state: bytesTransferred >= totalBytes ? 'success' : 'running',
          });

          if (bytesTransferred >= totalBytes) {
            clearInterval(interval);
          }
        }, 200);
      }

      // Mock upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock storage URL
      const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockUrl = `https://firebasestorage.googleapis.com/v0/b/n8ture-ai.appspot.com/o/${audioId}.m4a`;

      console.log('Audio uploaded successfully:', mockUrl);

      // TODO: Save metadata to Firestore
      await this.saveAudioMetadata(audioId, metadata);

      return mockUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw new Error('Failed to upload audio file');
    }
  }

  /**
   * Download audio from Firebase Storage
   * Note: This is a placeholder - requires Firebase Storage SDK
   */
  async downloadAudio(audioId: string): Promise<string> {
    try {
      console.log('Downloading audio from Firebase Storage...');

      // TODO: Implement Firebase Storage download
      // This requires Firebase Storage SDK to be properly configured

      // For now, return mock local path
      const localUri = `${FileSystem.cacheDirectory}${audioId}.m4a`;
      console.log('Audio downloaded to:', localUri);

      return localUri;
    } catch (error) {
      console.error('Error downloading audio:', error);
      throw new Error('Failed to download audio file');
    }
  }

  /**
   * Delete audio from Firebase Storage
   * Note: This is a placeholder - requires Firebase Storage SDK
   */
  async deleteAudio(audioId: string): Promise<void> {
    try {
      console.log('Deleting audio from Firebase Storage...');

      // TODO: Implement Firebase Storage deletion
      // This requires Firebase Storage SDK to be properly configured

      // TODO: Delete metadata from Firestore
      await this.deleteAudioMetadata(audioId);

      console.log('Audio deleted successfully');
    } catch (error) {
      console.error('Error deleting audio:', error);
      throw new Error('Failed to delete audio file');
    }
  }

  /**
   * Save audio metadata to Firestore
   * Note: This is a placeholder - requires Firestore SDK
   */
  private async saveAudioMetadata(
    audioId: string,
    metadata: AudioMetadata
  ): Promise<void> {
    try {
      console.log('Saving audio metadata to Firestore...');

      // TODO: Implement Firestore write
      // This requires Firestore SDK to be properly configured

      const firestoreData = {
        audioId,
        ...metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Audio metadata saved:', firestoreData);
    } catch (error) {
      console.error('Error saving audio metadata:', error);
      throw new Error('Failed to save audio metadata');
    }
  }

  /**
   * Delete audio metadata from Firestore
   * Note: This is a placeholder - requires Firestore SDK
   */
  private async deleteAudioMetadata(audioId: string): Promise<void> {
    try {
      console.log('Deleting audio metadata from Firestore...');

      // TODO: Implement Firestore delete
      // This requires Firestore SDK to be properly configured

      console.log('Audio metadata deleted');
    } catch (error) {
      console.error('Error deleting audio metadata:', error);
      throw new Error('Failed to delete audio metadata');
    }
  }

  /**
   * Get audio identification result
   * Note: This is a placeholder - requires backend API
   */
  async getIdentificationResult(
    audioId: string
  ): Promise<AudioIdentificationResult | null> {
    try {
      console.log('Fetching identification result...');

      // TODO: Implement Firestore query or API call
      // This requires backend API to be implemented

      return null;
    } catch (error) {
      console.error('Error getting identification result:', error);
      return null;
    }
  }

  /**
   * Delete local audio file
   */
  async deleteLocalAudio(uri: string): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri);
        console.log('Local audio file deleted:', uri);
      }
    } catch (error) {
      console.error('Error deleting local audio file:', error);
      throw new Error('Failed to delete local audio file');
    }
  }

  /**
   * Calculate audio file size in MB
   */
  getSizeInMB(bytes: number): number {
    return bytes / (1024 * 1024);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }

  /**
   * Validate audio file
   */
  async validateAudioFile(uri: string): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      const info = await this.getAudioInfo(uri);

      if (!info.exists) {
        return { valid: false, error: 'Audio file does not exist' };
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (info.size > maxSize) {
        return {
          valid: false,
          error: `File size exceeds maximum (${this.formatFileSize(maxSize)})`,
        };
      }

      // Check format
      const validFormats = ['m4a', 'mp3', 'wav', 'aac'];
      if (!validFormats.includes(info.format.toLowerCase())) {
        return {
          valid: false,
          error: `Invalid audio format. Supported formats: ${validFormats.join(', ')}`,
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('Error validating audio file:', error);
      return { valid: false, error: 'Failed to validate audio file' };
    }
  }
}

/**
 * Export singleton instance
 */
export default AudioService.getInstance();
