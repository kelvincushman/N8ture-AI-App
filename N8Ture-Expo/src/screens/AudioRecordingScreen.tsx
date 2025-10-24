/**
 * AudioRecordingScreen
 *
 * Full-featured audio recording screen for bird song, bat echolocation,
 * and insect sound identification
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useRecordIdentification } from '../hooks/useTrialStatus';
import { useAuth } from '../hooks/useAuth';
import AudioWaveform from '../components/audio/AudioWaveform';
import RecordButton from '../components/audio/RecordButton';
import AudioPlayer from '../components/audio/AudioPlayer';
import { AudioQuality, DURATION_PRESETS } from '../types/audio';

/**
 * AudioRecordingScreen component
 */
export default function AudioRecordingScreen() {
  const navigation = useNavigation();
  const { isSignedIn } = useAuth();
  const { canIdentify, recordIdentification, isRecording: isRecordingIdentification } = useRecordIdentification();

  // Audio recording hook
  const {
    isRecording,
    isPaused,
    isPlaying,
    recordingUri,
    duration,
    recordingState,
    hasPermission,
    requestPermission,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    stopPlayback,
    audioLevel,
    recordingQuality,
    setRecordingQuality,
    deleteRecording,
    error,
    clearError,
    isLoading,
  } = useAudioRecording();

  // Local state
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  /**
   * Handle record button press
   */
  const handleRecordPress = async () => {
    if (isRecording) {
      if (isPaused) {
        await resumeRecording();
      } else {
        await pauseRecording();
      }
    } else if (recordingUri) {
      // Delete existing recording and start new one
      Alert.alert(
        'Start New Recording',
        'This will delete your current recording. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start New',
            onPress: async () => {
              await deleteRecording();
              handleStartRecording();
            },
          },
        ]
      );
    } else {
      handleStartRecording();
    }
  };

  /**
   * Start recording with permission check
   */
  const handleStartRecording = async () => {
    // Check permission
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Microphone Permission Required',
          'Please grant microphone permission in Settings to record audio.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                // TODO: Open app settings
                console.log('Open settings');
              },
            },
          ]
        );
        return;
      }
    }

    // Start recording
    await startRecording(selectedDuration);
  };

  /**
   * Handle stop recording
   */
  const handleStopRecording = async () => {
    const uri = await stopRecording();
    if (uri) {
      Alert.alert('Recording Saved', 'Your recording is ready for identification.');
    }
  };

  /**
   * Handle identify button press
   */
  const handleIdentify = async () => {
    if (!recordingUri) return;

    // Check if user is signed in
    if (!isSignedIn) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to use the identification feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Auth' as never),
          },
        ]
      );
      return;
    }

    // Check if user can perform identification
    if (!canIdentify) {
      Alert.alert(
        'Trial Limit Reached',
        'You have used all your free trials. Upgrade to premium for unlimited identifications.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Upgrade Now',
            onPress: () => {
              navigation.navigate('Paywall' as never);
            },
          },
        ]
      );
      return;
    }

    // Record the identification attempt
    const result = await recordIdentification();

    if (!result.success) {
      if (result.shouldShowPaywall) {
        Alert.alert(
          'Trial Limit Reached',
          result.message,
          [
            { text: 'Maybe Later', style: 'cancel' },
            {
              text: 'Upgrade Now',
              onPress: () => {
                navigation.navigate('Paywall' as never);
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
      return;
    }

    // TODO: Upload audio and get identification
    Alert.alert(
      'Audio Identification',
      'Audio identification feature is coming soon! This will analyze bird songs, bat echolocation, and insect sounds.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle discard recording
   */
  const handleDiscard = () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: deleteRecording,
        },
      ]
    );
  };

  /**
   * Format duration as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get recording state text
   */
  const getStateText = (): string => {
    switch (recordingState) {
      case 'recording':
        return 'Recording...';
      case 'paused':
        return 'Paused';
      case 'recorded':
        return 'Recording Complete';
      case 'playing':
        return 'Playing...';
      default:
        return 'Ready to Record';
    }
  };

  /**
   * Get recording state color
   */
  const getStateColor = (): string => {
    switch (recordingState) {
      case 'recording':
        return theme.colors.error;
      case 'paused':
        return theme.colors.warning;
      case 'recorded':
        return theme.colors.success;
      case 'playing':
        return theme.colors.info;
      default:
        return theme.colors.primary.main;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Audio Recording</Text>
          <Text style={styles.subtitle}>
            Record bird songs, bat calls, or insect sounds for AI identification
          </Text>
        </View>

        {/* Recording state indicator */}
        <View style={styles.stateContainer}>
          <View style={[styles.stateIndicator, { backgroundColor: getStateColor() }]} />
          <Text style={[styles.stateText, { color: getStateColor() }]}>
            {getStateText()}
          </Text>
        </View>

        {/* Duration display */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
          <Text style={styles.durationLimit}>/ {formatTime(selectedDuration)}</Text>
        </View>

        {/* Waveform visualization */}
        <View style={styles.waveformContainer}>
          <AudioWaveform
            audioLevel={audioLevel}
            isRecording={isRecording && !isPaused}
            width={300}
            height={80}
            barCount={30}
          />
        </View>

        {/* Record button */}
        <View style={styles.recordButtonContainer}>
          <RecordButton
            isRecording={isRecording}
            isPaused={isPaused}
            onPress={handleRecordPress}
            disabled={isLoading || isPlaying}
            size={120}
          />
        </View>

        {/* Stop button (shown during recording) */}
        {isRecording && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopRecording}
          >
            <Text style={styles.stopButtonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}

        {/* Audio player (shown when recording exists) */}
        {recordingUri && !isRecording && (
          <View style={styles.playerContainer}>
            <AudioPlayer
              duration={duration}
              isPlaying={isPlaying}
              onPlay={playRecording}
              onPause={pausePlayback}
              onStop={stopPlayback}
            />
          </View>
        )}

        {/* Recording settings (shown when idle) */}
        {!isRecording && !recordingUri && (
          <View style={styles.settingsContainer}>
            {/* Duration presets */}
            <View style={styles.settingGroup}>
              <Text style={styles.settingLabel}>Recording Duration</Text>
              <View style={styles.presetButtons}>
                {DURATION_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetButton,
                      selectedDuration === preset && styles.presetButtonActive,
                    ]}
                    onPress={() => setSelectedDuration(preset)}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        selectedDuration === preset && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quality presets */}
            <View style={styles.settingGroup}>
              <Text style={styles.settingLabel}>Recording Quality</Text>
              <View style={styles.presetButtons}>
                {(['low', 'medium', 'high'] as AudioQuality[]).map((quality) => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.presetButton,
                      recordingQuality === quality && styles.presetButtonActive,
                    ]}
                    onPress={() => setRecordingQuality(quality)}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        recordingQuality === quality && styles.presetButtonTextActive,
                      ]}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Action buttons (shown when recording exists) */}
        {recordingUri && !isRecording && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.identifyButton}
              onPress={handleIdentify}
              disabled={isRecordingIdentification}
            >
              {isRecordingIdentification ? (
                <ActivityIndicator color={theme.colors.primary.contrastText} />
              ) : (
                <Text style={styles.identifyButtonText}>Identify</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscard}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Guidance text */}
        <View style={styles.guidanceContainer}>
          <Text style={styles.guidanceTitle}>Recording Tips</Text>
          <Text style={styles.guidanceText}>
            • Record in a quiet environment
          </Text>
          <Text style={styles.guidanceText}>
            • Hold your device steady and close to the sound source
          </Text>
          <Text style={styles.guidanceText}>
            • For bird songs, early morning recordings work best
          </Text>
          <Text style={styles.guidanceText}>
            • Avoid wind noise and background conversations
          </Text>
        </View>

        {/* Error display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error.message}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorDismiss}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  stateIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  stateText: {
    ...theme.typography.h4,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },
  durationText: {
    ...theme.typography.h1,
    fontSize: 48,
    color: theme.colors.primary.main,
    fontVariant: ['tabular-nums'],
  },
  durationLimit: {
    ...theme.typography.h3,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    minHeight: 80,
  },
  recordButtonContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  stopButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
  },
  playerContainer: {
    marginBottom: theme.spacing.lg,
  },
  settingsContainer: {
    marginBottom: theme.spacing.lg,
  },
  settingGroup: {
    marginBottom: theme.spacing.lg,
  },
  settingLabel: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  presetButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    backgroundColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: theme.colors.primary.main,
  },
  presetButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.main,
  },
  presetButtonTextActive: {
    color: theme.colors.primary.contrastText,
  },
  actionButtons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  identifyButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  identifyButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },
  discardButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  discardButtonText: {
    ...theme.typography.button,
    color: theme.colors.error,
    textAlign: 'center',
  },
  guidanceContainer: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  guidanceTitle: {
    ...theme.typography.h4,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.sm,
  },
  guidanceText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  errorContainer: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.body2,
    color: theme.colors.primary.contrastText,
    flex: 1,
  },
  errorDismiss: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    marginLeft: theme.spacing.md,
  },
});
