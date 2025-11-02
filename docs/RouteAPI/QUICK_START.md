# Quick Start Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This guide provides a quick start for using the N8ture Route API within the mobile app. It covers how to search for trails and retrieve detailed trail information.

## Prerequisites

-   **Authenticated User:** The user must be signed in.
-   **Location Services:** The app must have permission to access the user's location for nearby searches.

---

## Step 1: Search for Trails

The first step is to find trails. The `searchTrails` endpoint allows you to search based on various criteria.

```typescript
import { searchTrails } from '../services/routeService';

async function findNearbyTrails() {
  try {
    const searchParams = {
      latitude: 51.5074, // User's current location
      longitude: -0.1278,
      radius: 50, // Search within a 50km radius
      minLength: 5, // Minimum trail length of 5km
      maxDifficulty: 8, // Max dynamic difficulty of 8/10
    };

    const trails = await searchTrails(searchParams);
    console.log(`Found ${trails.length} trails.`);
    return trails;

  } catch (error) {
    console.error('Failed to search for trails:', error.message);
  }
}
```

## Step 2: Get Detailed Trail Information

Once you have a trail ID from the search results, you can fetch its detailed information, including the real-time dynamic difficulty.

```typescript
import { getTrailDetails } from '../services/routeService';

async function getTrail(trailId: string) {
  try {
    const trail = await getTrailDetails(trailId);
    if (trail) {
      console.log(`Trail Name: ${trail.name}`);
      console.log(`Current Difficulty: ${trail.dynamicDifficulty.currentValue}`);
      console.log(`Weather: ${trail.weather.summary}`);
    }
    return trail;

  } catch (error) {
    console.error('Failed to get trail details:', error.message);
  }
}
```

## Full Example: Trail List Screen

Here is a conceptual example of a React Native screen that searches for and displays a list of nearby trails.

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { searchTrails } from '../services/routeService';
import { TrailSummary } from '../types/trail';

const TrailListScreen = () => {
  const [trails, setTrails] = useState<TrailSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTrails = async () => {
    setIsLoading(true);
    try {
      const results = await searchTrails({
        latitude: 51.5074,
        longitude: -0.1278,
        radius: 50,
      });
      setTrails(results);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrails();
  }, []);

  return (
    <View>
      {isLoading ? (
        <Text>Finding trails near you...</Text>
      ) : (
        <FlatList
          data={trails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>Length: {item.length} km</Text>
              <Text>Current Difficulty: {item.currentDifficulty.toFixed(1)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default TrailListScreen;
```

## Next Steps

-   **[API Reference](./API_REFERENCE.md):** For detailed endpoint information.
-   **[Data Models](./DATA_MODELS.md):** To understand the structure of the trail and route data.
-   **[Dynamic Difficulty](./DYNAMIC_DIFFICULTY.md):** To learn how real-time difficulty is calculated.

