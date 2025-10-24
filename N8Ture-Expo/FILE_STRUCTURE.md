# N8ture AI Authentication - File Structure

Complete file structure for the Clerk authentication implementation.

## Directory Tree

```
N8Ture-Expo/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx      # Route wrapper for authentication
│   │   │   ├── SignInForm.tsx          # Email/password + OAuth sign-in form
│   │   │   └── SignUpForm.tsx          # Registration form with verification
│   │   └── trial/
│   │       └── TrialBadge.tsx          # Trial status display component
│   │
│   ├── config/
│   │   └── env.ts                      # Environment configuration
│   │
│   ├── constants/
│   │   └── theme.ts                    # Design system theme
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  # Authentication state hook
│   │   └── useTrialStatus.ts           # Trial tracking hooks
│   │
│   ├── navigation/
│   │   └── RootNavigator.tsx           # Main navigation (UPDATED)
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx          # Combined sign-in/sign-up screen
│   │   ├── HomeScreen.tsx              # Home screen (UPDATED)
│   │   └── ProfileScreen.tsx           # User profile screen
│   │
│   ├── services/
│   │   └── clerk.ts                    # Token cache setup
│   │
│   └── types/
│       ├── navigation.ts               # Navigation types
│       └── user.ts                     # User metadata types
│
├── App.tsx                             # Root app component (UPDATED)
├── package.json                        # Dependencies (UPDATED)
│
└── Documentation/
    ├── AUTHENTICATION_GUIDE.md         # Complete usage guide
    ├── AUTHENTICATION_IMPLEMENTATION_SUMMARY.md  # Implementation details
    └── CLERK_QUICK_START.md            # Quick start guide
```

## File Purposes

### Core Files (New)

#### `/src/types/user.ts`
- User metadata interface
- Subscription tier types
- Default metadata constants
- Trial limit constant

#### `/src/services/clerk.ts`
- Token cache implementation
- expo-secure-store integration
- Session persistence

#### `/src/hooks/useAuth.ts`
- Authentication state management
- User profile access
- Sign-out functionality
- Metadata retrieval

#### `/src/hooks/useTrialStatus.ts`
- Trial tracking (3 free identifications)
- Premium subscription checks
- Identification recording
- Paywall trigger logic

### Components (New)

#### `/src/components/auth/SignInForm.tsx`
- Email/password sign-in
- Google OAuth integration
- Form validation
- Error handling

#### `/src/components/auth/SignUpForm.tsx`
- User registration
- Email verification flow
- Google OAuth sign-up
- Default metadata initialization

#### `/src/components/auth/ProtectedRoute.tsx`
- Authentication gate
- Loading states
- Auto-redirect to auth

#### `/src/components/trial/TrialBadge.tsx`
- Trial counter display
- Premium badge display
- Upgrade button
- Status indicators

### Screens (New)

#### `/src/screens/auth/AuthScreen.tsx`
- Tabbed interface (Sign In / Sign Up)
- Form switching
- Success handling
- Trial info display

#### `/src/screens/ProfileScreen.tsx`
- User information display
- Trial/premium status
- Activity statistics
- Sign-out functionality
- Account management

### Modified Files

#### `/home/user/N8ture-AI-App/N8Ture-Expo/App.tsx`
**Changes:**
- Added ClerkProvider wrapper
- Configured token cache
- Integrated environment config

#### `/home/user/N8ture-AI-App/N8Ture-Expo/src/navigation/RootNavigator.tsx`
**Changes:**
- Added Auth and Profile screens
- Dynamic header button (Sign In / Profile)
- Auth state integration
- Modal presentation for auth

#### `/home/user/N8ture-AI-App/N8Ture-Expo/src/screens/HomeScreen.tsx`
**Changes:**
- Trial badge display
- Authentication checks
- Identification recording
- Paywall triggers
- Personalized welcome message

## File Dependencies

### Authentication Flow
```
App.tsx
  └─> ClerkProvider (from @clerk/clerk-expo)
      └─> tokenCache (from services/clerk.ts)
      └─> RootNavigator.tsx
          └─> useAuth hook
          └─> AuthScreen.tsx
              ├─> SignInForm.tsx
              └─> SignUpForm.tsx
```

