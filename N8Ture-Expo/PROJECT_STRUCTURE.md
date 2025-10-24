# N8ture AI App - Project Structure

## 📱 Available Screens

### Main Screens (Bottom Tabs)

1. **WalkScreen** (`src/screens/WalkScreen.tsx`)
   - Purpose: Walk tracking and past walks list
   - Features:
     - "Start New Walk" hero section
     - Walk statistics (Total Walks, Distance, Species)
     - Past walks list with details
   - Navigation: WalksTab (left tab)
   - Status: ✅ Complete

2. **HistoryScreen** (`src/screens/HistoryScreen.tsx`)
   - Purpose: Display past species identifications
   - Features:
     - 2-column image grid layout (AllTrails-style)
     - Visual species cards with images
     - Confidence badges (color-coded)
     - Type indicators (camera/audio)
     - Statistics dashboard
   - Navigation: HistoryTab (right tab, default)
   - Status: ✅ Complete

### Authentication Screens

3. **AuthScreen** (`src/screens/auth/AuthScreen.tsx`)
   - Purpose: User authentication (sign in/sign up)
   - Features:
     - Sign In and Sign Up tabs
     - Email/password authentication
     - Google OAuth
     - Clerk integration
   - Navigation: Modal (from auth required state)
   - Status: ✅ Complete

### Capture Screens (Modals)

4. **CameraScreen** (`src/screens/CameraScreen.tsx`)
   - Purpose: Camera-based species identification
   - Features:
     - Full-screen camera interface
     - Photo capture
     - Image compression and processing
     - Flash control
     - Camera flip
   - Navigation: Full-screen modal (from capture modal)
   - Status: ✅ Complete

5. **AudioRecordingScreen** (`src/screens/AudioRecordingScreen.tsx`)
   - Purpose: Audio-based species identification
   - Features:
     - Audio recording with waveform visualization
     - Duration presets (10s, 30s, 60s)
     - Quality settings
     - Playback controls
     - Trial system integration
   - Navigation: Modal (from capture modal)
   - Status: ✅ Complete

### Detail Screens

6. **ResultsScreen** (`src/screens/ResultsScreen.tsx`)
   - Purpose: Display species identification results
   - Features:
     - Species name and scientific name
     - Confidence badge
     - Edibility status
     - Toxicity warnings
     - Identification features
   - Navigation: Card presentation (from Camera/Audio screens)
   - Status: ✅ Complete

7. **ProfileScreen** (`src/screens/ProfileScreen.tsx`)
   - Purpose: User profile and account management
   - Features:
     - User information
     - Trial status display
     - Subscription management
     - Sign out
   - Navigation: Card presentation (from AppHeader)
   - Status: ✅ Complete

### Legacy/Placeholder Screens

8. **HomeScreen** (`src/screens/HomeScreen.tsx`)
   - Purpose: Original home dashboard
   - Status: ⚠️ Legacy (replaced by HistoryScreen as default)
   - Note: Can be removed or repurposed

9. **MapScreen** (`src/screens/MapScreen.tsx`)
   - Purpose: Map view of species discoveries
   - Status: 🚧 Placeholder (not in navigation)
   - Note: Removed from bottom tabs, kept for future use

## 🗂️ Complete File Tree

