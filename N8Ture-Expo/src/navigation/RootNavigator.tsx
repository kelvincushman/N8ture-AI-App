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
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import CameraScreen from '../screens/CameraScreen';
import AudioRecordingScreen from '../screens/AudioRecordingScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

// Main Tabs Navigator with custom bottom bar
function MainTabsNavigator({ onCapturePress }: { onCapturePress: () => void }) {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomBottomTabNavigator {...props} onCapturePress={onCapturePress} />
      )}
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
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'N8ture AI',
          tabBarLabel: 'Home',
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
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: 'Map',
          tabBarLabel: 'Map',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
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
