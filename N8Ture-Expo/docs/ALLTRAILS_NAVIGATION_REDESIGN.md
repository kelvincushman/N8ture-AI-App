# AllTrails-Style Navigation Redesign

## Overview

Redesign the N8ture AI app navigation to follow the AllTrails UI pattern, focusing on simplicity and the core features: AI identification and walk tracking.

## Reference: AllTrails App Design

**Key Characteristics:**
- 3-tab bottom navigation (simple, focused)
- Large elevated center button for primary action
- Clean, minimalistic design
- Image-based history/activity feed
- Simple top header with contextual actions

## Proposed Navigation Structure

### Bottom Navigation Bar (3 Tabs)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            Main Content Area                    │
│         (History/Activity Feed)                 │
│                                                 │
└─────────────────────────────────────────────────┘
┌───────────────┬──────────┬───────────────────────┐
│   Walks       │          │      History          │
│   👢👢        │    📷    │        📋            │
│               │   [●]    │                       │
└───────────────┴──────────┴───────────────────────┘
                    ↑
              Center Capture
              (Elevated 30px)
```

### Tab Breakdown

**1. Left Tab: Walks (👢)**
- Icon: Boot footprints (two small boot icons side by side)
- Label: "Walks"
- Navigates to: Walk tracking screen
- Purpose: Start walk tracking sessions

**2. Center: Capture Button (📷)**
- Large round button (70x70px vs 60px nav bar height)
- Elevated 30px above bottom bar
- Gradient background (#708C6A → #8FAF87)
- White border (4px)
- Shadow: 12px blur, 30% opacity
- Icon: Camera or Plus symbol (white, 36px)
- Action: Opens capture modal

**3. Right Tab: History (📋)**
- Icon: List/grid icon
- Label: "History"
- Navigates to: History feed with image grid
- Purpose: View past identifications

### Top Header (Contextual)

**Standard Header (History/Main View):**
```
┌─────────────────────────────────────────────────┐
│  N8ture AI                         ⚙️  👤      │
└─────────────────────────────────────────────────┘
```

**Detail View Header (Results, Walk Details):**
```
┌─────────────────────────────────────────────────┐
│  ← Back                            ⚙️  👤      │
└─────────────────────────────────────────────────┘
```

**Elements:**
- Left: Back arrow (only on detail screens)
- Center: Screen title (if not on home)
- Right: Settings icon (⚙️) + Profile icon (👤)

### Main Content Area

**History Screen (Default View):**
- Image grid layout (2 columns)
- Each card shows:
  - Species photo
  - Species name
  - Date/time
  - Confidence badge
  - Type icon (camera/audio)
- Pull to refresh
- Infinite scroll
- Empty state: "Start identifying species"

**Walk Screen:**
- Active walk session UI
- "Start New Walk" button
- Past walks list
- Walk statistics

## Design Specifications

### Bottom Navigation Bar

**Dimensions:**
- Height: 60px (content)
- Height with safe area: 60px + bottom inset
- Tab width: 33.33% each
- Background: White with 1px top border (#E0E0E0)
- iOS: Blur background (glass morphism)
- Android: Solid white with elevation 8

**Tab Items:**
- Icon size: 26px
- Label size: 11px
- Active color: #708C6A (N8ture green)
- Inactive color: #8C8871 (gray)
- Padding: 8px top, 4px bottom
- Gap between icon and label: 4px

### Center Capture Button

**Dimensions:**
- Diameter: 70px (10px larger than typical tab buttons)
- Border: 4px solid white
- Elevation: 30px above nav bar (vs 20px previously)
- Position: Center of nav bar, elevated upward

**Styling:**
- Background: Linear gradient
  - Start: #708C6A (0%, 0%) - Leaf Khaki
  - End: #8FAF87 (100%, 100%) - Accent Green
- Icon: Camera (36px, white)
- Shadow:
  - iOS: shadowColor #000, offset (0, 6), opacity 0.25, radius 12
  - Android: elevation 12
- Active state: Scale 0.95, opacity 0.9
- Ripple effect on press (Android)

**Button States:**
- Default: Full color gradient
- Pressed: Slightly darker, scale 0.95
- Recording/Active: Pulsing animation (scale 1.0 → 1.1 → 1.0, 2s loop)

### Walk Icon (Boot Footprints)

**Design:**
```
  👢  👢
