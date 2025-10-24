# AllTrails-Style Navigation Implementation Checklist

## Overview
Detailed checklist for implementing the simplified 3-button AllTrails-style navigation.

## Pre-Implementation

- [x] Review AllTrails design reference
- [x] Document navigation structure
- [x] Create implementation plan
- [ ] Review plan with stakeholder
- [ ] Confirm design specifications

## Phase 1: Update Navigation Types (30 min)

### navigation.ts Updates
- [ ] Update `MainTabsParamList` to only include `WalksTab` and `HistoryTab`
- [ ] Remove `MapTab` and `ProfileTab` from types
- [ ] Add `WalkSession` screen to RootStackParamList
- [ ] Add `SpeciesDetail` screen to RootStackParamList
- [ ] Update type exports

**Files to modify:**
- `src/types/navigation.ts`

## Phase 2: Create Walk Icon Component (30 min)

### Custom Walk Icon
- [ ] Create `src/components/icons/WalkIcon.tsx`
- [ ] Design SVG for boot footprints (two boots side by side)
- [ ] Add size and color props
- [ ] Test icon visibility at 26px size
- [ ] Ensure icon works in both active/inactive states

**Alternative:** Use Ionicons
- [ ] Test `footsteps-outline` from Ionicons
- [ ] Test `walk-outline` from Ionicons
- [ ] Choose best option

**Files to create:**
- `src/components/icons/WalkIcon.tsx` (if custom)

## Phase 3: Redesign Bottom Navigation (2 hours)

### Update CustomBottomTabNavigator.tsx
- [ ] Remove middle index logic (no longer needed for 5 tabs)
- [ ] Update to 2-tab layout (left and right)
- [ ] Increase center button size from 60px to 70px
- [ ] Increase elevation from 20px to 30px
- [ ] Increase white border from 3px to 4px
- [ ] Update shadow properties (blur 12px, opacity 0.3)
- [ ] Update tab icons:
  - [ ] Left: Walk icon (footsteps)
  - [ ] Right: History icon (grid)
- [ ] Update tab labels:
  - [ ] Left: "Walks"
  - [ ] Right: "History"
- [ ] Remove Map and Profile tabs
- [ ] Test layout on iOS
- [ ] Test layout on Android
- [ ] Test safe area insets

**Center Button Updates:**
- [ ] Change diameter to 70px
- [ ] Update border to 4px
- [ ] Update elevation to 30px above bar
- [ ] Update shadow radius to 12px
- [ ] Test on various screen sizes
- [ ] Add pulsing animation (for future active state)

**Files to modify:**
- `src/navigation/CustomBottomTabNavigator.tsx`

## Phase 4: Create AppHeader Component (1 hour)

### New Component: AppHeader.tsx
- [ ] Create `src/components/navigation/AppHeader.tsx`
- [ ] Add props:
  - [ ] `showBackButton?: boolean`
  - [ ] `onBackPress?: () => void`
  - [ ] `title?: string`
  - [ ] `showSettings?: boolean`
  - [ ] `showProfile?: boolean`
