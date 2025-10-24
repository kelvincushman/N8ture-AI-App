# Gemini API Integration Guide

This document provides a detailed guide for integrating the Google Gemini API into the React Expo version of the N8ture AI App. The integration will follow the specifications outlined in the `AppStructure_PRD.md`.

## 1. Overview

The goal is to replace the existing Replicate API integration with a direct integration to the Google Gemini API. This will provide several benefits, including reduced latency, lower costs, and access to more advanced features like multimodal input and chat capabilities.

## 2. Architecture

The integration will follow a client-server architecture where the React Expo app communicates with a backend service (Firebase Cloud Functions) that, in turn, makes requests to the Gemini API. This approach is crucial for securely managing the API key.

**Flow:**

`React Expo App` -> `Firebase Cloud Functions` -> `Google Gemini API`

## 3. Backend Setup (Firebase Cloud Functions)

As per the PRD, a new set of Firebase Cloud Functions will be created to handle requests to the Gemini API.

### 3.1. New Module

A new file, `functions/api/gemini.js`, will be created to house the Gemini-related functions.

```javascript
// functions/api/gemini.js

const functions = require("firebase-functions");
const axios = require("axios");
const { getGeminiApiKey } = require("../config/gemini.config");

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

// Function to generate text
exports.geminiGenerateText = functions.https.onCall(async (data, context) => {
  const apiKey = await getGeminiApiKey();
  const { prompt, model = 'gemini-2.5-flash' } = data;

  try {
    const response = await axios.post(`${GEMINI_BASE_URL}${model}:generateContent?key=${apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Gemini API error:", error.response.data);
    throw new functions.https.HttpsError('internal', 'Error calling Gemini API', error.response.data);
  }
});

// Add other functions for image analysis, chat, etc.
```

### 3.2. API Key Management

The Gemini API key will be stored securely using Google Cloud Secret Manager, as specified in the PRD. A configuration file will be responsible for fetching the key.

```javascript
// functions/config/gemini.config.js

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getGeminiApiKey() {
  const [version] = await client.accessSecretVersion({
    name: 'projects/YOUR_PROJECT_ID/secrets/GEMINI_API_KEY/versions/latest',
  });
  return version.payload.data.toString();
}

module.exports = { getGeminiApiKey };
```

## 4. Frontend Setup (React Expo)

On the client-side, a service will be created to make requests to the Firebase Cloud Functions.

### 4.1. Gemini Service

Create a new file, `services/geminiService.js`, to handle all interactions with the backend.

```javascript
// services/geminiService.js

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const geminiGenerateText = httpsCallable(functions, 'geminiGenerateText');

export const generateText = async (prompt) => {
  try {
    const result = await geminiGenerateText({ prompt });
    return result.data;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

// Add other functions to call the respective cloud functions
```

### 4.2. Usage in a Component

Here is an example of how to use the `geminiService` within a React component.

```javascript
// screens/IdentificationScreen.js

import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { generateText } from '../services/geminiService';

const IdentificationScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleIdentify = async () => {
    setLoading(true);
    try {
      const response = await generateText(prompt);
      setResult(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error(error);
      setResult('Error identifying species.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter a description of the species"
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Identify" onPress={handleIdentify} disabled={loading} />
      {loading && <Text>Identifying...</Text>}
      {result && <Text>{result}</Text>}
    </View>
  );
};

export default IdentificationScreen;
```

## 5. Dependencies

The following dependencies need to be installed:

- **Backend (Firebase Functions):**
  - `firebase-functions`
  - `firebase-admin`
  - `@google-cloud/secret-manager`
  - `axios`

- **Frontend (React Expo):**
  - `firebase`

This guide provides a foundational implementation for integrating the Gemini API. The specific implementation details for image analysis, chat, and other features will follow a similar pattern, as outlined in the `AppStructure_PRD.md`.

