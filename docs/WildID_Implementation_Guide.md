# WildID Implementation Guide
## Kotlin Multiplatform Integration for Freemium MVP

---

## 1. Quick Start Checklist

### 1.1 Immediate Actions Required
- [ ] Set up Google Gemini API key for AI identification
- [ ] Configure Firebase project for backend services
- [ ] Implement trial counter in SharedPreferences/UserDefaults
- [ ] Modify PaywallScreen.kt for freemium model
- [ ] Add camera permissions handling
- [ ] Create identification history database

---

## 2. Code Structure Modifications

### 2.1 Update Package Structure
```
com.measify.kappmaker/
├── data/
│   ├── local/
│   │   ├── TrialManager.kt          // NEW: Manage trial count
│   │   ├── SpeciesDatabase.kt       // NEW: Local species cache
│   │   └── IdentificationHistory.kt // NEW: User history
│   ├── remote/
│   │   ├── GeminiApiService.kt      // NEW: AI integration
│   │   └── SpeciesApiService.kt     // NEW: Species data
│   └── repository/
│       ├── IdentificationRepository.kt
│       └── SubscriptionRepository.kt
├── domain/
│   ├── model/
│   │   ├── Species.kt                // NEW: Species model
│   │   ├── IdentificationResult.kt   // NEW: Result model
│   │   └── TrialState.kt            // NEW: Trial status
│   └── usecase/
│       ├── IdentifySpeciesUseCase.kt
│       ├── CheckTrialStatusUseCase.kt
│       └── ProcessImageUseCase.kt
├── presentation/
│   ├── screens/
│   │   ├── camera/                  // NEW: Camera screen
│   │   ├── identification/          // NEW: Results screen
│   │   ├── species/                 // NEW: Species details
│   │   └── trial/                   // NEW: Trial management
│   └── components/
│       ├── TrialCounter.kt          // NEW: Trial UI
│       └── SafetyIndicator.kt       // NEW: Safety badges
```

### 2.2 Key File Implementations

#### TrialManager.kt
```kotlin
// composeApp/src/commonMain/kotlin/com/measify/kappmaker/data/local/TrialManager.kt

class TrialManager {
    companion object {
        private const val KEY_TRIAL_COUNT = "trial_count"
        private const val KEY_FIRST_USE = "first_use_timestamp"
        private const val MAX_TRIAL_COUNT = 3
    }
    
    fun getRemainingTrials(): Int {
        // Get from SharedPreferences/UserDefaults
        return preferences.getInt(KEY_TRIAL_COUNT, MAX_TRIAL_COUNT)
    }
    
    fun useTrialIdentification(): Boolean {
        val remaining = getRemainingTrials()
        if (remaining > 0) {
            preferences.putInt(KEY_TRIAL_COUNT, remaining - 1)
            return true
        }
        return false
    }
    
    fun isTrialExpired(): Boolean {
        return getRemainingTrials() <= 0
    }
}
```

#### Modified PaywallScreen.kt
```kotlin
// Update existing PaywallScreen.kt

@Composable
fun PaywallScreen(
    trialState: TrialState,
    onSubscribe: (SubscriptionPlan) -> Unit,
    onContinueLimited: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        if (trialState.isExpired) {
            Text(
                text = "You've used all ${trialState.maxTrials} free identifications",
                style = MaterialTheme.typography.h6,
                textAlign = TextAlign.Center
            )
        }
        
        // Benefits List
        BenefitsList()
        
        // Subscription Options
        SubscriptionOptions(
            monthlyPrice = "$4.99",
            yearlyPrice = "$39.99",
            onSelectPlan = onSubscribe
        )
        
        // Continue Limited
        TextButton(onClick = onContinueLimited) {
            Text("Continue with limited access")
        }
    }
}
```

