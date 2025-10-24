/**
 * Gemini AI Service
 *
 * Handles species identification using Google Gemini Vision API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getGeminiApiKey, getConfig } = require('../config/secrets');

/**
 * Initialize Gemini AI client
 */
function initializeGemini() {
  const apiKey = getGeminiApiKey();
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Build identification prompt for Gemini
 */
function buildIdentificationPrompt(category) {
  const categoryHint = category ? ` (likely a ${category})` : '';

  return `You are an expert naturalist and species identification specialist. Analyze this image and identify the species shown${categoryHint}.

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any markdown, code blocks, or additional text.

Provide the following information in JSON format:
{
  "commonName": "Common name of the species",
  "scientificName": "Scientific name (Genus species)",
  "confidence": 85,
  "category": "plant|animal|fungi|insect",
  "description": "Detailed description of the species (2-3 sentences)",
  "habitat": "Natural habitat and distribution",
  "edibility": "SAFE|CAUTION|DANGEROUS|UNKNOWN",
  "edibilityNotes": "Notes about edibility, preparation, or toxicity",
  "toxicityWarning": "Only if DANGEROUS - specific warning about toxins",
  "identificationFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "similarSpecies": ["Similar species 1", "Similar species 2"],
  "conservationStatus": "IUCN status if known",
  "seasonality": "When this species is typically observed"
}

Guidelines:
- Be accurate and conservative with confidence scores
- For DANGEROUS species, provide clear toxicity warnings
- For edible species, include preparation notes
- List 3-5 key identification features
- Include 2-4 similar species for comparison
- If uncertain, set confidence below 50 and note limitations

Return ONLY the JSON object, no additional text.`;
}

/**
 * Parse Gemini response to extract JSON
 */
function parseGeminiResponse(responseText) {
  try {
    // Remove markdown code blocks if present
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/^```json?\s*/i, '');
    cleanText = cleanText.replace(/```\s*$/i, '');
    cleanText = cleanText.trim();

    // Parse JSON
    const data = JSON.parse(cleanText);

    // Validate required fields
    if (!data.commonName || !data.scientificName || data.confidence === undefined) {
      throw new Error('Missing required fields in response');
    }

    // Set defaults for optional fields
    return {
      commonName: data.commonName,
      scientificName: data.scientificName,
      confidence: Math.min(100, Math.max(0, data.confidence)),
      category: data.category || 'unknown',
      description: data.description || 'No description available.',
      habitat: data.habitat || 'Habitat information not available.',
      edibility: data.edibility || 'UNKNOWN',
      edibilityNotes: data.edibilityNotes || undefined,
      toxicityWarning: data.toxicityWarning || undefined,
      identificationFeatures: Array.isArray(data.identificationFeatures)
        ? data.identificationFeatures
        : [],
      similarSpecies: Array.isArray(data.similarSpecies)
        ? data.similarSpecies
        : [],
      conservationStatus: data.conservationStatus || undefined,
      seasonality: data.seasonality || undefined,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse identification results');
  }
}

/**
 * Identify species from base64 image using Gemini
 *
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} [category] - Optional category hint
 * @returns {Promise<Object>} Species identification data
 */
async function identifySpecies(imageBase64, category) {
  const config = getConfig();
  const genAI = initializeGemini();

  try {
    // Get generative model
    const model = genAI.getGenerativeModel({ model: config.gemini.model });

    // Build prompt
    const prompt = buildIdentificationPrompt(category);

    // Prepare image part
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    // Generate content
    console.log('Calling Gemini API for species identification...');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API response received');

    // Parse response
    const identificationData = parseGeminiResponse(text);

    return identificationData;
  } catch (error) {
    console.error('Error in Gemini species identification:', error);

    // Map Gemini API errors to user-friendly messages
    if (error.message?.includes('API key')) {
      throw new Error('API key configuration error');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Request timeout');
    }

    throw new Error('Species identification failed: ' + error.message);
  }
}

module.exports = {
  identifySpecies,
};
