# N8ture AI Authentication System

Complete Clerk authentication implementation with trial tracking and premium subscriptions.

## Overview

This authentication system provides:
- Email/password and OAuth (Google) sign-in/sign-up
- Email verification for new accounts
- Session persistence using expo-secure-store
- Trial tracking (3 free identifications)
- Premium subscription management
- Protected routes
- User profile management

## Installation

All required dependencies are installed:
```bash
npm install expo-secure-store expo-web-browser --legacy-peer-deps
```

## Environment Setup

Copy `.env.template` to `.env` and add your Clerk publishable key:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

Get your Clerk publishable key from:
https://dashboard.clerk.com/

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx          # Email/password + OAuth sign-in
│   │   ├── SignUpForm.tsx          # Registration with verification
│   │   └── ProtectedRoute.tsx      # Route wrapper for auth
│   └── trial/
│       └── TrialBadge.tsx          # Trial status display
├── hooks/
│   ├── useAuth.ts                  # Auth state and user profile
│   └── useTrialStatus.ts           # Trial tracking hooks
├── screens/
│   ├── auth/
│   │   └── AuthScreen.tsx          # Combined sign-in/sign-up
│   ├── HomeScreen.tsx              # Updated with trial integration
│   └── ProfileScreen.tsx           # User profile and sign-out
├── services/
│   └── clerk.ts                    # Token cache setup
├── types/
│   ├── user.ts                     # User metadata types
│   └── navigation.ts               # Navigation types
└── config/
    └── env.ts                      # Environment config
```

## User Metadata Schema

User metadata is stored in Clerk's `publicMetadata`:

```typescript
{
  trialsUsed: number,           // 0-3
  isPremium: boolean,           // Premium subscription status
  subscriptionTier: string,     // 'free' | 'monthly' | 'annual'
  subscriptionExpiry: string,   // ISO date
  totalIdentifications: number, // Total count
  createdAt: string            // ISO date
}
```

## Usage Examples

### 1. Check Authentication State

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isSignedIn, userProfile } = useAuth();

  if (!isSignedIn) {
    return <Text>Please sign in</Text>;
  }

  return <Text>Welcome {userProfile?.firstName}!</Text>;
}
```

### 2. Check Trial Status

```typescript
import { useTrialStatus } from '../hooks/useTrialStatus';

function MyComponent() {
  const { remainingTrials, hasTrialsRemaining } = useTrialStatus();

  return (
    <Text>
      You have {remainingTrials} free trials remaining
    </Text>
  );
}
```

### 3. Check Premium Status

```typescript
import { useCheckPremium } from '../hooks/useTrialStatus';

function MyComponent() {
  const { isPremium, subscriptionTier } = useCheckPremium();

  if (isPremium) {
    return <Text>Premium {subscriptionTier} member</Text>;
  }

  return <Text>Free tier</Text>;
}
```

### 4. Record Identification

```typescript
import { useRecordIdentification } from '../hooks/useTrialStatus';

function CameraScreen() {
  const { canIdentify, recordIdentification } = useRecordIdentification();

  const handleCapture = async () => {
    // Check if user can identify
    if (!canIdentify) {
      Alert.alert('Trial Limit Reached', 'Please upgrade to premium');
      return;
    }

    // Record the identification
    const result = await recordIdentification();

    if (result.success) {
      // Proceed with identification
      console.log('Identification recorded');
    } else if (result.shouldShowPaywall) {
      // Show paywall
      navigation.navigate('Paywall');
    }
  };

  return (
    <Button title="Identify" onPress={handleCapture} />
  );
}
```

### 5. Protected Routes

```typescript
import ProtectedRoute from '../components/auth/ProtectedRoute';

function MyScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>This content requires authentication</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### 6. Display Trial Badge

```typescript
import TrialBadge from '../components/trial/TrialBadge';

