# Data Models

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document describes the data structures for the N8ture Route API.

---

## Core Models

### `TrailSummary`

A lightweight summary of a trail, used in search results.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique trail identifier. |
| `name` | `string` | The name of the trail. |
| `length` | `number` | The total length of the trail in kilometers. |
| `elevationGain` | `number` | The total elevation gain in meters. |
| `estimatedTime` | `number` | Estimated time to complete in minutes. |
| `thumbnailUrl` | `string` | URL for a thumbnail image of the trail. |
| `baseDifficulty` | `number` | The static base difficulty score (1-10). |
| `currentDifficulty` | `number` | The real-time dynamic difficulty score (1-10). |

### `TrailDetails`

Comprehensive information for a single trail.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique trail identifier. |
| `name` | `string` | The name of the trail. |
| `description` | `string` | A detailed description of the trail. |
| `length` | `number` | Length in kilometers. |
| `elevationGain` | `number` | Elevation gain in meters. |
| `route` | `GeoJSON` | A GeoJSON LineString representing the trail path. |
| `pointsOfInterest` | `POI[]` | An array of points of interest along the trail. |
| `dynamicDifficulty` | `DynamicDifficulty` | The real-time difficulty object. |
| `weather` | `Weather` | The current weather conditions for the trail. |

### `Journey`

Represents a user's live or completed hike.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique journey identifier. |
| `userId` | `string` | The ID of the user. |
| `trailId` | `string` | The ID of the hiked trail. |
| `status` | `string` | `active`, `paused`, or `completed`. |
| `startTime` | `number` | Unix timestamp of the journey start. |
| `endTime` | `number` | Unix timestamp of the journey end. |
| `path` | `GeoJSON` | A LineString of the user's recorded path. |
| `distance` | `number` | The total distance covered in kilometers. |
| `elapsedTime` | `number` | The total time elapsed in seconds. |

### `DynamicDifficulty`

Contains the real-time difficulty assessment for a trail.

| Field | Type | Description |
| :--- | :--- | :--- |
| `currentValue` | `number` | The final, real-time difficulty score (1-10). |
| `baseValue` | `number` | The static base difficulty score. |
| `weatherModifier` | `number` | The multiplier applied for weather conditions. |
| `conditionModifier` | `number` | The multiplier applied for trail conditions. |
| `warnings` | `string[]` | A list of warnings (e.g., "High heat," "Slippery trail"). |

### `Weather`

Represents the current weather for a trail.

| Field | Type | Description |
| :--- | :--- | :--- |
| `summary` | `string` | A short summary (e.g., "Sunny," "Light Rain"). |
| `temperature` | `number` | The current temperature in Celsius. |
| `windSpeed` | `number` | The current wind speed in km/h. |
| `precipitation` | `number` | The precipitation intensity in mm/hour. |