- [ ] Implement back arrow button (left)
- [ ] Implement settings icon (top right)
- [ ] Implement profile icon (top right, 60px from edge)
- [ ] Use N8ture AI green background (#708C6A)
- [ ] White text and icons
- [ ] Height: 56px + status bar
- [ ] Add safe area support
- [ ] Add navigation actions
- [ ] Test on iOS notch devices
- [ ] Test on Android

**Files to create:**
- `src/components/navigation/AppHeader.tsx`

## Phase 5: Update History Screen (2 hours)

### HistoryScreen.tsx Redesign
- [ ] Change from list to grid layout
- [ ] Implement 2-column grid with FlatList
- [ ] Create HistoryCard component:
  - [ ] Species image (top, full width)
  - [ ] Species name (bold overlay)
  - [ ] Confidence badge (top right corner)
  - [ ] Type icon (camera/audio, top left corner)
  - [ ] Date (bottom overlay)
- [ ] Add card styling:
  - [ ] Border radius: 12px
  - [ ] Aspect ratio: 4:5
  - [ ] Shadow/elevation
- [ ] Remove old list item styling
- [ ] Update stats cards layout
- [ ] Remove filter button (move to future phase)
- [ ] Add pull to refresh
- [ ] Update empty state
- [ ] Use AppHeader component
- [ ] Test with various image sizes
- [ ] Test with long species names
- [ ] Test loading states

**Card Layout:**
```
┌─────────────┐
│ 🎵  [Photo] │ 92% <- Type icon and confidence badge
│             │
│   Robin     │ <- Name (overlay, bottom)
│  2 hrs ago  │ <- Time (overlay, bottom)
└─────────────┘
```

**Files to modify:**
- `src/screens/HistoryScreen.tsx`
- Create: `src/components/history/HistoryCard.tsx`

## Phase 6: Create Walk Screen (2 hours)

### New Screen: WalkScreen.tsx
- [ ] Create `src/screens/WalkScreen.tsx`
- [ ] Add "Start New Walk" hero card:
  - [ ] Large prominent card at top
  - [ ] Icon (boot or map)
  - [ ] Title: "Start a New Walk"
  - [ ] Subtitle: "Track species along your path"
  - [ ] CTA button: "Start Walk"
- [ ] Add "Recent Walks" section:
  - [ ] Walk cards with:
    - [ ] Walk name/location
    - [ ] Stats (species count, distance, duration)
    - [ ] Date/time
  - [ ] Tap to view walk details
- [ ] Add statistics section:
  - [ ] Total walks
  - [ ] Total distance
  - [ ] Total species discovered
- [ ] Use AppHeader component
- [ ] Add empty state (no walks yet)
- [ ] Test layout
- [ ] Test navigation to walk details

**Files to create:**
- `src/screens/WalkScreen.tsx`
- `src/components/walk/WalkCard.tsx`
- `src/components/walk/StartWalkHero.tsx`

## Phase 7: Update Root Navigator (1 hour)

### RootNavigator.tsx Updates
- [ ] Update MainTabsNavigator to 2 tabs:
  - [ ] WalksTab
  - [ ] HistoryTab
- [ ] Remove MapTab screen
- [ ] Remove ProfileTab from tabs (will use stack screen)
- [ ] Add Profile as stack screen (accessed from header)
- [ ] Add Settings as stack screen
- [ ] Add WalkSession screen
- [ ] Add SpeciesDetail screen
- [ ] Update default tab to HistoryTab (content-first)
- [ ] Test navigation flow
- [ ] Test deep linking

**Files to modify:**
- `src/navigation/RootNavigator.tsx`

## Phase 8: Update HomeScreen (30 min)

### HomeScreen.tsx Updates
- [ ] Remove "Camera" button (now accessed via capture modal)
- [ ] Remove "Record Bird Song" button
- [ ] Simplify to dashboard view
- [ ] Add quick stats
- [ ] Add recent activity preview
- [ ] Add "Start Walk" shortcut
- [ ] Use AppHeader component

**OR: Remove HomeScreen entirely**
- [ ] Make HistoryTab the default screen
- [ ] Remove HomeTab concept
- [ ] Update navigation accordingly

**Files to modify or remove:**
- `src/screens/HomeScreen.tsx`

## Phase 9: Update Profile Access (30 min)

### ProfileScreen Access
- [ ] Update ProfileScreen to use AppHeader
- [ ] Add back button to header
- [ ] Ensure navigation from top right icon works
- [ ] Test sign out flow
- [ ] Test trial status display

**Files to modify:**
- `src/screens/ProfileScreen.tsx`

## Phase 10: Create Settings Screen (1 hour)

### New Screen: SettingsScreen.tsx
- [ ] Create `src/screens/SettingsScreen.tsx`
- [ ] Add detection settings:
  - [ ] Detection frequency
  - [ ] Auto-save toggle
  - [ ] Background detection toggle
  - [ ] GPS tracking toggle
- [ ] Add app settings:
  - [ ] Notifications
  - [ ] Sound effects
  - [ ] Haptic feedback
- [ ] Add account settings:
  - [ ] Manage subscription
  - [ ] Privacy
  - [ ] Terms of service
- [ ] Add about section:
  - [ ] App version
  - [ ] Credits
  - [ ] Contact support
- [ ] Use AppHeader with back button
- [ ] Test all toggles
- [ ] Test navigation

**Files to create:**
- `src/screens/SettingsScreen.tsx`

## Phase 11: Styling and Polish (1 hour)

### Visual Polish
- [ ] Ensure consistent spacing throughout
- [ ] Verify N8ture AI color scheme usage
- [ ] Test dark mode (if supported)
- [ ] Verify all icons are clear and visible
- [ ] Test on small screens (iPhone SE)
- [ ] Test on large screens (iPad)
- [ ] Verify safe area insets everywhere
- [ ] Check animation smoothness (60 FPS)
- [ ] Test capture button shadow on different backgrounds
- [ ] Verify accessibility labels

### Animation Polish
- [ ] Test bottom nav animations
- [ ] Test capture button press animation
- [ ] Test modal slide animations
- [ ] Test screen transitions
- [ ] Ensure all animations use native driver

## Phase 12: Testing (1 hour)

### Functional Testing
- [ ] Tap Walks tab → Walk screen opens
- [ ] Tap History tab → History screen opens
- [ ] Tap capture button → Modal opens
- [ ] Select Camera → Camera opens
- [ ] Select Listen → Audio recording opens
- [ ] Tap Settings icon → Settings opens
- [ ] Tap Profile icon → Profile opens
- [ ] Tap Back button → Returns to previous screen
- [ ] Start walk → Walk session begins
- [ ] View past walk → Walk details open
- [ ] Tap history card → Species detail opens

### Visual Testing
- [ ] Bottom nav looks correct on iOS
- [ ] Bottom nav looks correct on Android
- [ ] Center button is properly elevated
- [ ] Center button shadow is visible
- [ ] Walk icon is clear and recognizable
- [ ] History grid displays properly
- [ ] Cards have proper spacing
- [ ] Header icons are aligned
- [ ] Safe areas respected on iPhone X+
- [ ] Navigation bar doesn't overlap content

### Performance Testing
- [ ] Smooth tab switching (no lag)
- [ ] Fast history grid scrolling
- [ ] Efficient image loading
- [ ] No memory leaks
- [ ] Animations run at 60 FPS
- [ ] Battery usage reasonable

### Edge Cases
- [ ] Empty history state
- [ ] Empty walks state
- [ ] Long species names (truncation)
- [ ] Very long walk sessions
- [ ] Poor network conditions
- [ ] Offline mode

## Phase 13: Documentation (30 min)

### Update Documentation
- [ ] Update README.md with new navigation
- [ ] Update PHASE_4_1_SUMMARY.md
- [ ] Create ALLTRAILS_MIGRATION_GUIDE.md
- [ ] Document breaking changes
- [ ] Add screenshots to docs
- [ ] Update user flow diagrams

**Files to create/update:**
- `docs/ALLTRAILS_MIGRATION_GUIDE.md`
- `README.md`
- `PHASE_4_1_SUMMARY.md`

## Phase 14: Commit and Push (15 min)

### Git Operations
- [ ] Stage all changes
- [ ] Review diff
- [ ] Write comprehensive commit message
- [ ] Commit changes
- [ ] Push to remote branch
- [ ] Create pull request (if needed)

**Commit Message Template:**
```
Implement AllTrails-style navigation redesign

Simplify navigation from 5 tabs to 3 buttons (Walks, Capture, History)
following AllTrails UX pattern for improved focus and usability.

Features:
- 2-tab bottom navigation (Walks, History)
- Larger center capture button (70px, elevated 30px)
- Walk icon with boot footprints
- History screen with image grid
- Top header with Settings/Profile icons
- New Walk screen with "Start Walk" hero
- Simplified navigation structure

Breaking Changes:
- Removed Map tab (feature postponed)
- Removed Profile tab (moved to header icon)
- Changed default screen to History (was Home)

Files Changed:
- [list files]

🤖 Generated with Claude Code
```

## Estimated Time Breakdown

| Phase | Task | Time |
|-------|------|------|
| 1 | Update navigation types | 30 min |
| 2 | Create walk icon | 30 min |
| 3 | Redesign bottom navigation | 2 hrs |
| 4 | Create AppHeader component | 1 hr |
| 5 | Update History screen | 2 hrs |
| 6 | Create Walk screen | 2 hrs |
| 7 | Update Root Navigator | 1 hr |
| 8 | Update HomeScreen | 30 min |
| 9 | Update Profile access | 30 min |
| 10 | Create Settings screen | 1 hr |
| 11 | Styling and polish | 1 hr |
| 12 | Testing | 1 hr |
| 13 | Documentation | 30 min |
| 14 | Commit and push | 15 min |
| **Total** | | **14 hours** |

## Success Criteria

### Must Have ✅
- [ ] 2-tab bottom navigation working
- [ ] Center capture button prominent and functional
- [ ] Walk screen created and accessible
- [ ] History screen shows image grid
- [ ] Settings/Profile accessible from header
- [ ] Navigation flows work correctly
- [ ] No visual bugs
- [ ] 60 FPS animations

### Nice to Have 🎯
- [ ] Pulsing animation on active capture button
- [ ] Pull to refresh on history
- [ ] Walk statistics dashboard
- [ ] Image loading optimization
- [ ] Offline support indicators

### Future Enhancements 🚀
- [ ] Map view (Phase 7)
- [ ] Walk analytics
- [ ] Social features
- [ ] Advanced filtering
- [ ] Export capabilities

## Risk Assessment

### Low Risk ✅
- Creating new components
- Adding new screens
- Styling updates

### Medium Risk ⚠️
- Navigation structure changes (test thoroughly)
- Bottom tab layout changes
- Image grid performance

### High Risk 🔴
- None identified

## Rollback Plan

If issues arise:
1. Git revert to previous commit
2. Fix issues in separate branch
3. Test thoroughly before re-deploying

Branches:
- Main: `claude/init-n8ture-ai-app-011CUSCnd5FiC6H9kv3qLH9c`
- Backup: Tag current state before starting

## Notes

- Keep 5-tab code commented out initially (easy rollback)
- Test on physical devices, not just simulator
- Get user feedback after implementation
- Consider A/B testing if unsure about changes

---

**Ready to Begin:** ✅ Yes
**Dependencies:** None
**Blocking Issues:** None
**Target Completion:** 1-2 days
