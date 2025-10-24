# Firebase Setup Guide for N8ture AI App

This guide walks you through setting up Firebase and Google Gemini API for the N8ture AI species identification feature.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Google Cloud Platform account
- Firebase project created

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name: `n8ture-ai` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable authentication providers:
   - **Email/Password** (required for Clerk)
   - **Google** (recommended)
4. Save changes

## Step 3: Get Firebase Configuration

### For React Native App

1. In Firebase Console, click the **Settings** gear icon
2. Go to "Project settings"
3. Scroll down to "Your apps"
4. Click the **iOS** icon to add iOS app
   - iOS bundle ID: `com.n8ture.ai` (or your app ID)
   - Download `GoogleService-Info.plist`
5. Click the **Android** icon to add Android app
   - Android package name: `com.n8ture.ai` (or your app ID)
   - Download `google-services.json`

### Firebase Web Config (for React Native)

1. In "Your apps", click "Add app" and select **Web**
2. Register app with nickname: "N8ture AI React Native"
3. Copy the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

4. Create `.env` file in `react-expo-app/`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 4: Get Google Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API key"
3. Create a new API key or use existing one
4. Copy the API key (starts with `AIza...`)

**Important:** Keep this key secure and never commit it to version control!

## Step 5: Set Up Firebase Cloud Functions

### Initialize Firebase in Project

```bash
cd react-expo-app
firebase login
firebase init functions
```

Select:
- Use existing project: `your-project-id`
- Language: **JavaScript**
- ESLint: Yes (recommended)
- Install dependencies: Yes

### Configure Functions

1. The `functions/` directory is already set up with:
   - `package.json` - Dependencies
   - `index.js` - Main functions entry point
   - `services/geminiService.js` - Gemini AI integration
   - `config/secrets.js` - Configuration management

2. Set Gemini API key as secret:

```bash
cd functions
firebase functions:secrets:set GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

### Install Dependencies

```bash
cd functions
npm install
```

### Deploy Functions

```bash
firebase deploy --only functions
```

This will deploy:
- `identifySpecies` - Main species identification function
- `healthCheck` - Health check endpoint

## Step 6: Install React Native Dependencies

```bash
cd react-expo-app
npm install firebase expo-image-manipulator
```

or if using pnpm:

```bash
pnpm install firebase expo-image-manipulator
```

## Step 7: Initialize Firebase in App

Update `App.tsx` to initialize Firebase on startup:

```typescript
import { initializeFirebase, getFirebaseConfigFromEnv } from './src/services/firebase';

// In your App component, before rendering
useEffect(() => {
  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  };

  const result = initializeFirebase(config);
  if (!result.success) {
    console.error('Firebase initialization failed:', result.error);
  }
}, []);
```

## Step 8: Testing

### Test Locally with Emulators (Optional)

```bash
cd functions
firebase emulators:start
```

This starts local emulators for Functions, Firestore, and Authentication.

### Test on Device

1. Build and run the app:
   ```bash
   cd react-expo-app
   npm run ios
   # or
   npm run android
   ```

2. Sign in with test account
3. Navigate to Camera screen
4. Capture an image of a plant, animal, or fungi
5. View identification results

## Step 9: Configure Firestore (Optional - for History)

If you want to save identification history:

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll add rules later)
4. Choose location closest to your users
5. Add security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Identifications collection
    match /identifications/{identificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 10: Monitoring and Debugging

### View Function Logs

```bash
firebase functions:log
```

### Monitor Usage

1. Go to Firebase Console
2. Navigate to **Functions** dashboard
3. View invocations, errors, and execution time

### Monitor Gemini API Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Dashboard"
4. View Gemini API usage and quotas

## Troubleshooting

### "Firebase not initialized" Error

- Ensure you called `initializeFirebase()` in App.tsx
- Check that all environment variables are set in `.env`
- Restart the Metro bundler: `npm start --reset-cache`

### "Authentication required" Error

- User must be signed in with Clerk
- Check that Clerk is properly configured
- Verify Firebase Authentication is enabled

### "API quota exceeded" Error

- You've hit Gemini API free tier limits
- Upgrade to paid tier in Google Cloud Console
- Or wait for quota to reset (usually daily)

### Function Timeout

- Increase timeout in `functions/index.js`:
  ```javascript
  .runWith({
    timeoutSeconds: 120, // Increase to 2 minutes
    memory: '1GB',       // Increase memory
  })
  ```

### Low Confidence Results

- Ensure good lighting when capturing image
- Center the subject in frame
- Capture clear, focused images
- Try different angles or closer shots

## Cost Considerations

### Firebase Free Tier

- Cloud Functions: 2M invocations/month
- Firestore: 1GB storage, 50K reads/day
- Authentication: Unlimited

### Google Gemini API

- Free tier: 60 requests/minute
- Paid tier: Pay per request
- See [pricing](https://ai.google.dev/pricing)

### Estimated Costs

For a small app (1000 identifications/month):
- Firebase: **Free** (within free tier)
- Gemini API: **$0-5/month** (depending on usage)

## Security Best Practices

1. **Never commit API keys** to version control
2. Use **Firebase Secret Manager** for production
3. Enable **App Check** to prevent abuse
4. Set up **Firestore security rules** properly
5. Monitor **function invocations** for unusual activity
6. Implement **rate limiting** in functions
7. Rotate **API keys** periodically

## Next Steps

- Implement Firestore integration for history
- Add image upload to Firebase Storage
- Implement caching for common identifications
- Add analytics for identification accuracy
- Set up A/B testing for prompts

## Support

For issues or questions:
- Firebase: [Firebase Support](https://firebase.google.com/support)
- Gemini API: [Google AI Support](https://ai.google.dev/support)
- N8ture AI: Check repository issues

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
