# UX Enhancement Proposal: Unified Capture Interface

## Overview

This document proposes a comprehensive UX redesign based on user feedback to create a more intuitive, versatile, and minimalistic interface for the N8ture AI App.

## Current State vs Proposed State

### Current Implementation
- Separate screens for Camera and Audio recording
- Manual navigation between features
- Single-mode operation (one capture at a time)
- No real-time detection during recording

### Proposed Implementation
- **Bottom navigation bar** with center capture button
- **Unified capture modal** with Camera/Listen/Both options
- **Automatic and Manual modes** for different use cases
- **Real-time detection** during continuous monitoring
- **Minimalistic UK-focused design**

## Core UX Principles

1. **User Control**: User chooses when and how to capture
2. **Flexibility**: Support multiple scenarios (walk tracking, passive listening, photo-only)
3. **Simplicity**: Minimalistic interface, clear options
4. **Real-time Feedback**: Show detections as they happen
5. **Context Awareness**: Different modes for different activities

## Navigation Architecture

### Bottom Navigation Bar

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Main Content Area                  │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
┌───────┬───────┬─────────┬───────┬───────────────┐
│ Home  │History│ CAPTURE │ Map   │   Profile     │
│   🏠  │  📋  │    ⊕    │  🗺️  │     👤        │
└───────┴───────┴─────────┴───────┴───────────────┘
```

**Tabs:**
1. **Home** (🏠) - Dashboard, recent activity, quick stats
2. **History** (📋) - Past identifications, saved species
3. **CAPTURE** (⊕) - **Center button** - Opens capture modal
4. **Map** (🗺️) - Location-based discoveries (optional)
5. **Profile** (👤) - User settings, subscription, preferences

### Center Capture Button
- **Prominent** - Larger than other tabs, elevated design
- **Always accessible** - Available from any screen
- **Visual feedback** - Pulse animation when in automatic mode
- **Color**: N8ture AI primary green (#708C6A)

## Unified Capture Modal

When user taps the center CAPTURE button, a modal slides up from bottom:

```
┌─────────────────────────────────────────────────┐
│         What would you like to capture?        │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐  ┌─────────────┐            │
│   │   📷        │  │   🎵        │            │
│   │  Camera     │  │  Listen     │            │
│   │             │  │             │            │
│   │  Identify   │  │  Record     │            │
│   │  by photo   │  │  sounds     │            │
│   └─────────────┘  └─────────────┘            │
│                                                 │
│   ┌─────────────────────────────────┐          │
│   │         📷 + 🎵                 │          │
│   │         Camera + Listen          │          │
│   │                                  │          │
│   │    Identify by sight & sound     │          │
│   └─────────────────────────────────┘          │
│                                                 │
│   ┌─────────────────────────────────┐          │
│   │     Mode: [Automatic] [Manual]   │          │
│   └─────────────────────────────────┘          │
│                                                 │
│               [ Cancel ]                        │
└─────────────────────────────────────────────────┘
```

### Modal Options

1. **Camera Only** (📷)
   - Opens camera interface
   - Take photo → Immediate identification
   - Use case: Quick plant/fungi ID

2. **Listen Only** (🎵)
   - Opens audio recording interface
   - Record → Identify bird/bat/insect
   - Use case: Bird watching, night walks

3. **Camera + Listen** (📷 + 🎵)
   - **Dual capture mode**
   - Simultaneously record audio and video
   - Identifies both visual and audio species
   - Use case: Comprehensive wildlife observation

4. **Mode Toggle** (Bottom of modal)
   - **Automatic Mode**: Continuous monitoring with real-time detection
   - **Manual Mode**: User-triggered captures only

## Operating Modes

### Automatic Mode (Walk Tracking)

**Purpose**: Continuous monitoring during nature walks

**Behavior:**
```
User taps CAPTURE → Selects "Listen" → Toggles "Automatic"
↓
App starts continuous audio monitoring
↓
Real-time analysis in background (every 5-10 seconds)
↓
When species detected:
  - Show notification banner (non-intrusive)
  - "Blue Tit detected - Tap to save"
  - User can tap to "mark" and save full details
