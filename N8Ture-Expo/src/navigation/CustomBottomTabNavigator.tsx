/**
 * Custom Bottom Tab Navigator
 *
 * Provides bottom tab navigation with an elevated center capture button.
 * Features:
 * - 5 tabs: Home, History, [Capture], Map, Profile
 * - Center button elevated 20px above tab bar
 * - Gradient styling with N8ture AI colors
 * - Blur effect background on iOS
 * - Safe area support
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

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

  // Define tab icons
  const getTabIcon = (routeName: string): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'History':
        return 'list';
      case 'Map':
        return 'map';
      case 'Profile':
        return 'person';
      default:
        return 'ellipse';
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Blur background for iOS glass effect */}
      {Platform.OS === 'ios' && (
        <BlurView intensity={95} style={StyleSheet.absoluteFill} tint="light" />
      )}

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Determine if this is the middle index (for center button spacing)
          const middleIndex = Math.floor(state.routes.length / 2);
          const isMiddleIndex = index === middleIndex;

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

          // For middle index, show spacer for center button
          if (isMiddleIndex) {
            return <View key={route.key} style={styles.centerSpacer} />;
          }

          const icon = getTabIcon(route.name);
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <Ionicons
                name={icon}
                size={24}
                color={isFocused ? theme.colors.primary.main : theme.colors.text.secondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.colors.primary.main
                      : theme.colors.text.secondary,
                  },
                ]}
              >
                {label as string}
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
          accessibilityRole="button"
          accessibilityLabel="Capture species"
        >
          <LinearGradient
            colors={[theme.colors.primary.main, theme.colors.primary.light]}
            style={styles.centerButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Shadow layer for elevation effect */}
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
    borderTopColor: theme.colors.border || '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
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
    marginLeft: -30, // Half of button width (60/2)
    zIndex: 10,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});