#### CameraScreen.kt (New)
```kotlin
// composeApp/src/commonMain/kotlin/com/measify/kappmaker/presentation/screens/camera/CameraScreen.kt

@Composable
fun CameraScreen(
    navController: NavController,
    viewModel: CameraViewModel = hiltViewModel()
) {
    val permissionState = rememberCameraPermissionState()
    val trialState by viewModel.trialState.collectAsState()
    
    if (permissionState.status.isGranted) {
        CameraView(
            onImageCaptured = { imageUri ->
                if (trialState.canIdentify) {
                    viewModel.identifySpecies(imageUri)
                } else {
                    navController.navigate("paywall")
                }
            },
            trialCounter = if (!trialState.isPremium) {
                trialState.remainingTrials
            } else null
        )
    } else {
        PermissionRequest(
            onGranted = { permissionState.launchPermissionRequest() }
        )
    }
}
```

---

## 3. Database Schema

### 3.1 SQLDelight Schema
```sql
-- composeApp/src/commonMain/sqldelight/com/measify/kappmaker/database/WildID.sq

CREATE TABLE Species (
    id TEXT PRIMARY KEY NOT NULL,
    commonName TEXT NOT NULL,
    scientificName TEXT NOT NULL,
    family TEXT,
    category TEXT NOT NULL, -- plant, wildlife, fungi, insect
    safetyLevel TEXT NOT NULL, -- safe, caution, dangerous, unknown
    description TEXT,
    imageUrl TEXT,
    detailedInfo TEXT, -- JSON for premium content
    lastUpdated INTEGER NOT NULL
);

CREATE TABLE IdentificationHistory (
    id TEXT PRIMARY KEY NOT NULL,
    speciesId TEXT NOT NULL,
    imageUri TEXT NOT NULL,
    confidence REAL NOT NULL,
    latitude REAL,
    longitude REAL,
    timestamp INTEGER NOT NULL,
    isPremium INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (speciesId) REFERENCES Species(id)
);

CREATE TABLE UserPreferences (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);
```

---

## 4. API Integration

### 4.1 Google Gemini Integration
```kotlin
// composeApp/src/commonMain/kotlin/com/measify/kappmaker/data/remote/GeminiApiService.kt

class GeminiApiService {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json()
        }
    }
    
    suspend fun identifySpecies(imageBase64: String): IdentificationResult {
        val response = client.post("https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent") {
            header("Authorization", "Bearer $GEMINI_API_KEY")
            contentType(ContentType.Application.Json)
            setBody(
                GeminiRequest(
                    contents = listOf(
                        Content(
                            parts = listOf(
                                Part(text = "Identify this species. Provide: common name, scientific name, category (plant/wildlife/fungi/insect), safety level (safe/caution/dangerous), and confidence score."),
                                Part(inlineData = InlineData(
                                    mimeType = "image/jpeg",
                                    data = imageBase64
                                ))
                            )
                        )
                    )
                )
            )
        }
        return response.body()
    }
}
```

### 4.2 RevenueCat Integration (Subscriptions)
```kotlin
// build.gradle.kts
dependencies {
    implementation("com.revenuecat.purchases:purchases:7.0.0")
    implementation("com.revenuecat.purchases:purchases-ui:7.0.0")
}

// Initialize in App.kt
class WildIDApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Purchases.configure(
            PurchasesConfiguration.Builder(this, REVENUECAT_API_KEY)
                .build()
        )
    }
}
```

---

## 5. Platform-Specific Implementations

### 5.1 Android Camera Implementation
```kotlin
// composeApp/src/androidMain/kotlin/com/measify/kappmaker/camera/AndroidCameraView.kt

@Composable
actual fun CameraView(
    onImageCaptured: (Uri) -> Unit,
    trialCounter: Int?
) {
    val context = LocalContext.current
    val imageCapture = remember { ImageCapture.Builder().build() }
    
    AndroidView(
        factory = { ctx ->
            PreviewView(ctx).apply {
                implementationMode = PreviewView.ImplementationMode.COMPATIBLE
                scaleType = PreviewView.ScaleType.FILL_CENTER
            }
        },
        modifier = Modifier.fillMaxSize()
    )
    
    // Trial counter overlay
    trialCounter?.let {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 48.dp),
            contentAlignment = Alignment.TopCenter
        ) {
            Chip(
                onClick = { },
                colors = ChipDefaults.chipColors(
                    backgroundColor = MaterialTheme.colors.primary
                )
            ) {
                Text("$it free IDs remaining")
            }
        }
    }
}
```