↓
Continue monitoring until user stops
```

**UI During Automatic Mode:**
```
┌─────────────────────────────────────────────────┐
│  🎵 Listening... [●REC]              00:15:32   │
├─────────────────────────────────────────────────┤
│                                                 │
│        ~~~~  Audio Waveform  ~~~~              │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 🐦 Great Tit detected (87% confidence)   │  │
│  │                                   [Mark] │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Species detected this walk:                   │
│  • Blackbird (3 occurrences)                   │
│  • Robin (1 occurrence)                        │
│  • Great Tit (just now)                        │
│                                                 │
│           [🔴 Stop Recording]                   │
│           [⏸️ Pause] [Mark Now]                 │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Real-time detection** - Analyzes audio stream continuously
- **Non-intrusive notifications** - Banner at top, doesn't interrupt
- **Manual marking** - User can tap "Mark" to save detection
- **Walk summary** - Shows all species detected during session
- **Background operation** - Works even if user switches apps
- **Battery efficient** - On-device preliminary detection, API for confirmation

**Data Storage:**
- Saves only marked species (not entire audio)
- Stores timestamps and GPS coordinates
- Creates "Walk Session" with all detections
- User can review and export walk summary

### Manual Mode (User-Controlled)

**Purpose**: Precise, intentional captures when user wants full control

**Behavior:**
```
User taps CAPTURE → Selects "Listen" → Toggles "Manual"
↓
App shows recording interface (ready state)
↓
User presses record button when they hear something
↓
Records for specified duration (10s, 30s, 60s)
↓
User stops manually or auto-stops at duration limit
↓
Immediately analyzes and shows results
```

**UI During Manual Mode:**
```
┌─────────────────────────────────────────────────┐
│         🎵 Manual Recording Mode                │
├─────────────────────────────────────────────────┤
│                                                 │
│        Ready to record...                       │
│                                                 │
│        ~~~~  ____________  ~~~~                │
│             (Audio idle)                        │
│                                                 │
│   Duration: [10s] [30s] [60s] [Custom]         │
│                                                 │
│                                                 │
│              ┌─────────┐                        │
│              │    ●    │                        │
│              │  Press  │                        │
│              │   to    │                        │
│              │ Record  │                        │
│              └─────────┘                        │
│                                                 │
│                                                 │
│   Tip: Press record when you hear a bird song  │
└─────────────────────────────────────────────────┘
```

**Features:**
- **User-initiated** - Recording only starts on button press
- **Duration presets** - Quick selection (10s/30s/60s)
- **Visual feedback** - Clear recording state
- **Immediate results** - Analysis starts right after recording
- **Retry option** - Can re-record if audio quality poor

## Use Cases & Scenarios

### Scenario 1: Nature Walk with Tracking

**User Goal**: Record entire walk, identify all birds heard

**User Flow:**
1. Tap center CAPTURE button
2. Select "Listen" mode
3. Toggle "Automatic" mode ON
4. Start walking
5. App continuously monitors audio
6. Detections appear as notifications
7. User taps "Mark" to save interesting species
8. Stop recording when walk ends
9. Review walk summary with all detections

**Benefits:**
- Hands-free operation during walk
- Doesn't miss any birds
- User can focus on observing, not operating phone

### Scenario 2: Passive Listening (No Tracking)

**User Goal**: Enjoy bird songs without recording/tracking

**User Flow:**
1. Tap center CAPTURE button
2. Select "Listen" mode
3. Toggle "Automatic" mode ON
4. Enable "Listen Only" toggle (new option)
5. App shows live detections but doesn't save anything
6. User enjoys nature with real-time IDs
7. No trial count used
8. No data stored

**Benefits:**
- Educational experience
- Doesn't consume trials/storage
- Learn bird songs in real-time

### Scenario 3: Quick Photo Identification

**User Goal**: Identify a plant they just spotted

**User Flow:**
1. Tap center CAPTURE button
2. Select "Camera" mode
3. Take photo
4. Immediate identification results
5. Save to history

**Benefits:**
- Quick and simple
- Familiar camera interface
- No mode selection needed

### Scenario 4: Bat Detection at Night

**User Goal**: Record and identify bat echolocation calls

**User Flow:**
1. Tap center CAPTURE button
2. Select "Listen" mode
3. Choose "Manual" mode
4. Set duration to 30s
5. Press record when bats fly overhead
6. Ultrasonic analysis identifies bat species
7. Review results with spectrogram

