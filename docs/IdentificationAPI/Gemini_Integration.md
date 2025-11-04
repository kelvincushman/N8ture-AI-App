# Gemini 2.5 Flash Integration Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

This guide provides instructions for integrating **Google's Gemini 2.5 Flash** model as the primary engine for the N8ture Identification API. Switching to Gemini 2.5 Flash offers a state-of-the-art, cost-effective, and highly accurate solution for species identification.

### Why Gemini 2.5 Flash?

-   **Massive Cost Savings:** Up to **99% cheaper** than previous models for image-based identification.
-   **High Performance:** Optimized for large-scale, low-latency tasks.
-   **Multimodal:** Natively handles images, text, and audio, allowing for future expansion (e.g., identifying birds by their song).
-   **Long Context:** Supports a 1 million token context window, enabling more complex and detailed analysis.

---

## Pricing

Gemini 2.5 Flash offers a generous free tier and highly competitive pay-as-you-go pricing.

| Tier | Input Price (per 1M tokens) | Output Price (per 1M tokens) | Free Tier Details |
| :--- | :--- | :--- | :--- |
| **Free** | Free of charge | Free of charge | Generous limits for development and small projects. |
| **Paid** | $0.30 (for images) | $2.50 | Higher rate limits, access to advanced features. |

**Cost per Identification (Estimated):**
An average identification uses approximately 1,500 tokens (input + output). With Gemini 2.5 Flash, this translates to a cost of less than **$0.004 per identification**, making it an extremely affordable solution at scale.

---

## Integration Steps

### 1. Set Up Google Cloud Project

Ensure you have a Google Cloud project with the Vertex AI API enabled. You will need to create a service account with the appropriate permissions to access the Gemini API.

### 2. Install the Google AI SDK

In your Firebase Cloud Functions environment, install the necessary SDK:

```bash
npm install @google/generative-ai
```

### 3. Initialize the Gemini API Client

In your `identificationService.ts` or a new `geminiService.ts` file, initialize the client with your API key.

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

### 4. Implement the `identifySpecies` Function

Create a function that takes the Base64 image data and sends it to the Gemini API.

```typescript
async function identifyWithGemini(imageBase64: string, categoryHint?: string) {
  const prompt = `
    Identify the species in this image. Provide the following information in JSON format:
    - commonName: The most common name.
    - scientificName: The scientific name.
    - confidence: Your confidence in the identification (0-100).
    - category: The species category (plant, animal, fungi, insect).
    - description: A brief description.
    - habitat: Its natural habitat.
    - edibility: EDIBLE, INEDIBLE, POISONOUS, CAUTION, or UNKNOWN.
    - edibilityNotes: Any notes on edibility.
    - identificationFeatures: Key features for identification.
    - similarSpecies: A list of similar-looking species.
    - conservationStatus: The IUCN conservation status.

    Category hint: ${categoryHint || 'unknown'}
  `;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/jpeg",
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    const jsonText = text.replace(/```json\n|```/g, '');
    const identification = JSON.parse(jsonText);

    return identification;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to identify species with Gemini.");
  }
}
```

### 5. Update the Main `identifySpecies` Function

Modify your existing `identifySpecies` function to call the new `identifyWithGemini` function.

```typescript
export const identifySpecies = async (
  imageBase64: string,
  category?: SpeciesCategory
): Promise<SpeciesIdentification> => {
  // ... (existing code for authentication, rate limiting, etc.)

  try {
    const result = await identifyWithGemini(imageBase64, category);
    // ... (save to history, etc.)
    return result;
  } catch (error) {
    // ... (error handling)
  }
};
```

---

## Best Practices

-   **Prompt Engineering:** Refine the prompt to get the most accurate and consistently formatted JSON response.
-   **Error Handling:** Implement robust error handling for API calls, including retries for transient errors.
-   **Image Pre-processing:** Before sending to the API, ensure images are of reasonable quality and size to reduce costs and improve accuracy.
-   **Secure Your API Key:** Store your Gemini API key securely using Firebase environment variables or Google Cloud Secret Manager.

