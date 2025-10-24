# N8ture AI App - Complete Workflow Understanding

## Overview
Based on comprehensive review of WildID_MVP_PRD.md, WildID_User_Flow.md, and WildID_Implementation_Guide.md

---

## 1. Complete User Journey: Photo → Identification → History

### Step 1: User Takes Photo
```
User taps center CAPTURE button
    ↓
CameraScreen opens (full-screen viewfinder)
    ↓
User points camera at plant/animal/fungi
    ↓
App auto-focuses and shows guide overlay
    ↓
User taps capture button
    ↓
Photo is taken + GPS coordinates captured (if location permission granted)
```

**Key Details:**
- Camera access required (permission)
- Location access optional (for GPS logging)
- Photo stored locally with unique URI
- GPS: latitude & longitude captured at moment of photo

---

### Step 2: AI Identification Processing

```
Photo captured
    ↓
Processing screen shown (2-3 seconds)
- Loading animation
- "Identifying..." text
- Optional: "Did you know?" facts
    ↓
Image + prompt sent to Gemini Vision API via Firebase Cloud Function
    ↓
Gemini analyzes and returns:
- Common name
- Scientific name
- Family
- Category (plant/wildlife/fungi/insect)
- Safety level (safe/caution/dangerous/unknown)
- Confidence score (0-100%)
- Description
- Similar species (2-3 alternatives)
```

**API Integration:**
- **Endpoint**: Firebase Cloud Function → Gemini Vision API
- **Input**: Base64 encoded image + prompt
- **Prompt**: "Identify this species. Provide: common name, scientific name, category, safety level, and confidence score."
- **Response Time**: Target < 3 seconds

---

### Step 3: Results Display

```
┌─────────────────────────────────┐
│                                 │
│      [Species Photo]            │
│                                 │
│   ⚠️ SAFETY: EDIBLE 🟢          │
│                                 │
│   Eastern Wild Ginger           │
│   Asarum canadense              │
│   Family: Aristolochiaceae      │
│                                 │
│   Confidence: 94%               │
│                                 │
│   [Save] [Share] [Learn More]   │
│                                 │
│   Description:                  │
│   A low-growing perennial...    │
│   (100 words for free users)    │
│                                 │
│   Similar Species ↓             │
│   ┌────┐ ┌────┐ ┌────┐         │
│   │Img1│ │Img2│ │Img3│         │
│   └────┘ └────┘ └────┘         │
│                                 │
└─────────────────────────────────┘
```

**Safety Indicator Legend:**
- 🟢 **Green**: Safe/Edible
- 🟡 **Yellow**: Caution/Conditional
- 🔴 **Red**: Dangerous/Poisonous
- ⚪ **Gray**: Unknown/Insufficient data

**User Actions:**
1. **Save** → Add to identification history with GPS data
2. **Share** → Share identification with friends
3. **Learn More** → Navigate to Species Detail Screen (see Step 4)

---

### Step 4: Species Detail Screen (with Carousel)

Accessed by tapping "Learn More" on Results Screen or tapping a history item.

```
┌─────────────────────────────────┐
│                                 │
│   ← Back        Species Detail  │
│                                 │
│   ┌───────────────────────┐    │
│   │                       │    │
│   │   Image Carousel      │    │
│   │   ● ○ ○ ○ ○          │    │  ← Swipeable
│   │                       │    │
│   └───────────────────────┘    │
│                                 │
│   Common Name                   │
│   Scientific Name               │
│                                 │
│   ┌─────────────────────────┐  │
│   │ Tabs:                   │  │
│   │ [Overview] Habitat Safety│ │
│   └─────────────────────────┘  │
│                                 │
│   Tab Content:                  │
│   • Detailed description        │
│   • Habitat information         │
│   • Seasonal availability       │
│   • Edibility details           │
│   • Medicinal uses              │
│   • Conservation status         │
│   • Fun facts                   │
│                                 │
│   📍 Location Map (if GPS data) │
│   [Mini map showing where found]│
│                                 │
└─────────────────────────────────┘
```

