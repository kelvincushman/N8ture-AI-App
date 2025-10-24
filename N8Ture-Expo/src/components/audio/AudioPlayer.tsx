/**
 * AudioPlayer component
 *
 * Audio playback controls with duration display
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

export interface AudioPlayerProps {
  duration: number;           // Recording duration in seconds
  isPlaying: boolean;         // Whether audio is playing
  onPlay: () => void;         // Play handler
  onPause: () => void;        // Pause handler
  onStop: () => void;         // Stop handler
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Format duration as MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * AudioPlayer component
 */
export default function AudioPlayer({
  duration,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  disabled = false,
  style,
}: AudioPlayerProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Duration display */}
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        <Text style={styles.durationLabel}>Duration</Text>
      </View>

      {/* Playback controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.controlButtonDisabled]}
          onPress={isPlaying ? onPause : onPlay}
          disabled={disabled}
        >
          <Text style={styles.controlButtonText}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.controlButtonDisabled]}
          onPress={onStop}
          disabled={disabled || !isPlaying}
        >
          <Text style={styles.controlButtonText}>⏹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  durationText: {
    ...theme.typography.h2,
    color: theme.colors.primary.main,
    fontVariant: ['tabular-nums'],
  },
  durationLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  controlButton: {
    backgroundColor: theme.colors.primary.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  controlButtonDisabled: {
    backgroundColor: theme.colors.text.disabled,
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 24,
    color: theme.colors.primary.contrastText,
  },
});
