# WildID User Flow Documentation
## Freemium Model - MVP Version 1.0

---

## 1. User Journey Map Overview

### 1.1 Key User Paths
1. **Discovery Path**: App Store → Download → First Use → Trial
2. **Trial Path**: 3 Free Identifications → Value Realization
3. **Conversion Path**: Paywall → Subscription → Premium Features
4. **Retention Path**: Regular Use → Collections → Community

---

## 2. Detailed User Flows

### 2.1 First-Time User Flow (Trial Experience)

```
START: User discovers app in App Store
    ↓
[App Store Listing]
- See ratings (4.5+ stars)
- Read "Try 3 Free IDs" badge
- View screenshot carousel
    ↓
[Download & Open App]
    ↓
[Splash Screen] (2 seconds)
- WildID logo
- "Discover Nature Safely" tagline
    ↓
[Onboarding Carousel] (3 screens)
Screen 1: "Instantly identify any species"
- Show camera identifying a plant
- "Next" button

Screen 2: "Know what's safe"
- Show safety indicators (green/red)
- "Next" button

Screen 3: "Try 3 FREE identifications"
- Show trial counter (3/3)
- "Get Started" button
    ↓
[Permission Requests]
1. Camera Access (Required)
   - "WildID needs camera access to identify species"
   - [Allow] / [Don't Allow]
   
2. Location Access (Optional)
   - "Enable location for better regional results"
   - [Allow While Using] / [Don't Allow]
    ↓
[Home Screen - Trial Mode]
- Large "Identify" camera button (center)
- Trial badge showing "3 Free IDs Remaining"
- No sign-in required
    ↓
[First Identification Flow]
```

### 2.2 Identification Flow (Core Feature)

```
[User Taps Camera Button]
    ↓
[Camera Screen Opens]
- Full screen viewfinder
- Auto-focus on center
- Guide overlay: "Center the species"
    ↓
[User Points at Species]
    ↓
[Tap Capture Button]
    ↓
[Processing Screen] (2-3 seconds)
- Loading animation
- "Identifying..." text
- Tips: "Did you know?" facts
    ↓
[Results Screen]

Layout:
┌─────────────────────────┐
│   [Species Image]       │
│                         │
│  ⚠️ SAFETY: EDIBLE 🟢    │
│                         │
│  Eastern Wild Ginger    │
│  Asarum canadense       │
│  Confidence: 94%        │
│                         │
│  [Save] [Share] [More]  │
│                         │
│  Description:           │
│  A low-growing...       │
│                         │
│  Similar Species ↓      │
│  [Image] [Image]        │
└─────────────────────────┘
    ↓
[Trial Counter Updates]
- "2 Free Identifications Remaining"
- Subtle animation drawing attention
    ↓
[User Options]
A. Continue Identifying → Camera
B. View Details → Species Info
C. Save to History → Saved
D. Share → Share Sheet
```

### 2.3 Paywall Trigger Flow

```
[User Completes 3rd Free Identification]
    ↓
[Results Display Normally First]
- Show complete results
- Let user explore
    ↓
[After 5 seconds or on "Identify Again"]
    ↓
[Paywall Screen Appears]

Layout:
┌─────────────────────────┐
│      🌿 WildID Pro      │
│                         │
│ "You've used all 3     │
│  free identifications"  │
│                         │
│  Continue Exploring     │
│  Nature Unlimited!      │
│                         │
│  ✓ Unlimited IDs        │
│  ✓ Detailed Info        │
│  ✓ Offline Mode         │
│  ✓ Location Tracking    │
│  ✓ Priority Processing  │
│                         │
│ ┌─────────────────────┐ │
│ │  $4.99/month       │ │
│ │  Most Popular       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │  $39.99/year       │ │
│ │  Save 33%          │ │
│ │  7-day free trial  │ │
│ └─────────────────────┘ │
│                         │
│ [Start Free Trial]      │
│                         │
│ Restore Purchase        │
│ Continue Limited        │
└─────────────────────────┘
    ↓
[User Decision Point]

Path A: Subscribe
    ↓
    [Payment Flow]
    - Apple/Google Pay sheet
    - Confirm subscription
    ↓
    [Success Screen]
    - "Welcome to WildID Pro!"
    - Show unlocked features
    ↓
    [Return to Home - Premium]

Path B: Continue Limited
    ↓
    [Limited Mode Notice]
    - "You can browse your history"
    - "Upgrade anytime in settings"
    ↓
    [Home - Limited Mode]
    - Camera button disabled
    - "Upgrade" badge visible
    - Can view history only
```

### 2.4 Premium User Flow

```
[Premium Home Screen]
- No trial counter
- "Pro" badge on profile
- All features unlocked
    ↓
[Enhanced Identification]
    ↓
[Camera Options]
- Multi-angle capture
- Video mode (for animals)
- AR overlay mode
    ↓
[Rich Results]
- Multiple images
- Detailed descriptions
- Interactive range maps
- Seasonal calendar
- Audio (if applicable)
    ↓
[Save to Collections]
- Create custom lists
- Add notes
- Tag locations
- Set reminders
    ↓
[Offline Access]
- Download species for offline
- Access without internet
- Sync when connected
```

