/**
 * Capture Modal Component
 *
 * Modal that slides up from bottom when user taps center capture button.
 * Provides options for:
 * - Camera only (photo identification)
 * - Listen only (audio identification)
 * - Camera + Listen (dual identification)
 * - Operating mode toggle (Automatic/Manual)
 * - Listening mode toggle (Track/Passive)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import {
  CaptureMode,
  OperatingMode,
  ListeningMode,
} from '../../types/capture';

interface CaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (
    captureMode: CaptureMode,
    operatingMode: OperatingMode,
    listeningMode?: ListeningMode
  ) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CaptureModal: React.FC<CaptureModalProps> = ({
  visible,
  onClose,
  onSelectMode,
}) => {
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('manual');
  const [listeningMode, setListeningMode] = useState<ListeningMode>('track');
  const [slideAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSelectMode = (captureMode: CaptureMode) => {
    onSelectMode(
      captureMode,
      operatingMode,
      captureMode === 'listen' || captureMode === 'both' ? listeningMode : undefined
    );
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                paddingBottom: insets.bottom + theme.spacing.lg,
                transform: [{ translateY }],
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Drag Handle */}
              <View style={styles.header}>
                <View style={styles.handle} />
                <Text style={styles.title}>What would you like to capture?</Text>
              </View>

              {/* Capture Options */}
              <View style={styles.optionsContainer}>
                {/* Camera Only */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => handleSelectMode('camera')}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIcon}>
                    <Text style={styles.iconEmoji}>📷</Text>
                  </View>
                  <Text style={styles.optionTitle}>Camera</Text>
                  <Text style={styles.optionSubtitle}>Identify by photo</Text>
                </TouchableOpacity>

                {/* Listen Only */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => handleSelectMode('listen')}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIcon}>
                    <Text style={styles.iconEmoji}>🎵</Text>
                  </View>
                  <Text style={styles.optionTitle}>Listen</Text>
                  <Text style={styles.optionSubtitle}>Record sounds</Text>
                </TouchableOpacity>
              </View>

              {/* Camera + Listen Combined */}
              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardWide]}
                onPress={() => handleSelectMode('both')}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconWide}>
                  <Text style={styles.iconEmojiWide}>📷 + 🎵</Text>
                </View>
                <View style={styles.optionTextWide}>
                  <Text style={styles.optionTitle}>Camera + Listen</Text>
                  <Text style={styles.optionSubtitle}>
                    Identify by sight & sound
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Operating Mode Selection */}
              <View style={styles.modeSection}>
                <Text style={styles.modeSectionTitle}>Operating Mode</Text>
                <Text style={styles.modeSectionDescription}>
                  Choose how you want to capture species
                </Text>
                <View style={styles.modeToggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modeToggle,
                      operatingMode === 'automatic' && styles.modeToggleActive,
                    ]}
                    onPress={() => setOperatingMode('automatic')}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        operatingMode === 'automatic' && styles.modeToggleTextActive,
                      ]}
                    >
                      Automatic
                    </Text>
                    <Text
                      style={[
                        styles.modeToggleHint,
                        operatingMode === 'automatic' && styles.modeToggleHintActive,
                      ]}
                    >
                      Continuous
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeToggle,
                      operatingMode === 'manual' && styles.modeToggleActive,
                    ]}
                    onPress={() => setOperatingMode('manual')}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        operatingMode === 'manual' && styles.modeToggleTextActive,
                      ]}
                    >
                      Manual
                    </Text>
                    <Text
                      style={[
                        styles.modeToggleHint,
                        operatingMode === 'manual' && styles.modeToggleHintActive,
                      ]}
                    >
                      On-demand
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Listening Mode (only for automatic mode) */}
              {operatingMode === 'automatic' && (
                <View style={styles.listeningModeContainer}>
                  <Text style={styles.modeSectionSubtitle}>Listening Mode</Text>
                  <View style={styles.modeToggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.modeToggle,
                        listeningMode === 'track' && styles.modeToggleActive,
                      ]}
                      onPress={() => setListeningMode('track')}
                    >
                      <Text
                        style={[
                          styles.modeToggleText,
                          listeningMode === 'track' && styles.modeToggleTextActive,
                        ]}
                      >
                        Track & Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modeToggle,
                        listeningMode === 'passive' && styles.modeToggleActive,
                      ]}
                      onPress={() => setListeningMode('passive')}
                    >
                      <Text
                        style={[
                          styles.modeToggleText,
                          listeningMode === 'passive' && styles.modeToggleTextActive,
                        ]}
                      >
                        Passive
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {listeningMode === 'passive' && (
                    <View style={styles.passiveNoteContainer}>
                      <Text style={styles.passiveNote}>
                        ℹ️ Passive mode shows live identifications without saving.
                        No trial credits used.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border || '#E0E0E0',
    borderRadius: 2,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  optionCard: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary || '#F5F5F5',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  optionCardWide: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.lg,
    minHeight: 100,
  },
  optionIcon: {
    marginBottom: theme.spacing.sm,
  },
  iconEmoji: {
    fontSize: 48,
  },
  optionIconWide: {
    paddingLeft: theme.spacing.md,
  },
  iconEmojiWide: {
    fontSize: 36,
  },
  optionTextWide: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  modeSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  modeSectionTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  modeSectionDescription: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  modeSectionSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modeToggle: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modeToggleActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  modeToggleText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  modeToggleHint: {
    fontSize: 10,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  modeToggleHintActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listeningModeContainer: {
    marginTop: theme.spacing.sm,
  },
  passiveNoteContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary.light + '20', // 20% opacity
    borderRadius: theme.borderRadius.sm,
  },
  passiveNote: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary.dark,
    lineHeight: 18,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
});
