# AI Model

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

The N8ture Identification API leverages a powerful, fine-tuned version of Google's Gemini model to provide accurate species identification. This document provides an overview of the model, its capabilities, and the process used to generate results.

## Model Overview

-   **Base Model:** Google Gemini
-   **Fine-Tuning:** The base model has been fine-tuned on a massive, proprietary dataset of labeled species images, including plants, animals, fungi, and insects.
-   **Specialization:** The model is specifically optimized for identifying species in natural environments and from user-submitted photos, which may have varying quality and lighting.

## Identification Process

When an image is submitted to the `identifySpecies` endpoint, it goes through the following process:

1.  **Image Pre-processing:** The image is resized, normalized, and checked for quality. Low-quality or empty images are rejected.
2.  **Feature Extraction:** The AI model analyzes the image to extract key visual features.
3.  **Classification:** The model compares these features against its trained knowledge base to find the most likely species matches.
4.  **Confidence Scoring:** Each potential match is assigned a confidence score (0-100) representing the model's certainty in the identification.
5.  **Information Retrieval:** The top-scoring species is selected, and its detailed information is retrieved from the N8ture database.
6.  **Alternative Generation:** The model also provides a list of similar-looking species to help the user confirm the identification.
7.  **Response Generation:** The final result, including the primary identification, confidence score, and alternatives, is formatted and returned to the user.

## Confidence Scores

The confidence score is a key part of the identification result. It is important to interpret it correctly:

-   **High Confidence (90-100%):** The model is very certain about the identification. The result is highly likely to be correct.
-   **Medium Confidence (70-89%):** The model is reasonably sure, but there may be similar-looking species. Users should check the alternative suggestions.
-   **Low Confidence (<70%):** The model is uncertain. The image may be of poor quality, or the species may be rare or difficult to identify. The result should be treated as a suggestion.

**Important:** The confidence score is not a guarantee of accuracy. Users should always exercise caution, especially when identifying species for edibility.

## Continuous Learning

The AI model is continuously improved through a feedback loop:

1.  **User Feedback:** Users can confirm or correct identifications within the app.
2.  **Data Collection:** This feedback is collected and used to create new training data.
3.  **Model Retraining:** The model is periodically retrained on the updated dataset to improve its accuracy and expand its knowledge of species.

This self-learning cycle ensures that the N8ture Identification API becomes more accurate and reliable over time.

