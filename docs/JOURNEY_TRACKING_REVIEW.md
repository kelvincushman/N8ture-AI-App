# Journey Tracking System - Phase 2 Review
## Current Progress & Architecture Overview

**Date:** 2025-10-08
**Status:** Domain Models Complete - Ready for Repository & UI Implementation

---

## 🎯 What We're Building

A comprehensive **journey tracking system** that allows users to:
1. **Track walks** with GPS in real-time
2. **Record route paths** with elevation and speed data
3. **Add discoveries** (photos and audio) along the route
4. **View statistics** (distance, duration, elevation gain)
5. **Build a timeline** of their nature experiences
6. **Share journeys** with others

---

## ✅ Completed: Domain Models (`Journey.kt`)

### Core Data Structures Created:

#### 1. **Journey Model**
Main model representing a tracked walk/hike:

```kotlin
data class Journey(
    val id: String,
    val userId: String,
    val title: String = "Nature Walk",
    val startTime: Instant,
    val endTime: Instant?,
    val status: JourneyStatus,          // ACTIVE, PAUSED, COMPLETED, CANCELLED
    val route: List<GeoPoint>,          // GPS points
    val stats: JourneyStats,            // Computed statistics
    val discoveries: List<String>,      // Photo/audio discovery IDs
    val weather: WeatherSnapshot?,      // Weather at start
    val isPublic: Boolean = false,
    val shareUrl: String?
)
```

**Key Methods:**
- `isActive()` - Check if tracking
- `getDuration()` - Calculate total time
- `getFormattedDuration()` - "2h 45m" format
- `getDiscoveryCount()` - Number of species found

#### 2. **GeoPoint Model**
GPS coordinate with metadata:

```kotlin
data class GeoPoint(
    val latitude: Double,
    val longitude: Double,
    val altitude: Double?,              // Elevation in meters
    val accuracy: Float?,               // GPS accuracy
    val timestamp: Instant,
    val speed: Float?,                  // m/s
    val bearing: Float?                 // Direction in degrees
)
```

**Key Methods:**
- `distanceTo(other)` - Haversine distance calculation
- `isWithinBounds(bounds)` - Check if point in area

#### 3. **JourneyStats Model**
Computed statistics from route:

```kotlin
data class JourneyStats(
    val distanceMeters: Double,
    val durationMillis: Long,
    val elevationGainMeters: Double?,   // Total climb
    val elevationLossMeters: Double?,   // Total descent
    val maxElevationMeters: Double?,
    val minElevationMeters: Double?,
    val avgSpeedMps: Double?,           // Average speed m/s
    val maxSpeedMps: Double?,           // Max speed m/s
    val discoveryCount: Int,
    val photoCount: Int,
    val audioCount: Int,
    val pauseDurationMillis: Long       // Time paused
)
```

**Key Methods:**
- `getDistanceKm()` / `getDistanceMiles()` - Unit conversions
- `getFormattedDistance(useMetric)` - "5.2 km" or "3.2 mi"
- `getFormattedDuration()` - "2h 45m" format
- `getAvgSpeedKmh()` - Speed in km/h
- `getActiveDuration()` - Duration minus pauses

**Static Factory:**
- `fromRoute(route, discoveries)` - Auto-calculate all stats from GPS points

#### 4. **Discovery Model**
Photos or audio recordings during journey:

```kotlin
data class Discovery(
    val id: String,
    val journeyId: String?,
    val type: DiscoveryType,            // PHOTO_PLANT, AUDIO_BIRD, etc.
    val timestamp: Instant,
    val location: GeoPoint,             // Where it was found
    val mediaUrl: String,               // File path/URL
    val identificationResult: IdentificationResult?,
    val userNotes: String?,
    val isFavorite: Boolean,
    val tags: List<String>
)
```

**DiscoveryType Enum:**
- `PHOTO_PLANT` 🌿
- `PHOTO_WILDLIFE` 🦌
- `PHOTO_FUNGI` 🍄
- `AUDIO_BIRD` 🦜
- `AUDIO_MAMMAL` 🐾
- `AUDIO_INSECT` 🐛
- `MANUAL_OBSERVATION` 📝

**Key Methods:**
- `getSpeciesName()` - Extracted from identification
- `isConfident()` - Check if AI confidence > 70%
- `getTypeIcon()` - Emoji for discovery type