```
N8Ture-Expo/
│
├── 📄 Configuration Files
│   ├── .env.template                    # Environment variables template
│   ├── .gitignore                       # Git ignore rules
│   ├── app.json                         # Expo configuration
│   ├── eas.json                         # Expo Application Services config
│   ├── package.json                     # Dependencies and scripts
│   ├── package-lock.json                # Locked dependencies
│   ├── tsconfig.json                    # TypeScript configuration
│   └── index.ts                         # App entry point
│
├── 📱 App Entry
│   └── App.tsx                          # Main app component
│
├── 📚 Documentation
│   ├── README.md                        # Project overview
│   ├── SETUP_GUIDE.md                   # Setup instructions
│   ├── FILE_STRUCTURE.md                # File structure explanation
│   ├── FIREBASE_SETUP.md                # Firebase configuration
│   ├── CLERK_QUICK_START.md             # Clerk authentication guide
│   ├── CAMERA_USAGE.md                  # Camera implementation guide
│   ├── AUDIO_RECORDING_GUIDE.md         # Audio recording guide
│   ├── AUTHENTICATION_GUIDE.md          # Auth implementation details
│   ├── AUTHENTICATION_IMPLEMENTATION_SUMMARY.md
│   ├── AUDIO_IMPLEMENTATION_DELIVERABLES.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── IMPLEMENTATION_SUMMARY.txt
│   ├── PHASE_4_IMPLEMENTATION_SUMMARY.md
│   ├── PHASE_4_1_SUMMARY.md
│   ├── install-audio-dependencies.sh    # Dependency installation script
│   │
│   └── docs/                            # Additional documentation
│       ├── ALLTRAILS_IMPLEMENTATION_CHECKLIST.md
│       ├── ALLTRAILS_NAVIGATION_REDESIGN.md
│       ├── PHASE_4_1_IMPLEMENTATION_PLAN.md
│       └── UX_ENHANCEMENT_PROPOSAL.md
│
├── 🎨 Assets
│   └── assets/
│       ├── icon.png                     # App icon
│       ├── adaptive-icon.png            # Android adaptive icon
│       ├── splash-icon.png              # Splash screen icon
│       └── favicon.png                  # Web favicon
│
├── 🔥 Firebase Functions
│   └── functions/
│       ├── index.js                     # Cloud Functions entry
│       ├── package.json                 # Functions dependencies
│       ├── .gitignore                   # Functions git ignore
│       ├── config/
│       │   └── secrets.js               # Secret management
│       └── services/
│           └── geminiService.js         # Gemini API integration
│
├── 📂 Source Code (src/)
│   │
│   ├── 🧩 Components
│   │   ├── components/
│   │   │   ├── LoadingOverlay.tsx       # Global loading indicator
│   │   │   │
│   │   │   ├── auth/                    # Authentication components
│   │   │   │   ├── ProtectedRoute.tsx   # Route protection
│   │   │   │   ├── SignInForm.tsx       # Sign in form
│   │   │   │   └── SignUpForm.tsx       # Sign up form
│   │   │   │
│   │   │   ├── audio/                   # Audio recording components
│   │   │   │   ├── AudioPlayer.tsx      # Audio playback
│   │   │   │   ├── AudioWaveform.tsx    # Waveform visualization
│   │   │   │   └── RecordButton.tsx     # Recording button
│   │   │   │
│   │   │   ├── capture/                 # Capture modal
│   │   │   │   └── CaptureModal.tsx     # Unified capture modal
│   │   │   │
│   │   │   ├── history/                 # History components
│   │   │   │   └── HistoryCard.tsx      # Image grid card
│   │   │   │
│   │   │   ├── icons/                   # Custom icons
│   │   │   │   └── WalkIcon.tsx         # Boot footprints icon
│   │   │   │
│   │   │   ├── navigation/              # Navigation components
│   │   │   │   └── AppHeader.tsx        # App header with actions
│   │   │   │
│   │   │   └── trial/                   # Trial system components
│   │   │       └── TrialBadge.tsx       # Trial counter badge
│   │
│   ├── 📱 Screens
│   │   └── screens/
│   │       ├── WalkScreen.tsx           # ✅ Walk tracking (Tab)
│   │       ├── HistoryScreen.tsx        # ✅ History grid (Tab, Default)
│   │       ├── CameraScreen.tsx         # ✅ Camera capture (Modal)
│   │       ├── AudioRecordingScreen.tsx # ✅ Audio recording (Modal)
│   │       ├── ResultsScreen.tsx        # ✅ Identification results
│   │       ├── ProfileScreen.tsx        # ✅ User profile
│   │       ├── HomeScreen.tsx           # ⚠️ Legacy (unused)
│   │       ├── MapScreen.tsx            # 🚧 Placeholder (future)
│   │       │
│   │       └── auth/                    # Auth screens
│   │           └── AuthScreen.tsx       # ✅ Sign in/up
│   │
│   ├── 🧭 Navigation
│   │   └── navigation/
│   │       ├── RootNavigator.tsx        # Main navigation setup
│   │       └── CustomBottomTabNavigator.tsx  # AllTrails-style tabs
│   │
│   ├── 🪝 Hooks
│   │   └── hooks/
│   │       ├── useAuth.ts               # Clerk authentication
│   │       ├── useTrialStatus.ts        # Trial management
│   │       ├── useImageCapture.ts       # Camera operations
│   │       ├── useAudioRecording.ts     # Audio recording
│   │       ├── useSpeciesIdentification.ts  # AI identification
│   │       │
│   │       └── __tests__/               # Hook tests
│   │           └── useAudioRecording.test.ts
│   │
│   ├── 🔧 Services
│   │   └── services/
│   │       ├── clerk.ts                 # Clerk token cache
│   │       ├── firebase.ts              # Firebase initialization
│   │       ├── identificationService.ts # Species ID service
│   │       └── audioService.ts          # Audio file management
│   │
│   ├── 📐 Types
│   │   └── types/
│   │       ├── navigation.ts            # Navigation types
│   │       ├── user.ts                  # User metadata types
│   │       ├── species.ts               # Species data types
│   │       ├── audio.ts                 # Audio recording types
│   │       └── capture.ts               # Capture system types
│   │
│   ├── ⚙️ Configuration
│   │   ├── config/
│   │   │   └── env.ts                   # Environment config
│   │   │
│   │   └── constants/
│   │       └── theme.ts                 # N8ture AI theme
│   │
│   └── 📊 Project Structure (this file)
│       └── PROJECT_STRUCTURE.md
```

## 📊 Screen Categories

### Active Screens (Used in Navigation)
1. ✅ **WalkScreen** - Main walk tracking interface
2. ✅ **HistoryScreen** - Default screen, image grid
3. ✅ **AuthScreen** - Authentication modal
4. ✅ **CameraScreen** - Camera capture modal
5. ✅ **AudioRecordingScreen** - Audio recording modal
6. ✅ **ResultsScreen** - Identification results
7. ✅ **ProfileScreen** - User profile