### 5.2 iOS Camera Implementation
```swift
// iosApp/iosApp/Camera/CameraViewController.swift

class CameraViewController: UIViewController {
    var onImageCaptured: ((UIImage) -> Void)?
    var trialCounter: Int?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupCamera()
        setupTrialBadge()
    }
    
    private func setupTrialBadge() {
        guard let count = trialCounter else { return }
        
        let badge = UILabel()
        badge.text = "\(count) free IDs remaining"
        badge.backgroundColor = .systemGreen
        badge.textColor = .white
        badge.layer.cornerRadius = 8
        badge.clipsToBounds = true
        
        view.addSubview(badge)
        // Add constraints
    }
}
```

---

## 6. Testing Strategy

### 6.1 Unit Tests
```kotlin
// composeApp/src/commonTest/kotlin/com/measify/kappmaker/TrialManagerTest.kt

class TrialManagerTest {
    @Test
    fun testInitialTrialCount() {
        val manager = TrialManager()
        assertEquals(3, manager.getRemainingTrials())
    }
    
    @Test
    fun testUseTrialDecrementsCount() {
        val manager = TrialManager()
        assertTrue(manager.useTrialIdentification())
        assertEquals(2, manager.getRemainingTrials())
    }
    
    @Test
    fun testCannotUseExpiredTrial() {
        val manager = TrialManager()
        repeat(3) { manager.useTrialIdentification() }
        assertFalse(manager.useTrialIdentification())
        assertTrue(manager.isTrialExpired())
    }
}
```

---

## 7. Launch Configuration

### 7.1 Feature Flags
```kotlin
// composeApp/src/commonMain/kotlin/com/measify/kappmaker/util/FeatureFlags.kt

object FeatureFlags {
    const val TRIAL_COUNT = 3
    const val ENABLE_OFFLINE_MODE = false
    const val SHOW_ADS_IN_FREE = false
    const val MONTHLY_PRICE = 4.99
    const val YEARLY_PRICE = 39.99
    const val FREE_TRIAL_DAYS_YEARLY = 7
}
```

### 7.2 Analytics Events
```kotlin
// Track key events
Analytics.track("trial_started")
Analytics.track("trial_identification_used", mapOf("remaining" to count))
Analytics.track("trial_expired")
Analytics.track("paywall_shown", mapOf("trigger" to "trial_end"))
Analytics.track("subscription_started", mapOf("plan" to plan))
```

---

## 8. Deployment Steps

### Phase 1: Development (Week 1-2)
1. Set up development environment
2. Configure Firebase project
3. Implement trial system
4. Basic camera integration
5. Mock AI responses for testing

### Phase 2: Integration (Week 3-4)
1. Integrate Google Gemini API
2. Implement subscription system
3. Add species database
4. Test payment flows
5. Implement analytics

### Phase 3: Testing (Week 5)
1. Internal testing with TestFlight/Play Console
2. Fix critical bugs
3. Performance optimization
4. UI/UX refinements
5. Prepare marketing materials

### Phase 4: Launch (Week 6)
1. Submit to App Store/Play Store
2. Monitor initial metrics
3. Respond to user feedback
4. Plan first update
5. Marketing campaign

---

## 9. Post-Launch Optimization

### 9.1 A/B Tests to Run
1. Trial count: 3 vs 5 identifications
2. Paywall timing: Immediate vs delayed
3. Pricing: Test different price points
4. Onboarding: Short vs detailed

### 9.2 Metrics to Monitor
- Trial-to-paid conversion rate
- Day 1, 7, 30 retention
- Average revenue per user (ARPU)
- Identification accuracy feedback
- App store ratings

---

## 10. Resources & Dependencies

### Required SDKs
- Camera: CameraX (Android), AVFoundation (iOS)
- Payments: RevenueCat or native StoreKit/Play Billing
- Analytics: Firebase Analytics
- AI: Google Gemini API
- Database: SQLDelight

### API Keys Needed
- Google Gemini API key
- Firebase configuration
- RevenueCat API key
- Google Maps API key (for location features)

---

This implementation guide provides a complete roadmap for building your WildID MVP with the freemium model. Start with Phase 1 and iterate based on user feedback!