Left  Right
boot  boot
```

**Implementation:**
- Custom SVG or use Ionicons: `footsteps-outline` or `walk-outline`
- Alternative: Material Icons `hiking` or `directions-walk`
- Color: Matches tab state (green when active, gray when inactive)
- Size: 26px

### History Icon

**Design:**
- Use: `grid-outline` (Ionicons) or `apps-outline`
- Represents: Grid view of history items
- Alternative: `time-outline` or `list-outline`

### Top Header

**Height:** 56px + status bar
**Background:** #708C6A (N8ture green)
**Text color:** #FFFFFF

**Back Button:**
- Icon: `arrow-back` (Ionicons)
- Size: 24px
- Touch target: 44x44px
- Position: 16px from left edge

**Settings Icon:**
- Icon: `settings-outline`
- Size: 22px
- Touch target: 44x44px
- Position: 16px from right edge

**Profile Icon:**
- Icon: `person-circle-outline`
- Size: 22px
- Touch target: 44x44px
- Position: 60px from right edge (next to settings)

## Screen Layouts

### History Screen (Main/Default)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  N8ture AI                         ⚙️  👤      │ <- Header
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐              │
│  │   Robin     │  │  Oak Tree   │              │
│  │   🐦 92%    │  │   🌳 88%    │              │
│  │  [Photo]    │  │  [Photo]    │              │
│  │  2 hrs ago  │  │  1 day ago  │              │
│  └─────────────┘  └─────────────┘              │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐              │
│  │  Blue Tit   │  │  Blackbird  │              │
│  │   🐦 95%    │  │   🐦 89%    │              │
│  │  [Photo]    │  │  [Audio]    │              │
│  │  2 days ago │  │  3 days ago │              │
│  └─────────────┘  └─────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
┌───────────────┬──────────┬───────────────────────┐
│   Walks       │          │      History          │ <- Bottom Nav
│   👢👢        │    📷    │        📋            │
│               │   [●]    │                       │
└───────────────┴──────────┴───────────────────────┘
```

**Grid Layout:**
- 2 columns
- Gap: 12px
- Padding: 16px
- Card aspect ratio: 4:5 (portrait)
- Card border radius: 12px
- Card shadow: subtle elevation

**Card Content:**
- Species photo (top, full width)
- Species name (bold, 16px)
- Confidence badge (top right corner)
- Type icon (camera/audio, top left corner)
- Date (small, gray, bottom)

### Walk Screen

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  ← Walks                           ⚙️  👤      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │      Start a New Walk                   │   │
│  │                                         │   │
│  │      Track species along your path      │   │
│  │                                         │   │
│  │      [▶️  Start Walk]                    │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Recent Walks:                                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Morning Walk at Richmond Park          │   │
│  │  5 species • 2.3 km • 45 min            │   │
│  │  2 hours ago                            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Evening Walk at Hyde Park              │   │
│  │  8 species • 3.1 km • 1 hr 10 min       │   │
│  │  Yesterday                              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
┌───────────────┬──────────┬───────────────────────┐
│   Walks       │          │      History          │
│   👢👢        │    📷    │        📋            │
│               │   [●]    │                       │
└───────────────┴──────────┴───────────────────────┘
```

## Component Architecture

### 1. Bottom Navigation (AllTrailsBottomNav.tsx)

```typescript
interface AllTrailsBottomNavProps {
  activeTab: 'walks' | 'history';
  onTabChange: (tab: 'walks' | 'history') => void;
  onCapturePress: () => void;
}

// 3-tab layout with center elevated button
// Left: Walks tab
// Center: Capture button (elevated, outside tab navigator)
// Right: History tab
```

### 2. Capture Button (CaptureButton.tsx)

```typescript
interface CaptureButtonProps {
  onPress: () => void;
  isActive?: boolean; // For recording/walk state
}

// Larger elevated button (70x70px)
// Gradient background
// White border
// Pulsing animation when active
```

### 3. History Feed (HistoryFeedScreen.tsx)

```typescript
// Grid layout with image cards
// Pull to refresh
// Infinite scroll
// Filter/search options
// Empty state
```

### 4. Walk Screen (WalkScreen.tsx)

```typescript
// "Start New Walk" card
// Past walks list
// Walk statistics
// Active walk session UI
```

### 5. Header Component (AppHeader.tsx)

```typescript
interface AppHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
  showSettings?: boolean;
  showProfile?: boolean;
}

// Contextual header
// Back button on detail screens
// Settings + Profile on main screens
```

## Navigation Structure (Updated)

```typescript
// Main Tabs (2 tabs)
type MainTabsParamList = {
  WalksTab: undefined;
  HistoryTab: undefined;
};

