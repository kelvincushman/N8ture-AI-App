/**
 * App Header Component
 *
 * Reusable header for app screens with contextual actions.
 * Features:
 * - Optional back button (left)
 * - Optional title (center)
 * - Settings icon (top-right)
 * - Profile icon (top-right)
 * - N8ture AI branding
 * - Safe area support
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showSettings?: boolean;
  showProfile?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showSettings = true,
  showProfile = true,
  backgroundColor = theme.colors.primary.main,
  textColor = '#FFFFFF',
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSettingsPress = () => {
    // @ts-ignore - Type-safe navigation will be fixed in future
    navigation.navigate('Settings');
  };

  const handleProfilePress = () => {
    // @ts-ignore - Type-safe navigation will be fixed in future
    navigation.navigate('Profile');
  };

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === theme.colors.primary.main ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor }]}>
        <View style={styles.content}>
          {/* Left Side - Back Button or Spacer */}
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color={textColor} />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconButton} />
            )}
          </View>

          {/* Center - Title */}
          <View style={styles.centerSection}>
            {title && (
              <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>

          {/* Right Side - Settings & Profile Icons */}
          <View style={styles.rightSection}>
            {showSettings && (
              <TouchableOpacity
                onPress={handleSettingsPress}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="settings-outline" size={22} color={textColor} />
              </TouchableOpacity>
            )}
            {showProfile && (
              <TouchableOpacity
                onPress={handleProfilePress}
                style={[styles.iconButton, styles.profileButton]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="person-circle-outline" size={24} color={textColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: theme.spacing.md,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    marginLeft: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
});
