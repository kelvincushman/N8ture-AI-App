# Phase 4.1 Implementation Plan: Bottom Navigation & Capture Modal

## Overview

This phase implements the foundational navigation structure for the unified capture interface, including:
- Custom bottom tab navigator with center elevated capture button
- Unified capture modal with Camera/Listen/Both options
- Mode selection system (Automatic/Manual)
- Integration with existing screens

## Architecture Changes

### Current Navigation Structure
```
App.tsx
└── RootNavigator (Stack)
    ├── Home
    ├── Camera
    ├── AudioRecording
    ├── Results
    └── Profile
```

### New Navigation Structure
```
App.tsx
└── RootNavigator (Stack)
    ├── MainTabs (Custom Bottom Tabs) ← NEW
    │   ├── Home Tab
    │   ├── History Tab
    │   ├── [CENTER BUTTON] → Opens CaptureModal
    │   ├── Map Tab (optional)
    │   └── Profile Tab
    ├── CameraCapture (Modal)
    ├── AudioCapture (Modal)
    ├── DualCapture (Modal) ← NEW
    └── Results (Modal)
```

## Component Specifications

### 1. CustomBottomTabNavigator

**File**: `src/navigation/CustomBottomTabNavigator.tsx`

**Purpose**: Custom bottom tab bar with elevated center button

**Implementation**:
```typescript
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { BlurView } from 'expo-blur';

interface CustomBottomTabNavigatorProps extends BottomTabBarProps {
  onCapturePress: () => void;
}

export const CustomBottomTabNavigator: React.FC<CustomBottomTabNavigatorProps> = ({
  state,
  descriptors,
  navigation,
  onCapturePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Blur background for iOS glass effect */}
      {Platform.OS === 'ios' && (
        <BlurView intensity={95} style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Skip the middle index (for center button)
          const isMiddleIndex = index === Math.floor(state.routes.length / 2);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isMiddleIndex) {
            return <View key={route.key} style={styles.centerSpacer} />;
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? theme.colors.primary.main : theme.colors.text.secondary,
                size: 24,
              })}
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? theme.colors.primary.main : theme.colors.text.secondary },
                ]}
              >
                {options.tabBarLabel as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Elevated Center Capture Button */}
      <View style={styles.centerButtonContainer}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={onCapturePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.primary.main, theme.colors.primary.light]}
            style={styles.centerButtonGradient}
          >
            <Icon name="add" size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.centerButtonShadow} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'transparent',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.regular,
  },
  centerSpacer: {
    width: 80, // Space for center button
  },
  centerButtonContainer: {
    position: 'absolute',
    top: -20, // Elevate 20px above tab bar
    left: '50%',
    marginLeft: -30, // Half of button width
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  centerButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
```

**Key Features:**
- ✅ Blur effect background (iOS glass morphism)
- ✅ Elevated center button with gradient
- ✅ Safe area insets support
- ✅ Active/inactive tab states
- ✅ Accessibility support
- ✅ Shadow and elevation

### 2. CaptureModal

**File**: `src/components/capture/CaptureModal.tsx`

**Purpose**: Modal that slides up with capture options

**Implementation**:
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { CaptureMode, OperatingMode, ListeningMode } from '../../types/capture';

