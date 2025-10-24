/**
 * AudioWaveform component
 *
 * Real-time audio waveform visualization for recording
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

export interface AudioWaveformProps {
  audioLevel: number;           // Current audio level 0-100
  isRecording: boolean;         // Whether recording is active
  width?: number;               // Width of waveform
  height?: number;              // Height of waveform
  barColor?: string;            // Color of bars
  barCount?: number;            // Number of bars
  barWidth?: number;            // Width of each bar
  barSpacing?: number;          // Spacing between bars
  style?: ViewStyle;
}

/**
 * AudioWaveform component
 */
export default function AudioWaveform({
  audioLevel,
  isRecording,
  width = 300,
  height = 80,
  barColor = theme.colors.primary.light,
  barCount = 30,
  barWidth = 3,
  barSpacing = 4,
  style,
}: AudioWaveformProps) {
  const barsRef = useRef<Animated.Value[]>([]);

  // Initialize animated values for each bar
  useEffect(() => {
    barsRef.current = Array.from({ length: barCount }, () => new Animated.Value(0.2));
  }, [barCount]);

  // Update bars based on audio level
  useEffect(() => {
    if (!isRecording) {
      // Reset all bars when not recording
      barsRef.current.forEach((bar) => {
        Animated.timing(bar, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Animate bars based on audio level
    barsRef.current.forEach((bar, index) => {
      // Create wave effect - middle bars are tallest
      const centerDistance = Math.abs(index - barCount / 2) / (barCount / 2);
      const waveEffect = 1 - centerDistance * 0.5;

      // Calculate target height based on audio level and wave effect
      const targetHeight = (audioLevel / 100) * waveEffect;
      const minHeight = 0.2;
      const finalHeight = Math.max(minHeight, targetHeight);

      // Add slight random variation for natural look
      const variation = (Math.random() - 0.5) * 0.1;
      const animatedHeight = Math.min(1, finalHeight + variation);

      Animated.timing(bar, {
        toValue: animatedHeight,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
  }, [audioLevel, isRecording, barCount]);

  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.barsContainer}>
        {barsRef.current.map((animatedValue, index) => {
          const barHeight = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [height * 0.1, height],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: barColor,
                  marginHorizontal: barSpacing / 2,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bar: {
    borderRadius: 2,
  },
});
