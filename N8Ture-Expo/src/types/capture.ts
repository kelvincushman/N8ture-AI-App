/**
 * Capture System Type Definitions
 *
 * Defines types for the unified capture interface supporting:
 * - Multiple capture modes (camera, audio, both)
 * - Automatic vs Manual operating modes
 * - Track vs Passive listening modes
 * - Real-time detection during walks
 */

import { SpeciesIdentification } from './species';

/**
 * Capture mode determines what input method(s) to use
 */
export type CaptureMode = 'camera' | 'listen' | 'both';

/**
 * Operating mode determines how captures are triggered
 * - automatic: Continuous monitoring with real-time detection
 * - manual: User-triggered captures only
 */
export type OperatingMode = 'automatic' | 'manual';

/**
 * Listening mode (for audio capture)
 * - track: Save detections and consume trials
 * - passive: Show live IDs but don't save (no trial usage)
 */
export type ListeningMode = 'track' | 'passive';

/**
 * Session type categorizes the purpose of the capture session
 */
export type SessionType = 'walk' | 'single-capture' | 'passive';

/**
 * Configuration for a capture session
 */
export interface CaptureConfig {
  mode: CaptureMode;
  operatingMode: OperatingMode;
  listeningMode?: ListeningMode;
  maxDuration?: number; // seconds
  autoSave?: boolean; // In automatic mode, auto-save all detections
}

/**
 * Geographic location data
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: Date;
}

/**
 * A single detection during a capture session
 */
export interface Detection {
  id: string;
  timestamp: Date;
  species: SpeciesIdentification;
  confidence: number;
  marked: boolean; // User explicitly marked this detection
  audioChunkUri?: string; // Reference to audio segment
  imageUri?: string; // Reference to image
  videoUri?: string; // Reference to video (for dual capture)
  location?: GeoLocation;
  duration?: number; // Duration of audio chunk (ms)
  source: 'camera' | 'audio' | 'both';
}

/**
 * Real-time detection event (before user marks)
 */
export interface LiveDetection {
  id: string;
  timestamp: Date;
  speciesName: string;
  scientificName: string;
  confidence: number;
  category: 'bird' | 'bat' | 'insect' | 'plant' | 'fungi' | 'animal';
  dismissed: boolean;
  marked: boolean;
}

/**
 * Complete capture session with all detections
 */
export interface CaptureSession {
  id: string;
  config: CaptureConfig;
  startTime: Date;
  endTime?: Date;
  duration: number; // Total duration in seconds
  detections: Detection[];
  liveDetections: LiveDetection[]; // All real-time detections (marked + unmarked)
  markedDetectionIds: string[]; // IDs of detections user marked to save
  location?: GeoLocation; // Starting location
  locationTrack?: GeoLocation[]; // Location history during walk
  sessionType: SessionType;
  userId: string;
  trialsUsed: number; // Number of trials consumed in this session
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

/**
 * Walk session summary for display after completion
 */
export interface WalkSessionSummary {
  sessionId: string;
  duration: number;
  totalDetections: number;
  uniqueSpecies: number;
  markedDetections: number;
  speciesList: {
    species: SpeciesIdentification;
    occurrences: number;
    timestamps: Date[];
    locations?: GeoLocation[];
  }[];
  startLocation?: GeoLocation;
  endLocation?: GeoLocation;
  distance?: number; // Total distance in meters
}

/**
 * Detection frequency settings for automatic mode
 */
export type DetectionFrequency = 'high' | 'balanced' | 'battery-saver';

/**
 * Detection settings
 */
export interface DetectionSettings {
  frequency: DetectionFrequency;
  autoSave: boolean;
  backgroundDetection: boolean;
  gpsTracking: boolean;
  minimumConfidence: number; // 0.0 - 1.0
}

/**
 * Frequency configurations
 */
export const DETECTION_FREQUENCY_CONFIG: Record<
  DetectionFrequency,
  {
    interval: number; // milliseconds
    chunkDuration: number; // milliseconds
    batteryImpact: 'high' | 'medium' | 'low';
  }
> = {
  high: {
    interval: 5000, // Every 5 seconds
    chunkDuration: 10000, // 10 second chunks
    batteryImpact: 'high',
  },
  balanced: {
    interval: 10000, // Every 10 seconds
    chunkDuration: 10000,
    batteryImpact: 'medium',
  },
  'battery-saver': {
    interval: 15000, // Every 15 seconds
    chunkDuration: 8000, // 8 second chunks
    batteryImpact: 'low',
  },
};

/**
 * Default capture configuration
 */
export const DEFAULT_CAPTURE_CONFIG: CaptureConfig = {
  mode: 'camera',
  operatingMode: 'manual',
  maxDuration: 300, // 5 minutes
  autoSave: false,
};

/**
 * Default detection settings
 */
export const DEFAULT_DETECTION_SETTINGS: DetectionSettings = {
  frequency: 'balanced',
  autoSave: false,
  backgroundDetection: true,
  gpsTracking: true,
  minimumConfidence: 0.65,
};

/**
 * Type guard to check if a capture mode uses audio
 */
export function requiresAudio(mode: CaptureMode): boolean {
  return mode === 'listen' || mode === 'both';
}

/**
 * Type guard to check if a capture mode uses camera
 */
export function requiresCamera(mode: CaptureMode): boolean {
  return mode === 'camera' || mode === 'both';
}

/**
 * Check if detection should consume a trial
 */
export function consumesTrial(
  listeningMode?: ListeningMode,
  marked: boolean = false
): boolean {
  if (listeningMode === 'passive') return false;
  return marked;
}
