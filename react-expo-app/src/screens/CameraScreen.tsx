/**
 * CameraScreen component
 *
 * Full-screen camera interface for capturing species photos
 * Integrates with expo-camera and provides capture, preview, and identification flow
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';
import { useImageCapture, CapturedImage } from '../hooks/useImageCapture';
import LoadingOverlay from '../components/LoadingOverlay';

export default function CameraScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);

  const {
    hasPermission,
    requesting,
    requestPermission,
    cameraType,
    toggleCameraType,
    flashMode,
    toggleFlashMode,
    getFlashModeLabel,
    captureImage,
  } = useImageCapture();

  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  /**
   * Handle photo capture
   */
  const handleCapture = async () => {
    setIsCapturing(true);
    const image = await captureImage(cameraRef.current);
    setIsCapturing(false);

    if (image) {
      setCapturedImage(image);
    }
  };

  /**
   * Retake photo
   */
  const handleRetake = () => {
    setCapturedImage(null);
  };

  /**
   * Proceed to identification
   */
  const handleIdentify = () => {
    if (!capturedImage) {
      Alert.alert('Error', 'No image captured');
      return;
    }

    // Navigate to results screen with image data
    navigation.navigate('Results' as never, {
      imageUri: capturedImage.uri,
      imageBase64: capturedImage.base64,
    } as never);
  };

  /**
   * Go back to home
   */
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Loading state while checking permissions
  if (hasPermission === null || requesting) {
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={true} message="Checking camera permissions..." />
      </View>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionDenied}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            N8ture AI needs access to your camera to identify species.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Preview mode - showing captured image
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />

          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.identifyButton} onPress={handleIdentify}>
              <Text style={styles.identifyButtonText}>Identify Species</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Camera mode
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
      >
        <SafeAreaView style={styles.cameraOverlay}>
          {/* Top controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleGoBack}>
              <Text style={styles.controlButtonText}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
              <Text style={styles.controlButtonText}>⚡ {getFlashModeLabel()}</Text>
            </TouchableOpacity>
          </View>

          {/* Center guide text */}
          <View style={styles.centerGuide}>
            <Text style={styles.guideText}>Center the species in frame</Text>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.flipButton} />
          </View>
        </SafeAreaView>
      </Camera>

      <LoadingOverlay visible={isCapturing} message="Capturing image..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.dark,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Permission denied screen
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.default,
  },
  permissionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },

  // Camera controls
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  controlButtonText: {
    color: theme.colors.primary.contrastText,
    fontSize: 16,
    fontWeight: '600',
  },

  // Center guide
  centerGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideText: {
    ...theme.typography.body1,
    color: theme.colors.primary.contrastText,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },

  // Bottom controls
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  flipButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 28,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.contrastText,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.primary.main,
    ...theme.shadows.lg,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.main,
  },

  // Preview mode
  previewContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary.dark,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.contrastText,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  retakeButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },
  identifyButton: {
    flex: 1,
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

  // Common button styles
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.contrastText,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondary.main,
    textAlign: 'center',
  },
});
