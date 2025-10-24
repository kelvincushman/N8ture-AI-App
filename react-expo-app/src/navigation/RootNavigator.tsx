import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
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
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'N8ture AI',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate(isSignedIn ? 'Profile' : 'Auth')}
                style={{ marginRight: 8 }}
              >
                <Text style={{ color: theme.colors.primary.contrastText, fontSize: 16 }}>
                  {isSignedIn ? 'Profile' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            title: 'Sign In',
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
