/**
 * Image capture hook
 *
 * Manages camera permissions and image capture functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform, Alert } from 'react-native';

export interface CapturedImage {
  uri: string;
  base64?: string;
  width: number;
  height: number;
}

export function useImageCapture() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);

  // Request camera permissions on mount
  useEffect(() => {
    requestPermission();
  }, []);

  /**
   * Request camera permission
   */
  const requestPermission = useCallback(async () => {
    try {
      setRequesting(true);
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'N8ture AI needs camera access to identify species. Please enable camera permission in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    } finally {
      setRequesting(false);
    }
  }, []);

  /**
   * Toggle camera type (front/back)
   */
  const toggleCameraType = useCallback(() => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }, []);

  /**
   * Toggle flash mode
   */
  const toggleFlashMode = useCallback(() => {
    setFlashMode((current) => {
      switch (current) {
        case FlashMode.off:
          return FlashMode.on;
        case FlashMode.on:
          return FlashMode.auto;
        case FlashMode.auto:
        default:
          return FlashMode.off;
      }
    });
  }, []);

  /**
   * Get flash mode label for UI
   */
  const getFlashModeLabel = useCallback((): string => {
    switch (flashMode) {
      case FlashMode.on:
        return 'On';
      case FlashMode.auto:
        return 'Auto';
      case FlashMode.off:
      default:
        return 'Off';
    }
  }, [flashMode]);

  /**
   * Capture and process image
   * Compresses image to max 1024x1024 and converts to base64
   */
  const captureImage = useCallback(
    async (cameraRef: any): Promise<CapturedImage | null> => {
      if (!cameraRef) {
        Alert.alert('Error', 'Camera is not ready');
        return null;
      }

      try {
        // Capture photo
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        // Calculate target dimensions (max 1024x1024, maintain aspect ratio)
        const MAX_SIZE = 1024;
        let targetWidth = photo.width;
        let targetHeight = photo.height;

        if (photo.width > MAX_SIZE || photo.height > MAX_SIZE) {
          if (photo.width > photo.height) {
            targetWidth = MAX_SIZE;
            targetHeight = Math.round((photo.height / photo.width) * MAX_SIZE);
          } else {
            targetHeight = MAX_SIZE;
            targetWidth = Math.round((photo.width / photo.height) * MAX_SIZE);
          }
        }

        // Compress and resize image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: targetWidth, height: targetHeight } }],
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        return {
          uri: manipulatedImage.uri,
          base64: manipulatedImage.base64,
          width: manipulatedImage.width,
          height: manipulatedImage.height,
        };
      } catch (error) {
        console.error('Error capturing image:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        return null;
      }
    },
    []
  );

  return {
    hasPermission,
    requesting,
    requestPermission,
    cameraType,
    toggleCameraType,
    flashMode,
    toggleFlashMode,
    getFlashModeLabel,
    captureImage,
  };
}