### Legacy/Inactive Screens
8. ⚠️ **HomeScreen** - Replaced by HistoryScreen as default
9. 🚧 **MapScreen** - Placeholder for future feature

## 🗺️ Navigation Structure

```
App (NavigationContainer)
├── RootNavigator (Stack)
│   ├── MainTabs (Bottom Tabs) ← Initial Route
│   │   ├── WalksTab (Tab 1, Left)
│   │   │   └── WalkScreen
│   │   │
│   │   └── HistoryTab (Tab 2, Right, Default)
│   │       └── HistoryScreen
│   │
│   ├── Auth (Modal)
│   │   └── AuthScreen
│   │
│   ├── Camera (Full Screen Modal)
│   │   └── CameraScreen
│   │
│   ├── AudioRecording (Modal)
│   │   └── AudioRecordingScreen
│   │
│   ├── Results (Card)
│   │   └── ResultsScreen
│   │
│   ├── Profile (Card)
│   │   └── ProfileScreen
│   │
│   └── Settings (Card) - TODO
│       └── ProfileScreen (temporary)
│
└── CaptureModal (Overlay, outside nav tree)
    └── Triggers navigation to Camera/Audio/Both
```

## 🎨 Bottom Navigation Layout

```
┌────────────────────────────────────────┐
│  Title                      ⚙️  👤     │ ← AppHeader
├────────────────────────────────────────┤
│                                        │
│          Main Content Area             │
│        (Walk or History Screen)        │
│                                        │
└────────────────────────────────────────┘
┌──────────┬──────┬──────────┐
│  Walks   │      │ History  │           ← CustomBottomTabNavigator
│   👢👢   │  📷  │   📋    │
└──────────┴──────┴──────────┘
              ↑
      Elevated Capture Button
      (Opens CaptureModal)
```

## 📈 Component Hierarchy

### Main Components by Feature

**Authentication**
- AuthScreen → SignInForm / SignUpForm
- ProtectedRoute (HOC)
- useAuth hook

**Capture System**
- CaptureModal → Triggers Camera/Audio/Both
- CameraScreen → useImageCapture
- AudioRecordingScreen → useAudioRecording
- ResultsScreen ← Receives identification data

**History & Tracking**
- HistoryScreen → HistoryCard (grid)
- WalkScreen → StartWalkHero + WalkCard (list)

**Navigation**
- CustomBottomTabNavigator (2 tabs + center button)
- AppHeader (back, settings, profile)

**Trial System**
- TrialBadge
- useTrialStatus hook

## 🔑 Key Files Explained

### Entry Points
- `App.tsx` - App initialization, Clerk provider
- `index.ts` - Expo entry point

### Core Configuration
- `app.json` - Expo config (permissions, assets, etc.)
- `src/constants/theme.ts` - N8ture AI design system

### Navigation
- `src/navigation/RootNavigator.tsx` - Main nav setup
- `src/navigation/CustomBottomTabNavigator.tsx` - Bottom tabs

### Services
- `functions/services/geminiService.js` - Gemini AI API
- `src/services/identificationService.ts` - Species ID logic
- `src/services/clerk.ts` - Authentication token cache

### Type Definitions
- `src/types/navigation.ts` - Navigation param lists
- `src/types/capture.ts` - Capture modes and configs
- `src/types/species.ts` - Species data structures

## 📊 Statistics

**Total Screens**: 9
- **Active**: 7
- **Legacy**: 1 (HomeScreen)
- **Placeholder**: 1 (MapScreen)

**Total Components**: 16+
**Total Hooks**: 5
**Total Services**: 4
**Total Type Files**: 5

**Lines of Code** (Approximate):
- Screens: ~2,500 lines
- Components: ~1,500 lines
- Navigation: ~500 lines
- Hooks: ~1,200 lines
- Services: ~800 lines
- Types: ~600 lines
- **Total**: ~7,100 lines

## 🚀 Screen Status Summary

| Screen | Status | Location | Purpose |
|--------|--------|----------|---------|
| WalkScreen | ✅ Active | Bottom Tab (Left) | Walk tracking |
| HistoryScreen | ✅ Active | Bottom Tab (Right, Default) | Species grid |
| CameraScreen | ✅ Active | Modal | Photo capture |
| AudioRecordingScreen | ✅ Active | Modal | Audio recording |
| ResultsScreen | ✅ Active | Card | ID results |
| ProfileScreen | ✅ Active | Card | User profile |
| AuthScreen | ✅ Active | Modal | Authentication |
| HomeScreen | ⚠️ Legacy | - | Unused |
| MapScreen | 🚧 Placeholder | - | Future feature |

---

**Last Updated**: After Phase 7 (AllTrails Navigation Complete)
**Branch**: `claude/init-n8ture-ai-app-011CUSCnd5FiC6H9kv3qLH9c`
