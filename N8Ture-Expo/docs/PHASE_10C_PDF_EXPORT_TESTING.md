# Phase 10C: PDF Export Testing Guide

## Overview

This guide covers testing the structured PDF export feature with numbered map pins, species list, GPS coordinates, and route data.

---

## Prerequisites

### 1. Test Data Setup

**Create diverse test identifications:**

```bash
# You need at least 5-6 identifications with:
1. At least 3 with GPS coordinates (for map)
2. Mix of categories (plant, wildlife, fungi)
3. Some with photos, some audio
4. Various confidence levels
```

**How to create test data:**
1. Open app → Navigate to Home
2. Tap center capture button → Select "Camera"
3. Take photo of a plant/animal (GPS will be captured)
4. Identify the species → Save to history
5. Repeat 5-6 times to build a dataset
6. Mix in 1-2 audio recordings for variety

---

## Test Case 1: Basic PDF Export

**Goal**: Generate a simple PDF with default settings

### Steps:
1. Navigate to History tab
2. Verify you have at least 3 identifications
3. Tap "Export PDF" button in view toggle bar
4. ExportPreviewScreen should open

**Expected UI:**
- ✅ Modal appears with "Export to PDF" title
- ✅ All identifications selected by default (checkboxes checked)
- ✅ Title field shows "My Nature Discoveries"
- ✅ All toggle switches enabled by default:
  - Include Map: ON
  - Include Photos: ON
  - Include GPS Coordinates: ON
  - Include Route Data: OFF
- ✅ Info box shows summary: "The PDF will include X identifications with a map, photos, and GPS coordinates."
- ✅ "Generate PDF" button visible at bottom

### Steps (continued):
5. Tap "Generate PDF" button
6. Wait for processing (2-3 seconds for map capture)

**Expected Behavior:**
- ✅ Button shows loading spinner
- ✅ Console logs:
  ```
  Capturing map snapshot for PDF...
  Capturing map snapshot with X numbered markers
  Map snapshot captured: file:///.../map-snapshot-XXXX.png
  Map snapshot saved: file:///.../map-snapshot-XXXX.png
  ```
- ✅ Native share sheet appears
- ✅ Alert shows: "PDF Generated! 📄 Your nature discovery report has been created and is ready to share."
- ✅ Options: Share via Mail, Messages, Save to Files, etc.

### Verify PDF Content:
1. Share PDF to Files or Mail (preview it)
2. Open the PDF

**Expected PDF Structure:**

