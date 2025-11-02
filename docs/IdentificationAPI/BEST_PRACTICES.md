# Best Practices

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

To ensure the best performance, reliability, and user experience when using the N8ture Identification API, please follow these best practices.

## Image Quality

High-quality images lead to more accurate identifications. Encourage users to:

-   **Take Clear, Focused Photos:** The subject should be in sharp focus.
-   **Use Good Lighting:** Avoid photos that are too dark or too bright.
-   **Isolate the Subject:** The species to be identified should be the main subject of the photo. Avoid cluttered backgrounds.
-   **Show Key Features:** For plants, include flowers, leaves, and stems. For animals, a clear shot of the face and body is best.

## User Experience

-   **Provide Clear Feedback:** Always indicate when the app is in a loading or processing state.
-   **Display Confidence Scores:** Show the confidence score to the user so they can gauge the reliability of the result.
-   **Encourage Verification:** Prompt users to compare the result with the alternative suggestions and their own observations.
-   **Handle Errors Gracefully:** As outlined in the [Error Handling](./ERROR_HANDLING.md) guide, always show user-friendly error messages.
-   **Educate About Edibility:** Display a prominent warning that users should **never** eat a plant or mushroom based solely on an AI identification.

## API Usage

-   **Use the Service Layer:** Always interact with the API through the `identificationService.ts` functions. Do not make direct calls to the Firebase Cloud Functions.
-   **Cache Data:** Cache identification history and species data on the client to reduce redundant API calls and improve performance.
-   **Secure API Keys:** Although this is an internal API, ensure that any service account keys or other credentials are not exposed on the client side.
-   **Respect Rate Limits:** Ensure that the client-side code correctly handles `quota-exceeded` errors and does not attempt to bypass rate limits.

## Mocking for Development

-   **Use Mock Functions:** During development, use the `mockIdentifySpecies` function to test the UI without making actual API calls. This saves your API quota and allows for offline development.
-f   **Environment-Based Switching:** Use an environment variable (e.g., `USE_MOCK_API`) to easily switch between the real and mock services.

```typescript
// Example of switching between real and mock services

import { identifySpecies, mockIdentifySpecies } from "./identificationService";

const isDevelopment = process.env.NODE_ENV === "development";

const identificationFunction = isDevelopment ? mockIdentifySpecies : identifySpecies;

// Later in your code...
const result = await identificationFunction(imageBase64);
```

