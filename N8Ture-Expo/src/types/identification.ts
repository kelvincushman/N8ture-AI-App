/**
 * Identification Type Definitions
 *
 * Data structures for species identifications, history records,
 * and GPS-tagged photo storage for N8ture AI App.
 */

/**
 * Category of identified species
 */
export type SpeciesCategory = 'plant' | 'wildlife' | 'fungi' | 'insect';

/**
 * Safety level indicator
 */
export type SafetyLevel = 'safe' | 'caution' | 'dangerous' | 'unknown';

/**
 * Type of identification (camera photo or audio recording)
 */
export type IdentificationType = 'camera' | 'audio';

/**
 * Complete identification record stored in history
 * Includes photo URI and GPS coordinates from when photo was taken
 */
export interface IdentificationRecord {
  /** Unique identifier */
  id: string;

  /** Species reference ID */
  speciesId: string;

  /** Species common name */
  commonName: string;

  /** Species scientific name */
  scientificName: string;

  /** Species family (e.g., "Rosaceae") */
  family?: string;

  /** Category of species */
  category: SpeciesCategory;

  /** Safety indicator */
  safetyLevel: SafetyLevel;

  /** Local file path to saved photo */
  imageUri: string;

  /** Local file path to thumbnail (for grid display) */
  thumbnailUri?: string;

  /** Confidence score (0.0 to 1.0) */
  confidence: number;

  /** GPS latitude (captured when photo was taken) */
  latitude?: number;

  /** GPS longitude (captured when photo was taken) */
  longitude?: number;

  /** GPS accuracy in meters */
  accuracy?: number;

  /** Timestamp when identification was made */
  timestamp: number;

  /** Whether user was premium at time of identification */
  isPremium: boolean;

  /** User-added notes */
  notes?: string;

  /** Type of identification */
  type: IdentificationType;
}

/**
 * Detailed species information
 * Used for Species Detail Screen with carousel and tabs
 */
export interface SpeciesData {
  /** Unique species identifier */
  id: string;

  /** Common name */
  commonName: string;

  /** Scientific name */
  scientificName: string;

  /** Family (e.g., "Asteraceae") */
  family?: string;

  /** Category */
  category: SpeciesCategory;

  /** Safety level */
  safetyLevel: SafetyLevel;

  /** Basic description (100 words for free, 500+ for premium) */
  description: string;

  /** Multiple image URLs for carousel */
  imageUrls: string[];

  /** Detailed premium information */
  detailedInfo?: SpeciesDetailedInfo;

  /** Confidence score from AI identification */
  confidence?: number;

  /** Alternative species (similar look-alikes) */
  alternativeSpecies?: AlternativeSpecies[];
}

/**
 * Detailed species information (premium content)
 */
export interface SpeciesDetailedInfo {
  /** Habitat description */
  habitat?: string;

  /** Seasonal availability */
  season?: string;

  /** Geographic range */
  range?: string;

  /** Edibility information */
  edibility?: string;

  /** Medicinal/herbal uses */
  medicinal?: string;

  /** Cooking/preparation methods */
  preparation?: string;

  /** Conservation status (e.g., "Least Concern", "Endangered") */
  conservation?: string;

  /** Fun facts */
  funFacts?: string;

  /** Key identification features */
  identificationTips?: string;

  /** Audio URLs (for bird calls, animal sounds) */
  audioUrls?: string[];
}

/**
 * Alternative/similar species information
 */
export interface AlternativeSpecies {
  /** Species ID */
  id: string;

  /** Common name */
  commonName: string;

  /** Scientific name */
  scientificName: string;

  /** Thumbnail image URL */
  imageUrl: string;

  /** Confidence score */
  confidence: number;

  /** Key differences from primary identification */
  differences?: string;
}

/**
 * Result from Gemini AI identification
 */
export interface IdentificationResult {
  /** Primary identified species */
  species: SpeciesData;

  /** Confidence score (0.0 to 1.0) */
  confidence: number;

  /** Alternative matches */
  alternatives?: AlternativeSpecies[];

  /** Processing time in milliseconds */
  processingTime?: number;

  /** Any warnings or errors */
  warnings?: string[];
}

/**
 * Request to save identification to history
 */
export interface SaveIdentificationRequest {
  /** Species data from AI */
  species: SpeciesData;

  /** Original photo URI */
  imageUri: string;

  /** Confidence score */
  confidence: number;

  /** GPS latitude (from photo capture) */
  latitude?: number;

  /** GPS longitude (from photo capture) */
  longitude?: number;

  /** GPS accuracy in meters */
  accuracy?: number;

  /** Whether user is premium */
  isPremium: boolean;

  /** Optional user notes */
  notes?: string;

  /** Type of identification */
  type?: IdentificationType;
}

/**
 * Statistics for user's identification history
 */
export interface IdentificationStats {
  /** Total number of identifications */
  total: number;

  /** Number of plant identifications */
  plants: number;

  /** Number of wildlife identifications */
  wildlife: number;

  /** Number of fungi identifications */
  fungi: number;

  /** Number of insect identifications */
  insects: number;

  /** Most identified species */
  topSpecies?: {
    commonName: string;
    count: number;
  };

  /** Date of first identification */
  firstIdentification?: number;

  /** Date of most recent identification */
  lastIdentification?: number;
}