**Tabs:**
1. **Overview** - Detailed description, characteristics
2. **Identification Tips** - How to identify, key features
3. **Safety & Edibility** - Toxicity, preparation methods, warnings
4. **Habitat & Range** - Where it grows, distribution map, seasonal data
5. **Similar Species** - Comparison with look-alikes

**Premium vs Free:**
- **Free**: Basic info (100 words), 1 image
- **Premium**: Full info (500+ words), multiple images, maps, audio (for birds)

---

### Step 5: Save to History with GPS Data

When user taps "Save" on Results Screen:

```
Save button pressed
    ↓
Create IdentificationHistory entry
    ↓
Database Record:
{
  id: "uuid-12345",
  speciesId: "species-67890",
  imageUri: "/storage/photos/photo-12345.jpg",
  confidence: 0.94,
  latitude: 51.5074,           ← GPS from photo capture
  longitude: -0.1278,          ← GPS from photo capture
  timestamp: 1735084800000,
  isPremium: 0,               ← 0 = free, 1 = premium
  notes: ""                   ← Optional user notes
}
    ↓
Photo copied to persistent storage
    ↓
Thumbnail generated for History grid
    ↓
Success message: "Saved to History"
    ↓
Navigate back to History screen
```

**Storage:**
- **Photo**: Stored in app's document directory
- **Thumbnail**: Generated (4:5 aspect ratio for grid)
- **GPS**: Stored as decimal degrees (e.g., 51.5074, -0.1278)
- **Species Data**: Cached locally for offline access

---

### Step 6: View History

```
┌─────────────────────────────────┐
│  ← History                   ⚙️👤│
│                                 │
│   ┌──────┐  ┌──────┐           │
│   │ 📷  │  │ 📷  │           │  ← 2-column grid
│   │ 94% │  │ 87% │           │  ← Confidence badge
│   │     │  │     │           │
│   │Name1│  │Name2│           │
│   │Lat/Long│ │Lat/Long│      │  ← GPS coordinates
│   │Date │  │Date │           │
│   └──────┘  └──────┘           │
│                                 │
│   ┌──────┐  ┌──────┐           │
│   │ 🎵  │  │ 📷  │           │  ← Type: audio/photo
│   │ 76% │  │ 92% │           │
│   │     │  │     │           │
│   │Name3│  │Name4│           │
│   │Lat/Long│ │Lat/Long│      │
│   │Date │  │Date │           │
│   └──────┘  └──────┘           │
│                                 │
│   [Load More] (Premium only)    │
│                                 │
└─────────────────────────────────┘
```

**Tap Behavior:**
- Tap history card → Navigate to Species Detail Screen
- Shows full species info with carousel
- Displays GPS location on map
- Shows all saved notes

**Free vs Premium:**
- **Free**: Last 10 identifications
- **Premium**: Unlimited history

---

## 2. Database Schema

### Species Table
```sql
CREATE TABLE Species (
    id TEXT PRIMARY KEY NOT NULL,
    commonName TEXT NOT NULL,
    scientificName TEXT NOT NULL,
    family TEXT,
    category TEXT NOT NULL,          -- plant, wildlife, fungi, insect
    safetyLevel TEXT NOT NULL,        -- safe, caution, dangerous, unknown
    description TEXT,
    imageUrl TEXT,
    detailedInfo TEXT,                -- JSON for premium content
    lastUpdated INTEGER NOT NULL
);
```