interface CaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (
    captureMode: CaptureMode,
    operatingMode: OperatingMode,
    listeningMode?: ListeningMode
  ) => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  visible,
  onClose,
  onSelectMode,
}) => {
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('manual');
  const [listeningMode, setListeningMode] = useState<ListeningMode>('track');
  const [slideAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  const handleSelectMode = (captureMode: CaptureMode) => {
    onSelectMode(
      captureMode,
      operatingMode,
      captureMode === 'listen' || captureMode === 'both' ? listeningMode : undefined
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
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
              {/* Header */}
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
                <View style={styles.optionIcon}>
                  <Text style={styles.iconEmoji}>📷 + 🎵</Text>
                </View>
                <Text style={styles.optionTitle}>Camera + Listen</Text>
                <Text style={styles.optionSubtitle}>
                  Identify by sight & sound
                </Text>
              </TouchableOpacity>

              {/* Mode Selection */}
              <View style={styles.modeSection}>
                <Text style={styles.modeSectionTitle}>Operating Mode</Text>
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
                  </TouchableOpacity>
                </View>

                {/* Listening Mode (only for listen/both modes with automatic) */}
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
                          Passive (No Save)
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {listeningMode === 'passive' && (
                      <Text style={styles.passiveNote}>
                        ℹ️ Passive mode won't use your trial credits
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    maxHeight: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
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
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
  },
  optionCardWide: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing.md,
  },
  optionIcon: {
    marginBottom: theme.spacing.sm,
  },
  iconEmoji: {
    fontSize: 48,
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
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  listeningModeContainer: {
    marginTop: theme.spacing.sm,
  },
  passiveNote: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary.dark,
    marginTop: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.secondary,
  },
});
```

**Key Features:**
- ✅ Slide-up animation with spring physics
- ✅ Three capture options (Camera/Listen/Both)
- ✅ Operating mode toggle (Automatic/Manual)
- ✅ Listening mode toggle (Track/Passive)
- ✅ Safe area support
- ✅ Dismissible backdrop

### 3. New Type Definitions

**File**: `src/types/capture.ts`

```typescript
export type CaptureMode = 'camera' | 'listen' | 'both';
export type OperatingMode = 'automatic' | 'manual';
export type ListeningMode = 'track' | 'passive';

export interface CaptureConfig {
  mode: CaptureMode;
  operatingMode: OperatingMode;
  listeningMode?: ListeningMode;
}

export interface CaptureSession {
  id: string;
  config: CaptureConfig;
  startTime: Date;
  endTime?: Date;
  detections: Detection[];
  markedDetections: string[]; // IDs of detections user marked
  location?: GeoLocation;
  sessionType: 'walk' | 'single-capture' | 'passive';
}

export interface Detection {
  id: string;
  timestamp: Date;
  species: SpeciesIdentification;
  confidence: number;
  marked: boolean;
  audioChunkUri?: string;
  imageUri?: string;
  location?: GeoLocation;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}
```

## Implementation Steps

### Step 1: Create Type Definitions
```bash
# Create capture types
touch N8Ture-Expo/src/types/capture.ts
```

### Step 2: Install Required Dependencies
```bash
cd N8Ture-Expo
npm install --legacy-peer-deps \
  @react-navigation/bottom-tabs \
  expo-blur \
  expo-linear-gradient \
  react-native-safe-area-context
```

### Step 3: Create Bottom Tab Navigator
```bash
# Create custom bottom tab navigator
touch N8Ture-Expo/src/navigation/CustomBottomTabNavigator.tsx
```

### Step 4: Create Capture Modal
```bash
# Create capture modal component
mkdir -p N8Ture-Expo/src/components/capture
touch N8Ture-Expo/src/components/capture/CaptureModal.tsx
```

### Step 5: Update Root Navigator
Modify `src/navigation/RootNavigator.tsx` to use the new bottom tab structure:

```typescript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomBottomTabNavigator } from './CustomBottomTabNavigator';
import { CaptureModal } from '../components/capture/CaptureModal';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  const [captureModalVisible, setCaptureModalVisible] = useState(false);
  const [captureConfig, setCaptureConfig] = useState<CaptureConfig | null>(null);

  const handleCapturePress = () => {
    setCaptureModalVisible(true);
  };

  const handleSelectMode = (
    captureMode: CaptureMode,
    operatingMode: OperatingMode,
    listeningMode?: ListeningMode
  ) => {
    setCaptureConfig({ mode: captureMode, operatingMode, listeningMode });

    // Navigate to appropriate screen based on mode
    switch (captureMode) {
      case 'camera':
        navigation.navigate('CameraCapture', { config: { mode: captureMode, operatingMode } });
        break;
      case 'listen':
        navigation.navigate('AudioCapture', { config: { mode: captureMode, operatingMode, listeningMode } });
        break;
      case 'both':
        navigation.navigate('DualCapture', { config: { mode: captureMode, operatingMode, listeningMode } });
        break;
    }
  };

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <CustomBottomTabNavigator {...props} onCapturePress={handleCapturePress} />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <CaptureModal
        visible={captureModalVisible}
        onClose={() => setCaptureModalVisible(false)}
        onSelectMode={handleSelectMode}
      />
    </>
  );
}
```

### Step 6: Create Tab Screen Placeholders

Create placeholder screens for the new tab structure:

```bash
# Create History screen
touch N8Ture-Expo/src/screens/HistoryScreen.tsx

# Create Map screen (optional)
touch N8Ture-Expo/src/screens/MapScreen.tsx
```

### Step 7: Update Theme with Icons

Update `src/constants/theme.ts` to include tab icons:

```typescript
import { Ionicons } from '@expo/vector-icons';

export const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  History: 'list',
  Map: 'map',
  Profile: 'person',
};
```

### Step 8: Testing Checklist

- [ ] Bottom navigation renders correctly
- [ ] Center capture button is elevated and styled
- [ ] Tapping center button opens capture modal
- [ ] Capture modal slides up smoothly
- [ ] Three capture options are visible and tappable
- [ ] Mode toggles work (Automatic/Manual)
- [ ] Listening mode toggle appears in automatic mode
- [ ] Passive mode shows info message
- [ ] Cancel closes modal
- [ ] Selecting a mode closes modal and navigates
- [ ] Safe area insets respected on iPhone X+
- [ ] Blur effect works on iOS
- [ ] Navigation works on Android

## Performance Considerations

### Animation Performance
- Use `useNativeDriver: true` for all animations
- Avoid layout changes during animations
- Test on low-end devices (60 FPS target)

### Modal Optimization
- Lazy-load capture modal (only mount when opened)
- Unmount when closed to free memory
- Minimize re-renders with React.memo

### Bundle Size
- expo-blur adds ~150KB
- expo-linear-gradient adds ~80KB
- Total impact: ~230KB (acceptable)

## Next Steps (Phase 4.2)

After Phase 4.1 is complete:

1. **Implement Automatic Mode Screen** - Real-time detection interface
2. **Build Detection Banner Component** - Non-intrusive notifications
3. **Create Walk Session Manager** - State management for continuous monitoring
4. **Add BirdNET Integration** - Real-time audio analysis
5. **Implement Marking System** - User-controlled detection saving

## Success Criteria

Phase 4.1 is complete when:
- ✅ Bottom navigation with center button is functional
- ✅ Capture modal opens and closes smoothly
- ✅ All three capture options are selectable
- ✅ Mode toggles work correctly
- ✅ Integration with existing screens is seamless
- ✅ UI matches N8ture AI design system
- ✅ Performance is smooth (60 FPS)
- ✅ Works on both iOS and Android

---

**Estimated Time**: 6-8 hours
**Priority**: HIGH
**Complexity**: Medium