#### 5. **Supporting Models**

**GeoBounds** - Map viewport:
```kotlin
data class GeoBounds(
    val north: Double,
    val south: Double,
    val east: Double,
    val west: Double
)
```
- `getCenter()` - Center point
- `expand(point)` - Include new point in bounds
- `fromPoints(points)` - Create bounds from GPS track

**WeatherSnapshot** - Weather conditions:
```kotlin
data class WeatherSnapshot(
    val temperature: Double,            // Celsius
    val condition: WeatherCondition,    // CLEAR, RAIN, etc.
    val humidity: Int?,
    val windSpeed: Double?,
    val timestamp: Instant
)
```

**WeatherCondition Enum:**
- ☀️ CLEAR
- ⛅ PARTLY_CLOUDY
- ☁️ CLOUDY
- 🌧️ RAIN
- ⛈️ HEAVY_RAIN
- ❄️ SNOW
- 🌫️ FOG
- 💨 WIND

**JourneyWaypoint** - Named points of interest:
```kotlin
data class JourneyWaypoint(
    val id: String,
    val journeyId: String,
    val location: GeoPoint,
    val title: String,                  // "Beautiful Vista"
    val description: String?,
    val icon: String = "📍",
    val timestamp: Instant
)
```

---

## 🏗️ Architecture Design

### Data Flow
```
User Actions (Start/Pause/Stop Journey)
    ↓
JourneyViewModel
    ↓
JourneyRepository
    ↓
┌────────────────┬────────────────┐
│                │                │
LocationManager  Room Database   RemoteAPI (optional)
(GPS tracking)   (local storage) (cloud backup)
```

### Location Tracking Flow
```
Platform-Specific LocationManager (expect/actual)
    ↓
Emits GeoPoint updates every 5 seconds
    ↓
JourneyRepository collects points
    ↓
Calculates stats using JourneyStats.fromRoute()
    ↓
Updates UI via StateFlow
```

### Discovery Addition Flow
```
User takes photo OR records audio
    ↓
Camera/AudioScreen captures media
    ↓
AI identifies species
    ↓
Creates Discovery with location (current GeoPoint)
    ↓
Adds to Journey.discoveries list
    ↓
Saves to Room + displays on map
```

---

## 📊 Use Cases

### 1. Start Journey
```kotlin
// User taps "Start Journey" button
journeyRepository.startJourney(userId)
    ↓
Creates new Journey with status = ACTIVE
    ↓
Starts LocationManager.startTracking()
    ↓
Emits GeoPoints to JourneyRepository
    ↓
UI updates with real-time distance/duration
```

### 2. Add Discovery
```kotlin
// User takes photo during journey
1. Capture photo with camera
2. Get current GeoPoint from LocationManager
3. Call AI identification API
4. Create Discovery with result
5. journeyRepository.addDiscovery(journeyId, discovery)
6. Display marker on map + update timeline
```

### 3. Pause/Resume Journey
```kotlin
// User pauses to rest
journeyRepository.pauseJourney(journeyId)
    ↓
Sets status = PAUSED
    ↓
LocationManager.stopTracking()
    ↓
Tracks pause duration
    ↓
Resume button → Sets status = ACTIVE → LocationManager.startTracking()
```

### 4. Complete Journey
```kotlin
// User finishes walk
journeyRepository.endJourney(journeyId)
    ↓
Sets status = COMPLETED
    ↓
Sets endTime = now
    ↓
Calculates final JourneyStats
    ↓
Stops LocationManager
    ↓
Saves to Room database
    ↓
Shows journey summary screen
```

---

## 🎨 UI Screens Needed

### 1. Active Journey Screen
```
┌─────────────────────────────┐
│  N8ture Journey             │
│  ◀ Stop    Oak Trail  🔊 ⚙️ │
├─────────────────────────────┤
│                             │
│      [LIVE MAP VIEW]        │
│   ┌─────────────────────┐  │
│   │  Your route here    │  │
│   │  🔵 Current location│  │
│   │  📍 Start marker    │  │
│   │  🌿 Discovery pins  │  │
│   └─────────────────────┘  │
│                             │
├─────────────────────────────┤
│  📊 Stats                   │
│  📍 5.2 km    🕐 1h 45m    │
│  ⛰️ 234m gain  🦜 3 species│
├─────────────────────────────┤
│  Recent Discoveries         │
│  🦜 Robin (5 min ago)      │
│  🌸 Bluebell (12 min ago)  │
└─────────────────────────────┘
│                             │
│  [🎵] [📷] [➕] [⏸️]       │
│  Audio Photo Note Pause     │
└─────────────────────────────┘
```

