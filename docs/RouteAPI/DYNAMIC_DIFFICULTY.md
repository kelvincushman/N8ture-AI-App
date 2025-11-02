# Dynamic Difficulty Integration

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

A core feature of the N8ture Route API is its deep integration with the **Dynamic Difficulty System**. This system provides real-time, context-aware difficulty ratings for trails, a significant advancement over the static ratings found in other apps.

## How It Works

When a user requests trail details via `getTrailDetails`, the following happens on the backend:

1.  **Fetch Base Trail Data:** The system retrieves the trail's static information (length, elevation, base difficulty) from the database.
2.  **Fetch Real-Time Weather:** It calls the internal Weather Service to get the current weather conditions for the trail's specific location.
3.  **Calculate Dynamic Difficulty:** The Dynamic Difficulty engine processes this data, applying a series of modifiers:
    -   **Weather Modifiers:** Rain, wind, temperature, and visibility all adjust the difficulty.
    -   **Trail Condition Modifiers:** Recent rainfall, for example, might make a trail muddier and more difficult.
    -   **Time of Day Modifiers:** Hiking at night is inherently more difficult.
4.  **Generate Warnings:** The system also generates contextual warnings, such as "High heat warning" or "Risk of thunderstorms."
5.  **Assemble Response:** The final `TrailDetails` object is assembled, including both the base difficulty and the current dynamic difficulty, and sent to the client.

## The `DynamicDifficulty` Object

This object is the heart of the system and is included in the `TrailDetails` response.

| Field | Type | Description |
| :--- | :--- | :--- |
| `currentValue` | `number` | The final, real-time difficulty score (1-10). **This is the value to display prominently to the user.** |
| `baseValue` | `number` | The static base difficulty. Useful for showing the change (e.g., "Was 5.5, now 7.5 due to rain"). |
| `weatherModifier` | `number` | The multiplier applied for weather. `1.0` is neutral. `>1.0` means weather is making it harder. |
| `warnings` | `string[]` | An array of human-readable warnings to display to the user. |

**Example:**

```json
"dynamicDifficulty": {
  "currentValue": 7.8,
  "baseValue": 6.0,
  "weatherModifier": 1.3,
  "warnings": [
    "Moderate rain - trail will be slippery",
    "Strong winds on exposed sections"
  ]
}
```

## Client-Side Implementation

-   **Display `currentValue`:** This is the most important piece of information. It should be clearly visible on the trail details screen.
-   **Show the Change:** Consider showing the `baseValue` as well to highlight the impact of current conditions (e.g., using an arrow icon).
-   **Display Warnings:** All warnings should be displayed prominently to the user to ensure their safety.
-   **Use in Search:** The `searchTrails` endpoint allows filtering by `maxDifficulty`, which uses the `currentValue` to ensure users are only shown trails that are currently within their desired difficulty range.

For a complete technical breakdown of the Dynamic Difficulty System, see the main documentation in `/docs/TRAIL_WEATHER_SYSTEM_INDEX.md`.

