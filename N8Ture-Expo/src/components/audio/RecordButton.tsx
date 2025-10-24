/**
 * RecordButton component
 *
 * Large circular button for recording control with pulsing animation
 */

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
}

/**
 * RecordButton component
 */
export default function RecordButton({
  isRecording,
  isPaused,
  onPress,
  disabled = false,
  size = 100,
  style,
}: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation when recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, isPaused, pulseAnim]);

  // Press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Determine button appearance
  const getButtonStyle = () => {
    if (isRecording && !isPaused) {
      return {
        backgroundColor: theme.colors.error,
        innerSize: size * 0.4,
        borderRadius: 8,
      };
    } else if (isPaused) {
      return {
        backgroundColor: theme.colors.warning,
        innerSize: size * 0.5,
        borderRadius: size / 2,
      };
    } else {
      return {
        backgroundColor: theme.colors.primary.main,
        innerSize: size * 0.6,
        borderRadius: size / 2,
      };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <View style={[styles.container, style]}>
      {/* Pulse ring when recording */}
      {isRecording && !isPaused && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: (size * 1.5) / 2,
              borderColor: theme.colors.error,
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.5, 0],
              }),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Main button */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={0.8}
          style={[
            styles.innerCircle,
            {
              backgroundColor: buttonStyle.backgroundColor,
              width: buttonStyle.innerSize,
              height: buttonStyle.innerSize,
              borderRadius: buttonStyle.borderRadius,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 4,
  },
  outerCircle: {
    backgroundColor: theme.colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  innerCircle: {
    // Style applied dynamically
  },
});
