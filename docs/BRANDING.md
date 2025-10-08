# N8ture AI App - Branding Guide

## App Name
**N8ture AI App** (pronounced "Nature AI App")

The "8" replaces "atu" in "Nature" - a stylized, tech-forward branding.

## Package Identifiers

### Android
- Package Name: `com.measify.kappmaker` (inherited from KAppMaker base)
- **TODO:** Consider rebranding to `com.n8ture.ai` or `com.n8tureai.app`

### iOS
- Bundle ID: `com.measify.kappmaker` (inherited from KAppMaker base)
- **TODO:** Consider rebranding to `com.n8ture.ai` or `com.n8tureai.app`

## Product Identifiers (RevenueCat)

### Subscription Products
- Monthly: `n8ture_premium_monthly`
- Annual: `n8ture_premium_annual`

### Legacy IDs (if migrating)
- Old: `wildid_premium_monthly` / `wildid_premium_annual`

## Persistence Keys (SharedPreferences/UserDefaults)

All app-specific preference keys use `n8ture_` prefix:
- `n8ture_trial_count` - Remaining free identifications
- `n8ture_first_use_timestamp` - First app launch timestamp
- `n8ture_max_trial_count` - Maximum trial count (for A/B testing)

## Firebase Configuration

### Project Names
- Firebase Project: "N8ture AI" or "N8ture AI App"
- Android App: "N8ture AI Android"
- iOS App: "N8ture AI iOS"

### Collections (Firestore)
- `users` - User profiles
- `identifications` - Cloud-synced identification history
- `species` - Curated species database
- `feedback` - User feedback and reports

## App Store Metadata

### App Name
- **Primary:** N8ture AI App
- **Subtitle:** Wildlife & Plant Identification

### Short Description (80 chars)
"AI-powered species identification with safety info, edibility, and herbal uses"

### Keywords
- nature identification
- wildlife recognition
- plant identifier
- edible plants
- AI species
- outdoor guide
- foraging app
- nature AI

### Categories
- Primary: Education
- Secondary: Reference

## Visual Identity

### Logo Concept
- Incorporate "8" as design element
- Nature/leaf motif
- Tech/AI elements (circuit patterns, neural network)
- Color: Green (nature) + Blue/Purple (tech/AI)

### Color Palette
- **Primary Green:** `#4CAF50` (Material Green 500)
- **Tech Blue:** `#2196F3` (Material Blue 500)
- **AI Purple:** `#9C27B0` (Material Purple 500)
- **Safety Colors:** As defined in app (🟢🟡🔴⚪)

### Typography
- **Headlines:** Bold, modern sans-serif
- **Body:** Clean, readable sans-serif
- **Scientific Names:** Italic serif for authenticity

## App Taglines

**Primary:**
"Discover Nature Intelligently"

**Alternatives:**
- "Nature Meets AI"
- "Identify. Learn. Explore."
- "Your AI Nature Guide"
- "Smart Species Identification"

## Marketing Copy

### One-Liner
"N8ture AI App uses cutting-edge AI to identify any plant, animal, or fungi instantly - with critical safety information about edibility and medicinal uses."

### Value Propositions
1. **Instant Identification** - Point your camera, get answers in seconds
2. **Safety First** - Clear warnings about poisonous species
3. **Educational** - Learn habitat, uses, and interesting facts
4. **Offline Ready** - Cache your favorites for field use
5. **Expert-Level** - Powered by Google's Gemini AI

## Social Media

### Handles (Recommended)
- Twitter/X: @N8tureAI
- Instagram: @n8ture.ai
- TikTok: @n8tureai
- Website: n8ture.ai or n8tureai.app

### Hashtags
- #N8tureAI
- #AIIdentification
- #NatureAI
- #SpeciesID
- #ForagingAI

## Legal

### Company Name Options
- N8ture AI Inc.
- N8ture Technologies
- Nature AI Solutions

### Copyright Notice
"© 2025 N8ture AI App. All rights reserved."

### Trademark
Consider trademark registration for:
- "N8ture AI" (name)
- Logo design
- App icon

## Migration Notes

### Rebranding from WildID
If users have already installed under "WildID":

1. **App Name Change:**
   - Submit update to app stores
   - Update all metadata and screenshots

2. **Package Name:**
   - Option A: Keep `com.measify.kappmaker` (no user impact)
   - Option B: Create new app with `com.n8ture.ai` (requires new install)

3. **User Data Migration:**
   - If changing package: Provide cloud backup/restore
   - Preferences will reset with new package name
   - Consider migration guide for power users

4. **RevenueCat Products:**
   - Create new product IDs with `n8ture_` prefix
   - Keep old IDs active for existing subscribers
   - Map old → new in RevenueCat dashboard

### Recommendation
Keep existing package name `com.measify.kappmaker` for initial launch to avoid migration complexity. Can rebrand package name in major version 2.0 if desired.

---

**Status:** Branding updated in codebase (preference keys, product IDs, documentation). Package name remains `com.measify.kappmaker` for compatibility.