### IdentificationHistory Table
```sql
CREATE TABLE IdentificationHistory (
    id TEXT PRIMARY KEY NOT NULL,
    speciesId TEXT NOT NULL,
    imageUri TEXT NOT NULL,           -- Local photo path
    confidence REAL NOT NULL,          -- 0.0 to 1.0
    latitude REAL,                     -- GPS: -90 to 90
    longitude REAL,                    -- GPS: -180 to 180
    timestamp INTEGER NOT NULL,        -- Unix timestamp
    isPremium INTEGER NOT NULL DEFAULT 0,
    notes TEXT,                        -- User-added notes
    FOREIGN KEY (speciesId) REFERENCES Species(id)
);
```

---

## 3. Current Implementation Status

### ✅ Implemented (Phases 1-8)
- [x] Clerk Authentication with trial system
- [x] Camera integration (CameraScreen)
- [x] Audio recording (AudioRecordingScreen)
- [x] AllTrails-style bottom navigation (2-tab)
- [x] HistoryScreen with 2-column grid
- [x] HistoryCard component (image, badges, details)
- [x] AppHeader component
- [x] Paywall screen with subscription UI
- [x] Trial management (3 free identifications)
- [x] Basic Gemini API integration

### ❌ Missing Critical Features (PRD Requirements)

#### 1. GPS Coordinate Capture ❌
- **Status**: Database schema exists but not implemented
- **Required**: Capture latitude/longitude when photo is taken
- **Files to modify**:
  - `src/screens/CameraScreen.tsx` - Add location capture
  - `src/hooks/useLocation.ts` - NEW: Location hook
  - `src/types/identification.ts` - Add GPS fields

#### 2. Save to History with Photo ❌
- **Status**: HistoryScreen shows mock data only
- **Required**: Save actual identifications with photos and GPS
- **Files to create/modify**:
  - `src/services/identificationService.ts` - NEW: Save/load history
  - `src/hooks/useIdentificationHistory.ts` - NEW: History management
  - `src/screens/ResultsScreen.tsx` - Add Save functionality

#### 3. Species Detail Screen with Carousel ❌
- **Status**: Not implemented
- **Required**: Full species info with image carousel and tabs
- **Files to create**:
  - `src/screens/SpeciesDetailScreen.tsx` - NEW: Main screen
  - `src/components/species/ImageCarousel.tsx` - NEW: Swipeable carousel
  - `src/components/species/SpeciesTabs.tsx` - NEW: Tabbed content

#### 4. Integration with Real Gemini API ❌
- **Status**: Mock responses only
- **Required**: Call Gemini Vision API for identifications
- **Files to modify**:
  - `src/services/geminiService.ts` - Implement real API calls
  - Firebase Cloud Functions - Create API endpoint

#### 5. Location Map Display ❌
- **Status**: Not implemented
- **Required**: Show GPS location on map in detail screen
- **Files to create**:
  - `src/components/map/LocationMap.tsx` - NEW: Map component
  - May need: react-native-maps or expo-location map view

---

## 4. Implementation Priorities (Next Phase)

### Phase 9: Species Detail Screen + Carousel (CRITICAL)
**Estimated Time**: 20 hours

**Components to Create:**
1. `SpeciesDetailScreen.tsx` - Main container
2. `ImageCarousel.tsx` - Swipeable image carousel with dots indicator
3. `SpeciesTabs.tsx` - Tab navigation (Overview, Habitat, Safety, Similar)
4. `SpeciesOverviewTab.tsx` - Description, characteristics
5. `SpeciesSafetyTab.tsx` - Edibility, warnings, preparation
6. `SpeciesHabitatTab.tsx` - Range, season, distribution
7. `SpeciesSimilarTab.tsx` - Look-alike species comparison

**Navigation:**
- From ResultsScreen → "Learn More" button
- From HistoryScreen → Tap history card
- Pass `speciesId` and `speciesName` as params

---

### Phase 10: GPS Coordinate Capture (HIGH PRIORITY)
**Estimated Time**: 8 hours

**Implementation:**
1. Request location permission in onboarding
2. Create `useLocation` hook with expo-location
3. Capture GPS when photo is taken
4. Store latitude/longitude with identification
5. Display coordinates on HistoryCard
6. Show location on map in SpeciesDetailScreen

