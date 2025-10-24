/**
 * Audio type definitions for N8ture AI app
 *
 * Defines types for audio recording, playback, and identification
 */

/**
 * Recording states
 */
export type RecordingState = 'idle' | 'recording' | 'paused' | 'recorded' | 'playing';

/**
 * Audio quality presets
 */
export type AudioQuality = 'low' | 'medium' | 'high';

/**
 * Identification types for different audio sources
 */
export type IdentificationType = 'bird' | 'bat' | 'insect' | 'general';

/**
 * Audio recording settings
 */
export interface AudioRecordingSettings {
  quality: AudioQuality;
  maxDuration: number; // in seconds
  sampleRate: number;  // Hz
  channels: 1 | 2;     // Mono or Stereo
  bitRate: number;     // bits per second
}

/**
 * Audio recording metadata
 */
export interface AudioRecording {
  id: string;
  uri: string;
  duration: number;
  createdAt: Date;
  quality: AudioQuality;
  fileSize: number;
  sampleRate: number;
  channels: number;
  format: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
  };
}

/**
 * Audio metering data for waveform visualization
 */
export interface AudioMeteringData {
  averagePower: number;   // -160 to 0 dB
  peakPower: number;      // -160 to 0 dB
  normalizedLevel: number; // 0 to 100 for UI
}

/**
 * Audio identification result from AI analysis
 */
export interface AudioIdentificationResult {
  id: string;
  type: IdentificationType;
  species: string;
  scientificName: string;
  commonName: string;
  confidence: number; // 0-100
  audioFeatures: {
    frequency: number;       // Hz
    duration: number;        // seconds
    pattern: string;         // e.g., "repeated chirps", "continuous"
    spectralPeaks?: number[]; // Frequency peaks
  };
  timestamp: Date;
  audioUri: string;
  imageUrl?: string; // Species photo
  description?: string;
  habitat?: string;
  similarSpecies?: string[];
  conservationStatus?: string;
}

/**
 * Audio metadata for Firebase Storage
 */
export interface AudioMetadata {
  userId: string;
  userName?: string;
  recordedAt: Date;
  duration: number;
  quality: AudioQuality;
  fileSize: number;
  sampleRate: number;
  format: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  identificationId?: string;
  identificationType?: IdentificationType;
}

/**
 * Audio upload progress
 */
export interface AudioUploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
  state: 'running' | 'paused' | 'success' | 'error' | 'canceled';
}

/**
 * Audio info from file
 */
export interface AudioInfo {
  exists: boolean;
  uri: string;
  size: number;
  duration: number;
  format: string;
  modificationTime?: number;
}

/**
 * Processed audio ready for analysis
 */
export interface ProcessedAudio {
  uri: string;
  base64?: string;
  format: string;
  duration: number;
  size: number;
  compressed: boolean;
}

/**
 * Audio recording error types
 */
export type AudioErrorType =
  | 'PERMISSION_DENIED'
  | 'RECORDING_FAILED'
  | 'PLAYBACK_FAILED'
  | 'UPLOAD_FAILED'
  | 'STORAGE_FULL'
  | 'INVALID_FORMAT'
  | 'INTERRUPTED'
  | 'UNKNOWN';

/**
 * Audio error
 */
export interface AudioError {
  type: AudioErrorType;
  message: string;
  details?: any;
}

/**
 * Audio quality presets
 */
export const AUDIO_QUALITY_PRESETS: Record<AudioQuality, AudioRecordingSettings> = {
  low: {
    quality: 'low',
    maxDuration: 60,
    sampleRate: 22050,  // 22.05 kHz
    channels: 1,        // Mono
    bitRate: 32000,     // 32 kbps
  },
  medium: {
    quality: 'medium',
    maxDuration: 60,
    sampleRate: 44100,  // 44.1 kHz (CD quality)
    channels: 1,        // Mono
    bitRate: 64000,     // 64 kbps
  },
  high: {
    quality: 'high',
    maxDuration: 60,
    sampleRate: 44100,  // 44.1 kHz (CD quality)
    channels: 1,        // Mono
    bitRate: 128000,    // 128 kbps
  },
};

/**
 * Default recording settings
 */
export const DEFAULT_RECORDING_SETTINGS: AudioRecordingSettings = AUDIO_QUALITY_PRESETS.high;

/**
 * Maximum recording duration (60 seconds)
 */
export const MAX_RECORDING_DURATION = 60;

/**
 * Recording duration presets in seconds
 */
export const DURATION_PRESETS = [10, 30, 60] as const;
