/**
 * Custom Bottom Tab Navigator (AllTrails Style)
 *
 * Provides bottom tab navigation with an elevated center capture button.
 * Features:
 * - 2 tabs: Walks, History
 * - Center button elevated 30px above tab bar (AllTrails style)
 * - Larger button: 70px diameter (vs standard 60px)
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
import { WalkIcon } from '../components/icons/WalkIcon';

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

  // Get icon for each tab
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? theme.colors.primary.main : theme.colors.text.secondary;
    const size = 26;

    switch (routeName) {
      case 'WalksTab':
        return <WalkIcon size={size} color={color} />;
      case 'HistoryTab':
        return <Ionicons name="grid-outline" size={size} color={color} />;
      default:
        return <Ionicons name="ellipse" size={size} color={color} />;
    }
  };

  // Get label for each tab
  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'WalksTab':
        return 'Walks';
      case 'HistoryTab':
        return 'History';
      default:
        return routeName;
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

          const icon = getTabIcon(route.name, isFocused);
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : getTabLabel(route.name);

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              {icon}
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

      {/* Elevated Center Capture Button (AllTrails Style) */}
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
            <Ionicons name="camera" size={36} color="#FFFFFF" />
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
  // AllTrails-style center button (larger, more elevated)
  centerButtonContainer: {
    position: 'absolute',
    top: -30, // Elevated 30px above tab bar (AllTrails style)
    left: '50%',
    marginLeft: -35, // Half of button width (70/2)
    zIndex: 10,
  },
  centerButton: {
    width: 70, // Larger than standard (was 60px)
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 4, // Thicker border (was 3px)
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 }, // More dramatic shadow
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary.main,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
      },
      android: {
        elevation: 14,
      },
    }),
  },
});
