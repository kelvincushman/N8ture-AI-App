# N8ture Identification API

**Version:** 1.0  
**Status:** Active  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Overview

The N8ture Identification API provides AI-powered species identification for plants, animals, fungi, and insects. It is a core component of the N8ture AI app, enabling users to identify species from images and receive detailed information.

This API is designed for use within the N8ture mobile app and is not intended for public consumption. It is a private API that requires authentication and is subject to rate limiting based on the user's subscription plan.

### Key Features

- **AI-Powered Identification:** Utilizes Google's Gemini AI model for accurate species identification.
- **Multi-Category Support:** Identifies plants, animals, fungi, and insects.
- **Detailed Information:** Provides rich information about identified species, including common and scientific names, description, habitat, edibility, and more.
- **Freemium Model:** Offers a limited number of free identifications before requiring a subscription.
- **History:** Saves user identifications to a personal history for later review.

---

## Getting Started

This API is intended for internal use by the N8ture mobile app. To use the API, you will need to:

1.  **Authenticate:** Obtain a Firebase authentication token for the user.
2.  **Call the API:** Make a POST request to the `identifySpecies` Firebase Cloud Function.

For a detailed guide on how to get started, please refer to the [Quick Start Guide](./QUICK_START.md).

---

## API Reference

For a complete reference of all API endpoints, request and response formats, and data models, please see the [API Reference](./API_REFERENCE.md).

---

## Data Models

For a detailed description of all data models used in the Identification API, please see the [Data Models](./DATA_MODELS.md) documentation.

---

## Error Handling

For a complete list of error codes and messages, please see the [Error Handling](./ERROR_HANDLING.md) guide.

---

## Freemium Model

The Identification API operates on a freemium model. Unauthenticated users or users on the free plan are limited to a certain number of identifications per day. To unlock unlimited identifications, users must upgrade to a premium subscription.

For more information on the freemium model and rate limiting, please see the [Freemium & Rate Limiting](./FREEMIUM.md) guide.

---

## AI Model

The Identification API uses Google's Gemini AI model for species identification. The model is trained on a massive dataset of images and can identify a wide variety of species with high accuracy.

For more information on the AI model and its capabilities, please see the [AI Model](./AI_MODEL.md) documentation.

---

## Best Practices

For a list of best practices for using the Identification API, please see the [Best Practices](./BEST_PRACTICES.md) guide.

