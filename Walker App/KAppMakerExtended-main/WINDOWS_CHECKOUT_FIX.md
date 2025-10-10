# Windows Git Checkout Issue - Troubleshooting Guide

## Problem
The Journey Tracking LocationManager files exist in the git repository (verified on Linux server) but are not appearing in your Windows checkout after `git pull` or `git reset --hard`.

## Files That Should Exist

These files ARE in the repository (committed in 95073b8 - Phase 2A):

```
composeApp/src/commonMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.kt
composeApp/src/androidMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.android.kt
composeApp/src/iosMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.ios.kt
```

## Verification Commands (Run in PowerShell from repository root)

### 1. Verify files are in git index
```powershell
git ls-tree HEAD composeApp/src/commonMain/kotlin/com/measify/kappmaker/domain/location/
git ls-tree HEAD composeApp/src/androidMain/kotlin/com/measify/kappmaker/domain/location/
git ls-tree HEAD composeApp/src/iosMain/kotlin/com/measify/kappmaker/domain/location/
```

**Expected:** Should show blob entries for LocationManager files

### 2. Check if files exist in working directory
```powershell
Test-Path "composeApp\src\commonMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.kt"
Test-Path "composeApp\src\androidMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.android.kt"
Test-Path "composeApp\src\iosMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.ios.kt"
```

**Expected:** Should return `True` for all three

### 3. Check git status
```powershell
git status
```

**Expected:** Should show "working tree clean" with no deleted files

## Potential Fixes

### Fix 1: Enable Long Paths on Windows
Windows has a 260 character path limit that might be causing issues.

```powershell
# Run as Administrator
git config --system core.longpaths true
```

Then try:
```powershell
git reset --hard HEAD
```

### Fix 2: Check Line Endings Configuration
```powershell
# Check current setting
git config core.autocrlf

# Set to true (recommended for Windows)
git config --global core.autocrlf true

# Re-checkout
git rm --cached -r .
git reset --hard HEAD
```

### Fix 3: Case Sensitivity Issue
Windows is case-insensitive. Check for conflicting filenames:

```powershell
git ls-files | Select-String -Pattern "location" -CaseSensitive
```

### Fix 4: Force Checkout Specific Files
Try checking out the files explicitly:

```powershell
git checkout HEAD -- composeApp/src/commonMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.kt
git checkout HEAD -- composeApp/src/androidMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.android.kt
git checkout HEAD -- composeApp/src/iosMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.ios.kt
```

### Fix 5: Fresh Clone (Nuclear Option)
If nothing else works, try a fresh clone:

```powershell
cd C:\Users\kelvi\AndroidStudioProjects
git clone https://github.com/kelvincushman/N8ture-AI-App.git N8ture-AI-App-fresh
cd N8ture-AI-App-fresh
```

Then compare the two repositories.

### Fix 6: Verify Repository Integrity
```powershell
git fsck --full
```

## Manual File Extraction (Last Resort)

If git won't checkout the files, you can extract them manually from the repository:

```powershell
# Extract LocationManager.kt
git show HEAD:composeApp/src/commonMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.kt > composeApp\src\commonMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.kt

# Extract LocationManager.android.kt
git show HEAD:composeApp/src/androidMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.android.kt > composeApp\src\androidMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.android.kt

# Extract LocationManager.ios.kt
git show HEAD:composeApp/src/iosMain/kotlin/com/measify/kappmaker/domain/location/LocationManager.ios.kt > composeApp\src\iosMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.ios.kt
```

## What to Report Back

Please run these commands and report the results:

```powershell
# 1. Are files in git index?
git ls-tree HEAD composeApp/src/commonMain/kotlin/com/measify/kappmaker/domain/location/

# 2. Do files exist on disk?
Test-Path "composeApp\src\commonMain\kotlin\com\measify\kappmaker\domain\location\LocationManager.kt"

# 3. Current git config
git config core.autocrlf
git config core.longpaths

# 4. Git status
git status
```

This will help diagnose exactly what's happening on your Windows machine.
