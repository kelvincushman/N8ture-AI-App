/**
 * useAudioRecording hook
 *
 * Comprehensive audio recording hook for N8ture AI app
 * Handles recording, playback, permissions, and audio metering
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import {
  AudioQuality,
  AudioRecordingSettings,
  AudioMeteringData,
  AudioError,
  AudioErrorType,
  AUDIO_QUALITY_PRESETS,
  DEFAULT_RECORDING_SETTINGS,
  MAX_RECORDING_DURATION,
} from '../types/audio';

/**
 * Audio recording hook interface
 */
export interface UseAudioRecordingReturn {
  // Recording state
  isRecording: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  recordingUri: string | null;
  duration: number;
  recordingState: 'idle' | 'recording' | 'paused' | 'recorded' | 'playing';

  // Permissions
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;

  // Recording controls
  startRecording: (maxDuration?: number) => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;

  // Playback controls
  playRecording: () => Promise<void>;
  pausePlayback: () => Promise<void>;
  stopPlayback: () => Promise<void>;

  // Audio info
  audioLevel: number; // 0-100 for waveform
  meteringData: AudioMeteringData | null;
  recordingQuality: AudioQuality;
  setRecordingQuality: (quality: AudioQuality) => void;

  // Cleanup
  deleteRecording: () => Promise<void>;

  // Error handling
  error: AudioError | null;
  clearError: () => void;

  // Loading state
  isLoading: boolean;
}

/**
 * useAudioRecording hook
 */
