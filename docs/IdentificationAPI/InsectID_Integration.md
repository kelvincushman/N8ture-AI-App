# Insect.ID API Integration Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

This guide provides instructions for integrating the **Kindwise Insect.ID API** as a specialized engine for insect identification. This will significantly improve the accuracy of insect identification within the N8ture app.

### Why Insect.ID?

-   **Specialized for Insects:** Highly accurate for insect and other terrestrial invertebrate identification, with a database of over 14,000 taxa.
-   **High Accuracy:** 92% accuracy in the top 3 results.
-   **Rich Data:** Provides extensive data, including danger level, ecological role, and conservation status.
-   **Commercial Focus:** Designed for business use with a clear pricing model and support.

---

## Pricing

Kindwise offers a credit-based system with a free trial.

| Tier | Cost per Identification | Minimum Order | Key Features |
| :--- | :--- | :--- | :--- |
| **Free Trial** | €0 | N/A | 100 free credits upon registration. |
| **Business** | €0.05 - €0.01 (tiered) | €50 | Pay-as-you-go, volume discounts. |
| **Custom** | Custom | N/A | Custom models and pricing for large-scale needs. |

Each identification costs **1 credit**. For N8ture, starting with the Business tier and purchasing a block of credits is the recommended approach.

---

## Integration Steps

### 1. Create a Kindwise Account

Register for an account on the [Kindwise website](https://www.kindwise.com/) and obtain your API key from the admin panel.

### 2. Implement the `identifyInsect` Function

Create a new function to handle calls to the Insect.ID API. The API expects a POST request with the image data.

```typescript
const INSECTID_API_KEY = process.env.INSECTID_API_KEY;

async function identifyWithInsectID(imageBase64: string) {
  const url = "https://insect.kindwise.com/api/v1/identification";

  const headers = {
    "Api-Key": INSECTID_API_KEY,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    images: [imageBase64],
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Insect.ID API error: ${response.statusText}`);
    }

    const json = await response.json();
    return json;

  } catch (error) {
    console.error("Error calling Insect.ID API:", error);
    throw new Error("Failed to identify species with Insect.ID.");
  }
}
```

### 3. Adapt the Response

Create a function to map the Insect.ID response to the standard `SpeciesIdentification` model.

```typescript
function adaptInsectIDResponse(insectIDResult: any): SpeciesIdentification {
  const topResult = insectIDResult.result.classification.suggestions[0];

  return {
    commonName: topResult.details.common_names[0] || 'Unknown',
    scientificName: topResult.name,
    confidence: topResult.probability * 100, // Convert to percentage
    category: 'insect',
    // ... map other fields like description, habitat, etc.
  };
}
```

### 4. Integrate into the Identification Workflow

Use a similar hybrid approach as with PlantNet. If Gemini identifies a species as an **insect** with lower confidence, call Insect.ID for a more accurate result.

```typescript
export const identifySpecies = async (
  // ... params
): Promise<SpeciesIdentification> => {
  // ...

  const geminiResult = await identifyWithGemini(imageBase64, 'insect');

  if (geminiResult.category === 'insect' && geminiResult.confidence < 90) {
    try {
      const insectIDResultRaw = await identifyWithInsectID(imageBase64);
      const insectIDResult = adaptInsectIDResponse(insectIDResultRaw);

      if (insectIDResult.confidence > geminiResult.confidence) {
        return insectIDResult; // Insect.ID is more confident
      }

    } catch (insectIDError) {
      console.warn("Insect.ID call failed, using Gemini result:", insectIDError.message);
    }
  }

  return geminiResult;
};
```

---

## Best Practices

-   **Use a Centralized Client:** Create a single, reusable client for all Kindwise API calls to manage authentication and error handling consistently.
-   **Monitor Credit Usage:** Keep an eye on your credit balance in the Kindwise admin panel to avoid service interruptions.
-   **Secure Your API Key:** Store your Insect.ID API key securely in your environment variables.
-   **Fallback Strategy:** Always have a fallback to the Gemini result in case the Insect.ID API is unavailable or returns an error.