### 2. Journey Summary Screen
```
┌─────────────────────────────┐
│  Oak Forest Trail ✏️        │
│  Oct 8, 2025 • 10:00 AM     │
├─────────────────────────────┤
│  [MAP WITH COMPLETE ROUTE]  │
│                             │
├─────────────────────────────┤
│  📊 Statistics              │
│  📍 Distance: 5.2 km        │
│  🕐 Duration: 1h 45m        │
│  ⛰️ Elevation: +234m        │
│  🏃 Avg Speed: 3.0 km/h     │
│  🌡️ Weather: 18°C, Sunny   │
├─────────────────────────────┤
│  🔍 Discoveries (5)         │
│  [Timeline with photos/audio]│
│                             │
│  [Share] [Export] [Delete]  │
└─────────────────────────────┘
```

### 3. Journey History Screen
```
┌─────────────────────────────┐
│  My Journeys                │
│  🔍 Search  🗂️ Filter       │
├─────────────────────────────┤
│  This Week                  │
│                             │
│  📍 Oak Forest Trail        │
│  5.2 km • 3 species         │
│  Yesterday, 10:00 AM        │
│                             │
│  📍 Mountain Ridge          │
│  8.7 km • 7 species         │
│  3 days ago, 8:30 AM        │
│                             │
│  Last Month                 │
│                             │
│  📍 Coastal Walk            │
│  3.4 km • 4 species         │
│  Oct 1, 2025                │
└─────────────────────────────┘
```

---

## 🔧 Next Implementation Steps

### Phase 2A: Repository & Use Cases (Next)
1. **Create JourneyRepository**
   - `startJourney(userId)`
   - `pauseJourney(journeyId)`
   - `resumeJourney(journeyId)`
   - `endJourney(journeyId)`
   - `addDiscovery(journeyId, discovery)`
   - `getActiveJourney(userId)`
   - `getJourneyHistory(userId)`

2. **Create LocationManager Interface** (expect/actual)
   ```kotlin
   interface LocationManager {
       fun startTracking(callback: (GeoPoint) -> Unit)
       fun stopTracking()
       fun getCurrentLocation(): GeoPoint?
       fun isTrackingEnabled(): Boolean
   }
   ```

3. **Create Room Database Entities**
   - `JourneyEntity`
   - `GeoPointEntity`
   - `DiscoveryEntity`
   - `JourneyDao`

### Phase 2B: Platform-Specific Location (After Repository)
1. **Android: `LocationManagerImpl.android.kt`**
   - FusedLocationProviderClient
   - LocationRequest configuration
   - Permission handling

2. **iOS: `LocationManagerImpl.ios.kt`**
   - CLLocationManager
   - Authorization handling
   - Background location (optional)

### Phase 2C: Map Integration (After Location)
1. **Choose Map Provider:**
   - Option A: Google Maps (paid, familiar)
   - Option B: Mapbox (flexible, cheaper)
   - Option C: OpenStreetMap (free, privacy-focused)

2. **Map Composable**
   - Display route polyline
   - Current location marker
   - Discovery markers
   - Zoom to bounds
   - Interactive markers (tap to see details)

### Phase 2D: UI Screens (After Map)
1. Active Journey Screen
2. Journey Summary Screen
3. Journey History Screen
4. Discovery Detail Screen (from map pin)

---

## 💡 Smart Features We Can Add

### Statistics & Insights
- **Achievements**: "Longest journey", "Highest elevation", "Most discoveries"
- **Trends**: "You've walked 50km this month!"
- **Heatmap**: Areas you explore most
- **Species diversity**: "15 unique species this week"

### Social Features
- **Share journey URL**: View-only link with map
- **Export GPX**: For import into Strava, AllTrails
- **Photo gallery**: Journey as photo album
- **Community**: See popular trails nearby

### Smart Recommendations
- **"Continue last journey"**: Pick up where you left off
- **"Similar trails nearby"**: Based on past journeys
- **"Best time for birdwatching"**: Based on your discoveries
- **"Weather perfect for hiking"**: Push notification