**Libraries:**
- expo-location (already in project)
- Optional: react-native-maps for map display

---

### Phase 11: Save to History (HIGH PRIORITY)
**Estimated Time**: 12 hours

**Implementation:**
1. Create `identificationService.ts` for CRUD operations
2. Create `useIdentificationHistory` hook
3. Implement photo storage (copy to app documents)
4. Generate thumbnails for grid display
5. Add "Save" button to ResultsScreen
6. Update HistoryScreen to load real data
7. Implement delete functionality

**Storage:**
- Use FileSystem API (expo-file-system)
- Store photos in app's document directory
- Use AsyncStorage or SQLite for metadata

---

### Phase 12: Real Gemini API Integration (CRITICAL)
**Estimated Time**: 16 hours

**Implementation:**
1. Set up Firebase Cloud Function
2. Implement image upload to Firebase Storage
3. Call Gemini Vision API with image URL
4. Parse API response into Species model
5. Handle errors gracefully
6. Implement retry logic
7. Add loading states

---

## 5. Data Flow Diagram

```
[User]
   ↓ (Takes Photo)
[CameraScreen]
   ↓ (Captures: Image + GPS)
[Processing]
   ↓ (Upload to Firebase)
[Firebase Cloud Function]
   ↓ (Call Gemini API)
[Gemini Vision API]
   ↓ (Returns: Species Data)
[ResultsScreen]
   ↓ (User taps Save)
[IdentificationService]
   ↓ (Store: Photo + GPS + Data)
[Local Database + FileSystem]
   ↓
[HistoryScreen]
   ↓ (User taps item)
[SpeciesDetailScreen]
   ↓ (Shows: Carousel + Tabs + Map)
```

---

## 6. Key User Flows

### Flow 1: First-Time User (Trial)
```
Open App → Onboarding → Grant Camera Permission → Grant Location Permission
→ See Home (Trial: 3/3) → Tap CAPTURE → Point at plant → Take photo
→ See results → Save to history → Trial: 2/3 → Continue exploring
```

### Flow 2: Viewing History
```
Open App → Tap History tab → See 2-column grid → Tap species card
→ See Species Detail Screen → Swipe carousel → Read tabs → View map location
```

### Flow 3: Trial Exhausted
```
Use 3rd identification → See results → Try another → Paywall appears
→ Choose: Upgrade or Continue Limited → If Continue: Can view history only
```

---

## 7. Success Metrics

### User Engagement
- **Trial Completion**: 60% use all 3 identifications
- **Save Rate**: 70% save at least one identification
- **Return Rate**: 40% open app again within 7 days

### Technical Performance
- **Identification Speed**: < 3 seconds (camera to result)
- **GPS Accuracy**: Within 10 meters
- **Photo Storage**: Efficient compression (< 500KB per photo)
- **History Load Time**: < 1 second for 100 entries

### Conversion
- **Trial to Paid**: 25% of trial completers upgrade
- **Location Permission**: 70% grant location access

---

## 8. Open Questions

1. **Offline Mode**: How should GPS work offline? Cache last known location?
2. **Photo Quality**: What resolution for storage vs display?
3. **History Sync**: Should history sync across devices (Firebase)?
4. **Export**: Should users be able to export GPS data (CSV/KML)?
5. **Privacy**: How to handle location data privacy and consent?

---

## Next Steps

1. **Review this document** with team for accuracy
2. **Prioritize Phase 9** (Species Detail Screen) as critical blocker
3. **Plan GPS implementation** (Phase 10) in parallel
4. **Design database migrations** if needed for production
5. **Create detailed UI mockups** for Species Detail Screen carousel

---

**Document Created**: 2025-10-24
**Based On**: WildID_MVP_PRD.md, WildID_User_Flow.md, WildID_Implementation_Guide.md
**Status**: Ready for Implementation Planning