### Trial System Flow
```
HomeScreen.tsx
  └─> useRecordIdentification hook
      ├─> useTrialStatus hook
      ├─> useCheckPremium hook
      └─> useAuth hook
          └─> Clerk user state
```

### Protected Routes Flow
```
ProfileScreen.tsx
  └─> ProtectedRoute component
      └─> useAuth hook
          └─> Redirect to Auth if not signed in
```

## Component Hierarchy

```
App
├─ ClerkProvider
│  └─ RootNavigator
│     ├─ HomeScreen
│     │  ├─ TrialBadge (if signed in)
│     │  └─ Buttons with auth checks
│     │
│     ├─ AuthScreen (modal)
│     │  ├─ SignInForm
│     │  │  ├─ Email/password inputs
│     │  │  └─ Google OAuth button
│     │  │
│     │  └─ SignUpForm
│     │     ├─ Name/email/password inputs
│     │     ├─ Verification code input
│     │     └─ Google OAuth button
│     │
│     └─ ProfileScreen
│        ├─ ProtectedRoute wrapper
│        ├─ User avatar
│        ├─ TrialBadge
│        ├─ Stats display
│        └─ Sign-out button
```

## Data Flow

### User Sign-Up
```
SignUpForm
  ├─> Clerk.signUp.create()
  ├─> Set default metadata
  ├─> Send verification email
  ├─> User enters code
  ├─> Clerk.signUp.attemptEmailAddressVerification()
  └─> Session created → Navigate to Home
```

### Trial Recording
```
User taps "Open Camera"
  ├─> Check isSignedIn → Show auth if needed
  ├─> Check canIdentify → Show paywall if exhausted
  ├─> recordIdentification()
  │   ├─> Check isPremium → Skip if premium
  │   ├─> Increment trialsUsed in metadata
  │   ├─> Increment totalIdentifications
  │   └─> Update user.publicMetadata
  └─> Proceed with camera
```

### Premium Check
```
Component renders
  ├─> useCheckPremium()
  │   ├─> Read user.publicMetadata.isPremium
  │   ├─> Read user.publicMetadata.subscriptionExpiry
  │   ├─> Check expiry date > now
  │   └─> Return isPremium status
  └─> Render premium/free UI
```

## Code Organization

### Hooks Pattern
All hooks follow consistent pattern:
```typescript
export function useHookName() {
  const { user } = useUser(); // Clerk hook

  const getValue = useCallback(() => {
    // Logic here
  }, [dependencies]);

  return {
    value: getValue(),
    // ... other values/methods
  };
}
```

### Component Pattern
All components follow:
```typescript
interface ComponentProps {
  // Props here
}

export default function Component({ props }: ComponentProps) {
  // Hooks
  const hook = useHook();

  // State
  const [state, setState] = useState();

  // Handlers
  const handleAction = () => {
    // Logic
  };

  // Render
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles using theme
});
```

## Styling Conventions

All components use N8ture AI theme:
```typescript
import { theme } from '../constants/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
});
```

## Type Safety

All user metadata is typed:
```typescript
// Get typed metadata
const metadata: UserMetadata = getUserMetadata();

// Access with autocomplete
const trials = metadata.trialsUsed;
const premium = metadata.isPremium;
```

## Environment Variables

Required in `.env`:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Accessed via:
```typescript
import { env } from './src/config/env';
const key = env.clerk.publishableKey;
```

## Testing Structure

Each component should be testable:
- Hooks return consistent data
- Components accept props
- State is manageable
- Side effects are isolated

## Next Development Areas

1. **Paywall Screen**: `/src/screens/PaywallScreen.tsx`
2. **Payment Integration**: `/src/services/payment.ts`
3. **Camera Screen**: `/src/screens/CameraScreen.tsx`
4. **History Screen**: `/src/screens/HistoryScreen.tsx`
5. **Results Screen**: `/src/screens/ResultsScreen.tsx`

## Documentation Files

- `AUTHENTICATION_GUIDE.md` - Complete usage documentation
- `AUTHENTICATION_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `CLERK_QUICK_START.md` - Quick start guide
- `FILE_STRUCTURE.md` - This file
- `README.md` - General app documentation
- `SETUP_GUIDE.md` - Initial setup guide
