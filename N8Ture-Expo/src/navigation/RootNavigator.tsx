import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabsParamList } from '../types/navigation';
import { CaptureMode, OperatingMode, ListeningMode } from '../types/capture';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

// Import navigation components
import { CustomBottomTabNavigator } from './CustomBottomTabNavigator';
import { CaptureModal } from '../components/capture/CaptureModal';

// Import screens
import WalkScreen from '../screens/WalkScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import CameraScreen from '../screens/CameraScreen';
import AudioRecordingScreen from '../screens/AudioRecordingScreen';
import ResultsScreen from '../screens/ResultsScreen';
import AudioResultsScreen from '../screens/AudioResultsScreen';
import MapViewScreen from '../screens/MapViewScreen';
import ExportPreviewScreen from '../screens/ExportPreviewScreen';
import PaywallScreen from '../screens/PaywallScreen';
import SpeciesDetailScreen from '../screens/SpeciesDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

// Main Tabs Navigator with custom bottom bar (AllTrails Style: 2 tabs)
function MainTabsNavigator({ onCapturePress }: { onCapturePress: () => void }) {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomBottomTabNavigator {...props} onCapturePress={onCapturePress} />
      )}
      initialRouteName="HistoryTab" // Content-first approach (AllTrails style)
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.primary.contrastText,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="WalksTab"
        component={WalkScreen}
        options={{
          title: 'Walks',
          tabBarLabel: 'Walks',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarLabel: 'History',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isSignedIn } = useAuth();
  const [captureModalVisible, setCaptureModalVisible] = useState(false);
  const navigationRef = React.useRef<any>(null);

  const handleCapturePress = () => {
    setCaptureModalVisible(true);
  };

  const handleSelectMode = (
    captureMode: CaptureMode,
    operatingMode: OperatingMode,
    listeningMode?: ListeningMode
  ) => {
    // Create capture configuration
    const config = {
      mode: captureMode,
      operatingMode,
      listeningMode,
    };

    // Navigate to appropriate screen based on capture mode
    switch (captureMode) {
      case 'camera':
        navigationRef.current?.navigate('Camera', { config });
        break;
      case 'listen':
        navigationRef.current?.navigate('AudioRecording', { config });
        break;
      case 'both':
        // TODO: Implement DualCapture screen in future phase
        console.log('Dual capture mode - Coming soon in Phase 5');
        // For now, just use camera mode
        navigationRef.current?.navigate('Camera', { config });
        break;
    }

    setCaptureModalVisible(false);
  };

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary.main,
            },
            headerTintColor: theme.colors.primary.contrastText,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          {/* Main Tabs */}
          <Stack.Screen
            name="MainTabs"
            options={{ headerShown: false }}
          >
            {() => <MainTabsNavigator onCapturePress={handleCapturePress} />}
          </Stack.Screen>

          {/* Auth Modal */}
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              title: 'Sign In',
              presentation: 'modal',
            }}
          />

          {/* Capture Modals */}
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              title: 'Camera',
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />

          <Stack.Screen
            name="AudioRecording"
            component={AudioRecordingScreen}
            options={{
              title: 'Audio Recording',
              presentation: 'modal',
            }}
          />

          {/* Results */}
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              title: 'Identification Results',
              presentation: 'card',
            }}
          />

          {/* Audio Results */}
          <Stack.Screen
            name="AudioResults"
            component={AudioResultsScreen}
            options={{
              title: 'Audio Identification',
              headerShown: false,
              presentation: 'card',
            }}
          />

          {/* Species Detail (accessed from Results or History) */}
          <Stack.Screen
            name="SpeciesDetail"
            component={SpeciesDetailScreen}
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />

          {/* Map View (accessed from History) */}
          <Stack.Screen
            name="MapView"
            component={MapViewScreen}
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />

          {/* Export Preview (accessed from History) */}
          <Stack.Screen
            name="ExportPreview"
            component={ExportPreviewScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />

          {/* Profile (accessed from header) */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
              presentation: 'card',
            }}
          />

          {/* Settings (accessed from header) */}
          <Stack.Screen
            name="Settings"
            component={ProfileScreen} // TODO: Create dedicated Settings screen
            options={{
              title: 'Settings',
              presentation: 'card',
            }}
          />

          {/* Paywall (accessed when trials run out) */}
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              title: 'Premium',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Capture Modal */}
      <CaptureModal
        visible={captureModalVisible}
        onClose={() => setCaptureModalVisible(false)}
        onSelectMode={handleSelectMode}
      />
    </>
  );
}
