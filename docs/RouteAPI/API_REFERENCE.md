# API Reference

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document provides a detailed reference for all endpoints in the N8ture Route API.

---

## Endpoints

### 1. `searchTrails`

Searches for trails based on specified criteria.

-   **Method:** `POST`
-   **Endpoint:** `/api/v1/trails/search`

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `latitude` | `number` | Yes | User's current latitude. |
| `longitude` | `number` | Yes | User's current longitude. |
| `radius` | `number` | No | Search radius in kilometers. Defaults to `25`. |
| `minLength` | `number` | No | Minimum trail length in kilometers. |
| `maxLength` | `number` | No | Maximum trail length in kilometers. |
| `minDifficulty` | `number` | No | Minimum **base** difficulty (1-10). |
| `maxDifficulty` | `number` | No | Maximum **current dynamic** difficulty (1-10). |
| `query` | `string` | No | A text query to search for trail names or locations. |

#### Response Body

An array of `TrailSummary` objects. See [Data Models](./DATA_MODELS.md).

---

### 2. `getTrailDetails`

Retrieves detailed information for a single trail, including real-time weather and dynamic difficulty.

-   **Method:** `GET`
-   **Endpoint:** `/api/v1/trails/{trailId}`

#### URL Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `trailId` | `string` | The unique identifier of the trail. |

#### Response Body

A single `TrailDetails` object. See [Data Models](./DATA_MODELS.md).

---

### 3. `startJourney`

Starts a new live journey tracking session for a user on a specific trail.

-   **Method:** `POST`
-   **Endpoint:** `/api/v1/journeys/start`

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `trailId` | `string` | Yes | The ID of the trail being hiked. |
| `userId` | `string` | Yes | The ID of the user starting the journey. |

#### Response Body

A `Journey` object with the `status` set to `active`. See [Data Models](./DATA_MODELS.md).

---

### 4. `updateJourney`

Updates the user's location and progress during an active journey.

-   **Method:** `POST`
-   **Endpoint:** `/api/v1/journeys/{journeyId}/update`

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `latitude` | `number` | Yes | The user's current latitude. |
| `longitude` | `number` | Yes | The user's current longitude. |
| `altitude` | `number` | No | The user's current altitude. |
| `timestamp` | `number` | Yes | The Unix timestamp of the location update. |

#### Response Body

The updated `Journey` object.

---

### 5. `endJourney`

Ends an active journey and saves the completed track.

-   **Method:** `POST`
-   **Endpoint:** `/api/v1/journeys/{journeyId}/end`

#### Response Body

The final `Journey` object with the `status` set to `completed`.

