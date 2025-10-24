# Camera Usage Guide - N8ture AI

This guide explains how to use the camera feature for species identification in the N8ture AI app.

## Features

### Camera Screen
- Full-screen camera view with live preview
- Capture button for taking photos
- Flash control (Off, On, Auto)
- Camera flip (Front/Back)
- Permission handling
- Image preview before identification

### Results Screen
- Species name (common and scientific)
- Confidence score with color-coded badge
- Edibility status badge
- Detailed species information
- Safety warnings for toxic species
- Key identification features
- Similar species
- Conservation status
- Seasonality information

## User Flow

### 1. Starting Identification

**From Home Screen:**
1. Tap "Open Camera" button
2. If not signed in, you'll be prompted to sign in
3. If trial limit reached, you'll see upgrade prompt
4. Camera screen opens

### 2. Capturing Image

**Camera Controls:**
- **Capture Button** (large circular button at bottom)
  - Tap to take photo
  - Located at center bottom of screen
- **Flash Toggle** (top right)
  - Tap to cycle: Off → On → Auto
  - Current mode displayed
- **Camera Flip** (bottom left)
  - Tap to switch between front and back camera
- **Close Button** (top left)
  - Return to home screen

**Tips for Best Results:**
- Center the subject in frame
- Ensure good lighting
- Get close enough to see details
- Keep camera steady
- Avoid blurry or dark photos

### 3. Preview and Confirm

After capturing:
1. Image preview displays full-screen
2. Two options:
   - **Retake** - Take another photo
   - **Identify Species** - Proceed with identification

### 4. Identification Process

1. Tap "Identify Species"
2. Loading screen appears: "Identifying species..."
3. Image sent to AI for analysis
4. Results appear automatically (usually 3-5 seconds)

### 5. Viewing Results

**Results Screen shows:**
- **Header**
  - Category icon (🌿 plant, 🦊 animal, 🍄 fungi, 🦋 insect)
  - Common name (e.g., "Red Fox")
  - Scientific name (e.g., "Vulpes vulpes")

- **Badges**
  - Confidence score (color-coded)
    - Green: 80%+ (High confidence)
    - Yellow: 50-80% (Medium confidence)
    - Red: <50% (Low confidence)
  - Edibility status
    - Green ✓ Safe/Edible
    - Yellow ⚠ Caution
    - Red ✕ Dangerous/Toxic
    - Gray ? Unknown

- **Warning Card** (if dangerous)
  - Red alert box with toxicity information
  - Appears prominently for dangerous species

- **Information Cards**
  - Description
  - Habitat
  - Edibility information
  - Key identification features (bulleted list)
  - Similar species (chips)
  - Conservation status
  - Seasonality

- **Actions**
  - Save to History
  - Identify Another

## Trial System

### Free Users (3 Identifications)
- Trial counter badge shown on home screen
- Decrements after each identification
- After 3rd identification, paywall appears
- Must upgrade to Premium for unlimited access

### Premium Users
- Unlimited identifications
- No trial counter
- High-resolution image capture
- Detailed species data
- Offline mode (future feature)

## Permissions

### Camera Permission
**Required** for identification feature

**First Time:**
1. App requests camera permission
2. System dialog appears
3. Tap "Allow" to grant access

**If Denied:**
1. Permission denied screen appears
2. Explanation of why permission is needed
3. "Grant Permission" button to try again
4. "Go Back" to return home

**To Enable Later:**
- iOS: Settings → N8ture AI → Camera → Allow
- Android: Settings → Apps → N8ture AI → Permissions → Camera → Allow

## Error Handling

### Common Errors

**"Camera Permission Required"**
- Camera access denied
- Solution: Enable camera permission in device settings

**"Network Error"**
- No internet connection
- Solution: Check WiFi/cellular data and retry

**"Identification Failed"**
- API error or timeout
- Solution: Tap "Retry" button

**"API Quota Exceeded"**
- Free tier limit reached
- Solution: Upgrade to Premium or wait 24 hours

**"Low Confidence"**
- AI not confident in identification (<30%)
- Solution: Retake photo with better lighting/angle

### Troubleshooting Tips

**Blurry Images:**
- Hold camera steady
- Tap screen to focus
- Clean camera lens

**Dark Images:**
- Enable flash
- Move to better lighting
- Avoid backlighting

**No Species Detected:**
- Ensure subject is centered
- Get closer to subject
- Try different angle
- Ensure it's a wildlife/plant/fungi species

## Best Practices

### Photography Tips

1. **Lighting**
   - Natural daylight is best
   - Avoid harsh shadows
   - Use flash in low light
   - Avoid direct sunlight causing glare

2. **Composition**
   - Center subject in frame
   - Fill frame with subject
   - Include identifying features
   - Avoid busy backgrounds

3. **Focus**
   - Tap screen to focus (if supported)
   - Ensure image is sharp
   - Avoid motion blur
   - Take multiple photos if unsure

4. **Distance**
   - Close enough to see details
   - Not too close (avoid blur)
   - Include whole organism if possible
   - Capture distinctive features

### Identification Tips

1. **Plants**
   - Capture flowers, leaves, or distinctive features
   - Include stem/bark if tree
   - Show leaf arrangement
   - Capture any fruits/seeds

2. **Animals**
   - Capture clear face/head shot
   - Include distinctive markings
   - Show body proportions
   - Capture in natural pose

3. **Fungi**
   - Show cap and gills/pores
   - Include stem if present
   - Capture from multiple angles
   - Show habitat context

4. **Insects**
   - Get as close as possible
   - Show wing patterns
   - Capture body segments
   - Include antennae if visible

## Safety Warnings

### Important Notes

1. **Never consume** any plant or fungi based solely on app identification
2. **Consult experts** before eating wild species
3. **Red toxicity warnings** indicate dangerous species
4. **Cross-reference** with field guides
5. **When in doubt, don't** consume unknown species

### Toxic Species

If app identifies a dangerous species:
- ⚠️ Red warning card appears
- Toxicity information provided
- Do not touch or consume
- Keep away from children and pets
- Wash hands if contact occurs

## Data Privacy

### Image Storage
- Images processed by AI
- Not permanently stored on servers
- Stored locally for history (optional)
- Can be deleted anytime

### Identification Data
- Saved to your account history
- Only visible to you
- Can be exported or deleted
- Not shared with third parties

## Offline Mode

**Coming Soon for Premium Users:**
- Download species database
- Identify without internet
- Regional species packs
- Faster identification

## Tips for Success

1. **Sign in first** - Avoid losing identifications
2. **Check trial count** - Know remaining free identifications
3. **Good lighting** - Take photos in daylight
4. **Clear focus** - Avoid blurry images
5. **Multiple angles** - Take several photos if uncertain
6. **Read results** - Review all information, not just name
7. **Save favorites** - Build your personal species collection
8. **Share findings** - Help others learn

## Support

**Need Help?**
- Check this guide
- Review FIREBASE_SETUP.md for technical issues
- Contact support via app settings
- Visit GitHub repository for updates

**Report Issues:**
- Incorrect identifications
- App crashes
- Permission problems
- Feature requests

## Future Features

Coming soon:
- Audio identification (bird songs)
- AR overlay for real-time ID
- Species range maps
- Community validation
- Expert verification
- Field notes and observations
- Location-based suggestions
- Seasonal alerts

---

**Happy identifying! 🌿**

Remember: The app is a tool to assist identification. Always verify with experts before consuming wild species.