---

## 🎯 Integration with Existing Features

### Onboarding Connection
```kotlin
// From Phase 1 onboarding:
val userEnvironments = userPreferencesRepository.getFavoriteEnvironments()

// Suggest journeys based on environments:
when (userEnvironments) {
    contains(Environment.FORESTS) -> suggestForestTrails()
    contains(Environment.COASTLINES) -> suggestBeachWalks()
    contains(Environment.MOUNTAINS) -> suggestHikingTrails()
}
```

### Trial System Connection
```kotlin
// Free tier: 1 journey per session (max 1 hour)
// Premium: Unlimited journeys, unlimited duration

val trialState = trialManager.getTrialState()
if (!user.isPremium && journey.getDuration() > 1.hours) {
    showPaywallScreen("Upgrade for unlimited journey tracking")
}
```

### Discovery Integration
```kotlin
// When user takes photo during journey:
val currentLocation = locationManager.getCurrentLocation()
val discovery = Discovery(
    journeyId = activeJourney.id,
    location = currentLocation,
    type = DiscoveryType.PHOTO_PLANT,
    // ... AI identification
)

journeyRepository.addDiscovery(activeJourney.id, discovery)
```

---

## 📐 Database Schema

### Room Tables

**journeys**
```sql
CREATE TABLE journeys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time INTEGER NOT NULL,
    end_time INTEGER,
    status TEXT NOT NULL,
    distance_meters REAL,
    duration_millis INTEGER,
    elevation_gain REAL,
    discovery_count INTEGER,
    is_public INTEGER,
    share_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
```

**geo_points**
```sql
CREATE TABLE geo_points (
    id TEXT PRIMARY KEY,
    journey_id TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    altitude REAL,
    accuracy REAL,
    timestamp INTEGER NOT NULL,
    speed REAL,
    bearing REAL,
    FOREIGN KEY(journey_id) REFERENCES journeys(id)
)
```

**discoveries**
```sql
CREATE TABLE discoveries (
    id TEXT PRIMARY KEY,
    journey_id TEXT,
    type TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    species_id TEXT,
    confidence REAL,
    is_favorite INTEGER,
    FOREIGN KEY(journey_id) REFERENCES journeys(id),
    FOREIGN KEY(species_id) REFERENCES species(id)
)
```

---

## ⚡ Performance Considerations

### GPS Tracking
- **Update frequency**: 5 seconds (balance battery vs accuracy)
- **Accuracy threshold**: 20 meters (filter inaccurate points)
- **Distance filter**: 10 meters (reduce redundant points)
- **Battery optimization**: Use significant location changes when paused

### Data Storage
- **Point compression**: Store every ~20m of movement (not every 5 sec)
- **Photo compression**: Thumbnail for map, full res for detail view
- **Audio compression**: AAC format, 128kbps max
- **Old journey archival**: Move to cloud after 30 days

### Map Rendering
- **Polyline simplification**: Douglas-Peucker algorithm for route
- **Marker clustering**: Cluster nearby discoveries
- **Lazy loading**: Load route segments as user zooms
- **Caching**: Cache map tiles for offline

---

## 🧪 Testing Strategy

### Unit Tests
- `GeoPoint.distanceTo()` - Verify Haversine accuracy
- `JourneyStats.fromRoute()` - Test stat calculations
- `GeoBounds.fromPoints()` - Verify bounds calculation
- `Discovery.isConfident()` - Test confidence threshold

### Integration Tests
- Start → Pause → Resume → Stop journey flow
- Add discovery during active journey
- Calculate stats from real GPS data
- Database persistence and retrieval

### Manual Tests
- Walk with app for 30 min, verify accuracy
- Test in areas with poor GPS (forests, canyons)
- Test battery drain over 2-hour journey
- Verify offline functionality

---

## 🚀 Ready to Proceed?

**Current Status:** ✅ Domain models complete (450 lines)

**Next Phase Options:**

1. **Continue Phase 2A** - Repository & Use Cases
2. **Skip to Phase 2C** - Map integration first (visual progress)
3. **Build Phase 2D** - UI screens first (see the vision)

**My Recommendation:** Continue with **Phase 2A** (Repository) as it's the foundation for everything else. Once we have the repository, we can quickly add the UI and see it come to life!

What would you like to do next? 🎯