export function useAudioRecording(): UseAudioRecordingReturn {
  // State
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [meteringData, setMeteringData] = useState<AudioMeteringData | null>(null);
  const [recordingQuality, setRecordingQuality] = useState<AudioQuality>('high');
  const [error, setError] = useState<AudioError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get recording state
   */
  const recordingState = useCallback((): 'idle' | 'recording' | 'paused' | 'recorded' | 'playing' => {
    if (isPlaying) return 'playing';
    if (isRecording && isPaused) return 'paused';
    if (isRecording) return 'recording';
    if (recordingUri) return 'recorded';
    return 'idle';
  }, [isRecording, isPaused, isPlaying, recordingUri]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Set error with type
   */
  const setAudioError = useCallback((type: AudioErrorType, message: string, details?: any) => {
    setError({ type, message, details });
    console.error(`Audio Error [${type}]:`, message, details);
  }, []);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        setAudioError('PERMISSION_DENIED', 'Microphone permission is required to record audio');
      }

      return granted;
    } catch (err: any) {
      setAudioError('PERMISSION_DENIED', 'Failed to request microphone permission', err);
      return false;
    }
  }, [setAudioError]);

  /**
   * Check permission on mount
   */
  useEffect(() => {
    (async () => {
      const { status } = await Audio.getPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /**
   * Configure audio mode for recording
   */
  const configureAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  /**
   * Get recording options based on quality
   */
  const getRecordingOptions = useCallback((settings: AudioRecordingSettings) => {
    const options: any = {
      isMeteringEnabled: true,
      android: {
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: settings.sampleRate,
        numberOfChannels: settings.channels,
        bitRate: settings.bitRate,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: settings.sampleRate,
        numberOfChannels: settings.channels,
        bitRate: settings.bitRate,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: settings.bitRate,
      },
    };

    return options;
  }, []);

  /**
   * Update metering data from recording
   */
  const updateMetering = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      const status = await recordingRef.current.getStatusAsync();
      if (status.isRecording && status.metering !== undefined) {
        const metering = status.metering;

        // Convert dB to normalized level (0-100)
        // dB range is typically -160 to 0
        const normalizedLevel = Math.max(0, Math.min(100, (metering + 160) / 160 * 100));

        setAudioLevel(normalizedLevel);
        setMeteringData({
          averagePower: metering,
          peakPower: metering,
          normalizedLevel,
        });
      }
    } catch (err) {
      console.warn('Error getting metering data:', err);
    }
  }, []);

  /**
   * Start duration counter
   */
  const startDurationCounter = useCallback(() => {
    const startTime = Date.now();
    durationIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setDuration(elapsed);
    }, 100); // Update every 100ms for smooth UI
  }, []);

  /**
   * Stop duration counter
   */
  const stopDurationCounter = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  /**
   * Start recording
   */
  const startRecording = useCallback(async (maxDuration: number = MAX_RECORDING_DURATION) => {
    try {
      setIsLoading(true);
      clearError();

      // Check permission
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      // Stop any existing recording or playback
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Configure audio mode
      await configureAudioMode();

      // Get recording options
      const settings = AUDIO_QUALITY_PRESETS[recordingQuality];
      const options = getRecordingOptions({ ...settings, maxDuration });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(options);
      recordingRef.current = recording;

      setIsRecording(true);
      setIsPaused(false);
      setRecordingUri(null);
      setDuration(0);
      setAudioLevel(0);

      // Start duration counter
      startDurationCounter();

      // Start metering updates
      const meteringInterval = setInterval(updateMetering, 100);

      // Set max duration timeout
      maxDurationTimeoutRef.current = setTimeout(async () => {
        clearInterval(meteringInterval);
        await stopRecording();
      }, maxDuration * 1000);

      setIsLoading(false);
    } catch (err: any) {
      setAudioError('RECORDING_FAILED', 'Failed to start recording', err);
      setIsLoading(false);
      setIsRecording(false);
    }
  }, [
    hasPermission,
    recordingQuality,
    requestPermission,
    configureAudioMode,
    getRecordingOptions,
    startDurationCounter,
    updateMetering,
    clearError,
    setAudioError,
  ]);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(async () => {
    try {
      if (!recordingRef.current || !isRecording || isPaused) return;

      await recordingRef.current.pauseAsync();
      setIsPaused(true);
      stopDurationCounter();
    } catch (err: any) {
      setAudioError('RECORDING_FAILED', 'Failed to pause recording', err);
    }
  }, [isRecording, isPaused, stopDurationCounter, setAudioError]);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(async () => {
    try {
      if (!recordingRef.current || !isRecording || !isPaused) return;

      await recordingRef.current.startAsync();
      setIsPaused(false);
      startDurationCounter();
    } catch (err: any) {
      setAudioError('RECORDING_FAILED', 'Failed to resume recording', err);
    }
  }, [isRecording, isPaused, startDurationCounter, setAudioError]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      if (!recordingRef.current || !isRecording) return null;

      // Clear timeouts and intervals
      stopDurationCounter();
      if (maxDurationTimeoutRef.current) {
        clearTimeout(maxDurationTimeoutRef.current);
        maxDurationTimeoutRef.current = null;
      }

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      setIsRecording(false);
      setIsPaused(false);
      setRecordingUri(uri);
      setAudioLevel(0);
      setMeteringData(null);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      recordingRef.current = null;

      return uri;
    } catch (err: any) {
      setAudioError('RECORDING_FAILED', 'Failed to stop recording', err);
      setIsRecording(false);
      return null;
    }
  }, [isRecording, stopDurationCounter, setAudioError]);

  /**
   * Play recording
   */
  const playRecording = useCallback(async () => {
    try {
      if (!recordingUri || isPlaying) return;

      setIsLoading(true);
      clearError();

      // Unload existing sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
              sound.setPositionAsync(0);
            }
          }
        }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err: any) {
      setAudioError('PLAYBACK_FAILED', 'Failed to play recording', err);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [recordingUri, isPlaying, clearError, setAudioError]);

  /**
   * Pause playback
   */
  const pausePlayback = useCallback(async () => {
    try {
      if (!soundRef.current || !isPlaying) return;

      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } catch (err: any) {
      setAudioError('PLAYBACK_FAILED', 'Failed to pause playback', err);
    }
  }, [isPlaying, setAudioError]);

  /**
   * Stop playback
   */
  const stopPlayback = useCallback(async () => {
    try {
      if (!soundRef.current) return;

      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
    } catch (err: any) {
      setAudioError('PLAYBACK_FAILED', 'Failed to stop playback', err);
    }
  }, [setAudioError]);

  /**
   * Delete recording
   */
  const deleteRecording = useCallback(async () => {
    try {
      // Stop playback if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Clear recording
      setRecordingUri(null);
      setDuration(0);
      setAudioLevel(0);
      setMeteringData(null);
      setIsPlaying(false);
    } catch (err: any) {
      setAudioError('UNKNOWN', 'Failed to delete recording', err);
    }
  }, [setAudioError]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Stop recording if active
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }

      // Unload sound if exists
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }

      // Clear intervals and timeouts
      stopDurationCounter();
      if (maxDurationTimeoutRef.current) {
        clearTimeout(maxDurationTimeoutRef.current);
      }
    };
  }, [stopDurationCounter]);

  return {
    // Recording state
    isRecording,
    isPaused,
    isPlaying,
    recordingUri,
    duration,
    recordingState: recordingState(),

    // Permissions
    hasPermission,
    requestPermission,

    // Recording controls
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,

    // Playback controls
    playRecording,
    pausePlayback,
    stopPlayback,

    // Audio info
    audioLevel,
    meteringData,
    recordingQuality,
    setRecordingQuality,

    // Cleanup
    deleteRecording,

    // Error handling
    error,
    clearError,

    // Loading state
    isLoading,
  };
}