**Benefits:**
- Specialized for ultrasonic detection
- User controls timing (when bats appear)
- High-quality recording for analysis

### Scenario 5: Comprehensive Wildlife Documentation

**User Goal**: Document a rare bird with both photo and call

**User Flow:**
1. Tap center CAPTURE button
2. Select "Camera + Listen" mode
3. Choose "Manual" mode
4. Point camera at bird
5. Press capture when bird sings
6. Records 10s video + audio simultaneously
7. AI analyzes both visual and audio
8. High-confidence identification from dual data

**Benefits:**
- Most comprehensive data
- Higher confidence results
- Complete documentation for rare species

## Technical Architecture

### Real-Time Detection System

```
┌───────────────────────────────────────────────────┐
│          Audio Input (Microphone)                 │
└─────────────────┬─────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────────────┐
│     Audio Buffer (5-10 second chunks)             │
└─────────────────┬─────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────────────┐
│  On-Device Pre-Processing                         │
│  - Noise reduction                                │
│  - Frequency analysis                             │
│  - Bird/bat/insect classification                 │
└─────────────────┬─────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌─────────────┐   ┌─────────────────┐
│ Significant │   │ Background      │
│ Detection   │   │ Noise/Ambiance  │
└──────┬──────┘   └─────────────────┘
       │                   │
       │                   └─→ Discard
       ▼
┌───────────────────────────────────────────────────┐
│  Cloud Function (BirdNET / Gemini Audio)          │
│  - Detailed species identification                │
│  - Confidence scoring                             │
└─────────────────┬─────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────────────┐
│  Show Detection Banner                            │
│  "Blue Tit detected (87%)" [Mark]                 │
└───────────────────────────────────────────────────┘
```

### Mode State Management

```typescript
// New types for mode system
export type CaptureMode = 'camera' | 'listen' | 'both';
export type OperatingMode = 'automatic' | 'manual';
export type ListeningMode = 'track' | 'passive'; // passive = no storage

export interface CaptureSession {
  id: string;
  mode: CaptureMode;
  operatingMode: OperatingMode;
  listeningMode?: ListeningMode;
  startTime: Date;
  endTime?: Date;
  detections: Detection[];
  markedDetections: Detection[];
  location?: GeoLocation;
  audioUri?: string; // Only for manual recordings
  sessionType: 'walk' | 'single-capture' | 'passive';
}

export interface Detection {
  id: string;
  timestamp: Date;
  species: SpeciesIdentification;
  confidence: number;
  marked: boolean; // User explicitly marked this
  audioChunkUri?: string; // Reference to specific audio segment
  location?: GeoLocation;
}
```

### New Hooks

```typescript
// Hook for unified capture system
export function useCaptureSession() {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<CaptureMode>('listen');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('manual');
  const [detections, setDetections] = useState<Detection[]>([]);

  const startSession = async (config: CaptureSessionConfig) => {
    // Initialize capture session
  };

  const stopSession = async () => {
    // Finalize and save session
  };

  const markDetection = async (detectionId: string) => {
    // User explicitly marks a detection to save
  };

  return {
    isActive,
    mode,
    operatingMode,
    detections,
    startSession,
    stopSession,
    markDetection,
  };
}

// Hook for real-time detection
export function useRealTimeDetection(config: DetectionConfig) {
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [processingBuffer, setProcessingBuffer] = useState(false);

  // Processes audio in chunks
  const processAudioChunk = async (audioBuffer: AudioBuffer) => {
    // On-device pre-processing
    const isSignificant = await analyzeAudioLocally(audioBuffer);

    if (isSignificant) {
      // Send to cloud for detailed identification
      const species = await identifySpeciesFromAudio(audioBuffer);
      setCurrentDetection({
        species,
        timestamp: new Date(),
        marked: false,
      });
    }
  };

  return {
    currentDetection,
    processingBuffer,
    processAudioChunk,
  };
}
```

## Component Architecture

### New Components

1. **`BottomTabNavigator.tsx`**
   - Custom bottom tab navigator
   - Center elevated capture button
   - N8ture AI branding

2. **`CaptureModal.tsx`**
   - Slides up from bottom
   - Three capture options (Camera/Listen/Both)
   - Mode toggle (Automatic/Manual)
   - Listening mode toggle (Track/Passive)