function MyScreen() {
  return (
    <View>
      <TrialBadge showUpgradeButton={true} />
      {/* Rest of content */}
    </View>
  );
}
```

## Authentication Flows

### Sign Up Flow

1. User fills in email, password, and optional name
2. Clerk creates account with default metadata
3. Email verification code sent
4. User enters 6-digit code
5. Account verified and session created
6. User redirected to app

### Sign In Flow

1. User enters email and password
2. Clerk validates credentials
3. Session created and cached
4. User redirected to app

### OAuth Flow (Google)

1. User clicks "Continue with Google"
2. Opens web browser for OAuth
3. User authorizes in browser
4. Browser redirects back to app
5. Session created automatically
6. User redirected to app

## Trial System

### How It Works

1. New users get 3 free identifications
2. Each identification increments `trialsUsed` in metadata
3. After 3 uses, paywall triggered
4. Premium users have unlimited access

### Implementation

The trial system uses Clerk's `publicMetadata` to track usage:

```typescript
const { recordIdentification } = useRecordIdentification();

const result = await recordIdentification();

if (result.shouldShowPaywall) {
  // Show upgrade screen
}
```

### Premium Users

Premium users bypass trial limits:
- `isPremium: true` in metadata
- `subscriptionTier: 'monthly' | 'annual'`
- `subscriptionExpiry` date checked for validity

## Navigation Integration

The navigation system automatically handles auth state:

```typescript
// HomeScreen header shows "Sign In" or "Profile"
<TouchableOpacity
  onPress={() => navigation.navigate(isSignedIn ? 'Profile' : 'Auth')}
>
  <Text>{isSignedIn ? 'Profile' : 'Sign In'}</Text>
</TouchableOpacity>
```

## Security Features

1. **Token Caching**: Secure storage using expo-secure-store
2. **Session Persistence**: Auto-login on app restart
3. **Email Verification**: Required for new accounts
4. **Password Requirements**: Minimum 8 characters
5. **OAuth Security**: Standard OAuth 2.0 flow

## Testing

### Test Sign-Up

1. Run app: `npm start`
2. Navigate to Auth screen
3. Click "Sign Up" tab
4. Fill in details
5. Check email for verification code
6. Enter code and verify

### Test Trial System

1. Sign in to app
2. Tap "Open Camera" button
3. Trial counter decrements
4. After 3 uses, paywall shown

### Test Premium Features

To test premium features, manually update user metadata in Clerk Dashboard:

```json
{
  "isPremium": true,
  "subscriptionTier": "monthly",
  "subscriptionExpiry": "2025-12-31T00:00:00.000Z"
}
```

## Customization

### Update Trial Limit

Edit `/src/types/user.ts`:

```typescript
export const MAX_FREE_TRIALS = 5; // Change from 3 to 5
```

### Add Custom User Fields

Add to `UserMetadata` interface in `/src/types/user.ts`:

```typescript
export interface UserMetadata {
  // ... existing fields
  lastLoginDate?: string;
  preferredCategory?: 'plants' | 'wildlife' | 'fungi';
}
```

### Customize Auth Screens

Edit `/src/screens/auth/AuthScreen.tsx` or `/src/components/auth/SignInForm.tsx` to match your branding.

## Troubleshooting

### Error: "Clerk publishable key is required"

Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your `.env` file.

### OAuth Not Working

Ensure redirect URL matches in Clerk Dashboard:
- Development: `exp://localhost:8081`
- Production: Your custom scheme

### Trial Not Updating

Check if user metadata is being saved:
```typescript
console.log(user.publicMetadata);
```

### Session Not Persisting

Verify expo-secure-store is working:
```typescript
import * as SecureStore from 'expo-secure-store';
const test = await SecureStore.setItemAsync('test', 'value');
```

## Next Steps

1. **Implement Paywall**: Create subscription screen with pricing
2. **Add Payment Integration**: Integrate Stripe or RevenueCat
3. **Implement Camera**: Add camera capture for identifications
4. **Add History Screen**: Show past identifications
5. **Admin Panel**: Manage user subscriptions in Clerk Dashboard

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Expo Clerk Integration](https://clerk.com/docs/quickstarts/expo)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [N8ture AI Branding Guide](/docs/react-expo/BRANDING_DESIGN_SYSTEM.md)

## Support

For issues or questions:
1. Check Clerk Dashboard for user data
2. Review console logs for errors
3. Verify environment variables
4. Test with Clerk test keys first
