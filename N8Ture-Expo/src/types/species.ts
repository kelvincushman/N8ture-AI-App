/**
 * Species identification type definitions for N8ture AI app
 */

export type EdibilityStatus = 'SAFE' | 'CAUTION' | 'DANGEROUS' | 'UNKNOWN';
export type SpeciesCategory = 'plant' | 'animal' | 'fungi' | 'insect' | 'unknown';
export type ConservationStatus =
  | 'Least Concern'
  | 'Near Threatened'
  | 'Vulnerable'
  | 'Endangered'
  | 'Critically Endangered'
  | 'Extinct in the Wild'
  | 'Extinct'
  | 'Data Deficient'
  | 'Not Evaluated';

/**
 * Main species identification result from Gemini API
 */
export interface SpeciesIdentification {
  // Core identification
  commonName: string;
  scientificName: string;
  confidence: number; // 0-100
  category: SpeciesCategory;

  // Descriptive information
  description: string;
  habitat: string;

  // Safety and edibility
  edibility: EdibilityStatus;
  edibilityNotes?: string;
  toxicityWarning?: string;

  // Identification features
  identificationFeatures: string[];
  similarSpecies: string[];

  // Additional metadata
  conservationStatus?: ConservationStatus;
  seasonality?: string;

  // App metadata
  imageUri?: string;
  identifiedAt: string; // ISO date string
  id?: string; // For storage/history
}

/**
 * API request payload for identification
 */
export interface IdentificationRequest {
  imageBase64: string;
  category?: SpeciesCategory;
}

/**
 * API response from Firebase Cloud Function
 */
export interface IdentificationResponse {
  success: boolean;
  data?: SpeciesIdentification;
  error?: string;
  message?: string;
}

/**
 * Confidence level helper
 */
export const getConfidenceLevel = (confidence: number): {
  level: 'high' | 'medium' | 'low';
  color: string;
  label: string;
} => {
  if (confidence >= 80) {
    return {
      level: 'high',
      color: '#8FAF87', // theme.colors.success
      label: 'High Confidence',
    };
  } else if (confidence >= 50) {
    return {
      level: 'medium',
      color: '#D4A574', // theme.colors.warning
      label: 'Medium Confidence',
    };
  } else {
    return {
      level: 'low',
      color: '#A85C5C', // theme.colors.error
      label: 'Low Confidence',
    };
  }
};

/**
 * Edibility status helper
 */
export const getEdibilityInfo = (status: EdibilityStatus): {
  color: string;
  icon: string;
  label: string;
} => {
  switch (status) {
    case 'SAFE':
      return {
        color: '#8FAF87',
        icon: '✓',
        label: 'Safe / Edible',
      };
    case 'CAUTION':
      return {
        color: '#D4A574',
        icon: '⚠',
        label: 'Caution Required',
      };
    case 'DANGEROUS':
      return {
        color: '#A85C5C',
        icon: '✕',
        label: 'Dangerous / Toxic',
      };
    case 'UNKNOWN':
    default:
      return {
        color: '#8C8871',
        icon: '?',
        label: 'Unknown',
      };
  }
};

/**
 * Category icon helper
 */
export const getCategoryIcon = (category: SpeciesCategory): string => {
  switch (category) {
    case 'plant':
      return '🌿';
    case 'animal':
      return '🦊';
    case 'fungi':
      return '🍄';
    case 'insect':
      return '🦋';
    default:
      return '❓';
  }
};