---

## 3. Critical User Decisions

### 3.1 Trial Optimization Strategy

#### First Identification
**Goal**: Wow the user
- Ensure high accuracy
- Show safety value immediately
- Display rich information preview
- Tease premium features

#### Second Identification  
**Goal**: Build habit
- Remind of remaining uses (2 left)
- Show history building
- Introduce collections concept

#### Third Identification
**Goal**: Create urgency
- "Last free identification!"
- Show full value
- Perfect timing for conversion

### 3.2 Conversion Points

#### Primary Conversion Point
- After 3rd identification
- User has experienced value
- Natural pause point
- Clear upgrade path

#### Secondary Conversion Points
1. **24 hours after install**
   - Push notification: "2 free IDs remaining"
   
2. **Accessing premium feature**
   - Tapping locked content
   - Show "Upgrade to unlock"
   
3. **Weekly re-engagement**
   - "Discover what's blooming near you"
   - Lead to paywall

### 3.3 Friction Reduction

#### Smooth Trial Experience
- No registration required
- No credit card upfront
- Clear trial counter
- Full results shown (not hidden)

#### Easy Subscription
- One-tap purchase
- Multiple payment options
- Clear pricing
- Free trial for annual

#### Graceful Degradation
- Can still view history
- Can browse saved species
- Can share app
- Clear upgrade prompts

---

## 4. User Interface States

### 4.1 Trial States

```
State 1: Fresh Install (3/3 remaining)
- Full camera access
- Prominent trial counter
- No barriers

State 2: Active Trial (2/3 or 1/3)
- Counter updates
- Gentle upgrade prompts
- Feature previews

State 3: Trial Expired (0/3)
- Camera disabled state
- Clear upgrade CTA
- History still accessible
```

### 4.2 Error States

```
No Internet Connection
- "Offline mode"
- Can view saved species
- Can use camera (queue for later)

Identification Failed
- "Could not identify"
- "Try another angle"
- Suggest manual search

Camera Permission Denied
- Clear explanation
- Settings redirect button
- Alternative: Upload from gallery
```

### 4.3 Success States

```
Successful Identification
- Confidence score >80%: Green badge
- Confidence 60-80%: Yellow badge
- Confidence <60%: Show alternatives

Successful Subscription
- Celebration animation
- "Welcome to Pro!"
- Feature tour offer
```

---

## 5. Engagement Loops

### 5.1 Daily Engagement Loop
```
Morning Notification (8 AM)
    ↓
"Discover today's species"
    ↓
Open app → Featured species
    ↓
Inspired to identify
    ↓
Use camera → Get results
    ↓
Save to collection
    ↓
Share achievement
```

### 5.2 Collection Building Loop
```
Identify species
    ↓
Save to collection
    ↓
See progress (5/10 oak trees)
    ↓
Motivated to complete
    ↓
Go exploring
    ↓
Identify more
```

### 5.3 Social Sharing Loop
```
Amazing identification
    ↓
Share to social media
    ↓
Friends see and download
    ↓
Referral rewards
    ↓
Both get premium month
```

---

## 6. Metrics & Success Indicators

### 6.1 Trial Metrics
- **Trial Start Rate**: 80% use first ID within 1 hour
- **Trial Completion**: 60% use all 3 identifications
- **Time to Complete Trial**: Average 3-7 days

### 6.2 Conversion Metrics
- **Trial to Paid**: Target 25% conversion
- **Paywall View to Purchase**: Target 15%
- **Free Trial to Paid**: Target 70% retention

### 6.3 Engagement Metrics
- **DAU/MAU**: Target 40%
- **Identifications per User**: 10+/month (premium)
- **Session Length**: 5+ minutes average

---

## 7. A/B Testing Opportunities

### 7.1 Trial Variations
- Test A: 3 free IDs (control)
- Test B: 1 free ID + 24-hour unlimited
- Test C: 5 free IDs over 7 days

### 7.2 Paywall Variations
- Test A: After 3rd ID (control)
- Test B: Time-based (24 hours)
- Test C: Soft paywall (can dismiss once)

### 7.3 Pricing Tests
- Test A: $4.99/$39.99 (control)
- Test B: $3.99/$29.99
- Test C: $5.99/$49.99 with more features

---

## 8. Implementation Priority

### Phase 1: Core MVP (Week 1-4)
1. Camera capture
2. AI identification integration
3. Results display
4. Trial counter system
5. Basic paywall

### Phase 2: Engagement (Week 5-8)  
1. User accounts
2. History/Collections
3. Push notifications
4. Sharing features
5. Offline mode

### Phase 3: Optimization (Week 9-12)
1. A/B testing framework
2. Advanced features
3. Social features
4. Gamification
5. Premium content

---

## 9. Next Steps

1. **Validate Flows**: User testing with prototypes
2. **Refine Conversion**: Optimize based on data
3. **Implement Analytics**: Track every step
4. **Iterate**: Continuous improvement based on metrics
5. **Scale**: Add features based on user demand

---

End of User Flow Documentation
