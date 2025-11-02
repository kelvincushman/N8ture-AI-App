# Quick Start Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This guide provides a step-by-step walkthrough for making your first call to the N8ture Identification API from the mobile application. It covers authentication, request preparation, API invocation, and response handling.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Firebase Project:** A configured Firebase project for the N8ture app.
2.  **Authenticated User:** The user must be signed in through Firebase Authentication.
3.  **Image Data:** An image of a species to identify, encoded in Base64 format.

---

## Step 1: Get the Firebase Auth Token

The API requires a valid Firebase ID token for authentication. The mobile app should already handle user authentication. You can get the current user's token like this:

```typescript
import { auth } from './firebase'; // Your firebase config

const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};
```

This token will be automatically included in the `Authorization` header when using the `callFunction` helper.

## Step 2: Prepare the Image

The image must be a **Base64-encoded string**. The mobile app's camera module should provide this. 

**Important:** Ensure the Base64 string does **not** include the data URI prefix (e.g., `data:image/jpeg;base64,`).

```typescript
// Example of preparing an image from a file URI (using Expo)
import * as FileSystem from 'expo-file-system';

const imageUri = 'file:///path/to/your/image.jpg';
const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
  encoding: FileSystem.EncodingType.Base64,
});
```

## Step 3: Call the `identifySpecies` Function

Use the `identifySpecies` function from `identificationService.ts`. This function wraps the Firebase Cloud Function call and handles request/response typing.

```typescript
import { identifySpecies } from '../services/identificationService';
import { SpeciesCategory } from '../types/identification';

async function getIdentification(imageBase64: string) {
  try {
    console.log('Identifying species...');
    const category: SpeciesCategory = 'plant'; // Optional hint

    const identificationResult = await identifySpecies(imageBase64, category);

    console.log('Identification successful:', identificationResult.commonName);
    return identificationResult;

  } catch (error) {
    console.error('Identification failed:', error.message);
    // Handle the error in your UI
  }
}
```

## Step 4: Handle the Response

A successful response will be a `SpeciesIdentification` object. You can then use this data to display the results to the user.

```typescript
function displayResult(result: SpeciesIdentification) {
  console.log(`Common Name: ${result.commonName}`);
  console.log(`Scientific Name: ${result.scientificName}`);
  console.log(`Confidence: ${result.confidence}%`);
  console.log(`Description: ${result.description}`);
  // ... and so on
}
```

## Full Example

Here is a complete example of how to use the service in a React Native component.

```typescript
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { identifySpecies } from '../services/identificationService';
import { SpeciesIdentification } from '../types/species';

const IdentificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SpeciesIdentification | null>(null);

  const handleIdentify = async () => {
    // 1. Pick an image
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera permission is needed to identify species.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (pickerResult.canceled) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // 2. Prepare the image
      const imageUri = pickerResult.assets[0].uri;
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 3. Call the API
      const identification = await identifySpecies(imageBase64, 'plant');

      // 4. Handle the response
      setResult(identification);

    } catch (error: any) {
      Alert.alert('Identification Failed', error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Button title="Identify Plant" onPress={handleIdentify} disabled={isLoading} />
      {isLoading && <Text>Identifying...</Text>}
      {result && (
        <View>
          <Text>Common Name: {result.commonName}</Text>
          <Text>Confidence: {result.confidence}%</Text>
        </View>
      )}
    </View>
  );
};

export default IdentificationScreen;
```

## Next Steps

Now that you know how to make a basic API call, explore the other documentation to understand the full capabilities of the Identification API:

-   **[API Reference](./API_REFERENCE.md):** For detailed endpoint information.
-   **[Data Models](./DATA_MODELS.md):** To understand the structure of the data.
-   **[Error Handling](./ERROR_HANDLING.md):** For a full list of possible errors.

