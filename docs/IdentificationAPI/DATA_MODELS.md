# Data Models

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document describes the data structures used in the N8ture Identification API. These models are defined in `src/types/identification.ts` and `src/types/species.ts`.

---

## Core Models

### `SpeciesIdentification`

This is the main object returned by the `identifySpecies` endpoint. It contains all the information about an identified species.

| Field | Type | Description |
| :--- | :--- | :--- |
| `commonName` | `string` | The common name of the species (e.g., "Red Fox"). |
| `scientificName` | `string` | The scientific name (e.g., "Vulpes vulpes"). |
| `confidence` | `number` | The AI model's confidence in the identification (0-100). |
| `category` | `SpeciesCategory` | The category of the species. |
| `description` | `string` | A detailed description of the species. |
| `habitat` | `string` | Information about the species' natural habitat. |
| `edibility` | `Edibility` | The edibility status of the species. |
| `edibilityNotes` | `string` | Additional notes on edibility. |
| `identificationFeatures` | `string[]` | A list of key features to help identify the species. |
| `similarSpecies` | `string[]` | A list of species that look similar. |
| `conservationStatus` | `string` | The conservation status (e.g., "Least Concern"). |
| `seasonality` | `string` | Information on when the species is active or can be found. |
| `identifiedAt` | `string` | ISO 8601 timestamp of when the identification was made. |

### `IdentificationRecord`

This object represents a single entry in the user's identification history.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID for the history record. |
| `speciesId` | `string` | Reference to the identified species. |
| `commonName` | `string` | The common name of the species. |
| `scientificName` | `string` | The scientific name of the species. |
| `category` | `SpeciesCategory` | The category of the species. |
| `imageUri` | `string` | The local file URI of the saved photo. |
| `confidence` | `number` | The confidence score of the identification. |
| `latitude` | `number` | GPS latitude where the photo was taken. |
| `longitude` | `number` | GPS longitude where the photo was taken. |
| `timestamp` | `number` | Unix timestamp of when the identification was made. |
| `notes` | `string` | User-added notes for this identification. |

---

## Enumerations

### `SpeciesCategory`

Defines the possible categories for a species.

| Value | Description |
| :--- | :--- |
| `plant` | A plant, tree, or flower. |
| `animal` | A mammal, reptile, amphibian, or bird. |
| `fungi` | A mushroom or other type of fungus. |
| `insect` | An insect, arachnid, or other arthropod. |

### `Edibility`

Defines the edibility status of a species.

| Value | Description |
| :--- | :--- |
| `EDIBLE` | The species is safe to eat. |
| `INEDIBLE` | The species is not safe to eat. |
| `POISONOUS` | The species is toxic and should not be consumed. |
| `CAUTION` | Edible with caution or special preparation. |
| `UNKNOWN` | The edibility is not known. |

---

## Request/Response Models

### `IdentificationRequest`

The request body for the `identifySpecies` endpoint.

| Field | Type | Description |
| :--- | :--- | :--- |
| `imageBase64` | `string` | Base64-encoded image data. |
| `category` | `SpeciesCategory` | Optional category hint. |

### `IdentificationResponse`

The response body from the `identifySpecies` endpoint.

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Indicates if the request was successful. |
| `data` | `SpeciesIdentification` | The identification result (on success). |
| `error` | `string` | An error code (on failure). |
| `message` | `string` | A user-friendly error message (on failure). |