// Root Stack (for modals and detail screens)
type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;

  // Capture modals
  Camera: { config?: CaptureConfig };
  AudioRecording: { config?: CaptureConfig };
  DualCapture: { config?: CaptureConfig };

  // Detail screens
  Results: { imageUri: string; identificationId?: string };
  WalkSession: { sessionId: string };
  SpeciesDetail: { speciesId: string };

  // Settings
  Settings: undefined;
  Profile: undefined;
};
```

## Implementation Steps

### Phase 1: Simplify Navigation Structure
1. ✅ Remove Map and Profile tabs from bottom nav
2. ✅ Create 2-tab layout (Walks, History)
3. ✅ Move Profile/Settings to top header
4. ✅ Update navigation types

### Phase 2: Redesign Center Button
1. ✅ Increase size from 60px to 70px
2. ✅ Increase elevation from 20px to 30px
3. ✅ Add thicker white border (4px vs 3px)
4. ✅ Enhance shadow effect
5. ✅ Add pulsing animation for active state

### Phase 3: Create Walk Icon
1. ✅ Design/choose boot footprints icon
2. ✅ Test visibility and clarity
3. ✅ Ensure consistent sizing

### Phase 4: Update History Screen
1. ✅ Change from list to grid layout
2. ✅ Add image cards
3. ✅ Show species photos prominently
4. ✅ Add confidence badges
5. ✅ Add type indicators (camera/audio)

### Phase 5: Create Walk Screen
1. ✅ "Start New Walk" hero section
2. ✅ Past walks list
3. ✅ Walk statistics
4. ✅ Integration with walk tracking system

### Phase 6: Implement Top Header
1. ✅ Create AppHeader component
2. ✅ Add back button (conditional)
3. ✅ Add settings icon (top right)
4. ✅ Add profile icon (top right)
5. ✅ Handle navigation actions

## Visual Design Changes

### Before (5-tab layout):
```
┌─────┬─────┬───┬─────┬─────┐
│Home │Hist.│CAP│ Map │Prof.│
└─────┴─────┴───┴─────┴─────┘
```

### After (3-button layout - AllTrails style):
```
┌────────────┬─────┬────────────┐
│   Walks    │     │  History   │
│    👢👢    │ 📷  │    📋     │
└────────────┴─────┴────────────┘
              ↑
         Elevated 30px
```

**Key Differences:**
- Fewer tabs (2 vs 4) = simpler, more focused
- Larger capture button (70px vs 60px) = more prominent
- Higher elevation (30px vs 20px) = more dramatic effect
- Profile/Settings moved to header = cleaner bottom bar
- History is default view = content-first approach

## User Flow Updates

### Quick Capture
1. From any screen: Tap center button
2. Modal opens with 3 options
3. Select mode and capture
4. Return to previous screen

### Start Walk
1. Tap "Walks" tab
2. View "Start New Walk" card
3. Tap "Start Walk" button
4. Walk session begins with automatic detection
5. Return to History tab to see results

### View History
1. Default view is History tab
2. Scroll through image grid
3. Tap image to see full details
4. Filter/search if needed

### Access Settings
1. From any main screen
2. Tap settings icon (top right)
3. Settings screen opens
4. Use back arrow to return

## Performance Considerations

### Image Grid (History)
- Lazy loading: Load images as user scrolls
- Thumbnail optimization: 300x300px max
- Caching: Cache images locally
- Pagination: Load 20 items at a time
- Pull to refresh: Reload latest

### Bottom Navigation
- No re-renders on tab switch (optimized with React.memo)
- Smooth animations (60 FPS)
- Native driver for animations

### Center Button
- Pulsing animation only when active
- Stop animation when not visible
- Efficient gradient rendering

## Accessibility

### Bottom Navigation
- Tab labels: "Walks", "History"
- Capture button: "Capture species"
- Accessibility hints for each tab
- Support for screen readers

### Top Header
- Back button: "Go back"
- Settings: "Open settings"
- Profile: "View profile"

### Image Grid
- Alt text for each species image
- Semantic labels for cards
- Touch targets at least 44x44px

## Summary

This redesign follows AllTrails' proven UX pattern:
- **Simplicity**: 2 tabs instead of 5
- **Focus**: Capture button is the hero
- **Content-first**: History is the default view
- **Clean**: Settings/Profile moved to header
- **Intuitive**: Walk tracking has dedicated tab

The result is a cleaner, more focused app that puts AI identification front and center while maintaining easy access to walks and history.

---

**Estimated Implementation Time:** 4-6 hours
**Complexity:** Medium
**Priority:** HIGH
**Dependencies:** None (can start immediately)
