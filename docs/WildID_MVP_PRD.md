# Product Requirements Document (PRD)
# WildID: Wildlife & Plant Identification App - MVP
## Version 1.0 - Freemium Model

---

## 1. Executive Summary

### 1.1 Product Overview
**Product Name:** WildID (formerly WalkersApp)  
**Platform:** iOS & Android (Kotlin Multiplatform)  
**Category:** Education/Outdoor/Nature  
**Target Launch:** Q1 2025 MVP  

### 1.2 Product Vision
WildID is an AI-powered mobile application that empowers nature enthusiasts, hikers, foragers, and outdoor adventurers to instantly identify wildlife, plants, and fungi through their smartphone camera, providing critical safety information about edibility and potential benefits.

### 1.3 Problem Statement
Nature enthusiasts and outdoor adventurers often encounter unknown plants, animals, and fungi but lack immediate access to reliable identification and safety information, potentially putting them at risk or missing educational opportunities.

### 1.4 Solution
A mobile-first, AI-powered identification app with a "try-before-you-buy" freemium model that allows users to test core functionality before committing to a subscription.

---

## 2. Business Model

### 2.1 Monetization Strategy: Freemium Model

#### Free Tier (Trial Experience)
- **3 free identifications** per user (lifetime)
- Access to basic species information
- View safety warnings (edibility status)
- Basic save to history feature
- Limited to low-resolution image capture

#### Premium Subscription ($4.99/month or $39.99/year)
- Unlimited identifications
- High-resolution image capture
- Advanced species information:
  - Detailed habitat information
  - Seasonal availability
  - Herbal/medicinal uses
  - Cooking/preparation methods
- Offline mode for saved species
- Location-based species tracking
- Personal identification journal
- Export identification history
- Priority AI processing
- Ad-free experience

### 2.2 Target Users

#### Primary Users
1. **Nature Enthusiasts** (35%)
   - Age: 25-45
   - Interests: Hiking, photography, wildlife
   - Pain point: Species identification

2. **Foragers** (30%)
   - Age: 30-55
   - Interests: Wild food, sustainability
   - Pain point: Safety and edibility

3. **Parents/Educators** (20%)
   - Age: 30-50
   - Interests: Education, family activities
   - Pain point: Teaching tool for nature

4. **Outdoor Professionals** (15%)
   - Age: 25-60
   - Interests: Park rangers, guides, researchers
   - Pain point: Quick field reference

---

## 3. Core Features (MVP)

### 3.1 Onboarding & Trial Experience

#### Welcome Flow
1. **Splash Screen** (2 seconds)
   - App logo and tagline: "Discover Nature Safely"

2. **Value Proposition Screens** (3 slides)
   - Slide 1: "Identify Any Species Instantly"
   - Slide 2: "Know What's Safe to Touch or Eat"
   - Slide 3: "Try 3 Free Identifications"

3. **Permission Requests**
   - Camera access (required)
   - Location access (optional - for better results)
   - Photo library access (optional)

4. **Trial Activation**
   - No sign-up required for first 3 uses
   - Clear counter showing remaining free uses
   - "Upgrade" button always visible but non-intrusive

### 3.2 Core Identification Features

#### Camera Capture Module
- **Quick Capture Mode**: Point and shoot
- **Guided Capture**: On-screen guides for optimal framing
- **Multi-angle Option**: Capture up to 3 angles (premium)
- **Gallery Upload**: Select from existing photos

#### AI Identification Engine
- **Species Categories**:
  - Plants (flowers, trees, shrubs)
  - Wildlife (mammals, birds, reptiles)
  - Fungi (mushrooms, molds)
  - Insects (butterflies, beetles, spiders)

#### Results Display
- **Confidence Score**: Percentage match (e.g., "92% confident")
- **Primary Match**: Most likely species
- **Alternative Matches**: 2-3 other possibilities
- **Safety Indicator**: 
  - 🟢 Green: Safe/Edible
  - 🟡 Yellow: Caution/Conditional
  - 🔴 Red: Dangerous/Poisonous
  - ⚪ Gray: Unknown/Insufficient data

### 3.3 Species Information Display

#### Basic Information (Free Tier)
- Common name
- Scientific name
- Species family
- Primary safety warning
- Basic description (100 words)
- 1 reference image

#### Premium Information
- Detailed description (500+ words)
- Multiple high-quality images
- Habitat and distribution maps
- Seasonal availability calendar
- Similar species comparison
- Edibility details and preparation
- Medicinal/herbal uses
- Conservation status
- Fun facts and trivia
- Audio (bird calls, animal sounds)

### 3.4 User Account & Management

#### Account Creation (Post-Trial)
- Email/password
- Social login (Google, Apple, Facebook)
- Profile customization:
  - Username
  - Avatar
  - Bio
  - Experience level

#### History & Collections
- **Identification History**: 
  - Last 10 (free)
  - Unlimited (premium)
- **Personal Collections**: Create themed lists
- **Favorites**: Quick access to saved species
- **Location Map**: Where you've identified species

### 3.5 Paywall & Subscription

#### Paywall Triggers
1. After 3rd free identification
2. When accessing premium features
3. Optional: Time-based (24 hours after install)

#### Paywall Design
- **Header**: "Unlock Unlimited Discoveries"
- **Benefits List**: 
  - ✓ Unlimited identifications
  - ✓ Advanced species information
  - ✓ Offline mode
  - ✓ Priority processing
  - ✓ Ad-free experience
- **Pricing Options**:
  - Monthly: $4.99/month
  - Annual: $39.99/year (Save 33%)
  - Special: 7-day free trial for annual
- **Restore Purchase** button
- **Continue with Limited** option

---

## 4. Technical Requirements

### 4.1 Platform Specifications

#### Android
- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Architecture: Kotlin Multiplatform Mobile

#### iOS
- Minimum: iOS 14.0
- Target: iOS 17.0
- Architecture: Kotlin Multiplatform Mobile

### 4.2 Backend Infrastructure

#### Core Services
- **AI Model Integration**:
  - Primary: Google Gemini Vision API
  - Fallback: TensorFlow Lite on-device
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics
- **Payment Processing**: 
  - iOS: StoreKit 2
  - Android: Google Play Billing 5.0

### 4.3 Performance Requirements

- **App Size**: < 100MB initial download
- **Identification Speed**: < 3 seconds
- **Camera to Result**: < 5 seconds total
- **Offline Mode**: Last 50 species cached
- **Battery Usage**: < 5% per 10 identifications

---

## 5. User Interface Design

### 5.1 Design Principles
- **Simplicity**: One-tap identification
- **Clarity**: Clear safety indicators
- **Accessibility**: WCAG 2.1 AA compliance
- **Consistency**: Material Design 3 / iOS HIG

### 5.2 Key Screens

#### Home Screen
- Large camera button (center)
- Recent identifications (carousel)
- Quick actions: Camera, Gallery, History
- Profile and settings (top right)
- Trial counter (if applicable)

#### Camera Screen
- Full-screen viewfinder
- Capture button
- Flash toggle
- Gallery access
- Tips overlay (first use)

#### Results Screen
- Species image (hero)
- Confidence score badge
- Safety indicator (prominent)
- Species name and family
- Quick actions: Save, Share, Learn More
- Similar species (horizontal scroll)

#### Species Detail Screen
- Image carousel
- Tabbed information:
  - Overview
  - Identification Tips
  - Safety & Edibility
  - Habitat & Range
  - Similar Species

---

## 6. User Flow Diagrams

### 6.1 First-Time User Flow (Trial)