✅ **Header Section:**
- Title: "My Nature Discoveries"
- Subtitle: "Nature Discovery Report • [Today's Date]"
- Green border (#708C6A)

✅ **Metadata Summary (4 cards):**
- Total Discoveries: X
- Species Found: X
- Locations: X (GPS-tagged only)
- Success Rate: X%

✅ **Map Section:**
- Title: "📍 Discovery Map"
- Large map image with numbered pins (1, 2, 3...)
- Pin colors match categories:
  - 🟢 Green: Plants
  - 🟤 Brown: Wildlife
  - 🟠 Orange: Fungi
  - 🟣 Purple: Insects
- Caption: "Map showing X discovery locations with numbered pins"

✅ **Species List Section:**
- Title: "🌿 Discovered Species"
- Numbered list matching map pins
- Each entry has:
  - Number badge (matching map pin)
  - Photo (if available)
  - Common name (bold)
  - Scientific name (italic)
  - Category
  - Confidence (color-coded badge: green ≥80%, yellow 60-79%, red <60%)
  - Timestamp
  - Method (🎵 Audio or 📷 Photo)
  - GPS coordinates (formatted with accuracy)

✅ **Footer:**
- "🌿 N8ture AI"
- "Wildlife, Plant & Fungi Identification • www.n8ture.ai"
- Generation timestamp

---

## Test Case 2: Selective Export

**Goal**: Export only specific identifications

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Tap "Deselect All" at the top
3. Manually select 2-3 specific identifications by tapping checkboxes
4. Verify info box updates: "The PDF will include 3 identifications..."
5. Tap "Generate PDF"

**Expected:**
- ✅ PDF only contains the selected identifications
- ✅ Map shows only the selected pins
- ✅ Species list matches selected items
- ✅ Metadata reflects correct counts

---

## Test Case 3: Export Without Map

**Goal**: Disable map in PDF

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Toggle "Include Map" switch to OFF
3. Info box should update: "The PDF will include X identifications, photos, and GPS coordinates." (no "with a map")
4. Tap "Generate PDF"

**Expected:**
- ✅ Console log: "Map snapshot not available (no GPS-tagged entries)" or no map capture logs
- ✅ PDF does NOT contain "Discovery Map" section
- ✅ PDF jumps directly to Species List section

---

## Test Case 4: Export Without Photos

**Goal**: Disable photos in PDF

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Toggle "Include Photos" switch to OFF
3. Tap "Generate PDF"

**Expected:**
- ✅ PDF species list does NOT show thumbnail images
- ✅ Only numbered badges and text content appear
- ✅ Layout adjusts to accommodate missing photos

---

## Test Case 5: Export Without GPS Coordinates

**Goal**: Disable GPS coordinates display

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Toggle "Include GPS Coordinates" switch to OFF
3. Tap "Generate PDF"

**Expected:**
- ✅ PDF species list does NOT show "GPS Location" row
- ✅ Coordinates are completely omitted from each entry

---

## Test Case 6: Export With Route Data

**Goal**: Include journey metrics in PDF

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Toggle "Include Route Data" switch to ON
3. Route data input fields should appear

**Fill in route metrics:**
- Distance: `5.5` km
- Elevation Gain: `250` m
- Elevation Loss: `180` m
- Duration: `120` minutes

4. Verify info box doesn't change (route data is separate)
5. Tap "Generate PDF"

**Expected PDF Content:**

✅ **Journey Metrics Section (NEW):**
- Title: "🥾 Journey Metrics"
- 4 stat cards in a row:
  - **Distance**: 5.50 km
  - **Elevation Gain**: 250 m
  - **Duration**: 2h 0m
  - **Avg Speed**: 2.8 km/h (auto-calculated)

**Section placement:**
- Journey Metrics appears AFTER map (if enabled)
- BEFORE Species List

---

## Test Case 7: Route Data Validation

**Goal**: Verify input validation for route data

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Toggle "Include Route Data" to ON
3. Leave "Distance" field EMPTY
4. Fill "Duration": `60`
5. Tap "Generate PDF"

**Expected:**
- ✅ Alert appears: "Invalid Input - Please enter valid distance and duration values"
- ✅ PDF not generated
- ✅ Button re-enables

### Steps (continued):
6. Fill "Distance": `abc` (invalid text)
7. Tap "Generate PDF"

**Expected:**
- ✅ Same alert appears
- ✅ PDF not generated

### Steps (final):
8. Fill valid "Distance": `10`
9. Fill valid "Duration": `90`
10. Leave "Elevation Gain" and "Elevation Loss" EMPTY (optional fields)
11. Tap "Generate PDF"

**Expected:**
- ✅ PDF generates successfully
- ✅ Journey Metrics shows:
  - Elevation Gain: 0 m
  - Elevation Loss: 0 m
  - Other fields populated correctly

---

## Test Case 8: Custom Title

**Goal**: Change PDF title

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Clear "Title" field
3. Type: `Spring Wildflower Walk`
4. Tap "Generate PDF"

**Expected:**
- ✅ PDF header shows: "Spring Wildflower Walk"
- ✅ Subtitle still shows: "Nature Discovery Report • [Date]"
- ✅ Share dialog uses custom title

---

## Test Case 9: Empty Selection Validation

**Goal**: Prevent export with no selections

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Tap "Deselect All"
3. Verify all checkboxes unchecked
4. Tap "Generate PDF"

**Expected:**
- ✅ Alert appears: "No Selection - Please select at least one identification to export"
- ✅ PDF not generated
- ✅ No share dialog appears

---

## Test Case 10: Numbered Pins Match Species List

**Goal**: Verify map pins correspond to list order

### Critical Test:

1. Navigate to History → Tap "Export PDF"
2. Select EXACTLY 3 identifications:
   - Check ID #2 (should be pin 1)
   - Check ID #5 (should be pin 2)
   - Check ID #8 (should be pin 3)
3. Note the ORDER of selection
4. Tap "Generate PDF"

**Expected:**
- ✅ Map shows 3 numbered pins: 1, 2, 3
- ✅ Species list shows 3 entries numbered: 1, 2, 3
- ✅ Pin 1 on map matches Entry 1 in list (same species name, GPS coordinates)
- ✅ Pin 2 on map matches Entry 2 in list
- ✅ Pin 3 on map matches Entry 3 in list

**How to verify:**
- Cross-reference GPS coordinates in list with pin locations on map
- Species name in list should match the location on the map

---

## Test Case 11: Map Snapshot Cleanup

**Goal**: Verify temporary map snapshots are deleted

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Generate PDF successfully
3. Check console logs

**Expected Console Logs:**
```
Map snapshot captured: file:///.../map-snapshot-XXXX.png
Map snapshot saved: file:///.../map-snapshot-XXXX.png
Map snapshot deleted: file:///.../map-snapshot-XXXX.png
```

**Expected Behavior:**
- ✅ Snapshot file created during generation
- ✅ Snapshot file deleted after PDF generation
- ✅ No leftover files in cache directory

---

## Test Case 12: Large Dataset (Performance Test)

**Goal**: Test with many identifications

### Prerequisites:
- Create 15-20 identifications with GPS
- Mix of categories and types

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Select all (15-20 items)
3. Enable map, photos, coordinates, route data
4. Tap "Generate PDF"
5. Monitor processing time

**Expected:**
- ✅ Map captures successfully (may take 3-5 seconds)
- ✅ PDF generates within 10 seconds
- ✅ All 15-20 entries appear in PDF
- ✅ Map shows all pins clearly
- ✅ No crashes or freezing
- ✅ Smooth scrolling in PDF

---

## Test Case 13: Edge Case - No GPS Data

**Goal**: Handle identifications without GPS

### Steps:
1. Clear history: `AsyncStorage.clear()`
2. Take photo in Airplane Mode (GPS disabled)
3. Identify species → Save to history
4. Navigate to History → Tap "Export PDF"
5. Tap "Generate PDF"

**Expected:**
- ✅ Console log: "Map snapshot not available (no GPS-tagged entries)"
- ✅ PDF generated WITHOUT map section
- ✅ Metadata shows "Locations: 0"
- ✅ Species list shows entry WITHOUT GPS coordinates row
- ✅ No errors or crashes

---

## Test Case 14: Share Options

**Goal**: Verify native share integration

### Steps:
1. Generate PDF (any configuration)
2. Share sheet appears

**Test each share method:**

**Mail:**
- ✅ PDF attaches to new email
- ✅ Filename: `nature-discoveries-XXXX.pdf`
- ✅ MIME type: `application/pdf`

**Messages:**
- ✅ PDF sends as attachment

**Save to Files:**
- ✅ PDF saves to device
- ✅ Can be opened in Files app
- ✅ Viewable in other PDF readers

**Third-party apps:**
- ✅ Share to Dropbox, Google Drive, etc. works
- ✅ PDF opens correctly in external viewers

---

## Test Case 15: Close Without Generating

**Goal**: Exit without creating PDF

### Steps:
1. Navigate to History → Tap "Export PDF"
2. Make some selections and changes
3. Tap "X" (close button) at top-left
4. Should return to History screen

**Expected:**
- ✅ Modal closes
- ✅ No PDF generated
- ✅ No share dialog
- ✅ History screen shows unchanged

---

## Regression Tests

### Verify existing features still work:

**History Grid View:**
- ✅ History grid displays correctly
- ✅ "Map View" button still works
- ✅ "Export PDF" button visible and functional
- ✅ GPS count badge shows correct number

**Map View:**
- ✅ MapViewScreen still displays markers
- ✅ Markers show correct colors and icons
- ✅ Tap marker → Callout appears
- ✅ Tap callout → Navigates to SpeciesDetail

---

## Performance Benchmarks

### Expected Performance:

| Operation | Expected Time |
|-----------|--------------|
| Open ExportPreviewScreen | < 500ms |
| Load history list | < 300ms |
| Toggle selection | Instant |
| Map snapshot capture | 2-3 seconds |
| PDF generation | 3-5 seconds (small dataset) |
| PDF generation | 5-10 seconds (large dataset) |
| Share dialog open | < 500ms |
| Total export flow | < 15 seconds |

---

## Console Logs to Monitor

### During PDF Generation:

**Success Flow:**
```
Capturing map snapshot for PDF...
Capturing map snapshot with 5 numbered markers
Map snapshot captured: file:///.../map-snapshot-1698765432.png
Map snapshot saved: file:///.../map-snapshot-1698765432.png
Map snapshot deleted: file:///.../map-snapshot-1698765432.png
```

**No GPS Data:**
```
Map snapshot not available (no GPS-tagged entries)
```

**Errors (should NOT appear):**
```
Failed to capture map snapshot: [error]
Failed to generate PDF: [error]
Failed to delete map snapshot: [error]
```

---

## Visual Verification Checklist

### PDF Appearance:

- [ ] Professional layout with consistent spacing
- [ ] N8ture brand color (#708C6A) used for accents
- [ ] Readable fonts at appropriate sizes
- [ ] Clear section titles with icons
- [ ] Color-coded confidence badges
- [ ] Numbered pins clearly visible on map
- [ ] Photos embedded correctly (not broken links)
- [ ] GPS coordinates formatted cleanly
- [ ] Footer branding present
- [ ] Print-friendly (black text on white)

---

## Known Limitations

1. **Map Provider**: Requires Google Maps API key for MapView
   - Without API key, map may show as blank
   - See `MAP_VIEW_SETUP.md` for configuration

2. **Map Rendering Time**: 2-second delay for map to load before capture
   - May need adjustment for slower devices
   - Visible in `mapSnapshotService.ts` line 46

3. **Image Size**: Large photos may increase PDF file size
   - Photos are base64 encoded
   - Consider compression for production

---

## Troubleshooting

### Map doesn't appear in PDF

**Cause**: Google Maps API key not configured

**Solution**:
1. Follow `MAP_VIEW_SETUP.md`
2. Add API keys to `app.json`
3. Rebuild app: `npx expo run:android` or `npx expo run:ios`

### PDF generation fails

**Cause**: Missing permissions or dependencies

**Solution**:
```bash
# Verify expo-print and expo-sharing installed
npm list expo-print expo-sharing react-native-view-shot

# Reinstall if needed
npm install --legacy-peer-deps expo-print expo-sharing react-native-view-shot
```

### Map snapshot shows blank/white

**Cause**: Map not fully rendered before capture

**Solution**:
- Increase delay in `mapSnapshotService.ts` line 46
- Change from 2000ms to 3000ms or 4000ms

### Numbered pins don't match list

**Cause**: Filtering inconsistency

**Solution**:
- Check that `selectedHistory` array order is consistent
- Verify same filter applied to map and list

---

## Success Criteria

✅ All 15 test cases pass
✅ No console errors during export
✅ PDF opens correctly on all platforms
✅ Numbered pins match species list
✅ Share functionality works
✅ Map captures successfully
✅ Route data calculates correctly
✅ No memory leaks or crashes

---

## Next Steps

After testing Phase 10C:
1. Test on physical devices (iOS and Android)
2. Verify performance with 50+ identifications
3. Test on different screen sizes
4. Implement marker clustering (future enhancement)
5. Add PDF preview before sharing (optional)

---

**Last Updated**: Phase 10C Part 3 Implementation
**Status**: Ready for testing