3. **`AutomaticModeScreen.tsx`**
   - Continuous monitoring interface
   - Real-time detection banners
   - Session summary
   - Mark/save controls

4. **`DetectionBanner.tsx`**
   - Non-intrusive notification
   - Shows species name and confidence
   - "Mark" button to save
   - Dismissible

5. **`WalkSessionSummary.tsx`**
   - End-of-walk summary
   - List of all detections
   - Map with detection points
   - Export options

### Modified Components

1. **`CameraScreen.tsx`** → **`CameraCaptureScreen.tsx`**
   - Simplified for single-purpose
   - Launched from capture modal
   - Returns result to caller

2. **`AudioRecordingScreen.tsx`** → **`AudioCaptureScreen.tsx`**
   - Supports both automatic and manual modes
   - Real-time detection integration
   - Detection marking interface

## UI/UX Specifications

### Bottom Navigation Bar

**Dimensions:**
- Height: 60px (70px for center button)
- Safe area padding on iOS
- Elevation: 8dp (shadow)

**Center Button:**
- Diameter: 60px
- Elevation: 4dp above nav bar
- Background: Gradient (#708C6A → #8FAF87)
- Icon: Plus symbol (⊕) or camera/mic combo
- Pulse animation when in automatic mode

**Colors:**
- Active tab: #708C6A (Leaf Khaki)
- Inactive tab: #8C8871 (Light Gray)
- Background: #FFFFFF
- Border: #E0E0E0 (1px top border)

### Capture Modal

**Animation:**
- Slide up from bottom (300ms ease-out)
- Backdrop dim (rgba(0,0,0,0.5))
- Dismissible by tapping backdrop or "Cancel"

**Layout:**
- Rounded top corners (24px radius)
- Padding: 24px
- Card-based option buttons
- Minimalistic UK design aesthetic

**Card Buttons:**
- Height: 120px
- Border radius: 16px
- Border: 2px solid #708C6A
- Hover state: Fill background #F0F5F0
- Icon + Label layout

### Detection Banner (Automatic Mode)

**Position:**
- Top of screen
- Below status bar
- Above content (z-index: 1000)

**Animation:**
- Slide down from top (200ms)
- Auto-dismiss after 10s (unless user interacts)
- Can be swiped up to dismiss

**Content:**
- Species icon (🐦)
- Species name (bold)
- Confidence percentage
- "Mark" button (right side)
- Green accent color (#8FAF87)

### Minimalistic Design Principles

**UK Aesthetic:**
- Clean, uncluttered interface
- Subtle animations
- High contrast for readability outdoors
- Nature-inspired colors (greens, earth tones)
- Clear typography (SF Pro / Roboto)

**Accessibility:**
- High contrast mode support
- Large touch targets (min 44x44px)
- Screen reader support
- Haptic feedback on interactions

## Implementation Phases

### Phase 4.1: Bottom Navigation (PRIORITY)
- Create custom bottom tab navigator
- Design center capture button with elevation
- Implement navigation routing
- Add pulse animation for automatic mode

### Phase 4.2: Capture Modal (PRIORITY)
- Build modal component with slide-up animation
- Create three capture option cards
- Implement mode toggle switches
- Add listening mode toggle

### Phase 4.3: Automatic Mode Detection
- Implement audio chunking system
- Build on-device pre-processing
- Integrate with BirdNET/Gemini API
- Create detection queue and state management

### Phase 4.4: Detection Banner & Marking
- Build non-intrusive banner component
- Implement mark/save functionality
- Create detection history list
- Add session summary view

### Phase 4.5: Dual Capture Mode
- Implement simultaneous audio+video recording
- Build multimodal analysis pipeline
- Create combined results screen
- Optimize performance and battery

### Phase 4.6: Passive Listening Mode
- Add "Listen Only" toggle
- Disable data storage in passive mode
- Show live detections without saving
- Ensure no trial count usage

## Battery & Performance Optimization

### Automatic Mode Challenges
- Continuous audio monitoring = high battery drain
- Real-time processing = CPU intensive

### Optimization Strategies

1. **Adaptive Processing**
   - Lower frequency during silence
   - Increase frequency when activity detected
   - Use accelerometer to detect user movement

2. **On-Device First**
   - TensorFlow Lite model for pre-screening
   - Only send significant audio to cloud
   - Reduces API costs and latency

3. **Battery Saver Mode**
   - Option to reduce detection frequency
   - "Every 10 seconds" vs "Every 5 seconds"
   - Disable GPS in battery saver

4. **Background Optimization**
   - Use iOS/Android background audio APIs
   - Wake locks only when necessary
   - Efficient buffer management

## User Settings & Preferences

### Settings Screen Additions

```
┌─────────────────────────────────────────────────┐
│  Detection Settings                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Default Capture Mode                           │
│  ◉ Automatic    ○ Manual                        │
│                                                 │
│  Detection Frequency (Automatic)                │
│  ○ Every 5 seconds (High battery usage)         │
│  ◉ Every 10 seconds (Balanced)                  │
│  ○ Every 15 seconds (Battery saver)             │
│                                                 │
│  Auto-Save Detections                           │
│  ◉ Ask before saving (Mark required)            │
│  ○ Save all detections automatically            │
│                                                 │
│  Background Detection                           │
│  [x] Continue detecting when app in background  │
│                                                 │
│  GPS Tracking                                   │
│  [x] Record location with detections            │
│  ○ Battery saver (lower accuracy)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Trial System Integration

### How Modes Affect Trials

1. **Passive Listening Mode**: ❌ No trials consumed (no data saved)
2. **Automatic Mode (Unmarked)**: ❌ No trials consumed (user didn't mark)
3. **Automatic Mode (Marked)**: ✅ 1 trial per marked species
4. **Manual Mode**: ✅ 1 trial per recording analyzed
5. **Camera Mode**: ✅ 1 trial per photo analyzed
6. **Camera + Listen Mode**: ✅ 1 trial for combined capture

### User Communication

**Before Starting Automatic Mode:**
```
┌─────────────────────────────────────────────────┐
│  Automatic Listening Mode                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  I'll continuously monitor for bird songs.      │
│                                                 │
│  You have 3 free identifications remaining.     │
│                                                 │
│  You'll only use a trial when you tap "Mark"    │
│  to save a detection.                           │
│                                                 │
│  ℹ️ Tip: Use passive mode to listen without     │
│     using trials.                                │
│                                                 │
│           [Start Listening]  [Cancel]           │
└─────────────────────────────────────────────────┘
```

## Success Metrics

### Key Performance Indicators (KPIs)

1. **User Engagement**
   - Automatic mode usage %
   - Average walk session duration
   - Detections marked vs unmarked ratio

2. **Feature Adoption**
   - Camera vs Listen vs Both usage split
   - Automatic vs Manual mode preference
   - Passive listening usage

3. **Detection Quality**
   - Confidence scores in automatic mode
   - User confirmation rate (marked detections)
   - False positive rate

4. **Performance**
   - Average battery drain per 30-min session
   - Real-time detection latency
   - API cost per session

## Next Steps

### Immediate Actions (Phase 4.1)

1. **Design Review**: Review bottom navigation mockups with stakeholders
2. **Technical Spike**: Test real-time audio processing on device
3. **API Research**: Evaluate BirdNET API vs on-device TensorFlow Lite
4. **Battery Testing**: Measure actual battery impact of continuous monitoring

### Implementation Order

1. ✅ Bottom Navigation with center capture button
2. ✅ Capture Modal with three options
3. ✅ Refactor existing screens to work with new navigation
4. ⏳ Implement automatic mode infrastructure
5. ⏳ Build detection banner and marking system
6. ⏳ Add passive listening mode
7. ⏳ Implement dual capture (camera + audio)
8. ⏳ Optimize battery and performance

---

## Summary

This UX enhancement transforms N8ture AI from a **tool-based app** (separate camera and audio screens) into a **mode-based app** (unified capture with context-aware behavior).

**Key Benefits:**
- ✅ **More intuitive** - Single capture button for all inputs
- ✅ **More versatile** - Supports multiple use cases (walk tracking, passive listening, quick captures)
- ✅ **More user-controlled** - Automatic vs Manual modes give users power
- ✅ **More efficient** - Real-time detection doesn't interrupt user
- ✅ **More respectful** - Passive mode allows learning without trial consumption
- ✅ **UK-focused minimalism** - Clean, outdoor-friendly interface

This aligns with the vision of a **nature companion app** that adapts to how users actually explore and observe wildlife.
