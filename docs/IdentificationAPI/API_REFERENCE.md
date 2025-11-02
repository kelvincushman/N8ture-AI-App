# API Reference

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document provides a detailed reference for all endpoints available in the N8ture Identification API. The API is built on Firebase Cloud Functions and is designed for internal use by the N8ture mobile app.

## Base URL

All API endpoints are Firebase Cloud Functions. The base URL depends on your Firebase project configuration. The `callFunction` helper in `firebase.ts` abstracts this away.

---

## Authentication

All endpoints require a valid Firebase ID token passed in the `Authorization` header.

`Authorization: Bearer <FIREBASE_ID_TOKEN>`

The `callFunction` helper automatically includes this header for authenticated users.

---

## Endpoints

### 1. `identifySpecies`

Identifies a species from a given image.

-   **Function Name:** `identifySpecies`
-   **Method:** `POST`
-   **Description:** Submits a Base64-encoded image for AI-powered identification. Returns detailed information about the most likely species and potential alternatives.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `imageBase64` | `string` | Yes | Base64-encoded image data (without data URI prefix). |
| `category` | `string` | No | Optional hint for the species category. Can be `plant`, `animal`, `fungi`, or `insect`. |

**Example Request:**

```json
{
  "imageBase64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA...",
  "category": "plant"
}
```

#### Response Body (Success)

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `true` on success. |
| `data` | `SpeciesIdentification` | The detailed identification result. See [Data Models](./DATA_MODELS.md) for structure. |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "commonName": "Dandelion",
    "scientificName": "Taraxacum officinale",
    "confidence": 92.5,
    "category": "plant",
    "description": "A common flowering plant known for its bright yellow flowers and fluffy seed heads.",
    "habitat": "Lawns, gardens, and roadsides.",
    "edibility": "EDIBLE",
    // ... other fields
  }
}
```

#### Response Body (Error)

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `false` on error. |
| `error` | `string` | A short error code (e.g., `quota-exceeded`). |
| `message` | `string` | A user-friendly error message. |

**Example Error Response:**

```json
{
  "success": false,
  "error": "quota-exceeded",
  "message": "API quota exceeded. Please upgrade to Premium for unlimited identifications."
}
```

---

### 2. `getIdentificationHistory`

Retrieves a list of the user's past identifications.

-   **Function Name:** `getIdentificationHistory`
-   **Method:** `POST`
-   **Description:** Fetches a paginated list of the user's saved identifications from the database.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | The authenticated user's Firebase UID. |
| `limit` | `number` | No | The number of records to return. Defaults to `50`. |
| `offset` | `number` | No | The number of records to skip (for pagination). Defaults to `0`. |

**Example Request:**

```json
{
  "userId": "some-firebase-uid",
  "limit": 20,
  "offset": 0
}
```

#### Response Body (Success)

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `true` on success. |
| `data` | `IdentificationRecord[]` | An array of identification history records. See [Data Models](./DATA_MODELS.md). |

---

### 3. `saveIdentification`

Saves a new identification result to the user's history.

-   **Function Name:** `saveIdentification`
-   **Method:** `POST`
-   **Description:** Stores a completed identification in the user's database history. This is called after a successful `identifySpecies` call.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `identification` | `SpeciesIdentification` | Yes | The full identification object to save. |
| `imageUri` | `string` | Yes | The local file URI of the image that was identified. |

**Example Request:**

```json
{
  "identification": {
    "commonName": "Dandelion",
    "scientificName": "Taraxacum officinale",
    // ... other fields
  },
  "imageUri": "file:///path/to/image.jpg"
}
```

#### Response Body (Success)

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `true` on success. |
| `recordId` | `string` | The unique ID of the newly created history record. |

---

## Mock Endpoints

For development and testing when Firebase is not available, the `identificationService.ts` provides mock functions that simulate the API responses.

-   `mockIdentifySpecies()`: Simulates a successful identification.
-   These functions are for **testing only** and should not be used in production builds.

