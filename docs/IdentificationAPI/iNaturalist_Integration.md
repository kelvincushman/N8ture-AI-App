# iNaturalist API Integration Guide

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

This guide provides instructions for integrating the **iNaturalist API** as a supplementary data source for the N8ture app. iNaturalist is a vast, community-driven database of species observations that can enrich the data provided by our primary identification engines.

### Why iNaturalist?

-   **Massive Dataset:** Millions of observations of plants, animals, and fungi from around the world.
-   **Community-Verified Data:** Observations are verified by a community of experts and enthusiasts, leading to high-quality data.
-   **Rich Supplementary Information:** Provides valuable data such as distribution maps, seasonality, and user-submitted photos.
-   **Free to Use:** The API is free, with generous rate limits for application development.

**Important Note:** The iNaturalist API should **NOT** be used for primary identification. It is best used to **supplement** the results from Gemini, PlantNet, and Insect.ID.

---

## API Usage and Rate Limits

-   **Cost:** Free
-   **Rate Limit:** ~1 request per second (10,000 requests per day).
-   **Authentication:** Not required for read-only access to public data.

---

## Integration Strategy: Data Enrichment

After an identification is made by one of the primary APIs, use the iNaturalist API to fetch additional information about the identified species.

### 1. Search for the Species Taxon

Use the `GET /v1/taxa` endpoint to find the iNaturalist taxon ID for the identified species.

```typescript
async function findInaturalistTaxon(scientificName: string) {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.results && json.results.length > 0) {
      return json.results[0]; // Return the first matching taxon
    }
    return null;

  } catch (error) {
    console.error("Error fetching iNaturalist taxon:", error);
    return null;
  }
}
```

### 2. Fetch Observation Data

Once you have the taxon ID, you can use other endpoints to get more data:

-   **Observations:** `GET /v1/observations?taxon_id={id}` to get recent observation locations.
-   **Taxon Details:** `GET /v1/taxa/{id}` to get detailed information, including conservation status and links to Wikipedia.

### 3. Integrate into the `identifySpecies` Workflow

After a successful identification, make a non-blocking call to a new function, `enrichWithInaturalist`, to add more data to the result.

```typescript
async function enrichWithInaturalist(identification: SpeciesIdentification): Promise<SpeciesIdentification> {
  const taxon = await findInaturalistTaxon(identification.scientificName);

  if (taxon) {
    // Add iNaturalist data to the identification object
    identification.inaturalistData = {
      taxonId: taxon.id,
      wikipediaUrl: taxon.wikipedia_url,
      // ... add other relevant fields
    };
  }

  return identification;
}

// In identifySpecies function, after getting a result:
const finalResult = await enrichWithInaturalist(primaryResult);
return finalResult;
```

---

## Use Cases for N8ture

-   **Distribution Maps:** Use observation data to show users where a species has been recently spotted.
-   **Seasonality Charts:** Show when a species is most commonly observed throughout the year.
-   **Additional Photos:** Display community-submitted photos to help with visual confirmation.
-   **Conservation Information:** Supplement the conservation status data from other APIs.

---

## Best Practices

-   **Respect Rate Limits:** Do not exceed the 1 request per second limit. Implement a queue or rate-limiting mechanism if necessary.
-   **Use for Enrichment Only:** Do not use iNaturalist for the initial identification. It is a data source, not an identification engine in the same way as the other APIs.
-   **Cache Results:** Cache iNaturalist taxon data to avoid repeated lookups for the same species.
-   **Provide Attribution:** As a member of the iNaturalist Network, it is good practice to attribute iNaturalist as a data source in your app.

