/**
 * Species Identification Service
 *
 * Handles communication with Firebase Cloud Functions for AI-powered species identification
 */

import { callFunction, isFirebaseInitialized } from './firebase';
import {
  SpeciesIdentification,
  IdentificationRequest,
  IdentificationResponse,
  SpeciesCategory,
} from '../types/species';

/**
 * Identify a species from an image
 *
 * @param imageBase64 - Base64 encoded image data (without data:image prefix)
 * @param category - Optional species category hint (plant, animal, fungi, insect)
 * @returns Species identification result
 */
export async function identifySpecies(
  imageBase64: string,
  category?: SpeciesCategory
): Promise<SpeciesIdentification> {
  // Check if Firebase is initialized
  if (!isFirebaseInitialized()) {
    throw new Error(
      'Firebase is not initialized. Please check your Firebase configuration.'
    );
  }

  // Validate input
  if (!imageBase64 || imageBase64.trim().length === 0) {
    throw new Error('Image data is required');
  }

  try {
    // Prepare request
    const request: IdentificationRequest = {
      imageBase64: imageBase64.trim(),
      category,
    };

    // Call Firebase Cloud Function
    const response = await callFunction<IdentificationRequest, IdentificationResponse>(
      'identifySpecies',
      request
    );

    // Check response
    if (!response.success || !response.data) {
      throw new Error(response.error || response.message || 'Identification failed');
    }

    // Add timestamp and return
    const identification: SpeciesIdentification = {
      ...response.data,
      identifiedAt: response.data.identifiedAt || new Date().toISOString(),
    };

    return identification;
  } catch (error: any) {
    console.error('Error in identifySpecies:', error);

    // Map common errors to user-friendly messages
    if (error.message.includes('unauthenticated')) {
      throw new Error('Please sign in to use species identification.');
    } else if (error.message.includes('permission-denied')) {
      throw new Error('You do not have permission to use this feature.');
    } else if (error.message.includes('quota') || error.message.includes('exhausted')) {
      throw new Error(
        'API quota exceeded. Please upgrade to Premium for unlimited identifications.'
      );
    } else if (error.message.includes('timeout') || error.message.includes('deadline')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    } else if (error.message.includes('network') || error.message.includes('connection')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    // Rethrow original error if not handled
    throw error;
  }
}

/**
 * Mock identification for testing (when Firebase is not configured)
 * This can be used during development before Firebase is set up
 */
export async function mockIdentifySpecies(
  imageBase64: string,
  category?: SpeciesCategory
): Promise<SpeciesIdentification> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock data
  const mockData: SpeciesIdentification = {
    commonName: 'Red Fox',
    scientificName: 'Vulpes vulpes',
    confidence: 87,
    category: category || 'animal',
    description:
      'The red fox is the largest of the true foxes and one of the most widely distributed members of the order Carnivora. It has a distinctive reddish-brown coat, bushy tail with a white tip, and black legs and ears.',
    habitat:
      'Found in diverse habitats including forests, grasslands, mountains, and deserts. Highly adaptable to human presence and often found in suburban and urban areas.',
    edibility: 'UNKNOWN',
    edibilityNotes: 'Not typically consumed; wild game in some regions.',
    identificationFeatures: [
      'Reddish-brown fur coat',
      'Bushy tail with white tip',
      'Black legs and ears',
      'Pointed snout and erect triangular ears',
      'Horizontal pupils',
    ],
    similarSpecies: ['Swift Fox', 'Kit Fox', 'Gray Fox', 'Coyote'],
    conservationStatus: 'Least Concern',
    seasonality: 'Active year-round, most visible at dawn and dusk',
    identifiedAt: new Date().toISOString(),
  };

  return mockData;
}

/**
 * Get identification by ID (for history)
 * This would typically fetch from a database
 */
export async function getIdentificationById(
  id: string
): Promise<SpeciesIdentification | null> {
  // TODO: Implement database retrieval
  console.log('getIdentificationById not yet implemented:', id);
  return null;
}

/**
 * Save identification to history
 * This would typically save to a database
 */
export async function saveIdentification(
  identification: SpeciesIdentification,
  imageUri: string
): Promise<boolean> {
  // TODO: Implement database storage
  console.log('saveIdentification not yet implemented:', identification, imageUri);
  return true;
}

/**
 * Get user's identification history
 * This would typically fetch from a database
 */
export async function getUserHistory(
  userId: string,
  limit: number = 50
): Promise<SpeciesIdentification[]> {
  // TODO: Implement database retrieval
  console.log('getUserHistory not yet implemented:', userId, limit);
  return [];
}
