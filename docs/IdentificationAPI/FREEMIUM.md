# Freemium & Rate Limiting

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

The N8ture Identification API uses a freemium model to encourage users to upgrade to a premium subscription. This document outlines the rate limits for free users and how the system is implemented.

## Free Tier Limits

Users on the free plan are subject to the following limits:

-   **Identifications:** 3 free identifications per 24-hour period.
-   **Features:** Access to basic identification information only. Premium features like detailed descriptions, medicinal uses, and similar species are locked.

## Premium Tier

Users with an active premium subscription have the following benefits:

-   **Identifications:** Unlimited identifications.
-   **Features:** Full access to all detailed species information.
-   **Priority Support:** Faster response times for support requests.

## Implementation

Rate limiting is handled on the backend by a Firebase Cloud Function. Here’s how it works:

1.  **User Identification:** The user is identified by their Firebase UID.
2.  **Usage Tracking:** A counter is stored in the Firebase Realtime Database or Firestore for each user, tracking the number of identifications made in the last 24 hours.
3.  **Limit Enforcement:** Before processing an identification request, the backend checks the user's subscription status and usage count.
    -   If the user is premium, the request is processed.
    -   If the user is on the free plan and has not exceeded their limit, the request is processed, and their usage counter is incremented.
    -   If the user is on the free plan and has exceeded their limit, the API returns a `quota-exceeded` error.

## Client-Side Handling

The mobile app is responsible for:

1.  **Displaying the Paywall:** When a `quota-exceeded` error is received, the app should display a paywall screen prompting the user to upgrade.
2.  **Tracking Trial Status:** The app can also maintain a local trial counter to provide a more responsive user experience (e.g., showing "1 of 3 free identifications used").
3.  **Unlocking Premium Features:** The app should check the user's subscription status to determine whether to display premium content.

**Example from `WildID_Implementation_Guide.md`:**

```kotlin
// composeApp/src/commonMain/kotlin/com/measify/kappmaker/data/local/TrialManager.kt

class TrialManager {
    companion object {
        private const val KEY_TRIAL_COUNT = "trial_count"
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
}
```

This local `TrialManager` provides immediate feedback to the user, while the backend provides the authoritative enforcement.

