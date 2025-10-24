# Clerk Authentication - Quick Start Guide

Get up and running with Clerk authentication in 5 minutes.

## Step 1: Get Clerk API Key

1. Go to https://dashboard.clerk.com
2. Sign up or sign in
3. Create a new application (or use existing)
4. Go to "API Keys" section
5. Copy your "Publishable Key" (starts with `pk_test_` or `pk_live_`)

## Step 2: Configure Environment

1. Copy the template:
```bash
cp .env.template .env
```

2. Edit `.env` and add your key:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

## Step 3: Configure Clerk Dashboard

### Enable Email/Password Authentication
1. In Clerk Dashboard, go to "User & Authentication"
2. Under "Email, Phone, Username", enable "Email address"
3. Under "Authentication strategies", enable "Password"

### Enable Google OAuth (Optional)
1. Go to "User & Authentication" > "Social Connections"
2. Enable "Google"
3. Follow instructions to set up Google OAuth credentials

### Configure Email Settings
1. Go to "Emails" section
2. Verify email settings are correct
3. Optionally customize email templates

## Step 4: Run the App

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm start

# On iOS simulator
npm run ios

# On Android emulator
npm run android
```

## Step 5: Test Authentication

### Test Sign-Up
1. Open the app
2. Tap "Sign In" button in header
3. Switch to "Sign Up" tab
4. Enter email: `test@example.com`
5. Enter password: `password123`
6. Tap "Create Account"
7. Check email for verification code
8. Enter 6-digit code
9. Should redirect to home screen

### Test Sign-In
1. Tap "Sign In" button in header
2. Enter your credentials
3. Tap "Sign In"
4. Should redirect to home screen

### Test Trial System
1. Sign in to your account
2. Look at trial badge (should show "3 / 3")
3. Tap "Open Camera" button
4. Alert shows "Camera will open here"
5. Trial badge updates to "2 / 3"
6. Repeat until trials exhausted
7. Paywall alert should appear

### Test Profile
1. Tap "Profile" in header
2. View your information
3. See trial status
4. Tap "Sign Out"
5. Should return to home screen

## Step 6: Update User Metadata (Optional)

To test premium features, manually set user metadata in Clerk Dashboard:

1. Go to Clerk Dashboard > Users
2. Click on a user
3. Go to "Metadata" tab
4. Add to "Public metadata":

```json
{
  "isPremium": true,
  "subscriptionTier": "monthly",
  "subscriptionExpiry": "2025-12-31T00:00:00.000Z",
  "trialsUsed": 0,
  "totalIdentifications": 0
}
```

5. Save changes
6. Reload app
7. Should show "Premium Monthly" badge

## Common Issues

### Issue: "Clerk publishable key is required"
**Solution**: Make sure `.env` file exists and contains `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Issue: "Network request failed"
**Solution**: Check internet connection and verify Clerk API key is correct

### Issue: Email verification not working
**Solution**:
- Check spam folder
- Verify email settings in Clerk Dashboard
- Use a real email address (not temporary/disposable)

### Issue: Google OAuth not opening
**Solution**:
- Verify Google OAuth is enabled in Clerk Dashboard
- Check redirect URL configuration
- Ensure expo-web-browser is installed

### Issue: Trial count not updating
**Solution**:
- Check network connection (requires sync with Clerk)
- Verify user is signed in
- Check console for errors

## Next Steps

After authentication is working:

1. **Implement Paywall**: Create subscription screen
2. **Add Payment**: Integrate Stripe or RevenueCat
3. **Build Camera**: Implement camera capture
4. **Add History**: Show past identifications
5. **Production Setup**: Switch to live Clerk keys

## Development Tips

### Debug User State
```typescript
import { useAuth } from './src/hooks/useAuth';

function DebugComponent() {
  const { userProfile } = useAuth();
  console.log('User:', userProfile);
  console.log('Metadata:', userProfile?.metadata);
}
```

### Clear Session
To test sign-in/sign-up flows, clear app data:
- iOS: Delete and reinstall app
- Android: Settings > Apps > N8ture AI > Clear Data

### Test Different States
1. **Not signed in**: Test auth requirement
2. **Free user (trials remaining)**: Test trial system
3. **Free user (no trials)**: Test paywall
4. **Premium user**: Test unlimited access

## Production Checklist

Before going to production:

- [ ] Switch to live Clerk keys (`pk_live_...`)
- [ ] Configure production OAuth redirect URLs
- [ ] Set up Clerk webhooks for subscription sync
- [ ] Implement actual payment processor
- [ ] Add error tracking (Sentry, etc.)
- [ ] Test all flows thoroughly
- [ ] Update privacy policy to mention Clerk
- [ ] Configure rate limiting
- [ ] Set up monitoring

## Resources

- Full Guide: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Implementation Details: [AUTHENTICATION_IMPLEMENTATION_SUMMARY.md](./AUTHENTICATION_IMPLEMENTATION_SUMMARY.md)
- Clerk Docs: https://clerk.com/docs
- Clerk Dashboard: https://dashboard.clerk.com

## Support

If you encounter issues:
1. Check Clerk Dashboard for user data
2. Review console logs
3. Verify environment variables
4. Test with fresh account
5. Check Clerk status page: https://status.clerk.com
