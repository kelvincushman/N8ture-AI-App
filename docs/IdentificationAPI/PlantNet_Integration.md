# PlantNet API Integration Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

This guide provides instructions for integrating the **Pl@ntNet API** as a specialized engine for plant identification within the N8ture app. Using PlantNet in parallel with Gemini can improve accuracy and provide a fallback option.

### Why PlantNet?

-   **Specialized for Plants:** Highly accurate for plant identification, with a database of over 50,000 species.
-   **Community-Powered:** Continuously updated with data from a massive community of botanists and enthusiasts.
-   **Cost-Effective:** Offers a generous free tier suitable for many applications.
-   **European Focus:** Strong coverage of European flora, aligning with N8ture's initial launch market.

---

## Pricing

PlantNet offers a simple and affordable pricing structure.

| Tier | Cost | Identifications | Key Requirement |
| :--- | :--- | :--- | :--- |
| **Free** | €0 | 500 per day | Must display "powered by Pl@ntNet" logo. |
| **Non-Profit** | €0 | >500 per day (on request) | For registered non-profits; requires logo. |
| **Pro** | €1,000/year + usage | Pay-as-you-go | No logo required; tiered pricing for high volume. |

For N8ture's initial launch, the **Free** or **Non-Profit** tier is recommended.

---

## Integration Steps

### 1. Create a PlantNet Account

Register for an account on the [Pl@ntNet API website](https://my.plantnet.org/) and generate your private API key.

### 2. Implement the `identifyPlant` Function

Create a new function in your service layer to handle calls to the PlantNet API. This function will take the image data and send it as a `multipart/form-data` request.

```typescript
import FormData from 'form-data';
import fs from 'fs'; // Use a suitable library for your environment

const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY;

async function identifyWithPlantNet(imagePath: string) {
  const form = new FormData();
  form.append('organs', 'auto'); // Or specify 'leaf', 'flower', etc.
  form.append('images', fs.createReadStream(imagePath));

  const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`PlantNet API error: ${response.statusText}`);
    }

    const json = await response.json();
    return json;

  } catch (error) {
    console.error("Error calling PlantNet API:", error);
    throw new Error("Failed to identify species with PlantNet.");
  }
}
```

### 3. Adapt the Response

The PlantNet response format is different from Gemini's. Create a function to map the PlantNet result to the standard `SpeciesIdentification` model used in N8ture.

```typescript
function adaptPlantNetResponse(plantNetResult: any): SpeciesIdentification {
  const topResult = plantNetResult.results[0];

  return {
    commonName: topResult.species.commonNames[0] || 'Unknown',
    scientificName: topResult.species.scientificNameWithoutAuthor,
    confidence: topResult.score * 100, // Convert score to percentage
    category: 'plant',
    // ... map other fields as available
  };
}
```

### 4. Integrate into the Identification Workflow

Modify the main `identifySpecies` function to use PlantNet as a specialized engine for plants.

**Strategy: Hybrid Approach**

1.  First, call Gemini for a general identification.
2.  If Gemini identifies the species as a **plant** with less than 95% confidence, call PlantNet for a second opinion.
3.  Compare the results and return the one with the higher confidence score.

```typescript
export const identifySpecies = async (
  // ... params
): Promise<SpeciesIdentification> => {
  // ...

  const geminiResult = await identifyWithGemini(imageBase64, 'plant');

  if (geminiResult.category === 'plant' && geminiResult.confidence < 95) {
    try {
      const plantNetResultRaw = await identifyWithPlantNet(imagePath); // You'll need the image path
      const plantNetResult = adaptPlantNetResponse(plantNetResultRaw);

      if (plantNetResult.confidence > geminiResult.confidence) {
        return plantNetResult; // PlantNet is more confident
      }

    } catch (plantNetError) {
      console.warn("PlantNet call failed, using Gemini result:", plantNetError.message);
    }
  }

  return geminiResult;
};
```

---

## Best Practices

-   **Use High-Quality Images:** As with Gemini, clear, well-lit images are crucial for accuracy.
-   **Specify Organs:** If possible, allow users to specify the plant organ (leaf, flower, fruit) to improve results.
-   **Attribute Correctly:** If using the free tier, ensure the "powered by Pl@ntNet" logo is displayed in the app when PlantNet results are shown.
-   **Handle Failures:** If the PlantNet API call fails, gracefully fall back to the Gemini result.

